import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Trophy,
  Brain,
  Award,
  Clock,
  BookOpen,
  AlertCircle,
  Lock,
  ShieldCheck,
  GraduationCap,
  Shield
} from 'lucide-react';
import { QuizQuestion, Lesson, UserProfile, UserRole } from '../types';
import {
  XP_REWARDS,
  isDifficultyUnlocked,
  getUnlockedDifficulties,
  DIFFICULTY_TIERS,
  QuestionDifficulty,
  getDifficultyDisplayLabel,
  getDifficultyRequirementLabel,
  LEVEL_TIERS
} from '../services/gamification';
import { getEnhancedExplanation } from '../services/explanationHelper';

interface QuizModalProps {
  lesson: Lesson | null;
  questions: QuizQuestion[];
  userProfile?: UserProfile;
  currentRole?: UserRole;
  isOpen: boolean;
  onClose: () => void;
  onQuizComplete: (
    results: {
      lessonId?: string;
      totalAnswered: number;
      correctCount: number;
      earnedXp: number;
      isPerfect: boolean;
      wrongQuestions: QuizQuestion[];
    }
  ) => void;
  onNavigateToPractice?: () => void;
  isDarkMode?: boolean;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  lesson,
  questions,
  userProfile,
  currentRole = 'user',
  isOpen,
  onClose,
  onQuizComplete,
  onNavigateToPractice,
  isDarkMode = false
}) => {
  // Quiz phases: 'intro' | 'active' | 'results'
  const [quizPhase, setQuizPhase] = useState<'intro' | 'active' | 'results'>('intro');
  const [activeSessionLength, setActiveSessionLength] = useState<number>(5);
  const [sessionQuestions, setSessionQuestions] = useState<QuizQuestion[]>([]);
  const [selectedDifficultyFilter, setSelectedDifficultyFilter] = useState<'all' | QuestionDifficulty>('all');
  const [difficultyNotice, setDifficultyNotice] = useState<string | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongQuestions, setWrongQuestions] = useState<QuizQuestion[]>([]);

  // Timer tracking
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isXpAwarded, setIsXpAwarded] = useState(false);
  const [sessionAwardedXp, setSessionAwardedXp] = useState<number>(0);
  const [isRepeatAttempt, setIsRepeatAttempt] = useState<boolean>(false);

  // Career rank & difficulty calculations
  const studentLevel = userProfile?.level ?? 1;
  const currentRankInfo = LEVEL_TIERS.find((t) => t.level === studentLevel) || LEVEL_TIERS[0];
  const isAdmin = currentRole === 'admin';

  // Determine difficulty unlock statuses for this user
  const isIntermediateUnlocked = isAdmin || studentLevel >= 4;
  const isHardUnlocked = isAdmin || studentLevel >= 6;

  // Question counts in current pool
  const countEasy = useMemo(() => questions.filter((q) => q.difficulty === 'beginner').length, [questions]);
  const countIntermediate = useMemo(() => questions.filter((q) => q.difficulty === 'intermediate').length, [questions]);
  const countHard = useMemo(() => questions.filter((q) => q.difficulty === 'advanced').length, [questions]);

  // Questions unlocked for this user
  const unlockedQuestions = useMemo(() => {
    return questions.filter((q) => isDifficultyUnlocked(q.difficulty, studentLevel, currentRole));
  }, [questions, studentLevel, currentRole]);

  // Questions matching active difficulty filter
  const activeFilteredQuestions = useMemo(() => {
    if (selectedDifficultyFilter === 'all') return unlockedQuestions;
    return unlockedQuestions.filter((q) => q.difficulty === selectedDifficultyFilter);
  }, [unlockedQuestions, selectedDifficultyFilter]);

  // Initialize questions session on open
  useEffect(() => {
    if (isOpen && questions.length > 0) {
      setQuizPhase('intro');
      setCurrentIndex(0);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setCorrectCount(0);
      setWrongQuestions([]);
      setIsXpAwarded(false);
      setSessionAwardedXp(0);
      setIsRepeatAttempt(false);
      setElapsedSeconds(0);
      setSelectedDifficultyFilter('all');
      setDifficultyNotice(null);
      const unlockedCount = questions.filter((q) =>
        isDifficultyUnlocked(q.difficulty, userProfile?.level ?? 1, currentRole)
      ).length;
      setActiveSessionLength(Math.min(5, Math.max(1, unlockedCount)));
    }
  }, [isOpen, questions, userProfile?.level, currentRole]);

  // Elapsed timer during active quiz
  useEffect(() => {
    let timer: any;
    if (quizPhase === 'active') {
      timer = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [quizPhase]);

  if (!isOpen || !lesson || questions.length === 0) return null;

  const handleStartQuiz = () => {
    if (activeFilteredQuestions.length === 0) {
      setDifficultyNotice('No unlocked questions available for the selected difficulty at your current rank.');
      return;
    }
    const subset = activeFilteredQuestions.slice(0, activeSessionLength);
    setSessionQuestions(subset);
    setQuizPhase('active');
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setCorrectCount(0);
    setWrongQuestions([]);
    setIsXpAwarded(false);
  };

  const currentQuestion = sessionQuestions[currentIndex] || questions[0];
  const progressPercent = Math.round(
    ((currentIndex + (isAnswerSubmitted ? 1 : 0)) / sessionQuestions.length) * 100
  );

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);

    const isCorrect = selectedOption === currentQuestion.correctOptionIndex;
    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
    } else {
      setWrongQuestions((prev) => [...prev, currentQuestion]);
    }
  };

  const handleContinueToNext = () => {
    if (currentIndex < sessionQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      // Quiz finished
      setQuizPhase('results');
      if (!isXpAwarded) {
        setIsXpAwarded(true);
        const finalCorrect = correctCount;
        const isPerfect = finalCorrect === sessionQuestions.length;
        const baseEarned = finalCorrect * XP_REWARDS.QUIZ_CORRECT_ANSWER;
        const bonus = isPerfect ? XP_REWARDS.PERFECT_QUIZ_BONUS : 0;
        const totalEarnedXp = baseEarned + bonus;

        const previousRecord =
          lesson?.id && userProfile?.lessonQuizRecords
            ? userProfile.lessonQuizRecords[lesson.id]
            : undefined;
        const previousBestXp = previousRecord ? previousRecord.bestEarnedXp : 0;
        const actualAwarded = previousRecord
          ? Math.max(0, totalEarnedXp - previousBestXp)
          : totalEarnedXp;

        setSessionAwardedXp(actualAwarded);
        setIsRepeatAttempt(Boolean(previousRecord));

        onQuizComplete({
          lessonId: lesson?.id,
          totalAnswered: sessionQuestions.length,
          correctCount: finalCorrect,
          earnedXp: totalEarnedXp,
          isPerfect,
          wrongQuestions
        });
      }
    }
  };

  const handleRestartQuiz = () => {
    setQuizPhase('intro');
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setCorrectCount(0);
    setWrongQuestions([]);
    setIsXpAwarded(false);
    setSessionAwardedXp(0);
    setIsRepeatAttempt(false);
    setElapsedSeconds(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  const isCurrentCorrect = isAnswerSubmitted && selectedOption === currentQuestion.correctOptionIndex;
  const enhancedExplanation = getEnhancedExplanation(currentQuestion);

  // Group wrong questions by topic tags to show topics needing improvement
  const topicsNeedingReview = Array.from(new Set(wrongQuestions.map((q) => q.topicTag)));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div
        className={`relative w-full max-w-2xl rounded-3xl shadow-2xl border overflow-hidden flex flex-col max-h-[92vh] transition-colors ${
          isDarkMode
            ? 'bg-[#0B192C] border-[#1E3A5F] text-[#E2E8F0]'
            : 'bg-[#FFF8ED] border-[#E8F0F8] text-[#263238]'
        }`}
      >
        {/* --- 1. QUIZ INTRODUCTION PHASE --- */}
        {quizPhase === 'intro' && (
          <div className="flex flex-col h-full">
            {/* Header */}
            <div
              className={`p-6 text-white flex items-center justify-between border-b ${
                isDarkMode ? 'bg-[#132238] border-[#1E3A5F]' : 'bg-[#173B63] border-[#173B63]'
              }`}
            >
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#F07856] bg-[#FCE5DC]/20 px-2.5 py-0.5 rounded-md">
                  Practice Assessment
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#FFF8ED]">
                  {lesson.title}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#FFF8ED] transition focus:outline-hidden"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Intro Details */}
            <div
              className={`p-6 sm:p-8 space-y-6 overflow-y-auto ${
                isDarkMode ? 'bg-[#0B192C] text-[#E2E8F0]' : 'bg-[#FFF8ED] text-[#263238]'
              }`}
            >
              {/* Module & Topic Header Card */}
              <div
                className={`p-5 rounded-2xl border shadow-2xs space-y-3 ${
                  isDarkMode ? 'bg-[#132238] border-[#1E3A5F]' : 'bg-white border-[#E8F0F8]'
                }`}
              >
                <div
                  className={`flex items-center gap-2 font-bold text-sm ${
                    isDarkMode ? 'text-[#FFF8ED]' : 'text-[#173B63]'
                  }`}
                >
                  <BookOpen className="w-4 h-4 text-[#F07856]" />
                  <span>Topic: {lesson.term}</span>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed">
                  Evaluate your conceptual mastery through active retrieval questions. Questions unlock automatically as you advance through the six career ranks.
                </p>
              </div>

              {/* Career Rank & Difficulty Access Section */}
              <div
                className={`p-5 rounded-2xl border space-y-4 shadow-2xs ${
                  isDarkMode ? 'bg-[#132238] border-[#1E3A5F]' : 'bg-white border-[#EDE3D2]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-200 dark:border-slate-700/60">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#E96746]/10 dark:bg-[#F07856]/20 text-[#E96746] dark:text-[#F07856] flex items-center justify-center font-bold">
                      {isAdmin ? <Shield className="w-4 h-4" /> : <GraduationCap className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-[#E96746] dark:text-[#F07856]">
                        {isAdmin ? 'Faculty Administrator' : `Current Rank: ${currentRankInfo.title} (Level ${studentLevel})`}
                      </div>
                      <div className={`text-xs ${isDarkMode ? 'text-[#C1CDDC]' : 'text-[#52647A]'}`}>
                        {isAdmin
                          ? 'Admin Exemption: Unrestricted access to all Easy, Intermediate, and Hard questions.'
                          : studentLevel <= 3
                          ? 'Access to Easy questions only • Intermediate unlocks at Vice President • Hard unlocks at CFO'
                          : studentLevel <= 5
                          ? 'Easy & Intermediate questions unlocked • Hard questions unlock at CFO'
                          : 'CFO Master Rank: All difficulty levels (Easy, Intermediate, Hard) unlocked!'}
                      </div>
                    </div>
                  </div>

                  {isAdmin ? (
                    <span className="self-start sm:self-auto px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                      Admin Exempt
                    </span>
                  ) : (
                    <span className="self-start sm:self-auto px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                      {unlockedQuestions.length} Questions Unlocked
                    </span>
                  )}
                </div>

                {/* Difficulty Selector Tabs */}
                <div>
                  <label
                    className={`block text-xs font-bold uppercase tracking-wider mb-2 ${
                      isDarkMode ? 'text-[#FFF8ED]' : 'text-[#173B63]'
                    }`}
                  >
                    Select Question Difficulty:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {/* All Unlocked Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDifficultyFilter('all');
                        setDifficultyNotice(null);
                        setActiveSessionLength(Math.min(5, Math.max(1, unlockedQuestions.length)));
                      }}
                      className={`p-3 rounded-xl border text-left flex flex-col justify-between transition cursor-pointer ${
                        selectedDifficultyFilter === 'all'
                          ? 'border-[#E96746] dark:border-[#F07856] bg-[#FEF6F3] dark:bg-[#1E2E42] shadow-xs'
                          : isDarkMode
                          ? 'border-[#1E3A5F] bg-[#0B192C] hover:border-slate-600'
                          : 'border-[#EDE3D2] bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold">All Unlocked</span>
                        <CheckCircle2 className={`w-3.5 h-3.5 ${selectedDifficultyFilter === 'all' ? 'text-[#E96746] dark:text-[#F07856]' : 'opacity-40'}`} />
                      </div>
                      <span className={`text-[11px] mt-1 ${isDarkMode ? 'text-[#C1CDDC]' : 'text-[#52647A]'}`}>
                        {unlockedQuestions.length} Available
                      </span>
                    </button>

                    {/* Easy (Beginner) Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDifficultyFilter('beginner');
                        setDifficultyNotice(null);
                        setActiveSessionLength(Math.min(5, Math.max(1, countEasy)));
                      }}
                      className={`p-3 rounded-xl border text-left flex flex-col justify-between transition cursor-pointer ${
                        selectedDifficultyFilter === 'beginner'
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 shadow-xs'
                          : isDarkMode
                          ? 'border-[#1E3A5F] bg-[#0B192C] hover:border-slate-600'
                          : 'border-[#EDE3D2] bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400">Easy</span>
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Unlocked ✓</span>
                      </div>
                      <span className={`text-[11px] mt-1 ${isDarkMode ? 'text-[#C1CDDC]' : 'text-[#52647A]'}`}>
                        {countEasy} Qs (Intern+)
                      </span>
                    </button>

                    {/* Intermediate Button */}
                    <button
                      type="button"
                      onClick={() => {
                        if (!isIntermediateUnlocked) {
                          setDifficultyNotice('🔒 Intermediate questions are locked. They unlock at Vice President (Level 4, 1,000 XP). Complete lessons to rank up!');
                          return;
                        }
                        setSelectedDifficultyFilter('intermediate');
                        setDifficultyNotice(null);
                        setActiveSessionLength(Math.min(5, Math.max(1, countIntermediate)));
                      }}
                      className={`p-3 rounded-xl border text-left flex flex-col justify-between transition ${
                        isIntermediateUnlocked
                          ? selectedDifficultyFilter === 'intermediate'
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 shadow-xs cursor-pointer'
                            : isDarkMode
                            ? 'border-[#1E3A5F] bg-[#0B192C] hover:border-slate-600 cursor-pointer'
                            : 'border-[#EDE3D2] bg-slate-50 hover:border-slate-300 cursor-pointer'
                          : 'border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-[#0B1626] opacity-65 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-extrabold ${isIntermediateUnlocked ? 'text-blue-700 dark:text-blue-400' : 'text-slate-500'}`}>
                          Intermediate
                        </span>
                        {isIntermediateUnlocked ? (
                          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">Unlocked ✓</span>
                        ) : (
                          <Lock className="w-3.5 h-3.5 text-slate-400" />
                        )}
                      </div>
                      <span className={`text-[11px] mt-1 ${isDarkMode ? 'text-[#C1CDDC]' : 'text-[#52647A]'}`}>
                        {isIntermediateUnlocked ? `${countIntermediate} Qs (VP+)` : 'Unlocks at VP'}
                      </span>
                    </button>

                    {/* Hard (Advanced) Button */}
                    <button
                      type="button"
                      onClick={() => {
                        if (!isHardUnlocked) {
                          setDifficultyNotice('🔒 Hard questions are locked. They unlock at Chief Financial Officer (CFO, Level 6, 3,500 XP). Complete lessons to rank up!');
                          return;
                        }
                        setSelectedDifficultyFilter('advanced');
                        setDifficultyNotice(null);
                        setActiveSessionLength(Math.min(5, Math.max(1, countHard)));
                      }}
                      className={`p-3 rounded-xl border text-left flex flex-col justify-between transition ${
                        isHardUnlocked
                          ? selectedDifficultyFilter === 'advanced'
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/40 shadow-xs cursor-pointer'
                            : isDarkMode
                            ? 'border-[#1E3A5F] bg-[#0B192C] hover:border-slate-600 cursor-pointer'
                            : 'border-[#EDE3D2] bg-slate-50 hover:border-slate-300 cursor-pointer'
                          : 'border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-[#0B1626] opacity-65 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-extrabold ${isHardUnlocked ? 'text-purple-700 dark:text-purple-400' : 'text-slate-500'}`}>
                          Hard
                        </span>
                        {isHardUnlocked ? (
                          <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400">Unlocked ✓</span>
                        ) : (
                          <Lock className="w-3.5 h-3.5 text-slate-400" />
                        )}
                      </div>
                      <span className={`text-[11px] mt-1 ${isDarkMode ? 'text-[#C1CDDC]' : 'text-[#52647A]'}`}>
                        {isHardUnlocked ? `${countHard} Qs (CFO)` : 'Unlocks at CFO'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Locked Difficulty Notice Alert */}
                {difficultyNotice && (
                  <div className="p-3.5 rounded-xl border border-amber-300 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 text-xs flex items-center justify-between gap-3 animate-in fade-in duration-200">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                      <span>{difficultyNotice}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDifficultyNotice(null)}
                      className="text-amber-700 dark:text-amber-300 hover:underline font-bold text-[11px] shrink-0"
                    >
                      Dismiss
                    </button>
                  </div>
                )}
              </div>

              {/* Previous Attempt Performance Card if retaking */}
              {lesson?.id && userProfile?.lessonQuizRecords?.[lesson.id] && (
                <div
                  className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                    isDarkMode
                      ? 'bg-[#132238] border-[#1E3A5F] text-[#E8F0F8]'
                      : 'bg-[#E8F0F8] border-[#173B63]/20 text-[#173B63]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Trophy className="w-4 h-4 text-amber-500 shrink-0" />
                    <div>
                      <span className="font-extrabold block sm:inline">
                        Previous Best: {userProfile.lessonQuizRecords[lesson.id].bestScore}/{userProfile.lessonQuizRecords[lesson.id].totalQuestions} Correct
                      </span>
                      <span className="opacity-80 sm:ml-1.5 block sm:inline">
                        ({userProfile.lessonQuizRecords[lesson.id].bestEarnedXp} XP claimed)
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-700 dark:text-amber-300 self-start sm:self-auto">
                    Retake for Mastery
                  </span>
                </div>
              )}

              {/* Quiz Parameters */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div
                  className={`p-4 rounded-2xl border ${
                    isDarkMode ? 'bg-[#132238] border-[#1E3A5F]' : 'bg-white border-[#E8F0F8]'
                  }`}
                >
                  <span
                    className={`text-xs font-bold uppercase block ${
                      isDarkMode ? 'text-[#E8F0F8]/60' : 'text-[#263238]/60'
                    }`}
                  >
                    Eligible Questions
                  </span>
                  <span
                    className={`text-xl font-extrabold mt-1 block ${
                      isDarkMode ? 'text-[#FFF8ED]' : 'text-[#173B63]'
                    }`}
                  >
                    {activeFilteredQuestions.length} Qs
                  </span>
                </div>
                <div
                  className={`p-4 rounded-2xl border ${
                    isDarkMode ? 'bg-[#132238] border-[#1E3A5F]' : 'bg-white border-[#E8F0F8]'
                  }`}
                >
                  <span
                    className={`text-xs font-bold uppercase block ${
                      isDarkMode ? 'text-[#E8F0F8]/60' : 'text-[#263238]/60'
                    }`}
                  >
                    Duration
                  </span>
                  <span
                    className={`text-xl font-extrabold mt-1 block ${
                      isDarkMode ? 'text-[#FFF8ED]' : 'text-[#173B63]'
                    }`}
                  >
                    ~{Math.max(2, Math.round(activeSessionLength * 1.2))}m
                  </span>
                </div>
                <div
                  className={`p-4 rounded-2xl border ${
                    isDarkMode ? 'bg-[#132238] border-[#1E3A5F]' : 'bg-white border-[#E8F0F8]'
                  }`}
                >
                  <span
                    className={`text-xs font-bold uppercase block ${
                      isDarkMode ? 'text-[#E8F0F8]/60' : 'text-[#263238]/60'
                    }`}
                  >
                    XP Potential
                  </span>
                  <span className="text-xl font-extrabold text-[#F07856] mt-1 block">
                    +{Math.min(activeSessionLength, activeFilteredQuestions.length) * XP_REWARDS.QUIZ_CORRECT_ANSWER} XP
                  </span>
                </div>
              </div>

              {/* Session Length Selector */}
              {activeFilteredQuestions.length > 5 && (
                <div
                  className={`p-4 rounded-2xl border space-y-2 ${
                    isDarkMode ? 'bg-[#132238] border-[#1E3A5F]' : 'bg-white border-[#E8F0F8]'
                  }`}
                >
                  <label
                    className={`text-xs font-bold uppercase tracking-wider block ${
                      isDarkMode ? 'text-[#FFF8ED]' : 'text-[#173B63]'
                    }`}
                  >
                    Choose Questions Per Session:
                  </label>
                  <div className="flex items-center gap-2">
                    {[5, 10, activeFilteredQuestions.length].map((count) => {
                      if (count > activeFilteredQuestions.length && count !== activeFilteredQuestions.length) return null;
                      const label = count === activeFilteredQuestions.length ? `All (${count})` : `${count} Questions`;
                      return (
                        <button
                          key={count}
                          type="button"
                          onClick={() => setActiveSessionLength(count)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition focus:outline-hidden ${
                            activeSessionLength === count
                              ? 'bg-[#F07856] text-white shadow-xs'
                              : isDarkMode
                              ? 'bg-[#0B192C] text-[#E8F0F8] hover:bg-[#1E3A5F]'
                              : 'bg-[#E8F0F8] text-[#173B63] hover:bg-[#173B63]/10'
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Footer with Start Action */}
            <div
              className={`p-4 sm:p-5 border-t flex items-center justify-between ${
                isDarkMode ? 'bg-[#132238] border-[#1E3A5F]' : 'bg-white border-[#E8F0F8]'
              }`}
            >
              <button
                onClick={onClose}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
                  isDarkMode ? 'text-[#E8F0F8]/70 hover:bg-[#1E3A5F]' : 'text-[#263238]/70 hover:bg-[#E8F0F8]'
                }`}
              >
                Cancel
              </button>
              <button
                disabled={activeFilteredQuestions.length === 0}
                onClick={handleStartQuiz}
                className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#F07856] hover:bg-[#D95D3B] disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-md shadow-[#F07856]/30 flex items-center gap-2 transition"
              >
                <span>Start Quiz Session</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* --- 2. ACTIVE QUIZ QUESTION PHASE --- */}
        {quizPhase === 'active' && (
          <div className="flex flex-col h-full">
            {/* Top Header / Progress */}
            <div
              className={`p-4 sm:p-5 border-b transition-colors ${
                isDarkMode ? 'bg-[#132238] border-[#1E3A5F]' : 'bg-white border-[#E8F0F8]'
              }`}
            >
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${
                      isDarkMode ? 'bg-[#1E3A5F] text-[#FFF8ED]' : 'bg-[#E8F0F8] text-[#173B63]'
                    }`}
                  >
                    {lesson.title}
                  </span>
                  <span
                    className={`text-xs font-bold ${
                      isDarkMode ? 'text-[#FFF8ED]' : 'text-[#173B63]'
                    }`}
                  >
                    Question {currentIndex + 1} of {sessionQuestions.length}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-medium flex items-center gap-1 ${
                      isDarkMode ? 'text-[#E8F0F8]/70' : 'text-[#263238]/70'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5 text-[#F07856]" />
                    <span>{formatTime(elapsedSeconds)}</span>
                  </span>
                  <button
                    onClick={onClose}
                    className={`p-1.5 rounded-lg transition ${
                      isDarkMode
                        ? 'text-[#E8F0F8]/50 hover:text-[#FFF8ED] hover:bg-[#1E3A5F]'
                        : 'text-[#263238]/50 hover:text-[#173B63] hover:bg-[#E8F0F8]'
                    }`}
                    title="Exit quiz"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Progress bar in Coral Orange */}
              <div
                className={`w-full h-2.5 rounded-full overflow-hidden ${
                  isDarkMode ? 'bg-[#0B192C]' : 'bg-[#E8F0F8]'
                }`}
              >
                <div
                  className="bg-[#F07856] h-full transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Quiz Body */}
            <div
              className={`p-5 sm:p-7 overflow-y-auto space-y-5 ${
                isDarkMode ? 'bg-[#0B192C] text-[#E2E8F0]' : 'bg-[#FFF8ED] text-[#263238]'
              }`}
            >
              {/* Optional Case / Scenario Banner */}
              {currentQuestion.scenario && (
                <div
                  className={`p-4 rounded-2xl border-l-4 border-[#F07856] shadow-2xs leading-relaxed text-xs sm:text-sm ${
                    isDarkMode ? 'bg-[#132238] text-[#E2E8F0]' : 'bg-white text-[#263238]'
                  }`}
                >
                  <span
                    className={`font-extrabold block mb-1 ${
                      isDarkMode ? 'text-[#FFF8ED]' : 'text-[#173B63]'
                    }`}
                  >
                    Corporate Scenario:
                  </span>
                  {currentQuestion.scenario}
                </div>
              )}

              {/* Question Prompt */}
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span
                    className={`inline-block text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${
                      isDarkMode
                        ? 'bg-[#1E3A5F] text-[#F07856] border-[#F07856]/30'
                        : 'bg-[#FCE5DC] text-[#F07856] border-[#F07856]/20'
                    }`}
                  >
                    {currentQuestion.topicTag}
                  </span>

                  {/* Difficulty Level Indicator */}
                  <span
                    className={`inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${
                      currentQuestion.difficulty === 'beginner'
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700/60'
                        : currentQuestion.difficulty === 'intermediate'
                        ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700/60'
                        : 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-700/60'
                    }`}
                  >
                    <span>
                      {currentQuestion.difficulty === 'beginner'
                        ? 'Easy'
                        : currentQuestion.difficulty === 'intermediate'
                        ? 'Intermediate'
                        : 'Hard'}
                    </span>
                    <span className="opacity-75 text-[10px] font-normal">
                      • {currentQuestion.difficulty === 'beginner' ? 'Intern+' : currentQuestion.difficulty === 'intermediate' ? 'VP+' : 'CFO'}
                    </span>
                  </span>

                  {isAdmin && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                      <Shield className="w-3 h-3" />
                      <span>Admin Preview</span>
                    </span>
                  )}
                </div>

                <h3
                  className={`text-lg sm:text-xl font-extrabold leading-snug ${
                    isDarkMode ? 'text-[#FFF8ED]' : 'text-[#173B63]'
                  }`}
                >
                  {currentQuestion.prompt}
                </h3>
              </div>

              {/* Answer Choices */}
              <div className="space-y-3" role="radiogroup">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === currentQuestion.correctOptionIndex;

                  let buttonStyle = isDarkMode
                    ? 'border-[#1E3A5F] bg-[#132238] hover:border-[#F07856]/40 text-[#E2E8F0]'
                    : 'border-[#E8F0F8] bg-white hover:border-[#173B63]/40 text-[#263238]';
                  let indicatorStyle = isDarkMode ? 'bg-[#0B192C] text-[#FFF8ED]' : 'bg-[#E8F0F8] text-[#173B63]';

                  if (isSelected && !isAnswerSubmitted) {
                    buttonStyle = isDarkMode
                      ? 'border-[#F07856] bg-[#1E3A5F] text-[#FFF8ED] ring-2 ring-[#F07856]/30'
                      : 'border-[#F07856] bg-[#FCE5DC]/40 text-[#173B63] ring-2 ring-[#F07856]/30';
                    indicatorStyle = 'bg-[#F07856] text-white border-[#F07856]';
                  }

                  if (isAnswerSubmitted) {
                    if (isCorrect) {
                      buttonStyle = 'border-[#16A34A] bg-[#DCFCE7] text-[#14532D] ring-2 ring-[#16A34A]/30 font-semibold';
                      indicatorStyle = 'bg-[#16A34A] text-white border-[#16A34A]';
                    } else if (isSelected && !isCorrect) {
                      buttonStyle = 'border-[#DC2626] bg-[#FEE2E2] text-[#7F1D1D] ring-2 ring-[#DC2626]/30';
                      indicatorStyle = 'bg-[#DC2626] text-white border-[#DC2626]';
                    } else {
                      buttonStyle = isDarkMode
                        ? 'border-[#1E3A5F] bg-[#132238] opacity-40 text-[#94A3B8]'
                        : 'border-[#E8F0F8] bg-white opacity-50 text-[#263238]/60';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isAnswerSubmitted}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all duration-200 text-sm sm:text-base font-medium shadow-2xs focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#F07856] card-interactive hover-lift ${buttonStyle} ${
                        isSelected && !isAnswerSubmitted ? 'scale-[1.01]' : ''
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 transition-transform duration-200 ${indicatorStyle} ${
                          isSelected ? 'scale-110' : ''
                        }`}
                      >
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <div className="flex-1 leading-snug">{option}</div>
                      {isAnswerSubmitted && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-[#16A34A] shrink-0 mt-0.5 animate-success-bounce" />
                      )}
                      {isAnswerSubmitted && isSelected && !isCorrect && (
                        <XCircle className="w-5 h-5 text-[#DC2626] shrink-0 mt-0.5 animate-shake" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Feedback and Pedagogical Explanation after submission */}
              {isAnswerSubmitted && (
                <div
                  className={`p-5 rounded-2xl border transition-all duration-300 ${
                    isCurrentCorrect
                      ? 'bg-[#DCFCE7] border-[#16A34A]/40 text-[#14532D] animate-success-bounce'
                      : 'bg-[#FEE2E2] border-[#DC2626]/40 text-[#7F1D1D] animate-shake'
                  }`}
                >
                  <div className="flex items-center gap-2 font-extrabold text-sm sm:text-base mb-1.5">
                    {isCurrentCorrect ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-[#16A34A]" />
                        <span className="text-[#14532D]">Correct! (+{XP_REWARDS.QUIZ_CORRECT_ANSWER} XP)</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-[#DC2626]" />
                        <span className="text-[#7F1D1D]">Incorrect Choice</span>
                      </>
                    )}
                  </div>

                  <div className="text-xs sm:text-sm leading-relaxed mb-2 font-medium">
                    {enhancedExplanation}
                  </div>

                  {!isCurrentCorrect && (
                    <div className="pt-2 border-t border-[#DC2626]/20 text-xs font-bold text-[#7F1D1D] flex items-center gap-1.5">
                      <Brain className="w-4 h-4 text-[#F07856] shrink-0 animate-pulse" />
                      <span>This question has been automatically queued to your Spaced Review Deck.</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Controls */}
            <div
              className={`p-4 sm:p-5 border-t flex items-center justify-between gap-3 ${
                isDarkMode ? 'bg-[#132238] border-[#1E3A5F]' : 'bg-white border-[#E8F0F8]'
              }`}
            >
              <span
                className={`text-xs font-medium ${
                  isDarkMode ? 'text-[#E8F0F8]/70' : 'text-[#263238]/70'
                }`}
              >
                {!isAnswerSubmitted
                  ? selectedOption === null
                    ? 'Select an answer option to proceed'
                    : 'Click Check Answer to confirm'
                  : 'Review the explanation before proceeding'}
              </span>

              <div>
                {!isAnswerSubmitted ? (
                  <button
                    disabled={selectedOption === null}
                    onClick={handleCheckAnswer}
                    className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#F07856] hover:bg-[#D95D3B] disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-md shadow-[#F07856]/25 transition"
                  >
                    Check Answer
                  </button>
                ) : (
                  <button
                    onClick={handleContinueToNext}
                    className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#F07856] hover:bg-[#D95D3B] text-white shadow-md shadow-[#F07856]/25 flex items-center gap-2 transition"
                  >
                    <span>
                      {currentIndex < sessionQuestions.length - 1
                        ? 'Continue to Next Question'
                        : 'Review Final Results'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- 3. RESULTS & PERFORMANCE REVIEW PHASE --- */}
        {quizPhase === 'results' && (
          <div
            className={`p-6 sm:p-8 text-center space-y-6 overflow-y-auto ${
              isDarkMode ? 'bg-[#0B192C] text-[#E2E8F0]' : 'bg-[#FFF8ED] text-[#263238]'
            }`}
          >
            <div
              className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center shadow-lg animate-pop ${
                isDarkMode
                  ? 'bg-[#132238] border border-[#1E3A5F]'
                  : 'bg-[#173B63] shadow-[#173B63]/20'
              }`}
            >
              <Trophy className="w-10 h-10 text-[#F07856] animate-pulse" />
            </div>

            <div className="animate-fade-in-up">
              <h3
                className={`text-2xl sm:text-3xl font-extrabold ${
                  isDarkMode ? 'text-[#FFF8ED]' : 'text-[#173B63]'
                }`}
              >
                Quiz Assessment Completed!
              </h3>
              <p
                className={`text-sm mt-1 ${
                  isDarkMode ? 'text-[#E8F0F8]/80' : 'text-[#263238]/80'
                }`}
              >
                You evaluated your understanding of{' '}
                <span className={`font-bold ${isDarkMode ? 'text-[#FFF8ED]' : 'text-[#173B63]'}`}>
                  {lesson.term}
                </span>.
              </p>
            </div>

            {/* Score Metrics Grid with Staggered Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto">
              <div
                className={`p-3.5 rounded-2xl border card-interactive hover-lift animate-fade-in-up stagger-1 ${
                  isDarkMode ? 'bg-[#132238] border-[#1E3A5F]' : 'bg-white border-[#E8F0F8]'
                }`}
              >
                <span
                  className={`text-xs font-bold block ${
                    isDarkMode ? 'text-[#E8F0F8]/70' : 'text-[#263238]/70'
                  }`}
                >
                  Score
                </span>
                <span
                  className={`text-xl sm:text-2xl font-extrabold ${
                    isDarkMode ? 'text-[#FFF8ED]' : 'text-[#173B63]'
                  }`}
                >
                  {correctCount} / {sessionQuestions.length}
                </span>
              </div>
              <div
                className={`p-3.5 rounded-2xl border card-interactive hover-lift animate-fade-in-up stagger-2 ${
                  isDarkMode ? 'bg-[#132238] border-[#1E3A5F]' : 'bg-white border-[#E8F0F8]'
                }`}
              >
                <span
                  className={`text-xs font-bold block ${
                    isDarkMode ? 'text-[#E8F0F8]/70' : 'text-[#263238]/70'
                  }`}
                >
                  Accuracy
                </span>
                <span
                  className={`text-xl sm:text-2xl font-extrabold ${
                    isDarkMode ? 'text-[#FFF8ED]' : 'text-[#173B63]'
                  }`}
                >
                  {Math.round((correctCount / sessionQuestions.length) * 100)}%
                </span>
              </div>
              <div
                className={`p-3.5 rounded-2xl border card-interactive hover-lift animate-fade-in-up stagger-3 ${
                  isDarkMode ? 'bg-[#132238] border-[#1E3A5F]' : 'bg-white border-[#E8F0F8]'
                }`}
              >
                <span
                  className={`text-xs font-bold block ${
                    isDarkMode ? 'text-[#E8F0F8]/70' : 'text-[#263238]/70'
                  }`}
                >
                  Time Taken
                </span>
                <span
                  className={`text-xl sm:text-2xl font-extrabold ${
                    isDarkMode ? 'text-[#FFF8ED]' : 'text-[#173B63]'
                  }`}
                >
                  {formatTime(elapsedSeconds)}
                </span>
              </div>
              <div
                className={`p-3.5 rounded-2xl border card-interactive hover-lift animate-fade-in-up stagger-4 ${
                  isDarkMode ? 'bg-[#132238] border-[#F07856]/40' : 'bg-white border-[#FCE5DC]'
                }`}
              >
                <span className="text-xs text-[#F07856] font-bold block">XP Awarded</span>
                <span className="text-xl sm:text-2xl font-extrabold text-[#F07856] flex items-center justify-center gap-1 animate-pop">
                  <Sparkles className="w-4 h-4" />
                  +{sessionAwardedXp}
                </span>
                {isRepeatAttempt && (
                  <span className="text-[10px] font-medium block mt-0.5 opacity-80">
                    {sessionAwardedXp > 0 ? '(Improvement Bonus)' : '(Practice Mode: 0 XP)'}
                  </span>
                )}
              </div>
            </div>

            {/* Repeat Attempt Scoring Policy Notification */}
            {isRepeatAttempt && sessionAwardedXp === 0 && (
              <div
                className={`p-3.5 rounded-2xl border max-w-lg mx-auto text-xs leading-relaxed text-center ${
                  isDarkMode
                    ? 'bg-[#132238]/60 border-[#1E3A5F] text-[#E8F0F8]/80'
                    : 'bg-[#FFF8ED] border-[#EDE3D2] text-[#263238]/80'
                }`}
              >
                <span>
                  💡 <strong>Scoring Policy:</strong> You previously achieved maximum XP on this quiz. Retakes allow unlimited mastery practice, and bonus XP is awarded whenever you improve your previous high score!
                </span>
              </div>
            )}

            {/* Topics to Strengthen (if any wrong) */}
            {topicsNeedingReview.length > 0 ? (
              <div
                className={`p-4 rounded-2xl border text-left max-w-lg mx-auto space-y-2 ${
                  isDarkMode ? 'bg-[#132238] border-[#F07856]/40' : 'bg-white border-[#FCE5DC]'
                }`}
              >
                <div
                  className={`flex items-center gap-2 font-bold text-xs uppercase tracking-wider ${
                    isDarkMode ? 'text-[#FFF8ED]' : 'text-[#173B63]'
                  }`}
                >
                  <AlertCircle className="w-4 h-4 text-[#F07856]" />
                  <span>Concepts Queued for Reinforcement:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {topicsNeedingReview.map((t, i) => (
                    <span
                      key={i}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${
                        isDarkMode
                          ? 'bg-[#0B192C] text-[#E8F0F8] border-[#1E3A5F]'
                          : 'bg-[#FFF8ED] text-[#173B63] border-[#E8F0F8]'
                      }`}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-[#DCFCE7] border border-[#16A34A]/30 text-[#14532D] text-xs sm:text-sm font-bold max-w-lg mx-auto flex items-center justify-center gap-2">
                <Award className="w-5 h-5 text-[#16A34A]" />
                <span>Flawless Accuracy! +{XP_REWARDS.PERFECT_QUIZ_BONUS} Perfect Quiz Bonus awarded.</span>
              </div>
            )}

            {/* Results Actions */}
            <div
              className={`pt-4 border-t flex flex-wrap items-center justify-between gap-3 max-w-lg mx-auto ${
                isDarkMode ? 'border-[#1E3A5F]' : 'border-[#E8F0F8]'
              }`}
            >
              <button
                onClick={handleRestartQuiz}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 ${
                  isDarkMode ? 'text-[#E8F0F8] hover:bg-[#1E3A5F]' : 'text-[#173B63] hover:bg-[#E8F0F8]'
                }`}
              >
                <RotateCcw className="w-4 h-4 text-[#F07856]" />
                <span>Practise Again</span>
              </button>

              <div className="flex items-center gap-2">
                {wrongQuestions.length > 0 && onNavigateToPractice && (
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateToPractice();
                    }}
                    className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition flex items-center gap-1.5 ${
                      isDarkMode
                        ? 'bg-[#1E3A5F] hover:bg-[#F07856] text-[#FFF8ED] border-[#1E3A5F]'
                        : 'bg-[#E8F0F8] hover:bg-[#173B63] hover:text-white text-[#173B63] border-[#173B63]/20'
                    }`}
                  >
                    <Brain className="w-4 h-4 text-[#F07856]" />
                    <span>Review Mistakes</span>
                  </button>
                )}

                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#F07856] hover:bg-[#D95D3B] text-white shadow-md shadow-[#F07856]/25 transition"
                >
                  Resume Learning
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
