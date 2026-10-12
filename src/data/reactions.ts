import { ChemicalReaction } from '../types';

export const VERIFIED_REACTIONS: ChemicalReaction[] = [
  {
    id: 'rxn_water_formation',
    reactants: ['H2', 'O2'],
    products: ['H2O'],
    balancedEquation: '2H₂ + O₂ → 2H₂O',
    reactionType: 'Combination',
    conditions: {
      fireRequired: true,
      heatRequired: true,
      minTemp: 100
    },
    animationType: 'flame-glow',
    energyBehavior: 'exothermic',
    temperatureRise: 85,
    explanationBangla: 'হাইড্রোজেন ও অক্সিজেন গ্যাস যুক্ত হয়ে তরল পানি উৎপন্ন করেছে। দুটি মৌলিক পদার্থ যুক্ত হয়ে একটি মাত্র যৌগ তৈরি করায় এটি একটি সংযোজন বিক্রিয়া (Combination Reaction)। একই সাথে এতে প্রচুর তাপ নির্গত হওয়ায় এটি তাপোৎপাদী বিক্রিয়া।',
    explanationEnglish: 'Two molecules of hydrogen gas combine with one molecule of oxygen under ignition to produce water. This is an exothermic combination / synthesis reaction.',
    difficulty: 'Easy',
    verified: true,
    colorChange: { from: '#0284c7', to: '#38bdf8' },
    productDetails: [
      {
        formula: 'H₂O',
        name: 'Water',
        nameBangla: 'পানি',
        state: 'Liquid',
        colorHex: '#38bdf8',
        atoms: [
          { symbol: 'H', count: 2 },
          { symbol: 'O', count: 1 }
        ],
        properties: 'রঙহীন, গন্ধহীন তরল; নিরপেক্ষ pH ৭; সার্বজনীন দ্রাবক।',
        schoolRelevance: '৯ম-১০ম শ্রেণি: পানির সংযোজন সংশ্লেষণ, জীবনের মূল উপাদান।'
      }
    ],
    visualEffects: {
      glowColor: '#38bdf8',
      gasVapor: true,
      soundEffect: 'pop'
    }
  },
  {
    id: 'rxn_neutralization_hcl_naoh',
    reactants: ['HCl', 'NaOH'],
    products: ['NaCl', 'H2O'],
    balancedEquation: 'HCl + NaOH → NaCl + H₂O',
    reactionType: 'Neutralization',
    conditions: {},
    animationType: 'neutralization-glow',
    energyBehavior: 'exothermic',
    temperatureRise: 22,
    explanationBangla: 'এখানে অ্যাসিড (HCl) এবং ক্ষার (NaOH) পরস্পর বিক্রিয়া করে নিরপেক্ষ খাবার লবণ (NaCl) ও পানি (H₂O) উৎপন্ন করেছে। এই ধরনের অ্যাসিড-ক্ষার বিক্রিয়াকে প্রশমন বিক্রিয়া (Neutralization Reaction) বলা হয়। এতে প্রশমন তাপ উৎপন্ন হয়।',
    explanationEnglish: 'Hydrochloric acid reacts with sodium hydroxide base to produce neutral table salt (NaCl) and water (H₂O). This is a classic neutralization reaction yielding heat of neutralization.',
    difficulty: 'Easy',
    verified: true,
    colorChange: { from: '#e11d48', to: '#10b981' },
    productDetails: [
      {
        formula: 'NaCl',
        name: 'Sodium Chloride',
        nameBangla: 'সোডিয়াম ক্লোরাইড (খাবার লবণ)',
        state: 'Solid',
        colorHex: '#f8fafc',
        atoms: [
          { symbol: 'Na', count: 1 },
          { symbol: 'Cl', count: 1 }
        ],
        properties: 'সাদা স্ফটিকাকার লবণ, পানিতে সম্পূর্ণ দ্রবণীয়, নিরপেক্ষ লবণ।',
        schoolRelevance: '৯ম-১০ম শ্রেণি: অ্যাসিড-ক্ষার বিক্রিয়ার প্রধান লবণ।'
      },
      {
        formula: 'H₂O',
        name: 'Water',
        nameBangla: 'পানি',
        state: 'Liquid',
        colorHex: '#38bdf8',
        atoms: [
          { symbol: 'H', count: 2 },
          { symbol: 'O', count: 1 }
        ],
        properties: 'প্রশমিত নিরপেক্ষ তরল মাধ্যম।',
        schoolRelevance: '৯ম-১০ম শ্রেণি: প্রশমন বিক্রিয়ার উপজাত।'
      }
    ],
    visualEffects: {
      glowColor: '#10b981',
      soundEffect: 'gentle'
    }
  },
  {
    id: 'rxn_caco3_decomp',
    reactants: ['CaCO3'],
    products: ['CaO', 'CO2'],
    balancedEquation: 'CaCO₃ → CaO + CO₂↑',
    reactionType: 'Decomposition',
    conditions: {
      heatRequired: true,
      fireRequired: true,
      minTemp: 250
    },
    animationType: 'fizz-gas',
    energyBehavior: 'endothermic',
    temperatureRise: -15,
    explanationBangla: 'ক্যালসিয়াম কার্বনেট (চুনাপাথর)-কে তীব্র তাপ প্রয়োগ করলে এটি ভেঙে ক্যালসিয়াম অক্সাইড (পোড়াচুন) এবং কার্বন ডাই-অক্সাইড গ্যাসে পরিণত হয়। একটি যৌগ ভেঙে একাধিক পদার্থে পরিণত হওয়ায় এটি একটি বিযোজন বিক্রিয়া (Decomposition Reaction)।',
    explanationEnglish: 'Thermal decomposition of limestone (calcium carbonate) by heat breaks the ionic lattice into quicklime (CaO) solid and carbon dioxide gas (CO₂).',
    difficulty: 'Medium',
    verified: true,
    colorChange: { from: '#e2e8f0', to: '#cbd5e1' },
    productDetails: [
      {
        formula: 'CaO',
        name: 'Calcium Oxide',
        nameBangla: 'ক্যালসিয়াম অক্সাইড (পোড়াচুন)',
        state: 'Solid',
        colorHex: '#cbd5e1',
        atoms: [
          { symbol: 'Ca', count: 1 },
          { symbol: 'O', count: 1 }
        ],
        properties: 'সাদা রঙের ক্ষারকীয় ধাতব অক্সাইড।',
        schoolRelevance: '৯ম-১০ম শ্রেণি: চুনের ভাটায় প্রস্তুত পোড়াচুন।'
      },
      {
        formula: 'CO₂',
        name: 'Carbon Dioxide',
        nameBangla: 'কার্বন ডাই-অক্সাইড গ্যাস',
        state: 'Gas',
        colorHex: '#94a3b8',
        atoms: [
          { symbol: 'C', count: 1 },
          { symbol: 'O', count: 2 }
        ],
        properties: 'চুনের পানিকে ঘোলা করে এমন বর্ণহীন গ্যাস।',
        schoolRelevance: '৯ম-১০ম শ্রেণি: বিযোজন বিক্রিয়ার উদ্বায়ী গ্যাস।'
      }
    ],
    visualEffects: {
      gasVapor: true,
      bubbles: true,
      soundEffect: 'fizz'
    }
  },
  {
    id: 'rxn_zn_hcl',
    reactants: ['Zn', 'HCl'],
    products: ['ZnCl2', 'H2'],
    balancedEquation: 'Zn + 2HCl → ZnCl₂ + H₂↑',
    reactionType: 'Single Displacement',
    conditions: {},
    animationType: 'bubbles',
    energyBehavior: 'exothermic',
    temperatureRise: 28,
    explanationBangla: 'সক্রিয়তা সিরিজে জিঙ্ক (Zn) হাইড্রোজেনের চেয়ে উপরে অবস্থান করায় এটি অ্যাসিড থেকে হাইড্রোজেনকে প্রতিস্থাপিত করে জিঙ্ক ক্লোরাইড দ্রবণ এবং হাইড্রোজেন গ্যাস (H₂) এর বুদবুদ সৃষ্টি করে। এটি একটি প্রতিস্থাপন বিক্রিয়া (Single Displacement Reaction)।',
    explanationEnglish: 'Zinc is more reactive than hydrogen in the activity series, so it displaces hydrogen from hydrochloric acid to produce aqueous zinc chloride and effervescent hydrogen gas bubbles.',
    difficulty: 'Easy',
    verified: true,
    colorChange: { from: '#94a3b8', to: '#38bdf8' },
    productDetails: [
      {
        formula: 'ZnCl₂',
        name: 'Zinc Chloride',
        nameBangla: 'জিঙ্ক ক্লোরাইড দ্রবণ',
        state: 'Solid',
        colorHex: '#cbd5e1',
        atoms: [
          { symbol: 'Zn', count: 1 },
          { symbol: 'Cl', count: 2 }
        ],
        properties: 'বর্ণহীন দ্রবণীয় লবণ।',
        schoolRelevance: '৯ম-১০ম শ্রেণি: ধাতু ও এসিডের বিক্রিয়াজাত লবণ।'
      },
      {
        formula: 'H₂',
        name: 'Hydrogen Gas',
        nameBangla: 'হাইড্রোজেন গ্যাস',
        state: 'Gas',
        colorHex: '#67e8f9',
        atoms: [
          { symbol: 'H', count: 2 }
        ],
        properties: 'হালকা দাহ্য গ্যাস যা পপ (Pop) শব্দ সহ জ্বলে।',
        schoolRelevance: '৯ম-১০ম শ্রেণি: পরীক্ষাগারে H₂ গ্যাস প্রস্তুতকরণ।'
      }
    ],
    visualEffects: {
      bubbles: true,
      gasVapor: true,
      soundEffect: 'fizz'
    }
  },
  {
    id: 'rxn_fe_cuso4',
    reactants: ['Fe', 'CuSO4'],
    products: ['FeSO4', 'Cu'],
    balancedEquation: 'Fe + CuSO₄ → FeSO₄ + Cu↓',
    reactionType: 'Single Displacement',
    conditions: {},
    animationType: 'precipitate',
    energyBehavior: 'exothermic',
    temperatureRise: 14,
    explanationBangla: 'সক্রিয়তা সিরিজে লোহা (Fe) তামার (Cu) চেয়ে বেশি সক্রিয়। তাই লোহা তুঁতের নীল দ্রবণ থেকে তামাকে প্রতিস্থাপিত করে নিচে লালচে তামা জমা করে এবং দ্রবণটি হালকা সবুজ রঙের ফেরাস সালফেটে (FeSO₄) রূপান্তরিত হয়। এটি জারণ-বিজারণ (Redox) প্রতিস্থাপন বিক্রিয়া।',
    explanationEnglish: 'Iron is more electropositive than copper. Iron atoms dissolve as Fe²⁺ turning the blue copper sulfate solution pale green, while copper ions are reduced and precipitate as reddish copper metal.',
    difficulty: 'Easy',
    verified: true,
    colorChange: { from: '#0284c7', to: '#84cc16' },
    productDetails: [
      {
        formula: 'FeSO₄',
        name: 'Iron(II) Sulfate',
        nameBangla: 'ফেরাস সালফেট',
        state: 'Solid',
        colorHex: '#84cc16',
        atoms: [
          { symbol: 'Fe', count: 1 },
          { symbol: 'S', count: 1 },
          { symbol: 'O', count: 4 }
        ],
        properties: 'হালকা সবুজ বর্ণের জলীয় দ্রবণ।',
        schoolRelevance: '৯ম-১০ম শ্রেণি: সক্রিয়তা ধারার প্রদর্শন ও রঙ পরিবর্তন।'
      },
      {
        formula: 'Cu',
        name: 'Copper Metal',
        nameBangla: 'তামা (ধাতু)',
        state: 'Solid',
        colorHex: '#b45309',
        atoms: [
          { symbol: 'Cu', count: 1 }
        ],
        properties: 'লালচে বাদামী কঠিন ধাতব অধঃক্ষেপ।',
        schoolRelevance: '৯ম-১০ম শ্রেণি: প্রতিস্থাপিত অবক্ষেপ ধাতু।'
      }
    ],
    visualEffects: {
      precipitate: true,
      soundEffect: 'gentle'
    }
  },
  {
    id: 'rxn_mg_o2_combustion',
    reactants: ['Mg', 'O2'],
    products: ['MgO'],
    balancedEquation: '2Mg + O₂ → 2MgO',
    reactionType: 'Combustion',
    conditions: {
      heatRequired: true,
      fireRequired: true,
      minTemp: 150
    },
    animationType: 'flame-glow',
    energyBehavior: 'exothermic',
    temperatureRise: 110,
    explanationBangla: 'ম্যাগনেসিয়াম ফিতা অক্সিজেনের উপস্থিতিতে আগুনের সংস্পর্শে এলে চোখ ধাঁধানো উজ্জ্বল সাদা আলো ছড়িয়ে জ্বলে ওঠে এবং সাদা গুঁড়ো ম্যাগনেসিয়াম অক্সাইড (MgO) ছাইয়ে পরিণত হয়। এটি একটি তীব্র দহন ও সংযোজন বিক্রিয়া।',
    explanationEnglish: 'Magnesium metal burns vigorously in oxygen with an intense dazzling white flame, forming white powdery magnesium oxide. This is an exothermic synthesis and combustion reaction.',
    difficulty: 'Easy',
    verified: true,
    colorChange: { from: '#94a3b8', to: '#f8fafc' },
    productDetails: [
      {
        formula: 'MgO',
        name: 'Magnesium Oxide',
        nameBangla: 'ম্যাগনেসিয়াম অক্সাইড',
        state: 'Solid',
        colorHex: '#f1f5f9',
        atoms: [
          { symbol: 'Mg', count: 1 },
          { symbol: 'O', count: 1 }
        ],
        properties: 'ধবধবে সাদা ক্ষারকীয় অক্সাইড গুঁড়া।',
        schoolRelevance: '৯ম-১০ম শ্রেণি: ধাতুর উজ্জ্বল দহন ও মৌলিক অক্সাইড গঠন।'
      }
    ],
    visualEffects: {
      glowColor: '#ffffff',
      gasVapor: true,
      soundEffect: 'pop'
    }
  },
  {
    id: 'rxn_caco3_hcl',
    reactants: ['CaCO3', 'HCl'],
    products: ['CaCl2', 'H2O', 'CO2'],
    balancedEquation: 'CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂↑',
    reactionType: 'Double Displacement',
    conditions: {},
    animationType: 'bubbles',
    energyBehavior: 'exothermic',
    temperatureRise: 18,
    explanationBangla: 'চুনাপাথরে লঘু হাইড্রোক্লোরিক অ্যাসিড যোগ করলে তীব্র বুদবুদসহ কার্বন ডাই-অক্সাইড (CO₂) গ্যাস নির্গত হয় এবং ক্যালসিয়াম ক্লোরাইড লবণ ও পানি তৈরি হয়। কার্বনেট লবণ শনাক্তকরণে এটি একটি প্রধান পরীক্ষা।',
    explanationEnglish: 'Calcium carbonate effervesces rapidly with hydrochloric acid to generate calcium chloride, water, and gaseous carbon dioxide. Standard diagnostic test for carbonates.',
    difficulty: 'Medium',
    verified: true,
    colorChange: { from: '#e2e8f0', to: '#38bdf8' },
    productDetails: [
      {
        formula: 'CaCl₂',
        name: 'Calcium Chloride',
        nameBangla: 'ক্যালসিয়াম ক্লোরাইড',
        state: 'Solid',
        colorHex: '#e2e8f0',
        atoms: [
          { symbol: 'Ca', count: 1 },
          { symbol: 'Cl', count: 2 }
        ],
        properties: 'পানিতে অত্যন্ত দ্রবণীয় লবণ।',
        schoolRelevance: '৯ম-১০ম শ্রেণি: কার্বনেট-এসিড বিক্রিয়াজাত লবণ।'
      },
      {
        formula: 'H₂O',
        name: 'Water',
        nameBangla: 'পানি',
        state: 'Liquid',
        colorHex: '#38bdf8',
        atoms: [
          { symbol: 'H', count: 2 },
          { symbol: 'O', count: 1 }
        ],
        properties: 'স্বচ্ছ তরল।',
        schoolRelevance: 'উপজাত'
      },
      {
        formula: 'CO₂',
        name: 'Carbon Dioxide',
        nameBangla: 'কার্বন ডাই-অক্সাইড',
        state: 'Gas',
        colorHex: '#94a3b8',
        atoms: [
          { symbol: 'C', count: 1 },
          { symbol: 'O', count: 2 }
        ],
        properties: 'বুদবুদ আকারে নির্গত বর্ণহীন অম্লীয় গ্যাস।',
        schoolRelevance: 'কার্বনেটের নিশ্চিতকরণ গ্যাস।'
      }
    ],
    visualEffects: {
      bubbles: true,
      gasVapor: true,
      soundEffect: 'bubbling'
    }
  },
  {
    id: 'rxn_ch4_combustion',
    reactants: ['CH4', 'O2'],
    products: ['CO2', 'H2O'],
    balancedEquation: 'CH₄ + 2O₂ → CO₂ + 2H₂O',
    reactionType: 'Combustion',
    conditions: {
      fireRequired: true,
      heatRequired: true,
      minTemp: 120
    },
    animationType: 'flame-glow',
    energyBehavior: 'exothermic',
    temperatureRise: 95,
    explanationBangla: 'প্রাকৃতিক গ্যাসের প্রধান উপাদান মিথেন অক্সিজেনের উপস্থিতিতে নীল শিখাসহ জ্বলে কার্বন ডাই-অক্সাইড, জলীয় বাষ্প এবং বিপুল পরিমাণ তাপশক্তি উৎপন্ন করে। রান্নার চুলায় ও বিদ্যুৎ কেন্দ্রে এই বিক্রিয়া ঘটে।',
    explanationEnglish: 'Complete combustion of methane in oxygen produces carbon dioxide, steam, and large heat energy (ΔH = -891 kJ/mol). Clean natural gas combustion.',
    difficulty: 'Easy',
    verified: true,
    colorChange: { from: '#10b981', to: '#38bdf8' },
    productDetails: [
      {
        formula: 'CO₂',
        name: 'Carbon Dioxide',
        nameBangla: 'কার্বন ডাই-অক্সাইড',
        state: 'Gas',
        colorHex: '#94a3b8',
        atoms: [
          { symbol: 'C', count: 1 },
          { symbol: 'O', count: 2 }
        ],
        properties: 'দহন গ্যাস।',
        schoolRelevance: '৯ম-১০ম শ্রেণি: হাইড্রোকার্বনের দহন পণ্য।'
      },
      {
        formula: 'H₂O',
        name: 'Water Vapor',
        nameBangla: 'জলীয় বাষ্প',
        state: 'Gas',
        colorHex: '#38bdf8',
        atoms: [
          { symbol: 'H', count: 2 },
          { symbol: 'O', count: 1 }
        ],
        properties: 'বাষ্পীভূত পানি।',
        schoolRelevance: 'দহনের উপজাত।'
      }
    ],
    visualEffects: {
      glowColor: '#38bdf8',
      gasVapor: true,
      soundEffect: 'pop'
    }
  },
  {
    id: 'rxn_naoh_cuso4',
    reactants: ['NaOH', 'CuSO4'],
    products: ['Cu(OH)2', 'Na2SO4'],
    balancedEquation: '2NaOH + CuSO₄ → Cu(OH)₂↓ + Na₂SO₄',
    reactionType: 'Double Displacement',
    conditions: {},
    animationType: 'precipitate',
    energyBehavior: 'exothermic',
    temperatureRise: 12,
    explanationBangla: 'তুঁতের নীল দ্রবণে সোডিয়াম হাইড্রোক্সাইড যোগ করলে কপার ও সোডিয়ামের মূলক বিনিময় ঘটে। এর ফলে পানিতে অদ্রবণীয় কপার(II) হাইড্রোক্সাইডের হালকা নীল থকথকে অধঃক্ষেপ পড়ে। এটি দ্বি-প্রতিস্থাপন বা অধঃক্ষেপণ বিক্রিয়া (Precipitation Reaction)।',
    explanationEnglish: 'Double displacement between sodium hydroxide and copper(II) sulfate precipitates insoluble gelatinous pale blue copper(II) hydroxide, leaving soluble sodium sulfate in solution.',
    difficulty: 'Medium',
    verified: true,
    colorChange: { from: '#0284c7', to: '#38bdf8' },
    productDetails: [
      {
        formula: 'Cu(OH)₂',
        name: 'Copper(II) Hydroxide',
        nameBangla: 'কপার(II) হাইড্রোক্সাইড',
        state: 'Solid',
        colorHex: '#38bdf8',
        atoms: [
          { symbol: 'Cu', count: 1 },
          { symbol: 'O', count: 2 },
          { symbol: 'H', count: 2 }
        ],
        properties: 'পানিতে অদ্রবণীয় হালকা নীল থকথকে অধঃক্ষেপ।',
        schoolRelevance: '৯ম-১০ম শ্রেণি: Cu²⁺ ক্যাটায়ন শনাক্তকরণ পরীক্ষা।'
      }
    ],
    visualEffects: {
      precipitate: true,
      soundEffect: 'gentle'
    }
  },
  {
    id: 'rxn_cao_water',
    reactants: ['CaO', 'H2O'],
    products: ['Ca(OH)2'],
    balancedEquation: 'CaO + H₂O → Ca(OH)₂',
    reactionType: 'Combination',
    conditions: {},
    animationType: 'liquid-swirl',
    energyBehavior: 'exothermic',
    temperatureRise: 60,
    explanationBangla: 'পোড়াচুনে (CaO) পানি ঢাললে হিস হিস শব্দসহ অত্যন্ত তীব্র তাপ উৎপন্ন হয় এবং পানি ফুটে ওঠে। তৈরি হয় কলিচুন বা স্লেকড লাইম Ca(OH)₂। এটি অত্যন্ত পরিচিত বাস্তব জীবনের একটি তাপোৎপাদী সংযোজন বিক্রিয়া।',
    explanationEnglish: 'Slaking of quicklime: calcium oxide violently combines with water in an intensely exothermic reaction to produce slaked lime (calcium hydroxide), often causing water to boil.',
    difficulty: 'Easy',
    verified: true,
    colorChange: { from: '#cbd5e1', to: '#f1f5f9' },
    productDetails: [
      {
        formula: 'Ca(OH)₂',
        name: 'Calcium Hydroxide (Slaked Lime)',
        nameBangla: 'ক্যালসিয়াম হাইড্রোক্সাইড (কলিচুন)',
        state: 'Solid',
        colorHex: '#f1f5f9',
        atoms: [
          { symbol: 'Ca', count: 1 },
          { symbol: 'O', count: 2 },
          { symbol: 'H', count: 2 }
        ],
        properties: 'ক্ষারীয় সাদা চুন। এর স্বচ্ছ দ্রবণকে চুনের পানি (Limewater) বলে।',
        schoolRelevance: '৯ম-১০ম শ্রেণি: চুনকাম ও চুনের পানি তৈরি।'
      }
    ],
    visualEffects: {
      gasVapor: true,
      soundEffect: 'fizz'
    }
  },
  {
    id: 'rxn_haber_ammonia',
    reactants: ['N2', 'H2'],
    products: ['NH3'],
    balancedEquation: 'N₂ + 3H₂ ⇌ 2NH₃',
    reactionType: 'Combination',
    conditions: {
      heatRequired: true,
      minTemp: 200,
      catalyst: 'Fe powder + Mo promoter'
    },
    animationType: 'molecular-exchange',
    energyBehavior: 'exothermic',
    temperatureRise: 40,
    explanationBangla: 'শিল্পক্ষেত্রে নাইট্রোজেন ও হাইড্রোজেন গ্যাসকে আয়রন প্রভাবকের উপস্থিতিতে ২০০ বায়ুমণ্ডলীয় চাপ ও ৪৫০-৫০০°C তাপে উত্তপ্ত করলে ক্ষারীয় অ্যামোনিয়া গ্যাস (NH₃) উৎপন্ন হয়। এটি লা শাতেলীয়ের নীতি ও শিল্প রসায়নের অত্যন্ত বিখ্যাত উভমুখী বিক্রিয়া।',
    explanationEnglish: 'Haber-Bosch industrial synthesis: nitrogen and hydrogen gases combine under high pressure and iron catalyst to yield ammonia gas, foundational for fertilizer chemistry.',
    difficulty: 'Hard',
    verified: true,
    colorChange: { from: '#06b6d4', to: '#38bdf8' },
    productDetails: [
      {
        formula: 'NH₃',
        name: 'Ammonia',
        nameBangla: 'অ্যামোনিয়া গ্যাস',
        state: 'Gas',
        colorHex: '#38bdf8',
        atoms: [
          { symbol: 'N', count: 1 },
          { symbol: 'H', count: 3 }
        ],
        properties: 'তীব্র ঝাঁঝালো গন্ধযুক্ত ক্ষারীয় গ্যাস।',
        schoolRelevance: '৯ম-১০ম শ্রেণি: হেবার-বস পদ্ধতি ও ইউরিয়া উৎপাদন।'
      }
    ],
    visualEffects: {
      gasVapor: true,
      soundEffect: 'gentle'
    }
  },
  {
    id: 'rxn_s_o2_combustion',
    reactants: ['S', 'O2'],
    products: ['SO2'],
    balancedEquation: 'S + O₂ → SO₂',
    reactionType: 'Combustion',
    conditions: {
      heatRequired: true,
      fireRequired: true,
      minTemp: 110
    },
    animationType: 'flame-glow',
    energyBehavior: 'exothermic',
    temperatureRise: 65,
    explanationBangla: 'হলুদ রঙের কঠিন গন্ধক (সালফার) বাতাসে আগুন দিলে নীল শিখা সহকারে জ্বলে এবং তীব্র শ্বাসরোধকারী ঝাঁঝালো গন্ধযুক্ত সালফার ডাই-অক্সাইড (SO₂) গ্যাস তৈরি করে। এটি একটি অধাতুর দহন ও অম্লীয় অক্সাইড গঠন বিক্রিয়া।',
    explanationEnglish: 'Sulfur burns with a characteristic blue flame in oxygen to produce choking, pungent sulfur dioxide gas, which later forms sulfurous acid in rain.',
    difficulty: 'Easy',
    verified: true,
    colorChange: { from: '#eab308', to: '#facc15' },
    productDetails: [
      {
        formula: 'SO₂',
        name: 'Sulfur Dioxide',
        nameBangla: 'সালফার ডাই-অক্সাইড',
        state: 'Gas',
        colorHex: '#facc15',
        atoms: [
          { symbol: 'S', count: 1 },
          { symbol: 'O', count: 2 }
        ],
        properties: 'দমবন্ধকারী গন্ধযুক্ত অম্লীয় গ্যাস।',
        schoolRelevance: '৯ম-১০ম শ্রেণি: এসিড বৃষ্টির উৎস গ্যাস ও দহন।'
      }
    ],
    visualEffects: {
      glowColor: '#3b82f6',
      gasVapor: true,
      soundEffect: 'pop'
    }
  },
  {
    id: 'rxn_h2o2_decomp',
    reactants: ['H2O2'],
    products: ['H2O', 'O2'],
    balancedEquation: '2H₂O₂ → 2H₂O + O₂↑',
    reactionType: 'Decomposition',
    conditions: {
      heatRequired: true,
      minTemp: 50,
      catalyst: 'MnO2'
    },
    animationType: 'bubbles',
    energyBehavior: 'exothermic',
    temperatureRise: 35,
    explanationBangla: 'হাইড্রোজেন পারক্সাইড দ্রবণ তাপ বা ম্যাঙ্গানিজ ডাই-অক্সাইড প্রভাবকের সংস্পর্শে এলে দ্রুত বিয়োজিত হয়ে প্রচুর অক্সিজেন গ্যাসের বুদবুদ এবং পানি তৈরি করে। পরীক্ষাগারে অক্সিজেন গ্যাস প্রস্তুত করার এটি একটি নিরাপদ পদ্ধতি।',
    explanationEnglish: 'Catalytic decomposition of hydrogen peroxide rapidly yields water and oxygen gas effervescence. Safe school laboratory route to oxygen generation.',
    difficulty: 'Medium',
    verified: true,
    colorChange: { from: '#67e8f9', to: '#38bdf8' },
    productDetails: [
      {
        formula: 'H₂O',
        name: 'Water',
        nameBangla: 'পানি',
        state: 'Liquid',
        colorHex: '#38bdf8',
        atoms: [
          { symbol: 'H', count: 2 },
          { symbol: 'O', count: 1 }
        ],
        properties: 'নিরপেক্ষ তরল।',
        schoolRelevance: 'উপজাত'
      },
      {
        formula: 'O₂',
        name: 'Oxygen Gas',
        nameBangla: 'অক্সিজেন গ্যাস',
        state: 'Gas',
        colorHex: '#0284c7',
        atoms: [
          { symbol: 'O', count: 2 }
        ],
        properties: 'দহন সহায়ক বর্ণহীন গ্যাস; নিভু নিভু কাঠিকে প্রজ্জ্বলিত করে।',
        schoolRelevance: 'অক্সিজেনের উপস্থিতি পরীক্ষা।'
      }
    ],
    visualEffects: {
      bubbles: true,
      gasVapor: true,
      soundEffect: 'fizz'
    }
  },
  {
    id: 'rxn_k_cl2',
    reactants: ['K', 'Cl'],
    products: ['KCl'],
    balancedEquation: '2K + Cl₂ → 2KCl',
    reactionType: 'Combination',
    conditions: {
      heatRequired: true,
      minTemp: 60
    },
    animationType: 'flame-glow',
    energyBehavior: 'exothermic',
    temperatureRise: 80,
    explanationBangla: 'সক্রিয় ক্ষার ধাতু পটাশিয়াম সবুজ ক্লোরিন গ্যাসের সাথে তীব্র আলো ও বেগুনি শিখাসহ বিস্ফোরকভাবে যুক্ত হয়ে সাদা পটাশিয়াম ক্লোরাইড (KCl) লবণ গঠন করে। এখানে ইলেকট্রন স্থানান্তরের মাধ্যমে শক্তিশালী আয়নিক বন্ধন গঠিত হয়।',
    explanationEnglish: 'Vigorous synthesis between active alkali metal potassium and chlorine halogen gas produces ionic potassium chloride salt with characteristic lilac glow.',
    difficulty: 'Medium',
    verified: true,
    colorChange: { from: '#f43f5e', to: '#f8fafc' },
    productDetails: [
      {
        formula: 'KCl',
        name: 'Potassium Chloride',
        nameBangla: 'পটাশিয়াম ক্লোরাইড',
        state: 'Solid',
        colorHex: '#f8fafc',
        atoms: [
          { symbol: 'K', count: 1 },
          { symbol: 'Cl', count: 1 }
        ],
        properties: 'সাদা আয়নিক স্ফটিক লবণ।',
        schoolRelevance: '৯ম-১০ম শ্রেণি: আয়নিক বন্ধন ও সার উপাদান।'
      }
    ],
    visualEffects: {
      glowColor: '#a855f7',
      soundEffect: 'pop'
    }
  },
  {
    id: 'rxn_zn_h2so4',
    reactants: ['Zn', 'H2SO4'],
    products: ['ZnSO4', 'H2'],
    balancedEquation: 'Zn + H₂SO₄ → ZnSO₄ + H₂↑',
    reactionType: 'Single Displacement',
    conditions: {},
    animationType: 'bubbles',
    energyBehavior: 'exothermic',
    temperatureRise: 32,
    explanationBangla: 'জিঙ্ক দানার উপর লঘু সালফিউরিক অ্যাসিড ঢাললে দ্রুত হাইড্রোজেন গ্যাস নির্গত হতে থাকে এবং জিঙ্ক সালফেট লবণ তৈরি হয়। স্কুল ল্যাবরেটরিতে কিপস যন্ত্রে বা টেস্টটিউবে হাইড্রোজেন গ্যাস তৈরির মূল বিক্রিয়া এটি।',
    explanationEnglish: 'Zinc granules react with dilute sulfuric acid to displace hydrogen gas with vigorous effervescence, producing aqueous zinc sulfate.',
    difficulty: 'Easy',
    verified: true,
    colorChange: { from: '#94a3b8', to: '#60a5fa' },
    productDetails: [
      {
        formula: 'ZnSO₄',
        name: 'Zinc Sulfate',
        nameBangla: 'জিঙ্ক সালফেট',
        state: 'Solid',
        colorHex: '#cbd5e1',
        atoms: [
          { symbol: 'Zn', count: 1 },
          { symbol: 'S', count: 1 },
          { symbol: 'O', count: 4 }
        ],
        properties: 'বর্ণহীন লবণ দ্রবণ (সাদা ভিট্রিওল)।',
        schoolRelevance: '৯ম-১০ম শ্রেণি: পরীক্ষাগারে H₂ প্রস্তুতি।'
      },
      {
        formula: 'H₂',
        name: 'Hydrogen Gas',
        nameBangla: 'হাইড্রোজেন গ্যাস',
        state: 'Gas',
        colorHex: '#38bdf8',
        atoms: [
          { symbol: 'H', count: 2 }
        ],
        properties: 'দাহ্য গ্যাস যা বাতাসে পপ শব্দে জ্বলে।',
        schoolRelevance: 'সবচেয়ে হালকা গ্যাস।'
      }
    ],
    visualEffects: {
      bubbles: true,
      gasVapor: true,
      soundEffect: 'fizz'
    }
  }
];

