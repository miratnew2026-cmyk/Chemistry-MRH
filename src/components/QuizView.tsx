import React, { useState } from 'react';
import {
  BrainCircuit,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Trophy,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QuizQuestion, AppState } from '../types';
import { QUIZ_QUESTIONS } from '../data/quizzes';
import { playDiscoveryChime, playBubbleSound } from '../utils/audio';

interface QuizViewProps {
  state: AppState;
  onUpdateState: (partial: Partial<AppState>) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({
  state,
  onUpdateState
}) => {
  const { language } = state;
  const [selectedDifficulty, setSelectedDifficulty] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  const filteredQuestions = QUIZ_QUESTIONS.filter((q) => {
    return selectedDifficulty === 'All' || q.difficulty === selectedDifficulty;
  });

  const currentQ = filteredQuestions[currentIndex] || filteredQuestions[0];
  const isAnswered = selectedAnswer !== null;
  const isCorrect = isAnswered && selectedAnswer === currentQ.correctIndex;

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedAnswer(idx);

    if (idx === currentQ.correctIndex) {
      playDiscoveryChime();
      setScore((s) => s + 1);
      setStreak((st) => st + 1);
      onUpdateState({ userXp: state.userXp + 25 });

      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 }
      });
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    if (currentIndex + 1 < filteredQuestions.length) {
      setCurrentIndex((i) => i + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handleResetQuiz = () => {
    setSelectedAnswer(null);
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
  };

  return (
    <div id="chemx-quiz-view" className="flex flex-col gap-4 pb-20">
      {/* Header & Stats */}
      <div className="bg-slate-900/60 p-4 rounded-3xl border border-slate-800 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            <BrainCircuit className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>{language === 'bn' ? 'রসায়ন জ্ঞান যাচাই ও কুইজ' : 'Chemistry Knowledge Quiz'}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                CLASS 9-10
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              {language === 'bn'
                ? 'বোর্ড পরীক্ষার উপযোগী গুরুত্বপূর্ণ বহুনির্বাচনী প্রশ্ন'
                : 'Curriculum-aligned multiple choice questions for board exam prep'}
            </p>
          </div>
        </div>

        {/* Score & Streak Counters */}
        <div className="flex items-center gap-3 bg-slate-950/70 px-4 py-2 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold">
            <Trophy className="w-4 h-4" />
            <span>Score: {score}</span>
          </div>

          <div className="h-4 w-px bg-slate-800" />

          <div className="flex items-center gap-1 text-xs text-cyan-400 font-bold">
            <span>🔥 Streak: {streak}</span>
          </div>
        </div>
      </div>

      {/* Difficulty Filter */}
      <div className="flex items-center gap-2">
        {(['All', 'Easy', 'Medium', 'Hard'] as const).map((diff) => (
          <button
            key={diff}
            onClick={() => {
              setSelectedDifficulty(diff);
              setCurrentIndex(0);
              setSelectedAnswer(null);
            }}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              selectedDifficulty === diff
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {diff}
          </button>
        ))}
      </div>

      {/* Main Question Card */}
      {currentQ && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5 sm:p-6 backdrop-blur-md flex flex-col gap-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="px-2.5 py-0.5 rounded-full font-mono bg-slate-950 text-slate-400 border border-slate-800">
              Topic: {currentQ.topic}
            </span>
            <span className="font-mono">
              Q {currentIndex + 1} of {filteredQuestions.length}
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-white font-bengali leading-snug">
            {language === 'bn' ? currentQ.questionBangla : currentQ.questionEnglish}
          </h3>

          {/* Options List */}
          <div className="flex flex-col gap-2.5 mt-2">
            {currentQ.options.map((option, idx) => {
              let btnStyle = 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-200';

              if (isAnswered) {
                if (idx === currentQ.correctIndex) {
                  btnStyle = 'bg-emerald-950/50 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500/50';
                } else if (idx === selectedAnswer) {
                  btnStyle = 'bg-rose-950/50 border-rose-500 text-rose-200 ring-1 ring-rose-500/50';
                } else {
                  btnStyle = 'bg-slate-950/40 border-slate-800/60 text-slate-500 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  id={`quiz-option-${idx}`}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered}
                  className={`p-3.5 rounded-2xl border text-left flex items-center justify-between text-xs sm:text-sm font-medium transition-all ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center font-mono text-xs font-bold text-slate-400">
                      {['A', 'B', 'C', 'D'][idx]}
                    </span>
                    <span>{option}</span>
                  </div>

                  {isAnswered && idx === currentQ.correctIndex && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  )}
                  {isAnswered && idx === selectedAnswer && idx !== currentQ.correctIndex && (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box on Answer */}
          {isAnswered && (
            <div className="mt-3 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col gap-2 animate-fade-in">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                {language === 'bn' ? 'সঠিক উত্তরের ব্যাখ্যা:' : 'Explanation:'}
              </span>
              <p className="text-xs text-slate-300 font-bengali leading-relaxed">
                {language === 'bn' ? currentQ.explanationBangla : currentQ.explanationEnglish}
              </p>

              <div className="flex justify-end mt-2">
                <button
                  id="quiz-next-btn"
                  onClick={handleNext}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all"
                >
                  <span>{language === 'bn' ? 'পরবর্তী প্রশ্ন' : 'Next Question'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
