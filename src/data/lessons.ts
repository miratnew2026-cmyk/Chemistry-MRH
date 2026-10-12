import { ChemistryLesson } from '../types';

export const LESSONS: ChemistryLesson[] = [
  {
    id: 'lesson_atomic_structure',
    titleBangla: 'পরমাণুর গঠন (Atomic Structure)',
    titleEnglish: 'Atomic Structure',
    icon: 'Atom',
    sections: [
      {
        titleBangla: 'পরমাণুর মৌলিক কণিকাসমূহ',
        titleEnglish: 'Fundamental Subatomic Particles',
        contentBangla: 'পরমাণু প্রধানত তিনটি স্থায়ী মূল কণিকা নিয়ে গঠিত: ইলেকট্রন (ঋণাত্মক চার্জযুক্ত), প্রোটন (ধনাত্মক চার্জযুক্ত) এবং নিউট্রন (চার্জহীন)। পরমাণুর কেন্দ্রস্থলে অত্যন্ত ক্ষুদ্র ও ঘন অংশে থাকে নিউক্লিয়াস, যাতে প্রোটন ও নিউট্রন আবদ্ধ থাকে। ইলেকট্রনগুলো নিউক্লিয়াসের চারপাশের নির্দিষ্ট কক্ষপথে সর্বদা ঘূর্ণায়মান।',
        contentEnglish: 'An atom comprises three fundamental particles: electrons (negative), protons (positive), and neutrons (neutral). Protons and neutrons reside in the tiny dense central nucleus, orbited by electrons.',
        keyPoints: [
          'পারমাণবিক সংখ্যা (Z) = প্রোটন সংখ্যা',
          'ভর সংখ্যা (A) = প্রোটন সংখ্যা + নিউট্রন সংখ্যা',
          'একটি নিরপেক্ষ পরমাণুতে প্রোটন ও ইলেকট্রন সংখ্যা সর্বদা সমান থাকে'
        ]
      },
      {
        titleBangla: 'বোর পরমাণু মডেল ও শক্তিস্তর',
        titleEnglish: 'Bohr Model and Energy Shells',
        contentBangla: 'বিজ্ঞানী নীলস বোর ১৯১৩ সালে প্রস্তাব করেন যে ইলেকট্রনগুলো নিউক্লিয়াসকে কেন্দ্র করে নির্দিষ্ট বৃত্তাকার অনুমোদিত স্থায়ী কক্ষপথে (K, L, M, N...) ঘোরে। প্রতিটি কক্ষপথে সর্বোচ্চ ইলেকট্রন ধারণ ক্ষমতা 2n² সূত্র দ্বারা নির্ধারিত হয়।',
        contentEnglish: 'According to the Bohr model, electrons orbit in quantized, concentric discrete energy levels labeled K, L, M, N (n = 1, 2, 3, 4). The maximum electron capacity of each shell is 2n².',
        keyPoints: [
          'K শক্তিস্তর (n=1): সর্বোচ্চ ২টি ইলেকট্রন',
          'L শক্তিস্তর (n=2): সর্বোচ্চ ৮টি ইলেকট্রন',
          'M শক্তিস্তর (n=3): সর্বোচ্চ ১৮টি ইলেকট্রন'
        ]
      }
    ]
  },
  {
    id: 'lesson_periodic_table',
    titleBangla: 'পর্যায় সারণি (Periodic Table)',
    titleEnglish: 'The Periodic Table',
    icon: 'Layers',
    sections: [
      {
        titleBangla: 'আধুনিক পর্যায় সূত্র',
        titleEnglish: 'Modern Periodic Law',
        contentBangla: 'মৌলসমূহের ভৌত ও রাসায়নিক ধর্মাবলি তাদের পারমাণবিক সংখ্যা (Atomic Number) বৃদ্ধির সাথে পর্যায়ক্রমে আবর্তিত হয়। আধুনিক পর্যায় সারণিতে ৭টি অনুভূমিক পর্যায় (Periods) এবং ১৮টি খাড়া স্তম্ভ বা গ্রুপ (Groups) রয়েছে। মোট ১১৮টি মৌল এতে স্থান পেয়েছে।',
        contentEnglish: 'The physical and chemical properties of elements are periodic functions of their atomic numbers. The modern periodic table contains 7 horizontal periods and 18 vertical groups for 118 elements.',
        keyPoints: [
          'গ্রুপ ১: ক্ষার ধাতু (Alkali Metals - Li, Na, K...) - অত্যন্ত সক্রিয়',
          'গ্রুপ ২: মৃৎক্ষার ধাতু (Alkaline Earth Metals - Be, Mg, Ca...)',
          'গ্রুপ ১৭: হ্যালোজেন (Halogens - F, Cl, Br, I...) - লবণ উৎপাদক',
          'গ্রুপ ১৮: নিষ্ক্রিয় গ্যাস (Noble Gases - He, Ne, Ar...) - স্থিতিশীল অষ্টক'
        ]
      },
      {
        titleBangla: 'পর্যাবৃত্ত ধর্মাবলি',
        titleEnglish: 'Periodic Trends',
        contentBangla: 'একই পর্যায়ে বাম থেকে ডানে গেলে পারমাণবিক ব্যাসার্ধ হ্রাস পায় এবং আয়নীকরণ শক্তি, ইলেকট্রন আসক্তি ও তড়িৎ ঋণাত্মকতা বৃদ্ধি পায়। পক্ষান্তরে, একই গ্রুপে উপর থেকে নিচে নামলে পারমাণবিক আকার বৃদ্ধি পায় এবং ধাতব সক্রিয়তা বৃদ্ধি পায়।',
        contentEnglish: 'Across a period from left to right, atomic radius decreases while ionization energy, electron affinity, and electronegativity increase. Down a group, atomic radius increases.',
        keyPoints: [
          'সবচেয়ে তড়িৎ ঋণাত্মক মৌল: ফ্লোরিন (F - ৩.৯৮)',
          'সবচেয়ে ক্ষারীয় সক্রিয় অধাতু: সিজিয়াম / ফ্রান্সিয়াম'
        ]
      }
    ]
  },
  {
    id: 'lesson_valency',
    titleBangla: 'যোজনী ও যোজ্যতা ইলেকট্রন (Valency & Valence Electrons)',
    titleEnglish: 'Valency & Valence Electrons',
    icon: 'Sparkles',
    sections: [
      {
        titleBangla: 'যোজ্যতা ইলেকট্রন ও যোজনীর পার্থক্য',
        titleEnglish: 'Valence Electrons vs. Valency',
        contentBangla: 'কোনো মৌলের পরমাণুর সর্ববহিঃস্থ প্রধান শক্তিস্তরের মোট ইলেকট্রন সংখ্যাকে তার যোজ্যতা ইলেকট্রন (Valence Electrons) বলে। অপরপক্ষে, কোনো মৌলের অন্য মৌলের সাথে যুক্ত হওয়ার ক্ষমতাকে যোজনী (Valency) বলে। যেমন: অক্সিজেনের সর্ববহিঃস্থ স্তরে ৬টি ইলেকট্রন থাকে (যোজ্যতা ইলেকট্রন = ৬), কিন্তু অষ্টক পূরণ করতে ২টি ইলেকট্রন গ্রহণ করে বলে এর যোজনী = ২।',
        contentEnglish: 'Valence electrons are the electrons residing in the outermost energy shell. Valency denotes the combining capacity of an atom to achieve a stable octet.',
        keyPoints: [
          'সোডিয়াম (Na): ইলেকট্রন বিন্যাস ২, ৮, ১ → যোজ্যতা ইলেকট্রন = ১, যোজনী = ১',
          'ক্লোরিন (Cl): ইলেকট্রন বিন্যাস ২, ৮, ৭ → যোজ্যতা ইলেকট্রন = ৭, যোজনী = ১',
          'কার্বন (C): যোজনী = ৪ (পরিবর্তনশীল যোজনী ২ ও ৪)'
        ]
      }
    ]
  },
  {
    id: 'lesson_chemical_bonding',
    titleBangla: 'রাসায়নিক বন্ধন (Chemical Bonding)',
    titleEnglish: 'Chemical Bonding',
    icon: 'Share2',
    sections: [
      {
        titleBangla: 'অষ্টক ও দ্বৈত নিয়ম',
        titleEnglish: 'Octet and Duplet Rules',
        contentBangla: 'প্রতিটি মৌল নিষ্ক্রিয় গ্যাসের মতো তার সর্ববহিঃস্থ প্রধান শক্তিস্তরে ৮টি ইলেকট্রন (বা হিলিয়ামের ক্ষেত্রে ২টি ইলেকট্রন) অর্জন করে সুস্থিতি লাভের চেষ্টা করে। এই উদ্দেশ্যেই পরমাণুগুলো ইলেকট্রন আদান-প্রদান বা শেয়ারের মাধ্যমে একে অপরের সাথে যুক্ত হয়ে রাসায়নিক বন্ধন সৃষ্টি করে।',
        contentEnglish: 'Atoms bond by gaining, losing, or sharing electrons to achieve a stable electronic configuration identical to the nearest noble gas (duplet or octet).',
        keyPoints: [
          'আয়নিক বন্ধন: ধাতু ও অধাতুর মধ্যে ইলেকট্রন আদান-প্রদান',
          'সমযোজী বন্ধন: অধাতু ও অধাতুর মধ্যে ইলেকট্রন জোড় শেয়ারিং',
          'ধাতব বন্ধন: ধাতুর পরমাণুগুলোর মধ্যে মুক্ত ইলেকট্রন সাগরে আবদ্ধ থাকা'
        ]
      },
      {
        titleBangla: 'আয়নিক ও সমযোজী যৌগের ধর্ম তুলনা',
        titleEnglish: 'Comparison of Ionic and Covalent Compounds',
        contentBangla: 'আয়নিক যৌগসমূহ সাধারণত উচ্চ গলনাঙ্ক ও স্ফুটনাঙ্ক বিশিষ্ট স্ফটিকাকার কঠিন পদার্থ। এরা পানিতে দ্রবীভূত হয়ে আয়ন তৈরি করে এবং জলীয় বা গলিত অবস্থায় বিদ্যুৎ পরিবহন করে (যেমন NaCl)। সমযোজী যৌগসমূহ সাধারণত নিম্ন গলনাঙ্ক বিশিষ্ট এবং জলীয় দ্রবণে বিদ্যুৎ অপরিবাহী (যেমন গ্লুকোজ, মিথেন)।',
        contentEnglish: 'Ionic compounds have high melting points, crystal lattices, dissolve in polar water, and conduct electricity when molten or aqueous. Covalent compounds have lower melting points and rarely conduct electricity.',
        keyPoints: [
          'খাবার লবণ (NaCl): আয়নিক যৌগ, পানিতে চমৎকার বিদ্যুৎ পরিবাহী',
          'পানি (H₂O): পোলার সমযোজী যৌগ'
        ]
      }
    ]
  },
  {
    id: 'lesson_acid_base_salts',
    titleBangla: 'এসিড, ক্ষারক ও লবণ (Acids, Bases & Salts)',
    titleEnglish: 'Acids, Bases & Salts',
    icon: 'TestTubes',
    sections: [
      {
        titleBangla: 'এসিড ও ক্ষারকের বৈশিষ্ট্য',
        titleEnglish: 'Characteristics of Acids and Bases',
        contentBangla: 'এসিড স্বাদে টক, জলীয় দ্রবণে হাইড্রোজেন আয়ন (H⁺) দেয় এবং নীল লিটমাসকে লাল করে (যেমন HCl, H₂SO₄)। ক্ষারক সাধারণত পিচ্ছিল, স্বাদে তিক্ত, জলীয় দ্রবণে হাইড্রোক্সিল আয়ন (OH⁻) দেয় এবং লাল লিটমাসকে নীল করে (যেমন NaOH, Ca(OH)₂)।',
        contentEnglish: 'Acids taste sour, produce hydronium/hydrogen ions (H⁺) in water, and turn blue litmus red. Bases feel slippery, yield OH⁻ ions, and turn red litmus blue.',
        keyPoints: [
          'pH স্কেল: ০ থেকে ১৪ (pH < ৭ এসিডিক, pH = ৭ নিরপেক্ষ, pH > ৭ ক্ষারীয়)',
          'সব ক্ষারই ক্ষারক, কিন্তু সব ক্ষারক ক্ষার নয় (পানিতে দ্রবণীয় ক্ষারকই ক্ষার)'
        ]
      },
      {
        titleBangla: 'প্রশমন বিক্রিয়া',
        titleEnglish: 'Neutralization Reaction',
        contentBangla: 'এসিড ও ক্ষারের রাসায়নিক মিলনে তাদের নিজস্ব অম্লত্ব ও ক্ষারত্ব বিনষ্ট হয়ে নিরপেক্ষ লবণ ও পানি তৈরি হওয়াকে প্রশমন বিক্রিয়া বলে। এই বিক্রিয়ায় সর্বদা তাপ উৎপন্ন হয় (তীব্র এসিড ও তীব্র ক্ষারের প্রশমন তাপ প্রায় -৫৭.৩৪ কিলোজুল/মোল)।',
        contentEnglish: 'Neutralization occurs when an acid and base react stoichiometrically to produce a salt and water, extinguishing acidity and alkalinity.',
        exampleEquations: ['HCl + NaOH → NaCl + H₂O', 'H₂SO₄ + 2KOH → K₂SO₄ + 2H₂O']
      }
    ]
  },
  {
    id: 'lesson_chemical_reactions',
    titleBangla: 'রাসায়নিক বিক্রিয়া ও প্রকারভেদ (Types of Chemical Reactions)',
    titleEnglish: 'Types of Chemical Reactions',
    icon: 'Flame',
    sections: [
      {
        titleBangla: 'প্রধান ৫ প্রকার রাসায়নিক বিক্রিয়া',
        titleEnglish: '5 Main Reaction Categories',
        contentBangla: 'নবম-দশম শ্রেণির পাঠ্যবই অনুযায়ী রাসায়নিক বিক্রিয়াকে প্রধানত নিচের শ্রেণিতে ভাগ করা যায়:',
        contentEnglish: 'Core reaction classes covered in school chemistry curricula:',
        keyPoints: [
          '১. সংযোজন বিক্রিয়া (Combination): একাধিক পদার্থ যুক্ত হয়ে একটি যৌগ গঠন (2H₂ + O₂ → 2H₂O)',
          '২. বিযোজন বিক্রিয়া (Decomposition): একটি যৌগ ভেঙে একাধিক পদার্থে রূপান্তর (CaCO₃ → CaO + CO₂)',
          '৩. প্রতিস্থাপন বিক্রিয়া (Displacement): অধিক সক্রিয় মৌল কম সক্রিয় মৌলকে অপসারণ করে (Zn + 2HCl → ZnCl₂ + H₂)',
          '৪. দ্বি-প্রতিস্থাপন / অধঃক্ষেপণ বিক্রিয়া: মূলক পারস্পরিক বিনিময় (2NaOH + CuSO₄ → Cu(OH)₂↓ + Na₂SO₄)',
          '৫. দহন বিক্রিয়া (Combustion): বাতাসের অক্সিজেনে কোনো পদার্থকে পুড়িয়ে তাপ ও আলো উৎপন্ন করা (CH₄ + 2O₂ → CO₂ + 2H₂O)'
        ],
        exampleEquations: ['2Mg + O₂ → 2MgO', 'Fe + CuSO₄ → FeSO₄ + Cu']
      }
    ]
  },
  {
    id: 'lesson_redox',
    titleBangla: 'জারণ-বিজারণ (Oxidation & Reduction / Redox)',
    titleEnglish: 'Oxidation & Reduction (Redox)',
    icon: 'RefreshCw',
    sections: [
      {
        titleBangla: 'ইলেকট্রনীয় মতবাদ',
        titleEnglish: 'Electronic Concept of Redox',
        contentBangla: 'জারণ মানেই ইলেকট্রন বর্জন (Loss of Electrons - Oxidation) এবং বিজারণ মানেই ইলেকট্রন গ্রহণ (Gain of Electrons - Reduction)। মনে রাখার সংক্ষিপ্ত সূত্র: "জারণ বর্জন, বিজারণ গ্রহণ"। জারণ ও বিজারণ সর্বদা যুগপৎ বা একসাথে সংঘটিত হয়।',
        contentEnglish: 'Oxidation is the loss of electrons (OIL); reduction is the gain of electrons (RIG). Both half-reactions always take place simultaneously.',
        keyPoints: [
          'জারক (Oxidizing Agent): যা অন্যকে জারিত করে নিজে বিজারিত হয় (ইলেকট্রন গ্রহণ করে)',
          'বিজারক (Reducing Agent): যা অন্যকে বিজারিত করে নিজে জারিত হয় (ইলেকট্রন বর্জন করে)'
        ]
      }
    ]
  },
  {
    id: 'lesson_balancing',
    titleBangla: 'রাসায়নিক সমীকরণ সমতাকরণ (Balancing Chemical Equations)',
    titleEnglish: 'Balancing Chemical Equations',
    icon: 'Scale',
    sections: [
      {
        titleBangla: 'ভরের নিত্যতা সূত্র ও সমতাকরণ',
        titleEnglish: 'Law of Conservation of Mass',
        contentBangla: 'ল্যাভয়সিয়ারের ভরের নিত্যতা সূত্রানুসারে রাসায়নিক বিক্রিয়ার পূর্বে ও পরে মোট পরমাণুর সংখ্যা সর্বদা অপরিবর্তিত থাকে। কোনো পরমাণু ধ্বংস বা সৃষ্টি হতে পারে না। তাই সমীকরণের তীরচিহ্নের বাম পাশের (বিক্রিয়ক) প্রতিটি মৌলের পরমাণু সংখ্যা এবং ডান পাশের (উৎপাদ) পরমাণু সংখ্যা সমান করতে প্রয়োজনীয় সহগ (Coefficients) বসাতে হয়।',
        contentEnglish: 'According to the law of conservation of mass, matter cannot be created or destroyed. The number of atoms of each element on the reactant side must equal that on the product side.',
        keyPoints: [
          'কখনও সাবস্ক্রিপ্ট পরিবর্তন করা যাবে না (যেমন H₂O কে H₂O₂ লেখা যাবে না)',
          'কেবলমাত্র অণুর সামনে উপযুক্ত পূর্ণসংখ্যা সহগ (২, ৩, ৪...) বসিয়ে সমতা করতে হবে'
        ],
        exampleEquations: [
          'অসমতাকৃত: H₂ + O₂ → H₂O',
          'সমতাকৃত: 2H₂ + O₂ → 2H₂O'
        ]
      }
    ]
  }
];
