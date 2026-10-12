import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { VERIFIED_REACTIONS } from './src/data/reactions.ts';
import { ELEMENTS } from './src/data/elements.ts';
import { COMPOUNDS } from './src/data/compounds.ts';
import { LESSONS } from './src/data/lessons.ts';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini SDK
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Prepare compact summary of verified reactions for grounding
const verifiedReactionsContext = VERIFIED_REACTIONS.map((r) => ({
  id: r.id,
  reactants: r.reactants.join(' + '),
  products: r.products.join(' + '),
  equation: r.balancedEquation,
  type: r.reactionType,
  explanationBangla: r.explanationBangla
}));

/**
 * Intelligent local curriculum resolver and problem solver when Gemini experiences high demand (503) or offline state.
 */
function resolveCurriculumKnowledge(query: string): string {
  const qLower = query.toLowerCase().trim();

  // 1. Molecular mass & Stoichiometric calculations (আণবিক ভর ও মোল সংক্রান্ত সমস্যা)
  if (qLower.includes('আণবিক ভর') || qLower.includes('molecular mass') || qLower.includes('ভর নির্ণয়') || qLower.includes('শতকরা সংযুতি') || qLower.includes('শতকরা')) {
    if (qLower.includes('h2so4') || qLower.includes('সালফিউরিক') || qLower.includes('sulfuric')) {
      return `🧮 **সমস্যা সমাধান: H₂SO₄ এর আণবিক ভর ও শতকরা সংযুতি নির্ণয়**

📌 **প্রদত্ত পারমাণবিক ভর:**
• হাইড্রোজেন (H) = 1 u
• সালফার (S) = 32 u
• অক্সিজেন (O) = 16 u

✍️ **ধাপ ১: আণবিক ভর গণনা:**
$$\\text{M} = (1 \\times 2) + (32 \\times 1) + (16 \\times 4)$$
$$\\text{M} = 2 + 32 + 64 = 98\\text{ g/mol}$$

✍️ **ধাপ ২: মৌলসমূহের শতকরা সংযুতি:**
• **H এর শতকরা হার:** $\\frac{2}{98} \\times 100\\% = 2.04\\%$
• **S এর শতকরা হার:** $\\frac{32}{98} \\times 100\\% = 32.65\\%$
• **O এর শতকরা হার:** $\\frac{64}{98} \\times 100\\% = 65.31\\%$

🎯 **উত্তর:** H₂SO₄ এর আণবিক ভর **98 g/mol** এবং সালফারের পরিমাণ **32.65%**।`;
    }

    if (qLower.includes('caco3') || qLower.includes('চুনাপাথর') || qLower.includes('calcium carbonate')) {
      return `🧮 **সমস্যা সমাধান: চুনাপাথর (CaCO₃) এর আণবিক ভর ও ক্যালসিয়ামের শতকরা হার**

📌 **প্রদত্ত পারমাণবিক ভর:**
• ক্যালসিয়াম (Ca) = 40 u
• কার্বন (C) = 12 u
• অক্সিজেন (O) = 16 u

✍️ **ধাপ ১: আণবিক ভর গণনা:**
$$\\text{M} = 40 + 12 + (16 \\times 3) = 40 + 12 + 48 = 100\\text{ g/mol}$$

✍️ **ধাপ ২: শতকরা সংযুতি:**
• **Ca:** $\\frac{40}{100} \\times 100\\% = 40\\%$
• **C:** $\\frac{12}{100} \\times 100\\% = 12\\%$
• **O:** $\\frac{48}{100} \\times 100\\% = 48\\%$

🎯 **উত্তর:** CaCO₃ এর আণবিক ভর **100 g/mol**।`;
    }

    if (qLower.includes('nacl') || qLower.includes('খাবার লবণ')) {
      return `🧮 **সমস্যা সমাধান: খাবার লবণ (NaCl) এর আণবিক ভর**

• সোডিয়াম (Na) = 23 u
• ক্লোরিন (Cl) = 35.5 u
• **NaCl এর আণবিক ভর:** $23 + 35.5 = 58.5\\text{ g/mol}$

🎯 **উত্তর:** NaCl এর আণবিক ভর **58.5 g/mol**। Na এর শতকরা পরিমাণ **39.32%** এবং Cl এর **60.68%**।`;
    }
  }

  // 2. Potassium 19th electron problem (পটাসিয়ামের ১৯তম ইলেকট্রন সমস্যা)
  if ((qLower.includes('পটাসিয়াম') || qLower.includes('potassium') || qLower.includes('১৯') || qLower.includes('19')) && (qLower.includes('3d') || qLower.includes('4s') || qLower.includes('ইলেকট্রন'))) {
    return `⚛️ **সমস্যা সমাধান: পটাসিয়ামের (₁₉K) ১৯তম ইলেকট্রনটি 3d তে না গিয়ে 4s এ যায় কেন?**

📌 **মূল নীতি: আউফবাউ নীতি (Aufbau Principle) ও (n + l) নিয়ম**
পরমাণুতে ইলেকট্রন প্রথমে নিম্ন শক্তির অরবিটালে প্রবেশ করে এবং পরে ক্রমান্বয়ে উচ্চ শক্তির অরবিটাল পূর্ণ করে। অরবিটালের শক্তি নির্ধারিত হয় $(n + l)$ এর মানের ওপর:

✍️ **ধাপে ধাপে শক্তির হিসাব:**
১. **4s অরবিটালের জন্য:**
   • প্রধান কোয়ান্টাম সংখ্যা ($n$) = 4
   • সহকারী কোয়ান্টাম সংখ্যা ($l$) = 0 (s এর জন্য $l=0$)
   • $(n + l) = 4 + 0 = 4$

২. **3d অরবিটালের জন্য:**
   • প্রধান কোয়ান্টাম সংখ্যা ($n$) = 3
   • সহকারী কোয়ান্টাম সংখ্যা ($l$) = 2 (d এর জন্য $l=2$)
   • $(n + l) = 3 + 2 = 5$

🎯 **সিদ্ধান্ত:**
যেহেতু 4s অরবিটালের $(n+l)$ এর মান (4), 3d অরবিটালের $(n+l)$ এর মান (5) অপেক্ষা কম, তাই 4s অরবিটাল নিম্ন শক্তির।
এ কারণে আউফবাউ নীতি অনুসারে পটাসিয়ামের ১৯তম ইলেকট্রনটি 3d তে না গিয়ে আগে নিম্ন শক্তির 4s অরবিটালে প্রবেশ করে:
$$\\text{K (19): } 1s^2 \\, 2s^2 \\, 2p^6 \\, 3s^2 \\, 3p^6 \\, 4s^1$$`;
  }

  // 3. Chromium & Copper Anomaly Problem (Cr ও Cu এর ব্যতিক্রমী বিন্যাস)
  if ((qLower.includes('cr') || qLower.includes('ক্রোমিয়াম') || qLower.includes('chromium') || qLower.includes('cu') || qLower.includes('কপার') || qLower.includes('copper')) && (qLower.includes('ব্যতিক্রম') || qLower.includes('বিন্যাস') || qLower.includes('exception') || qLower.includes('24') || qLower.includes('29'))) {
    return `⚛️ **সমস্যা সমাধান: ক্রোমিয়াম (₂₄Cr) ও কপার (₂₉Cu) এর ব্যতিক্রমী ইলেকট্রন বিন্যাস**

📌 **মূল বৈজ্ঞানিক কারণ: সমশক্তির অরবিটালের স্থায়িত্ব**
অরবিটালের উপস্তরগুলো অর্ধপূর্ণ ($d^5$) অথবা সম্পূর্ণ পূর্ণ ($d^{10}$) থাকলে অধিক সুষম ইলেকট্রন ঘনত্ব ও সর্বোচ্চ বিনিময় শক্তি (Exchange Energy) অর্জনের মাধ্যমে সর্বোচ্চ স্থিতিশীলতা লাভ করে।

✍️ **১. ক্রোমিয়াম (₂₄Cr):**
• সাধারণ নিয়ম অনুসারে হওয়ার কথা ছিল: $[\\text{Ar}]\\, 3d^4 \\, 4s^2$
• কিন্তু $3d$ অরবিটাল অর্ধপূর্ণ ($d^5$) হয়ে অধিক স্থিতিশীলতা পেতে 4s থেকে একটি ইলেকট্রন 3d তে চলে যায়:
$$\\mathbf{Cr (24): } 1s^2 \\, 2s^2 \\, 2p^6 \\, 3s^2 \\, 3p^6 \\, \\mathbf{3d^5 \\, 4s^1}$$

✍️ **২. কপার (₂₉Cu):**
• সাধারণ নিয়ম অনুসারে হওয়ার কথা ছিল: $[\\text{Ar}]\\, 3d^9 \\, 4s^2$
• কিন্তু $3d$ অরবিটাল সম্পূর্ণ পূর্ণ ($d^{10}$) হয়ে অধিক স্থিতিশীল হতে 4s থেকে একটি ইলেকট্রন টেনে নেয়:
$$\\mathbf{Cu (29): } 1s^2 \\, 2s^2 \\, 2p^6 \\, 3s^2 \\, 3p^6 \\, \\mathbf{3d^{10} \\, 4s^1}$$

💡 **পরীক্ষার টিপস:** মাধ্যমিক ও বোর্ড পরীক্ষায় এটি সবচেয়ে বেশি আসা ৩ নম্বরের অনুধাবনমূলক প্রশ্ন!`;
  }

  // 4. "সকল ক্ষারই ক্ষারক, কিন্তু সকল ক্ষারক ক্ষার নয়" (All alkalis are bases)
  if ((qLower.includes('ক্ষার') && qLower.includes('ক্ষারক')) || qLower.includes('সকল ক্ষারই ক্ষারক') || qLower.includes('alkali')) {
    return `💡 **সমস্যা সমাধান: "সকল ক্ষারই ক্ষারক, কিন্তু সকল ক্ষারক ক্ষার নয়" — ব্যাখ্যা**

📌 **সংজ্ঞা ও শর্তাবলী:**
১. **ক্ষারক (Base):** ধাতব অক্সাইড বা হাইড্রোক্সাইড যা অ্যাসিডের সাথে বিক্রিয়া করে লবণ ও পানি তৈরি করে।
২. **ক্ষার (Alkali):** যেসব ক্ষারক পানিতে সম্পূর্ণরূপে দ্রবীভূত হয় এবং জলীয় দ্রবণে হাইড্রোক্সাইড আয়ন ($OH^-$) দেয়। অর্থাৎ ক্ষার হতে হলে দুটি শর্ত প্রযোজ্য:
   • যৌগকে ক্ষারক হতে হবে।
   • যৌগটিকে অবশ্যই পানিতে দ্রবণীয় হতে হবে।

✍️ **তুলনামূলক উদাহরণ:**
• **সোডিয়াম হাইড্রোক্সাইড ($NaOH$) ও পটাশিয়াম হাইড্রোক্সাইড ($KOH$):** এরা ধাতব হাইড্রোক্সাইড (ক্ষারক) এবং পানিতে দ্রবণীয়। সুতরাং এরা ক্ষারক এবং একই সাথে ক্ষার।
• **ফেরিক হাইড্রোক্সাইড ($Fe(OH)_3$) ও অ্যালুমিনিয়াম অক্সাইড ($Al_2O_3$):** এরা অ্যাসিডের সাথে বিক্রিয়া করায় ক্ষারক, কিন্তু এরা পানিতে সম্পূর্ণ অদ্রবণীয়। পানিতে অদ্রবণীয় হওয়ায় এরা ক্ষার হতে পারে না।

🎯 **উপসংহার:**
যেহেতু সব ক্ষারই ক্ষারকের অন্তর্ভুক্ত কিন্তু অদ্রবণীয় ক্ষারকগুলো ক্ষার নয়, তাই যথার্থভাবেই বলা হয়: **"সকল ক্ষারই ক্ষারক, কিন্তু সকল ক্ষারক ক্ষার নয়"**।`;
  }

  // 5. Active & Latent Valency (সুপ্ত যোজনী ও সক্রিয় যোজনী)
  if (qLower.includes('সুপ্ত যোজনী') || qLower.includes('সক্রিয় যোজনী') || qLower.includes('latent valency') || qLower.includes('পরিবর্তনশীল যোজনী')) {
    return `✨ **সমস্যা সমাধান: সক্রিয় যোজনী, সর্বোচ্চ যোজনী ও সুপ্ত যোজনী (Latent Valency)**

📌 **মূল সূত্র:**
$$\\mathbf{\\text{সুপ্ত যোজনী}} = \\mathbf{\\text{সর্বোচ্চ যোজনী}} - \\mathbf{\\text{সক্রিয় যোজনী}}$$

✍️ **উদাহরণ ১: ফেরাস ক্লোরাইড ($FeCl_2$)**
• আয়রনের (Fe) সর্বোচ্চ যোজনী = 3
• $FeCl_2$ যৌগে Fe এর সক্রিয় যোজনী = 2
• **সুপ্ত যোজনী:** $3 - 2 = \\mathbf{1}$

✍️ **উদাহরণ ২: ফেরিক ক্লোরাইড ($FeCl_3$)**
• আয়রনের সর্বোচ্চ যোজনী = 3
• $FeCl_3$ যৌগে Fe এর সক্রিয় যোজনী = 3
• **সুপ্ত যোজনী:** $3 - 3 = \\mathbf{0}$

✍️ **উদাহরণ ৩: কার্বন মনোক্সাইড ($CO$)**
• কার্বনের (C) সর্বোচ্চ যোজনী = 4
• $CO$ যৌগে কার্বনের সক্রিয় যোজনী = 2
• **সুপ্ত যোজনী:** $4 - 2 = \\mathbf{2}$`;
  }

  // 6. Check for specific verified chemical reactions
  const matchedRxn = VERIFIED_REACTIONS.find((r) => {
    const hasReactant = r.reactants.some((sub) => qLower.includes(sub.toLowerCase()));
    const hasProduct = r.products.some((prod) => qLower.includes(prod.toLowerCase()));
    const mentionsRxn = qLower.includes('বিক্রিয়া') || qLower.includes('react') || qLower.includes('ঘটে') || qLower.includes('সমীকরণ');
    return (hasReactant && hasProduct) || (hasReactant && mentionsRxn);
  });

  if (matchedRxn) {
    return `🔬 **ভেরিফাইড বিক্রিয়া সমস্যা সমাধান (${matchedRxn.balancedEquation})**:\n\n${matchedRxn.explanationBangla}\n\n• **বিক্রিয়ার ধরন:** ${matchedRxn.reactionType}\n• **শক্তি পরিবর্তন:** ${matchedRxn.energyBehavior === 'exothermic' ? 'তাপোৎপাদী (Exothermic)' : 'তাপহারী (Endothermic)'}\n• **উৎপাদসমূহ:** ${matchedRxn.products.join(', ')}`;
  }

  // 7. Check for chemical compounds
  const matchedCompound = COMPOUNDS.find((c) =>
    qLower.includes(c.formula.toLowerCase()) ||
    qLower.includes(c.name.toLowerCase()) ||
    qLower.includes(c.nameBangla.toLowerCase())
  );

  if (matchedCompound) {
    return `🧪 **যৌগ সম্পর্কিত সমাধান: ${matchedCompound.nameBangla} (${matchedCompound.formula})**\n\n• **শ্রেণি:** ${matchedCompound.category}\n• **ভৌত অবস্থা:** ${matchedCompound.state}\n• **আণবিক ভর:** ${matchedCompound.molecularWeight} g/mol\n\n${matchedCompound.banglaInfo}\n\n**পাঠ্যক্রমিক সমস্যা সমাধান ও গুরুত্ব:** ${matchedCompound.schoolContext}`;
  }

  // 8. Check for elements
  const matchedElement = ELEMENTS.find((el) => {
    const symMatch = qLower === el.symbol.toLowerCase() || qLower.includes(` ${el.symbol.toLowerCase()} `);
    const nameMatch = qLower.includes(el.name.toLowerCase()) || qLower.includes(el.nameBangla.toLowerCase());
    return symMatch || nameMatch;
  });

  if (matchedElement) {
    return `⚛️ **মৌল পরিচিতি ও সমস্যা সমাধান: ${matchedElement.nameBangla} (${matchedElement.symbol})**\n\n• **পারমাণবিক সংখ্যা:** ${matchedElement.atomicNumber} (গ্রুপ: ${matchedElement.group}, পর্যায়: ${matchedElement.period}, ব্লক: ${matchedElement.block})\n• **পারমাণবিক ভর:** ${matchedElement.atomicMass} u\n• **যোজনী (Valency):** ${matchedElement.valency.join(', ')}\n• **ইলেকট্রন বিন্যাস:** ${matchedElement.electronConfiguration}\n\n${matchedElement.banglaInfo}`;
  }

  // 9. Bonding problems (NaCl solubility in water vs kerosene)
  if (qLower.includes('কেরোসিন') || qLower.includes('দ্রবীভূত') || qLower.includes('পানিতে') || (qLower.includes('nacl') && qLower.includes('পানি'))) {
    return `💧 **সমস্যা সমাধান: খাবার লবণ (NaCl) পানিতে দ্রবীভূত হয় কিন্তু তেল/কেরোসিনে হয় না কেন?**

📌 **কারণ: 'Like Dissolves Like' নীতি ও পোলারিটি**
১. **পানি একটি পোলার সমযোজী দ্রাবক ($H^{\\delta+} - O^{\\delta-}$):** পানিতে আংশিক ধনাত্মক ও ঋণাত্মক প্রান্ত থাকে। যখন আয়নিক যৌগ $NaCl$ পানিতে ফেলা হয়, পানির ধনাত্মক প্রান্ত ক্লোরাইড ($Cl^-$) আয়নকে এবং ঋণাত্মক প্রান্ত সোডিয়াম ($Na^+$) আয়নকে তীব্রভাবে আকর্ষণ করে কেলাস ভেঙে হাইড্রেশন শক্তি নির্গত করে দ্রবীভূত করে।
২. **কেরোসিন একটি অপোলার দ্রাবক:** কেরোসিন বা তেলে কোনো পোলার প্রান্ত না থাকায় এটি $Na^+$ ও $Cl^-$ আয়নের মধ্যকার শক্তিশালী স্থির-বৈদ্যুতিক বন্ধন ভাঙতে পারে না। ফলে $NaCl$ কেরোসিনে অদ্রবণীয় থাকে।`;
  }

  // 10. Default guidance
  return `💡 **CHEM-X রসায়ন সমস্যা সমাধান নির্দেশিকা**:\n\nআপনার প্রশ্ন: "${query}" এর যেকোনো সুনির্দিষ্ট হিসাব বা সমীকরণ সমাধানের জন্য নিচের মতো করে জিজ্ঞাসা করুন:\n• *"H2SO4 এর আণবিক ভর ও সালফারের শতকরা হার কত?"*\n• *"পটাসিয়ামের ১৯তম ইলেকট্রন কেন 3d তে না গিয়ে 4s এ যায়?"*\n• *"Cr ও Cu এর ইলেকট্রন বিন্যাসের ব্যতিক্রম ব্যাখ্যা করো"* \n• *"FeCl2 তে লোহার সুপ্ত যোজনী কত?"*\n• *"সকল ক্ষারই ক্ষারক কিন্তু সকল ক্ষারক ক্ষার নয় কেন?"*`;
}

