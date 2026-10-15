import {
  UserProfile,
  SpacedRepetitionItem,
  LeaderboardEntry,
  TrackId,
  Lesson,
  QuizQuestion,
  LearningTrack,
  UserRole,
  LessonQuizRecord,
  LessonCompletionResult,
  QuizCompletionResult,
  Achievement
} from '../types';
import {
  LEARNING_TRACKS,
  LESSONS,
  QUIZ_QUESTIONS,
  INITIAL_ACHIEVEMENTS,
  INITIAL_LEADERBOARD
} from '../data/curriculum';
import { getLevelInfo, XP_REWARDS } from './gamification';
import { PROF_ANJALI_SANE_AVATAR } from '../assets/adminAvatar';

const STORAGE_KEYS = {
  USER_PROFILE: 'finlingo_user_profile_v1',
  ADMIN_PROFILE: 'finlingo_admin_profile_v1',
  LEGACY_PROFILE: 'finlingo_user_profile_v1',
  USER_SPACED_REPETITION: 'finlingo_spaced_rep_user_v1',
  ADMIN_SPACED_REPETITION: 'finlingo_spaced_rep_admin_v1',
  SPACED_REPETITION: 'finlingo_spaced_rep_v1',
  LEGACY_SPACED_REPETITION: 'finlingo_spaced_rep_v1',
  LEADERBOARD: 'finlingo_leaderboard_v1',
  ROLE: 'finlingo_demo_role_v1',
  CUSTOM_LESSONS: 'finlingo_custom_lessons_v1',
  CUSTOM_QUESTIONS: 'finlingo_custom_questions_v1',
  ADMIN_SETTINGS: 'finlingo_admin_settings_v1',
  PROFILE: 'finlingo_user_profile_v1',
  USER_PROGRESS_ZEROED: 'finlingo_user_progress_zeroed_v1'
};

const memoryStore: Record<string, string> = {};

const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
      return memoryStore[key] ?? null;
    } catch {
      return memoryStore[key] ?? null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
      memoryStore[key] = value;
    } catch {
      memoryStore[key] = value;
    }
  },
  removeItem: (key: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
      delete memoryStore[key];
    } catch {
      delete memoryStore[key];
    }
  }
};

// 1. CANONICAL USER (COLLEGE SCHOLAR) DEMO PROFILE
export const USER_DEFAULT_PROFILE: UserProfile = {
  uid: 'student_user_001',
  displayName: 'Dev Purecha',
  email: 'learner@finlingo.local',
  avatar: '',
  university: 'Columbia Business School',
  major: 'Commerce & Quantitative Finance',
  graduationYear: '2026',
  level: 1,
  levelTitle: 'Intern Scholar',
  currentXp: 0,
  nextLevelXp: 200,
  streakDays: 0,
  lastActiveDate: '',
  completedLessonIds: [],
  bookmarkedLessonIds: [],
  quizStats: {
    totalAnswered: 0,
    totalCorrect: 0,
    perfectQuizzesCount: 0
  },
  lessonQuizRecords: {},
  trackProgress: {
    accounting: 0,
    economics: 0,
    finance: 0
  },
  achievements: INITIAL_ACHIEVEMENTS.map((a) => ({ ...a, isUnlocked: false, unlockedAt: undefined })),
  weeklyActivity: {
    Mon: 0,
    Tue: 0,
    Wed: 0,
    Thu: 0,
    Fri: 0,
    Sat: 0,
    Sun: 0
  },
  recentActivity: [],
  privacySettings: {
    isLeaderboardPublic: true,
    showAvatarPublicly: true,
    allowAnalytics: true
  }
};

// 1B. ZEROED USER PROFILE (Used when Admin executes Reset User Progress)
export const USER_ZEROED_PROFILE: UserProfile = {
  uid: 'student_user_001',
  displayName: 'Dev Purecha',
  email: 'learner@finlingo.local',
  avatar: '',
  university: 'Columbia Business School',
  major: 'Commerce & Quantitative Finance',
  graduationYear: '2026',
  level: 1,
  levelTitle: 'Intern Scholar',
  currentXp: 0,
  nextLevelXp: 200,
  streakDays: 0,
  lastActiveDate: '',
  completedLessonIds: [],
  bookmarkedLessonIds: [],
  quizStats: {
    totalAnswered: 0,
    totalCorrect: 0,
    perfectQuizzesCount: 0
  },
  lessonQuizRecords: {},
  trackProgress: {
    accounting: 0,
    economics: 0,
    finance: 0
  },
  achievements: INITIAL_ACHIEVEMENTS.map((a) => ({ ...a, isUnlocked: false, unlockedAt: undefined })),
  weeklyActivity: {
    Mon: 0,
    Tue: 0,
    Wed: 0,
    Thu: 0,
    Fri: 0,
    Sat: 0,
    Sun: 0
  },
  recentActivity: [],
  privacySettings: {
    isLeaderboardPublic: true,
    showAvatarPublicly: true,
    allowAnalytics: true
  }
};

// 2. CANONICAL ADMIN (ACADEMIC ADMINISTRATOR) DEMO PROFILE
export const ADMIN_DEFAULT_PROFILE: UserProfile = {
  uid: 'admin_user_001',
  displayName: 'Prof. Dr. Anjali Sane',
  email: 'curriculum.admin@university.edu',
  avatar: PROF_ANJALI_SANE_AVATAR,
  university: 'Faculty of Commerce & Finance',
  major: 'Curriculum & Academic Governance',
  graduationYear: 'Faculty / Staff',
  level: 10,
  levelTitle: 'Chief Financial Officer',
  currentXp: 2850,
  nextLevelXp: 3000,
  streakDays: 45,
  lastActiveDate: new Date().toISOString().split('T')[0],
  completedLessonIds: [
    'acc-1', 'acc-2', 'acc-3', 'acc-4', 'acc-5', 'acc-6',
    'eco-1', 'eco-2', 'eco-3',
    'fin-1', 'fin-2', 'fin-6'
  ],
  bookmarkedLessonIds: ['acc-6', 'fin-6'],
  quizStats: {
    totalAnswered: 52,
    totalCorrect: 51,
    perfectQuizzesCount: 12
  },
  lessonQuizRecords: {
    'acc-1': { lessonId: 'acc-1', bestScore: 4, totalQuestions: 4, bestEarnedXp: 145, attemptsCount: 1, passed: true, lastAttemptAt: Date.now() - 86400000, isPerfect: true },
    'acc-6': { lessonId: 'acc-6', bestScore: 4, totalQuestions: 4, bestEarnedXp: 150, attemptsCount: 1, passed: true, lastAttemptAt: Date.now() - 86400000, isPerfect: true },
    'fin-6': { lessonId: 'fin-6', bestScore: 4, totalQuestions: 4, bestEarnedXp: 150, attemptsCount: 1, passed: true, lastAttemptAt: Date.now() - 86400000, isPerfect: true }
  },
  trackProgress: {
    accounting: 100,
    economics: 50,
    finance: 33
  },
  achievements: INITIAL_ACHIEVEMENTS.map(a => ({ ...a, isUnlocked: true, unlockedAt: Date.now() - 86400000 })),
  weeklyActivity: {
    Mon: 6,
    Tue: 5,
    Wed: 6,
    Thu: 7,
    Fri: 5,
    Sat: 6,
    Sun: 4
  },
  recentActivity: [
    {
      id: 'act-admin-1',
      type: 'lesson_completed',
      title: 'Completed: Advanced DCF Modeling',
      timestamp: Date.now() - 3600000,
      xpEarned: 40
    }
  ],
  privacySettings: {
    isLeaderboardPublic: true,
    showAvatarPublicly: true,
    allowAnalytics: true
  }
};

