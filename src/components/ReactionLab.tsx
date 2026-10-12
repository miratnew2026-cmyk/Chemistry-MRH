import React, { useState, useEffect, useMemo } from 'react';
import {
  Flame,
  Thermometer,
  RotateCcw,
  Sparkles,
  Zap,
  Info,
  CheckCircle2,
  AlertTriangle,
  Search,
  Plus,
  X,
  Volume2,
  ExternalLink,
  BookOpen,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ChemicalElement, Compound, ChemicalReaction, ExperimentLog, AppState } from '../types';
import { ELEMENTS } from '../data/elements';
import { COMPOUNDS } from '../data/compounds';
import { VERIFIED_REACTIONS, findVerifiedReaction } from '../data/reactions';
import {
  playBubbleSound,
  playPopSound,
  playBurnerSound,
  playDiscoveryChime,
  isSoundEnabled
} from '../utils/audio';

interface ReactionLabProps {
  state: AppState;
  onUpdateState: (partial: Partial<AppState>) => void;
  onAddHistory: (log: ExperimentLog) => void;
  onNavigateTab: (tab: AppState['activeTab']) => void;
}

export const ReactionLab: React.FC<ReactionLabProps> = ({
  state,
  onUpdateState,
  onAddHistory,
  onNavigateTab
}) => {
  const { language } = state;

  // Lab Chamber State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [heatLevel, setHeatLevel] = useState<0 | 1 | 2 | 3>(0); // 0: Off, 1: 80C, 2: 180C, 3: 300C
  const [isFired, setIsFired] = useState(false);
  const [temperature, setTemperature] = useState(25);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeReaction, setActiveReaction] = useState<ChemicalReaction | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{
    type: 'info' | 'warning' | 'error' | 'success';
    textBn: string;
    textEn: string;
  } | null>(null);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);

  // Substance tray filters
  const [substanceTab, setSubstanceTab] = useState<'elements' | 'compounds'>('compounds');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Liquid color and animation in flask
  const [flaskLiquidColor, setFlaskLiquidColor] = useState<string>('rgba(56, 189, 248, 0.2)');
  const [liquidHeight, setLiquidHeight] = useState<number>(20);
  const [showBubbles, setShowBubbles] = useState(false);
  const [showSmoke, setShowSmoke] = useState(false);
  const [showPrecipitate, setShowPrecipitate] = useState(false);
  const [precipitateColor, setPrecipitateColor] = useState<string>('#b45309');
  const [sparkGlow, setSparkGlow] = useState(false);

  // Handle temperature based on heatLevel
  useEffect(() => {
    let targetTemp = 25;
    if (heatLevel === 1) targetTemp = 80;
    if (heatLevel === 2) targetTemp = 180;
    if (heatLevel === 3) targetTemp = 320;
    if (activeReaction && activeReaction.temperatureRise) {
      targetTemp += activeReaction.temperatureRise;
    }

    const interval = setInterval(() => {
      setTemperature((curr) => {
        if (curr < targetTemp) return Math.min(curr + 5, targetTemp);
        if (curr > targetTemp) return Math.max(curr - 4, targetTemp);
        return curr;
      });
    }, 60);

    return () => clearInterval(interval);
  }, [heatLevel, activeReaction]);

  // Update beaker visual appearance when substances change
  useEffect(() => {
    if (selectedIds.length === 0) {
      setFlaskLiquidColor('rgba(56, 189, 248, 0.15)');
      setLiquidHeight(15);
      setShowBubbles(false);
      setShowSmoke(false);
      setShowPrecipitate(false);
      setActiveReaction(null);
      setFeedbackMessage(null);
      return;
    }

    setLiquidHeight(Math.min(25 + selectedIds.length * 20, 75));

    // Determine blended color of reactants
    if (selectedIds.includes('CuSO4')) {
      setFlaskLiquidColor('rgba(2, 132, 199, 0.7)'); // blue
    } else if (selectedIds.includes('HCl')) {
      setFlaskLiquidColor('rgba(225, 29, 72, 0.35)'); // faint reddish acid
    } else if (selectedIds.includes('NaOH')) {
      setFlaskLiquidColor('rgba(139, 92, 246, 0.35)'); // purple tint
    } else if (selectedIds.includes('Fe')) {
      setFlaskLiquidColor('rgba(148, 163, 184, 0.5)'); // silvery gray
    } else if (selectedIds.includes('S')) {
      setFlaskLiquidColor('rgba(234, 179, 8, 0.6)'); // yellow
    } else {
      setFlaskLiquidColor('rgba(56, 189, 248, 0.35)');
    }
  }, [selectedIds]);

  // Filtered elements and compounds for the tray
  const filteredElements = useMemo(() => {
    const commonSymbols = [
      'H', 'O', 'Fe', 'Zn', 'Cu', 'Mg', 'S', 'C', 'N', 'Na', 'K', 'Cl', 'Ca', 'Al', 'Ag'
    ];
    return ELEMENTS.filter((el) => {
      const isCommon = commonSymbols.includes(el.symbol);
      const matchesSearch =
        el.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        el.nameBangla.includes(searchQuery) ||
        el.symbol.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat =
        selectedCategory === 'all' ||
        el.category.toLowerCase().includes(selectedCategory.toLowerCase());
      return matchesSearch && matchesCat;
    });
  }, [searchQuery, selectedCategory]);

  const filteredCompounds = useMemo(() => {
    return COMPOUNDS.filter((cp) => {
      const matchesSearch =
        cp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cp.nameBangla.includes(searchQuery) ||
        cp.formula.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat =
        selectedCategory === 'all' ||
        cp.category.toLowerCase().includes(selectedCategory.toLowerCase());
      return matchesSearch && matchesCat;
    });
  }, [searchQuery, selectedCategory]);

  const handleAddSubstance = (id: string) => {
    if (selectedIds.length >= 3) {
      setFeedbackMessage({
        type: 'warning',
        textBn: 'চেম্বারে একসাথে সর্বোচ্চ ৩টি পদার্থ যোগ করা যাবে।',
        textEn: 'A maximum of 3 substances can be placed in the chamber at once.'
      });
      return;
    }
    if (selectedIds.includes(id)) {
      setFeedbackMessage({
        type: 'info',
        textBn: 'এই পদার্থটি ইতিমধ্যেই চেম্বারে রয়েছে।',
        textEn: 'This substance is already in the chamber.'
      });
      return;
    }

    playBubbleSound();
    setSelectedIds([...selectedIds, id]);
    setFeedbackMessage(null);
  };

  const handleRemoveSubstance = (id: string) => {
    setSelectedIds(selectedIds.filter((item) => item !== id));
    setActiveReaction(null);
    setFeedbackMessage(null);
  };

  const handleClearChamber = () => {
    setSelectedIds([]);
    setHeatLevel(0);
    setIsFired(false);
    setActiveReaction(null);
    setShowBubbles(false);
    setShowSmoke(false);
    setShowPrecipitate(false);
    setFeedbackMessage(null);
  };

  const handleToggleHeat = () => {
    const nextLevel = ((heatLevel + 1) % 4) as 0 | 1 | 2 | 3;
    setHeatLevel(nextLevel);
    if (nextLevel > 0) {
      playBurnerSound();
    }
    setFeedbackMessage(null);
  };

  const handleTriggerFire = () => {
    setIsFired(!isFired);
    playPopSound();
    setSparkGlow(true);
    setTimeout(() => setSparkGlow(false), 500);
    setFeedbackMessage(null);
  };

  // Run the virtual chemical reaction simulation
  const handleRunReaction = () => {
    if (selectedIds.length === 0) {
      setFeedbackMessage({
        type: 'warning',
        textBn: 'বিক্রিয়া শুরু করতে প্রথমে ট্রে থেকে অন্তত একটি বা দুটি পদার্থ যোগ করুন।',
        textEn: 'Please select at least 1 or 2 substances from the tray first.'
      });
      return;
    }

    setIsSimulating(true);
    setFeedbackMessage(null);

    const isHeated = heatLevel > 0;
    const match = findVerifiedReaction(selectedIds, isHeated, isFired, temperature);

    if (match.needsHeat || match.needsFire) {
      setIsSimulating(false);
      if (match.needsHeat) {
        setFeedbackMessage({
          type: 'warning',
          textBn: match.reasonBangla || 'এই বিক্রিয়ার জন্য তাপ (HEAT) প্রয়োজন!',
          textEn: match.reasonEnglish || 'Thermal heat is required for activation.'
        });
      } else {
        setFeedbackMessage({
          type: 'warning',
          textBn: match.reasonBangla || 'এই দহনের জন্য অগ্নিশিখা (FIRE) প্রয়োজন!',
          textEn: match.reasonEnglish || 'Ignition flame (FIRE) is required for combustion.'
        });
      }
      return;
    }

    if (!match.reaction) {
      setIsSimulating(false);
      setFeedbackMessage({
        type: 'error',
        textBn:
          'এই উপাদানগুলোর জন্য কোনো অনুমোদিত রাসায়নিক বিক্রিয়া পাওয়া যায়নি। নিরাপদ ও ভেরিফাইড বিক্রিয়া পরীক্ষা করতে সাহায্যকারী প্রেসক্রিপশন দেখুন।',
        textEn:
          'No verified chemical reaction found for this combination in the curriculum database.'
      });
      return;
    }

    const rxn = match.reaction;

    // Trigger visual effects sequence
    if (rxn.visualEffects?.bubbles) {
      setShowBubbles(true);
      playBubbleSound();
    }
    if (rxn.visualEffects?.gasVapor) {
      setShowSmoke(true);
    }
    if (rxn.visualEffects?.soundEffect === 'pop') {
      playPopSound();
    }

    // Color shift animation
    setTimeout(() => {
      if (rxn.colorChange) {
        setFlaskLiquidColor(rxn.colorChange.to);
      }
      if (rxn.visualEffects?.precipitate) {
        setShowPrecipitate(true);
        if (rxn.id === 'rxn_fe_cuso4') {
          setPrecipitateColor('#b45309'); // Reddish copper metal
          setFlaskLiquidColor('rgba(132, 204, 22, 0.7)'); // pale green FeSO4
        } else if (rxn.id === 'rxn_naoh_cuso4') {
          setPrecipitateColor('#38bdf8'); // pale blue gel
        }
      }

      playDiscoveryChime();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });

      setActiveReaction(rxn);
      setIsSimulating(false);
      setShowAnalysisModal(true);

      // Award XP
      const newXp = state.userXp + 60;
      onUpdateState({ userXp: newXp });

      // Save to History
      const log: ExperimentLog = {
        id: `exp_${Date.now()}`,
        timestamp: Date.now(),
        reaction: rxn,
        reactantsUsed: [...selectedIds],
        wasHeated: isHeated,
        wasFired: isFired,
        tempFinal: temperature + (rxn.temperatureRise || 0),
        notes: rxn.explanationBangla
      };
      onAddHistory(log);
    }, 1200);
  };

  // Helper to get substance label
  const getSubstanceDisplay = (id: string) => {
    const el = ELEMENTS.find((e) => e.symbol === id);
    if (el) return { formula: el.symbol, name: el.name, nameBn: el.nameBangla, color: '#38bdf8' };
    const cp = COMPOUNDS.find((c) => c.id === id);
    if (cp) return { formula: cp.formula, name: cp.name, nameBn: cp.nameBangla, color: cp.colorHex };
    return { formula: id, name: id, nameBn: id, color: '#94a3b8' };
  };

  return (
    <div id="chemx-reaction-lab-container" className="flex flex-col gap-4 pb-20">
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between bg-slate-900/60 p-3 rounded-2xl border border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
            🧪
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-1.5">
              <span>{language === 'bn' ? 'ভার্চুয়াল রিঅ্যাকশন চেম্বার' : 'Virtual Reaction Chamber'}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                ACTIVE
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">
              {language === 'bn'
                ? 'উপাদান যোগ করে হিট বা ফায়ার দিয়ে বিক্রিয়া পর্যবেক্ষণ করুন'
                : 'Mix reagents, apply heat/fire, and discover products'}
            </p>
          </div>
        </div>

        <button
          id="lab-reset-chamber-btn"
          onClick={handleClearChamber}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-rose-400 bg-slate-800/80 hover:bg-slate-800 rounded-xl border border-slate-700 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'রিসেট' : 'Clear'}</span>
        </button>
      </div>

      {/* Main Laboratory Workbench: Visual Chamber */}
      <div className="relative w-full rounded-3xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-cyan-900/40 p-4 sm:p-6 overflow-hidden shadow-2xl">
        {/* Background Grid & Ambient Glow */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-colors duration-1000"
          style={{
            backgroundColor: isFired
              ? 'rgba(239, 68, 68, 0.15)'
              : heatLevel > 0
              ? 'rgba(245, 158, 11, 0.15)'
              : 'rgba(56, 189, 248, 0.1)'
          }}
        />

        <div className="relative z-10 flex flex-col items-center">
          {/* Temperature & Environmental Gauge */}
          <div className="w-full flex items-center justify-between mb-4 px-2">
            <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-full border border-slate-800 text-xs">
              <Thermometer
                className={`w-4 h-4 ${
                  temperature > 100
                    ? 'text-rose-500 animate-pulse'
                    : temperature > 50
                    ? 'text-amber-400'
                    : 'text-cyan-400'
                }`}
              />
              <span className="font-mono font-bold text-slate-200">
                {temperature}°C
              </span>
              <span className="text-[10px] text-slate-400 uppercase">
                {temperature > 100 ? 'High' : temperature > 50 ? 'Warm' : 'Ambient'}
              </span>
            </div>

            {/* Spark/Ignition Active indicator */}
            {isFired && (
              <div className="flex items-center gap-1.5 bg-rose-950/70 border border-rose-500/50 text-rose-300 px-2.5 py-1 rounded-full text-xs font-semibold animate-pulse">
                <Flame className="w-3.5 h-3.5 text-rose-400" />
                <span>{language === 'bn' ? 'শিখা সক্রিয়' : 'Flame Active'}</span>
              </div>
            )}
          </div>

          {/* BEAKER / FLASK CONTAINER */}
          <div className="relative flex flex-col items-center my-2">
            {/* Vapor / Smoke Effect */}
            {showSmoke && (
              <div className="absolute -top-12 flex gap-3 pointer-events-none">
                <div className="w-4 h-12 bg-white/20 rounded-full blur-md animate-bounce" />
                <div className="w-6 h-14 bg-cyan-200/20 rounded-full blur-md animate-pulse delay-100" />
                <div className="w-5 h-10 bg-white/15 rounded-full blur-md animate-bounce delay-200" />
              </div>
            )}

            {/* Beaker Glass Body */}
            <div className="relative w-44 sm:w-56 h-60 sm:h-68 rounded-b-3xl border-b-4 border-x-4 border-cyan-400/40 bg-gradient-to-b from-white/5 to-cyan-500/5 backdrop-blur-md overflow-hidden flex flex-col justify-end p-2 shadow-[0_0_30px_rgba(56,189,248,0.15)]">
              {/* Glass Top Lip */}
              <div className="absolute top-0 left-0 right-0 h-3 border-t-2 border-cyan-300/40 rounded-t-sm" />

              {/* Measurement Graduation Lines */}
              <div className="absolute left-2 top-8 bottom-6 flex flex-col justify-between text-[9px] font-mono text-cyan-300/50 select-none pointer-events-none">
                <span>— 400ml</span>
                <span>— 300ml</span>
                <span>— 200ml</span>
                <span>— 100ml</span>
              </div>

              {/* Dynamic Liquid Substance */}
              <div
                className="w-full rounded-b-2xl transition-all duration-1000 relative flex items-center justify-center overflow-hidden"
                style={{
                  height: `${liquidHeight}%`,
                  backgroundColor: flaskLiquidColor
                }}
              >
                {/* Meniscus curved top reflection */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-white/25 rounded-full blur-[1px]" />

                {/* Bubbles Simulation */}
                {(showBubbles || isSimulating) && (
                  <div className="absolute inset-0 pointer-events-none flex justify-around">
                    <span className="w-2 h-2 rounded-full bg-white/60 animate-ping delay-75" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-bounce delay-150" />
                    <span className="w-2.5 h-2.5 rounded-full bg-white/50 animate-pulse delay-300" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-ping delay-500" />
                  </div>
                )}

                {/* Precipitate Sediment at the bottom */}
                {showPrecipitate && (
                  <div
                    className="absolute bottom-0 left-0 right-0 h-4 rounded-b-2xl transition-all duration-700 shadow-inner"
                    style={{ backgroundColor: precipitateColor }}
                  >
                    <div className="absolute inset-0 bg-black/20" />
                  </div>
                )}

                {/* Floating substance tags inside beaker */}
                <div className="flex flex-wrap items-center justify-center gap-1 z-10 px-2">
                  {selectedIds.map((id) => {
                    const info = getSubstanceDisplay(id);
                    return (
                      <span
                        key={id}
                        className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-950/70 text-cyan-300 border border-cyan-400/40 shadow-sm"
                      >
                        {info.formula}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Glass Reflection Highlight */}
              <div className="absolute top-4 right-3 w-2 h-44 bg-gradient-to-b from-white/30 via-white/10 to-transparent rounded-full pointer-events-none" />
            </div>

            {/* Bunsen Burner / Heating Element below flask */}
            <div className="w-48 sm:w-60 flex flex-col items-center">
              {/* Wire gauze / stand */}
              <div className="w-full h-2 bg-slate-700 rounded-sm border-t border-slate-600 shadow-md" />

              {/* Flame Animation when Heat or Fire is active */}
              {(heatLevel > 0 || isFired) && (
                <div className="flex items-center justify-center gap-1 -mt-1 h-12">
                  <div
                    className={`w-6 h-10 rounded-full blur-[2px] transition-all duration-300 ${
                      heatLevel === 3
                        ? 'bg-gradient-to-t from-blue-500 via-cyan-400 to-amber-300 scale-125'
                        : heatLevel === 2
                        ? 'bg-gradient-to-t from-cyan-600 via-amber-400 to-yellow-200 scale-100'
                        : 'bg-gradient-to-t from-amber-600 to-yellow-400 scale-75'
                    } animate-pulse`}
                  />
                  <div
                    className={`w-4 h-8 rounded-full blur-[1px] ${
                      isFired ? 'bg-rose-500 animate-ping' : 'bg-blue-400'
                    }`}
                  />
                </div>
              )}

              {/* Burner Base Stand */}
              <div className="w-20 h-4 bg-slate-800 rounded-b-lg border border-slate-700 mt-1" />
            </div>
          </div>

          {/* Chamber Reagent Slots */}
          <div className="w-full max-w-md mt-4 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span>{language === 'bn' ? 'চেম্বারের উপাদানসমূহ:' : 'Chamber Reagents:'}</span>
              <span className="font-mono text-cyan-400">{selectedIds.length}/3</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[0, 1, 2].map((idx) => {
                const substanceId = selectedIds[idx];
                const info = substanceId ? getSubstanceDisplay(substanceId) : null;

                return (
                  <div
                    key={idx}
                    className={`h-16 rounded-2xl border flex flex-col items-center justify-center p-2 relative transition-all ${
                      info
                        ? 'bg-slate-900/90 border-cyan-500/40 shadow-lg shadow-cyan-950/50'
                        : 'border-dashed border-slate-800 bg-slate-950/40 text-slate-600'
                    }`}
                  >
                    {info ? (
                      <>
                        <button
                          onClick={() => handleRemoveSubstance(substanceId)}
                          className="absolute -top-1 -right-1 p-0.5 rounded-full bg-slate-800 text-slate-400 hover:text-rose-400 hover:bg-slate-700 border border-slate-600 transition-colors"
                          title="Remove"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-bold font-mono text-cyan-300">
                          {info.formula}
                        </span>
                        <span className="text-[10px] text-slate-400 truncate max-w-[90%]">
                          {language === 'bn' ? info.nameBn : info.name}
                        </span>
                      </>
                    ) : (
                      <span className="text-[11px] text-slate-600 font-medium">
                        {language === 'bn' ? `স্লট ${idx + 1}` : `Slot ${idx + 1}`}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Feedback & Instruction Message */}
          {feedbackMessage && (
            <div
              className={`mt-4 w-full max-w-md p-3 rounded-2xl text-xs flex items-start gap-2.5 transition-all ${
                feedbackMessage.type === 'error'
                  ? 'bg-rose-950/50 text-rose-200 border border-rose-800/60'
                  : feedbackMessage.type === 'warning'
                  ? 'bg-amber-950/50 text-amber-200 border border-amber-800/60'
                  : feedbackMessage.type === 'success'
                  ? 'bg-emerald-950/50 text-emerald-200 border border-emerald-800/60'
                  : 'bg-cyan-950/50 text-cyan-200 border border-cyan-800/60'
              }`}
            >
              {feedbackMessage.type === 'error' || feedbackMessage.type === 'warning' ? (
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              ) : (
                <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              )}
              <p className="leading-relaxed">
                {language === 'bn' ? feedbackMessage.textBn : feedbackMessage.textEn}
              </p>
            </div>
          )}

          {/* PRIMARY REACTION CONTROLS BAR */}
          <div className="w-full max-w-md grid grid-cols-3 gap-2.5 mt-5">
            {/* Heat Control Button */}
            <button
              id="lab-heat-toggle-btn"
              onClick={handleToggleHeat}
              className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-2xl border transition-all ${
                heatLevel > 0
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-1">
                <Flame className={`w-4 h-4 ${heatLevel > 0 ? 'text-amber-400' : 'text-slate-400'}`} />
                <span className="text-xs font-bold uppercase">
                  {language === 'bn' ? 'তাপ (HEAT)' : 'HEAT'}
                </span>
              </div>
              <span className="text-[10px] text-amber-400/80 mt-0.5">
                {heatLevel === 0
                  ? 'OFF'
                  : heatLevel === 1
                  ? 'LOW (80°C)'
                  : heatLevel === 2
                  ? 'MED (180°C)'
                  : 'HIGH (320°C)'}
              </span>
            </button>

            {/* Fire / Spark Button */}
            <button
              id="lab-fire-toggle-btn"
              onClick={handleTriggerFire}
              className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-2xl border transition-all ${
                isFired
                  ? 'bg-rose-500/25 border-rose-500/60 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-1">
                <Zap className={`w-4 h-4 ${isFired ? 'text-rose-400 animate-bounce' : 'text-slate-400'}`} />
                <span className="text-xs font-bold uppercase">
                  {language === 'bn' ? 'শিখা (FIRE)' : 'FIRE'}
                </span>
              </div>
              <span className="text-[10px] text-rose-400/80 mt-0.5">
                {isFired ? 'IGNITED' : 'OFF'}
              </span>
            </button>

            {/* Run Reaction Button */}
            <button
              id="lab-run-reaction-btn"
              onClick={handleRunReaction}
              disabled={isSimulating}
              className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-2xl font-bold uppercase tracking-wide transition-all shadow-lg ${
                isSimulating
                  ? 'bg-slate-800 text-slate-500 border border-slate-700'
                  : 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white hover:brightness-110 shadow-cyan-500/30 border border-cyan-400/40 active:scale-95'
              }`}
            >
              <div className="flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-cyan-200" />
                <span className="text-xs">
                  {language === 'bn' ? 'বিক্রিয়া চালান' : 'REACT'}
                </span>
              </div>
              <span className="text-[10px] text-cyan-200/90 font-normal">
                {isSimulating ? 'SIMULATING...' : 'DISCOVER'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* SUBSTANCE INVENTORY / SHELF TRAY */}
      <div className="w-full bg-slate-900/70 border border-slate-800 rounded-3xl p-4 backdrop-blur-md">
        {/* Tray Header & Category Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <button
              id="tray-tab-compounds"
              onClick={() => {
                setSubstanceTab('compounds');
                setSelectedCategory('all');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                substanceTab === 'compounds'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-950/40'
              }`}
            >
              🧴 {language === 'bn' ? 'যৌগসমূহ (Compounds)' : 'Compounds'}
            </button>

            <button
              id="tray-tab-elements"
              onClick={() => {
                setSubstanceTab('elements');
                setSelectedCategory('all');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                substanceTab === 'elements'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-950/40'
              }`}
            >
              ⚛️ {language === 'bn' ? 'মৌলসমূহ (Elements)' : 'Elements'}
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={
                language === 'bn'
                  ? 'সংকেত বা নাম দিয়ে খুঁজুন (e.g. HCl, Zn)...'
                  : 'Search by symbol or name...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-950/70 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 w-full sm:w-60"
            />
          </div>
        </div>

        {/* Substance Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 max-h-72 overflow-y-auto pr-1">
          {substanceTab === 'compounds'
            ? filteredCompounds.map((cp) => {
                const isSelected = selectedIds.includes(cp.id);
                return (
                  <button
                    key={cp.id}
                    id={`substance-btn-${cp.id}`}
                    onClick={() => handleAddSubstance(cp.id)}
                    className={`p-2.5 rounded-2xl border text-left flex flex-col justify-between transition-all group relative overflow-hidden ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-500/50 ring-1 ring-cyan-500/30'
                        : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-bold font-mono text-cyan-300">
                        {cp.formula}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded font-medium bg-slate-900 text-slate-400 border border-slate-800">
                        {cp.category}
                      </span>
                    </div>

                    <div className="mt-1.5">
                      <p className="text-xs font-medium text-slate-200 truncate group-hover:text-white">
                        {language === 'bn' ? cp.nameBangla : cp.name}
                      </p>
                      <p className="text-[10px] text-slate-400 flex items-center justify-between mt-0.5">
                        <span>{cp.state}</span>
                        <span>{cp.molecularWeight} g/mol</span>
                      </p>
                    </div>

                    <div className="mt-2 pt-1 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-cyan-400">
                      <span>{language === 'bn' ? '+ ল্যাবে নিন' : '+ Add to Lab'}</span>
                      <Plus className="w-3 h-3 group-hover:scale-125 transition-transform" />
                    </div>
                  </button>
                );
              })
            : filteredElements.map((el) => {
                const isSelected = selectedIds.includes(el.symbol);
                return (
                  <button
                    key={el.symbol}
                    id={`substance-btn-${el.symbol}`}
                    onClick={() => handleAddSubstance(el.symbol)}
                    className={`p-2.5 rounded-2xl border text-left flex flex-col justify-between transition-all group relative overflow-hidden ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-500/50 ring-1 ring-cyan-500/30'
                        : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-bold font-mono text-sky-400">
                        {el.symbol}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        #{el.atomicNumber}
                      </span>
                    </div>

                    <div className="mt-1.5">
                      <p className="text-xs font-medium text-slate-200 truncate group-hover:text-white">
                        {language === 'bn' ? el.nameBangla : el.name}
                      </p>
                      <p className="text-[10px] text-slate-400 flex items-center justify-between mt-0.5">
                        <span>{el.category}</span>
                        <span>{el.atomicMass.toFixed(1)}</span>
                      </p>
                    </div>

                    <div className="mt-2 pt-1 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-sky-400">
                      <span>{language === 'bn' ? '+ ল্যাবে নিন' : '+ Add to Lab'}</span>
                      <Plus className="w-3 h-3 group-hover:scale-125 transition-transform" />
                    </div>
                  </button>
                );
              })}
        </div>
      </div>

      {/* POPULAR CURRICULUM RECIPES QUICK PICK */}
      <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-3 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            {language === 'bn' ? 'মাধ্যমিক সিলেবাসের বিক্রিয়া প্রিসেট:' : 'Syllabus Reaction Presets:'}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { label: 'HCl + NaOH (প্রশমন)', ids: ['HCl', 'NaOH'], heat: 0, fire: false },
            { label: '2H₂ + O₂ (পানি)', ids: ['H2', 'O2'], heat: 1, fire: true },
            { label: 'Zn + HCl (হাইড্রোজেন গ্যাস)', ids: ['Zn', 'HCl'], heat: 0, fire: false },
            { label: 'Fe + CuSO₄ (নীল থেকে সবুজ)', ids: ['Fe', 'CuSO4'], heat: 0, fire: false },
            { label: 'CaCO₃ (চুনাপাথর বিযোজন)', ids: ['CaCO3'], heat: 3, fire: true },
            { label: '2Mg + O₂ (উজ্জ্বল শিখা)', ids: ['Mg', 'O2'], heat: 2, fire: true },
            { label: 'CH₄ + O₂ (মিথেন দহন)', ids: ['CH4', 'O2'], heat: 1, fire: true },
            { label: 'CuSO₄ + NaOH (নীল অধঃক্ষেপ)', ids: ['CuSO4', 'NaOH'], heat: 0, fire: false }
          ].map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedIds(preset.ids);
                setHeatLevel(preset.heat as 0 | 1 | 2 | 3);
                setIsFired(preset.fire);
                playBubbleSound();
              }}
              className="text-xs px-2.5 py-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 transition-all flex items-center gap-1"
            >
              <span>{preset.label}</span>
              <ChevronRight className="w-3 h-3 text-slate-500" />
            </button>
          ))}
        </div>
      </div>

      {/* REACTION ANALYSIS & DISCOVERY MODAL */}
      {showAnalysisModal && activeReaction && (
        <div
          id="reaction-analysis-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xl animate-fade-in"
        >
          <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-cyan-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              id="analysis-modal-close-btn"
              onClick={() => setShowAnalysisModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header / Success Badge */}
            <div className="flex items-center gap-2 mb-3">
              <span className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-5 h-5" />
              </span>
              <div>
                <span className="text-xs font-bold text-emerald-400 tracking-wider uppercase">
                  {language === 'bn' ? 'সফল রাসায়নিক বিক্রিয়া' : 'REACTION COMPLETED'}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white font-mono">
                  {activeReaction.balancedEquation}
                </h3>
              </div>
            </div>

            {/* Reaction Type Badges */}
            <div className="flex flex-wrap gap-2 my-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {activeReaction.reactionType}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  activeReaction.energyBehavior === 'exothermic'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                    : 'bg-sky-500/20 text-sky-300 border-sky-500/30'
                }`}
              >
                {activeReaction.energyBehavior === 'exothermic'
                  ? language === 'bn'
                    ? '🔥 তাপোৎপাদী বিক্রিয়া (Exothermic)'
                    : '🔥 Exothermic'
                  : language === 'bn'
                  ? '❄️ তাপহারী বিক্রিয়া (Endothermic)'
                  : '❄️ Endothermic'}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                +60 XP
              </span>
            </div>

            {/* Educational Explanation Box */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 my-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                {language === 'bn' ? 'বৈজ্ঞানিক ব্যাখ্যা (ব্যাখ্যা):' : 'Scientific Explanation:'}
              </h4>
              <p className="text-sm text-slate-200 leading-relaxed font-bengali">
                {language === 'bn'
                  ? activeReaction.explanationBangla
                  : activeReaction.explanationEnglish}
              </p>
            </div>

            {/* Product Details Grid */}
            <div className="my-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                {language === 'bn' ? 'উৎপাদিত পদার্থসমূহ (Products Formed):' : 'Products Formed:'}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeReaction.productDetails.map((prod, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-base font-bold font-mono text-cyan-300">
                          {prod.formula}
                        </span>
                        <p className="text-xs text-slate-300 font-medium">
                          {language === 'bn' ? prod.nameBangla : prod.name}
                        </p>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-slate-900 text-slate-400 border border-slate-700">
                        {prod.state}
                      </span>
                    </div>

                    <div className="mt-2 text-xs text-slate-400">
                      <p className="text-[11px] leading-snug">
                        <strong className="text-slate-300">
                          {language === 'bn' ? 'ধর্ম:' : 'Properties:'}
                        </strong>{' '}
                        {prod.properties}
                      </p>
                      <p className="text-[10px] text-cyan-400/90 mt-1">
                        {prod.schoolRelevance}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 pt-4 border-t border-slate-800">
              <button
                onClick={() => {
                  setShowAnalysisModal(false);
                  onNavigateTab('balancer');
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              >
                <span>{language === 'bn' ? 'ব্যালেন্সারে সমতা দেখুন' : 'Balance Equation'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => {
                    setShowAnalysisModal(false);
                    onNavigateTab('ai');
                  }}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 transition-colors"
                >
                  <span>{language === 'bn' ? 'AI সহকারীকে জিজ্ঞেস করুন' : 'Ask CHEM-X AI'}</span>
                </button>

                <button
                  onClick={() => setShowAnalysisModal(false)}
                  className="flex-1 sm:flex-initial px-5 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors"
                >
                  {language === 'bn' ? 'ল্যাবে চালিয়ে যান' : 'Continue in Lab'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