// API Endpoint for CHEM-X AI Chemistry Assistant
app.post('/api/ai/ask', async (req, res) => {
  const { question, currentContext } = req.body;

  if (!question || typeof question !== 'string') {
    return res.status(400).json({ error: 'Question is required' });
  }

  const client = getGeminiClient();

  // If no Gemini API key configured, use our verified curriculum knowledge engine
  if (!client) {
    const answer = resolveCurriculumKnowledge(question);
    return res.json({ answer, source: 'curriculum_engine' });
  }

  const systemPrompt = `You are "CHEM-X AI", an expert, helpful secondary school chemistry problem solver and tutor for Class 9–10 students.

GREETING PROTOCOL:
- If greeting the student, ALWAYS greet with "আসসালামু আলাইকুম!" (Never use Namaskar or other greetings).

ROLE & PROBLEM-SOLVING PROTOCOL:
You specialize in helping students solve chemistry problems with clarity, step-by-step logic, and encouraging pedagogy.
When a student brings a problem (mathematical, conceptual, electron configuration, reaction balancing, or board question):
1. State the core concept or formula directly:
   - e.g., সূত্র: n = W/M, (n + l) নিয়ম, অষ্টক নিয়ম, ইত্যাদি।
2. Provide clean step-by-step working:
   - Step 1 (প্রদত্ত মান): List given values with proper units.
   - Step 2 (গণনা বা ব্যাখ্যা): Step-by-step calculation or scientific reasoning.
   - Step 3 (চূড়ান্ত উত্তর): Clear final answer with units highlighted.
3. If relevant, include a quick "পরীক্ষার টিপস (Exam Tip)" or common pitfall to avoid in board exams.
4. Language: Clear, polite, student-friendly Bengali (with scientific terms and formulas in English/parentheses).
5. Grounding: When asked about chemical reactions, verify against safe curriculum principles. Never provide recipes for hazardous real-world explosives.`;

  // Resilient multi-tier model fallback: primary model -> flash-lite fallback
  const modelsToTry = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];
  let answer: string | null = null;
  let usedModel: string | null = null;

  for (const modelName of modelsToTry) {
    try {
      const response = await client.models.generateContent({
        model: modelName,
        contents: `Student Question: ${question}\nCurrent Context: ${JSON.stringify(currentContext || {})}`,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.2,
        },
      });

      if (response && response.text) {
        answer = response.text;
        usedModel = modelName;
        break;
      }
    } catch (err: any) {
      const is503 = err?.status === 503 || err?.message?.includes('503') || err?.message?.includes('high demand');
      console.warn(`Gemini model ${modelName} unavailable${is503 ? ' (503 High Demand)' : ''}, checking alternatives...`);
    }
  }

  // If Gemini succeeded, return response
  if (answer) {
    return res.json({
      answer,
      source: usedModel || 'gemini'
    });
  }

  // If all remote models are experiencing temporary demand spikes (503), gracefully resolve with curriculum engine
  console.info('Using CHEM-X curriculum engine for response due to temporary model high demand');
  const fallbackAnswer = resolveCurriculumKnowledge(question);
  return res.json({
    answer: fallbackAnswer,
    source: 'curriculum_engine_fallback'
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'CHEM-X Virtual Chemistry Laboratory' });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CHEM-X Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