const DEFAULT_PROFILE: UserProfile = USER_DEFAULT_PROFILE;

// Seed default spaced repetition items for Student User (0 items by default)
export const DEFAULT_USER_SPACED_REPETITION: SpacedRepetitionItem[] = [];

// Seed default spaced repetition items for Admin
export const DEFAULT_ADMIN_SPACED_REPETITION: SpacedRepetitionItem[] = [
  {
    id: 'sr-admin-fin-6',
    questionId: 'q-fin-6-1',
    lessonId: 'fin-6',
    trackId: 'finance',
    prompt: 'In Discounted Cash Flow (DCF) modeling, why is Terminal Value typically calculated using both the Gordon Growth Model and the Exit Multiple method?',
    options: [
      'To provide a cross-check range and mitigate sensitivity to perpetual terminal growth rate assumptions',
      'Because GAAP mandates that both methods must be averaged in quarterly 10-Q disclosures',
      'To eliminate the need for forecasting free cash flows in the explicit projection period',
      'Because the exit multiple always equals the reciprocal of the cost of equity'
    ],
    correctOptionIndex: 0,
    explanation: 'Cross-checking the Gordon Growth method with the Exit Multiple approach provides valuation triangulation against terminal rate sensitivity.',
    repetitionLevel: 2,
    lastReviewedAt: Date.now() - 86400000,
    nextReviewAt: Date.now(),
    mistakeCount: 0,
    successfulStreak: 2
  },
  {
    id: 'sr-admin-acc-6',
    questionId: 'q-acc-6-1',
    lessonId: 'acc-6',
    trackId: 'accounting',
    prompt: 'Under US GAAP, what is the impact of a LIFO liquidation during a period of sustained inflation?',
    options: [
      'Lower reported gross profit because new purchases are immediately expensed',
      'Artificial boost in reported gross profit and higher tax liabilities as older, lower-cost inventory is matched against current revenues',
      'Complete derecognition of ending inventory on the balance sheet',
      'Zero effect because the LIFO conformity rule prevents liquidations from affecting net income'
    ],
    correctOptionIndex: 1,
    explanation: 'A LIFO liquidation during inflation matches older, cheaper inventory with current sales prices, artificially inflating profits and taxes.',
    repetitionLevel: 2,
    lastReviewedAt: Date.now() - 172800000,
    nextReviewAt: Date.now(),
    mistakeCount: 0,
    successfulStreak: 3
  }
];

const DEFAULT_SPACED_REPETITION = DEFAULT_USER_SPACED_REPETITION;

class DataService {
  // --- DEMO ROLE ACCESS CONTROL (Client-side RBAC) ---
  getCurrentRole(): UserRole {
    try {
      const stored = safeStorage.getItem(STORAGE_KEYS.ROLE);
      if (stored === 'admin' || stored === 'user') return stored;
    } catch {
      // Fallback
    }
    return 'user';
  }

  setRole(role: UserRole | null): void {
    try {
      if (role) {
        safeStorage.setItem(STORAGE_KEYS.ROLE, role);
      } else {
        safeStorage.removeItem(STORAGE_KEYS.ROLE);
      }
    } catch {
      // Ignore
    }
  }

  // --- TRACKS & LESSONS (Curriculum Repository with Admin-Only Restrictions) ---
  getTracks(): LearningTrack[] {
    return LEARNING_TRACKS;
  }

  getTrack(trackId: TrackId): LearningTrack | undefined {
    return LEARNING_TRACKS.find(t => t.id === trackId);
  }

  getLessons(): Lesson[] {
    // 1. Deep clone base curriculum
    const base: Lesson[] = JSON.parse(JSON.stringify(LESSONS));

    // 2. Default restricted lessons for demonstration:
    // Lesson acc-6 (Inventory Costing & FIFO/LIFO) and fin-6 (DCF Modeling)
    base.forEach(l => {
      if (l.id === 'acc-6' || l.id === 'fin-6') {
        l.isAdminOnly = true;
      } else {
        l.isAdminOnly = false;
      }
    });

    // 3. Overlay any saved customizations / admin toggles from localStorage
    try {
      const stored = safeStorage.getItem(STORAGE_KEYS.CUSTOM_LESSONS);
      if (stored) {
        const overrides: Record<string, Partial<Lesson>> = JSON.parse(stored);
        base.forEach(l => {
          if (overrides[l.id]) {
            Object.assign(l, overrides[l.id]);
          }
        });
      }
    } catch {
      // Fallback to base
    }

    return base;
  }

  getLessonsByTrack(trackId: TrackId): Lesson[] {
    return this.getLessons().filter(l => l.trackId === trackId).sort((a, b) => a.order - b.order);
  }

  getLesson(lessonId: string): Lesson | undefined {
    return this.getLessons().find(l => l.id === lessonId);
  }

  // Admin action: Toggle lesson restriction status (Protected by role check in application logic)
  toggleLessonAdminOnly(lessonId: string, isAdminOnly: boolean, role: UserRole): boolean {
    if (role !== 'admin') {
      console.warn('RBAC Violation: Non-admin attempted to alter lesson restriction');
      return false;
    }
    try {
      const stored = safeStorage.getItem(STORAGE_KEYS.CUSTOM_LESSONS);
      const overrides: Record<string, Partial<Lesson>> = stored ? JSON.parse(stored) : {};
      overrides[lessonId] = { ...(overrides[lessonId] || {}), isAdminOnly };
      safeStorage.setItem(STORAGE_KEYS.CUSTOM_LESSONS, JSON.stringify(overrides));
      return true;
    } catch {
      return false;
    }
  }

