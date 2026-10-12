/**
 * CHEM-X Atomic & Orbital Physics Engine for Class 9 Secondary School Chemistry
 * Implements:
 * - Aufbau Principle (n + l energy ordering)
 * - Pauli Exclusion Principle (opposite spins up/down)
 * - Hund's Rule (singly occupied degenerate orbitals first with parallel spin)
 * - Ground-state anomalies (Cr: 3d5 4s1, Cu: 3d10 4s1)
 * - Shell (K, L, M, N), Subshell (s, p, d, f) and Orbital (px, py, pz, etc.) models
 */

export interface OrbitalBox {
  id: string;
  name: string; // e.g. "px", "py", "pz"
  electrons: ('up' | 'down')[]; // ['up'] or ['up', 'down']
  capacity: 2;
}

export interface SubshellConfig {
  label: string; // e.g. "1s", "2p", "3d"
  n: number;
  l: number; // 0 for s, 1 for p, 2 for d, 3 for f
  type: 's' | 'p' | 'd' | 'f';
  energyRank: number; // (n + l)
  maxElectrons: number;
  electrons: number;
  orbitalBoxes: OrbitalBox[];
}

export interface FullAtomDetails {
  atomicNumber: number;
  symbol: string;
  name: string;
  nameBangla: string;
  protons: number;
  neutrons: number;
  massNumber: number;
  shells: number[]; // K, L, M, N, O, P, Q
  subshells: SubshellConfig[];
  condensedConfig: string; // e.g. "1s² 2s² 2p⁶ 3s¹"
  nobleGasConfig: string; // e.g. "[Ne] 3s¹"
  valenceElectrons: number;
  valenceShellNumber: number;
  valency: number[];
  likelyIon: string; // e.g. "Na⁺", "O²⁻"
  ionType: 'Cation' | 'Anion' | 'Inert / Neutral' | 'Covalent Multi-valency';
  ionReasonBangla: string;
  ionReasonEnglish: string;
}

// Standard Aufbau sequence of subshells (n + l rule)
const AUFBAU_SEQUENCE: { label: string; n: number; l: number; type: 's' | 'p' | 'd' | 'f'; capacity: number }[] = [
  { label: '1s', n: 1, l: 0, type: 's', capacity: 2 },
  { label: '2s', n: 2, l: 0, type: 's', capacity: 2 },
  { label: '2p', n: 2, l: 1, type: 'p', capacity: 6 },
  { label: '3s', n: 3, l: 0, type: 's', capacity: 2 },
  { label: '3p', n: 3, l: 1, type: 'p', capacity: 6 },
  { label: '4s', n: 4, l: 0, type: 's', capacity: 2 },
  { label: '3d', n: 3, l: 2, type: 'd', capacity: 10 },
  { label: '4p', n: 4, l: 1, type: 'p', capacity: 6 },
  { label: '5s', n: 5, l: 0, type: 's', capacity: 2 },
  { label: '4d', n: 4, l: 2, type: 'd', capacity: 10 },
  { label: '5p', n: 5, l: 1, type: 'p', capacity: 6 },
  { label: '6s', n: 6, l: 0, type: 's', capacity: 2 },
  { label: '4f', n: 4, l: 3, type: 'f', capacity: 14 },
  { label: '5d', n: 5, l: 2, type: 'd', capacity: 10 },
  { label: '6p', n: 6, l: 1, type: 'p', capacity: 6 },
  { label: '7s', n: 7, l: 0, type: 's', capacity: 2 },
  { label: '5f', n: 5, l: 3, type: 'f', capacity: 14 },
  { label: '6d', n: 6, l: 2, type: 'd', capacity: 10 },
  { label: '7p', n: 7, l: 1, type: 'p', capacity: 6 }
];

const ORBITAL_NAMES: Record<'s' | 'p' | 'd' | 'f', string[]> = {
  s: ['s'],
  p: ['px', 'py', 'pz'],
  d: ['dxy', 'dyz', 'dzx', 'dx²-y²', 'dz²'],
  f: ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7']
};

