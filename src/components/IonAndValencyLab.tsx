import React, { useState } from 'react';
import {
  Zap,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  HelpCircle,
  Plus,
  Minus,
  CheckCircle2,
  Atom,
  RotateCcw
} from 'lucide-react';
import { AppState } from '../types';
import { playDiscoveryChime, playBubbleSound } from '../utils/audio';

interface IonAndValencyLabProps {
  state: AppState;
  onNavigateTab: (tab: AppState['activeTab']) => void;
}

interface IonDemo {
  id: string;
  symbol: string;
  nameBangla: string;
  nameEnglish: string;
  z: number;
  neutralShells: number[];
  valenceElectrons: number;
  valency: number;
  ionType: 'Cation' | 'Anion';
  ionSymbol: string;
  ionShells: number[];
  electronsTransferred: number;
  nearestNobleGas: string;
  equationBn: string;
  explanationBn: string;
  explanationEn: string;
}

const CLASS_9_ION_DEMOS: IonDemo[] = [
  {
    id: 'Li',
    symbol: 'Li',
    nameBangla: 'লিথিয়াম',
    nameEnglish: 'Lithium',
    z: 3,
    neutralShells: [2, 1],
    valenceElectrons: 1,
    valency: 1,
    ionType: 'Cation',
    ionSymbol: 'Li⁺',
    ionShells: [2],
    electronsTransferred: 1,
    nearestNobleGas: 'হিলিয়াম [He] (2)',
    equationBn: 'Li  — 1e⁻  ➔  Li⁺ (লিথিয়াম ক্যাটায়ন)',
    explanationBn: 'লিথিয়ামের সর্ববহিঃস্থ স্তরে মাত্র ১টি ইলেকট্রন থাকে। এটি ১টি ইলেকট্রন ত্যাগ করে নিকটতম নিষ্ক্রিয় গ্যাস হিলিয়ামের স্থিতিশীল দ্বৈত (duplet) কাঠামো অর্জন করে Li⁺ গঠন করে।',
    explanationEn: 'Lithium has 1 valence electron; it sheds this electron to achieve Helium\'s stable duplet configuration, forming Li⁺.'
  },
  {
    id: 'Na',
    symbol: 'Na',
    nameBangla: 'সোডিয়াম',
    nameEnglish: 'Sodium',
    z: 11,
    neutralShells: [2, 8, 1],
    valenceElectrons: 1,
    valency: 1,
    ionType: 'Cation',
    ionSymbol: 'Na⁺',
    ionShells: [2, 8],
    electronsTransferred: 1,
    nearestNobleGas: 'নিয়ন [Ne] (2, 8)',
    equationBn: 'Na  — 1e⁻  ➔  Na⁺ (সোডিয়াম ক্যাটায়ন)',
    explanationBn: 'সোডিয়ামের সর্ববহিঃস্থ শক্তিস্তরে (M স্তর) মাত্র ১টি ইলেকট্রন থাকে। অষ্টক পূর্ণ করতে ৭টি ইলেকট্রন গ্রহণ করার চেয়ে ১টি ইলেকট্রন ত্যাগ করা অনেক সহজ। ফলে ১টি ইলেকট্রন ত্যাগ করে এটি স্থিতিশীল নিয়ন [Ne] এর মতো অষ্টকপূর্ণ ক্যাটায়নে (Na⁺) পরিণত হয়।',
    explanationEn: 'Sodium has 1 valence electron. Losing 1 electron requires far less energy than gaining 7, forming a stable Na⁺ cation matching Neon [Ne].'
  },
  {
    id: 'K',
    symbol: 'K',
    nameBangla: 'পটাশিয়াম',
    nameEnglish: 'Potassium',
    z: 19,
    neutralShells: [2, 8, 8, 1],
    valenceElectrons: 1,
    valency: 1,
    ionType: 'Cation',
    ionSymbol: 'K⁺',
    ionShells: [2, 8, 8],
    electronsTransferred: 1,
    nearestNobleGas: 'আর্গন [Ar] (2, 8, 8)',
    equationBn: 'K  — 1e⁻  ➔  K⁺ (পটাশিয়াম ক্যাটায়ন)',
    explanationBn: 'পটাশিয়াম ৪s স্তরের ১টি ইলেকট্রন সহজে ত্যাগ করে আর্গন [Ar] এর মতো স্থায়ী অষ্টক অর্জন করে K⁺ ক্যাটায়নে পরিণত হয়।',
    explanationEn: 'Potassium easily loses its 4s valence electron to attain stable Argon [Ar] configuration as K⁺.'
  },
  {
    id: 'Mg',
    symbol: 'Mg',
    nameBangla: 'ম্যাগনেসিয়াম',
    nameEnglish: 'Magnesium',
    z: 12,
    neutralShells: [2, 8, 2],
    valenceElectrons: 2,
    valency: 2,
    ionType: 'Cation',
    ionSymbol: 'Mg²⁺',
    ionShells: [2, 8],
    electronsTransferred: 2,
    nearestNobleGas: 'নিয়ন [Ne] (2, 8)',
    equationBn: 'Mg  — 2e⁻  ➔  Mg²⁺ (ম্যাগনেসিয়াম ক্যাটায়ন)',
    explanationBn: 'ম্যাগনেসিয়ামের যোজ্যতা স্তরে ২টি ইলেকট্রন থাকে। অষ্টক নিয়ম মানতে এটি সহজেই ২টি ইলেকট্রন ত্যাগ করে এবং দ্বি-ধনাত্মক ক্যাটায়ন Mg²⁺ গঠন করে।',
    explanationEn: 'Magnesium loses its 2 valence electrons to acquire stable Neon electron configuration, forming Mg²⁺.'
  },
  {
    id: 'Ca',
    symbol: 'Ca',
    nameBangla: 'ক্যালসিয়াম',
    nameEnglish: 'Calcium',
    z: 20,
    neutralShells: [2, 8, 8, 2],
    valenceElectrons: 2,
    valency: 2,
    ionType: 'Cation',
    ionSymbol: 'Ca²⁺',
    ionShells: [2, 8, 8],
    electronsTransferred: 2,
    nearestNobleGas: 'আর্গন [Ar] (2, 8, 8)',
    equationBn: 'Ca  — 2e⁻  ➔  Ca²⁺ (ক্যালসিয়াম ক্যাটায়ন)',
    explanationBn: 'ক্যালসিয়াম সর্ববহিঃস্থ ৪s স্তরের ২টি ইলেকট্রন ত্যাগ করে দ্বি-ধনাত্মক Ca²⁺ আয়ন গঠন করে এবং আর্গন কাঠামো পায়।',
    explanationEn: 'Calcium sheds 2 valence electrons from the 4s shell, attaining Argon configuration as Ca²⁺.'
  },
  {
    id: 'Al',
    symbol: 'Al',
    nameBangla: 'অ্যালুমিনিয়াম',
    nameEnglish: 'Aluminium',
    z: 13,
    neutralShells: [2, 8, 3],
    valenceElectrons: 3,
    valency: 3,
    ionType: 'Cation',
    ionSymbol: 'Al³⁺',
    ionShells: [2, 8],
    electronsTransferred: 3,
    nearestNobleGas: 'নিয়ন [Ne] (2, 8)',
    equationBn: 'Al  — 3e⁻  ➔  Al³⁺ (অ্যালুমিনিয়াম ক্যাটায়ন)',
    explanationBn: 'অ্যালুমিনিয়ামের যোজ্যতা ইলেকট্রন ৩। ৩টি ইলেকট্রন অপসারণের মাধ্যমে এটি Al³⁺ ক্যাটায়ন তৈরি করে যার বাইরের শক্তিস্তর ৮টি ইলেকট্রনে পরিপূর্ণ।',
    explanationEn: 'Aluminium sheds 3 valence electrons to achieve the stable Neon octet, becoming Al³⁺.'
  },
  {
    id: 'F',
    symbol: 'F',
    nameBangla: 'ফ্লোরিন',
    nameEnglish: 'Fluorine',
    z: 9,
    neutralShells: [2, 7],
    valenceElectrons: 7,
    valency: 1,
    ionType: 'Anion',
    ionSymbol: 'F⁻',
    ionShells: [2, 8],
    electronsTransferred: 1,
    nearestNobleGas: 'নিয়ন [Ne] (2, 8)',
    equationBn: 'F  + 1e⁻  ➔  F⁻ (ফ্লোরাইড অ্যানায়ন)',
    explanationBn: 'সবচেয়ে তীব্র তড়িৎ-ঋণাত্মক মৌল ফ্লোরিন। অষ্টক পূরণ করতে মাত্র ১টি ইলেকট্রন গ্রহণ করে এটি স্থিতিশীল F⁻ অ্যানায়নে রূপান্তরিত হয়।',
    explanationEn: 'Most electronegative element; gaining 1 electron completes Neon octet to form F⁻.'
  },
  {
    id: 'Cl',
    symbol: 'Cl',
    nameBangla: 'ক্লোরিন',
    nameEnglish: 'Chlorine',
    z: 17,
    neutralShells: [2, 8, 7],
    valenceElectrons: 7,
    valency: 1,
    ionType: 'Anion',
    ionSymbol: 'Cl⁻',
    ionShells: [2, 8, 8],
    electronsTransferred: 1,
    nearestNobleGas: 'আর্গন [Ar] (2, 8, 8)',
    equationBn: 'Cl  + 1e⁻  ➔  Cl⁻ (ক্লোরাইড অ্যানায়ন)',
    explanationBn: 'ক্লোরিনের বাইরের স্তরে ৭টি ইলেকট্রন থাকে। অষ্টক পূরণে এর মাত্র ১টি ইলেকট্রন প্রয়োজন। তাই এটি তীব্র ইলেকট্রন আসক্তি দেখিয়ে ১টি ইলেকট্রন গ্রহণ করে ঋণাত্মক ক্লোরাইড আয়নে (Cl⁻) পরিণত হয়।',
    explanationEn: 'Chlorine has 7 valence electrons and high electron affinity; gaining 1 electron completes Argon octet, forming Cl⁻.'
  },
  {
    id: 'O',
    symbol: 'O',
    nameBangla: 'অক্সিজেন',
    nameEnglish: 'Oxygen',
    z: 8,
    neutralShells: [2, 6],
    valenceElectrons: 6,
    valency: 2,
    ionType: 'Anion',
    ionSymbol: 'O²⁻',
    ionShells: [2, 8],
    electronsTransferred: 2,
    nearestNobleGas: 'নিয়ন [Ne] (2, 8)',
    equationBn: 'O  + 2e⁻  ➔  O²⁻ (অক্সাইড অ্যানায়ন)',
    explanationBn: 'অক্সিজেনের বাইরের স্তরে ৬টি ইলেকট্রন থাকে। অষ্টক অর্জনে ২টি ইলেকট্রন গ্রহণ করে এটি দ্বি-ঋণাত্মক অক্সাইড আয়ন (O²⁻) গঠন করে। যোজনী = ৮ - ৬ = ২।',
    explanationEn: 'Oxygen needs 2 electrons to satisfy the octet rule; gaining 2 electrons yields oxide ion O²⁻ with valency 2.'
  }
];