  // Admin action: Update lesson metadata
  updateLesson(lessonId: string, updates: Partial<Lesson>, role: UserRole): boolean {
    if (role !== 'admin') {
      console.warn('RBAC Violation: Non-admin attempted to edit lesson');
      return false;
    }
    try {
      const stored = safeStorage.getItem(STORAGE_KEYS.CUSTOM_LESSONS);
      const overrides: Record<string, Partial<Lesson>> = stored ? JSON.parse(stored) : {};
      overrides[lessonId] = { ...(overrides[lessonId] || {}), ...updates };
      safeStorage.setItem(STORAGE_KEYS.CUSTOM_LESSONS, JSON.stringify(overrides));
      return true;
    } catch {
      return false;
    }
  }

  // --- QUIZ QUESTIONS REPOSITORY (200+ Bank with Admin Editing Support) ---
  getQuestions(): QuizQuestion[] {
    const base: QuizQuestion[] = JSON.parse(JSON.stringify(QUIZ_QUESTIONS));
    try {
      const stored = safeStorage.getItem(STORAGE_KEYS.CUSTOM_QUESTIONS);
      if (stored) {
        const overrides: Record<string, Partial<QuizQuestion>> = JSON.parse(stored);
        base.forEach(q => {
          if (overrides[q.id]) {
            Object.assign(q, overrides[q.id]);
          }
        });
      }
    } catch {
      // Fallback
    }
    return base;
  }

  getQuestionsByLesson(lessonId: string): QuizQuestion[] {
    return this.getQuestions().filter(q => q.lessonId === lessonId);
  }

  getQuestionsByTrack(trackId: TrackId): QuizQuestion[] {
    return this.getQuestions().filter(q => q.trackId === trackId);
  }

  // Admin action: Edit question details
  updateQuestion(questionId: string, updates: Partial<QuizQuestion>, role: UserRole): boolean {
    if (role !== 'admin') {
      console.warn('RBAC Violation: Non-admin attempted to edit question');
      return false;
    }
    try {
      const stored = safeStorage.getItem(STORAGE_KEYS.CUSTOM_QUESTIONS);
      const overrides: Record<string, Partial<QuizQuestion>> = stored ? JSON.parse(stored) : {};
      overrides[questionId] = { ...(overrides[questionId] || {}), ...updates };
      safeStorage.setItem(STORAGE_KEYS.CUSTOM_QUESTIONS, JSON.stringify(overrides));
      return true;
    } catch {
      return false;
    }
  }

  // --- USER PROFILE REPOSITORY (Maintains separate Admin & User local demo profiles) ---
  getUserProfile(role?: UserRole): UserProfile {
    const targetRole = role ?? this.getCurrentRole();
    const isUserZeroed = targetRole === 'user' && safeStorage.getItem(STORAGE_KEYS.USER_PROGRESS_ZEROED) === 'true';
    const storageKey = targetRole === 'admin' ? STORAGE_KEYS.ADMIN_PROFILE : STORAGE_KEYS.USER_PROFILE;
    const defaultBase = targetRole === 'admin'
      ? ADMIN_DEFAULT_PROFILE
      : isUserZeroed
      ? USER_ZEROED_PROFILE
      : USER_DEFAULT_PROFILE;

    try {
      const stored = safeStorage.getItem(storageKey);
      if (stored) {
        const parsed: UserProfile = JSON.parse(stored);
        if (targetRole === 'user') {
          if (parsed.displayName === 'Alex Morgan' || parsed.displayName === 'Student Scholar' || !parsed.displayName) {
            parsed.displayName = 'Dev Purecha';
          }
          parsed.email = 'learner@finlingo.local';
          if (parsed.avatar?.includes('unsplash.com')) {
            parsed.avatar = '';
          }
        }
        if (targetRole === 'admin') {
          if (parsed.displayName === 'Prof. Eleanor Vance' || !parsed.displayName) {
            parsed.displayName = 'Prof. Dr. Anjali Sane';
          }
          if (parsed.avatar?.includes('unsplash.com') || !parsed.avatar) {
            parsed.avatar = PROF_ANJALI_SANE_AVATAR;
          }
        }
        if (!parsed.privacySettings) {
          parsed.privacySettings = {
            isLeaderboardPublic: true,
            showAvatarPublicly: true,
            allowAnalytics: true
          };
        }
        if (parsed.completedLessonIds === undefined || !Array.isArray(parsed.completedLessonIds)) {
          parsed.completedLessonIds = isUserZeroed ? [] : [...defaultBase.completedLessonIds];
        }
        if (parsed.bookmarkedLessonIds === undefined || !Array.isArray(parsed.bookmarkedLessonIds)) {
          parsed.bookmarkedLessonIds = isUserZeroed ? [] : [...defaultBase.bookmarkedLessonIds];
        }
        if (!parsed.quizStats) {
          parsed.quizStats = { ...defaultBase.quizStats };
        }
        if (!parsed.lessonQuizRecords) {
          parsed.lessonQuizRecords = { ...defaultBase.lessonQuizRecords };
        }
        if (!parsed.achievements || !Array.isArray(parsed.achievements) || parsed.achievements.length === 0) {
          parsed.achievements = isUserZeroed
            ? INITIAL_ACHIEVEMENTS.map(a => ({ ...a, isUnlocked: false, unlockedAt: undefined }))
            : JSON.parse(JSON.stringify(defaultBase.achievements));
        }
        if (!parsed.weeklyActivity) {
          parsed.weeklyActivity = { ...(defaultBase.weeklyActivity || { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 }) };
        }
        if (!parsed.recentActivity) {
          parsed.recentActivity = [...(defaultBase.recentActivity || [])];
        }

        // Refresh level info based on currentXp
        const lvl = getLevelInfo(parsed.currentXp);
        parsed.level = lvl.level;
        parsed.levelTitle = lvl.title;
        parsed.nextLevelXp = lvl.maxXp;

        // Auto-check achievement unlocks on profile load
        this.checkAndUnlockAchievements(parsed);

        return parsed;
      }

      // Backward compatibility check for user profile from legacy key
      if (targetRole === 'user') {
        const legacy = safeStorage.getItem(STORAGE_KEYS.LEGACY_PROFILE);
        if (legacy) {
          const parsedLegacy: UserProfile = JSON.parse(legacy);
          if (parsedLegacy.uid !== 'admin_user_001') {
            return parsedLegacy;
          }
        }
      }
    } catch {
      // Fallback
    }

    const defaultCopy: UserProfile = JSON.parse(JSON.stringify(defaultBase));
    const lvl = getLevelInfo(defaultCopy.currentXp);
    defaultCopy.level = lvl.level;
    defaultCopy.levelTitle = lvl.title;
    defaultCopy.nextLevelXp = lvl.maxXp;
    return defaultCopy;
  }

