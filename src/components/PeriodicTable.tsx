import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Info,
  X,
  Plus,
  Atom,
  Sparkles,
  ChevronRight,
  Layers,
  Zap,
  SlidersHorizontal,
  Flame,
  TestTube
} from 'lucide-react';
import { ChemicalElement, AppState } from '../types';
import { ELEMENTS } from '../data/elements';
import { calculateElectronConfig, formatCondensedConfig, formatNobleGasConfig } from '../utils/atomicEngine';
import { playBubbleSound } from '../utils/audio';

interface PeriodicTableProps {
  state: AppState;
  onSendToLab: (symbol: string) => void;
  onNavigateTab: (tab: AppState['activeTab']) => void;
}

export const PeriodicTable: React.FC<PeriodicTableProps> = ({
  state,
  onSendToLab,
  onNavigateTab
}) => {
  const { language } = state;
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState<'all' | 'symbol' | 'number' | 'config'>('all');
  const [selectedBlock, setSelectedBlock] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMetalType, setSelectedMetalType] = useState<string>('all'); // all, metal, nonmetal, metalloid
  const [inspectingElement, setInspectingElement] = useState<ChemicalElement | null>(null);

  const categories = [
    { id: 'all', labelBn: 'সকল শ্রেণি', labelEn: 'All Categories' },
    { id: 'Alkali Metal', labelBn: 'ক্ষার ধাতু (Gp 1)', labelEn: 'Alkali Metals' },
    { id: 'Alkaline Earth Metal', labelBn: 'মৃৎক্ষার ধাতু (Gp 2)', labelEn: 'Alkaline Earth' },
    { id: 'Transition Metal', labelBn: 'অবস্থান্তর ধাতু (d-block)', labelEn: 'Transition Metals' },
    { id: 'Post-transition Metal', labelBn: 'অন্যান্য ধাতু', labelEn: 'Post-transition' },
    { id: 'Metalloid', labelBn: 'উপধাতু (অর্ধধাতু)', labelEn: 'Metalloids' },
    { id: 'Reactive Nonmetal', labelBn: 'সক্রিয় অধাতু', labelEn: 'Reactive Nonmetals' },
    { id: 'Halogen', labelBn: 'হ্যালোজেন (Gp 17)', labelEn: 'Halogens' },
    { id: 'Noble Gas', labelBn: 'নিষ্ক্রিয় গ্যাস (Gp 18)', labelEn: 'Noble Gases' },
    { id: 'Lanthanide', labelBn: 'ল্যান্থানাইড', labelEn: 'Lanthanides' },
    { id: 'Actinide', labelBn: 'অ্যাক্টিনাইড', labelEn: 'Actinides' }
  ];

  const filteredElements = useMemo(() => {
    return ELEMENTS.filter((el) => {
      const q = searchQuery.toLowerCase().trim();

      // Search Query Logic based on active search mode
      let matchesSearch = true;
      if (q) {
        if (searchMode === 'symbol') {
          matchesSearch = el.symbol.toLowerCase().startsWith(q);
        } else if (searchMode === 'number') {
          matchesSearch = el.atomicNumber.toString() === q || el.atomicNumber.toString().startsWith(q);
        } else if (searchMode === 'config') {
          const config = el.electronConfiguration.toLowerCase();
          matchesSearch = config.includes(q);
        } else {
          // 'all' search mode: checks symbol, name, bangla name, number, or config
          matchesSearch =
            el.symbol.toLowerCase().includes(q) ||
            el.name.toLowerCase().includes(q) ||
            el.nameBangla.includes(q) ||
            el.atomicNumber.toString() === q ||
            el.electronConfiguration.toLowerCase().includes(q);
        }
      }

      // Filter: Block (s, p, d, f)
      const matchesBlock = selectedBlock === 'all' || el.block === selectedBlock;

      // Filter: Period (1 to 7)
      const matchesPeriod = selectedPeriod === 'all' || el.period.toString() === selectedPeriod;

      // Filter: Group (1 to 18)
      const matchesGroup = selectedGroup === 'all' || el.group.toString() === selectedGroup;

      // Filter: Category
      const matchesCat =
        selectedCategory === 'all' || el.category.toLowerCase() === selectedCategory.toLowerCase();

      // Filter: Metal / Nonmetal / Metalloid
      let matchesMetalType = true;
      if (selectedMetalType === 'metal') {
        matchesMetalType = [
          'Alkali Metal',
          'Alkaline Earth Metal',
          'Transition Metal',
          'Post-transition Metal',
          'Lanthanide',
          'Actinide'
        ].includes(el.category);
      } else if (selectedMetalType === 'nonmetal') {
        matchesMetalType = ['Reactive Nonmetal', 'Halogen', 'Noble Gas'].includes(el.category);
      } else if (selectedMetalType === 'metalloid') {
        matchesMetalType = el.category === 'Metalloid';
      }

      return matchesSearch && matchesBlock && matchesPeriod && matchesGroup && matchesCat && matchesMetalType;
    });
  }, [searchQuery, searchMode, selectedBlock, selectedPeriod, selectedGroup, selectedCategory, selectedMetalType]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSearchMode('all');
    setSelectedBlock('all');
    setSelectedPeriod('all');
    setSelectedGroup('all');
    setSelectedCategory('all');
    setSelectedMetalType('all');
  };

  return (
    <div id="chemx-periodic-table-view" className="flex flex-col gap-4 pb-24">
      {/* Header & Smart Finder Controls */}
      <div className="bg-slate-900/60 p-4 sm:p-5 rounded-3xl border border-slate-800 backdrop-blur-md flex flex-col gap-4 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <Atom className="w-5 h-5 text-cyan-400" />
              <span>{language === 'bn' ? 'পর্যায় সারণি (১১৮টি মৌল ও ব্লক ভিত্তিক অনুসন্ধান)' : 'Periodic Table of 118 Elements'}</span>
            </h2>
            <p className="text-xs text-slate-400">
              {language === 'bn'
                ? 'ইলেকট্রন বিন্যাস, পারমাণবিক সংখ্যা বা প্রতীক দিয়ে মৌল দ্রুত খুঁজুন'
                : 'Find elements by electron configuration, atomic number, symbol, block, or period'}
            </p>
          </div>

          {/* Search Mode Selector (Find Element by...) */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs">
            {[
              { id: 'all', labelBn: 'সবকিছু', labelEn: 'All' },
              { id: 'symbol', labelBn: 'প্রতীক', labelEn: 'Symbol' },
              { id: 'number', labelBn: 'পারমাণবিক সংখ্যা', labelEn: 'Atomic #' },
              { id: 'config', labelBn: 'ইলেকট্রন বিন্যাস', labelEn: 'Config' }
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setSearchMode(m.id as any)}
                className={`px-2.5 py-1 rounded-xl font-bold transition-all ${
                  searchMode === m.id
                    ? 'bg-cyan-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {language === 'bn' ? m.labelBn : m.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={
                searchMode === 'config'
                  ? (language === 'bn' ? 'ইলেকট্রন বিন্যাস লিখুন (যেমন: 3s1, 2p6, 3d5, 4s1)...' : 'Find by config (e.g. 3s1, 2p6, 3d5)...')
                  : searchMode === 'number'
                  ? (language === 'bn' ? 'পারমাণবিক সংখ্যা লিখুন (১ - ১১৮)...' : 'Find by atomic number (1-118)...')
                  : searchMode === 'symbol'
                  ? (language === 'bn' ? 'মৌলের প্রতীক লিখুন (যেমন: Na, Fe, Cu, Au)...' : 'Find by symbol (e.g. Na, Fe, Cu)...')
                  : (language === 'bn' ? 'প্রতীক, নাম, সংখ্যা বা বিন্যাস দিয়ে খুঁজুন...' : 'Search by symbol, name, atomic #, config...')
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-950/90 border border-slate-800 rounded-2xl pl-9 pr-3 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 w-full"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={handleResetFilters}
            className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold shrink-0 transition-colors"
          >
            {language === 'bn' ? 'রিসেট' : 'Reset'}
          </button>
        </div>

        {/* Comprehensive Filter Bar (Block, Metal Type, Period, Group) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-slate-800/60 text-xs">
          {/* Block Filter (s, p, d, f) */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">
              {language === 'bn' ? 'ব্লক (Block):' : 'Block:'}
            </span>
            <div className="flex items-center gap-1">
              {['all', 's', 'p', 'd', 'f'].map((b) => (
                <button
                  key={b}
                  onClick={() => setSelectedBlock(b)}
                  className={`px-2 py-1 rounded-xl font-mono font-bold text-[11px] transition-all flex-1 text-center ${
                    selectedBlock === b
                      ? 'bg-indigo-600 text-white shadow'
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {b.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Metal / Nonmetal / Metalloid */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">
              {language === 'bn' ? 'ধাতু / অধাতু:' : 'Type:'}
            </span>
            <select
              value={selectedMetalType}
              onChange={(e) => setSelectedMetalType(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-2 py-1 text-xs text-slate-200 focus:outline-none"
            >
              <option value="all">{language === 'bn' ? 'সকল প্রকার' : 'All Types'}</option>
              <option value="metal">{language === 'bn' ? 'ধাতু (Metals)' : 'Metals'}</option>
              <option value="nonmetal">{language === 'bn' ? 'অধাতু (Nonmetals)' : 'Nonmetals'}</option>
              <option value="metalloid">{language === 'bn' ? 'উপধাতু (Metalloids)' : 'Metalloids'}</option>
            </select>
          </div>

          {/* Period Filter (1-7) */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">
              {language === 'bn' ? 'পর্যায় (Period 1-7):' : 'Period:'}
            </span>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-2 py-1 text-xs text-slate-200 focus:outline-none"
            >
              <option value="all">{language === 'bn' ? 'সব পর্যায়' : 'All Periods'}</option>
              {[1, 2, 3, 4, 5, 6, 7].map((p) => (
                <option key={p} value={p.toString()}>
                  Period {p}
                </option>
              ))}
            </select>
          </div>

          {/* Group Filter (1-18) */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">
              {language === 'bn' ? 'গ্রুপ (Group 1-18):' : 'Group:'}
            </span>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-2 py-1 text-xs text-slate-200 focus:outline-none"
            >
              <option value="all">{language === 'bn' ? 'সব গ্রুপ' : 'All Groups'}</option>
              {Array.from({ length: 18 }, (_, i) => i + 1).map((g) => (
                <option key={g} value={g.toString()}>
                  Group {g}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Filter Horizontal Scroll */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {language === 'bn' ? cat.labelBn : cat.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Elements */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2">
        {filteredElements.map((el) => {
          return (
            <button
              key={el.symbol}
              id={`elem-card-${el.symbol}`}
              onClick={() => {
                setInspectingElement(el);
                playBubbleSound();
              }}
              className="p-2 rounded-2xl border border-slate-800/80 bg-slate-950/70 hover:bg-slate-900 hover:border-cyan-500/40 transition-all flex flex-col justify-between items-start text-left group relative hover:scale-105 hover:z-10 shadow-sm"
              style={{
                borderLeftWidth: '3.5px',
                borderLeftColor: el.colorHex
              }}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-[10px] font-mono text-slate-500">
                  {el.atomicNumber}
                </span>
                <span className="text-[9px] font-mono font-bold text-slate-400">
                  {el.block}-blk
                </span>
              </div>

              <div className="my-1">
                <span className="text-lg font-black font-mono text-white group-hover:text-cyan-300">
                  {el.symbol}
                </span>
                <p className="text-[11px] font-medium text-slate-300 truncate w-full">
                  {language === 'bn' ? el.nameBangla : el.name}
                </p>
              </div>

              <div className="w-full flex items-center justify-between text-[9px] text-slate-400 pt-1 border-t border-slate-800/50">
                <span className="truncate max-w-[65%]">{el.category}</span>
                <span className="font-mono text-cyan-400 font-bold">V:{el.valency[0]}</span>
              </div>
            </button>
          );
        })}
      </div>

      {filteredElements.length === 0 && (
        <div className="text-center py-12 bg-slate-900/40 rounded-3xl border border-slate-800">
          <p className="text-slate-400 text-sm">
            {language === 'bn'
              ? 'আপনার অনুসন্ধান অনুসারে কোনো মৌল পাওয়া যায়নি।'
              : 'No elements match your search criteria.'}
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-3 px-4 py-1.5 rounded-xl bg-slate-800 text-cyan-300 text-xs font-bold"
          >
            {language === 'bn' ? 'ফিল্টার রিসেট করুন' : 'Reset Filters'}
          </button>
        </div>
      )}

      {/* COMPREHENSIVE ELEMENT INSPECTION DRAWER/MODAL */}
      {inspectingElement && (
        <div
          id="element-inspect-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xl animate-fade-in"
        >
          <div className="relative w-full max-w-xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-cyan-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setInspectingElement(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header / Identity */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center border font-mono font-black text-white shadow-lg"
                style={{
                  backgroundColor: `${inspectingElement.colorHex}25`,
                  borderColor: inspectingElement.colorHex
                }}
              >
                <span className="text-[10px] text-slate-300">#{inspectingElement.atomicNumber}</span>
                <span className="text-xl leading-none text-cyan-300">{inspectingElement.symbol}</span>
              </div>

              <div>
                <h3 className="text-xl font-black text-white">
                  {language === 'bn' ? inspectingElement.nameBangla : inspectingElement.name}
                </h3>
                <p className="text-xs text-slate-400">
                  {inspectingElement.name} • {inspectingElement.category} • {inspectingElement.state}
                </p>
              </div>
            </div>

            {/* School Chemistry Properties Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">পারমাণবিক ভর (A)</span>
                <span className="font-mono font-bold text-slate-200">{inspectingElement.atomicMass.toFixed(2)} u</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">পর্যায় ও গ্রুপ</span>
                <span className="font-mono font-bold text-slate-200">Period {inspectingElement.period}, Gp {inspectingElement.group}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">ব্লক (Block)</span>
                <span className="font-mono font-bold text-cyan-300">{inspectingElement.block}-block</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">যোজনী (Valency)</span>
                <span className="font-mono font-bold text-amber-300">{inspectingElement.valency.join(', ')}</span>
              </div>
            </div>

            {/* Electron Configuration Box */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-2 mb-4">
              <span className="text-[10px] uppercase font-bold text-slate-400">
                {language === 'bn' ? 'ইলেকট্রন বিন্যাস (Subshells & Shells):' : 'Electron Configuration:'}
              </span>
              <p className="font-mono text-sm font-bold text-cyan-300 break-words">
                {inspectingElement.electronConfiguration}
              </p>
              <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800">
                <span>
                  {language === 'bn' ? 'শক্তিস্তর বণ্টন:' : 'Shells:'}{' '}
                  <strong className="text-white font-mono">
                    {inspectingElement.shells ? inspectingElement.shells.join(', ') : '2, 8...'}
                  </strong>
                </span>
                <span>
                  {language === 'bn' ? 'জারণ অবস্থা:' : 'Oxidation:'}{' '}
                  <strong className="text-amber-400 font-mono">
                    {inspectingElement.oxidationStates.map((ox) => (ox > 0 ? `+${ox}` : ox)).join(', ')}
                  </strong>
                </span>
              </div>
            </div>

            {/* Bangla & English Educational Info */}
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 mb-4 leading-relaxed font-bengali">
              {language === 'bn' ? inspectingElement.banglaInfo : inspectingElement.englishInfo}
            </div>

            {/* Direct Laboratory Navigation Shortcuts */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  onNavigateTab('atom');
                  setInspectingElement(null);
                }}
                className="flex-1 px-3 py-2 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
              >
                <Atom className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'পরমাণুর গঠন ল্যাব' : 'Atomic Model'}</span>
              </button>

              <button
                onClick={() => {
                  onNavigateTab('config');
                  setInspectingElement(null);
                }}
                className="flex-1 px-3 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'অরবিটাল বক্স ল্যাব' : 'Orbital Boxes'}</span>
              </button>

              <button
                onClick={() => {
                  onSendToLab(inspectingElement.symbol);
                  setInspectingElement(null);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-600/20"
              >
                <TestTube className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'বিক্রিয়া ল্যাবে নিন' : 'Add to Lab'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
