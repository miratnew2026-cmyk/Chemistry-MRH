import { Achievement } from '../types';

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_reaction',
    title: 'First Reaction',
    titleBangla: 'প্রথম বিক্রিয়া',
    description: 'Successfully performed your first virtual chemical reaction!',
    descriptionBangla: 'ভার্চুয়াল ল্যাবে সফলভাবে তোমার প্রথম রাসায়নিক বিক্রিয়া সম্পন্ন করেছ!',
    icon: 'FlaskConical',
    xpReward: 50,
    unlocked: false
  },
  {
    id: 'ten_reactions',
    title: 'Reaction Explorer',
    titleBangla: 'বিক্রিয়া অভিযাত্রী',
    description: 'Discovered and executed 5 distinct verified reactions.',
    descriptionBangla: '৫টি ভিন্ন ভেরিফাইড রাসায়নিক বিক্রিয়া সফলভাবে পরিচালনা করেছ।',
    icon: 'Sparkles',
    xpReward: 150,
    unlocked: false
  },
  {
    id: 'ptable_explorer',
    title: 'Periodic Table Explorer',
    titleBangla: 'পর্যায় সারণি গবেষক',
    description: 'Inspected 10 different chemical elements and their properties.',
    descriptionBangla: '১০টি ভিন্ন রাসায়নিক মৌল বিস্তারিতভাবে পরিদর্শন করেছ।',
    icon: 'Atom',
    xpReward: 100,
    unlocked: false
  },
  {
    id: 'equation_master',
    title: 'Equation Master',
    titleBangla: 'সমীকরণ মাস্টার',
    description: 'Balanced chemical equations using the Step-by-Step Balancer.',
    descriptionBangla: 'ব্যালেন্সার টুলে সফলভাবে রাসায়নিক সমীকরণ সমতা করেছ।',
    icon: 'Scale',
    xpReward: 100,
    unlocked: false
  },
  {
    id: 'quiz_champion',
    title: 'Chemistry Quiz Champion',
    titleBangla: 'রসায়ন কুইজ চ্যাম্পিয়ন',
    description: 'Scored full marks on a Chemistry Quiz session.',
    descriptionBangla: 'রসায়ন কুইজে শতভাগ সঠিক উত্তর দিয়েছো।',
    icon: 'Trophy',
    xpReward: 120,
    unlocked: false
  },
  {
    id: 'heat_master',
    title: 'Thermal Wizard',
    titleBangla: 'তাপীয় জাদুকর',
    description: 'Successfully applied virtual Heat or Fire to run a thermal reaction.',
    descriptionBangla: 'তাপ অথবা অগ্নিশিখা প্রয়োগ করে তাপীয় বা দহন বিক্রিয়া ঘটিয়েছ।',
    icon: 'Flame',
    xpReward: 80,
    unlocked: false
  }
];