  saveUserProfile(profile: UserProfile, role?: UserRole): void {
    const targetRole = role ?? (profile.uid === 'admin_user_001' ? 'admin' : (this.getCurrentRole() || 'user'));
    const storageKey = targetRole === 'admin' ? STORAGE_KEYS.ADMIN_PROFILE : STORAGE_KEYS.USER_PROFILE;

    const lvl = getLevelInfo(profile.currentXp);
    profile.level = lvl.level;
    profile.levelTitle = lvl.title;
    profile.nextLevelXp = lvl.maxXp;

    // Recalculate track progress
    const accountingTotal = LESSONS.filter(l => l.trackId === 'accounting').length;
    const economicsTotal = LESSONS.filter(l => l.trackId === 'economics').length;
    const financeTotal = LESSONS.filter(l => l.trackId === 'finance').length;

    const accCompleted = profile.completedLessonIds.filter(id => id.startsWith('acc-')).length;
    const ecoCompleted = profile.completedLessonIds.filter(id => id.startsWith('eco-')).length;
    const finCompleted = profile.completedLessonIds.filter(id => id.startsWith('fin-')).length;

    profile.trackProgress = {
      accounting: Math.round((accCompleted / Math.max(1, accountingTotal)) * 100),
      economics: Math.round((ecoCompleted / Math.max(1, economicsTotal)) * 100),
      finance: Math.round((finCompleted / Math.max(1, financeTotal)) * 100)
    };

    // Ensure achievements are consistent
    this.checkAndUnlockAchievements(profile);

    try {
      safeStorage.setItem(storageKey, JSON.stringify(profile));
    } catch {
      // Ignore write errors
    }

    // Keep current active profile in leaderboard synced
    if (targetRole === this.getCurrentRole()) {
      this.syncCurrentUserToLeaderboard(profile);
    }
  }

  addXp(amount: number, role?: UserRole): UserProfile {
    const targetRole = role ?? this.getCurrentRole();
    const profile = this.getUserProfile(targetRole);
    profile.currentXp += Math.max(0, amount);
    this.saveUserProfile(profile, targetRole);
    return profile;
  }

  // --- LEARNING PROGRESSION: LESSON COMPLETION ---
  // Awards XP strictly once to prevent duplicate farming upon repeated completion
  completeLesson(lessonId: string, customXpValue?: number): LessonCompletionResult {
    const profile = this.getUserProfile();
    const prevLevel = profile.level;
    const isAlreadyCompleted = profile.completedLessonIds.includes(lessonId);

    let awardedXp = 0;
    let isNewlyCompleted = false;

    if (!isAlreadyCompleted) {
      isNewlyCompleted = true;
      const lessonObj = this.getLesson(lessonId);
      const baseXp = customXpValue ?? lessonObj?.xpValue ?? XP_REWARDS.LESSON_COMPLETED;
      awardedXp = Math.max(0, baseXp);
      profile.completedLessonIds.push(lessonId);
      profile.currentXp += awardedXp;
    }

    // Update daily/weekly activity
    const dayNames: Array<'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat'> = [
      'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
    ];
    const todayName = dayNames[new Date().getDay()];
    if (!profile.weeklyActivity) {
      profile.weeklyActivity = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
    }
    profile.weeklyActivity[todayName] = (profile.weeklyActivity[todayName] || 0) + 1;

    if (!profile.recentActivity) {
      profile.recentActivity = [];
    }
    const lessonObj = this.getLesson(lessonId);
    profile.recentActivity.unshift({
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type: 'lesson_completed',
      title: `Completed: ${lessonObj?.title || lessonId}`,
      timestamp: Date.now(),
      xpEarned: awardedXp
    });
    if (profile.recentActivity.length > 10) {
      profile.recentActivity = profile.recentActivity.slice(0, 10);
    }

    // Maintain study streak and record activity date
    const streakInfo = this.updateStreakAndActivity(profile);

    // Evaluate and unlock achievements
    const newAchievements = this.checkAndUnlockAchievements(profile);

    // Persist changes and update leaderboard
    this.saveUserProfile(profile);

    const leveledUp = profile.level > prevLevel;

    return {
      profile,
      isNewlyCompleted,
      awardedXp,
      newAchievements,
      leveledUp,
      newLevel: leveledUp ? profile.level : undefined,
      newLevelTitle: leveledUp ? profile.levelTitle : undefined,
      streakInfo
    };
  }

