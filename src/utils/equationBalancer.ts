export interface ElementCount {
  [element: string]: number;
}

export interface BalancedStep {
  stepNumber: number;
  titleBangla: string;
  titleEnglish: string;
  descriptionBangla: string;
  descriptionEnglish: string;
  currentEquation: string;
  reactantCounts: ElementCount;
  productCounts: ElementCount;
}

export interface BalanceResult {
  success: boolean;
  balancedEquation: string;
  coefficients: {
    reactants: number[];
    products: number[];
  };
  steps: BalancedStep[];
  errorMessageBangla?: string;
  errorMessageEnglish?: string;
}

// Preset popular educational equations for Class 9-10
export const PRESET_EQUATIONS = [
  { raw: 'H2 + O2 -> H2O', label: 'H₂ + O₂ → H₂O (পানি সংশ্লেষণ)' },
  { raw: 'HCl + NaOH -> NaCl + H2O', label: 'HCl + NaOH → NaCl + H₂O (প্রশমন)' },
  { raw: 'CaCO3 -> CaO + CO2', label: 'CaCO₃ → CaO + CO₂ (তাপীয় বিযোজন)' },
  { raw: 'Zn + HCl -> ZnCl2 + H2', label: 'Zn + HCl → ZnCl₂ + H₂ (প্রতিস্থাপন)' },
  { raw: 'Fe + CuSO4 -> FeSO4 + Cu', label: 'Fe + CuSO₄ → FeSO₄ + Cu (রেডক্স প্রতিস্থাপন)' },
  { raw: 'Mg + O2 -> MgO', label: 'Mg + O₂ → MgO (ম্যাগনেসিয়াম দহন)' },
  { raw: 'CH4 + O2 -> CO2 + H2O', label: 'CH₄ + O₂ → CO₂ + H₂O (মিথেন দহন)' },
  { raw: 'N2 + H2 -> NH3', label: 'N₂ + H₂ → NH₃ (অ্যামোনিয়া সংশ্লেষণ)' },
  { raw: 'H2O2 -> H2O + O2', label: 'H₂O₂ → H₂O + O₂ (পারক্সাইড বিযোজন)' },
  { raw: 'Al + O2 -> Al2O3', label: 'Al + O₂ → Al₂O₃ (অ্যালুমিনিয়াম অক্সাইড)' }
];

/**
 * Parses a chemical formula string like "CaCO3" or "Cu(OH)2" into an element count.
 */
export function parseFormula(formula: string): ElementCount {
  const result: ElementCount = {};
  const cleaned = formula.trim().replace(/[₀-₉]/g, (m) => (m.charCodeAt(0) - 8320).toString());

  // Handle simple groups with parentheses like (OH)2 or (NO3)2
  const parenRegex = /\(([^)]+)\)(\d+)/g;
  let expanded = cleaned;
  let match: RegExpExecArray | null;

  while ((match = parenRegex.exec(cleaned)) !== null) {
    const inside = match[1];
    const multiplier = parseInt(match[2], 10);
    let repeated = '';
    const insideCounts = parseSimpleFormula(inside);
    for (const [elem, count] of Object.entries(insideCounts)) {
      repeated += `${elem}${count * multiplier}`;
    }
    expanded = expanded.replace(match[0], repeated);
  }

  return parseSimpleFormula(expanded);
}

function parseSimpleFormula(str: string): ElementCount {
  const result: ElementCount = {};
  const regex = /([A-Z][a-z]*)(\d*)/g;
  let match: RegExpExecArray | null;
  let foundAny = false;

  while ((match = regex.exec(str)) !== null) {
    foundAny = true;
    const elem = match[1];
    const count = match[2] ? parseInt(match[2], 10) : 1;
    result[elem] = (result[elem] || 0) + count;
  }

  if (!foundAny && str.length > 0) {
    throw new Error(`Invalid chemical symbol in "${str}"`);
  }

  return result;
}

/**
 * Formats formula with proper subscript unicode for UI display.
 */
export function formatFormulaUnicode(formula: string): string {
  const subscriptMap: Record<string, string> = {
    '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
    '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉'
  };
  return formula.replace(/\d+/g, (digits) =>
    digits.split('').map((d) => subscriptMap[d] || d).join('')
  );
}

/**
 * Educational Chemical Equation Balancer with step-by-step deduction.
 */
