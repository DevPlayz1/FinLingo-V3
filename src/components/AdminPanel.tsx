import React, { useState } from 'react';
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
  ArrowRight
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

interface AdminPanelProps {
  currentRole: UserRole;
  lessons: Lesson[];
  leaderboard: LeaderboardEntry[];
  userProfile: UserProfile;
  onRefreshData: () => void;
  onSwitchRole: (newRole: UserRole) => void;
  onOpenRoleSelection: () => void;
  showToast: (title: string, xp?: number, icon?: 'xp' | 'success' | 'streak') => void;
  isDarkMode?: boolean;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  currentRole,
  lessons,
  leaderboard,
  userProfile,
  onRefreshData,
  onSwitchRole,
  onOpenRoleSelection,
  showToast,
  isDarkMode = false
}) => {
  // Application Logic RBAC check
  if (currentRole !== 'admin') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div
          className={`rounded-3xl p-8 sm:p-12 border text-center space-y-6 shadow-lg ${
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
              403 Forbidden • Access Denied
            </span>
            <h1 className="text-3xl font-black mt-1">Admin Authorization Required</h1>
            <p
              className={`max-w-lg mx-auto text-sm mt-2 leading-relaxed ${
                isDarkMode ? 'text-[#C1CDDC]' : 'text-[#52647A]'
              }`}
            >
              Your active session is running with the <strong>User (College Scholar)</strong> role.
              The Admin Panel and its content modification APIs are restricted to verified
              administrators.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={() => onSwitchRole('admin')}
              className="px-6 py-3 rounded-xl font-bold text-sm text-white shadow-xs bg-[#E96746] hover:bg-[#D45333] transition cursor-pointer flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              <span>Switch to Admin Role</span>
            </button>
            <button
              onClick={onOpenRoleSelection}
              className={`px-5 py-3 rounded-xl font-semibold text-sm border transition cursor-pointer ${
                isDarkMode
                  ? 'border-[#1E324F] text-[#C1CDDC] hover:text-[#FFF8ED]'
                  : 'border-[#EDE3D2] text-[#52647A] hover:text-[#263238]'
              }`}
            >
              Open Role Selector
            </button>
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
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);

  // Leaderboard edit state
  const [editingEntry, setEditingEntry] = useState<LeaderboardEntry | null>(null);
  const [demoUserXpInput, setDemoUserXpInput] = useState<number>(userProfile.currentXp);
  const [resetModalOpen, setResetModalOpen] = useState(false);

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

  // 3. Save edited question
  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion) return;
    const success = dataService.updateQuestion(
      editingQuestion.id,
      {
        prompt: editingQuestion.prompt,
        options: editingQuestion.options,
        correctOptionIndex: Number(editingQuestion.correctOptionIndex),
        explanation: editingQuestion.explanation,
        xpPoints: Number(editingQuestion.xpPoints),
        difficulty: editingQuestion.difficulty
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

  // 5. Quick XP update specifically targeting Demo User (Student Scholar)
  const handleApplyDemoUserXp = () => {
    const success = dataService.setDemoUserXp(demoUserXpInput, currentRole, 'user');
    if (success) {
      onRefreshData();
      showToast(`Student Scholar XP Updated to ${demoUserXpInput}`, demoUserXpInput, 'xp');
    }
  };

  // 6. Safe Per-Profile Reset handlers
  const handleResetAdminOnly = () => {
    dataService.restoreDefaultData('admin');
    onRefreshData();
    setResetModalOpen(false);
    showToast('Admin Content & Curriculum Settings Restored', undefined, 'success');
  };

  const handleResetStudentOnly = () => {
    dataService.restoreDefaultData('user');
    onRefreshData();
    setDemoUserXpInput(420);
    setResetModalOpen(false);
    showToast('Student Scholar Progress Restored (Admin Settings Untouched)', undefined, 'success');
  };

  const handleResetAll = () => {
    dataService.restoreDefaultData('all');
    onRefreshData();
    setDemoUserXpInput(420);
    setResetModalOpen(false);
    showToast('All Demo Data Restored to Defaults', undefined, 'success');
  };

  // Filtered lessons
  const filteredLessons = lessons.filter((l) =>
    lessonTrackFilter === 'all' ? true : l.trackId === lessonTrackFilter
  );

  // All 200+ questions
  const allQuestions = dataService.getQuestions();
  const filteredQuestions = allQuestions.filter((q) => {
    const matchesTrack = questionTrackFilter === 'all' ? true : q.trackId === questionTrackFilter;
    const matchesSearch =
      q.prompt.toLowerCase().includes(questionSearch.toLowerCase()) ||
      q.explanation.toLowerCase().includes(questionSearch.toLowerCase()) ||
      q.topicTag.toLowerCase().includes(questionSearch.toLowerCase());
    return matchesTrack && matchesSearch;
  });

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
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#E96746] text-white shadow-md shrink-0">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#FDECE7] dark:bg-[#1E324F] text-[#E96746] dark:text-[#F07856] border border-[#E96746]/20">
                Staff Administration
              </span>
              <span className="text-xs text-[#52647A] dark:text-[#C1CDDC]">
                Local Sample Dataset RBAC
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
            onClick={() => onSwitchRole('user')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center gap-2 ${
              isDarkMode
                ? 'bg-[#0B1728] border-[#1E324F] text-[#C1CDDC] hover:text-[#FFF8ED]'
                : 'bg-[#FFF8ED] border-[#EDE3D2] text-[#263238] hover:bg-white'
            }`}
            title="Switch back to User view to test scholar experience"
          >
            <span>Test as Student User</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onOpenRoleSelection}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#E96746] hover:bg-[#D45333] text-white shadow-xs transition cursor-pointer"
          >
            Switch Demo Role
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

      {/* TAB 2: QUESTION BANK (200+ ITEMS) */}
      {adminTab === 'questions' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2
                className={`text-xl font-black ${
                  isDarkMode ? 'text-[#FFF8ED]' : 'text-[#263238]'
                }`}
              >
                Comprehensive 200+ Question Bank
              </h2>
              <p
                className={`text-xs sm:text-sm ${
                  isDarkMode ? 'text-[#C1CDDC]' : 'text-[#52647A]'
                }`}
              >
                Search and adjust quiz questions, options, difficulty ratings, and point values.
              </p>
            </div>

            {/* Search & Track filter */}
            <div className="flex flex-wrap items-center gap-2">
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs ${
                  isDarkMode ? 'bg-[#12233A] border-[#1E324F]' : 'bg-white border-[#EDE3D2]'
                }`}
              >
                <Search className="w-3.5 h-3.5 text-[#52647A] dark:text-[#C1CDDC]" />
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={questionSearch}
                  onChange={(e) => setQuestionSearch(e.target.value)}
                  className="bg-transparent focus:outline-hidden text-xs w-40 sm:w-52"
                />
              </div>

              <select
                value={questionTrackFilter}
                onChange={(e) => setQuestionTrackFilter(e.target.value as any)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold focus:outline-hidden ${
                  isDarkMode ? 'bg-[#12233A] border-[#1E324F] text-[#FFF8ED]' : 'bg-white border-[#EDE3D2] text-[#263238]'
                }`}
              >
                <option value="all">All Tracks</option>
                <option value="accounting">Accounting</option>
                <option value="economics">Economics</option>
                <option value="finance">Finance</option>
              </select>
            </div>
          </div>

          {/* Questions list */}
          <div className="space-y-3">
            {filteredQuestions.slice(0, 30).map((question) => (
              <div
                key={question.id}
                className={`p-4 rounded-2xl border transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isDarkMode
                    ? 'bg-[#12233A] border-[#1E324F]'
                    : 'bg-white border-[#EDE3D2]'
                }`}
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-[#FDECE7] dark:bg-[#1E324F] text-[#E96746] dark:text-[#F07856]">
                      {question.trackId}
                    </span>
                    <span className="text-[10px] font-bold text-[#52647A] dark:text-[#C1CDDC]">
                      ID: {question.id} • Lesson: {question.lessonId}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      {question.difficulty}
                    </span>
                    <span className="text-[10px] font-bold text-[#E96746] dark:text-[#F07856]">
                      +{question.xpPoints} XP
                    </span>
                  </div>

                  <p
                    className={`font-bold text-sm leading-snug ${
                      isDarkMode ? 'text-[#FFF8ED]' : 'text-[#263238]'
                    }`}
                  >
                    {question.prompt}
                  </p>

                  <div className="text-xs text-[#52647A] dark:text-[#C1CDDC] flex items-center gap-2">
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      Answer: {question.options[question.correctOptionIndex]}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setEditingQuestion(question)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 shrink-0 self-start md:self-auto cursor-pointer ${
                    isDarkMode
                      ? 'border-[#1E324F] hover:bg-[#1E324F] text-[#C1CDDC]'
                      : 'border-[#EDE3D2] hover:bg-[#FFF8ED] text-[#263238]'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Question</span>
                </button>
              </div>
            ))}

            {filteredQuestions.length > 30 && (
              <div className="text-center py-4 text-xs font-semibold text-[#52647A] dark:text-[#C1CDDC]">
                Showing first 30 of {filteredQuestions.length} matched questions. Use search to refine.
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
              React application state and local storage for Phase 2 evaluation. In a full production
              deployment with Firebase, security is enforced via Firestore Security Rules and custom
              claims on the user's ID token.
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

      {/* EDIT QUESTION MODAL */}
      {editingQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className={`w-full max-w-xl rounded-3xl p-6 sm:p-8 border shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto ${
              isDarkMode ? 'bg-[#12233A] border-[#1E324F] text-[#FFF8ED]' : 'bg-white border-[#EDE3D2] text-[#263238]'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-black uppercase text-[#E96746] dark:text-[#F07856]">
                  Edit Quiz Question
                </span>
                <h3 className="text-lg font-black">{editingQuestion.id}</h3>
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
                <label className="text-xs font-bold block mb-1">Question Prompt</label>
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

              {/* Options */}
              <div className="space-y-2">
                <label className="text-xs font-bold block">Answer Options &amp; Correct Key</label>
                {editingQuestion.options.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctOption"
                      checked={editingQuestion.correctOptionIndex === idx}
                      onChange={() => setEditingQuestion({ ...editingQuestion, correctOptionIndex: idx })}
                      className="accent-[#E96746]"
                    />
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
                  </div>
                ))}
              </div>

              <div>
                <label className="text-xs font-bold block mb-1">Explanation</label>
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

              <div className="flex items-center justify-end gap-2 pt-2">
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
            </form>
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
                  Restores default lesson lock statuses, question edits, and sample leaderboard scores. <strong>Student Scholar progress, XP, completed lessons, and streaks are 100% preserved.</strong>
                </p>
                <button
                  onClick={handleResetAdminOnly}
                  className="w-full mt-1 py-2 px-3 rounded-xl font-bold text-xs bg-amber-600 hover:bg-amber-700 text-white transition cursor-pointer shadow-xs"
                >
                  Reset Admin Content Only
                </button>
              </div>

              {/* Option 2: Student Scholar Progress */}
              <div className="p-4 rounded-2xl border border-blue-500/30 bg-blue-500/5 space-y-2">
                <span className="font-extrabold text-blue-600 dark:text-blue-400 text-sm block">
                  Option 2: Reset Demo Student Progress
                </span>
                <p className="text-xs text-[#52647A] dark:text-[#C1CDDC] leading-relaxed">
                  Resets the Student Scholar account back to Level 2, 420 XP, and 3-day streak. <strong>Your Admin curriculum configurations and custom questions remain untouched.</strong>
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
    </div>
  );
};