  // --- LEARNING PROGRESSION: QUIZ PERFORMANCE & SCORING ---
  // Tracks quiz attempts per lesson and awards XP only for genuine improvements,
  // strictly preventing duplicate rewards from repeated quiz submissions.
  recordQuizResults(
    lessonId: string | undefined,
    answeredCount: number,
    correctCount: number,
    calculatedXp: number,
    isPerfect: boolean
  ): QuizCompletionResult {
    const profile = this.getUserProfile();
    const prevLevel = profile.level;

    if (!profile.lessonQuizRecords) {
      profile.lessonQuizRecords = {};
    }

    const quizKey = lessonId || 'general_practice';
    const previousRecord = profile.lessonQuizRecords[quizKey];
    const previousBestXp = previousRecord ? previousRecord.bestEarnedXp : 0;
    const potentialXp = Math.max(0, calculatedXp);

    let awardedXp = 0;
    let isFirstAttempt = false;
    let isImprovement = false;
    let isDuplicateSubmission = false;

    if (!previousRecord) {
      // First-time completion of this lesson's quiz: grant full earned XP
      isFirstAttempt = true;
      awardedXp = potentialXp;
      profile.lessonQuizRecords[quizKey] = {
        lessonId: quizKey,
        bestScore: correctCount,
        totalQuestions: answeredCount,
        bestEarnedXp: potentialXp,
        attemptsCount: 1,
        passed: correctCount >= Math.ceil(answeredCount * 0.5),
        lastAttemptAt: Date.now(),
        isPerfect
      };
    } else {
      // Retake attempt: award incremental XP only if the student improved their score!
      previousRecord.attemptsCount += 1;
      previousRecord.lastAttemptAt = Date.now();
      if (isPerfect) previousRecord.isPerfect = true;
      if (correctCount >= Math.ceil(answeredCount * 0.5)) previousRecord.passed = true;

      if (potentialXp > previousBestXp) {
        isImprovement = true;
        awardedXp = potentialXp - previousBestXp;
        previousRecord.bestScore = Math.max(previousRecord.bestScore, correctCount);
        previousRecord.bestEarnedXp = potentialXp;
      } else {
        // No score improvement or identical score: zero duplicate XP awarded!
        isDuplicateSubmission = true;
        awardedXp = 0;
        previousRecord.bestScore = Math.max(previousRecord.bestScore, correctCount);
      }
    }

    // Award XP if greater than 0
    if (awardedXp > 0) {
      profile.currentXp += awardedXp;
    }

    // Update aggregate quiz stats
    profile.quizStats.totalAnswered += answeredCount;
    profile.quizStats.totalCorrect += correctCount;
    if (isPerfect) {
      profile.quizStats.perfectQuizzesCount += 1;
    }

    // Update daily/weekly activity
    const dayNames: Array<'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat'> = [
      'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
    ];
    const todayName = dayNames[new Date().getDay()];
    if (!profile.weeklyActivity) {
      profile.weeklyActivity = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
    }
    profile.weeklyActivity[todayName] = (profile.weeklyActivity[todayName] || 0) + 1;

    // Log recent activity
    if (!profile.recentActivity) {
      profile.recentActivity = [];
    }
    const lessonTitle = lessonId ? (this.getLesson(lessonId)?.title || lessonId) : 'Curriculum Quiz';
    profile.recentActivity.unshift({
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type: isPerfect ? 'quiz_passed' : 'quiz_attempted',
      title: `Quiz: ${lessonTitle} (${correctCount}/${answeredCount} Correct)`,
      timestamp: Date.now(),
      xpEarned: awardedXp
    });
    if (profile.recentActivity.length > 10) {
      profile.recentActivity = profile.recentActivity.slice(0, 10);
    }

    // Maintain streak and daily activity
    const streakInfo = this.updateStreakAndActivity(profile);

    // Evaluate achievements
    const newAchievements = this.checkAndUnlockAchievements(profile, { isQuizPerfect: isPerfect });

    // Persist updated profile
    this.saveUserProfile(profile);

    const leveledUp = profile.level > prevLevel;

    return {
      profile,
      awardedXp,
      potentialXp,
      previousBestXp,
      isFirstAttempt,
      isImprovement,
      isDuplicateSubmission,
      isPerfect,
      newAchievements,
      leveledUp,
      newLevel: leveledUp ? profile.level : undefined,
      newLevelTitle: leveledUp ? profile.levelTitle : undefined,
      streakInfo
    };
  }

  // --- STREAK & ACTIVITY MAINTENANCE ---
  private updateStreakAndActivity(profile: UserProfile): {
    streakIncremented: boolean;
    currentStreak: number;
    bonusXp: number;
  } {
    const today = new Date().toISOString().split('T')[0];
    const lastActive = profile.lastActiveDate;
    let bonusXp = 0;
    let streakIncremented = false;

    if (!lastActive) {
      profile.streakDays = 1;
      profile.lastActiveDate = today;
      streakIncremented = true;
    } else if (lastActive === today) {
      // Activity already recorded for today; maintain active streak
      if (!profile.streakDays || profile.streakDays < 1) {
        profile.streakDays = 1;
      }
    } else {
      // Compare calendar dates (UTC midnight)
      const lastDate = new Date(lastActive + 'T00:00:00Z');
      const currentDate = new Date(today + 'T00:00:00Z');
      const diffMs = currentDate.getTime() - lastDate.getTime();
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Consecutive calendar day! Increment streak and award daily bonus
        profile.streakDays = (profile.streakDays || 0) + 1;
        bonusXp = XP_REWARDS.DAILY_STREAK_BONUS;
        profile.currentXp += bonusXp;
        streakIncremented = true;
      } else if (diffDays > 1) {
        // More than 1 day missed: reset streak to 1
        profile.streakDays = 1;
      }
      profile.lastActiveDate = today;
    }