const SUPERSCRIPT_MAP: Record<string, string> = {
  '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
  '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹'
};

export function toSuperscript(num: number): string {
  return num
    .toString()
    .split('')
    .map((digit) => SUPERSCRIPT_MAP[digit] || digit)
    .join('');
}

/**
 * Calculates subshells and orbital boxes obeying Aufbau, Hund's Rule, and Pauli Exclusion
 */
export function calculateElectronConfig(atomicNumber: number): SubshellConfig[] {
  let remaining = atomicNumber;
  const subshells: SubshellConfig[] = [];

  // Initial Aufbau distribution
  const counts: Record<string, number> = {};
  for (const item of AUFBAU_SEQUENCE) {
    if (remaining <= 0) break;
    const taken = Math.min(remaining, item.capacity);
    counts[item.label] = taken;
    remaining -= taken;
  }

  // Handle Ground-State Class 9 Exceptions (Half-filled & full-filled stability):
  // 1. Chromium (Z=24): [Ar] 4s1 3d5 instead of 4s2 3d4
  if (atomicNumber === 24) {
    counts['4s'] = 1;
    counts['3d'] = 5;
  }
  // 2. Copper (Z=29): [Ar] 4s1 3d10 instead of 4s2 3d9
  if (atomicNumber === 29) {
    counts['4s'] = 1;
    counts['3d'] = 10;
  }
  // 3. Molybdenum (Z=42): 5s1 4d5
  if (atomicNumber === 42) {
    counts['5s'] = 1;
    counts['4d'] = 5;
  }
  // 4. Silver (Z=47): 5s1 4d10
  if (atomicNumber === 47) {
    counts['5s'] = 1;
    counts['4d'] = 10;
  }
  // 5. Gold (Z=79): 6s1 5d10
  if (atomicNumber === 79) {
    counts['6s'] = 1;
    counts['5d'] = 10;
  }

  for (const item of AUFBAU_SEQUENCE) {
    const electronCount = counts[item.label] || 0;
    if (electronCount === 0) continue;

    // Apply Hund's Rule to populate orbital boxes:
    // Degenerate orbitals receive one electron with parallel spin (up) before pairing up (down)
    const boxCount = item.capacity / 2;
    const orbitalBoxes: OrbitalBox[] = [];

    for (let b = 0; b < boxCount; b++) {
      const boxName = ORBITAL_NAMES[item.type][b] || `${item.type}${b + 1}`;
      orbitalBoxes.push({
        id: `${item.label}_${b}`,
        name: boxName,
        electrons: [],
        capacity: 2
      });
    }

    // Step 1: Place single 'up' electron in each box (Hund's Rule)
    let placed = 0;
    for (let b = 0; b < boxCount && placed < electronCount; b++) {
      orbitalBoxes[b].electrons.push('up');
      placed++;
    }

    // Step 2: Pair up with 'down' electron (Pauli Exclusion Principle)
    for (let b = 0; b < boxCount && placed < electronCount; b++) {
      orbitalBoxes[b].electrons.push('down');
      placed++;
    }

    subshells.push({
      label: item.label,
      n: item.n,
      l: item.l,
      type: item.type,
      energyRank: item.n + item.l,
      maxElectrons: item.capacity,
      electrons: electronCount,
      orbitalBoxes
    });
  }

  return subshells;
}

/**
 * Calculates Bohr shell distribution (K, L, M, N, O, P, Q) from subshell configuration
 */
export function calculateShellsFromSubshells(subshells: SubshellConfig[]): number[] {
  const shells: Record<number, number> = {};
  let maxN = 1;

  for (const sub of subshells) {
    shells[sub.n] = (shells[sub.n] || 0) + sub.electrons;
    if (sub.n > maxN) maxN = sub.n;
  }

  const result: number[] = [];
  for (let n = 1; n <= maxN; n++) {
    result.push(shells[n] || 0);
  }
  return result;
}

/**
 * Generates formatted condensed configuration like "1s² 2s² 2p⁶ 3s¹"
 */
