export type ElementCategory =
  | 'Alkali Metal'
  | 'Alkaline Earth Metal'
  | 'Transition Metal'
  | 'Post-transition Metal'
  | 'Metalloid'
  | 'Nonmetal'
  | 'Reactive Nonmetal'
  | 'Halogen'
  | 'Noble Gas'
  | 'Lanthanide'
  | 'Actinide';

export type PhysicalState = 'Solid' | 'Liquid' | 'Gas' | 'Synthetic';

export interface ElementIsotope {
  mass: number;
  symbol: string;
  neutrons: number;
  abundance?: string;
  notesBangla: string;
  notesEnglish: string;
  stable: boolean;
}

export interface SubshellOrbitalDetail {
  subshell: 's' | 'p' | 'd' | 'f';
  n: number;
  electronCount: number;
  maxElectrons: number;
  orbitals: number[]; // e.g. [2] for s, [2, 2, 2] for p
}

export interface ChemicalElement {
  number: number;
  atomicNumber: number; // Convenient alias for number
  symbol: string;
  name: string;
  nameBangla: string;
  atomicMass: number;
  group: number | string;
  period: number;
  block: 's' | 'p' | 'd' | 'f';
  category: ElementCategory;
  state: PhysicalState;
  electronConfiguration: string;
  shells?: number[]; // Electron counts in K, L, M, N...
  valenceElectrons?: number; // Valence electron count in outermost shell
  meltingPoint?: number;
  boilingPoint?: number;
  oxidationStates: number[];
  electronegativity?: number;
  valency: number[];
  banglaInfo: string;
  englishInfo: string;
  colorHex: string;
  color?: string; // Hex color alias
  isFavorite?: boolean;
  commonIons?: string[];
  isotopes?: ElementIsotope[];
}

export type CompoundCategory =
  | 'Acid'
  | 'Base'
  | 'Salt'
  | 'Oxide'
  | 'Water/Hydride'
  | 'Organic'
  | 'Carbonate'
  | 'Sulfate'
  | 'Chloride'
  | 'Other';

export interface Compound {
  id: string;
  formula: string;
  name: string;
  nameBangla: string;
  category: CompoundCategory;
  state: PhysicalState;
  color: string;
  molecularWeight: number;
  bondingType?: 'Ionic' | 'Covalent' | 'Coordinate Covalent';
  properties: string[];
  banglaInfo: string;
  englishInfo: string;
  schoolContext: string;
  relatedReactions: string[];
  colorHex: string;
}

export type ReactionType =
  | 'Combination'
  | 'Decomposition'
  | 'Single Displacement'
  | 'Double Displacement'
  | 'Neutralization'
  | 'Combustion'
  | 'Redox';

export interface ReactionCondition {
  heatRequired?: boolean;
  fireRequired?: boolean;
  minTemp?: number;
  catalyst?: string;
}

export interface ReactionProductInfo {
  formula: string;
  name: string;
  nameBangla: string;
  state: PhysicalState;
  colorHex: string;
  atoms: { symbol: string; count: number }[];
  properties: string;
  schoolRelevance: string;
}

export interface ChemicalReaction {
  id: string;
  reactants: string[];
  products: string[];
  balancedEquation: string;
  reactionType: ReactionType;
  conditions: ReactionCondition;
  animationType:
    | 'liquid-swirl'
    | 'bubbles'
    | 'flame-glow'
    | 'precipitate'
    | 'fizz-gas'
    | 'color-change'
    | 'neutralization-glow'
    | 'molecular-exchange';
  energyBehavior: 'exothermic' | 'endothermic' | 'neutral';
  temperatureRise?: number;
  explanationBangla: string;
  explanationEnglish: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  verified: boolean;
  colorChange?: { from: string; to: string };
  productDetails: ReactionProductInfo[];
  visualEffects?: {
    bubbles?: boolean;
    precipitate?: boolean;
    gasVapor?: boolean;
    glowColor?: string;
    soundEffect?: 'fizz' | 'pop' | 'bubbling' | 'gentle';
  };
}

export interface ExperimentLog {
  id: string;
  timestamp: number;
  reaction: ChemicalReaction;
  reactantsUsed: string[];
  wasHeated: boolean;
  wasFired: boolean;
  tempFinal: number;
  notes: string;
}

export interface QuizQuestion {
  id: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questionBangla: string;
  questionEnglish: string;
  options: string[];
  correctIndex: number;
  explanationBangla: string;
  explanationEnglish: string;
  topic: string;
}

export interface LessonSection {
  titleBangla: string;
  titleEnglish: string;
  contentBangla: string;
  contentEnglish: string;
  keyPoints?: string[];
  exampleEquations?: string[];
}

export interface ChemistryLesson {
  id: string;
  titleBangla: string;
  titleEnglish: string;
  icon: string;
  sections: LessonSection[];
}

export interface Achievement {
  id: string;
  title: string;
  titleBangla: string;
  description: string;
  descriptionBangla: string;
  icon: string;
  xpReward: number;
  unlocked: boolean;
  unlockedAt?: number;
}

export interface AppState {
  activeTab: 'lab' | 'atom' | 'config' | 'ions' | 'table' | 'compounds' | 'balancer' | 'quiz' | 'lessons' | 'ai';
  selectedSubstances: string[];
  currentReaction: ChemicalReaction | null;
  heatLevel: 0 | 1 | 2 | 3;
  temperature: number;
  language: 'bn' | 'en';
  soundEnabled: boolean;
  theme: 'dark' | 'light';
  history: ExperimentLog[];
  achievements: Achievement[];
  userXp: number;
}