export const IonAndValencyLab: React.FC<IonAndValencyLabProps> = ({ state, onNavigateTab }) => {
  const { language } = state;
  const [selectedDemoId, setSelectedDemoId] = useState<string>('Na');
  const [isIonized, setIsIonized] = useState<boolean>(false);

  const currentDemo = CLASS_9_ION_DEMOS.find((d) => d.id === selectedDemoId) || CLASS_9_ION_DEMOS[0];

  const handleSelectDemo = (id: string) => {
    setSelectedDemoId(id);
    setIsIonized(false);
    playBubbleSound();
  };

  const handleToggleIonize = () => {
    setIsIonized((prev) => !prev);
    if (!isIonized) {
      playDiscoveryChime();
    } else {
      playBubbleSound();
    }
  };

  return (
    <div id="chemx-ion-valency-lab" className="flex flex-col gap-5 pb-24">
      {/* Header Banner */}
      <div className="bg-slate-900/60 p-4 sm:p-5 rounded-3xl border border-slate-800 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span>{language === 'bn' ? 'যোজনী, অষ্টক নিয়ম ও আয়ন গঠন ল্যাব' : 'Valency, Octet Rule & Ion Formation Lab'}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                CLASS 9
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              {language === 'bn'
                ? 'ইলেকট্রন আদান-প্রদান এবং কেন ও কীভাবে ক্যাটায়ন ও অ্যানায়ন তৈরি হয় তা সরাসরি সিমুলেট করুন'
                : 'Simulate electron transfer, octet satisfaction, and why cations and anions form'}
            </p>
          </div>
        </div>

        {/* Action Link to Equation Balancer */}
        <button
          onClick={() => onNavigateTab('balancer')}
          className="px-3.5 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-xs text-amber-300 font-bold border border-slate-700 flex items-center gap-1.5 transition-all self-start sm:self-auto"
        >
          <span>{language === 'bn' ? 'সমীকরণ ব্যালেন্সার' : 'Equation Balancer'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Interactive Ion Selector Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {CLASS_9_ION_DEMOS.map((demo) => (
          <button
            key={demo.id}
            onClick={() => handleSelectDemo(demo.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-mono font-bold shrink-0 transition-all flex items-center gap-2 ${
              selectedDemoId === demo.id
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 shadow-md shadow-amber-500/20 scale-105'
                : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <span>{demo.symbol} ➔ {demo.ionSymbol}</span>
            <span className="text-[10px] opacity-80">({demo.ionType})</span>
          </button>
        ))}
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Interactive Particle Ionization Stage (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900/70 border border-slate-800 rounded-3xl p-5 backdrop-blur-md flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>{language === 'bn' ? currentDemo.nameBangla : currentDemo.nameEnglish}</span>
                <span className="text-xs font-mono text-slate-400">({currentDemo.symbol})</span>
              </h3>
              <span className="text-[11px] text-amber-400 font-mono">
                {language === 'bn' ? 'নিকটবর্তী নিষ্ক্রিয় গ্যাস:' : 'Target Noble Gas:'} {currentDemo.nearestNobleGas}
              </span>
            </div>

            {/* Current State Badge */}
            <div
              className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${
                isIonized
                  ? currentDemo.ionType === 'Cation'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-[0_0_15px_#f43f5e33]'
                    : 'bg-sky-500/20 text-sky-300 border-sky-500/40 shadow-[0_0_15px_#0ea5e933]'
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              {isIonized
                ? `${currentDemo.ionSymbol} (${currentDemo.ionType})`
                : `${currentDemo.symbol} (নিরপেক্ষ পরমাণু)`}
            </div>
          </div>

          {/* Central Atom/Ion Visual Representation */}
          <div className="relative w-full h-72 sm:h-80 flex items-center justify-center my-4 select-none">
            {/* Ion Glow Backdrop */}
            {isIonized && (
              <div
                className={`absolute inset-0 rounded-full blur-3xl opacity-20 ${
                  currentDemo.ionType === 'Cation' ? 'bg-rose-500' : 'bg-sky-500'
                }`}
              />
            )}

            {/* Nucleus */}
            <div className="relative z-20 w-16 h-16 rounded-full bg-gradient-to-tr from-amber-600 to-rose-600 flex flex-col items-center justify-center text-white font-mono font-black shadow-lg">
              <span className="text-sm leading-none">{isIonized ? currentDemo.ionSymbol : currentDemo.symbol}</span>
              <span className="text-[9px] text-amber-200">+{currentDemo.z}p</span>
            </div>

            {/* Shells */}
            {(isIonized ? currentDemo.ionShells : currentDemo.neutralShells).map((count, idx) => {
              const radius = 60 + idx * 45;
              const isValenceShell =
                idx === (isIonized ? currentDemo.ionShells.length - 1 : currentDemo.neutralShells.length - 1);

              return (
                <div
                  key={idx}
                  className={`absolute rounded-full border ${
                    isValenceShell && isIonized
                      ? 'border-emerald-400/60 shadow-[0_0_12px_#10b981]'
                      : 'border-cyan-500/30'
                  } animate-spin-slow`}
                  style={{
                    width: `${radius * 2}px`,
                    height: `${radius * 2}px`
                  }}
                >
                  {/* Orbit indicator */}
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[8px] font-mono text-slate-500 bg-slate-950 px-1 rounded">
                    n={idx + 1} ({count}e⁻)
                  </span>

                  {/* Electrons */}
                  {Array.from({ length: count }).map((_, eIdx) => {
                    const angle = (eIdx / count) * 2 * Math.PI;
                    const x = 50 + 50 * Math.cos(angle);
                    const y = 50 + 50 * Math.sin(angle);

                    return (
                      <div
                        key={eIdx}
                        className={`absolute w-3 h-3 -ml-1.5 -mt-1.5 rounded-full flex items-center justify-center text-[7px] font-mono font-black text-slate-950 shadow-md ${
                          isValenceShell && isIonized
                            ? 'bg-emerald-300 shadow-[0_0_6px_#10b981]'
                            : 'bg-cyan-300 shadow-[0_0_6px_#38bdf8]'
                        }`}
                        style={{ left: `${x}%`, top: `${y}%` }}
                      >
                        e⁻
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Trigger Button: Ionize vs Neutral */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800">
            <div className="font-mono text-xs text-slate-300">
              <span className="text-slate-500">
                {language === 'bn' ? 'শক্তিস্তর অবস্থা:' : 'Shell State:'}{' '}
              </span>
              <span className="font-bold text-cyan-300">
                {(isIonized ? currentDemo.ionShells : currentDemo.neutralShells).join(', ')}
              </span>
              {isIonized && (
                <span className="ml-2 px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                  ✓ অষ্টক পূর্ণ (Octet Stable)
                </span>
              )}
            </div>

            <button
              onClick={handleToggleIonize}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all ${
                isIonized
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black shadow-amber-500/20'
              }`}
            >
              {isIonized ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'পুনরায় নিরপেক্ষ করুন' : 'Reset to Neutral'}</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5" />
                  <span>
                    {language === 'bn'
                      ? currentDemo.ionType === 'Cation'
                        ? `${currentDemo.electronsTransferred}টি ইলেকট্রন ত্যাগ করিয়ে ক্যাটায়ন বানান`
                        : `${currentDemo.electronsTransferred}টি ইলেকট্রন গ্রহণ করিয়ে অ্যানায়ন বানান`
                      : `Ionize Atom (Form ${currentDemo.ionSymbol})`}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: School Explanation & Valency Formula (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Reaction Equation Box */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-4 sm:p-5 backdrop-blur-md flex flex-col gap-2">
            <span className="text-[10px] uppercase font-bold text-slate-400">
              {language === 'bn' ? 'আয়ন গঠন সমীকরণ:' : 'Ionization Equation:'}
            </span>
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center font-mono font-bold text-amber-300 text-sm">
              {currentDemo.equationBn}
            </div>
          </div>

          {/* Valency vs Valence Electrons Comparison Box */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-4 sm:p-5 backdrop-blur-md flex flex-col gap-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{language === 'bn' ? 'যোজনী বনাম যোজ্যতা ইলেকট্রন' : 'Valency vs Valence Electrons'}</span>
            </h4>

            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block mb-0.5">
                  {language === 'bn' ? 'যোজ্যতা ইলেকট্রন' : 'Valence Electrons'}
                </span>
                <span className="text-base font-mono font-black text-amber-400">
                  {currentDemo.valenceElectrons}
                </span>
                <span className="text-[9px] text-slate-500 block mt-0.5">
                  (সর্ববহিঃস্থ স্তরের মোট e⁻)
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block mb-0.5">
                  {language === 'bn' ? 'যোজনী (Valency)' : 'Valency'}
                </span>
                <span className="text-base font-mono font-black text-cyan-300">
                  {currentDemo.valency}
                </span>
                <span className="text-[9px] text-slate-500 block mt-0.5">
                  (যুক্ত হওয়ার ক্ষমতা)
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 font-bengali leading-relaxed mt-1">
              {currentDemo.explanationBn}
            </p>
          </div>

          {/* Octet Rule Concept Card */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-4 backdrop-blur-md flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
              <Sparkles className="w-4 h-4" />
              <span>{language === 'bn' ? 'অষ্টক ও দ্বৈত নিয়ম (Octet & Duplet Rules)' : 'Octet & Duplet Rules'}</span>
            </div>
            <p className="text-[11px] text-slate-400 font-bengali leading-snug">
              {language === 'bn'
                ? 'পরমাণুসমূহ রাসায়নিক বন্ধন গঠনের সময় ইলেকট্রন আদান-প্রদান বা শেয়ারের মাধ্যমে তাদের সর্ববহিঃস্থ শক্তিস্তরে নিকটবর্তী নিষ্ক্রিয় গ্যাসের মতো ৮টি ইলেকট্রন (অষ্টক) অথবা হিলিয়ামের মতো ২টি ইলেকট্রন (দ্বৈত) অর্জন করার তীব্র প্রবণতা দেখায়।'
                : 'Atoms gain, lose, or share electrons during bonding to achieve an octet (8 valence electrons) or duplet (2 valence electrons as in He) for maximum stability.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
