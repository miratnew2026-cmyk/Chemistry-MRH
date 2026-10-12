import React, { useState, useMemo } from 'react';
import {
  Atom,
  ChevronRight,
  RotateCcw,
  Sparkles,
  Info,
  Scale,
  Zap,
  Plus,
  Minus,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Layers,
  Search
} from 'lucide-react';
import { AppState, ChemicalElement } from '../types';
import { ELEMENTS } from '../data/elements';
import { calculateElectronConfig, calculateShellsFromSubshells } from '../utils/atomicEngine';
import { playBubbleSound, playDiscoveryChime } from '../utils/audio';

interface AtomicStructureLabProps {
  state: AppState;
  onNavigateTab: (tab: AppState['activeTab']) => void;
  onSelectSubstanceForLab?: (symbol: string) => void;
}

// Curriculum Key Isotopes
const CURRICULUM_ISOTOPES: Record<
  number,
  { symbol: string; neutrons: number; abundance?: string; notesBangla: string; notesEnglish: string }[]
> = {
  1: [
    { symbol: '¹H (Protium)', neutrons: 0, abundance: '99.98%', notesBangla: 'সবচেয়ে সরল ও প্রচলিত হাইড্রোজেন, যাতে কোনো নিউট্রন নেই।', notesEnglish: 'Ordinary hydrogen without neutrons.' },
    { symbol: '²H (Deuterium - D)', neutrons: 1, abundance: '0.015%', notesBangla: 'ভারী হাইড্রোজেন; পারমাণবিক চুল্লিতে ভারী পানি (D₂O) তৈরিতে ব্যবহৃত হয়।', notesEnglish: 'Heavy hydrogen used in heavy water (D₂O) nuclear reactors.' },
    { symbol: '³H (Tritium - T)', neutrons: 2, abundance: 'Trace (Radioactive)', notesBangla: 'তেজস্ক্রিয় আইসোটোপ; এর অর্ধায়ু প্রায় ১২.৩২ বছর।', notesEnglish: 'Radioactive isotope with half-life ~12.32 years.' }
  ],
  6: [
    { symbol: '¹²C', neutrons: 6, abundance: '98.93%', notesBangla: 'প্রকৃতিতে সর্বাধিক স্থিতিশীল কার্বন আইসোটোপ। পারমাণবিক ভরের আন্তর্জাতিক মান (amu) নির্ধারণে এর ১/১২ অংশ ব্যবহৃত হয়।', notesEnglish: 'Standard for the unified atomic mass unit scale (1/12th of 12C).' },
    { symbol: '¹³C', neutrons: 7, abundance: '1.07%', notesBangla: 'NMR স্পেকট্রোস্কোপিতে জৈব যৌগের গঠন শনাক্তকরণে ব্যবহৃত হয়।', notesEnglish: 'Used in organic chemistry NMR spectroscopy.' },
    { symbol: '¹⁴C (Radiocarbon)', neutrons: 8, abundance: 'Trace (Radioactive)', notesBangla: 'রেডিওকার্বন ডেটিং পদ্ধতিতে প্রাচীন জীবাশ্ম ও প্রত্নতাত্ত্বিক নমুনার বয়স নির্ধারণে ব্যবহৃত হয়।', notesEnglish: 'Crucial for radiocarbon dating of historical and archaeological artifacts.' }
  ],
  17: [
    { symbol: '³⁵Cl', neutrons: 18, abundance: '75.76%', notesBangla: 'ক্লোরিনের সর্বাধিক প্রাপ্ত আইসোটোপ (প্রায় ৭৫%)।', notesEnglish: 'Most common chlorine isotope (75.76%).' },
    { symbol: '³⁷Cl', neutrons: 20, abundance: '24.24%', notesBangla: 'ক্লোরিনের অপর প্রধান আইসোটোপ (প্রায় ২৫%)। এদের অনুপাত ৩:১ বলেই ক্লোরিনের আপেক্ষিক পারমাণবিক ভর ৩৫.৫ হয়!', notesEnglish: '3:1 natural ratio produces chlorine\'s fractional average atomic mass of 35.5 u.' }
  ],
  27: [
    { symbol: '⁶⁰Co (Cobalt-60)', neutrons: 33, abundance: 'Synthetic', notesBangla: 'ক্যান্সার চিকিৎসায় টিউমার ধ্বংস করার জন্য কোবাল্ট-৬০ এর শক্তিশালী গামা রশ্মি ব্যবহার করা হয়।', notesEnglish: 'Emits gamma rays used extensively in cancer radiotherapy and food sterilization.' }
  ],
  53: [
    { symbol: '¹³¹I (Iodine-131)', neutrons: 78, abundance: 'Synthetic', notesBangla: 'থাইরয়েড গ্রন্থির চিকিৎসা ও থাইরয়েড ক্যান্সার নিরাময়ে তেজস্ক্রিয় আয়োডিন-১৩১ ব্যবহৃত হয়।', notesEnglish: 'Used in nuclear medicine to treat hyperthyroidism and thyroid cancer.' }
  ],
  92: [
    { symbol: '²³⁵U (Uranium-235)', neutrons: 143, abundance: '0.72%', notesBangla: 'পারমাণবিক চুল্লিতে নিউক্লিয়ার ফিশন বিক্রিয়ার মাধ্যমে বিপুল বিদ্যুৎ শক্তি উৎপাদনে প্রধান জ্বালানি।', notesEnglish: 'Fissile material essential for nuclear power plant reactors.' },
    { symbol: '²³⁸U (Uranium-238)', neutrons: 146, abundance: '99.27%', notesBangla: 'প্রকৃতিতে প্রাপ্ত ইউরেনিয়ামের প্রধান অংশ; ভূতাত্ত্বিক সময় গণনায় ব্যবহৃত হয়।', notesEnglish: 'Most abundant natural uranium; used in radiometric geochronology.' }
  ]
};