export function formatCondensedConfig(subshells: SubshellConfig[]): string {
  return subshells.map((s) => `${s.label}${toSuperscript(s.electrons)}`).join(' ');
}

/**
 * Generates noble gas core configuration like "[Ne] 3s¹"
 */
export function formatNobleGasConfig(atomicNumber: number, subshells: SubshellConfig[]): string {
  const nobleGases = [
    { z: 118, symbol: 'Og' },
    { z: 86, symbol: 'Rn' },
    { z: 54, symbol: 'Xe' },
    { z: 36, symbol: 'Kr' },
    { z: 18, symbol: 'Ar' },
    { z: 10, symbol: 'Ne' },
    { z: 2, symbol: 'He' }
  ];

  const core = nobleGases.find((ng) => ng.z < atomicNumber);
  if (!core) {
    return formatCondensedConfig(subshells);
  }

  // Count electrons beyond the core
  let coreElectronsLeft = core.z;
  const valenceSubshells: SubshellConfig[] = [];

  for (const sub of subshells) {
    if (coreElectronsLeft >= sub.electrons) {
      coreElectronsLeft -= sub.electrons;
    } else {
      const remainingElectrons = sub.electrons - coreElectronsLeft;
      valenceSubshells.push({
        ...sub,
        electrons: remainingElectrons
      });
      coreElectronsLeft = 0;
    }
  }

  const remainder = valenceSubshells.map((s) => `${s.label}${toSuperscript(s.electrons)}`).join(' ');
  return `[${core.symbol}] ${remainder}`;
}

/**
 * Class 9 Ion & Valency Logic Generator
 */
export function determineIonAndValency(
  atomicNumber: number,
  shells: number[],
  valenceElectrons: number
): {
  valency: number[];
  likelyIon: string;
  ionType: 'Cation' | 'Anion' | 'Inert / Neutral' | 'Covalent Multi-valency';
  reasonBangla: string;
  reasonEnglish: string;
} {
  // Noble Gases (inert)
  if ([2, 10, 18, 36, 54, 86, 118].includes(atomicNumber)) {
    return {
      valency: [0],
      likelyIon: 'None (Stable)',
      ionType: 'Inert / Neutral',
      reasonBangla: 'সর্ববহিঃস্থ শক্তিস্তর ইলেকট্রন দ্বারা পূর্ণ (অষ্টক বা হিলিয়ামের ক্ষেত্রে দ্বৈত পূর্ণ)। তাই কোনো ইলেকট্রন ত্যাগ বা গ্রহণ করে না।',
      reasonEnglish: 'Outermost valence shell is completely full (octet/duplet); extremely stable and non-reactive.'
    };
  }

  // Hydrogen
  if (atomicNumber === 1) {
    return {
      valency: [1],
      likelyIon: 'H⁺ / H⁻',
      ionType: 'Cation',
      reasonBangla: 'হাইড্রোজেন ১টি ইলেকট্রন ত্যাগ করে H⁺ ক্যাটায়ন বা ধাতুর সাথে ১টি ইলেকট্রন গ্রহণ করে H⁻ হাইড্রাইড গঠন করতে পারে।',
      reasonEnglish: 'Can lose 1 electron to form H⁺ or gain 1 with electropositive metals to form H⁻ hydride.'
    };
  }

  // Metals (1, 2, 3 valence electrons) -> Cations
  if (valenceElectrons <= 3 && atomicNumber > 2) {
    const charge = valenceElectrons;
    const sign = charge === 1 ? '⁺' : `${charge}⁺`;
    return {
      valency: [charge],
      likelyIon: `Metal${sign}`,
      ionType: 'Cation',
      reasonBangla: `ধাতুটির বহিঃস্থ স্তরে ${valenceElectrons}টি ইলেকট্রন রয়েছে। নিকটবর্তী নিষ্ক্রিয় গ্যাসের স্থিতিশীল অষ্টক লাভ করতে এটি ${valenceElectrons}টি ইলেকট্রন ত্যাগ করে ধনাত্মক ক্যাটায়ন গঠন করে।`,
      reasonEnglish: `Has ${valenceElectrons} valence electron(s). Readily loses them to achieve the nearest stable noble gas configuration (forming a cation).`
    };
  }

  // Nonmetals (5, 6, 7 valence electrons) -> Anions
  if (valenceElectrons >= 5 && valenceElectrons <= 7) {
    const needed = 8 - valenceElectrons;
    const sign = needed === 1 ? '⁻' : `${needed}⁻`;
    return {
      valency: [needed],
      likelyIon: `Nonmetal${sign}`,
      ionType: 'Anion',
      reasonBangla: `অধাতুটির বহিঃস্থ স্তরে ${valenceElectrons}টি ইলেকট্রন রয়েছে। অষ্টক পূর্ণ করতে ${needed}টি ইলেকট্রন গ্রহণ করে ঋণাত্মক অ্যানায়ন গঠন করে।`,
      reasonEnglish: `Has ${valenceElectrons} valence electrons. Readily gains ${needed} electron(s) to fulfill the octet rule (forming an anion).`
    };
  }

  // Group 14 (4 valence electrons, e.g. Carbon, Silicon)
  if (valenceElectrons === 4) {
    return {
      valency: [4],
      likelyIon: 'Covalent (Share 4e⁻)',
      ionType: 'Covalent Multi-valency',
      reasonBangla: 'বহিঃস্থ স্তরে ৪টি ইলেকট্রন থাকায় ৪টি ইলেকট্রন ত্যাগ বা গ্রহণ করা অত্যন্ত শক্তিসাপেক্ষ। তাই এরা সাধারণত সমযোজী বন্ধনে ইলেকট্রন শেয়ার করে।',
      reasonEnglish: 'Losing or gaining 4 electrons requires prohibitive ionization energy; readily forms 4 covalent bonds.'
    };
  }

  return {
    valency: [1],
    likelyIon: 'Varies',
    ionType: 'Covalent Multi-valency',
    reasonBangla: 'পরিবর্তনশীল যোজ্যতা ও বিভিন্ন জারণ অবস্থা প্রদর্শন করতে সক্ষম।',
    reasonEnglish: 'Displays variable valency and multiple oxidation states.'
  };
}

