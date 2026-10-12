import React, { useState } from 'react';
import {
  BookOpen,
  Atom,
  Layers,
  Sparkles,
  Share2,
  TestTubes,
  Flame,
  RefreshCw,
  Scale,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  FlaskConical
} from 'lucide-react';
import { LESSONS } from '../data/lessons';
import { AppState } from '../types';

interface LessonsViewProps {
  state: AppState;
  onNavigateTab: (tab: AppState['activeTab']) => void;
}

export const LessonsView: React.FC<LessonsViewProps> = ({
  state,
  onNavigateTab
}) => {
  const { language } = state;
  const [activeLessonId, setActiveLessonId] = useState<string>(LESSONS[0].id);

  const activeLesson = LESSONS.find((l) => l.id === activeLessonId) || LESSONS[0];

  return (
    <div id="chemx-lessons-view" className="flex flex-col gap-4 pb-20">
      {/* Header */}
      <div className="bg-slate-900/60 p-4 rounded-3xl border border-slate-800 backdrop-blur-md flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center font-bold">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>{language === 'bn' ? 'মাধ্যমিক রসায়ন পাঠ্যক্রম' : 'Class 9–10 Chemistry Study Guide'}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-400 border border-violet-500/30">
                SYLLABUS
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              {language === 'bn'
                ? 'বোর্ড পরীক্ষার মূল তত্ত্ব, যোজনী, বন্ধন ও বিক্রিয়ার সহজ পাঠ'
                : 'Comprehensive curriculum concepts, valency, bonding, and core reaction principles'}
            </p>
          </div>
        </div>
      </div>

      {/* Topics Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {LESSONS.map((lesson) => (
          <button
            key={lesson.id}
            id={`lesson-tab-${lesson.id}`}
            onClick={() => setActiveLessonId(lesson.id)}
            className={`px-3.5 py-1.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeLessonId === lesson.id
                ? 'bg-violet-600 text-white shadow-md shadow-violet-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {language === 'bn' ? lesson.titleBangla : lesson.titleEnglish}
          </button>
        ))}
      </div>

      {/* Selected Lesson Card */}
      {activeLesson && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5 sm:p-6 backdrop-blur-md flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-lg font-bold text-white font-bengali">
              {language === 'bn' ? activeLesson.titleBangla : activeLesson.titleEnglish}
            </h3>

            <button
              onClick={() => onNavigateTab('lab')}
              className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'ল্যাবে পরীক্ষা করুন' : 'Test in Lab'}</span>
            </button>
          </div>

          {/* Sections Breakdown */}
          <div className="flex flex-col gap-4">
            {activeLesson.sections.map((sec, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex flex-col gap-2.5"
              >
                <h4 className="text-sm font-bold text-violet-300 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-violet-950/60 border border-violet-500/30 text-violet-400 flex items-center justify-center text-xs font-mono">
                    {idx + 1}
                  </span>
                  <span>{language === 'bn' ? sec.titleBangla : sec.titleEnglish}</span>
                </h4>

                <p className="text-xs text-slate-300 font-bengali leading-relaxed">
                  {language === 'bn' ? sec.contentBangla : sec.contentEnglish}
                </p>

                {/* Key Points */}
                {sec.keyPoints && sec.keyPoints.length > 0 && (
                  <div className="mt-2 bg-slate-900/90 rounded-xl p-3 border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
                      {language === 'bn' ? 'গুরুত্বপূর্ণ পয়েন্টসমূহ:' : 'Key Points:'}
                    </span>
                    <ul className="flex flex-col gap-1.5 text-xs text-slate-300 font-bengali">
                      {sec.keyPoints.map((pt, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Example Equations */}
                {sec.exampleEquations && sec.exampleEquations.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-2">
                    {sec.exampleEquations.map((eq, eIdx) => (
                      <span
                        key={eIdx}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 font-mono text-xs text-cyan-300 border border-slate-800"
                      >
                        {eq}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
