import { UserRole } from '../types';

export interface LevelInfo {
  level: number;
  title: string;
  minXp: number;
  maxXp: number;
  icon: string;
  color: string;
  unlockedDifficulties: ('beginner' | 'intermediate' | 'advanced')[];
  difficultySummary: string;
}

export type CareerRankTitle =
  | 'Intern'
  | 'Analyst'
  | 'Associate'
  | 'Vice President'
  | 'Managing Director'
  | 'CFO';

export type QuestionDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface DifficultyTierInfo {
  key: QuestionDifficulty;
  label: 'Easy' | 'Intermediate' | 'Hard';
  requiredRank: CareerRankTitle;
  minLevel: number;
  description: string;
}

export const DIFFICULTY_TIERS: Record<QuestionDifficulty, DifficultyTierInfo> = {
  beginner: {
    key: 'beginner',
    label: 'Easy',
    requiredRank: 'Intern',
    minLevel: 1,
    description: 'Foundational concepts, accounting fundamentals, and core terms.'
  },
  intermediate: {
    key: 'intermediate',
    label: 'Intermediate',
    requiredRank: 'Vice President',
    minLevel: 4,
    description: 'Analytical modeling, statement adjustments, and corporate dynamics.'
  },
  advanced: {
    key: 'advanced',
    label: 'Hard',
    requiredRank: 'CFO',
    minLevel: 6,
    description: 'Complex valuation, terminal value triangulation, and capital structures.'
  }
};

export const LEVEL_TIERS: LevelInfo[] = [
  {
    level: 1,
    title: 'Intern',
    minXp: 0,
    maxXp: 200,
    icon: 'GraduationCap',
    color: 'text-slate-600',
    unlockedDifficulties: ['beginner'],
    difficultySummary: 'Easy questions only'
  },
  {
    level: 2,
    title: 'Analyst',
    minXp: 200,
    maxXp: 500,
    icon: 'Briefcase',
    color: 'text-blue-600',
    unlockedDifficulties: ['beginner'],
    difficultySummary: 'Easy questions only'
  },
  {
    level: 3,
    title: 'Associate',
    minXp: 500,
    maxXp: 1000,
    icon: 'Award',
    color: 'text-indigo-600',
    unlockedDifficulties: ['beginner'],
    difficultySummary: 'Easy questions only'
  },
  {
    level: 4,
    title: 'Vice President',
    minXp: 1000,
    maxXp: 2000,
    icon: 'ShieldCheck',
    color: 'text-emerald-600',
    unlockedDifficulties: ['beginner', 'intermediate'],
    difficultySummary: 'Easy & Intermediate questions'
  },
  {
    level: 5,
    title: 'Managing Director',
    minXp: 2000,
    maxXp: 3500,
    icon: 'Gem',
    color: 'text-purple-600',
    unlockedDifficulties: ['beginner', 'intermediate'],
    difficultySummary: 'Easy & Intermediate questions'
  },
  {
    level: 6,
    title: 'CFO',
    minXp: 3500,
    maxXp: 99999,
    icon: 'Crown',
    color: 'text-amber-500',
    unlockedDifficulties: ['beginner', 'intermediate', 'advanced'],
    difficultySummary: 'Easy, Intermediate & Hard questions'
  }
];

export function getLevelInfo(xp: number): LevelInfo {
  for (let i = LEVEL_TIERS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_TIERS[i].minXp) {
      return LEVEL_TIERS[i];
    }
  }
  return LEVEL_TIERS[0];
}

export function calculateLevelProgress(xp: number): { percent: number; currentXpInLevel: number; neededXp: number } {
  const currentLevel = getLevelInfo(xp);
  if (currentLevel.level === LEVEL_TIERS[LEVEL_TIERS.length - 1].level) {
    return { percent: 100, currentXpInLevel: xp - currentLevel.minXp, neededXp: 0 };
  }
  const range = currentLevel.maxXp - currentLevel.minXp;
  const currentXpInLevel = Math.max(0, xp - currentLevel.minXp);
  const percent = Math.min(100, Math.round((currentXpInLevel / range) * 100));
  const neededXp = currentLevel.maxXp - xp;
  return { percent, currentXpInLevel, neededXp };
}

/**
 * Check whether a specific difficulty level is unlocked for the student or admin.
 * Admin exemption: Admin always retains unrestricted access to all difficulty levels.
 */
export function isDifficultyUnlocked(
  difficulty: QuestionDifficulty,
  studentLevel: number,
  role: UserRole = 'user'
): boolean {
  if (role === 'admin') return true;
  const requiredLevel = DIFFICULTY_TIERS[difficulty]?.minLevel ?? 1;
  return studentLevel >= requiredLevel;
}

/**
 * Returns the list of unlocked difficulties based on student level.
 * Admin exemption: Admin always has ['beginner', 'intermediate', 'advanced'] unlocked.
 */
export function getUnlockedDifficulties(
  studentLevel: number,
  role: UserRole = 'user'
): QuestionDifficulty[] {
  if (role === 'admin') {
    return ['beginner', 'intermediate', 'advanced'];
  }
  if (studentLevel >= 6) {
    return ['beginner', 'intermediate', 'advanced'];
  }
  if (studentLevel >= 4) {
    return ['beginner', 'intermediate'];
  }
  return ['beginner'];
}

export function getDifficultyDisplayLabel(difficulty: QuestionDifficulty): 'Easy' | 'Intermediate' | 'Hard' {
  return DIFFICULTY_TIERS[difficulty]?.label ?? 'Easy';
}

export function getDifficultyRequirementLabel(difficulty: QuestionDifficulty): string {
  const info = DIFFICULTY_TIERS[difficulty];
  if (info.minLevel === 1) return 'Available to all ranks';
  return `Unlocks at ${info.requiredRank} (Level ${info.minLevel})`;
}

export const XP_REWARDS = {
  LESSON_COMPLETED: 40,
  QUIZ_CORRECT_ANSWER: 30,
  PERFECT_QUIZ_BONUS: 25,
  SPACED_REPETITION_PRACTICE: 20,
  DAILY_STREAK_BONUS: 15
};

