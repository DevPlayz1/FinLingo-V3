import {
  UserProfile,
  SpacedRepetitionItem,
  LeaderboardEntry,
  TrackId,
  Lesson,
  QuizQuestion,
  LearningTrack,
  UserRole
} from '../types';
import {
  LEARNING_TRACKS,
  LESSONS,
  QUIZ_QUESTIONS,
  INITIAL_ACHIEVEMENTS,
  INITIAL_LEADERBOARD
} from '../data/curriculum';
import { getLevelInfo } from './gamification';

const STORAGE_KEYS = {
  PROFILE: 'finlingo_user_profile_v1',
  SPACED_REPETITION: 'finlingo_spaced_rep_v1',
  LEADERBOARD: 'finlingo_leaderboard_v1',
  ROLE: 'finlingo_demo_role_v1',
  CUSTOM_LESSONS: 'finlingo_custom_lessons_v1',
  CUSTOM_QUESTIONS: 'finlingo_custom_questions_v1'
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

const DEFAULT_PROFILE: UserProfile = {
  uid: 'student_user_001',
  displayName: 'Student Scholar',
  email: 'scholar@university.edu',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
  university: 'Columbia Business School',
  major: 'Commerce & Quantitative Finance',
  graduationYear: '2026',
  level: 2,
  levelTitle: 'Junior Analyst',
  currentXp: 420,
  nextLevelXp: 500,
  streakDays: 3,
  lastActiveDate: new Date().toISOString().split('T')[0],
  completedLessonIds: ['acc-1', 'eco-1'],
  bookmarkedLessonIds: ['fin-1'],
  quizStats: {
    totalAnswered: 8,
    totalCorrect: 7,
    perfectQuizzesCount: 1
  },
  trackProgress: {
    accounting: 33,
    economics: 33,
    finance: 0
  },
  achievements: INITIAL_ACHIEVEMENTS,
  privacySettings: {
    isLeaderboardPublic: true,
    showAvatarPublicly: true,
    allowAnalytics: true
  }
};

// Seed 2 default spaced repetition items for demonstration so the user sees the feature right away!
const DEFAULT_SPACED_REPETITION: SpacedRepetitionItem[] = [
  {
    id: 'sr-eco-2-1',
    questionId: 'q-eco-2-1',
    lessonId: 'eco-2',
    trackId: 'economics',
    prompt: 'A specialty coffee shop raises its latte price by 10%, causing the quantity sold to drop by 25%. What is the price elasticity of demand (PED)?',
    options: ['0.4 (Inelastic)', '2.5 (Elastic)', '1.0 (Unit Elastic)', '-0.4 (Perfect Inelastic)'],
    correctOptionIndex: 1,
    explanation: 'PED = |% change in quantity / % change in price| = 25% / 10% = 2.5. Because PED > 1, demand is elastic.',
    repetitionLevel: 1,
    lastReviewedAt: Date.now() - 86400000,
    nextReviewAt: Date.now(),
    mistakeCount: 1,
    successfulStreak: 1
  },
  {
    id: 'sr-acc-2-2',
    questionId: 'q-acc-2-2',
    lessonId: 'acc-2',
    trackId: 'accounting',
    prompt: 'Why is "Unearned / Deferred Revenue" classified as a Liability rather than Equity or Revenue?',
    options: [
      'Because it represents cash the business owes back to the government in taxes',
      'Because the company has received cash but has not yet delivered the promised service or good',
      'Because it reduces the company’s accounts receivable balance',
      'Because it is an intangible asset that has been amortized'
    ],
    correctOptionIndex: 1,
    explanation: 'The company received cash upfront but owes delivery of goods/services before recognizing income.',
    repetitionLevel: 0,
    lastReviewedAt: Date.now() - 3600000,
    nextReviewAt: Date.now(),
    mistakeCount: 2,
    successfulStreak: 0
  }
];

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

  // --- USER PROFILE REPOSITORY (Designed for Firebase Auth & Firestore) ---
  getUserProfile(): UserProfile {
    try {
      const stored = safeStorage.getItem(STORAGE_KEYS.PROFILE);
      if (stored) {
        const parsed: UserProfile = JSON.parse(stored);
        if (parsed.displayName === 'Alex Morgan' || !parsed.displayName) {
          parsed.displayName = 'Student Scholar';
          parsed.email = 'scholar@university.edu';
        }
        if (!parsed.privacySettings) {
          parsed.privacySettings = {
            isLeaderboardPublic: true,
            showAvatarPublicly: true,
            allowAnalytics: true
          };
        }
        // Refresh level info based on currentXp
        const lvl = getLevelInfo(parsed.currentXp);
        parsed.level = lvl.level;
        parsed.levelTitle = lvl.title;
        parsed.nextLevelXp = lvl.maxXp;
        return parsed;
      }
    } catch {
      // Fallback
    }
    return JSON.parse(JSON.stringify(DEFAULT_PROFILE));
  }

  saveUserProfile(profile: UserProfile): void {
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

    try {
      safeStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch {
      // Ignore write errors
    }

    // Keep current user in leaderboard synced
    this.syncCurrentUserToLeaderboard(profile);
  }

  addXp(amount: number): UserProfile {
    const profile = this.getUserProfile();
    profile.currentXp += amount;
    this.saveUserProfile(profile);
    return profile;
  }

  completeLesson(lessonId: string, xpReward: number): UserProfile {
    const profile = this.getUserProfile();
    if (!profile.completedLessonIds.includes(lessonId)) {
      profile.completedLessonIds.push(lessonId);
      profile.currentXp += xpReward;

      // Unlock first achievement
      const ach1 = profile.achievements.find(a => a.id === 'ach-1');
      if (ach1 && !ach1.isUnlocked) {
        ach1.isUnlocked = true;
      }
    }
    this.saveUserProfile(profile);
    return profile;
  }

  recordQuizResults(
    answeredCount: number,
    correctCount: number,
    earnedXp: number,
    isPerfect: boolean
  ): UserProfile {
    const profile = this.getUserProfile();
    profile.quizStats.totalAnswered += answeredCount;
    profile.quizStats.totalCorrect += correctCount;
    if (isPerfect) {
      profile.quizStats.perfectQuizzesCount += 1;
      const perfectAch = profile.achievements.find(a => a.id === 'ach-4');
      if (perfectAch) perfectAch.isUnlocked = true;
    }

    profile.currentXp += earnedXp;

    // Check Wall Street Analyst achievement (500+ XP)
    if (profile.currentXp >= 500) {
      const ach3 = profile.achievements.find(a => a.id === 'ach-3');
      if (ach3) ach3.isUnlocked = true;
    }

    this.saveUserProfile(profile);
    return profile;
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

  // --- SPACED REPETITION ENGINE ---
  getSpacedRepetitionDeck(): SpacedRepetitionItem[] {
    try {
      const stored = safeStorage.getItem(STORAGE_KEYS.SPACED_REPETITION);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback
    }
    return JSON.parse(JSON.stringify(DEFAULT_SPACED_REPETITION));
  }

  saveSpacedRepetitionDeck(deck: SpacedRepetitionItem[]): void {
    try {
      safeStorage.setItem(STORAGE_KEYS.SPACED_REPETITION, JSON.stringify(deck));
    } catch {
      // Ignore
    }
  }

  enqueueSpacedRepetition(question: QuizQuestion): void {
    const deck = this.getSpacedRepetitionDeck();
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

    this.saveSpacedRepetitionDeck(deck);
  }

  advanceSpacedRepetition(itemId: string, correct: boolean): { item: SpacedRepetitionItem; isMastered: boolean } | null {
    const deck = this.getSpacedRepetitionDeck();
    const item = deck.find(i => i.id === itemId);
    if (!item) return null;

    let isMastered = false;
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
    } else {
      item.mistakeCount += 1;
      item.repetitionLevel = 0;
      item.successfulStreak = 0;
      item.lastReviewedAt = Date.now();
      item.nextReviewAt = Date.now(); // immediate review needed
    }

    this.saveSpacedRepetitionDeck(deck);
    return { item, isMastered };
  }

  removeSpacedRepetitionItem(itemId: string): void {
    const deck = this.getSpacedRepetitionDeck().filter(i => i.id !== itemId);
    this.saveSpacedRepetitionDeck(deck);
  }

  // --- LEADERBOARD REPOSITORY (Canonical Sample Dataset as Single Source of Truth) ---
  getLeaderboard(): LeaderboardEntry[] {
    // 1. Always start from a deep clone of the canonical sample dataset in curriculum.ts
    const baseLeaderboard: LeaderboardEntry[] = JSON.parse(JSON.stringify(INITIAL_LEADERBOARD));
    const currentProfile = this.getUserProfile();

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

    // 2. Synchronize current demo user from their active profile
    const userIndex = baseLeaderboard.findIndex(e => e.isCurrentUser || e.id === 'lb-curr');
    if (userIndex > -1) {
      const isPublic = currentProfile.privacySettings?.isLeaderboardPublic !== false;
      const showAvatar = currentProfile.privacySettings?.showAvatarPublicly !== false;

      baseLeaderboard[userIndex].displayName = isPublic ? currentProfile.displayName : 'Anonymous Scholar';
      baseLeaderboard[userIndex].avatar = showAvatar ? currentProfile.avatar : '';
      baseLeaderboard[userIndex].university = isPublic ? currentProfile.university : 'Confidential Campus';
      baseLeaderboard[userIndex].xp = currentProfile.currentXp;
      baseLeaderboard[userIndex].streak = currentProfile.streakDays;
      baseLeaderboard[userIndex].badge = currentProfile.levelTitle;
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

  setDemoUserXp(xp: number, role: UserRole): boolean {
    if (role !== 'admin') {
      console.warn('RBAC Violation: Non-admin attempted to alter demo user XP');
      return false;
    }
    const profile = this.getUserProfile();
    profile.currentXp = Math.max(0, Number(xp));
    this.saveUserProfile(profile);
    return true;
  }

  // --- PRIVACY & DATA RIGHTS (DPDPA 2023 & IT ACT 2000) ---
  updatePrivacySettings(settings: Partial<NonNullable<UserProfile['privacySettings']>>): UserProfile {
    const profile = this.getUserProfile();
    profile.privacySettings = {
      ...(profile.privacySettings || {
        isLeaderboardPublic: true,
        showAvatarPublicly: true,
        allowAnalytics: true
      }),
      ...settings
    };
    this.saveUserProfile(profile);
    return profile;
  }

  exportUserDataJSON(): string {
    const profile = this.getUserProfile();
    const spacedDeck = this.getSpacedRepetitionDeck();
    const leaderboard = this.getLeaderboard();
    const userRanking = leaderboard.find(e => e.isCurrentUser || e.id === 'lb-curr');

    const dataExportBundle = {
      exportMetadata: {
        platform: 'FinLingo - Gamified Finance & Commerce Learning',
        statutoryFramework: 'Digital Personal Data Protection Act, 2023 (DPDPA) - Section 11 & IT Act 2000',
        exportedAt: new Date().toISOString(),
        formatVersion: '1.0',
        disclaimer: 'This file contains your complete portable personal learning record, quiz telemetry, and spaced repetition deck stored locally by FinLingo.'
      },
      userProfile: profile,
      spacedRepetitionDeck: spacedDeck,
      leaderboardRank: userRanking || null,
      clientLocalStorageKeys: [
        STORAGE_KEYS.PROFILE,
        STORAGE_KEYS.SPACED_REPETITION,
        STORAGE_KEYS.LEADERBOARD,
        STORAGE_KEYS.ROLE,
        STORAGE_KEYS.CUSTOM_LESSONS,
        STORAGE_KEYS.CUSTOM_QUESTIONS,
        'finlingo_theme_mode'
      ]
    };

    return JSON.stringify(dataExportBundle, null, 2);
  }

  // --- RESTORE SAMPLE DATA & RESET UTILS ---
  restoreDefaultData(): void {
    try {
      safeStorage.removeItem(STORAGE_KEYS.PROFILE);
      safeStorage.removeItem(STORAGE_KEYS.SPACED_REPETITION);
      safeStorage.removeItem(STORAGE_KEYS.LEADERBOARD);
      safeStorage.removeItem(STORAGE_KEYS.CUSTOM_LESSONS);
      safeStorage.removeItem(STORAGE_KEYS.CUSTOM_QUESTIONS);
    } catch {
      // Ignore
    }
  }

  resetAllData(): void {
    this.restoreDefaultData();
  }
}

export const dataService = new DataService();