export function balanceEquation(equationStr: string): BalanceResult {
  const parts = equationStr.split(/->|→|=/).map((s) => s.trim());
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    return {
      success: false,
      balancedEquation: '',
      coefficients: { reactants: [], products: [] },
      steps: [],
      errorMessageBangla: 'অনুগ্রহ করে "Reactants -> Products" ফরম্যাটে সমীকরণ লিখুন (যেমন: H2 + O2 -> H2O)।',
      errorMessageEnglish: 'Please format as "Reactants -> Products" (e.g. H2 + O2 -> H2O).'
    };
  }

  const rawReactants = parts[0].split('+').map((s) => s.trim()).filter(Boolean);
  const rawProducts = parts[1].split('+').map((s) => s.trim()).filter(Boolean);

  if (rawReactants.length === 0 || rawProducts.length === 0) {
    return {
      success: false,
      balancedEquation: '',
      coefficients: { reactants: [], products: [] },
      steps: [],
      errorMessageBangla: 'বিক্রিয়ক বা উৎপাদ খালি রাখা যাবে না।',
      errorMessageEnglish: 'Reactants or products cannot be empty.'
    };
  }

  let reactantCountsList: ElementCount[] = [];
  let productCountsList: ElementCount[] = [];

  try {
    reactantCountsList = rawReactants.map(parseFormula);
    productCountsList = rawProducts.map(parseFormula);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      balancedEquation: '',
      coefficients: { reactants: [], products: [] },
      steps: [],
      errorMessageBangla: `অবৈধ রাসায়নিক সংকেত সনাক্ত হয়েছে: ${errorMsg}`,
      errorMessageEnglish: `Invalid chemical formula detected: ${errorMsg}`
    };
  }

  // Get all unique elements present
  const allElements = new Set<string>();
  reactantCountsList.forEach((c) => Object.keys(c).forEach((e) => allElements.add(e)));
  const productElements = new Set<string>();
  productCountsList.forEach((c) => Object.keys(c).forEach((e) => productElements.add(e)));

  // Validate conservation of elemental identities
  for (const elem of allElements) {
    if (!productElements.has(elem)) {
      return {
        success: false,
        balancedEquation: '',
        coefficients: { reactants: [], products: [] },
        steps: [],
        errorMessageBangla: `মৌল "${elem}" বিক্রিয়কে থাকলেও উৎপাদে বিদ্যমান নেই। এটি ভরের নিত্যতা বিরোধী।`,
        errorMessageEnglish: `Element "${elem}" is present in reactants but missing in products.`
      };
    }
  }
  for (const elem of productElements) {
    if (!allElements.has(elem)) {
      return {
        success: false,
        balancedEquation: '',
        coefficients: { reactants: [], products: [] },
        steps: [],
        errorMessageBangla: `মৌল "${elem}" উৎপাদে থাকলেও বিক্রিয়কে নেই। পরমাণু শূন্য থেকে তৈরি হতে পারে না।`,
        errorMessageEnglish: `Element "${elem}" appears in products without reactant source.`
      };
    }
  }

  // Solve coefficients using bounded systematic search (up to 12)
  const numR = rawReactants.length;
  const numP = rawProducts.length;
  const maxCoeff = 12;

  let bestCoeffs: { r: number[]; p: number[] } | null = null;

  // Optimized search for small equations (common in Class 9-10)
  function solve(index: number, currentCoeffs: number[]): boolean {
    if (index === numR + numP) {
      const rCoeffs = currentCoeffs.slice(0, numR);
      const pCoeffs = currentCoeffs.slice(numR);

      // Check balance for all elements
      for (const elem of allElements) {
        let leftTotal = 0;
        let rightTotal = 0;
        for (let i = 0; i < numR; i++) {
          leftTotal += (reactantCountsList[i][elem] || 0) * rCoeffs[i];
        }
        for (let j = 0; j < numP; j++) {
          rightTotal += (productCountsList[j][elem] || 0) * pCoeffs[j];
        }
        if (leftTotal !== rightTotal) return false;
      }

      bestCoeffs = { r: rCoeffs, p: pCoeffs };
      return true;
    }

    for (let c = 1; c <= maxCoeff; c++) {
      currentCoeffs[index] = c;
      if (solve(index + 1, currentCoeffs)) return true;
    }
    return false;
  }

  const initialCoeffs = new Array(numR + numP).fill(1);
  const found = solve(0, initialCoeffs);

  if (!found || !bestCoeffs) {
    return {
      success: false,
      balancedEquation: '',
      coefficients: { reactants: [], products: [] },
      steps: [],
      errorMessageBangla: 'এই সমীকরণের জন্য কোনো স্বাভাবিক পূর্ণসংখ্যা সহগ পাওয়া যায়নি।',
      errorMessageEnglish: 'Could not find integer coefficients for this equation.'
    };
  }

  const { r: rCoeffs, p: pCoeffs } = bestCoeffs as { r: number[]; p: number[] };

  // Calculate atom counts for initial and final
  function getCounts(coeffsR: number[], coeffsP: number[]) {
    const left: ElementCount = {};
    const right: ElementCount = {};
    for (const elem of allElements) {
      left[elem] = 0;
      right[elem] = 0;
      for (let i = 0; i < numR; i++) left[elem] += (reactantCountsList[i][elem] || 0) * coeffsR[i];
      for (let j = 0; j < numP; j++) right[elem] += (productCountsList[j][elem] || 0) * coeffsP[j];
    }
    return { left, right };
  }

  const initialCounts = getCounts(new Array(numR).fill(1), new Array(numP).fill(1));
  const finalCounts = getCounts(rCoeffs, pCoeffs);

  function formatEquationWithCoeffs(cr: number[], cp: number[]): string {
    const rStr = rawReactants
      .map((r, i) => `${cr[i] > 1 ? cr[i] : ''}${formatFormulaUnicode(r)}`)
      .join(' + ');
    const pStr = rawProducts
      .map((p, j) => `${cp[j] > 1 ? cp[j] : ''}${formatFormulaUnicode(p)}`)
      .join(' + ');
    return `${rStr} → ${pStr}`;
  }

  // Generate step-by-step breakdown
  const steps: BalancedStep[] = [];

  // Step 1: Count initial atoms
  steps.push({
    stepNumber: 1,
    titleBangla: 'পরমাণু গণনা (Initial Atom Inventory)',
    titleEnglish: 'Count Initial Atoms on Both Sides',
    descriptionBangla: 'বিক্রিয়ক (বাম পাশ) এবং উৎপাদ (ডান পাশ) এ প্রতিটি মৌলিক পরমাণুর সংখ্যা গণনা করে অসমতা চিহ্নিত করি।',
    descriptionEnglish: 'Count the number of each type of atom in the initial unbalanced equation.',
    currentEquation: formatEquationWithCoeffs(new Array(numR).fill(1), new Array(numP).fill(1)),
    reactantCounts: initialCounts.left,
    productCounts: initialCounts.right
  });

  // Step 2: Adjust stoichiometric coefficients
  const unbalancedList = Array.from(allElements).filter(
    (e) => initialCounts.left[e] !== initialCounts.right[e]
  );

  const unbalancedStr = unbalancedList.length > 0 ? unbalancedList.join(', ') : 'সব পরমাণু';

  steps.push({
    stepNumber: 2,
    titleBangla: 'সহগ সমন্বয় (Stoichiometric Adjustments)',
    titleEnglish: 'Assign Coefficients to Balance Unequal Atoms',
    descriptionBangla: `ল্যাভয়সিয়ারের ভরের নিত্যতা নিশ্চিত করতে অসমতাকৃত পরমাণু (${unbalancedStr}) এর জন্য বিক্রিয়ক ও উৎপাদের সামনে উপযুক্ত পূর্ণসংখ্যা সহগ গুণ করা হয়।`,
    descriptionEnglish: `To uphold mass conservation, coefficients are applied to balance ${unbalancedStr} across both sides.`,
    currentEquation: formatEquationWithCoeffs(rCoeffs, pCoeffs),
    reactantCounts: finalCounts.left,
    productCounts: finalCounts.right
  });

  // Step 3: Verify balanced state
  steps.push({
    stepNumber: 3,
    titleBangla: 'ভরের নিত্যতা যাচাই (Final Verification)',
    titleEnglish: 'Confirm Conservation of Mass',
    descriptionBangla: 'উভয় পাশে প্রতিটি মৌলের পরমাণু সংখ্যা সমান হয়েছে: বিক্রিয়ার আগে ও পরে মোট পরমাণুর সংখ্যা সুষমভাবে সংরক্ষিত।',
    descriptionEnglish: 'All atom counts match on both sides, confirming complete mass balance.',
    currentEquation: formatEquationWithCoeffs(rCoeffs, pCoeffs),
    reactantCounts: finalCounts.left,
    productCounts: finalCounts.right
  });

  return {
    success: true,
    balancedEquation: formatEquationWithCoeffs(rCoeffs, pCoeffs),
    coefficients: {
      reactants: rCoeffs,
      products: pCoeffs
    },
    steps
  };
}
