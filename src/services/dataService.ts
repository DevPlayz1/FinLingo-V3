import {
  UserProfile,
  SpacedRepetitionItem,
  LeaderboardEntry,
  TrackId,
  Lesson,
  QuizQuestion,
  LearningTrack
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
  LEADERBOARD: 'finlingo_leaderboard_v1'
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
  // --- TRACKS & LESSONS (Curriculum Repository) ---
  getTracks(): LearningTrack[] {
    return LEARNING_TRACKS;
  }

  getTrack(trackId: TrackId): LearningTrack | undefined {
    return LEARNING_TRACKS.find(t => t.id === trackId);
  }

  getLessons(): Lesson[] {
    return LESSONS;
  }

  getLessonsByTrack(trackId: TrackId): Lesson[] {
    return LESSONS.filter(l => l.trackId === trackId).sort((a, b) => a.order - b.order);
  }

  getLesson(lessonId: string): Lesson | undefined {
    return LESSONS.find(l => l.id === lessonId);
  }

  getQuestionsByLesson(lessonId: string): QuizQuestion[] {
    return QUIZ_QUESTIONS.filter(q => q.lessonId === lessonId);
  }

  getQuestionsByTrack(trackId: TrackId): QuizQuestion[] {
    return QUIZ_QUESTIONS.filter(q => q.trackId === trackId);
  }

  // --- USER PROFILE REPOSITORY (Designed for Firebase Auth & Firestore) ---
  getUserProfile(): UserProfile {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PROFILE);
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
    return DEFAULT_PROFILE;
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
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
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
      const stored = localStorage.getItem(STORAGE_KEYS.SPACED_REPETITION);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback
    }
    return DEFAULT_SPACED_REPETITION;
  }

  saveSpacedRepetitionDeck(deck: SpacedRepetitionItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SPACED_REPETITION, JSON.stringify(deck));
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

  // --- LEADERBOARD REPOSITORY ---
  getLeaderboard(): LeaderboardEntry[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LEADERBOARD);
      if (stored) {
        const parsed: LeaderboardEntry[] = JSON.parse(stored);
        parsed.forEach((e) => {
          if (e.displayName === 'Alex Morgan') {
            e.displayName = 'You (Student Scholar)';
          }
        });
        return parsed;
      }
    } catch {
      // Fallback
    }
    return INITIAL_LEADERBOARD;
  }

  private syncCurrentUserToLeaderboard(profile: UserProfile): void {
    const leaderboard = this.getLeaderboard();
    const userIndex = leaderboard.findIndex(e => e.isCurrentUser || e.id === 'lb-curr');
    if (userIndex > -1) {
      const isPublic = profile.privacySettings?.isLeaderboardPublic !== false;
      const showAvatar = profile.privacySettings?.showAvatarPublicly !== false;

      leaderboard[userIndex].displayName = isPublic ? profile.displayName : 'Anonymous Scholar';
      leaderboard[userIndex].avatar = showAvatar ? profile.avatar : '';
      leaderboard[userIndex].university = isPublic ? profile.university : 'Confidential Campus';
      leaderboard[userIndex].xp = profile.currentXp;
      leaderboard[userIndex].streak = profile.streakDays;
      leaderboard[userIndex].badge = profile.levelTitle;
    }

    // Re-rank based on XP
    leaderboard.sort((a, b) => b.xp - a.xp);
    leaderboard.forEach((entry, idx) => {
      entry.rank = idx + 1;
    });

    try {
      localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(leaderboard));
    } catch {
      // Ignore
    }
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
        'finlingo_theme_mode'
      ]
    };

    return JSON.stringify(dataExportBundle, null, 2);
  }

  // --- RESET & DEMO UTILS ---
  resetAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.SPACED_REPETITION);
    localStorage.removeItem(STORAGE_KEYS.LEADERBOARD);
  }
}

export const dataService = new DataService();
