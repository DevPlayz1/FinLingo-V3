export type TrackId = 'accounting' | 'economics' | 'finance';

export interface LearningTrack {
  id: TrackId;
  title: string;
  shortDescription: string;
  detailedDescription: string;
  iconName: string;
  themeColor: string; // Tailwind color class key e.g. 'blue', 'emerald', 'indigo'
  bgGradient: string;
  modulesCount: number;
  totalLessons: number;
  totalQuestions: number;
  targetCareer: string;
}

export interface Lesson {
  id: string;
  trackId: TrackId;
  moduleId: string;
  moduleTitle: string;
  order: number;
  title: string;
  term: string;
  shortDefinition: string;
  detailedExplanation: string;
  formula?: string;
  realWorldExample: {
    companyOrContext: string;
    description: string;
    keyMetric?: string;
  };
  proTip: string;
  commonMisconception?: string;
  keyTakeaways: string[];
  estimatedMinutes: number;
  xpValue: number;
}

export interface QuizQuestion {
  id: string;
  lessonId: string;
  trackId: TrackId;
  prompt: string;
  scenario?: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  xpPoints: number;
  topicTag: string;
}

export interface SpacedRepetitionItem {
  id: string; // usually questionId
  questionId: string;
  lessonId: string;
  trackId: TrackId;
  prompt: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  repetitionLevel: number; // 0: new mistake, 1: 1 day, 2: 3 days, 3: mastered
  lastReviewedAt: number;
  nextReviewAt: number;
  mistakeCount: number;
  successfulStreak: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: number;
  isUnlocked: boolean;
  category: 'streak' | 'xp' | 'accuracy' | 'mastery';
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  avatar: string;
  photoStoragePath?: string;
  photoUpdatedAt?: number;
  university: string;
  major: string;
  graduationYear: string;
  level: number;
  levelTitle: string;
  currentXp: number;
  nextLevelXp: number;
  streakDays: number;
  lastActiveDate: string; // YYYY-MM-DD
  completedLessonIds: string[];
  bookmarkedLessonIds: string[];
  quizStats: {
    totalAnswered: number;
    totalCorrect: number;
    perfectQuizzesCount: number;
  };
  trackProgress: {
    accounting: number; // percentage 0-100
    economics: number;
    finance: number;
  };
  achievements: Achievement[];
  privacySettings?: {
    isLeaderboardPublic: boolean;
    showAvatarPublicly: boolean;
    allowAnalytics: boolean;
  };
  consentRecord?: ConsentRecord;
}

export interface ConsentRecord {
  termsAccepted: boolean;
  termsVersion: string;
  privacyNoticeAcknowledged: boolean;
  privacyVersion: string;
  timestamp: string; // ISO 8601 string
  marketingOptIn: boolean; // separate and non-bundled
  ageConfirmed18OrWithGuardian: boolean;
}

export interface LeaderboardEntry {
  id: string;
  rank: number;
  displayName: string;
  avatar: string;
  university: string;
  xp: number;
  streak: number;
  badge: string;
  league: string;
  isCurrentUser: boolean;
}

export type ActiveTab = 'dashboard' | 'tracks' | 'practice' | 'leaderboard' | 'profile' | 'legal';

export type LegalDocId =
  | 'privacy'
  | 'terms'
  | 'security'
  | 'cookies'
  | 'deletion'
  | 'community'
  | 'disclaimer'
  | 'grievance'
  | 'internal-security'
  | 'data-rights';