export const AtomicStructureLab: React.FC<AtomicStructureLabProps> = ({
  state,
  onNavigateTab,
  onSelectSubstanceForLab
}) => {
  const { language } = state;

  // Selected base element (1 to 118)
  const [selectedAtomicNumber, setSelectedAtomicNumber] = useState<number>(1); // Hydrogen default
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeRange, setActiveRange] = useState<'1-20' | '21-40' | '41-70' | '71-118' | 'all'>('1-20');

  const baseElement: ChemicalElement = useMemo(() => {
    return ELEMENTS.find((el) => el.number === selectedAtomicNumber) || ELEMENTS[0];
  }, [selectedAtomicNumber]);

  // Interactive Particle Adjuster State
  const defaultNeutrons = Math.round(baseElement.atomicMass - baseElement.number);
  const [protons, setProtons] = useState<number>(baseElement.number);
  const [neutrons, setNeutrons] = useState<number>(defaultNeutrons);
  const [electrons, setElectrons] = useState<number>(baseElement.number);
  const [selectedIsotopeTab, setSelectedIsotopeTab] = useState<number | null>(null);

  // Sync when student selects a different element
  const handleSelectElement = (z: number) => {
    const el = ELEMENTS.find((e) => e.number === z) || ELEMENTS[0];
    const n = Math.round(el.atomicMass - el.number);
    setSelectedAtomicNumber(z);
    setProtons(el.number);
    setNeutrons(n);
    setElectrons(el.number);
    setSelectedIsotopeTab(null);
    playBubbleSound();
  };

  const handleResetToNeutral = () => {
    setProtons(baseElement.number);
    setNeutrons(defaultNeutrons);
    setElectrons(baseElement.number);
    setSelectedIsotopeTab(null);
  };

  // Charge and Mass calculation
  const netCharge = protons - electrons;
  const massNumber = protons + neutrons;

  // Current identity of particle based on proton count Z
  const activeNuclide: ChemicalElement = useMemo(() => {
    return ELEMENTS.find((e) => e.number === protons) || baseElement;
  }, [protons, baseElement]);

  // Particle state determination
  let particleTypeBn = 'নিরপেক্ষ পরমাণু (Neutral Atom)';
  let particleTypeEn = 'Neutral Atom';
  let badgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';

  if (netCharge > 0) {
    particleTypeBn = `ক্যাটায়ন / ধনাত্মক আয়ন (${netCharge > 1 ? netCharge : ''}+ Cation)`;
    particleTypeEn = `Cation (+${netCharge})`;
    badgeColor = 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-[0_0_12px_#f43f5e33]';
  } else if (netCharge < 0) {
    particleTypeBn = `অ্যানায়ন / ঋণাত্মক আয়ন (${Math.abs(netCharge) > 1 ? Math.abs(netCharge) : ''}- Anion)`;
    particleTypeEn = `Anion (-${Math.abs(netCharge)})`;
    badgeColor = 'bg-sky-500/20 text-sky-300 border-sky-500/40 shadow-[0_0_12px_#0ea5e933]';
  }

  // Exact shell distribution for current electron count (Aufbau based K, L, M, N, O, P, Q)
  const electronShells = useMemo(() => {
    if (electrons <= 0) return [0];
    const subshells = calculateElectronConfig(electrons);
    const calculated = calculateShellsFromSubshells(subshells);
    return calculated.length > 0 ? calculated : [electrons];
  }, [electrons]);

  // Curriculum isotopes for current protons (if available)
  const isotopeList = CURRICULUM_ISOTOPES[protons] || [];

  // Filtered elements for the horizontal scroll selector
  const displayedElements = useMemo(() => {
    let list = ELEMENTS;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return ELEMENTS.filter(
        (el) =>
          el.number.toString() === q ||
          el.symbol.toLowerCase() === q ||
          el.symbol.toLowerCase().startsWith(q) ||
          el.name.toLowerCase().includes(q) ||
          el.nameBangla.includes(q)
      );
    }

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
  }, [activeRange, searchQuery]);

  const shellNames = ['K', 'L', 'M', 'N', 'O', 'P', 'Q'];

  return (
    <div id="chemx-atomic-structure-lab" className="flex flex-col gap-4 pb-24">
      {/* Header Banner */}
      <div className="bg-slate-900/60 p-4 sm:p-5 rounded-3xl border border-slate-800 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
            <Atom className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span>{language === 'bn' ? 'পরমাণুর গঠন ও আইসোটোপ ল্যাব (১১৮টি মৌল)' : 'Atomic Structure & Isotope Lab (118 Elements)'}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono font-bold">
                1 - 118
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              {language === 'bn'
                ? '১ম মৌল হাইড্রোজেন থেকে শুরু করে লিথিয়াম, কার্বন এবং ১১৮তম ওগানেসন পর্যন্ত সকল মৌলের গঠন'
                : 'From #1 Hydrogen, #2 Helium, #3 Lithium through #118 Oganesson with real subatomic particles'}
            </p>
          </div>
        </div>

        {/* Quick Navigate Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('config')}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-indigo-300 font-semibold border border-slate-700 flex items-center gap-1.5 transition-all"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'অরবিটাল ল্যাব' : 'Orbital Lab'}</span>
          </button>
          <button
            onClick={() => onNavigateTab('ions')}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-amber-300 font-semibold border border-slate-700 flex items-center gap-1.5 transition-all"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'যোজনী ও আয়ন' : 'Valency & Ions'}</span>
          </button>
        </div>
      </div>

      {/* 118 Elements Quick Selector & Finder */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-4 sm:p-5 backdrop-blur-md flex flex-col gap-3 shadow-md">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Direct Dropdown of all 118 elements */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-semibold text-slate-300 whitespace-nowrap">
              {language === 'bn' ? 'মৌল নির্বাচন:' : 'Select Element:'}
            </span>
            <select
              value={selectedAtomicNumber}
              onChange={(e) => handleSelectElement(parseInt(e.target.value, 10))}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-cyan-300 focus:outline-none focus:border-cyan-500 w-full sm:w-64"
            >
              {ELEMENTS.map((el) => (
                <option key={el.number} value={el.number}>
                  #{el.number} {el.symbol} - {language === 'bn' ? `${el.nameBangla} (${el.name})` : `${el.name} (${el.nameBangla})`}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === 'bn'
                  ? 'সংখ্যা (1-118), প্রতীক (Li, C, Fe) বা নাম...'
                  : 'Number (1-118), symbol (Li, C, Fe), or name...'
              }
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          {/* Range Selector Tabs */}
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
                  setSearchQuery('');
                }}
                className={`px-2.5 py-1 rounded-xl font-bold whitespace-nowrap transition-all ${
                  activeRange === range.id && !searchQuery
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {language === 'bn' ? range.labelBn : range.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Element Buttons (Strict Sequential Order 1 to 118 without skipping!) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar pt-1 border-t border-slate-800/60">
          {displayedElements.map((el) => {
            const isSelected = selectedAtomicNumber === el.number;
            return (
              <button
                key={el.number}
                id={`atom-select-${el.number}`}
                onClick={() => handleSelectElement(el.number)}
                className={`px-3 py-1.5 rounded-2xl text-xs font-mono font-bold shrink-0 transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/25 scale-105 border-transparent'
                    : 'bg-slate-950 text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-800'
                }`}
                style={{
                  borderLeftWidth: !isSelected ? '3px' : undefined,
                  borderLeftColor: !isSelected ? el.colorHex : undefined
                }}
                title={`#${el.number} ${el.symbol} - ${el.name}`}
              >
                <span className={`text-[10px] ${isSelected ? 'text-slate-900' : 'text-slate-400'} font-normal`}>
                  #{el.number}
                </span>
                <span className="text-sm font-black">{el.symbol}</span>
                <span className={`text-[10px] hidden sm:inline ${isSelected ? 'text-slate-900 font-bold' : 'text-slate-400 font-normal'}`}>
                  {language === 'bn' ? el.nameBangla : el.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Stage Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Interactive Bohr Visualizer & Shell Model (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900/70 border border-slate-800 rounded-3xl p-5 backdrop-blur-md flex flex-col justify-between relative overflow-hidden shadow-xl min-h-[460px]">
          {/* Particle Identification Ribbon */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-2xl flex flex-col items-center justify-center border font-mono font-black text-white shadow-md"
                style={{
                  backgroundColor: `${activeNuclide.colorHex}25`,
                  borderColor: activeNuclide.colorHex
                }}
              >
                <span className="text-[9px] text-slate-300">#{activeNuclide.number}</span>
                <span className="text-lg leading-none text-cyan-300">{activeNuclide.symbol}</span>
              </div>
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <span>{language === 'bn' ? activeNuclide.nameBangla : activeNuclide.name}</span>
                  <span className="text-xs font-normal text-slate-400">({activeNuclide.name})</span>
                </h3>
                <span className="text-xs font-mono text-cyan-300">
                  Z = {protons} | A = {massNumber} | {activeNuclide.category}
                </span>
              </div>
            </div>

            <div className={`px-3 py-1 rounded-full text-xs font-bold border ${badgeColor}`}>
              {language === 'bn' ? particleTypeBn : particleTypeEn}
            </div>
          </div>

          {/* Animated Bohr Concentric Model (Supports up to 7 shells K-Q dynamically) */}
          <div className="relative w-full h-80 sm:h-96 flex items-center justify-center my-4 overflow-hidden select-none">
            {/* Background orbital glow */}
            <div className="absolute inset-0 bg-radial from-cyan-950/20 via-transparent to-transparent opacity-50" />

            {/* Nucleus Core */}
            <div
              className="relative z-30 flex flex-col items-center justify-center rounded-full p-2 shadow-2xl transition-all"
              style={{
                background: 'radial-gradient(circle, #f59e0b 0%, #dc2626 70%, #991b1b 100%)',
                boxShadow: '0 0 25px rgba(245, 158, 11, 0.45)',
                minWidth: '68px',
                minHeight: '68px'
              }}
            >
              <span className="text-[8px] font-bold text-amber-200 uppercase tracking-wider">NUCLEUS</span>
              <div className="flex items-center gap-1 text-[11px] font-mono font-black text-white">
                <span className="text-amber-100">{protons}p⁺</span>
                <span>•</span>
                <span className="text-sky-200">{neutrons}n⁰</span>
              </div>
            </div>

            {/* Concentric Shells (K, L, M, N, O, P, Q) */}
            {electronShells.map((count, sIdx) => {
              const maxShells = electronShells.length;
              // Scale radii so up to 7 shells fit gracefully
              const baseRadius = maxShells > 4 ? 48 : 68;
              const stepRadius = maxShells > 4 ? 22 : 36;
              const radius = baseRadius + sIdx * stepRadius;
              const shellName = shellNames[sIdx] || `S${sIdx + 1}`;
              const spinDir = sIdx % 2 === 0 ? 'animate-spin-slow' : 'animate-spin-reverse';

              return (
                <div
                  key={sIdx}
                  className={`absolute rounded-full border border-cyan-400/25 ${spinDir}`}
                  style={{
                    width: `${radius * 2}px`,
                    height: `${radius * 2}px`
                  }}
                >
                  {/* Orbit Label */}
                  <span className="absolute top-0.5 left-1/2 -translate-x-1/2 text-[8px] font-mono text-cyan-400/70 bg-slate-950/80 px-1 rounded">
                    {shellName} (n={sIdx + 1}) ({count}e⁻)
                  </span>

                  {/* Electrons positioned equidistant along the perimeter */}
                  {Array.from({ length: count }).map((_, eIdx) => {
                    const angle = (eIdx / count) * 2 * Math.PI;
                    const x = 50 + 50 * Math.cos(angle);
                    const y = 50 + 50 * Math.sin(angle);

                    return (
                      <div
                        key={eIdx}
                        className="absolute w-3.5 h-3.5 -ml-1.5 -mt-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_#38bdf8] flex items-center justify-center text-[7px] font-mono text-slate-950 font-black"
                        style={{
                          left: `${x}%`,
                          top: `${y}%`
                        }}
                      >
                        e⁻
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Bottom Shell Summary */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">
                {language === 'bn' ? 'শক্তিস্তর বণ্টন (Shells):' : 'Shell Distribution:'}
              </span>
              <div className="flex flex-wrap items-center gap-1 font-mono">
                {electronShells.map((c, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-800 text-cyan-300 font-bold text-[11px]"
                  >
                    {shellNames[idx] || `S${idx + 1}`}: {c}
                  </span>
                ))}
              </div>
            </div>

            <div className="text-[11px] text-slate-400">
              <span>{language === 'bn' ? 'মোট ইলেকট্রন:' : 'Total Electrons:'} </span>
              <span className="font-mono font-bold text-cyan-300">{electrons}</span>
            </div>
          </div>
        </div>

        {/* Right: Particle Adjustment Controls & Isotope Explorer (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Subatomic Particle Controls */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-4 sm:p-5 backdrop-blur-md flex flex-col gap-4 shadow-lg">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>{language === 'bn' ? 'কণিকা নিয়ন্ত্রক (Particle Controls)' : 'Subatomic Particle Builder'}</span>
              </h4>
              <button
                onClick={handleResetToNeutral}
                className="text-[11px] text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                title="Reset to neutral element"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{language === 'bn' ? 'রিসেট' : 'Reset'}</span>
              </button>
            </div>

            {/* Protons Control (Changes Identity!) */}
            <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_6px_#f43f5e]" />
                  <span className="text-xs font-bold text-slate-200">
                    {language === 'bn' ? 'প্রোটন (Protons - p⁺)' : 'Protons (p⁺)'}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">
                  {language === 'bn' ? 'মৌলের পারমাণবিক সংখ্যা (Z: 1 - 118)' : 'Atomic number (Z: 1 - 118)'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const nextP = Math.max(1, protons - 1);
                    setProtons(nextP);
                    setSelectedAtomicNumber(nextP);
                  }}
                  className="w-7 h-7 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center text-xs font-bold transition-all"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center font-mono font-bold text-rose-400 text-sm">{protons}</span>
                <button
                  onClick={() => {
                    const nextP = Math.min(118, protons + 1);
                    setProtons(nextP);
                    setSelectedAtomicNumber(nextP);
                  }}
                  className="w-7 h-7 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center text-xs font-bold transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Neutrons Control (Creates Isotopes!) */}
            <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500 shadow-[0_0_6px_#0ea5e9]" />
                  <span className="text-xs font-bold text-slate-200">
                    {language === 'bn' ? 'নিউট্রন (Neutrons - n⁰)' : 'Neutrons (n⁰)'}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">
                  {language === 'bn' ? 'ভর সংখ্যা পরিবর্তন (আইসোটোপ)' : 'Changes mass number (Isotopes)'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setNeutrons((n) => Math.max(0, n - 1))}
                  className="w-7 h-7 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center text-xs font-bold transition-all"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center font-mono font-bold text-sky-400 text-sm">{neutrons}</span>
                <button
                  onClick={() => setNeutrons((n) => n + 1)}
                  className="w-7 h-7 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center text-xs font-bold transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Electrons Control (Creates Ions!) */}
            <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#38bdf8]" />
                  <span className="text-xs font-bold text-slate-200">
                    {language === 'bn' ? 'ইলেকট্রন (Electrons - e⁻)' : 'Electrons (e⁻)'}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">
                  {language === 'bn' ? 'আয়ন গঠন (ক্যাটায়ন / অ্যানায়ন)' : 'Changes ion charge (+ or -)'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setElectrons((e) => Math.max(0, e - 1))}
                  className="w-7 h-7 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center text-xs font-bold transition-all"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center font-mono font-bold text-cyan-300 text-sm">{electrons}</span>
                <button
                  onClick={() => setElectrons((e) => e + 1)}
                  className="w-7 h-7 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center text-xs font-bold transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Net Charge & Mass Status */}
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 text-[10px] block">
                  {language === 'bn' ? 'মোট আধান (Net Charge)' : 'Net Charge'}
                </span>
                <span
                  className={`text-sm font-mono font-black ${
                    netCharge === 0 ? 'text-slate-300' : netCharge > 0 ? 'text-rose-400' : 'text-sky-400'
                  }`}
                >
                  {netCharge > 0 ? `+${netCharge}` : netCharge}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 text-[10px] block">
                  {language === 'bn' ? 'ভর সংখ্যা (A = p + n)' : 'Mass Number (A)'}
                </span>
                <span className="text-sm font-mono font-black text-amber-400">{massNumber}</span>
              </div>
            </div>
          </div>

          {/* Curriculum Isotopes Box */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-4 sm:p-5 backdrop-blur-md flex flex-col gap-3 shadow-lg">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'সিলেবাসের আইসোটোপসমূহ:' : 'Class 9 Key Isotopes:'}</span>
            </h4>

            {isotopeList.length > 0 ? (
              <div className="flex flex-col gap-2">
                {isotopeList.map((iso, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setNeutrons(iso.neutrons);
                      setElectrons(protons);
                      setSelectedIsotopeTab(idx);
                      playDiscoveryChime();
                    }}
                    className={`p-2.5 rounded-2xl border text-left flex flex-col gap-1 transition-all ${
                      neutrons === iso.neutrons
                        ? 'bg-amber-950/30 border-amber-500/50 shadow-md ring-1 ring-amber-500/30'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-amber-300">{iso.symbol}</span>
                      <span className="text-[10px] text-slate-400">
                        p={protons}, n={iso.neutrons} {iso.abundance ? `(${iso.abundance})` : ''}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 font-bengali leading-snug">
                      {language === 'bn' ? iso.notesBangla : iso.notesEnglish}
                    </p>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic font-bengali">
                {language === 'bn'
                  ? 'হাইড্রোজেন (#1 H), কার্বন (#6 C), ক্লোরিন (#17 Cl), কোবাল্ট (#27 Co), আয়োডিন (#53 I), বা ইউরেনিয়াম (#92 U) বেছে নিয়ে তাদের সিলেবাসের বিখ্যাত আইসোটোপ দেখুন।'
                  : 'Select H (#1), C (#6), Cl (#17), Co (#27), I (#53), or U (#92) to inspect curriculum isotopes.'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Class 9 Theory & Core Definitions Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-4 flex flex-col gap-2">
          <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
            {language === 'bn' ? '১. নিউক্লিয়াস ও স্থায়ী কণিকা' : '1. Nucleus & Subatomic Particles'}
          </span>
          <p className="text-xs text-slate-300 font-bengali leading-relaxed">
            {language === 'bn'
              ? 'পরমাণুর কেন্দ্রে অত্যন্ত ক্ষুদ্র আয়তনে ধণাত্মক আধানযুক্ত নিউক্লিয়াস অবস্থিত। এতে প্রোটন (p⁺) ও চার্জহীন নিউট্রন (n⁰) থাকে, যাদের একত্রে নিউক্লিয়ন (Nucleon) বলে। পরমাণুর প্রায় সমগ্র ভরই নিউক্লিয়াসে পুঞ্জীভূত।'
              : 'The nucleus contains positively charged protons (p⁺) and neutral neutrons (n⁰), collectively termed nucleons, housing virtually all the atomic mass.'}
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-4 flex flex-col gap-2">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
            {language === 'bn' ? '২. বোর মডেল ও ইলেকট্রন কক্ষপথ' : '2. Bohr Orbit Model'}
          </span>
          <p className="text-xs text-slate-300 font-bengali leading-relaxed">
            {language === 'bn'
              ? 'ইলেকট্রনগুলো নিউক্লিয়াসকে কেন্দ্র করে নির্দিষ্ট বৃত্তাকার শক্তিস্তরে (K, L, M, N...) ঘোরে। প্রতিটি স্তরে সর্বোচ্চ ইলেকট্রন ধারণক্ষমতা ২n² (যেখানে n = প্রধান কোয়ান্টাম সংখ্যা)। যেমন: ১ম স্তরে ২টি, ২য় স্তরে ৮টি, ৩য় স্তরে ১৮টি।'
              : 'Electrons orbit the nucleus in fixed energy shells (K, L, M, N...). Maximum electron capacity per shell follows 2n² (n=1: 2, n=2: 8, n=3: 18).'}
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-4 flex flex-col gap-2">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            {language === 'bn' ? '৩. আইসোটোপ ও আয়নের পার্থক্য' : '3. Isotopes vs Ions'}
          </span>
          <p className="text-xs text-slate-300 font-bengali leading-relaxed">
            {language === 'bn'
              ? 'আইসোটোপ: একই প্রোটন সংখ্যা কিন্তু ভিন্ন নিউট্রন ও ভর সংখ্যা। আয়ন: ইলেকট্রন গ্রহণ বা ত্যাগের মাধ্যমে পরমাণুর তৈরি চার্জযুক্ত অবস্থা (ক্যাটায়ন বা অ্যানায়ন)।'
              : 'Isotopes have identical proton numbers but differing neutrons. Ions are formed when atoms lose or gain electrons to acquire net electric charge.'}
          </p>
        </div>
      </div>
    </div>
  );
};
