import React from 'react';
import {
  Flame,
  Award,
  Sparkles,
  Brain,
  ArrowRight,
  TrendingUp,
  Receipt,
  PieChart,
  Clock,
  Target,
  GraduationCap,
  ChevronRight,
  Lightbulb,
  Compass
} from 'lucide-react';
import { UserProfile, LearningTrack, Lesson, ActiveTab, LeaderboardEntry } from '../types';
import { calculateLevelProgress, LEVEL_TIERS } from '../services/gamification';
import { UserAvatar } from './UserAvatar';

interface DashboardViewProps {
  userProfile: UserProfile;
  tracks: LearningTrack[];
  lessons: Lesson[];
  spacedRepetitionDueCount: number;
  leaderboard?: LeaderboardEntry[];
  onSelectTrack: (trackId: string) => void;
  onOpenLesson: (lesson: Lesson) => void;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenPractice: () => void;
  isDarkMode?: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  userProfile,
  tracks,
  lessons,
  spacedRepetitionDueCount,
  leaderboard = [],
  onSelectTrack,
  onOpenLesson,
  setActiveTab,
  onOpenPractice,
  isDarkMode = false
}) => {
  const levelProgress = calculateLevelProgress(userProfile.currentXp);
  const nextTier =
    LEVEL_TIERS.find((t) => t.level === userProfile.level + 1) ||
    LEVEL_TIERS[LEVEL_TIERS.length - 1];

  // Next recommended lesson from curriculum
  const nextRecommendedLesson =
    lessons.find((l) => !userProfile.completedLessonIds.includes(l.id)) || lessons[0];

  // Daily spotlight concept
  const dailySpotlightLesson = lessons[1] || lessons[0];

  const getTrackIcon = (iconName: string) => {
    switch (iconName) {
      case 'Receipt':
        return <Receipt className="w-5 h-5 text-[#F07856]" />;
      case 'TrendingUp':
        return <TrendingUp className="w-5 h-5 text-[#F07856]" />;
      case 'PieChart':
      default:
        return <PieChart className="w-5 h-5 text-[#F07856]" />;
    }
  };

  const accuracy =
    userProfile.quizStats.totalAnswered > 0
      ? Math.round(
          (userProfile.quizStats.totalCorrect / userProfile.quizStats.totalAnswered) * 100
        )
      : 100;

  // Daily XP Goal Calculation (e.g. 100 XP daily goal)
  const dailyXpGoal = 100;
  const todayEstimatedXp = Math.min(
    dailyXpGoal,
    ((userProfile.completedLessonIds.length * 40) % dailyXpGoal) + 40
  );
  const dailyGoalPercent = Math.min(100, Math.round((todayEstimatedXp / dailyXpGoal) * 100));

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Welcoming Educational Hero Banner */}
      <div
        className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 lg:p-10 shadow-lg border transition-colors ${
          isDarkMode
            ? 'bg-[#132238] border-[#1E3A5F] text-[#FFF8ED]'
            : 'bg-[#173B63] border-[#173B63]/40 text-white'
        }`}
      >
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-[#F07856]/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/3 -mb-16 w-64 h-64 rounded-full bg-[#E8F0F8]/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            {/* Student Avatar + Greeting */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveTab('profile')}
                className="group relative cursor-pointer"
                title="View & Edit Student Profile"
              >
                <UserAvatar
                  src={userProfile.avatar}
                  name={userProfile.displayName}
                  size="xl"
                  levelBadge={userProfile.level}
                  ringClassName="ring-4 ring-[#F07856]/40 shadow-md group-hover:scale-105 transition-transform"
                />
              </button>

              <div className="space-y-1">
                <div
                  className={`inline-flex items-center gap-2 px-3 py-0.5 rounded-full text-xs font-semibold border ${
                    isDarkMode
                      ? 'bg-[#1E3A5F] border-[#1E3A5F] text-[#E8F0F8]'
                      : 'bg-white/10 border-white/20 text-[#FFF8ED]'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5 text-[#F07856]" />
                  <span>{userProfile.university}</span>
                  <span className="text-[#F07856]">•</span>
                  <span>{userProfile.major}</span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#FFF8ED]">
                  Welcome back, <span className="text-[#F07856]">{userProfile.displayName}</span>
                </h1>
              </div>
            </div>

            <p className="text-[#E8F0F8] text-sm sm:text-base leading-relaxed">
              Build lasting mastery across financial statements, micro &amp; macro economic drivers, and corporate valuation through interactive retrieval and spaced repetition.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onOpenLesson(nextRecommendedLesson)}
                className="px-5 py-2.5 rounded-xl bg-[#F07856] hover:bg-[#D95D3B] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#F07856]/30 transition-all flex items-center gap-2"
              >
                <span>Resume Learning</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveTab('tracks')}
                className={`px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm border transition-all ${
                  isDarkMode
                    ? 'bg-[#1E3A5F] hover:bg-[#1E3A5F]/80 text-[#FFF8ED] border-[#1E3A5F]'
                    : 'bg-white/15 hover:bg-white/25 text-[#FFF8ED] border-white/20'
                }`}
              >
                Browse All Curriculum
              </button>
            </div>
          </div>

          {/* Level Progression Card */}
          <div
            className={`w-full lg:w-80 p-5 rounded-2xl border shrink-0 shadow-inner ${
              isDarkMode
                ? 'bg-[#0B192C] border-[#1E3A5F] text-[#FFF8ED]'
                : 'bg-white/10 backdrop-blur-md border-white/20 text-white'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-semibold text-[#E8F0F8] mb-2">
              <span className="flex items-center gap-1.5 font-bold text-[#FFF8ED]">
                <Award className="w-4 h-4 text-[#F07856]" />
                Level {userProfile.level}: {userProfile.levelTitle}
              </span>
              <span className="text-[#F07856] font-extrabold">{levelProgress.percent}%</span>
            </div>

            {/* Progress Bar in Coral Orange */}
            <div className="w-full bg-[#0B192C] h-3 rounded-full overflow-hidden p-0.5 border border-white/15">
              <div
                className="bg-[#F07856] h-full rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${levelProgress.percent}%` }}
              />
            </div>

            <div className="mt-2.5 text-[11px] text-[#E8F0F8] flex items-center justify-between">
              <span>{userProfile.currentXp} XP Total</span>
              {levelProgress.neededXp > 0 ? (
                <span>
                  <strong className="text-[#FFF8ED]">{levelProgress.neededXp} XP</strong> to{' '}
                  {nextTier.title}
                </span>
              ) : (
                <span className="text-[#F07856] font-bold">Max Tier Reached</span>
              )}
            </div>

            {/* Daily Goal Mini Meter */}
            <div className="mt-4 pt-3 border-t border-white/15 text-[11px] flex items-center justify-between text-[#E8F0F8]">
              <span className="flex items-center gap-1">
                <Target className="w-3.5 h-3.5 text-[#F07856]" />
                <span>Daily Study Goal</span>
              </span>
              <span className="font-bold text-[#FFF8ED]">{dailyGoalPercent}% completed</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Core Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total XP */}
        <div
          className={`p-5 rounded-2xl border shadow-xs transition-colors ${
            isDarkMode
              ? 'bg-[#132238] border-[#1E3A5F] hover:border-[#F07856]/40'
              : 'bg-white border-[#E8F0F8] hover:border-[#173B63]/30'
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-xs font-bold uppercase tracking-wider ${
                isDarkMode ? 'text-[#E8F0F8]/70' : 'text-[#263238]/70'
              }`}
            >
              Experience Points
            </span>
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isDarkMode ? 'bg-[#1E3A5F] text-[#FFF8ED]' : 'bg-[#E8F0F8] text-[#173B63]'
              }`}
            >
              <Award className="w-4 h-4 text-[#F07856]" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span
              className={`text-2xl sm:text-3xl font-extrabold ${
                isDarkMode ? 'text-[#FFF8ED]' : 'text-[#173B63]'
              }`}
            >
              {userProfile.currentXp}
            </span>
            <span className="text-xs font-bold text-[#F07856]">XP</span>
          </div>
          <p
            className={`mt-1 text-xs ${
              isDarkMode ? 'text-[#E8F0F8]/60' : 'text-[#263238]/70'
            }`}
          >
            Earned via lessons &amp; quizzes
          </p>
        </div>

        {/* Study Streak */}
        <div
          className={`p-5 rounded-2xl border shadow-xs transition-colors ${
            isDarkMode
              ? 'bg-[#132238] border-[#1E3A5F] hover:border-[#F07856]/40'
              : 'bg-white border-[#E8F0F8] hover:border-[#F07856]/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-xs font-bold uppercase tracking-wider ${
                isDarkMode ? 'text-[#E8F0F8]/70' : 'text-[#263238]/70'
              }`}
            >
              Study Streak
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#FCE5DC] text-[#F07856] flex items-center justify-center">
              <Flame className="w-4 h-4 fill-[#F07856]" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span
              className={`text-2xl sm:text-3xl font-extrabold ${
                isDarkMode ? 'text-[#FFF8ED]' : 'text-[#173B63]'
              }`}
            >
              {userProfile.streakDays}
            </span>
            <span className="text-xs font-bold text-[#F07856]">Days Active</span>
          </div>
          <p
            className={`mt-1 text-xs ${
              isDarkMode ? 'text-[#E8F0F8]/60' : 'text-[#263238]/70'
            }`}
          >
            Review today to sustain streak
          </p>
        </div>

        {/* Accuracy */}
        <div
          className={`p-5 rounded-2xl border shadow-xs transition-colors ${
            isDarkMode
              ? 'bg-[#132238] border-[#1E3A5F] hover:border-[#F07856]/40'
              : 'bg-white border-[#E8F0F8] hover:border-[#173B63]/30'
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-xs font-bold uppercase tracking-wider ${
                isDarkMode ? 'text-[#E8F0F8]/70' : 'text-[#263238]/70'
              }`}
            >
              Quiz Accuracy
            </span>
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isDarkMode ? 'bg-[#1E3A5F] text-[#FFF8ED]' : 'bg-[#E8F0F8] text-[#173B63]'
              }`}
            >
              <Target className="w-4 h-4 text-[#173B63] dark:text-[#F07856]" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span
              className={`text-2xl sm:text-3xl font-extrabold ${
                isDarkMode ? 'text-[#FFF8ED]' : 'text-[#173B63]'
              }`}
            >
              {accuracy}%
            </span>
            <span
              className={`text-xs font-semibold ${
                isDarkMode ? 'text-[#E8F0F8]/70' : 'text-[#263238]/70'
              }`}
            >
              ({userProfile.quizStats.totalCorrect}/{userProfile.quizStats.totalAnswered})
            </span>
          </div>
          <p
            className={`mt-1 text-xs ${
              isDarkMode ? 'text-[#E8F0F8]/60' : 'text-[#263238]/70'
            }`}
          >
            {userProfile.quizStats.perfectQuizzesCount} perfect score sessions
          </p>
        </div>

        {/* Spaced Repetition Due Card */}
        <button
          onClick={onOpenPractice}
          className={`p-5 rounded-2xl border shadow-xs text-left transition group focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#F07856] ${
            isDarkMode
              ? 'bg-[#132238] border-[#1E3A5F] hover:border-[#F07856]'
              : 'bg-white border-[#E8F0F8] hover:border-[#F07856]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-xs font-bold uppercase tracking-wider ${
                isDarkMode ? 'text-[#E8F0F8]/70' : 'text-[#263238]/70'
              }`}
            >
              Spaced Review
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#FCE5DC] text-[#F07856] flex items-center justify-center group-hover:scale-105 transition">
              <Brain className="w-4 h-4 text-[#F07856]" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span
              className={`text-2xl sm:text-3xl font-extrabold ${
                isDarkMode ? 'text-[#FFF8ED]' : 'text-[#173B63]'
              }`}
            >
              {spacedRepetitionDueCount}
            </span>
            <span className="text-xs font-bold text-[#F07856]">Due for Review</span>
          </div>
          <p className="mt-1 text-xs text-[#F07856] font-semibold flex items-center gap-1">
            <span>Reinforce memory now</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition" />
          </p>
        </button>
      </div>

      {/* Spaced Repetition Callout Banner */}
      {spacedRepetitionDueCount > 0 && (
        <div
          className={`p-5 sm:p-6 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors ${
            isDarkMode
              ? 'bg-[#1E3A5F]/70 border-[#1E3A5F] text-[#FFF8ED]'
              : 'bg-[#E8F0F8] border-[#173B63]/20'
          }`}
        >
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-[#173B63] text-white flex items-center justify-center shrink-0 shadow-sm">
              <Brain className="w-5 h-5 text-[#F07856]" />
            </div>
            <div>
              <h3
                className={`font-extrabold text-base ${
                  isDarkMode ? 'text-[#FFF8ED]' : 'text-[#173B63]'
                }`}
              >
                Spaced Repetition: {spacedRepetitionDueCount} Question
                {spacedRepetitionDueCount > 1 ? 's' : ''} Ready for Memory Reinforcement
              </h3>
              <p
                className={`text-xs sm:text-sm mt-0.5 leading-relaxed ${
                  isDarkMode ? 'text-[#E8F0F8]/80' : 'text-[#263238]'
                }`}
              >
                Reviewing questions you previously missed strengthens cognitive neural pathways and prevents exam cram decay.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenPractice}
            className="px-5 py-2.5 rounded-xl bg-[#F07856] hover:bg-[#D95D3B] text-white text-xs sm:text-sm font-bold shadow-sm shadow-[#F07856]/25 shrink-0 flex items-center gap-2 transition"
          >
            <span>Review Missed Concepts</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Continue Learning & Concept Spotlight Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Continue Learning (2 cols) */}
        <div
          className={`lg:col-span-2 p-6 rounded-2xl border shadow-xs flex flex-col justify-between transition-colors ${
            isDarkMode
              ? 'bg-[#132238] border-[#1E3A5F]'
              : 'bg-white border-[#E8F0F8]'
          }`}
        >
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-[#F07856] mb-2">
              <span className="uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-[#F07856]" />
                Next Up in Curriculum
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#FCE5DC] text-[#F07856] font-extrabold border border-[#F07856]/30">
                +{nextRecommendedLesson.xpValue} XP
              </span>
            </div>

            <h3
              className={`text-xl sm:text-2xl font-extrabold ${
                isDarkMode ? 'text-[#FFF8ED]' : 'text-[#173B63]'
              }`}
            >
              {nextRecommendedLesson.title}
            </h3>

            <p
              className={`mt-2 text-sm leading-relaxed ${
                isDarkMode ? 'text-[#E8F0F8]/80' : 'text-[#263238]'
              }`}
            >
              {nextRecommendedLesson.shortDefinition}
            </p>

            <div
              className={`mt-4 p-4 rounded-xl border flex items-center gap-3 text-xs ${
                isDarkMode
                  ? 'bg-[#0B192C] border-[#1E3A5F] text-[#FFF8ED]'
                  : 'bg-[#FFF8ED] border-[#FCE5DC] text-[#263238]'
              }`}
            >
              <Lightbulb className="w-4 h-4 text-[#F07856] shrink-0" />
              <div>
                <strong className={isDarkMode ? 'text-[#FFF8ED]' : 'text-[#173B63]'}>
                  Core Financial Term:{' '}
                </strong>
                <span className="font-medium">{nextRecommendedLesson.term}</span>
              </div>
            </div>
          </div>

          <div
            className={`mt-6 pt-4 border-t flex items-center justify-between ${
              isDarkMode ? 'border-[#1E3A5F]' : 'border-[#E8F0F8]'
            }`}
          >
            <span
              className={`text-xs flex items-center gap-1.5 ${
                isDarkMode ? 'text-[#E8F0F8]/70' : 'text-[#263238]/70'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-[#F07856]" />
              <span>{nextRecommendedLesson.estimatedMinutes} min reading time</span>
            </span>

            <button
              onClick={() => onOpenLesson(nextRecommendedLesson)}
              className="px-5 py-2.5 rounded-xl bg-[#F07856] hover:bg-[#D95D3B] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#F07856]/20 flex items-center gap-2 transition"
            >
              <span>Start Lesson</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Daily Concept Spotlight (1 col) */}
        <div
          className={`p-6 rounded-2xl border shadow-md flex flex-col justify-between transition-colors ${
            isDarkMode
              ? 'bg-[#0B192C] border-[#1E3A5F] text-[#FFF8ED]'
              : 'bg-[#173B63] text-white border-[#173B63]'
          }`}
        >
          <div>
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#F07856] mb-3">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Concept Spotlight
              </span>
              <span className="text-[#E8F0F8] text-[10px]">Daily Focus</span>
            </div>

            <h4 className="text-lg font-extrabold text-[#FFF8ED]">
              {dailySpotlightLesson.term}
            </h4>

            <p className="mt-2 text-[#E8F0F8] text-xs sm:text-sm leading-relaxed">
              {dailySpotlightLesson.shortDefinition}
            </p>

            {dailySpotlightLesson.formula && (
              <div className="mt-4 p-3 rounded-lg bg-white/10 font-mono text-xs text-[#FFF8ED] border border-white/15">
                {dailySpotlightLesson.formula}
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-white/15 flex items-center justify-between">
            <span className="text-[11px] text-[#E8F0F8] uppercase tracking-wider font-semibold">
              Track: {dailySpotlightLesson.trackId}
            </span>
            <button
              onClick={() => onOpenLesson(dailySpotlightLesson)}
              className="text-xs font-bold text-[#F07856] hover:text-[#FFF8ED] flex items-center gap-1 transition"
            >
              <span>Examine Details</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Learning Tracks Overview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2
              className={`text-xl sm:text-2xl font-extrabold ${
                isDarkMode ? 'text-[#FFF8ED]' : 'text-[#173B63]'
              }`}
            >
              Curriculum Learning Tracks
            </h2>
            <p
              className={`text-xs sm:text-sm ${
                isDarkMode ? 'text-[#E8F0F8]/70' : 'text-[#263238]/70'
              }`}
            >
              Three pillars of university commerce: Financial Accounting, Economics, and Corporate Finance.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('tracks')}
            className="text-xs sm:text-sm font-bold text-[#F07856] hover:text-[#D95D3B] flex items-center gap-1 transition"
          >
            <span>View All Tracks</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tracks.map((track) => {
            const trackLessons = lessons.filter((l) => l.trackId === track.id);
            const completedCount = trackLessons.filter((l) =>
              userProfile.completedLessonIds.includes(l.id)
            ).length;
            const progress = Math.round(
              (completedCount / Math.max(1, trackLessons.length)) * 100
            );

            return (
              <div
                key={track.id}
                className={`rounded-2xl border shadow-xs hover:shadow-md transition-all p-6 flex flex-col justify-between ${
                  isDarkMode
                    ? 'bg-[#132238] border-[#1E3A5F] hover:border-[#F07856]/50'
                    : 'bg-white border-[#E8F0F8] hover:border-[#173B63]/30'
                }`}
              >
                <div>
                  {/* Track Header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#173B63] text-white flex items-center justify-center shadow-sm shadow-[#173B63]/20">
                      <div className="text-[#F07856]">{getTrackIcon(track.iconName)}</div>
                    </div>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                        isDarkMode
                          ? 'bg-[#1E3A5F] text-[#FFF8ED] border-[#1E3A5F]'
                          : 'bg-[#E8F0F8] text-[#173B63] border-[#173B63]/10'
                      }`}
                    >
                      {completedCount} / {trackLessons.length} Completed
                    </span>
                  </div>

                  <h3
                    className={`text-lg font-bold leading-snug ${
                      isDarkMode ? 'text-[#FFF8ED]' : 'text-[#173B63]'
                    }`}
                  >
                    {track.title}
                  </h3>
                  <p
                    className={`mt-1.5 text-xs sm:text-sm line-clamp-2 ${
                      isDarkMode ? 'text-[#E8F0F8]/80' : 'text-[#263238]/80'
                    }`}
                  >
                    {track.shortDescription}
                  </p>

                  {/* Progress Bar in Coral Orange */}
                  <div className="mt-4">
                    <div
                      className={`flex items-center justify-between text-xs mb-1.5 ${
                        isDarkMode ? 'text-[#E8F0F8]/70' : 'text-[#263238]/70'
                      }`}
                    >
                      <span>Track Mastery</span>
                      <span className="font-extrabold text-[#F07856]">{progress}%</span>
                    </div>
                    <div
                      className={`w-full h-2 rounded-full overflow-hidden ${
                        isDarkMode ? 'bg-[#0B192C]' : 'bg-[#E8F0F8]'
                      }`}
                    >
                      <div
                        className="bg-[#F07856] h-full rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div
                  className={`mt-6 pt-4 border-t flex items-center justify-between ${
                    isDarkMode ? 'border-[#1E3A5F]' : 'border-[#E8F0F8]'
                  }`}
                >
                  <span
                    className={`text-[11px] font-medium truncate max-w-[150px] ${
                      isDarkMode ? 'text-[#E8F0F8]/70' : 'text-[#263238]/70'
                    }`}
                  >
                    {track.targetCareer}
                  </span>
                  <button
                    onClick={() => {
                      onSelectTrack(track.id);
                      setActiveTab('tracks');
                    }}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                      isDarkMode
                        ? 'bg-[#1E3A5F] text-[#FFF8ED] hover:bg-[#F07856]'
                        : 'bg-[#E8F0F8] hover:bg-[#173B63] hover:text-white text-[#173B63]'
                    }`}
                  >
                    <span>Explore</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