/**
 * Standard Curated Isotopes for Class 9 Syllabus
 */
export const CURRICULUM_ISOTOPES: Record<number, { mass: number; symbol: string; neutrons: number; abundance?: string; notesBangla: string; notesEnglish: string; stable: boolean }[]> = {
  1: [
    { mass: 1, symbol: '¹H', neutrons: 0, abundance: '99.98%', notesBangla: 'প্রোটিয়ম: সাধারণ হাইড্রোজেন, যাতে কোনো নিউট্রন নেই।', notesEnglish: 'Protium: Ordinary hydrogen without neutrons.', stable: true },
    { mass: 2, symbol: '²H (D)', neutrons: 1, abundance: '0.015%', notesBangla: 'ডিউটেরিয়াম: ভারী হাইড্রোজেন, ভারী পানি (D₂O) তৈরিতে ব্যবহৃত।', notesEnglish: 'Deuterium: Heavy hydrogen used in heavy water (D₂O).', stable: true },
    { mass: 3, symbol: '³H (T)', neutrons: 2, abundance: 'Trace', notesBangla: 'ট্রিটিয়াম: তেজস্ক্রিয় হাইড্রোজেন আইসোটোপ। অর্ধায়ু ১২.৩ বছর।', notesEnglish: 'Tritium: Radioactive isotope with half-life of 12.3 years.', stable: false }
  ],
  6: [
    { mass: 12, symbol: '¹²C', neutrons: 6, abundance: '98.9%', notesBangla: 'কার্বন-১২: পারমাণবিক ভরের আন্তর্জাতিক আদর্শ মান (Standard C-12 স্কেল)।', notesEnglish: 'Carbon-12: Universal reference standard for atomic mass units.', stable: true },
    { mass: 13, symbol: '¹³C', neutrons: 7, abundance: '1.1%', notesBangla: 'কার্বন-১৩: এনএমআর (NMR) বর্ণালীবীক্ষণে ব্যবহৃত।', notesEnglish: 'Carbon-13: Stable isotope used in NMR spectroscopy.', stable: true },
    { mass: 14, symbol: '¹⁴C', neutrons: 8, abundance: 'Trace', notesBangla: 'কার্বন-১৪: তেজস্ক্রিয় আইসোটোপ, প্রাচীন জীবাশ্মের বয়স নির্ধারণে (Carbon Dating) ব্যবহৃত। অর্ধায়ু ৫৭৩০ বছর।', notesEnglish: 'Carbon-14: Used in radiocarbon dating of fossils (half-life 5,730 years).', stable: false }
  ],
  17: [
    { mass: 35, symbol: '³⁵Cl', neutrons: 18, abundance: '75.77%', notesBangla: 'ক্লোরিন-৩৫: প্রকৃতিতে প্রায় ৭৫% উপস্থিত।', notesEnglish: 'Chlorine-35: ~75% natural abundance.', stable: true },
    { mass: 37, symbol: '³⁷Cl', neutrons: 20, abundance: '24.23%', notesBangla: 'ক্লোরিন-৩৭: প্রকৃতিতে প্রায় ২৫% উপস্থিত। এদের গড়ের কারণে ক্লোরিনের ভর ৩৫.৫ u।', notesEnglish: 'Chlorine-37: Accounts for average fractional atomic mass of 35.5 u.', stable: true }
  ],
  27: [
    { mass: 59, symbol: '⁵⁹Co', neutrons: 32, abundance: '100%', notesBangla: 'কোবাল্ট-৫৯: সাধারণ স্থিতিশীল কোবাল্ট।', notesEnglish: 'Cobalt-59: Stable natural cobalt.', stable: true },
    { mass: 60, symbol: '⁶⁰Co', neutrons: 33, abundance: 'Synthetic', notesBangla: 'কোবাল্ট-৬০: তেজস্ক্রিয় আইসোটোপ, গামা রশ্মি নির্গমন করে ক্যান্সারের টিউমার চিকিৎসায় ব্যবহৃত হয়।', notesEnglish: 'Cobalt-60: Emits gamma rays for targeted radiotherapy in oncology.', stable: false }
  ],
  53: [
    { mass: 127, symbol: '¹²⁷I', neutrons: 74, abundance: '100%', notesBangla: 'আয়োডিন-১২৭: থাইরয়েড গ্রন্থির হরমোন তৈরিতে অত্যাবশ্যক।', notesEnglish: 'Iodine-127: Stable dietary iodine.', stable: true },
    { mass: 131, symbol: '¹³¹I', neutrons: 78, abundance: 'Synthetic', notesBangla: 'আয়োডিন-১৩১: তেজস্ক্রিয় আইসোটোপ, থাইরয়েড ক্যান্সার ও গলগণ্ড রোগ নিরাময়ে ব্যবহৃত হয়।', notesEnglish: 'Iodine-131: Radiopharmaceutical for thyroid disorders.', stable: false }
  ],
  92: [
    { mass: 235, symbol: '²³⁵U', neutrons: 143, abundance: '0.72%', notesBangla: 'ইউরেনিয়াম-২৩৫: পারমাণবিক বিদ্যুৎ কেন্দ্র ও পরমাণু চুল্লির প্রধান জ্বালানি (নিউক্লিয়ার ফিশন)।', notesEnglish: 'Uranium-235: Fissile nuclear reactor fuel.', stable: false },
    { mass: 238, symbol: '²³⁸U', neutrons: 146, abundance: '99.27%', notesBangla: 'ইউরেনিয়াম-২৩৮: প্রকৃতিতে প্রাপ্ত প্রধান ইউরেনিয়াম আইসোটোপ। অর্ধায়ু ৪.৫ বিলিয়ন বছর।', notesEnglish: 'Uranium-238: Most abundant fertile nuclear isotope.', stable: false }
  ]
};
