import React, { useState, useMemo } from 'react';
import {
  Layers,
  Sparkles,
  Search,
  BookOpen,
  ArrowRight,
  Info,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  Atom
} from 'lucide-react';
import { AppState, ChemicalElement } from '../types';
import { ELEMENTS } from '../data/elements';
import {
  calculateElectronConfig,
  calculateShellsFromSubshells,
  formatCondensedConfig,
  formatNobleGasConfig,
  determineIonAndValency,
  SubshellConfig
} from '../utils/atomicEngine';
import { playBubbleSound } from '../utils/audio';

interface ElectronConfigLabProps {
  state: AppState;
  onNavigateTab: (tab: AppState['activeTab']) => void;
  onSelectSubstanceForLab?: (symbol: string) => void;
}

export const ElectronConfigLab: React.FC<ElectronConfigLabProps> = ({
  state,
  onNavigateTab,
  onSelectSubstanceForLab
}) => {
  const { language } = state;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAtomicNumber, setSelectedAtomicNumber] = useState<number>(11); // Na default
  const [activeTabMode, setActiveTabMode] = useState<'boxes' | 'principles' | 'subshells'>('boxes');
  const [activeRange, setActiveRange] = useState<'1-20' | '21-40' | '41-70' | '71-118' | 'all'>('1-20');

  // Notable curriculum tags
  const ELEMENT_TAGS: Record<number, string> = {
    2: 'Duplet',
    7: 'Hund',
    10: 'Octet',
    18: 'Octet',
    19: '4s<3d',
    24: 'Exception',
    26: 'd-block',
    29: 'Exception',
    36: 'Octet',
    42: 'Exception',
    47: 'Exception',
    54: 'Octet',
    79: 'Exception',
    86: 'Octet',
    118: 'Noble Gas'
  };

  const displayedElements = useMemo(() => {
    let list = ELEMENTS;
    if (activeRange === '1-20') {
      return list.filter((el) => el.number >= 1 && el.number <= 20);
    } else if (activeRange === '21-40') {
      return list.filter((el) => el.number >= 21 && el.number <= 40);
    } else if (activeRange === '41-70') {
      return list.filter((el) => el.number >= 41 && el.number <= 70);
    } else if (activeRange === '71-118') {
      return list.filter((el) => el.number >= 71 && el.number <= 118);
    }
    return list;
  }, [activeRange]);

  // Find element
  const currentElement: ChemicalElement = useMemo(() => {
    return ELEMENTS.find((el) => el.number === selectedAtomicNumber) || ELEMENTS[10];
  }, [selectedAtomicNumber]);

  // Generate subshell configuration & boxes
  const subshells: SubshellConfig[] = useMemo(() => {
    return calculateElectronConfig(currentElement.number);
  }, [currentElement.number]);

  // Derived calculations
  const shells = useMemo(() => calculateShellsFromSubshells(subshells), [subshells]);
  const condensedConfig = useMemo(() => formatCondensedConfig(subshells), [subshells]);
  const nobleGasConfig = useMemo(() => formatNobleGasConfig(currentElement.number, subshells), [currentElement.number, subshells]);

  // Valence electrons (in highest principal quantum number n)
  const highestN = Math.max(...subshells.map((s) => s.n));
  const valenceElectrons = subshells
    .filter((s) => s.n === highestN)
    .reduce((sum, s) => sum + s.electrons, 0);

  const ionData = useMemo(() => {
    return determineIonAndValency(currentElement.number, shells, valenceElectrons);
  }, [currentElement.number, shells, valenceElectrons]);

  // Handle student search (by atomic number, symbol, name, or electron config snippet)
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim().toLowerCase();
    if (!q) return;

    // Check by number
    const num = parseInt(q, 10);
    if (!isNaN(num) && num >= 1 && num <= 118) {
      setSelectedAtomicNumber(num);
      playBubbleSound();
      return;
    }

    // Check by symbol or name
    const found = ELEMENTS.find(
      (el) =>
        el.symbol.toLowerCase() === q ||
        el.name.toLowerCase() === q ||
        el.nameBangla.toLowerCase().includes(q)
    );

    if (found) {
      setSelectedAtomicNumber(found.number);
      playBubbleSound();
    }
  };

  return (
    <div id="chemx-electron-config-lab" className="flex flex-col gap-5 pb-24">
      {/* Header Banner */}
      <div className="bg-slate-900/60 p-4 sm:p-5 rounded-3xl border border-slate-800 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span>{language === 'bn' ? 'ইলেকট্রন বিন্যাস ও অরবিটাল ল্যাব' : 'Electron Configuration & Orbital Lab'}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                CLASS 9
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              {language === 'bn'
                ? 'আউফবাউ নীতি, হুন্ডের নীতি, পাউলির বর্জন নীতি ও অরবিটাল বক্স চিত্রায়ন'
                : 'Aufbau principle, Hund\'s rule, Pauli exclusion & interactive orbital boxes'}
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTabMode('boxes')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTabMode === 'boxes'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {language === 'bn' ? 'অরবিটাল বক্স' : 'Orbital Boxes'}
          </button>
          <button
            onClick={() => setActiveTabMode('principles')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTabMode === 'principles'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {language === 'bn' ? '৩টি মূল নীতি' : '3 Principles'}
          </button>
          <button
            onClick={() => setActiveTabMode('subshells')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTabMode === 'subshells'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {language === 'bn' ? 's, p, d, f উপস্তর' : 's, p, d, f'}
          </button>
        </div>
      </div>

      {/* Generator Search Bar & Fast Element Selector */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-4 sm:p-5 backdrop-blur-md flex flex-col gap-3 shadow-md">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-2">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === 'bn'
                  ? 'পারমাণবিক সংখ্যা (১-১১৮), প্রতীক বা নাম লিখুন (e.g. 3, Li, 11, Na, 24, Cr)...'
                  : 'Enter atomic # (1-118), symbol, or name (e.g. 3, Li, 11, Na, 24, Cr)...'
              }
              className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl pl-9 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shrink-0 flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'বিন্যাস খুঁজুন' : 'Generate'}</span>
          </button>
        </form>

        {/* Range Selector & Dropdown Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-1">
          {/* Direct Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">
              {language === 'bn' ? 'মৌল ড্রপডাউন:' : 'Element Dropdown:'}
            </span>
            <select
              value={selectedAtomicNumber}
              onChange={(e) => {
                setSelectedAtomicNumber(parseInt(e.target.value, 10));
                playBubbleSound();
              }}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-indigo-300 focus:outline-none focus:border-indigo-500 w-full sm:w-64"
            >
              {ELEMENTS.map((el) => (
                <option key={el.number} value={el.number}>
                  #{el.number} {el.symbol} - {language === 'bn' ? `${el.nameBangla} (${el.name})` : `${el.name} (${el.nameBangla})`}
                </option>
              ))}
            </select>
          </div>

          {/* Range tabs */}
          <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-2xl border border-slate-800 text-[11px] overflow-x-auto no-scrollbar">
            {[
              { id: '1-20', labelBn: '১-২০ (মূল মৌল)', labelEn: '1-20 (Basic)' },
              { id: '21-40', labelBn: '২১-৪০', labelEn: '21-40' },
              { id: '41-70', labelBn: '৪১-৭০', labelEn: '41-70' },
              { id: '71-118', labelBn: '৭১-১১৮', labelEn: '71-118' },
              { id: 'all', labelBn: 'সকল ১-১১৮', labelEn: 'All 1-118' }
            ].map((range) => (
              <button
                key={range.id}
                onClick={() => {
                  setActiveRange(range.id as any);
                }}
                className={`px-2.5 py-1 rounded-xl font-bold whitespace-nowrap transition-all ${
                  activeRange === range.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {language === 'bn' ? range.labelBn : range.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Unbroken Sequential Element Chips (1 to 118) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar pt-1 border-t border-slate-800/60">
          {displayedElements.map((el) => {
            const isSelected = selectedAtomicNumber === el.number;
            const tag = ELEMENT_TAGS[el.number];
            return (
              <button
                key={el.number}
                id={`config-select-${el.number}`}
                onClick={() => {
                  setSelectedAtomicNumber(el.number);
                  playBubbleSound();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold shrink-0 transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/25 scale-105 border-transparent'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
                }`}
              >
                <span className="text-[10px] text-slate-400 font-normal">#{el.number}</span>
                <span className="text-xs font-black">{el.symbol}</span>
                {tag && (
                  <span className={`text-[9px] px-1 py-0.2 rounded font-sans ${
                    isSelected ? 'bg-indigo-900/80 text-indigo-100' : 'bg-indigo-950 text-indigo-300 border border-indigo-500/30'
                  }`}>
                    {tag}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Output Dashboard: Active Element Overview */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5 backdrop-blur-md flex flex-col gap-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center border font-mono font-black text-white shadow-lg"
              style={{
                backgroundColor: `${currentElement.colorHex}25`,
                borderColor: currentElement.colorHex
              }}
            >
              <span className="text-[10px] text-slate-300">#{currentElement.number}</span>
              <span className="text-xl leading-none text-indigo-300">{currentElement.symbol}</span>
            </div>

            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <span>{language === 'bn' ? currentElement.nameBangla : currentElement.name}</span>
                <span className="text-xs font-normal text-slate-400">({currentElement.name})</span>
              </h3>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <span>Group {currentElement.group}</span>
                <span>•</span>
                <span>Period {currentElement.period}</span>
                <span>•</span>
                <span className="px-1.5 py-0.2 rounded bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 font-bold">
                  {currentElement.block}-block
                </span>
              </div>
            </div>
          </div>

          {/* Likely Ion Formation Badge */}
          <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">
                {language === 'bn' ? 'সম্ভাব্য আয়ন / যোজনী' : 'Likely Ion / Valency'}
              </span>
              <span className="font-mono font-black text-sm text-cyan-300">
                {currentElement.symbol}{ionData.likelyIon !== 'None (Stable)' ? ionData.likelyIon.replace('Metal', '').replace('Nonmetal', '') : ''}
              </span>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">
                {language === 'bn' ? 'যোজ্যতা ইলেকট্রন' : 'Valence e⁻'}
              </span>
              <span className="font-mono font-black text-sm text-amber-400">
                {valenceElectrons}
              </span>
            </div>
          </div>
        </div>

        {/* Configurations Display Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Full Subshell Notation */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col gap-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">
              {language === 'bn' ? 'পূর্ণ উপশক্তিস্তরীয় ইলেকট্রন বিন্যাস (Full Subshell Configuration):' : 'Full Configuration:'}
            </span>
            <p className="font-mono text-sm sm:text-base font-bold text-indigo-300 break-words tracking-wide">
              {condensedConfig}
            </p>
          </div>

          {/* Bohr Shell Distribution & Noble Gas Core */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col gap-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">
              {language === 'bn' ? 'প্রধান শক্তিস্তর (K, L, M, N...) ও নিষ্ক্রিয় গ্যাস কোর:' : 'Bohr Shells & Noble Gas Core:'}
            </span>
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm font-bold text-cyan-400">
                {shells.join(', ')}
              </span>
              <span className="font-mono text-xs text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                {nobleGasConfig}
              </span>
            </div>
          </div>
        </div>

        {/* Special Ground-State Anomaly Highlight for Cr and Cu */}
        {(currentElement.number === 24 || currentElement.number === 29) && (
          <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 flex items-start gap-3 animate-fade-in">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                {language === 'bn'
                  ? `ব্যতিক্রমী ইলেকট্রন বিন্যাস (${currentElement.symbol} - পারমাণবিক সংখ্যা ${currentElement.number})`
                  : `Ground-State Exception (${currentElement.symbol} - Atomic #${currentElement.number})`}
              </h4>
              <p className="text-xs text-amber-200/90 font-bengali leading-relaxed mt-0.5">
                {currentElement.number === 24
                  ? 'ক্রোমিয়ামের (Cr) সাধারণ আউফবাউ নীতি অনুসারে 4s² 3d⁴ হওয়ার কথা ছিল। কিন্তু d-উপস্তর অর্ধপূর্ণ (3d⁵) অবস্থায় অধিক সুস্থিত হওয়ায় 4s থেকে ১টি ইলেকট্রন 3d-তে স্থানান্তরিত হয়ে [Ar] 4s¹ 3d⁵ বিন্যাস লাভ করে।'
                  : 'কপারের (Cu) সাধারণ আউফবাউ নীতি অনুসারে 4s² 3d⁹ হওয়ার কথা ছিল। কিন্তু d-উপস্তর সম্পূর্ণ পূর্ণ (3d¹⁰) অবস্থায় অতিরিক্ত প্রতিসাম্য ও সর্বোচ্চ স্থিতিশীলতা অর্জন করায় এর প্রকৃত বিন্যাস [Ar] 4s¹ 3d¹⁰ হয়।'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* MODE 1: INTERACTIVE ORBITAL BOXES (Aufbau + Hund's Rule + Pauli Exclusion) */}
      {activeTabMode === 'boxes' && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5 backdrop-blur-md flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>{language === 'bn' ? 'অরবিটাল বক্স চিত্রায়ন (Orbital Boxes & Electron Spins):' : 'Orbital Boxes & Electron Spins:'}</span>
            </h4>
            <span className="text-[11px] text-slate-400 font-mono">
              ↑ = +½ Spin | ↓ = -½ Spin
            </span>
          </div>

          {/* Subshell Orbital Boxes Ladder */}
          <div className="flex flex-wrap items-center gap-3">
            {subshells.map((sub) => {
              return (
                <div
                  key={sub.label}
                  className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col items-center gap-2 shadow-sm"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-black text-sm text-indigo-300">
                      {sub.label}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      ({sub.electrons}e⁻)
                    </span>
                  </div>

                  {/* Horizontal row of degenerate boxes */}
                  <div className="flex items-center gap-1">
                    {sub.orbitalBoxes.map((box) => (
                      <div
                        key={box.id}
                        className="w-10 h-12 rounded-xl bg-slate-900/90 border border-slate-700/80 flex items-center justify-center gap-1 shadow-inner relative group"
                        title={`${sub.label} (${box.name}): ${box.electrons.length} electrons`}
                      >
                        {box.electrons.map((spin, sIdx) => (
                          <span
                            key={sIdx}
                            className={`font-mono text-base font-black ${
                              spin === 'up' ? 'text-cyan-400' : 'text-rose-400'
                            }`}
                          >
                            {spin === 'up' ? '↑' : '↓'}
                          </span>
                        ))}

                        {box.electrons.length === 0 && (
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                        )}

                        {/* Hover tag showing orbital axis (px, py, pz, etc.) */}
                        <span className="absolute -bottom-3 text-[8px] font-mono text-slate-500 group-hover:text-indigo-400 transition-colors">
                          {box.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-2 p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-400 flex items-center gap-2">
            <Info className="w-4 h-4 text-cyan-400 shrink-0" />
            <p className="font-bengali leading-snug">
              {language === 'bn'
                ? 'হুন্ডের নীতি (Hund\'s Rule) অনুযায়ী সমশক্তি সম্পন্ন অরবিটালে প্রথমে একই স্পিনে (↑) ১টি করে ইলেকট্রন প্রবেশ করে, এরপর বিপরীত স্পিনে (↓) ইলেকট্রন জোড় গঠন (Pauli Exclusion) করে।'
                : 'According to Hund\'s rule, degenerate orbitals are first singly occupied with parallel spin (↑) before pairing up (↓).'}
            </p>
          </div>
        </div>
      )}

      {/* MODE 2: THE 3 FUNDAMENTAL CLASS 9 PRINCIPLES */}
      {activeTabMode === 'principles' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
          {/* Aufbau Principle */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5 flex flex-col gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
              ১
            </div>
            <h4 className="text-sm font-bold text-white">
              {language === 'bn' ? 'আউফবাউ নীতি (Aufbau Principle)' : 'Aufbau Principle'}
            </h4>
            <p className="text-xs text-slate-300 font-bengali leading-relaxed">
              {language === 'bn'
                ? 'জার্মান শব্দ "Aufbau" অর্থ "তৈরি করা" বা "Building up"। পরমাণুতে ইলেকট্রনসমূহ প্রথমে সর্বনিম্ন শক্তিস্তরে প্রবেশ করে এবং তা পূর্ণ হলে ক্রমান্বয়ে উচ্চ শক্তিস্তরে যায়। শক্তি নির্ণয় করা হয় (n + l) মানের সাহায্যে।'
                : 'Electrons first fill lower energy orbitals before occupying higher energy levels. Energy rank follows (n + l).'}
            </p>
            <div className="mt-auto p-2.5 rounded-xl bg-slate-950 font-mono text-xs text-cyan-300 border border-slate-800">
              1s &lt; 2s &lt; 2p &lt; 3s &lt; 3p &lt; 4s &lt; 3d &lt; 4p
            </div>
          </div>

          {/* Pauli Exclusion Principle */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5 flex flex-col gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
              ২
            </div>
            <h4 className="text-sm font-bold text-white">
              {language === 'bn' ? 'পাউলির বর্জন নীতি (Pauli Exclusion)' : 'Pauli Exclusion Principle'}
            </h4>
            <p className="text-xs text-slate-300 font-bengali leading-relaxed">
              {language === 'bn'
                ? '১৯২৫ সালে ভোলফগ্যাং পাউলি এই নীতি দেন: একই পরমাণুর যেকোনো দুটি ইলেকট্রনের ৪টি কোয়ান্টাম সংখ্যার মান কখনোই এক হতে পারে না। ফলে একটি অরবিটালে সর্বোচ্চ ২টি ইলেকট্রন বিপরীত স্পিনে (↑↓) থাকতে পারে।'
                : 'No two electrons in the same atom can share the identical four quantum numbers; a single orbital holds max 2 electrons with opposite spins (↑↓).'}
            </p>
            <div className="mt-auto p-2.5 rounded-xl bg-slate-950 font-mono text-xs text-indigo-300 border border-slate-800">
              Max 2e⁻ per orbital box (↑↓)
            </div>
          </div>

          {/* Hund's Rule */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5 flex flex-col gap-3">
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
              ৩
            </div>
            <h4 className="text-sm font-bold text-white">
              {language === 'bn' ? 'হুন্ডের নীতি (Hund\'s Rule)' : 'Hund\'s Rule of Maximum Multiplicity'}
            </h4>
            <p className="text-xs text-slate-300 font-bengali leading-relaxed">
              {language === 'bn'
                ? 'সমশক্তি সম্পন্ন বিভিন্ন অরবিটালে (যেমন: px, py, pz) ইলেকট্রনগুলো এমনভাবে প্রবেশ করে যেন তারা সর্বোচ্চ সংখ্যায় বিজোড় (unpaired) অবস্থায় থাকতে পারে এবং তাদের ঘূর্ণন স্পিন একমুখী (parallel) হয়।'
                : 'Degenerate orbitals fill singly with parallel spins before electrons begin pairing up to maximize spin stability.'}
            </p>
            <div className="mt-auto p-2.5 rounded-xl bg-slate-950 font-mono text-xs text-rose-300 border border-slate-800">
              [ ↑ ][ ↑ ][ ↑ ] then [ ↑↓ ][ ↑ ][ ↑ ]
            </div>
          </div>
        </div>
      )}

      {/* MODE 3: SUBSHELLS (s, p, d, f) & SHELL VS ORBITAL CLARIFICATION */}
      {activeTabMode === 'subshells' && (
        <div className="flex flex-col gap-4 animate-fade-in">
          {/* Crucial Pedagogical distinction between Shell, Subshell, and Orbital */}
          <div className="p-4 rounded-3xl bg-indigo-950/40 border border-indigo-500/30 text-indigo-200">
            <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>{language === 'bn' ? 'শক্তিস্তর (Shell) বনাম উপস্তর (Subshell) বনাম অরবিটাল (Orbital) এর স্পষ্ট পার্থক্য:' : 'Shell vs Subshell vs Orbital Distinction:'}</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
                <span className="font-bold text-cyan-400 block mb-1">কক্ষপথ / শক্তিস্তর (Shell)</span>
                <p className="text-slate-300 font-bengali">
                  বোর মডেলের বৃত্তাকার স্তর (K, L, M, N...)। প্রধান কোয়ান্টাম সংখ্যা n দ্বারা চিহ্নিত। ধারণক্ষমতা ২n²।
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
                <span className="font-bold text-indigo-400 block mb-1">উপশক্তিস্তর (Subshell)</span>
                <p className="text-slate-300 font-bengali">
                  শক্তিস্তরের অভ্যন্তরীণ উপবিভাগ (s, p, d, f)। সহকারী কোয়ান্টাম সংখ্যা l দ্বারা চিহ্নিত।
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
                <span className="font-bold text-rose-400 block mb-1">অরবিটাল (Orbital)</span>
                <p className="text-slate-300 font-bengali">
                  নিউক্লিয়াসের চারপাশে যে ত্রিমাত্রিক অঞ্চলে ইলেকট্রন পাওয়ার সম্ভাবনা ৯০-৯৫%, তাকে অরবিটাল বলে। এটি কোনো স্থির তারের বৃত্তাকার পথ নয়!
                </p>
              </div>
            </div>
          </div>

          {/* s, p, d, f Capacities Table */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { type: 's', l: 0, orbitals: 1, maxE: 2, shape: 'Spherical (গোলাকার)', color: 'border-cyan-500/40 text-cyan-300' },
              { type: 'p', l: 1, orbitals: 3, maxE: 6, shape: 'Dumbbell (ডাম্বেল আকার - px, py, pz)', color: 'border-indigo-500/40 text-indigo-300' },
              { type: 'd', l: 2, orbitals: 5, maxE: 10, shape: 'Double Dumbbell (ডাবল ডাম্বেল)', color: 'border-amber-500/40 text-amber-300' },
              { type: 'f', l: 3, orbitals: 7, maxE: 14, shape: 'Complex (জটিল ত্রিমাত্রিক)', color: 'border-rose-500/40 text-rose-300' }
            ].map((sub) => (
              <div
                key={sub.type}
                className={`p-4 rounded-3xl bg-slate-950/80 border ${sub.color} flex flex-col gap-2`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black font-mono">{sub.type}</span>
                  <span className="text-[10px] font-mono text-slate-400">l = {sub.l}</span>
                </div>
                <div className="text-xs text-slate-300 font-medium">
                  <div>{language === 'bn' ? `অরবিটাল সংখ্যা: ${sub.orbitals}` : `Orbitals: ${sub.orbitals}`}</div>
                  <div>{language === 'bn' ? `সর্বোচ্চ ইলেকট্রন: ${sub.maxE}e⁻` : `Max Electrons: ${sub.maxE}e⁻`}</div>
                </div>
                <p className="text-[11px] text-slate-400 font-bengali mt-1">
                  আকৃতি: {sub.shape}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