    return {
      streakIncremented,
      currentStreak: profile.streakDays,
      bonusXp
    };
  }

  // --- ACHIEVEMENTS CONSISTENCY ENGINE ---
  checkAndUnlockAchievements(
    profile: UserProfile,
    context?: { isQuizPerfect?: boolean; masteredSrCount?: number }
  ): Achievement[] {
    const newlyUnlocked: Achievement[] = [];
    if (!profile.achievements || !Array.isArray(profile.achievements) || profile.achievements.length === 0) {
      profile.achievements = JSON.parse(JSON.stringify(INITIAL_ACHIEVEMENTS));
    }

    const unlock = (achId: string) => {
      const ach = profile.achievements.find(a => a.id === achId);
      if (ach && !ach.isUnlocked) {
        ach.isUnlocked = true;
        ach.unlockedAt = Date.now();
        newlyUnlocked.push(ach);
      }
    };

    // ach-1: 'First Ledger Entry' - Complete your first lesson in any track
    if (profile.completedLessonIds.length >= 1) {
      unlock('ach-1');
    }

    // ach-2: 'Daily Trader Streak' - Maintain a 3-day study streak
    if (profile.streakDays >= 3) {
      unlock('ach-2');
    }

    // ach-3: 'Wall Street Analyst' - Accumulate over 500 XP
    if (profile.currentXp >= 500) {
      unlock('ach-3');
    }

    // ach-4: 'Precision Investor' - Score 100% on any practice quiz session
    if (profile.quizStats.perfectQuizzesCount >= 1 || context?.isQuizPerfect === true) {
      unlock('ach-4');
    }

    // ach-5: 'Memory Vault Master' - Master 3 concepts through Spaced Repetition
    const masteredCount = context?.masteredSrCount ?? this.getMasteredSpacedCount();
    if (masteredCount >= 3) {
      unlock('ach-5');
    }

    // ach-6: 'Chief Financial Officer' - Reach Level 4 in the FinLingo career ladder
    const currentLevel = getLevelInfo(profile.currentXp).level;
    if (currentLevel >= 4) {
      unlock('ach-6');
    }

    return newlyUnlocked;
  }

  getMasteredSpacedCount(): number {
    const deck = this.getSpacedRepetitionDeck();
    return deck.filter(i => i.repetitionLevel >= 3).length;
  }

  // --- NEXT AVAILABLE LESSON RESOLVER ---
  // Identifies the logical next lesson to study based on student completion and role permissions
  getNextAvailableLesson(role: UserRole = 'user'): {
    lesson: Lesson;
    track: LearningTrack;
    isCurriculumComplete: boolean;
    uncompletedCount: number;
    completedCount: number;
    totalCount: number;
  } {
    const profile = this.getUserProfile();
    const allLessons = this.getLessons();
    const tracks = this.getTracks();

    // Canonical track sequence: Accounting -> Economics -> Finance
    const trackOrder: TrackId[] = ['accounting', 'economics', 'finance'];
    const sortedLessons = [...allLessons].sort((a, b) => {
      const trackDiff = trackOrder.indexOf(a.trackId) - trackOrder.indexOf(b.trackId);
      if (trackDiff !== 0) return trackDiff;
      return a.order - b.order;
    });

    // Available lessons for current role
    const candidateLessons = sortedLessons.filter(l => {
      if (role !== 'admin' && l.isAdminOnly) return false;
      return true;
    });

    const uncompletedCandidates = candidateLessons.filter(
      l => !profile.completedLessonIds.includes(l.id)
    );

    const completedCount = candidateLessons.filter(
      l => profile.completedLessonIds.includes(l.id)
    ).length;

    if (uncompletedCandidates.length > 0) {
      const nextLesson = uncompletedCandidates[0];
      const track = tracks.find(t => t.id === nextLesson.trackId) || tracks[0];
      return {
        lesson: nextLesson,
        track,
        isCurriculumComplete: false,
        uncompletedCount: uncompletedCandidates.length,
        completedCount,
        totalCount: candidateLessons.length
      };
    }

    // All available lessons completed!
    const defaultLesson = candidateLessons[0] || sortedLessons[0];
    const track = tracks.find(t => t.id === defaultLesson.trackId) || tracks[0];
    return {
      lesson: defaultLesson,
      track,
      isCurriculumComplete: true,
      uncompletedCount: 0,
      completedCount,
      totalCount: candidateLessons.length
    };
  }

  getLessonQuizRecord(lessonId: string): LessonQuizRecord | undefined {
    const profile = this.getUserProfile();
    return profile.lessonQuizRecords?.[lessonId];
  }

  isLessonCompleted(lessonId: string): boolean {
    const profile = this.getUserProfile();
    return profile.completedLessonIds.includes(lessonId);
  }

  toggleBookmarkLesson(lessonId: string): boolean {
    const profile = this.getUserProfile();
    const index = profile.bookmarkedLessonIds.indexOf(lessonId);
    let bookmarked = false;
    if (index > -1) {
      profile.bookmarkedLessonIds.splice(index, 1);
      bookmarked = false;
    } else {
      profile.bookmarkedLessonIds.push(lessonId);
      bookmarked = true;
    }
    this.saveUserProfile(profile);
    return bookmarked;
  }

  // --- SPACED REPETITION ENGINE (Role-isolated Flashcard Decks) ---
  getSpacedRepetitionDeck(role?: UserRole): SpacedRepetitionItem[] {
    const targetRole = role ?? this.getCurrentRole();
    const isUserZeroed = targetRole === 'user' && safeStorage.getItem(STORAGE_KEYS.USER_PROGRESS_ZEROED) === 'true';
    const storageKey = targetRole === 'admin' ? STORAGE_KEYS.ADMIN_SPACED_REPETITION : STORAGE_KEYS.USER_SPACED_REPETITION;
    const defaultDeck = targetRole === 'admin'
      ? DEFAULT_ADMIN_SPACED_REPETITION
      : isUserZeroed
      ? []
      : DEFAULT_USER_SPACED_REPETITION;

    try {
      const stored = safeStorage.getItem(storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
      // Backward compatibility check for legacy key
      if (targetRole === 'user' && !isUserZeroed) {
        const legacy = safeStorage.getItem(STORAGE_KEYS.LEGACY_SPACED_REPETITION);
        if (legacy) return JSON.parse(legacy);
      }
    } catch {
      // Fallback
    }
    return JSON.parse(JSON.stringify(defaultDeck));
  }

  saveSpacedRepetitionDeck(deck: SpacedRepetitionItem[], role?: UserRole): void {
    const targetRole = role ?? this.getCurrentRole();
    const storageKey = targetRole === 'admin' ? STORAGE_KEYS.ADMIN_SPACED_REPETITION : STORAGE_KEYS.USER_SPACED_REPETITION;
    try {
      safeStorage.setItem(storageKey, JSON.stringify(deck));
    } catch {
      // Ignore
    }
  }

  enqueueSpacedRepetition(question: QuizQuestion, role?: UserRole): void {
    const targetRole = role ?? this.getCurrentRole();
    const deck = this.getSpacedRepetitionDeck(targetRole);
    const existingIndex = deck.findIndex(i => i.questionId === question.id);

    if (existingIndex > -1) {
      // Increment mistake count and reset repetition level to 0
      deck[existingIndex].mistakeCount += 1;
      deck[existingIndex].repetitionLevel = 0;
      deck[existingIndex].successfulStreak = 0;
      deck[existingIndex].lastReviewedAt = Date.now();
      deck[existingIndex].nextReviewAt = Date.now();
    } else {
      deck.push({
        id: `sr-${question.id}`,
        questionId: question.id,
        lessonId: question.lessonId,
        trackId: question.trackId,
        prompt: question.prompt,
        options: question.options,
        correctOptionIndex: question.correctOptionIndex,
        explanation: question.explanation,
        repetitionLevel: 0, // Needs immediate review
        lastReviewedAt: Date.now(),
        nextReviewAt: Date.now(),
        mistakeCount: 1,
        successfulStreak: 0
      });
    }

    this.saveSpacedRepetitionDeck(deck, targetRole);
  }

  advanceSpacedRepetition(itemId: string, correct: boolean, role?: UserRole): {
    item: SpacedRepetitionItem;
    isMastered: boolean;
    awardedXp: number;
    newAchievements: Achievement[];
  } | null {
    const targetRole = role ?? this.getCurrentRole();
    const deck = this.getSpacedRepetitionDeck(targetRole);
    const item = deck.find(i => i.id === itemId);
    if (!item) return null;

    let isMastered = false;
    let awardedXp = 0;
    const profile = this.getUserProfile(targetRole);

    if (correct) {
      item.successfulStreak += 1;
      item.repetitionLevel += 1;
      item.lastReviewedAt = Date.now();

      // Repetition intervals:
      // Level 1: Review next day
      // Level 2: Review in 3 days
      // Level 3+: Mastered!
      if (item.repetitionLevel >= 3) {
        isMastered = true;
        item.nextReviewAt = Date.now() + 1000 * 60 * 60 * 24 * 7; // Mastered review later
      } else if (item.repetitionLevel === 2) {
        item.nextReviewAt = Date.now() + 1000 * 60 * 60 * 24 * 3;
      } else {
        item.nextReviewAt = Date.now() + 1000 * 60 * 60 * 24 * 1;
      }

      awardedXp = XP_REWARDS.SPACED_REPETITION_PRACTICE;
      profile.currentXp += awardedXp;
    } else {
      item.mistakeCount += 1;
      item.repetitionLevel = 0;
      item.successfulStreak = 0;
      item.lastReviewedAt = Date.now();
      item.nextReviewAt = Date.now(); // immediate review needed
    }

    this.saveSpacedRepetitionDeck(deck, targetRole);

    // Maintain study streak and daily activity
    this.updateStreakAndActivity(profile);

    // Count total mastered items
    const totalMastered = deck.filter(i => i.repetitionLevel >= 3).length;
    const newAchievements = this.checkAndUnlockAchievements(profile, { masteredSrCount: totalMastered });

    this.saveUserProfile(profile, targetRole);

    return { item, isMastered, awardedXp, newAchievements };
  }

  removeSpacedRepetitionItem(itemId: string, role?: UserRole): void {
    const targetRole = role ?? this.getCurrentRole();
    const deck = this.getSpacedRepetitionDeck(targetRole).filter(i => i.id !== itemId);
    this.saveSpacedRepetitionDeck(deck, targetRole);
  }

  // --- LEADERBOARD REPOSITORY (Canonical Sample Dataset as Single Source of Truth) ---
  getLeaderboard(): LeaderboardEntry[] {
    // 1. Always start from a deep clone of the canonical sample dataset in curriculum.ts
    const baseLeaderboard: LeaderboardEntry[] = JSON.parse(JSON.stringify(INITIAL_LEADERBOARD));
    const studentProfile = this.getUserProfile('user');

    try {
      const stored = safeStorage.getItem(STORAGE_KEYS.LEADERBOARD);
      if (stored) {
        const parsed: LeaderboardEntry[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Overlay any intentional saved demo edits onto the sample entries by ID
          baseLeaderboard.forEach((entry) => {
            const match = parsed.find(p => p.id === entry.id);
            if (match) {
              entry.xp = match.xp;
              entry.streak = match.streak;
              entry.badge = match.badge;
              entry.displayName = match.displayName;
              entry.avatar = match.avatar;
              entry.university = match.university;
            }
          });
        }
      }
    } catch {
      // Fallback directly to baseLeaderboard
    }

    // 2. Synchronize current demo student user from their active profile
    const userIndex = baseLeaderboard.findIndex(e => e.isCurrentUser || e.id === 'lb-curr');
    if (userIndex > -1) {
      const isPublic = studentProfile.privacySettings?.isLeaderboardPublic !== false;
      const showAvatar = studentProfile.privacySettings?.showAvatarPublicly !== false;

      baseLeaderboard[userIndex].displayName = isPublic ? studentProfile.displayName : 'Anonymous Scholar';
      baseLeaderboard[userIndex].avatar = showAvatar ? studentProfile.avatar : '';
      baseLeaderboard[userIndex].university = isPublic ? studentProfile.university : 'Confidential Campus';
      baseLeaderboard[userIndex].xp = studentProfile.currentXp;
      baseLeaderboard[userIndex].streak = studentProfile.streakDays;
      baseLeaderboard[userIndex].badge = studentProfile.levelTitle;
      baseLeaderboard[userIndex].isCurrentUser = true;
    }

    // 3. Consistently rank based on XP descending
    baseLeaderboard.sort((a, b) => b.xp - a.xp);
    baseLeaderboard.forEach((entry, idx) => {
      entry.rank = idx + 1;
    });

    return baseLeaderboard;
  }

  private syncCurrentUserToLeaderboard(profile: UserProfile): void {
    const leaderboard = this.getLeaderboard();
    try {
      safeStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(leaderboard));
    } catch {
      // Ignore
    }
  }

  // --- ADMIN LEADERBOARD & XP CONTROLS (Protected by Role Checks) ---
  updateLeaderboardEntry(id: string, updates: Partial<LeaderboardEntry>, role: UserRole): boolean {
    if (role !== 'admin') {
      console.warn('RBAC Violation: Non-admin attempted to update leaderboard entry');
      return false;
    }
    try {
      const current = this.getLeaderboard();
      const target = current.find(e => e.id === id);
      if (!target) return false;

      // If editing demo user, sync to profile
      if (target.isCurrentUser || id === 'lb-curr') {
        const profile = this.getUserProfile();
        if (updates.xp !== undefined) profile.currentXp = Number(updates.xp);
        if (updates.displayName !== undefined) profile.displayName = updates.displayName;
        if (updates.university !== undefined) profile.university = updates.university;
        if (updates.streak !== undefined) profile.streakDays = Number(updates.streak);
        this.saveUserProfile(profile);
      } else {
        const stored = safeStorage.getItem(STORAGE_KEYS.LEADERBOARD);
        const parsed: LeaderboardEntry[] = stored ? JSON.parse(stored) : JSON.parse(JSON.stringify(INITIAL_LEADERBOARD));
        const match = parsed.find(p => p.id === id);
        if (match) {
          Object.assign(match, updates);
        } else {
          parsed.push({ ...target, ...updates });
        }
        safeStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(parsed));
      }
      return true;
    } catch {
      return false;
    }
  }

  // Admin action: Specifically update demo student user's XP without touching Admin profile
  setDemoUserXp(xp: number, role: UserRole, targetRole: UserRole = 'user'): boolean {
    if (role !== 'admin') {
      console.warn('RBAC Violation: Non-admin attempted to alter demo user XP');
      return false;
    }
    const profile = this.getUserProfile(targetRole);
    profile.currentXp = Math.max(0, Number(xp));
    this.saveUserProfile(profile, targetRole);
    return true;
  }

  // --- PRIVACY & DATA RIGHTS (DPDPA 2023 & IT ACT 2000) ---
  updatePrivacySettings(settings: Partial<NonNullable<UserProfile['privacySettings']>>, role?: UserRole): UserProfile {
    const targetRole = role ?? this.getCurrentRole();
    const profile = this.getUserProfile(targetRole);
    profile.privacySettings = {
      ...(profile.privacySettings || {
        isLeaderboardPublic: true,
        showAvatarPublicly: true,
        allowAnalytics: true
      }),
      ...settings
    };
    this.saveUserProfile(profile, targetRole);
    return profile;
  }

  exportUserDataJSON(): string {
    const role = this.getCurrentRole();
    const profile = this.getUserProfile(role);
    const spacedDeck = this.getSpacedRepetitionDeck(role);
    const leaderboard = this.getLeaderboard();
    const userRanking = leaderboard.find(e => e.isCurrentUser || e.id === 'lb-curr');

    const dataExportBundle = {
      exportMetadata: {
        platform: 'FinLingo - Gamified Finance & Commerce Learning',
        activeRole: role,
        statutoryFramework: 'Digital Personal Data Protection Act, 2023 (DPDPA) - Section 11 & IT Act 2000',
        exportedAt: new Date().toISOString(),
        formatVersion: '2.0',
        disclaimer: 'This file contains your complete portable personal learning record, quiz telemetry, and spaced repetition deck stored locally by FinLingo.'
      },
      activeProfile: profile,
      spacedRepetitionDeck: spacedDeck,
      leaderboardRank: userRanking || null,
      clientLocalStorageKeys: [
        STORAGE_KEYS.USER_PROFILE,
        STORAGE_KEYS.ADMIN_PROFILE,
        STORAGE_KEYS.USER_SPACED_REPETITION,
        STORAGE_KEYS.ADMIN_SPACED_REPETITION,
        STORAGE_KEYS.LEADERBOARD,
        STORAGE_KEYS.ROLE,
        STORAGE_KEYS.CUSTOM_LESSONS,
        STORAGE_KEYS.CUSTOM_QUESTIONS,
        STORAGE_KEYS.ADMIN_SETTINGS,
        'finlingo_theme_mode'
      ]
    };

    return JSON.stringify(dataExportBundle, null, 2);
  }

  // --- RESTORE SAMPLE DATA & SAFE PER-PROFILE RESET UTILS ---
  // Resets only the Student User profile, quiz records, and user spaced repetition deck to clean initial state.
  // Admin-managed curriculum, custom questions, and Admin profile remain completely untouched!
  restoreUserProfile(): void {
    try {
      safeStorage.setItem(STORAGE_KEYS.USER_PROGRESS_ZEROED, 'true');
      const zeroedCopy: UserProfile = JSON.parse(JSON.stringify(USER_ZEROED_PROFILE));
      zeroedCopy.displayName = 'Dev Purecha';
      safeStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(zeroedCopy));
      safeStorage.setItem(STORAGE_KEYS.USER_SPACED_REPETITION, '[]');
      safeStorage.removeItem(STORAGE_KEYS.LEGACY_PROFILE);
      safeStorage.removeItem(STORAGE_KEYS.LEGACY_SPACED_REPETITION);

      // Sync leaderboard entry for Dev Purecha
      const currentLeaderboard = this.getLeaderboard();
      const userEntry = currentLeaderboard.find((e) => e.isCurrentUser || e.id === 'lb-curr');
      if (userEntry) {
        userEntry.xp = 0;
        userEntry.streak = 0;
        userEntry.badge = 'Intern Scholar';
        userEntry.displayName = 'Dev Purecha (You)';
      }
      currentLeaderboard.sort((a, b) => b.xp - a.xp);
      currentLeaderboard.forEach((entry, idx) => {
        entry.rank = idx + 1;
      });
      safeStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(currentLeaderboard));
    } catch {
      // Ignore
    }
  }

  // Resets Admin profile, custom lessons, custom questions, and leaderboard overrides.
  // Student Dev Purecha's progress, XP, quiz history, achievements, and streaks remain completely untouched!
  restoreAdminData(): void {
    try {
      const adminDefault: UserProfile = JSON.parse(JSON.stringify(ADMIN_DEFAULT_PROFILE));
      adminDefault.displayName = 'Prof. Dr. Anjali Sane';
      safeStorage.setItem(STORAGE_KEYS.ADMIN_PROFILE, JSON.stringify(adminDefault));
      safeStorage.removeItem(STORAGE_KEYS.ADMIN_SPACED_REPETITION);
      safeStorage.removeItem(STORAGE_KEYS.CUSTOM_LESSONS);
      safeStorage.removeItem(STORAGE_KEYS.CUSTOM_QUESTIONS);
      safeStorage.removeItem(STORAGE_KEYS.ADMIN_SETTINGS);
      safeStorage.removeItem(STORAGE_KEYS.LEADERBOARD);
    } catch {
      // Ignore
    }
  }

  // Safe reset router: when called with 'user', resets User; with 'admin', resets Admin.
  restoreDefaultData(target?: 'user' | 'admin' | 'all'): void {
    const roleTarget = target ?? this.getCurrentRole();
    if (roleTarget === 'user') {
      this.restoreUserProfile();
    } else if (roleTarget === 'admin') {
      this.restoreAdminData();
    } else if (roleTarget === 'all') {
      this.restoreUserProfile();
      this.restoreAdminData();
    }
  }

  // --- REQUIREMENT 7: ADMIN-ONLY RESET USER PROGRESS ---
  // Completely resets Dev Purecha's XP to 0, Level to 1, Streak to 0,
  // Clears completed lessons, resets quiz telemetry, and relocks achievements.
  // Preserves curriculum, questions, lessons, Admin settings and content.
  // Ensures NO default XP or sample progress is restored after refresh or login.
  resetUserProgress(role: UserRole): boolean {
    if (role !== 'admin') {
      console.warn('RBAC Violation: Non-admin attempted to reset user progress');
      return false;
    }

    try {
      // 1. Mark user progress as zeroed persistently
      safeStorage.setItem(STORAGE_KEYS.USER_PROGRESS_ZEROED, 'true');

      // 2. Clone pristine zeroed profile and ensure display name is Dev Purecha
      const zeroedCopy: UserProfile = JSON.parse(JSON.stringify(USER_ZEROED_PROFILE));
      zeroedCopy.displayName = 'Dev Purecha';
      safeStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(zeroedCopy));

      // 3. Clear user-specific spaced repetition deck (0 items due)
      safeStorage.setItem(STORAGE_KEYS.USER_SPACED_REPETITION, '[]');

      // 4. Remove any legacy user profile or spaced repetition keys
      safeStorage.removeItem(STORAGE_KEYS.LEGACY_PROFILE);
      safeStorage.removeItem(STORAGE_KEYS.LEGACY_SPACED_REPETITION);

      // 5. Update user ranking in leaderboard: 0 XP, 0 streak, Level 1 Intern Scholar
      const currentLeaderboard = this.getLeaderboard();
      const userEntry = currentLeaderboard.find((e) => e.isCurrentUser || e.id === 'lb-curr');
      if (userEntry) {
        userEntry.xp = 0;
        userEntry.streak = 0;
        userEntry.badge = 'Intern Scholar';
        userEntry.displayName = 'Dev Purecha (You)';
      }
      currentLeaderboard.sort((a, b) => b.xp - a.xp);
      currentLeaderboard.forEach((entry, idx) => {
        entry.rank = idx + 1;
      });
      safeStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(currentLeaderboard));

      return true;
    } catch (e) {
      console.error('Error during resetUserProgress:', e);
      return false;
    }
  }

  isUserProgressZeroed(): boolean {
    return safeStorage.getItem(STORAGE_KEYS.USER_PROGRESS_ZEROED) === 'true';
  }

  resetAllData(): void {
    this.restoreUserProfile();
    this.restoreAdminData();
  }
}

export const dataService = new DataService();
