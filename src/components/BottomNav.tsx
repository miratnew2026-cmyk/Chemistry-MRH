import React from 'react';
import {
  FlaskConical,
  Atom,
  Layers,
  Zap,
  TestTube2,
  Scale,
  BrainCircuit,
  BookOpen,
  Bot
} from 'lucide-react';
import { AppState } from '../types';

interface BottomNavProps {
  currentTab: AppState['activeTab'];
  onSelectTab: (tab: AppState['activeTab']) => void;
  language: 'bn' | 'en';
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  language
}) => {
  const tabs = [
    {
      id: 'lab' as const,
      labelBn: 'ল্যাব',
      labelEn: 'Lab',
      icon: FlaskConical,
      color: 'cyan'
    },
    {
      id: 'atom' as const,
      labelBn: 'পরমাণু',
      labelEn: 'Atom',
      icon: Atom,
      color: 'cyan'
    },
    {
      id: 'config' as const,
      labelBn: 'অরবিটাল',
      labelEn: 'Orbitals',
      icon: Layers,
      color: 'indigo'
    },
    {
      id: 'ions' as const,
      labelBn: 'আয়ন ও যোজনী',
      labelEn: 'Valency',
      icon: Zap,
      color: 'amber'
    },
    {
      id: 'table' as const,
      labelBn: 'সারণি',
      labelEn: 'Elements',
      icon: Atom,
      color: 'sky'
    },
    {
      id: 'compounds' as const,
      labelBn: 'যৌগ',
      labelEn: 'Compounds',
      icon: TestTube2,
      color: 'indigo'
    },
    {
      id: 'balancer' as const,
      labelBn: 'সমতাকরণ',
      labelEn: 'Balancer',
      icon: Scale,
      color: 'emerald'
    },
    {
      id: 'quiz' as const,
      labelBn: 'কুইজ',
      labelEn: 'Quiz',
      icon: BrainCircuit,
      color: 'amber'
    },
    {
      id: 'lessons' as const,
      labelBn: 'পাঠ',
      labelEn: 'Lessons',
      icon: BookOpen,
      color: 'violet'
    },
    {
      id: 'ai' as const,
      labelBn: 'AI সাহায্য',
      labelEn: 'AI Tutor',
      icon: Bot,
      color: 'rose'
    }
  ];

  return (
    <nav
      id="chemx-bottom-navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-slate-800/80 backdrop-blur-2xl px-1.5 py-1.5 transition-all shadow-2xl"
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between overflow-x-auto no-scrollbar gap-1 px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`tab-btn-${tab.id}`}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all relative shrink-0 ${
                isActive
                  ? 'text-cyan-400 bg-cyan-950/40 ring-1 ring-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isActive && (
                <span className="absolute -top-1 w-6 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-400 rounded-full shadow-[0_0_8px_#38bdf8]" />
              )}
              <Icon
                className={`w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform ${
                  isActive ? 'scale-110 text-cyan-400' : 'text-slate-400'
                }`}
              />
              <span
                className={`text-[9px] sm:text-[10px] font-medium tracking-tight mt-0.5 whitespace-nowrap ${
                  isActive ? 'font-bold text-cyan-300' : 'text-slate-400'
                }`}
              >
                {language === 'bn' ? tab.labelBn : tab.labelEn}
              </span>
            </button>
          );
        })}
      </div>

      {/* Footer credit as requested */}
      <div className="text-center pt-1 pb-0.5 border-t border-slate-800/40 mt-1">
        <p className="text-[9px] sm:text-[10px] font-mono tracking-wider text-slate-400/90 flex items-center justify-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
          <span>Creating with <span className="text-cyan-400 font-bold">MRT team</span></span>
        </p>
      </div>
    </nav>
  );
};
