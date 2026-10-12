import React, { useState } from 'react';
import {
  Scale,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  BookOpen,
  RotateCcw
} from 'lucide-react';
import { balanceEquation, PRESET_EQUATIONS, BalanceResult } from '../utils/equationBalancer';
import { AppState } from '../types';
import { playDiscoveryChime } from '../utils/audio';

interface EquationBalancerViewProps {
  state: AppState;
  onUpdateState: (partial: Partial<AppState>) => void;
}

export const EquationBalancerView: React.FC<EquationBalancerViewProps> = ({
  state,
  onUpdateState
}) => {
  const { language } = state;
  const [inputEquation, setInputEquation] = useState('H2 + O2 -> H2O');
  const [result, setResult] = useState<BalanceResult | null>(() => balanceEquation('H2 + O2 -> H2O'));

  const handleBalance = (eqToBalance?: string) => {
    const target = eqToBalance || inputEquation;
    const res = balanceEquation(target);
    setResult(res);

    if (res.success) {
      playDiscoveryChime();
      onUpdateState({ userXp: state.userXp + 20 });
    }
  };

  const handleSelectPreset = (raw: string) => {
    setInputEquation(raw);
    handleBalance(raw);
  };

  return (
    <div id="chemx-equation-balancer-view" className="flex flex-col gap-4 pb-20">
      {/* Header */}
      <div className="bg-slate-900/60 p-4 rounded-3xl border border-slate-800 backdrop-blur-md flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>{language === 'bn' ? 'রাসায়নিক সমীকরণ সমতাকরণ' : 'Step-by-Step Equation Balancer'}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                CLASS 9-10
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              {language === 'bn'
                ? 'ল্যাভয়সিয়ারের ভরের নিত্যতা সূত্র ও পরমাণুর সংখ্যা গণনা করে ধাপভিত্তিক সমতা'
                : 'Balanced by conservation of mass with full stoichiometric deductions'}
            </p>
          </div>
        </div>
      </div>

      {/* Input Box & Presets */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-4 sm:p-5 backdrop-blur-md flex flex-col gap-3">
        <label className="text-xs font-semibold text-slate-300">
          {language === 'bn' ? 'রাসায়নিক সমীকরণ লিখুন:' : 'Enter Chemical Equation:'}
        </label>

        <div className="flex flex-col sm:flex-row items-center gap-2">
          <input
            id="balancer-input-field"
            type="text"
            value={inputEquation}
            onChange={(e) => setInputEquation(e.target.value)}
            placeholder="e.g. Zn + HCl -> ZnCl2 + H2"
            className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-3 text-sm font-mono text-cyan-300 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
          />

          <button
            id="balancer-submit-btn"
            onClick={() => handleBalance()}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>{language === 'bn' ? 'সমতা করুন' : 'Balance'}</span>
          </button>
        </div>

        {/* Quick Presets */}
        <div className="mt-2">
          <span className="text-[11px] font-medium text-slate-400 block mb-1.5">
            {language === 'bn' ? 'মাধ্যমিক সিলেবাসের জনপ্রিয় সমীকরণ:' : 'Common Curriculum Equations:'}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_EQUATIONS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectPreset(preset.raw)}
                className="text-xs px-2.5 py-1 rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 text-slate-300 hover:text-emerald-300 font-mono transition-all"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* BALANCED RESULT & STEP-BY-STEP DEDUCTIONS */}
      {result && (
        <div className="flex flex-col gap-4">
          {result.success ? (
            <>
              {/* Final Balanced Showcase Card */}
              <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-500/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                      {language === 'bn' ? 'সঠিকভাবে সমতাকৃত সমীকরণ' : 'BALANCED EQUATION'}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black font-mono text-white tracking-wide">
                      {result.balancedEquation}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full text-xs text-emerald-300 font-medium">
                  <span>{language === 'bn' ? 'ভরের নিত্যতা সংরক্ষিত ✓' : 'Mass Conserved ✓'}</span>
                </div>
              </div>

              {/* Step-by-Step Educational Explanation */}
              <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-4 sm:p-5 flex flex-col gap-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  {language === 'bn' ? 'ধাপভিত্তিক সমতাকরণ ব্যাখ্যা:' : 'Step-by-Step Explanation:'}
                </h4>

                <div className="flex flex-col gap-3">
                  {result.steps.map((step) => (
                    <div
                      key={step.stepNumber}
                      className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col gap-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-400">
                          {language === 'bn' ? `ধাপ ${step.stepNumber}: ${step.titleBangla}` : `Step ${step.stepNumber}: ${step.titleEnglish}`}
                        </span>
                        <span className="font-mono text-xs text-slate-300 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
                          {step.currentEquation}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 font-bengali leading-relaxed">
                        {language === 'bn' ? step.descriptionBangla : step.descriptionEnglish}
                      </p>

                      {/* Atom Counts Matrix Table */}
                      <div className="mt-1 bg-slate-900/90 rounded-xl p-2.5 border border-slate-800/80">
                        <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">
                          {language === 'bn' ? 'পরমাণুর সংখ্যা যাচাই:' : 'Atom Count Balance:'}
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                          {Object.keys(step.reactantCounts).map((elem) => {
                            const left = step.reactantCounts[elem];
                            const right = step.productCounts[elem];
                            const isMatch = left === right;

                            return (
                              <div
                                key={elem}
                                className={`p-2 rounded-lg border flex items-center justify-between font-mono ${
                                  isMatch
                                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                                    : 'bg-amber-950/20 border-amber-500/30 text-amber-300'
                                }`}
                              >
                                <span className="font-bold">{elem}:</span>
                                <span>
                                  L: {left} | R: {right} {isMatch ? '✓' : '≠'}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="p-4 rounded-3xl bg-rose-950/30 border border-rose-800/50 text-rose-200 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-rose-300 mb-1">
                  {language === 'bn' ? 'সমতাকরণে ত্রুটি' : 'Balancing Error'}
                </h4>
                <p className="text-xs text-rose-200/90 leading-relaxed font-bengali">
                  {language === 'bn' ? result.errorMessageBangla : result.errorMessageEnglish}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
