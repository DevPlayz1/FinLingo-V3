import React, { useState, useEffect } from 'react';
import {
  Shield,
  Lock,
  Unlock,
  Edit3,
  Search,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Trophy,
  BookOpen,
  HelpCircle,
  Save,
  X,
  Plus,
  Flame,
  Award,
  ArrowRight,
  Trash2,
  Eye,
  EyeOff,
  Check
} from 'lucide-react';
import {
  UserRole,
  Lesson,
  QuizQuestion,
  LeaderboardEntry,
  TrackId,
  UserProfile
} from '../types';
import { dataService } from '../services/dataService';
import { UserAvatar } from './UserAvatar';
import { PROF_ANJALI_SANE_AVATAR } from '../assets/adminAvatar';

interface AdminPanelProps {
  currentRole: UserRole;
  lessons: Lesson[];
  leaderboard: LeaderboardEntry[];
  userProfile: UserProfile;
  onRefreshData: () => void;
  onSwitchRole?: (newRole: UserRole) => void;
  onOpenRoleSelection?: () => void;
  onUnauthorized?: () => void;
  showToast: (title: string, xp?: number, icon?: 'xp' | 'success' | 'streak' | 'info') => void;
  isDarkMode?: boolean;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  currentRole,
  lessons,
  leaderboard,
  userProfile,
  onRefreshData,
  onUnauthorized,
  showToast,
  isDarkMode = false
}) => {
  // Application Logic RBAC enforcement
  useEffect(() => {
    if (currentRole !== 'admin') {
      onUnauthorized?.();
    }
  }, [currentRole, onUnauthorized]);

  if (currentRole !== 'admin') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div
          className={`rounded-3xl p-8 sm:p-12 border text-center space-y-4 shadow-lg ${
            isDarkMode
              ? 'bg-[#12233A] border-rose-500/40 text-[#FFF8ED]'
              : 'bg-white border-rose-200 text-[#263238]'
          }`}
        >
          <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center bg-rose-500/10 border border-rose-500/20 text-rose-500">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-rose-500">
              403 Forbidden • Session Terminated
            </span>
            <h1 className="text-2xl font-black mt-1">Admin Authorization Required</h1>
            <p
              className={`max-w-lg mx-auto text-sm mt-2 leading-relaxed ${
                isDarkMode ? 'text-[#C1CDDC]' : 'text-[#52647A]'
              }`}
            >
              Unauthorized access to Admin Panel detected. User session has been cleared. Redirecting to login...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Active Admin Sub-Tab
  const [adminTab, setAdminTab] = useState<'lessons' | 'questions' | 'leaderboard' | 'security'>('lessons');

  // Lessons tab state
  const [lessonTrackFilter, setLessonTrackFilter] = useState<'all' | TrackId>('all');
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

  // Questions tab state
  const [questionSearch, setQuestionSearch] = useState('');
  const [questionTrackFilter, setQuestionTrackFilter] = useState<'all' | TrackId>('all');
  const [questionSourceFilter, setQuestionSourceFilter] = useState<'all' | 'admin' | 'original'>('all');
  const [questionStatusFilter, setQuestionStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);
  const [isCreateQuestionOpen, setIsCreateQuestionOpen] = useState(false);
  const [createFormError, setCreateFormError] = useState<string | null>(null);
  const [questionToDelete, setQuestionToDelete] = useState<QuizQuestion | null>(null);

  // New question form state
  const [newQuestionForm, setNewQuestionForm] = useState<{
    trackId: TrackId;
    lessonId: string;
    topicTag: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    xpPoints: number;
    prompt: string;
    scenario: string;
    options: string[];
    correctOptionIndex: number;
    explanation: string;
    isPublished: boolean;
  }>({
    trackId: 'accounting',
    lessonId: 'acc-1',
    topicTag: 'Financial Statements',
    difficulty: 'intermediate',
    xpPoints: 20,
    prompt: '',
    scenario: '',
    options: ['', '', '', ''],
    correctOptionIndex: 0,
    explanation: '',
    isPublished: true
  });

  // Leaderboard edit state
  const [editingEntry, setEditingEntry] = useState<LeaderboardEntry | null>(null);
  const [demoUserXpInput, setDemoUserXpInput] = useState<number>(userProfile.currentXp);
  const [resetModalOpen, setResetModalOpen] = useState(false);

  useEffect(() => {
    setDemoUserXpInput(userProfile.currentXp);
  }, [userProfile.currentXp]);

  // 1. Toggle restricted status on a lesson
  const handleToggleLessonRestriction = (lesson: Lesson) => {
    const newStatus = !lesson.isAdminOnly;
    const success = dataService.toggleLessonAdminOnly(lesson.id, newStatus, currentRole);
    if (success) {
      onRefreshData();
      showToast(
        newStatus ? `Lesson marked Admin-Only: ${lesson.title}` : `Lesson unlocked for Users: ${lesson.title}`,
        undefined,
        'success'
      );
    } else {
      showToast('Error: Unauthorized to modify lesson', undefined, 'xp');
    }
  };

  // 2. Save edited lesson
  const handleSaveLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLesson) return;
    const success = dataService.updateLesson(
      editingLesson.id,
      {
        title: editingLesson.title,
        shortDefinition: editingLesson.shortDefinition,
        xpValue: Number(editingLesson.xpValue),
        estimatedMinutes: Number(editingLesson.estimatedMinutes),
        proTip: editingLesson.proTip
      },
      currentRole
    );
    if (success) {
      setEditingLesson(null);
      onRefreshData();
      showToast('Lesson Updated Successfully', undefined, 'success');
    }
  };

  // 3A. Toggle publish / draft state for a question
  const handleTogglePublishQuestion = (question: QuizQuestion) => {
    const success = dataService.togglePublishQuestion(question.id, currentRole);
    if (success) {
      onRefreshData();
      const newStatus = question.isPublished === false ? 'Published & Live' : 'Moved to Drafts';
      showToast(`Question ${newStatus}`, undefined, 'success');
    } else {
      showToast('Error updating question status', undefined, 'info');
    }
  };

  // 3B. Delete question
  const handleConfirmDeleteQuestion = () => {
    if (!questionToDelete) return;
    const success = dataService.deleteQuestion(questionToDelete.id, currentRole);
    if (success) {
      if (editingQuestion?.id === questionToDelete.id) {
        setEditingQuestion(null);
      }
      setQuestionToDelete(null);
      onRefreshData();
      showToast(
        questionToDelete.source === 'admin'
          ? 'Custom Question Deleted'
          : 'Question Archived from Student Quizzes',
        undefined,
        'success'
      );
    } else {
      showToast('Error deleting question', undefined, 'info');
    }
  };

  // 3C. Create brand-new custom question
  const handleCreateCustomQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    setCreateFormError(null);

    // Validation
    if (newQuestionForm.prompt.trim().length < 5) {
      setCreateFormError('Question prompt must be at least 5 characters long.');
      return;
    }
    const cleanOptions = newQuestionForm.options.map((o) => o.trim()).filter(Boolean);
    if (cleanOptions.length < 2) {
      setCreateFormError('Please provide at least 2 distinct answer options.');
      return;
    }
    if (newQuestionForm.correctOptionIndex < 0 || newQuestionForm.correctOptionIndex >= cleanOptions.length) {
      setCreateFormError('Please select a valid correct answer option.');
      return;
    }
    if (newQuestionForm.explanation.trim().length < 5) {
      setCreateFormError('Please enter an explanatory rationale for student feedback (at least 5 characters).');
      return;
    }

    const result = dataService.createCustomQuestion(
      {
        trackId: newQuestionForm.trackId,
        lessonId: newQuestionForm.lessonId,
        topicTag: newQuestionForm.topicTag.trim() || 'General Business',
        difficulty: newQuestionForm.difficulty,
        xpPoints: Number(newQuestionForm.xpPoints) || 20,
        prompt: newQuestionForm.prompt.trim(),
        scenario: newQuestionForm.scenario.trim() || undefined,
        options: cleanOptions,
        correctOptionIndex: newQuestionForm.correctOptionIndex,
        explanation: newQuestionForm.explanation.trim(),
        isPublished: newQuestionForm.isPublished
      },
      currentRole
    );

    if (result.success) {
      setIsCreateQuestionOpen(false);
      setNewQuestionForm({
        trackId: 'accounting',
        lessonId: 'acc-1',
        topicTag: 'Financial Statements',
        difficulty: 'intermediate',
        xpPoints: 20,
        prompt: '',
        scenario: '',
        options: ['', '', '', ''],
        correctOptionIndex: 0,
        explanation: '',
        isPublished: true
      });
      onRefreshData();
      showToast(
        newQuestionForm.isPublished ? 'Custom Question Published & Live for Quizzes!' : 'Custom Question Saved as Draft',
        newQuestionForm.xpPoints,
        'xp'
      );
    } else {
      setCreateFormError(result.error || 'Failed to create question');
    }
  };

  // 3D. Save edited question
  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion) return;
    const cleanOptions = editingQuestion.options.map((o) => o.trim()).filter(Boolean);
    if (cleanOptions.length < 2) {
      showToast('Error: At least 2 answer options are required', undefined, 'info');
      return;
    }
    const success = dataService.updateQuestion(
      editingQuestion.id,
      {
        prompt: editingQuestion.prompt.trim(),
        options: cleanOptions,
        correctOptionIndex: Math.min(Number(editingQuestion.correctOptionIndex), cleanOptions.length - 1),
        explanation: editingQuestion.explanation.trim(),
        xpPoints: Number(editingQuestion.xpPoints),
        difficulty: editingQuestion.difficulty,
        topicTag: editingQuestion.topicTag,
        scenario: editingQuestion.scenario,
        isPublished: editingQuestion.isPublished !== false
      },
      currentRole
    );
    if (success) {
      setEditingQuestion(null);
      onRefreshData();
      showToast('Quiz Question Saved', undefined, 'success');
    }
  };

  // 4. Save leaderboard entry
  const handleSaveLeaderboardEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEntry) return;
    const success = dataService.updateLeaderboardEntry(
      editingEntry.id,
      {
        displayName: editingEntry.displayName,
        university: editingEntry.university,
        xp: Number(editingEntry.xp),
        streak: Number(editingEntry.streak),
        badge: editingEntry.badge
      },
      currentRole
    );
    if (success) {
      setEditingEntry(null);
      onRefreshData();
      showToast('Scholar Score Updated', undefined, 'success');
    }
  };

  // 5. Quick XP update specifically targeting Demo User (Dev Purecha)
  const handleApplyDemoUserXp = () => {
    const success = dataService.setDemoUserXp(demoUserXpInput, currentRole, 'user');
    if (success) {
      onRefreshData();
      showToast(`Dev Purecha XP Updated to ${demoUserXpInput}`, demoUserXpInput, 'xp');
    }
  };

  // 6. Safe Per-Profile Reset handlers
  const [resetUserProgressModalOpen, setResetUserProgressModalOpen] = useState(false);

  const handleConfirmResetUserProgress = () => {
    const success = dataService.resetUserProgress(currentRole);
    if (success) {
      onRefreshData();
      setDemoUserXpInput(0);
      setResetUserProgressModalOpen(false);
      showToast('Dev Purecha Progress Reset: 0 XP, Level 1, 0 Streak', 0, 'success');
    } else {
      showToast('Unauthorized: Admin role required to reset user progress', undefined, 'xp');
    }
  };

  const handleResetAdminOnly = () => {
    dataService.restoreDefaultData('admin');
    onRefreshData();
    setResetModalOpen(false);
    showToast('Admin Content & Curriculum Settings Restored', undefined, 'success');
  };

  const handleResetStudentOnly = () => {
    dataService.resetUserProgress(currentRole);
    onRefreshData();
    setDemoUserXpInput(0);
    setResetModalOpen(false);
    showToast('Dev Purecha Progress Reset to 0 (Admin Settings Untouched)', undefined, 'success');
  };

  const handleResetAll = () => {
    dataService.resetAllData();
    onRefreshData();
    setDemoUserXpInput(0);
    setResetModalOpen(false);
    showToast('All Demo Data Restored to Defaults', undefined, 'success');
  };

  // Filtered lessons
  const filteredLessons = lessons.filter((l) =>
    lessonTrackFilter === 'all' ? true : l.trackId === lessonTrackFilter
  );

  // All questions (include unpublished and custom questions for Admin view)
  const allQuestions = dataService.getQuestions({ includeUnpublished: true });
  const filteredQuestions = allQuestions.filter((q) => {
    const matchesTrack = questionTrackFilter === 'all' ? true : q.trackId === questionTrackFilter;
    const matchesSource =
      questionSourceFilter === 'all'
        ? true
        : questionSourceFilter === 'admin'
        ? q.source === 'admin'
        : q.source !== 'admin';
    const matchesStatus =
      questionStatusFilter === 'all'
        ? true
        : questionStatusFilter === 'published'
        ? q.isPublished !== false
        : q.isPublished === false;
    const query = questionSearch.toLowerCase().trim();
    const matchesSearch =
      !query ||
      q.prompt.toLowerCase().includes(query) ||
      q.explanation.toLowerCase().includes(query) ||
      q.topicTag.toLowerCase().includes(query) ||
      q.id.toLowerCase().includes(query) ||
      q.lessonId.toLowerCase().includes(query);
    return matchesTrack && matchesSource && matchesStatus && matchesSearch;
  });

  const customQuestionCount = allQuestions.filter((q) => q.source === 'admin').length;
  const draftQuestionCount = allQuestions.filter((q) => q.isPublished === false).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner & Role Indicator */}
      <div
        className={`rounded-3xl p-6 sm:p-8 border shadow-xs transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6 ${
          isDarkMode
            ? 'bg-[#12233A] border-[#1E324F] text-[#FFF8ED]'
            : 'bg-white border-[#EDE3D2] text-[#263238]'
        }`}
      >
        <div className="flex items-start gap-4">
          <div className="relative shrink-0">
            <UserAvatar
              src={userProfile.avatar || PROF_ANJALI_SANE_AVATAR}
              name={userProfile.displayName || 'Prof. Dr. Anjali Sane'}
              size="lg"
              ring={true}
              ringClassName="ring-2 ring-[#E96746]"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#FDECE7] dark:bg-[#1E324F] text-[#E96746] dark:text-[#F07856] border border-[#E96746]/20">
                Prof. Dr. Anjali Sane
              </span>
              <span className="text-xs text-[#52647A] dark:text-[#C1CDDC]">
                Faculty &amp; Academic Administrator
              </span>
            </div>
            <h1
              className={`text-2xl sm:text-3xl font-black mt-1 ${
                isDarkMode ? 'text-[#FFF8ED]' : 'text-[#263238]'
              }`}
            >
              Academic Curriculum &amp; Content Panel
            </h1>
            <p
              className={`text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed ${
                isDarkMode ? 'text-[#C1CDDC]' : 'text-[#52647A]'
              }`}
            >
              Manage curriculum lessons, enforce Admin-Only restrictions, modify 200+ question bank
              items, and calibrate sample leaderboard scores in local storage.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          <button
            onClick={() => setResetUserProgressModalOpen(true)}
            className="px-3.5 py-2.5 rounded-xl font-bold text-xs text-white bg-rose-600 hover:bg-rose-700 shadow-xs transition cursor-pointer flex items-center gap-1.5"
            title="Admin-only: Reset User Progress to 0 XP, Level 1, Streak 0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset User Progress</span>
          </button>
          <button
            onClick={() => setResetModalOpen(true)}
            className={`px-3 py-2.5 rounded-xl border transition cursor-pointer flex items-center gap-1.5 ${
              isDarkMode
                ? 'border-[#1E324F] text-[#C1CDDC] hover:text-rose-400 hover:border-rose-400/40'
                : 'border-[#EDE3D2] text-[#52647A] hover:text-rose-600 hover:border-rose-300'
            }`}
            title="Safe Demo Reset Options"
          >
            <RotateCcw className="w-4 h-4 text-rose-500" />
            <span className="text-xs font-bold hidden sm:inline">Reset Options</span>
          </button>
        </div>
      </div>

      {/* Admin Sub Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#EDE3D2] dark:border-[#1E324F]">
        <button
          onClick={() => setAdminTab('lessons')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer ${
            adminTab === 'lessons'
              ? 'bg-[#E96746] text-white shadow-xs'
              : isDarkMode
              ? 'text-[#C1CDDC] hover:bg-[#12233A]'
              : 'text-[#52647A] hover:bg-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Restricted Lessons &amp; Content ({lessons.filter((l) => l.isAdminOnly).length} Locked)</span>
        </button>

        <button
          onClick={() => setAdminTab('questions')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer ${
            adminTab === 'questions'
              ? 'bg-[#E96746] text-white shadow-xs'
              : isDarkMode
              ? 'text-[#C1CDDC] hover:bg-[#12233A]'
              : 'text-[#52647A] hover:bg-white'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Question Bank ({allQuestions.length} Items)</span>
        </button>

        <button
          onClick={() => setAdminTab('leaderboard')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer ${
            adminTab === 'leaderboard'
              ? 'bg-[#E96746] text-white shadow-xs'
              : isDarkMode
              ? 'text-[#C1CDDC] hover:bg-[#12233A]'
              : 'text-[#52647A] hover:bg-white'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Sample Leaderboard &amp; XP Editor</span>
        </button>

        <button
          onClick={() => setAdminTab('security')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer ${
            adminTab === 'security'
              ? 'bg-[#E96746] text-white shadow-xs'
              : isDarkMode
              ? 'text-[#C1CDDC] hover:bg-[#12233A]'
              : 'text-[#52647A] hover:bg-white'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>RBAC Audit &amp; Simulation</span>
        </button>
      </div>

      {/* TAB 1: LESSONS & RESTRICTED CONTENT */}
      {adminTab === 'lessons' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2
                className={`text-xl font-black ${
                  isDarkMode ? 'text-[#FFF8ED]' : 'text-[#263238]'
                }`}
              >
                Curriculum Lessons &amp; Restricted Content Governance
              </h2>
              <p
                className={`text-xs sm:text-sm ${
                  isDarkMode ? 'text-[#C1CDDC]' : 'text-[#52647A]'
                }`}
              >
                Toggle the Admin-Only switch to restrict executive modules from standard student users.
              </p>
            </div>

            {/* Track filter pills */}
            <div
              className={`flex items-center gap-1.5 p-1 rounded-xl border text-xs font-bold ${
                isDarkMode ? 'bg-[#12233A] border-[#1E324F]' : 'bg-white border-[#EDE3D2]'
              }`}
            >
              {(['all', 'accounting', 'economics', 'finance'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setLessonTrackFilter(t)}
                  className={`px-3 py-1.5 rounded-lg capitalize transition cursor-pointer ${
                    lessonTrackFilter === t
                      ? 'bg-[#E96746] text-white shadow-xs'
                      : isDarkMode
                      ? 'text-[#C1CDDC] hover:text-white'
                      : 'text-[#52647A] hover:text-[#263238]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Lessons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredLessons.map((lesson) => (
              <div
                key={lesson.id}
                className={`rounded-2xl p-5 border transition-all flex flex-col justify-between shadow-2xs ${
                  lesson.isAdminOnly
                    ? isDarkMode
                      ? 'bg-[#132238] border-amber-500/50 ring-1 ring-amber-500/20'
                      : 'bg-white border-amber-400 ring-1 ring-amber-400/20'
                    : isDarkMode
                    ? 'bg-[#12233A] border-[#1E324F]'
                    : 'bg-white border-[#EDE3D2]'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#FDECE7] dark:bg-[#1E324F] text-[#E96746] dark:text-[#F07856]">
                      {lesson.trackId} • #{lesson.order}
                    </span>

                    {/* Restriction Status Badge */}
                    {lesson.isAdminOnly ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        <span>Admin Only</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                        <Unlock className="w-3 h-3" />
                        <span>Open to Users</span>
                      </span>
                    )}
                  </div>

                  <h3
                    className={`font-black text-base line-clamp-1 ${
                      isDarkMode ? 'text-[#FFF8ED]' : 'text-[#263238]'
                    }`}
                  >
                    {lesson.title}
                  </h3>

                  <p
                    className={`text-xs line-clamp-2 leading-relaxed ${
                      isDarkMode ? 'text-[#C1CDDC]' : 'text-[#52647A]'
                    }`}
                  >
                    {lesson.shortDefinition}
                  </p>

                  <div className="text-[11px] font-bold text-[#E96746] dark:text-[#F07856] flex items-center gap-2">
                    <span>+{lesson.xpValue} XP</span>
                    <span>•</span>
                    <span>{lesson.estimatedMinutes} mins</span>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-4 mt-4 border-t border-[#EDE3D2] dark:border-[#1E324F] flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleToggleLessonRestriction(lesson)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      lesson.isAdminOnly
                        ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 hover:bg-amber-500/25 border border-amber-500/30'
                        : 'bg-[#263238]/10 dark:bg-white/10 text-[#263238] dark:text-[#FFF8ED] hover:bg-[#263238]/20'
                    }`}
                    title={lesson.isAdminOnly ? 'Unlock for Student Users' : 'Lock as Admin-Only'}
                  >
                    {lesson.isAdminOnly ? (
                      <>
                        <Unlock className="w-3.5 h-3.5" />
                        <span>Unlock for Users</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5 text-amber-500" />
                        <span>Lock (Admin Only)</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setEditingLesson(lesson)}
                    className={`p-1.5 rounded-lg transition cursor-pointer ${
                      isDarkMode
                        ? 'text-[#C1CDDC] hover:text-[#FFF8ED] hover:bg-[#1E324F]'
                        : 'text-[#52647A] hover:text-[#263238] hover:bg-[#FFF8ED]'
                    }`}
                    title="Edit Lesson Metadata"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: QUESTION BANK & CURRICULUM AUTHORING */}
      {adminTab === 'questions' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2
                  className={`text-xl font-black ${
                    isDarkMode ? 'text-[#FFF8ED]' : 'text-[#263238]'
                  }`}
                >
                  Question Bank &amp; Curriculum Authoring
                </h2>
                {customQuestionCount > 0 && (
                  <span className="text-[11px] font-black uppercase px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30">
                    {customQuestionCount} Custom
                  </span>
                )}
              </div>
              <p
                className={`text-xs sm:text-sm mt-0.5 ${
                  isDarkMode ? 'text-[#C1CDDC]' : 'text-[#52647A]'
                }`}
              >
                Create, edit, publish, or archive questions. Admin-created custom questions automatically integrate into Student quizzes, scoring, Spaced Review, and career leaderboards.
              </p>
            </div>

            {/* Create Custom Question Button */}
            <button
              onClick={() => {
                setCreateFormError(null);
                setIsCreateQuestionOpen(true);
              }}
              className="px-4 py-2.5 rounded-2xl font-bold text-xs text-white bg-[#E96746] hover:bg-[#D45333] shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer self-start md:self-auto shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Create Custom Question</span>
            </button>
          </div>

          {/* Search & Multi-Filters Toolbar */}
          <div
            className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-3 ${
              isDarkMode ? 'bg-[#12233A] border-[#1E324F]' : 'bg-white border-[#EDE3D2]'
            }`}
          >
            {/* Search Input */}
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs flex-1 min-w-[200px] ${
                isDarkMode ? 'bg-[#0B1728] border-[#1E324F]' : 'bg-[#FFF8ED] border-[#EDE3D2]'
              }`}
            >
              <Search className="w-3.5 h-3.5 text-[#52647A] dark:text-[#C1CDDC]" />
              <input
                type="text"
                placeholder="Search prompt, topic, ID, or lesson..."
                value={questionSearch}
                onChange={(e) => setQuestionSearch(e.target.value)}
                className="bg-transparent focus:outline-hidden text-xs w-full"
              />
              {questionSearch && (
                <button
                  onClick={() => setQuestionSearch('')}
                  className="p-0.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-xs text-[#52647A]"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {/* Track / Category Filter */}
              <select
                value={questionTrackFilter}
                onChange={(e) => setQuestionTrackFilter(e.target.value as any)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold focus:outline-hidden ${
                  isDarkMode
                    ? 'bg-[#0B1728] border-[#1E324F] text-[#FFF8ED]'
                    : 'bg-[#FFF8ED] border-[#EDE3D2] text-[#263238]'
                }`}
              >
                <option value="all">All Tracks</option>
                <option value="accounting">Accounting</option>
                <option value="economics">Economics</option>
                <option value="finance">Finance</option>
              </select>

              {/* Source Filter */}
              <select
                value={questionSourceFilter}
                onChange={(e) => setQuestionSourceFilter(e.target.value as any)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold focus:outline-hidden ${
                  isDarkMode
                    ? 'bg-[#0B1728] border-[#1E324F] text-[#FFF8ED]'
                    : 'bg-[#FFF8ED] border-[#EDE3D2] text-[#263238]'
                }`}
              >
                <option value="all">All Sources</option>
                <option value="admin">Faculty Custom ({customQuestionCount})</option>
                <option value="original">Original 200 Bank</option>
              </select>

              {/* Status Filter */}
              <select
                value={questionStatusFilter}
                onChange={(e) => setQuestionStatusFilter(e.target.value as any)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold focus:outline-hidden ${
                  isDarkMode
                    ? 'bg-[#0B1728] border-[#1E324F] text-[#FFF8ED]'
                    : 'bg-[#FFF8ED] border-[#EDE3D2] text-[#263238]'
                }`}
              >
                <option value="all">All Statuses</option>
                <option value="published">Live in Quizzes ({allQuestions.length - draftQuestionCount})</option>
                <option value="draft">Drafts / Hidden ({draftQuestionCount})</option>
              </select>
            </div>
          </div>

          {/* Count summary bar */}
          <div className="flex items-center justify-between text-xs text-[#52647A] dark:text-[#C1CDDC] px-1">
            <span>
              Showing <strong>{filteredQuestions.length}</strong> of <strong>{allQuestions.length}</strong> questions
              {questionSearch || questionTrackFilter !== 'all' || questionSourceFilter !== 'all' || questionStatusFilter !== 'all' ? (
                <button
                  onClick={() => {
                    setQuestionSearch('');
                    setQuestionTrackFilter('all');
                    setQuestionSourceFilter('all');
                    setQuestionStatusFilter('all');
                  }}
                  className="ml-2 text-[#E96746] dark:text-[#F07856] underline cursor-pointer"
                >
                  Clear filters
                </button>
              ) : null}
            </span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-purple-500 inline-block"></span>
                {customQuestionCount} Faculty Created
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                {allQuestions.length - draftQuestionCount} Published
              </span>
            </div>
          </div>

          {/* Questions list */}
          <div className="space-y-3">
            {filteredQuestions.length === 0 ? (
              <div
                className={`text-center py-12 rounded-3xl border ${
                  isDarkMode ? 'bg-[#12233A] border-[#1E324F]' : 'bg-white border-[#EDE3D2]'
                }`}
              >
                <HelpCircle className="w-10 h-10 mx-auto text-[#52647A] dark:text-[#C1CDDC] mb-3 opacity-60" />
                <h3 className="font-bold text-sm">No questions match your current filters</h3>
                <p className="text-xs text-[#52647A] dark:text-[#C1CDDC] mt-1 max-w-sm mx-auto">
                  Try adjusting your search query, or create a brand new custom question for your students.
                </p>
                <button
                  onClick={() => {
                    setQuestionSearch('');
                    setQuestionTrackFilter('all');
                    setQuestionSourceFilter('all');
                    setQuestionStatusFilter('all');
                  }}
                  className="mt-4 px-4 py-2 rounded-xl text-xs font-bold bg-[#E96746] text-white cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              filteredQuestions.slice(0, 40).map((question) => {
                const isCustom = question.source === 'admin';
                const isPub = question.isPublished !== false;

                return (
                  <div
                    key={question.id}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-start justify-between gap-4 shadow-2xs ${
                      !isPub
                        ? isDarkMode
                          ? 'bg-[#0E1B2C] border-amber-500/30 opacity-85'
                          : 'bg-[#FFFDF7] border-amber-300 opacity-90'
                        : isCustom
                        ? isDarkMode
                          ? 'bg-[#132238] border-purple-500/40'
                          : 'bg-white border-purple-200'
                        : isDarkMode
                        ? 'bg-[#12233A] border-[#1E324F]'
                        : 'bg-white border-[#EDE3D2]'
                    }`}
                  >
                    <div className="space-y-2 flex-1">
                      {/* Metadata Badges */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-[#FDECE7] dark:bg-[#1E324F] text-[#E96746] dark:text-[#F07856]">
                          {question.trackId}
                        </span>

                        {isCustom ? (
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30">
                            Faculty Custom
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-300">
                            Original Bank
                          </span>
                        )}

                        {isPub ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            Live in Quizzes
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" />
                            Draft / Hidden
                          </span>
                        )}

                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          {question.difficulty}
                        </span>

                        <span className="text-[10px] font-bold text-[#E96746] dark:text-[#F07856]">
                          +{question.xpPoints} XP
                        </span>

                        <span className="text-[10px] text-[#52647A] dark:text-[#C1CDDC]">
                          ID: <code className="font-mono">{question.id}</code>
                        </span>
                        <span className="text-[10px] text-[#52647A] dark:text-[#C1CDDC]">
                          • Lesson: <code className="font-mono">{question.lessonId}</code>
                        </span>
                        {question.topicTag && (
                          <span className="text-[10px] text-[#52647A] dark:text-[#C1CDDC]">
                            • {question.topicTag}
                          </span>
                        )}
                      </div>

                      {/* Prompt */}
                      <p
                        className={`font-bold text-sm leading-snug ${
                          isDarkMode ? 'text-[#FFF8ED]' : 'text-[#263238]'
                        }`}
                      >
                        {question.prompt}
                      </p>

                      {/* Options Preview */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                        {question.options.map((opt, idx) => {
                          const isCorrect = idx === question.correctOptionIndex;
                          return (
                            <div
                              key={idx}
                              className={`text-xs px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 ${
                                isCorrect
                                  ? isDarkMode
                                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 font-bold'
                                    : 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold'
                                  : isDarkMode
                                  ? 'bg-[#0B1728]/60 border-[#1E324F] text-[#C1CDDC]'
                                  : 'bg-[#FFF8ED]/50 border-[#EDE3D2] text-[#52647A]'
                              }`}
                            >
                              <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 font-mono opacity-80">
                                {String.fromCharCode(65 + idx)}
                              </span>
                              <span className="truncate flex-1">{opt}</span>
                              {isCorrect && <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation */}
                      <div className="text-xs text-[#52647A] dark:text-[#C1CDDC] pt-1">
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">Rationale: </span>
                        <span className="line-clamp-2">{question.explanation}</span>
                      </div>
                    </div>

                    {/* Action Controls */}
                    <div className="flex md:flex-col items-center gap-2 shrink-0 self-start md:self-stretch justify-end">
                      {/* Publish / Unpublish Toggle */}
                      <button
                        onClick={() => handleTogglePublishQuestion(question)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer w-full justify-center ${
                          isPub
                            ? isDarkMode
                              ? 'border-amber-500/30 text-amber-300 hover:bg-amber-500/10'
                              : 'border-amber-400 text-amber-700 hover:bg-amber-50'
                            : isDarkMode
                            ? 'border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10'
                            : 'border-emerald-400 text-emerald-700 hover:bg-emerald-50'
                        }`}
                        title={isPub ? 'Move to Drafts (Hide from student quizzes)' : 'Publish Live to Student Quizzes'}
                      >
                        {isPub ? (
                          <>
                            <EyeOff className="w-3.5 h-3.5" />
                            <span>Unpublish</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-3.5 h-3.5" />
                            <span>Publish</span>
                          </>
                        )}
                      </button>

                      {/* Edit Question */}
                      <button
                        onClick={() => setEditingQuestion(question)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer w-full justify-center ${
                          isDarkMode
                            ? 'border-[#1E324F] hover:bg-[#1E324F] text-[#C1CDDC]'
                            : 'border-[#EDE3D2] hover:bg-[#FFF8ED] text-[#263238]'
                        }`}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      {/* Delete Question */}
                      <button
                        onClick={() => setQuestionToDelete(question)}
                        className="px-3 py-1.5 rounded-xl border border-rose-500/30 hover:bg-rose-500/15 text-rose-600 dark:text-rose-400 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer w-full justify-center"
                        title={isCustom ? 'Delete custom question' : 'Archive question from future quizzes'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}

            {filteredQuestions.length > 40 && (
              <div className="text-center py-4 text-xs font-semibold text-[#52647A] dark:text-[#C1CDDC]">
                Showing first 40 of {filteredQuestions.length} matched questions. Use search and track filters to narrow results.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: LEADERBOARD & XP EDITOR */}
      {adminTab === 'leaderboard' && (
        <div className="space-y-6">
          <div>
            <h2
              className={`text-xl font-black ${
                isDarkMode ? 'text-[#FFF8ED]' : 'text-[#263238]'
              }`}
            >
              Sample Leaderboard &amp; Student XP Calibration
            </h2>
            <p
              className={`text-xs sm:text-sm ${
                isDarkMode ? 'text-[#C1CDDC]' : 'text-[#52647A]'
              }`}
            >
              Directly edit scholar scores, streaks, and university affiliations to test dynamic ranking recalculations.
            </p>
          </div>

          {/* Quick Demo User XP Modifier Box */}
          <div
            className={`p-6 rounded-3xl border shadow-xs space-y-4 ${
              isDarkMode
                ? 'bg-[#12233A] border-[#1E324F]'
                : 'bg-white border-[#EDE3D2]'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#E96746] dark:text-[#F07856]">
                  Immediate Progression Test
                </span>
                <h3
                  className={`text-lg font-black ${
                    isDarkMode ? 'text-[#FFF8ED]' : 'text-[#263238]'
                  }`}
                >
                  Calibrate Demo User XP &amp; Level Invariants
                </h3>
                <p
                  className={`text-xs ${
                    isDarkMode ? 'text-[#C1CDDC]' : 'text-[#52647A]'
                  }`}
                >
                  Current Level: <strong>Lvl {userProfile.level} ({userProfile.levelTitle})</strong> • Current XP: <strong>{userProfile.currentXp}</strong>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={demoUserXpInput}
                  onChange={(e) => setDemoUserXpInput(Number(e.target.value))}
                  className={`w-32 px-3 py-2 rounded-xl border text-sm font-bold text-center focus:outline-hidden ${
                    isDarkMode
                      ? 'bg-[#0B1728] border-[#1E324F] text-[#FFF8ED]'
                      : 'bg-[#FFF8ED] border-[#EDE3D2] text-[#263238]'
                  }`}
                />
                <button
                  onClick={handleApplyDemoUserXp}
                  className="px-4 py-2 rounded-xl font-bold text-xs text-white bg-[#E96746] hover:bg-[#D45333] transition shadow-xs cursor-pointer"
                >
                  Update XP
                </button>
              </div>
            </div>
          </div>

          {/* Leaderboard Entries Table */}
          <div
            className={`rounded-3xl border overflow-hidden shadow-xs ${
              isDarkMode ? 'border-[#1E324F] bg-[#12233A]' : 'border-[#EDE3D2] bg-white'
            }`}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead
                  className={`border-b text-xs font-black uppercase tracking-wider ${
                    isDarkMode
                      ? 'bg-[#0B1728] border-[#1E324F] text-[#C1CDDC]'
                      : 'bg-[#FFF8ED] border-[#EDE3D2] text-[#52647A]'
                  }`}
                >
                  <tr>
                    <th className="px-5 py-3.5">Rank</th>
                    <th className="px-5 py-3.5">Scholar</th>
                    <th className="px-5 py-3.5">University</th>
                    <th className="px-5 py-3.5">XP</th>
                    <th className="px-5 py-3.5">Streak</th>
                    <th className="px-5 py-3.5">Badge Title</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EDE3D2] dark:divide-[#1E324F]">
                  {leaderboard.map((entry) => (
                    <tr
                      key={entry.id}
                      className={`transition-colors ${
                        entry.isCurrentUser
                          ? isDarkMode
                            ? 'bg-[#E96746]/10 font-bold'
                            : 'bg-[#FDECE7]/60 font-bold'
                          : isDarkMode
                          ? 'hover:bg-[#1E324F]/30'
                          : 'hover:bg-[#FFF8ED]/50'
                      }`}
                    >
                      <td className="px-5 py-4 font-black">
                        #{entry.rank}
                      </td>
                      <td className="px-5 py-4 flex items-center gap-2">
                        <span className={isDarkMode ? 'text-[#FFF8ED]' : 'text-[#263238]'}>
                          {entry.displayName}
                        </span>
                        {entry.isCurrentUser && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#E96746] text-white font-extrabold">
                            You (Demo)
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-[#52647A] dark:text-[#C1CDDC]">
                        {entry.university}
                      </td>
                      <td className="px-5 py-4 font-black text-[#E96746] dark:text-[#F07856]">
                        {entry.xp} XP
                      </td>
                      <td className="px-5 py-4">
                        {entry.streak}d
                      </td>
                      <td className="px-5 py-4 text-xs text-[#52647A] dark:text-[#C1CDDC]">
                        {entry.badge}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => setEditingEntry(entry)}
                          className={`p-1.5 rounded-lg transition cursor-pointer ${
                            isDarkMode
                              ? 'text-[#C1CDDC] hover:text-[#FFF8ED] hover:bg-[#1E324F]'
                              : 'text-[#52647A] hover:text-[#263238] hover:bg-[#FFF8ED]'
                          }`}
                          title="Edit Scholar Score"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: RBAC SECURITY AUDIT & SIMULATION */}
      {adminTab === 'security' && (
        <div className="space-y-6">
          <div
            className={`p-6 sm:p-8 rounded-3xl border shadow-xs space-y-4 ${
              isDarkMode ? 'bg-[#12233A] border-[#1E324F]' : 'bg-white border-[#EDE3D2]'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3
                  className={`text-lg font-black ${
                    isDarkMode ? 'text-[#FFF8ED]' : 'text-[#263238]'
                  }`}
                >
                  Client-Side Role-Based Access Control Architecture
                </h3>
                <p
                  className={`text-xs ${
                    isDarkMode ? 'text-[#C1CDDC]' : 'text-[#52647A]'
                  }`}
                >
                  Local Demonstration Mode (Phase 2 Specification)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div
                className={`p-4 rounded-2xl border space-y-2 ${
                  isDarkMode ? 'bg-[#0B1728] border-[#1E324F]' : 'bg-[#FFF8ED] border-[#EDE3D2]'
                }`}
              >
                <div className="text-xs font-bold text-[#E96746] dark:text-[#F07856] uppercase">
                  User Role Boundary (Enforced)
                </div>
                <ul className="text-xs space-y-1.5 text-[#52647A] dark:text-[#C1CDDC]">
                  <li>• Access standard lessons &amp; curriculum tracks</li>
                  <li>• Blocked from opening lessons flagged <code>isAdminOnly: true</code></li>
                  <li>• Blocked from launching quizzes on restricted topics</li>
                  <li>• Blocked from loading Admin Panel view in router/state</li>
                  <li>• Blocked from invoking content update APIs in <code>dataService</code></li>
                </ul>
              </div>

              <div
                className={`p-4 rounded-2xl border space-y-2 ${
                  isDarkMode ? 'bg-[#0B1728] border-[#1E324F]' : 'bg-[#FFF8ED] border-[#EDE3D2]'
                }`}
              >
                <div className="text-xs font-bold text-[#E96746] dark:text-[#F07856] uppercase">
                  Admin Role Privileges (Enforced)
                </div>
                <ul className="text-xs space-y-1.5 text-[#52647A] dark:text-[#C1CDDC]">
                  <li>• Access full Admin Panel with zero restrictions</li>
                  <li>• Toggle <code>isAdminOnly</code> restriction on any lesson</li>
                  <li>• Edit lesson metadata, XP awards &amp; study times</li>
                  <li>• Modify 200+ question bank explanations &amp; correct keys</li>
                  <li>• Override and calibrate sample leaderboard scores</li>
                </ul>
              </div>
            </div>

            <div
              className={`p-4 rounded-2xl border text-xs leading-relaxed ${
                isDarkMode
                  ? 'bg-[#1E324F]/30 border-[#1E324F] text-[#C1CDDC]'
                  : 'bg-white border-[#EDE3D2] text-[#52647A]'
              }`}
            >
              <strong>Security Model Disclaimer:</strong> This RBAC enforcement runs client-side in the
              React application state and local storage for demo evaluation. In a full production
              deployment, security is enforced on a trusted server with role-based session verification and strict backend access controls.
            </div>
          </div>
        </div>
      )}

      {/* EDIT LESSON MODAL */}
      {editingLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className={`w-full max-w-xl rounded-3xl p-6 sm:p-8 border shadow-2xl space-y-5 ${
              isDarkMode ? 'bg-[#12233A] border-[#1E324F] text-[#FFF8ED]' : 'bg-white border-[#EDE3D2] text-[#263238]'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-black uppercase text-[#E96746] dark:text-[#F07856]">
                  Edit Lesson Content
                </span>
                <h3 className="text-xl font-black">
                  {editingLesson.title} ({editingLesson.id})
                </h3>
              </div>
              <button
                onClick={() => setEditingLesson(null)}
                className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLesson} className="space-y-4">
              <div>
                <label className="text-xs font-bold block mb-1">Lesson Title</label>
                <input
                  type="text"
                  value={editingLesson.title}
                  onChange={(e) => setEditingLesson({ ...editingLesson, title: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-hidden ${
                    isDarkMode ? 'bg-[#0B1728] border-[#1E324F]' : 'bg-[#FFF8ED] border-[#EDE3D2]'
                  }`}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold block mb-1">Short Definition</label>
                <textarea
                  rows={2}
                  value={editingLesson.shortDefinition}
                  onChange={(e) => setEditingLesson({ ...editingLesson, shortDefinition: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-hidden ${
                    isDarkMode ? 'bg-[#0B1728] border-[#1E324F]' : 'bg-[#FFF8ED] border-[#EDE3D2]'
                  }`}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold block mb-1">XP Reward</label>
                  <input
                    type="number"
                    min="10"
                    step="5"
                    value={editingLesson.xpValue}
                    onChange={(e) => setEditingLesson({ ...editingLesson, xpValue: Number(e.target.value) })}
                    className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-hidden ${
                      isDarkMode ? 'bg-[#0B1728] border-[#1E324F]' : 'bg-[#FFF8ED] border-[#EDE3D2]'
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold block mb-1">Est. Minutes</label>
                  <input
                    type="number"
                    min="1"
                    value={editingLesson.estimatedMinutes}
                    onChange={(e) => setEditingLesson({ ...editingLesson, estimatedMinutes: Number(e.target.value) })}
                    className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-hidden ${
                      isDarkMode ? 'bg-[#0B1728] border-[#1E324F]' : 'bg-[#FFF8ED] border-[#EDE3D2]'
                    }`}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold block mb-1">Faculty Pro-Tip</label>
                <input
                  type="text"
                  value={editingLesson.proTip}
                  onChange={(e) => setEditingLesson({ ...editingLesson, proTip: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-hidden ${
                    isDarkMode ? 'bg-[#0B1728] border-[#1E324F]' : 'bg-[#FFF8ED] border-[#EDE3D2]'
                  }`}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingLesson(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold text-xs text-white bg-[#E96746] hover:bg-[#D45333] shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 1. CREATE CUSTOM QUESTION MODAL */}
      {isCreateQuestionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className={`w-full max-w-2xl rounded-3xl p-6 sm:p-8 border shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto ${
              isDarkMode ? 'bg-[#12233A] border-[#1E324F] text-[#FFF8ED]' : 'bg-white border-[#EDE3D2] text-[#263238]'
            }`}
          >
            <div className="flex items-center justify-between border-b pb-4 border-[#EDE3D2] dark:border-[#1E324F]">
              <div>
                <span className="text-xs font-black uppercase text-[#E96746] dark:text-[#F07856] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Faculty Curriculum Authoring
                </span>
                <h3 className="text-xl font-black mt-0.5">Create New Quiz Question</h3>
              </div>
              <button
                onClick={() => setIsCreateQuestionOpen(false)}
                className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error Banner */}
            {createFormError && (
              <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span className="font-semibold">{createFormError}</span>
              </div>
            )}

            <form onSubmit={handleCreateCustomQuestion} className="space-y-4">
              {/* Category / Track & Lesson Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold block mb-1">Learning Track / Category *</label>
                  <select
                    value={newQuestionForm.trackId}
                    onChange={(e) => {
                      const nextTrack = e.target.value as TrackId;
                      const matchLesson = lessons.find((l) => l.trackId === nextTrack);
                      setNewQuestionForm({
                        ...newQuestionForm,
                        trackId: nextTrack,
                        lessonId: matchLesson ? matchLesson.id : `${nextTrack.slice(0, 3)}-1`
                      });
                    }}
                    className={`w-full px-3 py-2 rounded-xl border text-xs font-semibold focus:outline-hidden ${
                      isDarkMode ? 'bg-[#0B1728] border-[#1E324F]' : 'bg-[#FFF8ED] border-[#EDE3D2]'
                    }`}
                  >
                    <option value="accounting">Accounting (Financial &amp; Cost)</option>
                    <option value="economics">Economics (Micro &amp; Macro)</option>
                    <option value="finance">Finance (Valuation &amp; Markets)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold block mb-1">Associated Lesson Module *</label>
                  <select
                    value={newQuestionForm.lessonId}
                    onChange={(e) => setNewQuestionForm({ ...newQuestionForm, lessonId: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl border text-xs font-semibold focus:outline-hidden ${
                      isDarkMode ? 'bg-[#0B1728] border-[#1E324F]' : 'bg-[#FFF8ED] border-[#EDE3D2]'
                    }`}
                  >
                    {lessons
                      .filter((l) => l.trackId === newQuestionForm.trackId)
                      .map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.id}: {l.title}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Topic Tag & Difficulty & XP */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold block mb-1">Topic Tag *</label>
                  <input
                    type="text"
                    placeholder="e.g. DCF Modeling, Working Capital"
                    value={newQuestionForm.topicTag}
                    onChange={(e) => setNewQuestionForm({ ...newQuestionForm, topicTag: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-hidden ${
                      isDarkMode ? 'bg-[#0B1728] border-[#1E324F]' : 'bg-[#FFF8ED] border-[#EDE3D2]'
                    }`}
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold block mb-1">Difficulty Level *</label>
                  <select
                    value={newQuestionForm.difficulty}
                    onChange={(e) =>
                      setNewQuestionForm({
                        ...newQuestionForm,
                        difficulty: e.target.value as any
                      })
                    }
                    className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-hidden ${
                      isDarkMode ? 'bg-[#0B1728] border-[#1E324F]' : 'bg-[#FFF8ED] border-[#EDE3D2]'
                    }`}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold block mb-1">XP Points Awarded *</label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    step="5"
                    value={newQuestionForm.xpPoints}
                    onChange={(e) => setNewQuestionForm({ ...newQuestionForm, xpPoints: Number(e.target.value) })}
                    className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-hidden ${
                      isDarkMode ? 'bg-[#0B1728] border-[#1E324F]' : 'bg-[#FFF8ED] border-[#EDE3D2]'
                    }`}
                    required
                  />
                </div>
              </div>

              {/* Question Prompt */}
              <div>
                <label className="text-xs font-bold block mb-1">Question Prompt *</label>
                <textarea
                  rows={2}
                  placeholder="State the financial or business question clearly..."
                  value={newQuestionForm.prompt}
                  onChange={(e) => setNewQuestionForm({ ...newQuestionForm, prompt: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-hidden ${
                    isDarkMode ? 'bg-[#0B1728] border-[#1E324F]' : 'bg-[#FFF8ED] border-[#EDE3D2]'
                  }`}
                  required
                />
              </div>

              {/* Scenario Context (Optional) */}
              <div>
                <label className="text-xs font-bold block mb-1">Practical Scenario Context (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. A technology enterprise in Bengaluru evaluating a ₹50 Crore debt issue..."
                  value={newQuestionForm.scenario}
                  onChange={(e) => setNewQuestionForm({ ...newQuestionForm, scenario: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-hidden ${
                    isDarkMode ? 'bg-[#0B1728] border-[#1E324F]' : 'bg-[#FFF8ED] border-[#EDE3D2]'
                  }`}
                />
              </div>

              {/* Answer Options & Correct Key */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold block">
                    Answer Options (Select the radio of the correct answer) *
                  </label>
                  {newQuestionForm.options.length < 5 && (
                    <button
                      type="button"
                      onClick={() =>
                        setNewQuestionForm({
                          ...newQuestionForm,
                          options: [...newQuestionForm.options, '']
                        })
                      }
                      className="text-[11px] font-bold text-[#E96746] dark:text-[#F07856] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      Add Option
                    </button>
                  )}
                </div>

                {newQuestionForm.options.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="newQuestionCorrect"
                      checked={newQuestionForm.correctOptionIndex === idx}
                      onChange={() => setNewQuestionForm({ ...newQuestionForm, correctOptionIndex: idx })}
                      className="accent-[#E96746] cursor-pointer"
                      title="Mark as correct answer key"
                    />
                    <span className="text-xs font-mono font-bold text-[#52647A] dark:text-[#C1CDDC] w-4">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <input
                      type="text"
                      placeholder={`Option ${String.fromCharCode(65 + idx)}...`}
                      value={opt}
                      onChange={(e) => {
                        const updated = [...newQuestionForm.options];
                        updated[idx] = e.target.value;
                        setNewQuestionForm({ ...newQuestionForm, options: updated });
                      }}
                      className={`flex-1 px-3 py-1.5 rounded-xl border text-xs focus:outline-hidden ${
                        isDarkMode ? 'bg-[#0B1728] border-[#1E324F]' : 'bg-[#FFF8ED] border-[#EDE3D2]'
                      }`}
                      required
                    />
                    {newQuestionForm.options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => {
                          const updated = newQuestionForm.options.filter((_, i) => i !== idx);
                          setNewQuestionForm({
                            ...newQuestionForm,
                            options: updated,
                            correctOptionIndex: Math.min(newQuestionForm.correctOptionIndex, updated.length - 1)
                          });
                        }}
                        className="p-1 rounded-lg hover:bg-rose-500/10 text-rose-500 cursor-pointer"
                        title="Remove option"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Pedagogical Explanation */}
              <div>
                <label className="text-xs font-bold block mb-1">
                  Explanatory Feedback &amp; Rationale *
                </label>
                <textarea
                  rows={2}
                  placeholder="Explain why the correct answer is right and why distractors are inaccurate..."
                  value={newQuestionForm.explanation}
                  onChange={(e) => setNewQuestionForm({ ...newQuestionForm, explanation: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-hidden ${
                    isDarkMode ? 'bg-[#0B1728] border-[#1E324F]' : 'bg-[#FFF8ED] border-[#EDE3D2]'
                  }`}
                  required
                />
              </div>

              {/* Publication Status Toggle */}
              <div
                className={`p-3 rounded-2xl border flex items-center justify-between gap-3 ${
                  isDarkMode ? 'bg-[#0B1728] border-[#1E324F]' : 'bg-[#FFF8ED] border-[#EDE3D2]'
                }`}
              >
                <div>
                  <span className="font-bold text-xs block">Publish to Student Quizzes</span>
                  <span className="text-[11px] text-[#52647A] dark:text-[#C1CDDC]">
                    When checked, this question immediately appears in standard user quizzes and Spaced Review.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={newQuestionForm.isPublished}
                  onChange={(e) => setNewQuestionForm({ ...newQuestionForm, isPublished: e.target.checked })}
                  className="w-4 h-4 accent-[#E96746] rounded-sm cursor-pointer"
                />
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#EDE3D2] dark:border-[#1E324F]">
                <button
                  type="button"
                  onClick={() => setIsCreateQuestionOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-[#E96746] hover:bg-[#D45333] shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>{newQuestionForm.isPublished ? 'Create & Publish Question' : 'Save as Draft'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. EDIT QUESTION MODAL */}
      {editingQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className={`w-full max-w-xl rounded-3xl p-6 sm:p-8 border shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto ${
              isDarkMode ? 'bg-[#12233A] border-[#1E324F] text-[#FFF8ED]' : 'bg-white border-[#EDE3D2] text-[#263238]'
            }`}
          >
            <div className="flex items-center justify-between border-b pb-4 border-[#EDE3D2] dark:border-[#1E324F]">
              <div>
                <span className="text-xs font-black uppercase text-[#E96746] dark:text-[#F07856] flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5" />
                  {editingQuestion.source === 'admin' ? 'Faculty Custom Question' : 'Original Bank Question'}
                </span>
                <h3 className="text-lg font-black font-mono mt-0.5">{editingQuestion.id}</h3>
              </div>
              <button
                onClick={() => setEditingQuestion(null)}
                className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="space-y-4">
              <div>
                <label className="text-xs font-bold block mb-1">Question Prompt *</label>
                <textarea
                  rows={2}
                  value={editingQuestion.prompt}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, prompt: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-hidden ${
                    isDarkMode ? 'bg-[#0B1728] border-[#1E324F]' : 'bg-[#FFF8ED] border-[#EDE3D2]'
                  }`}
                  required
                />
              </div>

              {/* Topic Tag */}
              <div>
                <label className="text-xs font-bold block mb-1">Topic Tag</label>
                <input
                  type="text"
                  value={editingQuestion.topicTag || ''}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, topicTag: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-hidden ${
                    isDarkMode ? 'bg-[#0B1728] border-[#1E324F]' : 'bg-[#FFF8ED] border-[#EDE3D2]'
                  }`}
                />
              </div>

              {/* Options */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold block">Answer Options &amp; Correct Key *</label>
                  {editingQuestion.options.length < 5 && (
                    <button
                      type="button"
                      onClick={() =>
                        setEditingQuestion({
                          ...editingQuestion,
                          options: [...editingQuestion.options, '']
                        })
                      }
                      className="text-[11px] font-bold text-[#E96746] dark:text-[#F07856] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      Add Option
                    </button>
                  )}
                </div>

                {editingQuestion.options.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="editCorrectOption"
                      checked={editingQuestion.correctOptionIndex === idx}
                      onChange={() => setEditingQuestion({ ...editingQuestion, correctOptionIndex: idx })}
                      className="accent-[#E96746] cursor-pointer"
                      title="Select as correct answer"
                    />
                    <span className="text-xs font-mono font-bold text-[#52647A] dark:text-[#C1CDDC] w-4">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const newOpts = [...editingQuestion.options];
                        newOpts[idx] = e.target.value;
                        setEditingQuestion({ ...editingQuestion, options: newOpts });
                      }}
                      className={`flex-1 px-3 py-1.5 rounded-xl border text-xs focus:outline-hidden ${
                        isDarkMode ? 'bg-[#0B1728] border-[#1E324F]' : 'bg-[#FFF8ED] border-[#EDE3D2]'
                      }`}
                      required
                    />
                    {editingQuestion.options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => {
                          const updated = editingQuestion.options.filter((_, i) => i !== idx);
                          setEditingQuestion({
                            ...editingQuestion,
                            options: updated,
                            correctOptionIndex: Math.min(editingQuestion.correctOptionIndex, updated.length - 1)
                          });
                        }}
                        className="p-1 rounded-lg hover:bg-rose-500/10 text-rose-500 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <label className="text-xs font-bold block mb-1">Pedagogical Explanation *</label>
                <textarea
                  rows={2}
                  value={editingQuestion.explanation}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, explanation: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-hidden ${
                    isDarkMode ? 'bg-[#0B1728] border-[#1E324F]' : 'bg-[#FFF8ED] border-[#EDE3D2]'
                  }`}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold block mb-1">XP Points</label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    step="5"
                    value={editingQuestion.xpPoints}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, xpPoints: Number(e.target.value) })}
                    className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-hidden ${
                      isDarkMode ? 'bg-[#0B1728] border-[#1E324F]' : 'bg-[#FFF8ED] border-[#EDE3D2]'
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold block mb-1">Difficulty</label>
                  <select
                    value={editingQuestion.difficulty}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, difficulty: e.target.value as any })}
                    className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-hidden ${
                      isDarkMode ? 'bg-[#0B1728] border-[#1E324F]' : 'bg-[#FFF8ED] border-[#EDE3D2]'
                    }`}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              {/* Publish Toggle */}
              <div
                className={`p-3 rounded-2xl border flex items-center justify-between gap-3 ${
                  isDarkMode ? 'bg-[#0B1728] border-[#1E324F]' : 'bg-[#FFF8ED] border-[#EDE3D2]'
                }`}
              >
                <div>
                  <span className="font-bold text-xs block">Active &amp; Published in Quizzes</span>
                  <span className="text-[11px] text-[#52647A] dark:text-[#C1CDDC]">
                    Uncheck to temporarily hide this question from Student quizzes as a draft.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={editingQuestion.isPublished !== false}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, isPublished: e.target.checked })}
                  className="w-4 h-4 accent-[#E96746] rounded-sm cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#EDE3D2] dark:border-[#1E324F]">
                <button
                  type="button"
                  onClick={() => {
                    const target = editingQuestion;
                    setEditingQuestion(null);
                    setQuestionToDelete(target);
                  }}
                  className="text-xs font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400 flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Question</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingQuestion(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl font-bold text-xs text-white bg-[#E96746] hover:bg-[#D45333] shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Question</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. DELETE QUESTION CONFIRMATION MODAL */}
      {questionToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className={`w-full max-w-md rounded-3xl p-6 sm:p-7 border shadow-2xl space-y-4 ${
              isDarkMode ? 'bg-[#12233A] border-rose-500/40 text-[#FFF8ED]' : 'bg-white border-rose-200 text-[#263238]'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-black">
                {questionToDelete.source === 'admin' ? 'Delete Custom Question?' : 'Archive Bank Question?'}
              </h3>
              <p className="text-xs text-[#52647A] dark:text-[#C1CDDC] leading-relaxed">
                {questionToDelete.source === 'admin'
                  ? 'This custom question will be permanently removed from all future student quiz assessments. Previous student XP and historical records will remain safe.'
                  : 'This question will be archived and excluded from future student quizzes. Original curriculum files remain unmodified.'}
              </p>
            </div>

            <div
              className={`p-3 rounded-xl border text-xs ${
                isDarkMode ? 'bg-[#0B1728] border-[#1E324F]' : 'bg-[#FFF8ED] border-[#EDE3D2]'
              }`}
            >
              <div className="font-mono text-[11px] text-[#52647A] dark:text-[#C1CDDC] truncate">
                ID: {questionToDelete.id}
              </div>
              <div className="font-bold line-clamp-2 mt-0.5">{questionToDelete.prompt}</div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setQuestionToDelete(null)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                  isDarkMode
                    ? 'border-[#1E324F] hover:bg-[#1E324F] text-[#C1CDDC]'
                    : 'border-[#EDE3D2] hover:bg-[#FFF8ED] text-[#263238]'
                }`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteQuestion}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md transition cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT LEADERBOARD ENTRY MODAL */}
      {editingEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className={`w-full max-w-md rounded-3xl p-6 sm:p-8 border shadow-2xl space-y-5 ${
              isDarkMode ? 'bg-[#12233A] border-[#1E324F] text-[#FFF8ED]' : 'bg-white border-[#EDE3D2] text-[#263238]'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-black uppercase text-[#E96746] dark:text-[#F07856]">
                  Calibrate Scholar Score
                </span>
                <h3 className="text-lg font-black">{editingEntry.displayName}</h3>
              </div>
              <button
                onClick={() => setEditingEntry(null)}
                className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLeaderboardEntry} className="space-y-4">
              <div>
                <label className="text-xs font-bold block mb-1">Display Name</label>
                <input
                  type="text"
                  value={editingEntry.displayName}
                  onChange={(e) => setEditingEntry({ ...editingEntry, displayName: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-hidden ${
                    isDarkMode ? 'bg-[#0B1728] border-[#1E324F]' : 'bg-[#FFF8ED] border-[#EDE3D2]'
                  }`}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold block mb-1">University</label>
                <input
                  type="text"
                  value={editingEntry.university}
                  onChange={(e) => setEditingEntry({ ...editingEntry, university: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-hidden ${
                    isDarkMode ? 'bg-[#0B1728] border-[#1E324F]' : 'bg-[#FFF8ED] border-[#EDE3D2]'
                  }`}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold block mb-1">Total XP</label>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={editingEntry.xp}
                    onChange={(e) => setEditingEntry({ ...editingEntry, xp: Number(e.target.value) })}
                    className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-hidden ${
                      isDarkMode ? 'bg-[#0B1728] border-[#1E324F]' : 'bg-[#FFF8ED] border-[#EDE3D2]'
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold block mb-1">Active Streak (Days)</label>
                  <input
                    type="number"
                    min="0"
                    value={editingEntry.streak}
                    onChange={(e) => setEditingEntry({ ...editingEntry, streak: Number(e.target.value) })}
                    className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-hidden ${
                      isDarkMode ? 'bg-[#0B1728] border-[#1E324F]' : 'bg-[#FFF8ED] border-[#EDE3D2]'
                    }`}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold block mb-1">Badge Title</label>
                <input
                  type="text"
                  value={editingEntry.badge}
                  onChange={(e) => setEditingEntry({ ...editingEntry, badge: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-hidden ${
                    isDarkMode ? 'bg-[#0B1728] border-[#1E324F]' : 'bg-[#FFF8ED] border-[#EDE3D2]'
                  }`}
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingEntry(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold text-xs text-white bg-[#E96746] hover:bg-[#D45333] shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Update Scholar</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Safe Demo Reset Modal */}
      {resetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className={`w-full max-w-lg rounded-3xl border shadow-2xl p-6 sm:p-7 space-y-6 ${
              isDarkMode
                ? 'bg-[#12233A] border-[#1E324F] text-[#FFF8ED]'
                : 'bg-white border-[#EDE3D2] text-[#263238]'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#EDE3D2] dark:border-[#1E324F]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center border border-rose-500/20">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-lg">Safe Reset Center</h3>
                  <p className="text-xs text-[#52647A] dark:text-[#C1CDDC]">
                    Independent Profile &amp; Content Restoration
                  </p>
                </div>
              </div>
              <button
                onClick={() => setResetModalOpen(false)}
                className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <p className="text-[#52647A] dark:text-[#C1CDDC]">
                FinLingo maintains two strictly isolated demo profiles. Select which dataset you want to restore without affecting the other:
              </p>

              {/* Option 1: Admin Content & Settings */}
              <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-amber-600 dark:text-amber-400 text-sm">
                    Option 1: Reset Admin Content &amp; Overrides
                  </span>
                  <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300">
                    Recommended
                  </span>
                </div>
                <p className="text-xs text-[#52647A] dark:text-[#C1CDDC] leading-relaxed">
                  Restores default lesson lock statuses, question edits, and sample leaderboard scores. <strong>Dev Purecha's progress, XP, completed lessons, and streaks are 100% preserved.</strong>
                </p>
                <button
                  onClick={handleResetAdminOnly}
                  className="w-full mt-1 py-2 px-3 rounded-xl font-bold text-xs bg-amber-600 hover:bg-amber-700 text-white transition cursor-pointer shadow-xs"
                >
                  Reset Admin Content Only
                </button>
              </div>

              {/* Option 2: Dev Purecha Progress */}
              <div className="p-4 rounded-2xl border border-blue-500/30 bg-blue-500/5 space-y-2">
                <span className="font-extrabold text-blue-600 dark:text-blue-400 text-sm block">
                  Option 2: Reset Demo Student Progress
                </span>
                <p className="text-xs text-[#52647A] dark:text-[#C1CDDC] leading-relaxed">
                  Resets Dev Purecha's learning account back to Level 1, 0 XP, and 0-day streak. <strong>Your Admin curriculum configurations and custom questions remain untouched.</strong>
                </p>
                <button
                  onClick={handleResetStudentOnly}
                  className="w-full mt-1 py-2 px-3 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white transition cursor-pointer shadow-xs"
                >
                  Reset Student Progress Only
                </button>
              </div>

              {/* Option 3: Full Reset */}
              <div className="p-3.5 rounded-2xl border border-[#EDE3D2] dark:border-[#1E324F] flex items-center justify-between gap-3">
                <div>
                  <span className="font-bold text-xs block text-rose-600 dark:text-rose-400">
                    Option 3: Full Reset (Both Profiles)
                  </span>
                  <span className="text-[11px] text-[#52647A] dark:text-[#C1CDDC]">
                    Restore everything to pristine initial factory state.
                  </span>
                </div>
                <button
                  onClick={handleResetAll}
                  className="py-1.5 px-3 rounded-xl font-semibold text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-300 dark:border-rose-900 transition cursor-pointer shrink-0"
                >
                  Reset All
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setResetModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REQUIREMENT 7: EXPLICIT CONFIRMATION MODAL FOR RESET USER PROGRESS */}
      {resetUserProgressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className={`w-full max-w-lg rounded-3xl p-6 sm:p-8 border shadow-2xl space-y-5 ${
              isDarkMode
                ? 'bg-[#12233A] border-[#1E324F] text-[#FFF8ED]'
                : 'bg-white border-[#EDE3D2] text-[#263238]'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#EDE3D2] dark:border-[#1E324F]">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center border border-rose-500/20 shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-rose-500 block">
                    Admin Action Required
                  </span>
                  <h3 className="font-black text-xl">Reset User Progress</h3>
                </div>
              </div>
              <button
                onClick={() => setResetUserProgressModalOpen(false)}
                className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <p className="leading-relaxed text-[#52647A] dark:text-[#C1CDDC]">
                Please review and explicitly confirm the reset of Dev Purecha's learning record.
              </p>

              {/* Requirement 7 Mandatory Items Checklist */}
              <div
                className={`p-4 rounded-2xl border space-y-2.5 ${
                  isDarkMode ? 'bg-[#0B1728] border-rose-500/30' : 'bg-rose-50/70 border-rose-200'
                }`}
              >
                <div className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  The following user records will be reset:
                </div>
                <ul className="space-y-1.5 text-xs text-rose-800 dark:text-rose-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span><strong>XP:</strong> Reset to <strong>0</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span><strong>Level:</strong> Reset to <strong>Level 1 (Intern Scholar)</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span><strong>Streak:</strong> Reset to <strong>0 days</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span><strong>Completed Lessons:</strong> Reset to <strong>none (empty)</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span><strong>Quiz History &amp; Telemetry:</strong> Reset to <strong>empty initial state</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span><strong>Earned Achievements:</strong> Reset to <strong>none (all locked)</strong></span>
                  </li>
                </ul>
              </div>

              {/* Preservation Notice */}
              <div
                className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                  isDarkMode
                    ? 'bg-[#1E324F]/40 border-[#1E324F] text-[#C1CDDC]'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                }`}
              >
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong>Data Preservation Guarantee:</strong> Academic curriculum, 200+ question bank, lesson content, faculty settings, and Admin profile remain completely untouched. No default XP or sample progress will be restored upon page refresh or subsequent logins.
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setResetUserProgressModalOpen(false)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold border transition cursor-pointer hover:bg-black/5 dark:hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmResetUserProgress}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-rose-600 hover:bg-rose-700 shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Confirm: Reset User Progress to 0</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
