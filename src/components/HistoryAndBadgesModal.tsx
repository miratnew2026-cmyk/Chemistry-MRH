import React, { useState } from 'react';
import {
  History,
  Award,
  ShieldAlert,
  X,
  CheckCircle2,
  Calendar,
  Thermometer,
  Flame,
  Zap,
  Trash2
} from 'lucide-react';
import { ExperimentLog, Achievement } from '../types';

interface HistoryAndBadgesModalProps {
  isOpen: boolean;
  initialTab?: 'history' | 'achievements' | 'safety';
  onClose: () => void;
  history: ExperimentLog[];
  achievements: Achievement[];
  userXp: number;
  language: 'bn' | 'en';
  onClearHistory: () => void;
}

export const HistoryAndBadgesModal: React.FC<HistoryAndBadgesModalProps> = ({
  isOpen,
  initialTab = 'history',
  onClose,
  history,
  achievements,
  userXp,
  language,
  onClearHistory
}) => {
  const [activeTab, setActiveTab] = useState<'history' | 'achievements' | 'safety'>(initialTab);

  if (!isOpen) return null;

  return (
    <div
      id="history-badges-safety-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xl animate-fade-in"
    >
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-4">
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'history'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? `পরীক্ষার ইতিহাস (${history.length})` : `History (${history.length})`}</span>
          </button>

          <button
            onClick={() => setActiveTab('achievements')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'achievements'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'অর্জনসমূহ (Badges)' : 'Badges'}</span>
          </button>

          <button
            onClick={() => setActiveTab('safety')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'safety'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'নিরাপত্তা নির্দেশিকা' : 'Safety Rules'}</span>
          </button>
        </div>

        {/* TAB 1: EXPERIMENT HISTORY */}
        {activeTab === 'history' && (
          <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{language === 'bn' ? 'সম্পন্নকৃত সকল সিমুলেশন:' : 'Completed Lab Reactions:'}</span>
              {history.length > 0 && (
                <button
                  onClick={onClearHistory}
                  className="flex items-center gap-1 text-rose-400 hover:text-rose-300"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>{language === 'bn' ? 'ইতিহাস মুছুন' : 'Clear All'}</span>
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                {language === 'bn'
                  ? 'এখনও কোনো পরীক্ষা সম্পন্ন হয়নি। রিঅ্যাকশন ল্যাবে গিয়ে পরীক্ষা শুরু করুন!'
                  : 'No experiments conducted yet. Go to Reaction Lab to start experimenting!'}
              </div>
            ) : (
              history.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold font-mono text-cyan-300">
                      {log.reaction.balancedEquation}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400">
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-400">
                      {log.reaction.reactionType}
                    </span>
                    {log.wasHeated && (
                      <span className="flex items-center gap-0.5 text-amber-400">
                        <Flame className="w-3 h-3" /> Heated
                      </span>
                    )}
                    {log.wasFired && (
                      <span className="flex items-center gap-0.5 text-rose-400">
                        <Zap className="w-3 h-3" /> Ignited
                      </span>
                    )}
                    <span className="text-slate-500">
                      Temp: {log.tempFinal}°C
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 font-bengali leading-snug">
                    {log.notes}
                  </p>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: ACHIEVEMENTS & BADGES */}
        {activeTab === 'achievements' && (
          <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3">
            <div className="p-3 rounded-2xl bg-amber-950/30 border border-amber-500/20 text-xs text-amber-300 flex items-center justify-between">
              <span>{language === 'bn' ? 'বর্তমান মোট স্কোর:' : 'Total XP Earned:'}</span>
              <span className="font-mono font-bold text-sm">{userXp} XP</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {achievements.map((ach) => {
                const isUnlocked = ach.unlocked || userXp >= ach.xpReward;
                return (
                  <div
                    key={ach.id}
                    className={`p-3.5 rounded-2xl border flex items-start gap-3 transition-all ${
                      isUnlocked
                        ? 'bg-slate-950/80 border-amber-500/40 text-slate-200'
                        : 'bg-slate-950/40 border-slate-800 text-slate-500 opacity-60'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold ${
                        isUnlocked
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-slate-900 text-slate-600'
                      }`}
                    >
                      🏆
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-white">
                          {language === 'bn' ? ach.titleBangla : ach.title}
                        </h4>
                        {isUnlocked && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                      </div>

                      <p className="text-[11px] text-slate-400 mt-0.5 leading-snug font-bengali">
                        {language === 'bn' ? ach.descriptionBangla : ach.description}
                      </p>

                      <span className="text-[10px] font-mono text-amber-400/90 mt-1 block">
                        +{ach.xpReward} XP
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: MANDATORY SAFETY RULES */}
        {activeTab === 'safety' && (
          <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3 text-xs leading-relaxed text-slate-300">
            <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-amber-200 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-amber-300 mb-1">
                  {language === 'bn'
                    ? 'শিক্ষামূলক ডিজিটাল সিমুলেশন নীতি'
                    : 'Educational Digital Simulation Policy'}
                </h4>
                <p className="text-xs font-bengali">
                  {language === 'bn'
                    ? 'এই অ্যাপের সব experiment সম্পূর্ণ শিক্ষামূলক digital simulation। বাস্তবে কোনো chemical experiment করার নির্দেশনা বা রাসায়নিক বস্তু তৈরির অনুপাত এখানে দেওয়া হয় না। বাস্তব জীবনে অনুমতিহীন ও অপরিকল্পিত রাসায়নিক পরীক্ষা অত্যন্ত ঝুঁকিপূর্ণ।'
                    : 'All chemical interactions in CHEM-X are educational digital simulations designed strictly for Class 9–10 learning. We never provide dangerous real-world chemical preparation procedures or hazardous mixing ratios.'}
                </p>
              </div>
            </div>

            <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 flex flex-col gap-2">
              <h5 className="font-bold text-slate-200 uppercase text-[11px]">
                {language === 'bn' ? 'বাস্তব ল্যাবরেটরি সুরক্ষা বিধি (Lab Safety):' : 'School Laboratory Safety Rules:'}
              </h5>
              <ul className="list-disc list-inside flex flex-col gap-1 text-[11px] text-slate-400 font-bengali">
                <li>বাস্তব বিজ্ঞানাগারে সর্বদা নিরাপত্তা চশমা (Safety Goggles) এবং অ্যাপ্রন পরিধান করুন।</li>
                <li>শিক্ষকের প্রত্যক্ষ তত্ত্বাবধান ছাড়া কোনো রাসায়নিক দ্রব্য স্পর্শ বা মিশ্রণ করবেন না।</li>
                <li>কোনো রাসায়নিকের গন্ধ সরাসরি নাকে নেবেন না বা স্বাদ গ্রহণ করবেন না।</li>
                <li>ল্যাবে যেকোনো দুর্ঘটনা বা ক্ষতের ক্ষেত্রে অবিলম্বে প্রাথমিক চিকিৎসা গ্রহণ করুন।</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
