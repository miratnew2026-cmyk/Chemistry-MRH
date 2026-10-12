import React from 'react';
import {
  FlaskConical,
  Volume2,
  VolumeX,
  Globe,
  Award,
  History,
  Moon,
  Sun,
  ShieldCheck
} from 'lucide-react';
import { AppState } from '../types';

interface NavbarProps {
  state: AppState;
  onUpdateState: (partial: Partial<AppState>) => void;
  onOpenHistory: () => void;
  onOpenAchievements: () => void;
  onOpenSafetyModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  state,
  onUpdateState,
  onOpenHistory,
  onOpenAchievements,
  onOpenSafetyModal
}) => {
  const toggleSound = () => {
    onUpdateState({ soundEnabled: !state.soundEnabled });
  };

  const toggleLanguage = () => {
    onUpdateState({ language: state.language === 'bn' ? 'en' : 'bn' });
  };

  const toggleTheme = () => {
    onUpdateState({ theme: state.theme === 'dark' ? 'light' : 'dark' });
  };

  // Level calculation: Every 100 XP is 1 level
  const userLevel = Math.floor(state.userXp / 100) + 1;
  const xpInCurrentLevel = state.userXp % 100;

  return (
    <header
      id="chemx-app-navbar"
      className="sticky top-0 z-40 w-full bg-slate-950/80 border-b border-cyan-900/30 backdrop-blur-xl px-3 sm:px-6 py-2.5 transition-colors"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Logo and Brand */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 text-white shadow-lg shadow-cyan-500/25 border border-cyan-400/30">
            <FlaskConical className="w-5 h-5 animate-pulse text-cyan-100" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400">
                CHEM-X
              </h1>
              <span className="text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                LAB 9-10
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium tracking-tight hidden sm:block">
              Mix. Heat. React. Discover. •{' '}
              <span className="text-cyan-400 font-bengali">ভার্চুয়াল কেমিস্ট্রি ল্যাব</span>
            </p>
          </div>
        </div>

        {/* Center / Stats: XP & Level */}
        <div className="hidden md:flex items-center gap-3 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-800">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
              ★
            </div>
            <span className="text-xs font-semibold text-slate-300">
              Lvl {userLevel}
            </span>
          </div>

          <div className="w-24 bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-400 to-cyan-400 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${xpInCurrentLevel}%` }}
            />
          </div>

          <span className="text-[11px] text-slate-400 font-mono">
            {state.userXp} XP
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* History Button */}
          <button
            id="nav-history-btn"
            onClick={onOpenHistory}
            className="p-1.5 sm:p-2 rounded-lg text-slate-300 hover:text-cyan-300 hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all flex items-center gap-1 text-xs"
            title="Experiment History"
          >
            <History className="w-4 h-4 text-slate-400" />
            <span className="hidden lg:inline text-xs font-medium">
              {state.language === 'bn' ? 'ইতিহাস' : 'History'}
            </span>
          </button>

          {/* Achievements Button */}
          <button
            id="nav-achievements-btn"
            onClick={onOpenAchievements}
            className="p-1.5 sm:p-2 rounded-lg text-slate-300 hover:text-amber-300 hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all flex items-center gap-1 text-xs"
            title="Achievements"
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span className="hidden lg:inline text-xs font-medium">
              {state.language === 'bn' ? 'অর্জন' : 'Badges'}
            </span>
          </button>

          {/* Safety Notice Button */}
          <button
            id="nav-safety-btn"
            onClick={onOpenSafetyModal}
            className="p-1.5 sm:p-2 rounded-lg text-amber-300/80 hover:text-amber-300 hover:bg-amber-950/30 border border-amber-500/20 transition-all"
            title="Safety Guidelines"
          >
            <ShieldCheck className="w-4 h-4" />
          </button>

          {/* Sound Toggle */}
          <button
            id="nav-sound-toggle-btn"
            onClick={toggleSound}
            className="p-1.5 sm:p-2 rounded-lg text-slate-300 hover:text-cyan-300 hover:bg-slate-900 transition-all"
            title={state.soundEnabled ? 'Mute sound' : 'Enable sound'}
          >
            {state.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-cyan-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Language Switch */}
          <button
            id="nav-language-toggle-btn"
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-cyan-950/40 text-cyan-300 border border-cyan-800/40 transition-all"
            title="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>{state.language === 'bn' ? 'বাংলা' : 'EN'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
