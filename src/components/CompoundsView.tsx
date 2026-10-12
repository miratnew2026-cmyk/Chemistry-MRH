import React, { useState, useMemo } from 'react';
import {
  TestTube2,
  Search,
  Plus,
  BookOpen,
  ArrowRight,
  Filter,
  Check,
  ShieldAlert,
  Flame,
  Sparkles
} from 'lucide-react';
import { Compound, AppState } from '../types';
import { COMPOUNDS } from '../data/compounds';

interface CompoundsViewProps {
  state: AppState;
  onSendToLab: (compoundId: string) => void;
  onNavigateTab: (tab: AppState['activeTab']) => void;
}

export const CompoundsView: React.FC<CompoundsViewProps> = ({
  state,
  onSendToLab,
  onNavigateTab
}) => {
  const { language } = state;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBonding, setSelectedBonding] = useState<string>('all');

  const categories = [
    { id: 'all', labelBn: 'সকল যৌগ', labelEn: 'All Compounds' },
    { id: 'Acid', labelBn: 'অ্যাসিড (৬টি প্রধান)', labelEn: 'Acids' },
    { id: 'Base', labelBn: 'ক্ষারক ও ক্ষার (৫টি প্রধান)', labelEn: 'Bases & Alkalis' },
    { id: 'Salt', labelBn: 'লবণ (১২টি প্রধান)', labelEn: 'Salts' },
    { id: 'Oxide', labelBn: 'অক্সাইড (১১টি প্রধান)', labelEn: 'Oxides' },
    { id: 'Organic', labelBn: 'জৈব যৌগ (হাইড্রোকার্বন)', labelEn: 'Organic' },
    { id: 'Water/Hydride', labelBn: 'পানি ও হাইড্রাইড', labelEn: 'Water/Hydride' }
  ];

  const filteredCompounds = useMemo(() => {
    return COMPOUNDS.filter((cp) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === '' ||
        cp.formula.toLowerCase().includes(q) ||
        cp.name.toLowerCase().includes(q) ||
        cp.nameBangla.includes(q) ||
        cp.schoolContext.toLowerCase().includes(q);

      const matchesCat =
        selectedCategory === 'all' ||
        cp.category.toLowerCase() === selectedCategory.toLowerCase() ||
        (selectedCategory === 'Salt' && ['Carbonate', 'Sulfate', 'Chloride'].includes(cp.category));

      const matchesBonding =
        selectedBonding === 'all' || cp.bondingType === selectedBonding;

      return matchesSearch && matchesCat && matchesBonding;
    });
  }, [searchQuery, selectedCategory, selectedBonding]);

  return (
    <div id="chemx-compounds-view" className="flex flex-col gap-4 pb-24">
      {/* Header & Filter */}
      <div className="bg-slate-900/60 p-4 sm:p-5 rounded-3xl border border-slate-800 backdrop-blur-md flex flex-col gap-3 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <TestTube2 className="w-5 h-5 text-indigo-400" />
              <span>{language === 'bn' ? 'নবম শ্রেণির রাসায়নিক যৌগ ডাটাবেস' : 'Class 9 Chemical Compounds Database'}</span>
            </h2>
            <p className="text-xs text-slate-400">
              {language === 'bn'
                ? 'সিলেবাসের সকল অ্যাসিড, ক্ষারক, লবণ, ধাতব ও অধাতব অক্সাইড এবং জৈব যৌগ'
                : 'Curated curriculum acids, alkalis, salts, oxides, and organic compounds'}
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={
                language === 'bn'
                  ? 'সংকেত বা নাম দিয়ে খুঁজুন (e.g. HCl, CaCO3, NaCl)...'
                  : 'Search by formula or name...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 w-full"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {language === 'bn' ? cat.labelBn : cat.labelEn}
            </button>
          ))}
        </div>

        {/* Bonding Type Filter (Ionic vs Covalent) */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-400">
              {language === 'bn' ? 'বন্ধনের ধরন:' : 'Bonding Type:'}
            </span>
            {['all', 'Ionic', 'Covalent'].map((b) => (
              <button
                key={b}
                onClick={() => setSelectedBonding(b)}
                className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold transition-all ${
                  selectedBonding === b
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {b === 'all' ? (language === 'bn' ? 'সকল' : 'All') : b}
              </button>
            ))}
          </div>

          <span className="text-[11px] font-mono text-slate-400">
            {filteredCompounds.length} {language === 'bn' ? 'টি যৌগ' : 'compounds'}
          </span>
        </div>
      </div>

      {/* Grid of Compounds */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredCompounds.map((cp) => (
          <div
            key={cp.id}
            id={`compound-card-${cp.id}`}
            className="p-4 rounded-3xl border border-slate-800/90 bg-slate-950/70 hover:bg-slate-900/90 transition-all flex flex-col justify-between group shadow-sm hover:border-indigo-500/40"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-xl font-black font-mono text-cyan-300">
                    {cp.formula}
                  </span>
                  <h3 className="text-sm font-bold text-white mt-0.5">
                    {language === 'bn' ? cp.nameBangla : cp.name}
                  </h3>
                  <p className="text-xs text-slate-400">{cp.name}</p>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full font-semibold bg-slate-900 text-indigo-300 border border-indigo-500/30">
                    {cp.category}
                  </span>
                  {cp.bondingType && (
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-bold border ${
                        cp.bondingType === 'Ionic'
                          ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                          : 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                      }`}
                    >
                      {cp.bondingType}
                    </span>
                  )}
                </div>
              </div>

              {/* Badges / Specs */}
              <div className="flex items-center gap-2 mt-3 text-[11px] text-slate-400">
                <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 font-mono">
                  {cp.state}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 font-mono">
                  {cp.molecularWeight} g/mol
                </span>
              </div>

              {/* Bangla Description & Context */}
              <p className="text-xs text-slate-300 leading-relaxed font-bengali mt-3 bg-slate-950/60 p-2.5 rounded-2xl border border-slate-800/60">
                {language === 'bn' ? cp.banglaInfo : cp.englishInfo}
              </p>

              {/* School Exam Focus */}
              <div className="mt-2 text-[11px] text-amber-300/90 font-bengali flex items-start gap-1.5">
                <span className="font-bold text-amber-400 shrink-0">পরীক্ষার টিপ:</span>
                <span>{cp.schoolContext}</span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-800/80">
              <span className="text-[10px] text-slate-400 truncate max-w-[60%]">
                {cp.properties[0]}
              </span>

              <button
                onClick={() => {
                  onSendToLab(cp.id);
                  onNavigateTab('lab');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 hover:text-white border border-indigo-500/40 transition-all shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'ল্যাবে পাঠান' : 'Send to Lab'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
