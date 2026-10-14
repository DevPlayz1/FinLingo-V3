export interface LevelInfo {
  level: number;
  title: string;
  minXp: number;
  maxXp: number;
  icon: string;
  color: string;
}

export const LEVEL_TIERS: LevelInfo[] = [
  { level: 1, title: 'Finance Intern', minXp: 0, maxXp: 200, icon: 'GraduationCap', color: 'text-slate-600' },
  { level: 2, title: 'Junior Analyst', minXp: 200, maxXp: 500, icon: 'Briefcase', color: 'text-blue-600' },
  { level: 3, title: 'Investment Associate', minXp: 500, maxXp: 1000, icon: 'Award', color: 'text-indigo-600' },
  { level: 4, title: 'VP of Investments', minXp: 1000, maxXp: 2000, icon: 'ShieldCheck', color: 'text-emerald-600' },
  { level: 5, title: 'Managing Director', minXp: 2000, maxXp: 3500, icon: 'Gem', color: 'text-purple-600' },
  { level: 6, title: 'Chief Financial Officer (CFO)', minXp: 3500, maxXp: 99999, icon: 'Crown', color: 'text-amber-500' }
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

export const XP_REWARDS = {
  LESSON_COMPLETED: 40,
  QUIZ_CORRECT_ANSWER: 30,
  PERFECT_QUIZ_BONUS: 25,
  SPACED_REPETITION_PRACTICE: 20,
  DAILY_STREAK_BONUS: 15
};
