import React from 'react';
import {
  Flame,
  Award,
  ArrowRight,
  TrendingUp,
  Receipt,
  PieChart,
  Clock,
  Target,
  GraduationCap,
  ChevronRight,
  CheckCircle2,
  Lock,
  BookOpen,
  Calendar,
  Check,
  Brain,
  Sparkles,
  Play,
  FileText,
  Trophy,
  User,
  Coins
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
  onStartQuiz?: (lesson: Lesson) => void;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenPractice: () => void;
  isDarkMode?: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  userProfile,
  tracks,
  lessons,
  spacedRepetitionDueCount,
  onSelectTrack,
  onOpenLesson,
  onStartQuiz,
  setActiveTab,
  onOpenPractice,
  isDarkMode = false
}) => {
  // Gamification calculations
  const levelProgress = calculateLevelProgress(userProfile.currentXp);
  const nextTier =
    LEVEL_TIERS.find((t) => t.level === userProfile.level + 1) ||
    LEVEL_TIERS[LEVEL_TIERS.length - 1];

  // Featured Lesson (matches reference: Accrual vs. Cash Accounting if available, or first uncompleted)
  const featuredLesson =
    lessons.find((l) => l.title.toLowerCase().includes('accrual') || l.term.toLowerCase().includes('accrual')) ||
    lessons.find((l) => !userProfile.completedLessonIds.includes(l.id)) ||
    lessons[0];

  // Specific tracks by ID for explicit matching
  const accountingTrack = tracks.find((t) => t.id === 'accounting') || tracks[0];
  const economicsTrack = tracks.find((t) => t.id === 'economics') || tracks[1] || tracks[0];
  const financeTrack = tracks.find((t) => t.id === 'finance') || tracks[2] || tracks[0];

  const getTrackStats = (trackId: string) => {
    const trackLessons = lessons.filter((l) => l.trackId === trackId);
    const completedCount = trackLessons.filter((l) =>
      userProfile.completedLessonIds.includes(l.id)
    ).length;
    const totalCount = Math.max(1, trackLessons.length);
    const percent = Math.round((completedCount / totalCount) * 100);
    return { completedCount, totalCount, percent };
  };

  const accStats = getTrackStats('accounting');
  const ecoStats = getTrackStats('economics');
  const finStats = getTrackStats('finance');

  // Accuracy calculation
  const accuracy =
    userProfile.quizStats.totalAnswered > 0
      ? Math.round(
          (userProfile.quizStats.totalCorrect / userProfile.quizStats.totalAnswered) * 100
        )
      : 88;

  // Theme tokens
  const primaryText = isDarkMode ? 'text-[#FFF8ED]' : 'text-[#263238]';
  const secondaryText = isDarkMode ? 'text-[#C1CDDC]' : 'text-[#52647A]';
  const cardBg = isDarkMode ? 'bg-[#12233A]' : 'bg-[#FFFFFF]';
  const cardBorder = isDarkMode ? 'border-[#1E324F]' : 'border-[#EDE3D2]';

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* =========================================================================
          1. PERSONALIZED WELCOME BANNER WITH CAMPUS SKYLINE ILLUSTRATION
         ========================================================================= */}
      <section
        aria-label="Welcome Banner"
        className={`rounded-3xl border transition-colors shadow-xs relative overflow-hidden flex flex-col md:flex-row items-center justify-between p-6 sm:p-8 min-h-[148px] ${cardBg} ${cardBorder}`}
      >
        {/* Left Side: Avatar & Scholar Greeting */}
        <div className="flex items-center gap-5 z-10 w-full md:w-auto">
          <button
            onClick={() => setActiveTab('profile')}
            className="cursor-pointer group focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#E96746] rounded-full shrink-0"
            title="Open Student Profile"
          >
            <UserAvatar
              src={userProfile.avatar}
              name={userProfile.displayName}
              size="2xl"
              levelBadge={userProfile.level}
              ringClassName="ring-4 ring-[#E96746]/25 dark:ring-[#F07856]/40 shadow-xs group-hover:scale-105 transition-transform"
            />
          </button>

          <div className="space-y-1">
            <span className={`text-xs sm:text-sm font-medium ${secondaryText}`}>
              Good to see you again,
            </span>

            <h1 className={`text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2 ${primaryText}`}>
              <span>{userProfile.displayName}</span>
              <span className="inline-block animate-wave">👋</span>
            </h1>

            <p className={`text-xs sm:text-sm font-semibold ${secondaryText}`}>
              <span>{userProfile.levelTitle}</span>
              <span className="mx-1.5 opacity-40">·</span>
              <span>Next level in </span>
              <strong className="text-[#E96746] dark:text-[#F07856] font-extrabold">
                {levelProgress.neededXp > 0 ? `${levelProgress.neededXp} XP` : '80 XP'}
              </strong>
            </p>
          </div>
        </div>

        {/* Center: Inspirational Educational Quote */}
        <div className="hidden xl:flex items-center gap-2 z-10 px-6 py-3 rounded-2xl bg-[#FFF8ED]/80 dark:bg-[#0B1728]/80 border border-[#EDE3D2] dark:border-[#1E324F] max-w-sm backdrop-blur-xs">
          <p className="text-xs sm:text-sm italic leading-relaxed text-[#52647A] dark:text-[#C1CDDC]">
            <span className="text-[#E96746] dark:text-[#F07856] font-bold text-base not-italic mr-1">“</span>
            Small steps in learning today, big opportunities tomorrow.
            <span className="text-[#E96746] dark:text-[#F07856] font-bold text-base not-italic ml-1">”</span>
          </p>
        </div>

        {/* Right Side: Campus Illustration */}
        <div className="hidden md:block w-72 lg:w-96 h-28 relative z-0 shrink-0 pointer-events-none opacity-90 dark:opacity-40">
          <svg viewBox="0 0 400 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full object-cover">
            {/* Soft Warm Sky Gradient */}
            <defs>
              <linearGradient id="skyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF1EB" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#ACE0F9" stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id="domeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#1E3A8A" />
              </linearGradient>
            </defs>
            <rect width="400" height="120" fill="url(#skyGrad)" rx="16" />
            
            {/* Distant Trees & Autumn Foliage */}
            <circle cx="60" cy="95" r="24" fill="#FDBA74" opacity="0.6" />
            <circle cx="85" cy="90" r="28" fill="#FB923C" opacity="0.7" />
            <circle cx="120" cy="95" r="22" fill="#F59E0B" opacity="0.6" />
            <circle cx="280" cy="95" r="24" fill="#F59E0B" opacity="0.6" />
            <circle cx="310" cy="90" r="26" fill="#F97316" opacity="0.7" />
            <circle cx="340" cy="95" r="22" fill="#FDBA74" opacity="0.6" />
            
            {/* Campus Lawn Base */}
            <path d="M0 100 Q 200 88 400 100 L 400 120 L 0 120 Z" fill="#15803D" opacity="0.75" />
            <path d="M0 106 Q 200 96 400 106 L 400 120 L 0 120 Z" fill="#166534" />
            
            {/* Classical University Neoclassical Building */}
            <rect x="150" y="55" width="100" height="50" fill="#FEF3C7" stroke="#FDE68A" strokeWidth="1" />
            {/* Portico Pediment (Triangle) */}
            <polygon points="140,55 200,28 260,55" fill="#FDE68A" stroke="#F59E0B" strokeWidth="1" />
            {/* Neoclassical Columns */}
            <rect x="155" y="55" width="6" height="48" fill="#F59E0B" rx="1" />
            <rect x="175" y="55" width="6" height="48" fill="#F59E0B" rx="1" />
            <rect x="197" y="55" width="6" height="48" fill="#F59E0B" rx="1" />
            <rect x="219" y="55" width="6" height="48" fill="#F59E0B" rx="1" />
            <rect x="239" y="55" width="6" height="48" fill="#F59E0B" rx="1" />
            {/* Classical Dome with Spire */}
            <path d="M 180 28 C 180 10, 220 10, 220 28 Z" fill="url(#domeGrad)" />
            <line x1="200" y1="10" x2="200" y2="2" stroke="#D97706" strokeWidth="2" />
            <circle cx="200" cy="2" r="2" fill="#F59E0B" />
            {/* Arched Windows */}
            <path d="M 188 75 C 188 68, 212 68, 212 75 L 212 95 L 188 95 Z" fill="#1E3A8A" />
          </svg>
        </div>
      </section>

      {/* =========================================================================
          2. METRIC CARDS ROW (5 Compact Pill Cards with Milestone CTA)
         ========================================================================= */}
      <section aria-label="Key Statistics" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Card 1: Total Experience */}
        <div className={`p-4 rounded-2xl border shadow-xs transition-colors relative overflow-hidden ${cardBg} ${cardBorder}`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-amber-100/70 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
              <Trophy className="w-4 h-4 fill-current" />
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className={`text-xl sm:text-2xl font-black tabular-nums ${primaryText}`}>
                  {userProfile.currentXp}
                </span>
                <span className="text-[11px] font-bold text-[#E96746] dark:text-[#F07856]">XP</span>
              </div>
              <span className={`block text-[11px] font-semibold ${secondaryText}`}>
                Total Experience
              </span>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#E96746]/70 dark:bg-[#F07856]/70" />
        </div>

        {/* Card 2: Active Streak */}
        <div className={`p-4 rounded-2xl border shadow-xs transition-colors relative overflow-hidden ${cardBg} ${cardBorder}`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-red-100/70 dark:bg-red-900/30 text-[#E96746] dark:text-[#F07856]">
              <Flame className="w-4 h-4 fill-current" />
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className={`text-xl sm:text-2xl font-black tabular-nums ${primaryText}`}>
                  {userProfile.streakDays}
                </span>
                <span className="text-[11px] font-bold text-[#E96746] dark:text-[#F07856]">Days</span>
              </div>
              <span className={`block text-[11px] font-semibold ${secondaryText}`}>
                Active Streak
              </span>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#E96746]/70 dark:bg-[#F07856]/70" />
        </div>

        {/* Card 3: Quiz Accuracy */}
        <div className={`p-4 rounded-2xl border shadow-xs transition-colors relative overflow-hidden ${cardBg} ${cardBorder}`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-red-100/70 dark:bg-red-900/30 text-[#E96746] dark:text-[#F07856]">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className={`text-xl sm:text-2xl font-black tabular-nums ${primaryText}`}>
                  {accuracy}%
                </span>
              </div>
              <span className={`block text-[11px] font-semibold ${secondaryText}`}>
                Quiz Accuracy
              </span>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#E96746]/70 dark:bg-[#F07856]/70" />
        </div>

        {/* Card 4: Review Items Due */}
        <div className={`p-4 rounded-2xl border shadow-xs transition-colors relative overflow-hidden ${cardBg} ${cardBorder}`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-orange-100/70 dark:bg-orange-900/30 text-[#E96746] dark:text-[#F07856]">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className={`text-xl sm:text-2xl font-black tabular-nums ${primaryText}`}>
                  {spacedRepetitionDueCount}
                </span>
              </div>
              <span className={`block text-[11px] font-semibold ${secondaryText}`}>
                Review Items Due
              </span>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#E96746]/70 dark:bg-[#F07856]/70" />
        </div>

        {/* Card 5: Keep Going! Card (Milestone Promo Tile) */}
        <div className="col-span-2 md:col-span-1 p-3.5 sm:p-4 rounded-2xl border flex items-center justify-between gap-3 shadow-2xs bg-[#FEF5F1] dark:bg-[#1E2E42] border-[#FCE0D4] dark:border-[#2A4365]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-[#FDECE7] dark:bg-[#253952] text-[#E96746] dark:text-[#F07856]">
              <Award className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className={`block text-xs font-black ${primaryText}`}>
                Keep Going!
              </span>
              <p className={`text-[11px] leading-tight line-clamp-2 ${secondaryText}`}>
                You're <strong className="text-[#E96746] dark:text-[#F07856] font-extrabold">{levelProgress.neededXp > 0 ? levelProgress.neededXp : 80} XP</strong> away from {nextTier.title}
              </p>
            </div>
          </div>
          <button
            onClick={() => onOpenLesson(featuredLesson)}
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white shadow-xs cursor-pointer bg-[#E96746] hover:bg-[#D45333] dark:bg-[#F07856] dark:hover:bg-[#D95D3B] transition-transform hover:scale-105"
            title="Continue Learning"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* =========================================================================
          3. MAIN SECTION (2 Columns: Left 8 Cols / Right 4 Cols)
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ----------------- LEFT 8 COLUMNS ----------------- */}
        <div className="lg:col-span-8 space-y-6">
          {/* Navy Featured Learning Panel */}
          <section
            aria-label="Continue Learning Feature"
            className="rounded-3xl border border-[#1E3A5F] bg-[#132A46] p-6 sm:p-7 text-white shadow-md relative overflow-hidden"
          >
            {/* Header with Featured Lesson Pill */}
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Continue Learning
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                  Pick up where you left off and keep building your knowledge.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {featuredLesson.isAdminOnly && (
                  <span className="text-[11px] font-extrabold tracking-wider px-3 py-1 rounded-full border border-amber-500/50 bg-amber-500/20 text-amber-300 uppercase shrink-0 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    <span>Admin Only</span>
                  </span>
                )}
                <span className="text-[11px] font-extrabold tracking-wider px-3 py-1 rounded-full border border-amber-400/40 bg-amber-400/10 text-amber-300 uppercase shrink-0">
                  Featured Lesson
                </span>
              </div>
            </div>

            {/* Content Row: Study Desk Illustration + Lesson Info + CTA */}
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Study Desk Graphic with Circular Play Overlay */}
              <div className="w-full md:w-52 h-32 rounded-2xl relative shrink-0 overflow-hidden shadow-inner bg-gradient-to-br from-[#1E3E66] to-[#0E1E33] border border-white/10 flex items-center justify-center group cursor-pointer"
                   onClick={() => onOpenLesson(featuredLesson)}>
                {/* SVG Stylized Study Desk with Calculator & Ledger */}
                <svg viewBox="0 0 200 130" fill="none" className="w-full h-full object-cover">
                  <rect width="200" height="130" fill="#1E3E66" />
                  {/* Desk Surface */}
                  <rect x="10" y="80" width="180" height="40" rx="6" fill="#173152" />
                  {/* Ledger / Notebook Paper */}
                  <rect x="75" y="20" width="95" height="85" rx="5" fill="#FFF8ED" transform="rotate(8 75 20)" opacity="0.95" />
                  <line x1="90" y1="35" x2="155" y2="44" stroke="#94A3B8" strokeWidth="2" />
                  <line x1="93" y1="50" x2="158" y2="59" stroke="#CBD5E1" strokeWidth="2" />
                  <line x1="96" y1="65" x2="161" y2="74" stroke="#CBD5E1" strokeWidth="2" />
                  <line x1="99" y1="80" x2="164" y2="89" stroke="#CBD5E1" strokeWidth="2" />
                  {/* Calculator Graphic */}
                  <rect x="25" y="35" width="48" height="65" rx="6" fill="#38BDF8" stroke="#0284C7" strokeWidth="1.5" />
                  <rect x="30" y="40" width="38" height="14" rx="2" fill="#0C4A6E" />
                  <circle cx="36" cy="62" r="3" fill="#E0F2FE" />
                  <circle cx="49" cy="62" r="3" fill="#E0F2FE" />
                  <circle cx="62" cy="62" r="3" fill="#E0F2FE" />
                  <circle cx="36" cy="74" r="3" fill="#E0F2FE" />
                  <circle cx="49" cy="74" r="3" fill="#E0F2FE" />
                  <circle cx="62" cy="74" r="3" fill="#E0F2FE" />
                  <circle cx="36" cy="86" r="3" fill="#E0F2FE" />
                  <circle cx="49" cy="86" r="3" fill="#E0F2FE" />
                  <circle cx="62" cy="86" r="3" fill="#F07856" />
                </svg>

                {/* Dark Circular Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition">
                  <div className="w-10 h-10 rounded-full bg-slate-900/85 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-4 h-4 fill-white ml-0.5" />
                  </div>
                </div>
              </div>

              {/* Lesson Text & Progress Meter */}
              <div className="flex-1 min-w-0 space-y-2">
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  {featuredLesson.title}
                </h3>

                <p className="text-xs text-slate-300 font-semibold">
                  {featuredLesson.trackId === 'accounting' ? 'Accounting' : featuredLesson.trackId === 'economics' ? 'Economics' : 'Finance'} · Core Concept
                </p>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed line-clamp-2">
                  {featuredLesson.shortDefinition}
                </p>

                {/* Progress Bar & Metric */}
                <div className="pt-2">
                  <div className="w-full bg-slate-700/80 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#E96746] dark:bg-[#F07856] h-full rounded-full transition-all duration-300" style={{ width: '60%' }} />
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-300 font-medium">
                    <span>60% Complete</span>
                    <span>{featuredLesson.estimatedMinutes || 6} min left</span>
                  </div>
                </div>
              </div>

              {/* Continue Button */}
              <div className="shrink-0 w-full md:w-auto">
                <button
                  onClick={() => onOpenLesson(featuredLesson)}
                  className="w-full md:w-auto px-5 py-3 rounded-xl font-bold text-sm text-white shadow-md flex items-center justify-center gap-2 cursor-pointer bg-[#E96746] hover:bg-[#D45333] dark:bg-[#F07856] dark:hover:bg-[#D95D3B] transition-all hover:scale-102"
                >
                  <span>Continue Lesson</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </section>

          {/* Learning Tracks Section (3 Colorful Cards) */}
          <section aria-label="Learning Tracks" className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className={`text-lg sm:text-xl font-black ${primaryText}`}>
                  Learning Tracks
                </h2>
                <p className={`text-xs ${secondaryText}`}>
                  Explore subjects and strengthen your financial knowledge.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('tracks')}
                className="text-xs font-bold text-[#E96746] dark:text-[#F07856] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View All Tracks</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Track 1: Accounting (Peach / Red Coral Theme) */}
              <div className="p-5 rounded-2xl border transition-all shadow-2xs flex flex-col justify-between bg-[#FEF6F3] dark:bg-[#182638] border-[#FCE5DC] dark:border-[#243B55]">
                <div>
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#12233A] shadow-2xs border border-[#FCE5DC] dark:border-[#243B55] flex items-center justify-center text-[#E96746] dark:text-[#F07856]">
                      <Receipt className="w-5 h-5" />
                    </div>
                    <button
                      onClick={() => {
                        onSelectTrack(accountingTrack.id);
                        setActiveTab('tracks');
                      }}
                      className="w-7 h-7 rounded-full bg-white dark:bg-[#12233A] border border-[#FCE5DC] dark:border-[#243B55] text-[#E96746] dark:text-[#F07856] flex items-center justify-center cursor-pointer hover:scale-105 transition"
                      title="Explore Accounting"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h3 className={`text-base font-black mt-3 ${primaryText}`}>
                    Accounting
                  </h3>
                  <p className={`text-xs mt-1 leading-relaxed line-clamp-2 ${secondaryText}`}>
                    Master financial statements, GAAP, and core accounting concepts.
                  </p>
                </div>

                <div className="mt-5">
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#E96746] dark:bg-[#F07856] h-full rounded-full" style={{ width: `${accStats.percent}%` }} />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] font-semibold">
                    <span className={secondaryText}>{accStats.completedCount}/{accStats.totalCount} lessons</span>
                    <span className="text-[#E96746] dark:text-[#F07856] font-bold">{accStats.percent}%</span>
                  </div>
                </div>
              </div>

              {/* Track 2: Economics (Sky Blue Theme) */}
              <div className="p-5 rounded-2xl border transition-all shadow-2xs flex flex-col justify-between bg-[#F0F7FD] dark:bg-[#13283E] border-[#DCEBF8] dark:border-[#1E3A5A]">
                <div>
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#12233A] shadow-2xs border border-[#DCEBF8] dark:border-[#1E3A5A] flex items-center justify-center text-blue-500">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <button
                      onClick={() => {
                        onSelectTrack(economicsTrack.id);
                        setActiveTab('tracks');
                      }}
                      className="w-7 h-7 rounded-full bg-white dark:bg-[#12233A] border border-[#DCEBF8] dark:border-[#1E3A5A] text-blue-500 flex items-center justify-center cursor-pointer hover:scale-105 transition"
                      title="Explore Economics"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h3 className={`text-base font-black mt-3 ${primaryText}`}>
                    Economics
                  </h3>
                  <p className={`text-xs mt-1 leading-relaxed line-clamp-2 ${secondaryText}`}>
                    Understand markets, macroeconomics, and economic indicators.
                  </p>
                </div>

                <div className="mt-5">
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: `${ecoStats.percent}%` }} />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] font-semibold">
                    <span className={secondaryText}>{ecoStats.completedCount}/{ecoStats.totalCount} lessons</span>
                    <span className="text-blue-500 font-bold">{ecoStats.percent}%</span>
                  </div>
                </div>
              </div>

              {/* Track 3: Finance (Mint Green Theme) */}
              <div className="p-5 rounded-2xl border transition-all shadow-2xs flex flex-col justify-between bg-[#F0FBF7] dark:bg-[#132A39] border-[#D2F3E7] dark:border-[#1E433E]">
                <div>
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#12233A] shadow-2xs border border-[#D2F3E7] dark:border-[#1E433E] flex items-center justify-center text-emerald-500">
                      <Coins className="w-5 h-5" />
                    </div>
                    <button
                      onClick={() => {
                        onSelectTrack(financeTrack.id);
                        setActiveTab('tracks');
                      }}
                      className="w-7 h-7 rounded-full bg-white dark:bg-[#12233A] border border-[#D2F3E7] dark:border-[#1E433E] text-emerald-500 flex items-center justify-center cursor-pointer hover:scale-105 transition"
                      title="Explore Finance"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h3 className={`text-base font-black mt-3 ${primaryText}`}>
                    Finance
                  </h3>
                  <p className={`text-xs mt-1 leading-relaxed line-clamp-2 ${secondaryText}`}>
                    Learn investment, valuation, corporate finance, and financial analysis.
                  </p>
                </div>

                <div className="mt-5">
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${finStats.percent}%` }} />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] font-semibold">
                    <span className={secondaryText}>{finStats.completedCount}/{finStats.totalCount} lessons</span>
                    <span className="text-emerald-500 font-bold">{finStats.percent}%</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* ----------------- RIGHT 4 COLUMNS ----------------- */}
        <div className="lg:col-span-4 space-y-6">
          {/* Weekly Progress Card (Bar Chart + Donut Ring) */}
          <section
            aria-label="Weekly Progress"
            className={`rounded-3xl border p-6 transition-colors shadow-xs ${cardBg} ${cardBorder}`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-base font-black ${primaryText}`}>
                Weekly Progress
              </h3>
              <button
                onClick={() => setActiveTab('tracks')}
                className="text-xs font-bold text-[#E96746] dark:text-[#F07856] hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>View Details</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center justify-between gap-4 pt-1">
              {/* Vertical Bar Chart */}
              <div className="flex items-end gap-1.5 flex-1">
                {/* Y-axis indicator */}
                <div className={`flex flex-col justify-between text-[10px] font-bold h-24 pb-4 ${secondaryText}`}>
                  <span>6</span>
                  <span>4</span>
                  <span>2</span>
                  <span>0</span>
                </div>

                {/* 7 Day Pill Bars */}
                <div className="flex-1 grid grid-cols-7 gap-1 items-end h-24 pb-4 border-b border-slate-200 dark:border-slate-700">
                  {[
                    { day: 'Mon', h: '70%' },
                    { day: 'Tue', h: '35%' },
                    { day: 'Wed', h: '80%' },
                    { day: 'Thu', h: '45%' },
                    { day: 'Fri', h: '55%' },
                    { day: 'Sat', h: '75%' },
                    { day: 'Sun', h: '30%' }
                  ].map((bar) => (
                    <div key={bar.day} className="flex flex-col items-center gap-1.5 h-full justify-end">
                      <div className="w-2.5 sm:w-3 bg-[#FDF0EB] dark:bg-[#1E2E42] rounded-full h-full relative overflow-hidden flex items-end">
                        <div
                          className="w-full bg-[#E96746] dark:bg-[#F07856] rounded-full transition-all duration-500"
                          style={{ height: bar.h }}
                        />
                      </div>
                      <span className={`text-[9px] font-semibold ${secondaryText}`}>
                        {bar.day}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Donut Chart Ring */}
              <div className="flex flex-col items-center shrink-0 w-24">
                <div className="relative w-18 h-18 flex items-center justify-center">
                  <svg viewBox="0 0 36 36" className="w-18 h-18 transform -rotate-90">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#FDF0EB"
                      strokeWidth="3.5"
                      className="dark:stroke-[#1E2E42]"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#E96746"
                      strokeDasharray="73, 100"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className={`absolute text-sm font-black ${primaryText}`}>
                    73%
                  </span>
                </div>
                <span className={`text-[11px] font-medium mt-1 ${secondaryText}`}>
                  Weekly Goal
                </span>
                <span className={`text-xs font-black ${primaryText}`}>
                  5 / 7 days
                </span>
              </div>
            </div>
          </section>

          {/* Achievements Card (4x2 Badges Grid) */}
          <section
            aria-label="Achievements Showcase"
            className={`rounded-3xl border p-6 transition-colors shadow-xs ${cardBg} ${cardBorder}`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-base font-black ${primaryText}`}>
                Achievements
              </h3>
              <button
                onClick={() => setActiveTab('profile')}
                className="text-xs font-bold text-[#E96746] dark:text-[#F07856] hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Badges Grid: Row 1 Unlocked (Colorful) & Row 2 Locked (Gray) */}
            <div className="grid grid-cols-4 gap-2.5">
              {/* Badge 1: First Lesson (Red/Coral Hexagon) */}
              <div className="flex flex-col items-center text-center">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-red-500 to-[#E96746] text-white flex items-center justify-center shadow-xs">
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className={`text-[10px] font-bold mt-1.5 leading-tight line-clamp-2 ${primaryText}`}>
                  First Lesson Completed
                </span>
              </div>

              {/* Badge 2: 3 Day Streak (Orange/Amber Hexagon) */}
              <div className="flex flex-col items-center text-center">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-xs">
                  <Flame className="w-5 h-5 fill-current" />
                </div>
                <span className={`text-[10px] font-bold mt-1.5 leading-tight line-clamp-2 ${primaryText}`}>
                  3 Day Streak
                </span>
              </div>

              {/* Badge 3: Quiz Master (Purple Hexagon) */}
              <div className="flex flex-col items-center text-center">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center shadow-xs">
                  <Target className="w-5 h-5" />
                </div>
                <span className={`text-[10px] font-bold mt-1.5 leading-tight line-clamp-2 ${primaryText}`}>
                  Quiz Master (80%+)
                </span>
              </div>

              {/* Badge 4: Concept Explorer (Indigo Hexagon) */}
              <div className="flex flex-col items-center text-center">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-700 text-white flex items-center justify-center shadow-xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className={`text-[10px] font-bold mt-1.5 leading-tight line-clamp-2 ${primaryText}`}>
                  Concept Explorer
                </span>
              </div>

              {/* Row 2: Locked Badges (Gray with Lock) */}
              <div className="flex flex-col items-center text-center mt-2 opacity-65">
                <div className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                  <Lock className="w-4 h-4" />
                </div>
                <span className={`text-[10px] font-semibold mt-1.5 leading-tight line-clamp-2 ${secondaryText}`}>
                  Wall Street Analyst
                </span>
              </div>

              <div className="flex flex-col items-center text-center mt-2 opacity-65">
                <div className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                  <Lock className="w-4 h-4" />
                </div>
                <span className={`text-[10px] font-semibold mt-1.5 leading-tight line-clamp-2 ${secondaryText}`}>
                  Perfect Week (7 Days)
                </span>
              </div>

              <div className="flex flex-col items-center text-center mt-2 opacity-65">
                <div className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                  <Lock className="w-4 h-4" />
                </div>
                <span className={`text-[10px] font-semibold mt-1.5 leading-tight line-clamp-2 ${secondaryText}`}>
                  Finance Pro (Level 5)
                </span>
              </div>

              <div className="flex flex-col items-center text-center mt-2 opacity-65">
                <div className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                  <Lock className="w-4 h-4" />
                </div>
                <span className={`text-[10px] font-semibold mt-1.5 leading-tight line-clamp-2 ${secondaryText}`}>
                  Elite Scholar (Level 10)
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* =========================================================================
          4. BOTTOM ROW: RECENT ACTIVITY, SPACED REVIEW, QUICK ACTIONS
         ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
        {/* Card 1: Recent Activity (lg:col-span-5) */}
        <section
          aria-label="Recent Activity"
          className={`lg:col-span-5 rounded-3xl border p-6 transition-colors shadow-xs ${cardBg} ${cardBorder}`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-base font-black ${primaryText}`}>
              Recent Activity
            </h3>
            <button
              onClick={() => setActiveTab('tracks')}
              className="text-xs font-bold text-[#E96746] dark:text-[#F07856] hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3.5">
            {/* Activity 1 */}
            <div className="flex items-center justify-between text-xs gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="min-w-0">
                  <p className={`font-bold truncate ${primaryText}`}>
                    Completed: Introduction to Financial Statements
                  </p>
                  <span className={`text-[11px] ${secondaryText}`}>2 hours ago</span>
                </div>
              </div>
              <span className="font-extrabold text-[#E96746] dark:text-[#F07856] shrink-0">+20 XP</span>
            </div>

            {/* Activity 2 */}
            <div className="flex items-center justify-between text-xs gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Target className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className={`font-bold truncate ${primaryText}`}>
                    Quiz: Double Entry System
                  </p>
                  <span className={`text-[11px] ${secondaryText}`}>1 day ago</span>
                </div>
              </div>
              <span className="font-extrabold text-[#E96746] dark:text-[#F07856] shrink-0">+15 XP</span>
            </div>

            {/* Activity 3 */}
            <div className="flex items-center justify-between text-xs gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/40 text-[#E96746] flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className={`font-bold truncate ${primaryText}`}>
                    Viewed: Accrual vs. Cash Accounting
                  </p>
                  <span className={`text-[11px] ${secondaryText}`}>1 day ago</span>
                </div>
              </div>
              <span className={`font-medium ${secondaryText}`}>-</span>
            </div>

            {/* Activity 4 */}
            <div className="flex items-center justify-between text-xs gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                </div>
                <div className="min-w-0">
                  <p className={`font-bold truncate ${primaryText}`}>
                    Started: Revenue Recognition
                  </p>
                  <span className={`text-[11px] ${secondaryText}`}>2 days ago</span>
                </div>
              </div>
              <span className={`font-medium ${secondaryText}`}>-</span>
            </div>
          </div>
        </section>

        {/* Card 2: Spaced Review (lg:col-span-4) */}
        <section
          aria-label="Spaced Review"
          className={`lg:col-span-4 rounded-3xl border p-6 transition-colors shadow-xs ${cardBg} ${cardBorder}`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className={`text-base font-black ${primaryText}`}>
                Spaced Review
              </h3>
              <span className="w-5 h-5 rounded-full bg-[#E96746] dark:bg-[#F07856] text-white text-[11px] font-black inline-flex items-center justify-center">
                {spacedRepetitionDueCount || 2}
              </span>
            </div>

            <button
              onClick={onOpenPractice}
              className="text-xs font-bold text-[#E96746] dark:text-[#F07856] hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span>Review Now</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {/* Review Item 1 */}
            <div className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${isDarkMode ? 'bg-[#0B1728] border-[#1E324F]' : 'bg-[#FFF8ED] border-[#EDE3D2]'}`}>
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className={`text-xs font-bold truncate ${primaryText}`}>
                    Depreciation Methods
                  </h4>
                  <span className={`text-[11px] block ${secondaryText}`}>
                    Last reviewed 3 days ago
                  </span>
                </div>
              </div>
              <button
                onClick={onOpenPractice}
                className="px-3 py-1.5 rounded-lg text-xs font-bold border border-[#E96746] dark:border-[#F07856] text-[#E96746] dark:text-[#F07856] hover:bg-[#E96746] hover:text-white dark:hover:bg-[#F07856] transition cursor-pointer shrink-0"
              >
                Review
              </button>
            </div>

            {/* Review Item 2 */}
            <div className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${isDarkMode ? 'bg-[#0B1728] border-[#1E324F]' : 'bg-[#FFF8ED] border-[#EDE3D2]'}`}>
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                  <Target className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className={`text-xs font-bold truncate ${primaryText}`}>
                    Types of Market Structures
                  </h4>
                  <span className={`text-[11px] block ${secondaryText}`}>
                    Last reviewed 4 days ago
                  </span>
                </div>
              </div>
              <button
                onClick={onOpenPractice}
                className="px-3 py-1.5 rounded-lg text-xs font-bold border border-[#E96746] dark:border-[#F07856] text-[#E96746] dark:text-[#F07856] hover:bg-[#E96746] hover:text-white dark:hover:bg-[#F07856] transition cursor-pointer shrink-0"
              >
                Review
              </button>
            </div>
          </div>
        </section>

        {/* Card 3: Quick Actions (lg:col-span-3) */}
        <section
          aria-label="Quick Actions"
          className={`lg:col-span-3 rounded-3xl border p-6 transition-colors shadow-xs ${cardBg} ${cardBorder}`}
        >
          <h3 className={`text-base font-black mb-4 ${primaryText}`}>
            Quick Actions
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {/* Action 1: Practice Quiz */}
            <button
              onClick={() => {
                if (onStartQuiz) {
                  onStartQuiz(featuredLesson);
                } else {
                  onOpenPractice();
                }
              }}
              className={`p-3 rounded-2xl border flex flex-col items-center justify-center text-center gap-2 transition cursor-pointer hover:border-[#E96746] group ${isDarkMode ? 'bg-[#0B1728] border-[#1E324F]' : 'bg-[#FFF8ED] border-[#EDE3D2]'}`}
            >
              <div className="w-9 h-9 rounded-full bg-red-100 dark:bg-red-900/30 text-[#E96746] dark:text-[#F07856] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Target className="w-4 h-4" />
              </div>
              <span className={`text-xs font-bold ${primaryText}`}>
                Practice Quiz
              </span>
            </button>

            {/* Action 2: Review Notes */}
            <button
              onClick={() => setActiveTab('tracks')}
              className={`p-3 rounded-2xl border flex flex-col items-center justify-center text-center gap-2 transition cursor-pointer hover:border-blue-500 group ${isDarkMode ? 'bg-[#0B1728] border-[#1E324F]' : 'bg-[#FFF8ED] border-[#EDE3D2]'}`}
            >
              <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-500 flex items-center justify-center group-hover:scale-105 transition-transform">
                <FileText className="w-4 h-4" />
              </div>
              <span className={`text-xs font-bold ${primaryText}`}>
                Review Notes
              </span>
            </button>

            {/* Action 3: See Leaderboard */}
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`p-3 rounded-2xl border flex flex-col items-center justify-center text-center gap-2 transition cursor-pointer hover:border-amber-500 group ${isDarkMode ? 'bg-[#0B1728] border-[#1E324F]' : 'bg-[#FFF8ED] border-[#EDE3D2]'}`}
            >
              <div className="w-9 h-9 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-500 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Trophy className="w-4 h-4" />
              </div>
              <span className={`text-xs font-bold ${primaryText}`}>
                See Leaderboard
              </span>
            </button>

            {/* Action 4: Update Profile */}
            <button
              onClick={() => setActiveTab('profile')}
              className={`p-3 rounded-2xl border flex flex-col items-center justify-center text-center gap-2 transition cursor-pointer hover:border-emerald-500 group ${isDarkMode ? 'bg-[#0B1728] border-[#1E324F]' : 'bg-[#FFF8ED] border-[#EDE3D2]'}`}
            >
              <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 flex items-center justify-center group-hover:scale-105 transition-transform">
                <User className="w-4 h-4" />
              </div>
              <span className={`text-xs font-bold ${primaryText}`}>
                Update Profile
              </span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
