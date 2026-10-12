import React, { useState, useEffect } from 'react';
import { AppState, ExperimentLog } from './types';
import { INITIAL_ACHIEVEMENTS } from './data/achievements';
import { SafetyBanner } from './components/SafetyBanner';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { ReactionLab } from './components/ReactionLab';
import { AtomicStructureLab } from './components/AtomicStructureLab';
import { ElectronConfigLab } from './components/ElectronConfigLab';
import { IonAndValencyLab } from './components/IonAndValencyLab';
import { PeriodicTable } from './components/PeriodicTable';
import { CompoundsView } from './components/CompoundsView';
import { EquationBalancerView } from './components/EquationBalancerView';
import { QuizView } from './components/QuizView';
import { LessonsView } from './components/LessonsView';
import { AiAssistantView } from './components/AiAssistantView';
import { HistoryAndBadgesModal } from './components/HistoryAndBadgesModal';
import { setSoundEnabled } from './utils/audio';

export function App() {
  const [state, setState] = useState<AppState>(() => {
    const savedXp = localStorage.getItem('chemx_user_xp');
    const savedLang = localStorage.getItem('chemx_lang');
    return {
      activeTab: 'lab',
      selectedSubstances: [],
      currentReaction: null,
      heatLevel: 0,
      temperature: 25,
      language: savedLang === 'en' ? 'en' : 'bn',
      soundEnabled: true,
      theme: 'dark',
      history: [],
      achievements: INITIAL_ACHIEVEMENTS,
      userXp: savedXp ? parseInt(savedXp, 10) : 100
    };
  });

  const [modalTab, setModalTab] = useState<'history' | 'achievements' | 'safety' | null>(null);

  // Sync sound setting
  useEffect(() => {
    setSoundEnabled(state.soundEnabled);
  }, [state.soundEnabled]);

  // Persist XP and language
  useEffect(() => {
    localStorage.setItem('chemx_user_xp', state.userXp.toString());
  }, [state.userXp]);

  useEffect(() => {
    localStorage.setItem('chemx_lang', state.language);
  }, [state.language]);

  const updateState = (partial: Partial<AppState>) => {
    setState((prev) => ({ ...prev, ...partial }));
  };

  const handleAddHistory = (log: ExperimentLog) => {
    setState((prev) => ({
      ...prev,
      history: [log, ...prev.history]
    }));
  };

  const handleClearHistory = () => {
    setState((prev) => ({ ...prev, history: [] }));
  };

  // Add substance directly to lab from Periodic Table or Compounds view
  const handleSendToLab = (substanceId: string) => {
    setState((prev) => {
      const alreadyIn = prev.selectedSubstances.includes(substanceId);
      if (alreadyIn || prev.selectedSubstances.length >= 3) {
        return { ...prev, activeTab: 'lab' };
      }
      return {
        ...prev,
        selectedSubstances: [...prev.selectedSubstances, substanceId],
        activeTab: 'lab'
      };
    });
  };

  return (
    <div
      id="chemx-app-root"
      className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200"
    >
      {/* Top Digital Simulation Safety Banner */}
      <SafetyBanner language={state.language} />

      {/* Top Navbar */}
      <Navbar
        state={state}
        onUpdateState={updateState}
        onOpenHistory={() => setModalTab('history')}
        onOpenAchievements={() => setModalTab('achievements')}
        onOpenSafetyModal={() => setModalTab('safety')}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 pt-4 pb-16">
        {state.activeTab === 'lab' && (
          <ReactionLab
            state={state}
            onUpdateState={updateState}
            onAddHistory={handleAddHistory}
            onNavigateTab={(tab) => updateState({ activeTab: tab })}
          />
        )}

        {state.activeTab === 'atom' && (
          <AtomicStructureLab
            state={state}
            onNavigateTab={(tab) => updateState({ activeTab: tab })}
            onSelectSubstanceForLab={handleSendToLab}
          />
        )}

        {state.activeTab === 'config' && (
          <ElectronConfigLab
            state={state}
            onNavigateTab={(tab) => updateState({ activeTab: tab })}
            onSelectSubstanceForLab={handleSendToLab}
          />
        )}

        {state.activeTab === 'ions' && (
          <IonAndValencyLab
            state={state}
            onNavigateTab={(tab) => updateState({ activeTab: tab })}
          />
        )}

        {state.activeTab === 'table' && (
          <PeriodicTable
            state={state}
            onSendToLab={handleSendToLab}
            onNavigateTab={(tab) => updateState({ activeTab: tab })}
          />
        )}

        {state.activeTab === 'compounds' && (
          <CompoundsView
            state={state}
            onSendToLab={handleSendToLab}
            onNavigateTab={(tab) => updateState({ activeTab: tab })}
          />
        )}

        {state.activeTab === 'balancer' && (
          <EquationBalancerView
            state={state}
            onUpdateState={updateState}
          />
        )}

        {state.activeTab === 'quiz' && (
          <QuizView
            state={state}
            onUpdateState={updateState}
          />
        )}

        {state.activeTab === 'lessons' && (
          <LessonsView
            state={state}
            onNavigateTab={(tab) => updateState({ activeTab: tab })}
          />
        )}

        {state.activeTab === 'ai' && (
          <AiAssistantView state={state} />
        )}

        {/* Footer Attribution */}
        <footer className="w-full text-center pt-6 pb-20 text-slate-500">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs text-slate-400 backdrop-blur-md shadow-md">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span className="font-mono text-cyan-300 font-medium">Creating with MRT team</span>
          </div>
        </footer>
      </main>

      {/* Android-first Bottom Navigation Bar */}
      <BottomNav
        currentTab={state.activeTab}
        onSelectTab={(tab) => updateState({ activeTab: tab })}
        language={state.language}
      />

      {/* History, Badges & Safety Guidelines Modal */}
      <HistoryAndBadgesModal
        isOpen={modalTab !== null}
        initialTab={modalTab || 'history'}
        onClose={() => setModalTab(null)}
        history={state.history}
        achievements={state.achievements}
        userXp={state.userXp}
        language={state.language}
        onClearHistory={handleClearHistory}
      />
    </div>
  );
}

export default App;
