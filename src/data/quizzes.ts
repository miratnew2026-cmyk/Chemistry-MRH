import { QuizQuestion } from '../types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    difficulty: 'Easy',
    topic: 'মৌলের প্রতীক ও পারমাণবিক সংখ্যা',
    questionBangla: 'সোডিয়াম (Sodium) মৌলের প্রতীক কী এবং এর পারমাণবিক সংখ্যা কত?',
    questionEnglish: 'What is the symbol and atomic number of Sodium?',
    options: ['So, 12', 'Na, 11', 'Sd, 10', 'K, 19'],
    correctIndex: 1,
    explanationBangla: 'সোডিয়ামের ল্যাটিন নাম Natrium থেকে এর প্রতীক Na এবং এর পরমাণুতে ১১টি প্রোটন থাকায় এর পারমাণবিক সংখ্যা ১১।',
    explanationEnglish: 'The chemical symbol for Sodium is Na (from its Latin name Natrium) with atomic number 11.'
  },
  {
    id: 'q2',
    difficulty: 'Easy',
    topic: 'বিক্রিয়ার প্রকারভেদ',
    questionBangla: 'HCl + NaOH → NaCl + H₂O বিক্রিয়াটি কোন ধরনের বিক্রিয়ার উদাহরণ?',
    questionEnglish: 'What type of reaction is HCl + NaOH → NaCl + H₂O?',
    options: [
      'সংযোজন বিক্রিয়া (Combination)',
      'প্রশমন বিক্রিয়া (Neutralization)',
      'বিযোজন বিক্রিয়া (Decomposition)',
      'দহন বিক্রিয়া (Combustion)'
    ],
    correctIndex: 1,
    explanationBangla: 'এসিড (HCl) এবং ক্ষার (NaOH) পরস্পর বিক্রিয়া করে লবণ (NaCl) ও পানি (H₂O) উৎপন্ন করায় এটি একটি প্রশমন বিক্রিয়া।',
    explanationEnglish: 'Acid and base react to form neutral salt and water; this is a classic neutralization reaction.'
  },
  {
    id: 'q3',
    difficulty: 'Easy',
    topic: 'পর্যায় সারণি',
    questionBangla: 'পর্যায় সারণির গ্রুপ ১৮ এর মৌলসমূহকে কী বলা হয়?',
    questionEnglish: 'What are the Group 18 elements called in the periodic table?',
    options: ['ক্ষার ধাতু', 'হ্যালোজেন', 'নিষ্ক্রিয় গ্যাস (Noble Gases)', 'মৃৎক্ষার ধাতু'],
    correctIndex: 2,
    explanationBangla: 'গ্রুপ ১৮ এর হিলিয়াম, নিয়ন, আর্গন ইত্যাদি মৌলগুলোর সর্ববহিঃস্থ স্তর ইলেকট্রন দ্বারা পূর্ণ ও স্থিতিশীল থাকায় এদের নিষ্ক্রিয় গ্যাস বলে।',
    explanationEnglish: 'Group 18 elements (He, Ne, Ar, etc.) have stable full valence electron shells and are named Noble Gases.'
  },
  {
    id: 'q4',
    difficulty: 'Easy',
    topic: 'রাসায়নিক সূত্র ও যোজনী',
    questionBangla: 'পানির অণুতে (H₂O) অক্সিজেনের যোজনী কত?',
    questionEnglish: 'What is the valency of oxygen in a water molecule (H₂O)?',
    options: ['১', '২', '৩', '৪'],
    correctIndex: 1,
    explanationBangla: 'অক্সিজেন পরমাণু ২টি হাইড্রোজেন পরমাণুর সাথে যুক্ত হয়ে বন্ধন গঠন করে, তাই অক্সিজেনের যোজনী ২।',
    explanationEnglish: 'Oxygen combines with 2 hydrogen atoms in H₂O, therefore its valency is 2.'
  },
  {
    id: 'q5',
    difficulty: 'Medium',
    topic: 'প্রতিস্থাপন বিক্রিয়া',
    questionBangla: 'Fe + CuSO₄ → FeSO₄ + Cu বিক্রিয়ায় দ্রবণের নীল বর্ণ পরিবর্তিত হয়ে কী বর্ণে রূপান্তরিত হয়?',
    questionEnglish: 'In Fe + CuSO₄ → FeSO₄ + Cu, what color does the blue solution change into?',
    options: ['গাঢ় লাল', 'হালকা সবুজ (Pale Green)', 'হলুদ', 'বর্ণহীন'],
    correctIndex: 1,
    explanationBangla: 'লোহা কপারকে প্রতিস্থাপিত করে ফেরাস সালফেট (FeSO₄) দ্রবণ তৈরি করে, যা জলীয় অবস্থায় হালকা সবুজ বর্ণ দেখায়।',
    explanationEnglish: 'Iron displaces copper forming iron(II) sulfate (FeSO₄), which gives a characteristic pale green solution.'
  },
  {
    id: 'q6',
    difficulty: 'Medium',
    topic: 'সমীকরণ সমতাকরণ',
    questionBangla: '_ H₂ + _ O₂ → _ H₂O সমীকরণের সঠিক সহগসমূহ ক্রমানুসারে কোনটি?',
    questionEnglish: 'What are the correct stoichiometric coefficients for _ H₂ + _ O₂ → _ H₂O?',
    options: ['1, 1, 1', '2, 1, 2', '2, 2, 2', '1, 2, 1'],
    correctIndex: 1,
    explanationBangla: 'উভয় পাশে হাইড্রোজেন ৪টি ও অক্সিজেন ২টি করে রাখতে সহগ হবে: 2H₂ + O₂ → 2H₂O।',
    explanationEnglish: '2H₂ + O₂ → 2H₂O balances 4 hydrogen atoms and 2 oxygen atoms on both reactant and product sides.'
  },
  {
    id: 'q7',
    difficulty: 'Medium',
    topic: 'দহন ও তাপীয় বিযোজন',
    questionBangla: 'চুনাপাথরকে (CaCO₃) তীব্র উত্তপ্ত করলে কোন গ্যাসটি নির্গত হয়?',
    questionEnglish: 'Which gas is evolved when limestone (CaCO₃) is thermally decomposed?',
    options: ['অক্সিজেন (O₂)', 'কার্বন ডাই-অক্সাইড (CO₂)', 'হাইড্রোজেন (H₂)', 'নাইট্রোজেন (N₂)'],
    correctIndex: 1,
    explanationBangla: 'CaCO₃ → CaO + CO₂। তাপ প্রয়োগে ক্যালসিয়াম কার্বনেট বিয়োজিত হয়ে পোড়াচুন ও কার্বন ডাই-অক্সাইড গ্যাস তৈরি করে।',
    explanationEnglish: 'Thermal decomposition of limestone yields solid calcium oxide (quicklime) and gaseous carbon dioxide (CO₂).'
  },
  {
    id: 'q8',
    difficulty: 'Hard',
    topic: 'জারণ-বিজারণ (Redox)',
    questionBangla: 'Zn + 2HCl → ZnCl₂ + H₂ বিক্রিয়াটিতে কোনটি বিজারক হিসেবে কাজ করে?',
    questionEnglish: 'In the reaction Zn + 2HCl → ZnCl₂ + H₂, which substance acts as the reducing agent?',
    options: ['HCl', 'Zn', 'ZnCl₂', 'H₂'],
    correctIndex: 1,
    explanationBangla: 'জিঙ্ক (Zn) পরমাণু ২টি ইলেকট্রন বর্জন করে নিজে জারিত হয় (Zn → Zn²⁺ + 2e⁻) এবং H⁺ কে বিজারিত করে; তাই Zn এখানে বিজারক।',
    explanationEnglish: 'Zinc loses electrons (is oxidized) and reduces H⁺ to H₂, thus Zn acts as the reducing agent.'
  },
  {
    id: 'q9',
    difficulty: 'Hard',
    topic: 'হেবার-বস পদ্ধতি ও প্রভাবক',
    questionBangla: 'অ্যামোনিয়া (NH₃) সংশ্লেষণের হেবার-বস পদ্ধতিতে কোন ধাতুর গুঁড়ো প্রভাবক হিসেবে ব্যবহৃত হয়?',
    questionEnglish: 'Which metal powder is used as the catalyst in the Haber process for ammonia synthesis?',
    options: ['কপার (Cu)', 'আয়রন (Fe)', 'জিঙ্ক (Zn)', 'সোডিয়াম (Na)'],
    correctIndex: 1,
    explanationBangla: 'হেবার পদ্ধতিতে নাইট্রোজেন ও হাইড্রোজেন থেকে অ্যামোনিয়া প্রস্তুতিতে সূক্ষ্ম আয়রন (Fe) চূর্ণ প্রভাবক এবং মলিবডেনাম (Mo) সহায়ক প্রভাবক হিসেবে ব্যবহৃত হয়।',
    explanationEnglish: 'Finely divided iron (Fe) acts as the catalyst with molybdenum as promoter in N₂ + 3H₂ ⇌ 2NH₃.'
  },
  {
    id: 'q10',
    difficulty: 'Hard',
    topic: 'যৌগের ধর্ম ও অধঃক্ষেপণ',
    questionBangla: 'CuSO₄ দ্রবণে NaOH যোগ করলে কোন যৌগের হালকা নীল অধঃক্ষেপ সৃষ্টি হয়?',
    questionEnglish: 'Adding NaOH to CuSO₄ solution yields a pale blue precipitate of which compound?',
    options: ['Na₂SO₄', 'Cu(OH)₂', 'CuO', 'CuCl₂'],
    correctIndex: 1,
    explanationBangla: '2NaOH + CuSO₄ → Cu(OH)₂↓ + Na₂SO₄। পানিতে অদ্রবণীয় কপার(II) হাইড্রোক্সাইড Cu(OH)₂ এর হালকা নীল জেলির মতো অধঃক্ষেপ পড়ে।',
    explanationEnglish: 'Double displacement precipitates insoluble gelatinous pale blue copper(II) hydroxide Cu(OH)₂.'
  }
];
