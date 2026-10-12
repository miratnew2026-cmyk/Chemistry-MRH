import React, { useState } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  ShieldCheck,
  User,
  HelpCircle,
  RotateCcw,
  Loader2,
  Copy,
  Check,
  Calculator,
  Atom,
  TestTube,
  BookOpen,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { AppState } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: number;
}

interface AiAssistantViewProps {
  state: AppState;
}

type ProblemCategory = 'all' | 'math' | 'orbitals' | 'reaction' | 'board';

export const AiAssistantView: React.FC<AiAssistantViewProps> = ({ state }) => {
  const { language } = state;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text:
        language === 'bn'
          ? 'আসসালামু আলাইকুম! আমি CHEM-X AI রসায়ন গৃহশিক্ষক ও সমস্যা সমাধানকারী (Problem Solver)।\n\nমাধ্যমিক রসায়ন (Class 9-10) এর যেকোনো গাণিতিক সমস্যা (যেমন: আণবিক ভর, শতকরা সংযুতি, মোল গণনা), ইলেকট্রন বিন্যাসের ব্যতিক্রম, বিক্রিয়া সমতাকরণ বা বোর্ড পরীক্ষার যেকোনো জটিল অনুধাবনমূলক প্রশ্ন আমাকে জিজ্ঞাসা করো — আমি ধাপে ধাপে বিস্তারিত সমাধান করে দেব!'
          : 'As-salamu alaykum! I am CHEM-X AI, your personal chemistry problem solver and tutor for Class 9–10.\n\nAsk me any chemistry problem (molecular mass, percentage composition, (n+l) rule anomalies, reaction balancing, or board exam questions) — I will provide clear, step-by-step solutions!',
      timestamp: Date.now()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<ProblemCategory>('all');
  const [showGuide, setShowGuide] = useState(false);

  const curatedProblems = [
    {
      category: 'math',
      bn: 'H₂SO₄ এর আণবিক ভর ও সালফারের শতকরা হার কত?',
      en: 'What is the molecular mass of H₂SO₄ and % of Sulfur?'
    },
    {
      category: 'math',
      bn: 'চুনাপাথর (CaCO₃) এর আণবিক ভর ও ক্যালসিয়ামের শতকরা সংযুতি নির্ণয় করো',
      en: 'Calculate molecular mass of CaCO₃ and % of Calcium'
    },
    {
      category: 'orbitals',
      bn: 'পটাসিয়ামের ১৯তম ইলেকট্রনটি ৩d তে না গিয়ে ৪s এ যায় কেন?',
      en: 'Why does the 19th electron of Potassium enter 4s instead of 3d?'
    },
    {
      category: 'orbitals',
      bn: 'Cr (২৪) ও Cu (২৯) এর ইলেকট্রন বিন্যাসের ব্যতিক্রম ব্যাখ্যা করো',
      en: 'Explain anomalous electron configuration of Cr (24) and Cu (29)'
    },
    {
      category: 'orbitals',
      bn: 'FeCl₂ ও FeCl₃ যৌগে আয়রনের সক্রিয় ও সুপ্ত যোজনী কত?',
      en: 'Calculate active and latent valency of Fe in FeCl₂ and FeCl₃'
    },
    {
      category: 'board',
      bn: 'সকল ক্ষারই ক্ষারক, কিন্তু সকল ক্ষারক ক্ষার নয় কেন?',
      en: 'Why all alkalis are bases, but not all bases are alkalis?'
    },
    {
      category: 'reaction',
      bn: 'লোহা তুঁতের দ্রবণে (CuSO₄) দিলে কী ঘটে? সমীকরণসহ লেখো',
      en: 'What happens when iron is placed in copper sulfate solution?'
    },
    {
      category: 'reaction',
      bn: 'হাইড্রোক্লোরিক অ্যাসিড (HCl) ও সোডিয়াম হাইড্রোক্সাইডের (NaOH) প্রশমন বিক্রিয়া',
      en: 'Neutralization reaction between HCl and NaOH'
    },
    {
      category: 'board',
      bn: 'খাবার লবণ (NaCl) পানিতে দ্রবীভূত হয় কিন্তু তেল বা কেরোসিনে হয় না কেন?',
      en: 'Why does NaCl dissolve in water but not in kerosene or oil?'
    },
    {
      category: 'board',
      bn: 'লোহায় মরিচা পড়ার কারণ ও ক্ষয় রোধের উপায় কী?',
      en: 'What causes rusting of iron and how to prevent it?'
    }
  ];

  const filteredProblems = activeCategory === 'all'
    ? curatedProblems
    : curatedProblems.filter((p) => p.category === activeCategory);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || loading) return;

    const userMsg: Message = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: Date.now()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: query,
          currentContext: {
            language,
            level: 'Class 9-10 Secondary Chemistry Problem Solver',
            greetingStyle: 'Aslamu Alaikum'
          }
        })
      });

      const data = await res.json();
      const aiReply: Message = {
        id: `ai_${Date.now()}`,
        sender: 'assistant',
        text: data.answer || (language === 'bn' ? 'দুঃখিত, কোনো উত্তর পাওয়া যায়নি।' : 'Sorry, no answer found.'),
        timestamp: Date.now()
      };
      setMessages((prev) => [...prev, aiReply]);
    } catch {
      const fallbackReply: Message = {
        id: `ai_${Date.now()}`,
        sender: 'assistant',
        text:
          language === 'bn'
            ? 'CHEM-X সহকারী অফলাইন মোডে রয়েছে। ল্যাবরেটরির ভেরিফাইড ডাটাবেস ও সমাধান ইঞ্জিন থেকে তথ্য প্রদর্শিত হচ্ছে।'
            : 'CHEM-X AI is in offline mode. Please consult the verified reaction database and study guide tab.',
        timestamp: Date.now()
      };
      setMessages((prev) => [...prev, fallbackReply]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome_reset',
        sender: 'assistant',
        text:
          language === 'bn'
            ? 'আসসালামু আলাইকুম! নতুন সমস্যা সমাধান শুরু করতে পারো। তোমার প্রশ্ন বা গাণিতিক হিসাবটি বলো!'
            : 'As-salamu alaykum! Ready for a new problem. Ask me anything!',
        timestamp: Date.now()
      }
    ]);
  };

  return (
    <div id="chemx-ai-assistant-view" className="flex flex-col gap-4 pb-20">
      {/* Header Banner */}
      <div className="bg-slate-900/70 p-4 sm:p-5 rounded-3xl border border-slate-800 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-cyan-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span>CHEM-X AI</span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold tracking-wide">
                PROBLEM SOLVER
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              {language === 'bn'
                ? 'মাধ্যমিক রসায়ন (Class 9-10) এর ব্যক্তিগত ডিজিটাল গৃহশিক্ষক ও সমস্যা সমাধানকারী'
                : 'Dedicated Class 9-10 Secondary Chemistry Problem Solver & Tutor'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Reset button */}
          <button
            onClick={handleResetChat}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 bg-slate-950/60 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-xl transition-all"
            title={language === 'bn' ? 'চ্যাট নতুন করে শুরু করুন' : 'Reset Chat'}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'রিসেট' : 'Reset'}</span>
          </button>

          {/* Safety Disclaimer Pill */}
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-950/30 border border-emerald-500/20 px-3 py-1.5 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'নিরাপদ ডিজিটাল সহায়তা' : 'Safe AI Tutor'}</span>
          </div>
        </div>
      </div>

      {/* Problem Solver Hub Categories */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-3 sm:p-4 backdrop-blur-md flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>{language === 'bn' ? 'সমস্যা সমাধানের ক্যাটাগরি ও প্রশ্নসমূহ:' : 'Problem Categories & Quick Help:'}</span>
          </span>

          <button
            onClick={() => setShowGuide(!showGuide)}
            className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <BookOpen className="w-3 h-3" />
            <span>{language === 'bn' ? 'কীভাবে প্রশ্ন করবেন?' : 'Problem Guide'}</span>
            {showGuide ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        {/* Expandable Guide */}
        {showGuide && (
          <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800/80 text-xs text-slate-300 space-y-1.5 animate-fadeIn">
            <p className="font-semibold text-cyan-300">
              {language === 'bn' ? '💡 যেকোনো রসায়ন সমস্যা সমাধানের জন্য যেভাবে লিখতে পারো:' : '💡 How to ask chemistry problems:'}
            </p>
            <ul className="list-disc list-inside text-slate-400 space-y-1 text-[11px]">
              <li><b>গাণিতিক হিসাব:</b> "H2SO4 এর আণবিক ভর ও সালফারের শতকরা হার কত?"</li>
              <li><b>ইলেকট্রন বিন্যাস:</b> "পটাসিয়ামের ১৯তম ইলেকট্রনটি 3d তে না গিয়ে 4s এ যায় কেন?"</li>
              <li><b>ব্যতিক্রমী বিন্যাস:</b> "Cr (২৪) ও Cu (২৯) এর ব্যতিক্রমী ইলেকট্রন বিন্যাস ব্যাখ্যা করো"</li>
              <li><b>যোজনী সমস্যা:</b> "FeCl2 যৌগে আয়রনের সক্রিয় যোজনী ও সুপ্ত যোজনী কত?"</li>
              <li><b>অনুধাবন প্রশ্ন:</b> "সকল ক্ষারই ক্ষারক কিন্তু সকল ক্ষারক ক্ষার নয় কেন?"</li>
            </ul>
          </div>
        )}

        {/* Category Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar text-xs">
          {[
            { id: 'all', labelBn: 'সকল সমস্যা', labelEn: 'All', icon: Sparkles },
            { id: 'math', labelBn: '🧮 গাণিতিক হিসাব', labelEn: '🧮 Stoichiometry', icon: Calculator },
            { id: 'orbitals', labelBn: '⚛️ ইলেকট্রন বিন্যাস', labelEn: '⚛️ Orbitals', icon: Atom },
            { id: 'reaction', labelBn: '🧪 বিক্রিয়া ও সমতা', labelEn: '🧪 Reactions', icon: TestTube },
            { id: 'board', labelBn: '💡 অনুধাবনমূলক প্রশ্ন', labelEn: '💡 Conceptual', icon: HelpCircle }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as ProblemCategory)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeCategory === cat.id
                  ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-sm'
                  : 'bg-slate-950/80 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span>{language === 'bn' ? cat.labelBn : cat.labelEn}</span>
            </button>
          ))}
        </div>

        {/* Curated Problem Prompt Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar pt-1">
          {filteredProblems.map((prob, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(language === 'bn' ? prob.bn : prob.en)}
              className="text-xs px-3 py-1.5 rounded-xl bg-slate-950/90 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0"
            >
              <HelpCircle className="w-3 h-3 text-cyan-400 shrink-0" />
              <span>{language === 'bn' ? prob.bn : prob.en}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-4 sm:p-5 backdrop-blur-md flex flex-col gap-3.5 min-h-[380px] max-h-[520px] overflow-y-auto">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[92%] sm:max-w-[85%] ${
                isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold shadow-md ${
                  isUser
                    ? 'bg-indigo-600 text-white shadow-indigo-600/20'
                    : 'bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white shadow-cyan-500/20'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className="flex flex-col gap-1 w-full">
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm font-bengali leading-relaxed shadow-sm relative group ${
                    isUser
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-tr-none'
                      : 'bg-slate-950/90 border border-slate-800 text-slate-200 rounded-tl-none whitespace-pre-wrap'
                  }`}
                >
                  {msg.text}

                  {/* Copy Button for Assistant replies */}
                  {!isUser && (
                    <button
                      onClick={() => handleCopyText(msg.id, msg.text)}
                      className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-cyan-300 transition-all opacity-70 hover:opacity-100"
                      title={language === 'bn' ? 'উত্তর কপি করুন' : 'Copy Answer'}
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>

                <span
                  className={`text-[10px] text-slate-500 px-1 ${
                    isUser ? 'text-right' : 'text-left'
                  }`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-2.5 text-xs text-cyan-400 mr-auto p-3.5 bg-slate-950/80 rounded-2xl border border-cyan-500/30 shadow-md">
            <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
            <div className="flex flex-col">
              <span className="font-semibold">
                {language === 'bn' ? 'CHEM-X সমস্যা সমাধানকারী বিশ্লেষণ করছে...' : 'CHEM-X Problem Solver is analyzing...'}
              </span>
              <span className="text-[10px] text-slate-400">
                {language === 'bn' ? 'ধাপে ধাপে সূত্র ও গণনা প্রস্তুত হচ্ছে' : 'Formulating step-by-step working'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Chat Input Bar */}
      <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 p-2 rounded-2xl backdrop-blur-md shadow-xl focus-within:border-cyan-500/60 transition-all">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder={
            language === 'bn'
              ? 'রসায়নের যেকোনো সমস্যা লিখুন (যেমন: H2SO4 এর আণবিক ভর কত?)...'
              : 'Type any chemistry problem (e.g., calculate molecular mass of CaCO3)...'
          }
          className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none"
        />

        <button
          onClick={() => handleSendMessage()}
          disabled={loading || !inputText.trim()}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:brightness-110 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-cyan-500/20 transition-all shrink-0 flex items-center gap-1.5"
        >
          <span>{language === 'bn' ? 'সমাধান করো' : 'Solve'}</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