// Helper to normalize formula identifiers
function normalizeKey(str: string): string {
  return str
    .replace(/[₂₃₄₅₆₇₈₉]/g, (match) => {
      const map: Record<string, string> = {
        '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9'
      };
      return map[match] || match;
    })
    .trim()
    .toLowerCase();
}

/**
 * Searches the verified reaction database for a match given selected substances,
 * heating status, and fire status.
 */
export function findVerifiedReaction(
  selectedIds: string[],
  isHeated: boolean,
  isFired: boolean,
  temperature: number = 25
): {
  reaction: ChemicalReaction | null;
  needsHeat: boolean;
  needsFire: boolean;
  reasonBangla?: string;
  reasonEnglish?: string;
} {
  if (selectedIds.length === 0) {
    return { reaction: null, needsHeat: false, needsFire: false };
  }

  const selectedNorm = selectedIds.map(normalizeKey).sort();

  for (const rxn of VERIFIED_REACTIONS) {
    const rxnNorm = rxn.reactants.map(normalizeKey).sort();

    // Check if the reactants match exactly
    const isSameSubstances =
      selectedNorm.length === rxnNorm.length &&
      selectedNorm.every((val, idx) => val === rxnNorm[idx]);

    if (isSameSubstances) {
      const cond = rxn.conditions;
      const heatSatisfied = !cond.heatRequired || isHeated || temperature >= (cond.minTemp || 60);
      const fireSatisfied = !cond.fireRequired || isFired;

      if (!heatSatisfied && !fireSatisfied) {
        return {
          reaction: null,
          needsHeat: !!cond.heatRequired,
          needsFire: !!cond.fireRequired,
          reasonBangla: 'এই বিক্রিয়াটি শুরু করতে তাপ (HEAT) অথবা অগ্নিশিখা (FIRE) প্রয়োগ করতে হবে।',
          reasonEnglish: 'This reaction requires simulated thermal heat or ignition flame to overcome activation energy.'
        };
      }

      if (cond.fireRequired && !isFired) {
        return {
          reaction: null,
          needsHeat: false,
          needsFire: true,
          reasonBangla: 'এই দহন বিক্রিয়া শুরু করতে অগ্নিশিখা (FIRE) প্রয়োগ করুন।',
          reasonEnglish: 'Ignition flame (FIRE) is required to trigger this combustion reaction.'
        };
      }

      if (cond.heatRequired && !heatSatisfied) {
        return {
          reaction: null,
          needsHeat: true,
          needsFire: false,
          reasonBangla: 'বিক্রিয়া ঘটানোর জন্য তাপমাত্রা বৃদ্ধি করুন (HEAT প্রয়োগ করুন)।',
          reasonEnglish: 'Increase the virtual temperature (HEAT) to reach activation energy.'
        };
      }

      return {
        reaction: rxn,
        needsHeat: false,
        needsFire: false
      };
    }
  }

  return {
    reaction: null,
    needsHeat: false,
    needsFire: false,
    reasonBangla: 'এই পদার্থগুলোর সংমিশ্রণের জন্য কোনো ভেরিফাইড বিক্রিয়া পাওয়া যায়নি।',
    reasonEnglish: 'No supported reaction is available for this combination in the verified database.'
  };
}
