/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { TracksView } from './components/TracksView';
import { SpacedRepetitionView } from './components/SpacedRepetitionView';
import { LeaderboardView } from './components/LeaderboardView';
import { ProfileView } from './components/ProfileView';
import { LessonDetailModal } from './components/LessonDetailModal';
import { QuizModal } from './components/QuizModal';
import { LegalCenterModal } from './components/LegalCenterModal';
import { LegalView } from './components/LegalView';
import { AffirmativeConsentModal } from './components/AffirmativeConsentModal';
import { RoleSelectScreen } from './components/RoleSelectScreen';
import { RestrictedAccessModal } from './components/RestrictedAccessModal';
import { AdminPanel } from './components/AdminPanel';
import { AuthScreen } from './components/AuthScreen';

import { dataService } from './services/dataService';
import { authService, ActiveSession } from './services/authService';
import {
  ActiveTab,
  UserProfile,
  Lesson,
  QuizQuestion,
  SpacedRepetitionItem,
  LeaderboardEntry,
  LearningTrack,
  LegalDocId,
  ConsentRecord,
  UserRole
} from './types';
import { Sparkles, CheckCircle2, Flame, Moon, Sun, Shield, Scale, FileText, Cookie, Mail, Lock, Info } from 'lucide-react';

export default function App() {
  // Theme state: dark / light mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('finlingo_theme_mode') === 'dark';
    } catch {
      return false;
    }
  });

  const handleToggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('finlingo_theme_mode', next ? 'dark' : 'light');
      } catch {
        // Ignore storage error
      }
      return next;
    });
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Navigation & View state
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);

  // Authentication & Session state
  const [currentSession, setCurrentSession] = useState<ActiveSession | null>(() => {
    return authService.getCurrentSession();
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Demo Role state (Phase 2 RBAC)
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const session = authService.getCurrentSession();
    if (session) return session.role;
    return dataService.getCurrentRole();
  });
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [restrictedLessonModal, setRestrictedLessonModal] = useState<Lesson | null>(null);

  // Data state
  const [userProfile, setUserProfile] = useState<UserProfile>(() => dataService.getUserProfile(currentRole));
  const [tracks] = useState<LearningTrack[]>(() => dataService.getTracks());
  const [lessons, setLessons] = useState<Lesson[]>(() => dataService.getLessons());
  const [spacedDeck, setSpacedDeck] = useState<SpacedRepetitionItem[]>(() =>
    dataService.getSpacedRepetitionDeck(currentRole)
  );
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() =>
    dataService.getLeaderboard()
  );

  // Modals state
  const [activeLessonModal, setActiveLessonModal] = useState<Lesson | null>(null);
  const [activeQuizModal, setActiveQuizModal] = useState<{
    lesson: Lesson;
    questions: QuizQuestion[];
  } | null>(null);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [isConsentModalOpen, setIsConsentModalOpen] = useState(false);
  const [selectedLegalDocId, setSelectedLegalDocId] = useState<LegalDocId>('privacy');

  const handleOpenLegalCenter = (docId: LegalDocId = 'privacy') => {
    setSelectedLegalDocId(docId);
    setIsLegalModalOpen(true);
  };

  const handleRecordConsent = (record: ConsentRecord) => {
    const current = dataService.getUserProfile(currentRole);
    const updated = { ...current, consentRecord: record };
    dataService.saveUserProfile(updated, currentRole);
    refreshState();
    showToast('Statutory Consent Recorded', undefined, 'success');
  };

  // Toast Notification state
  const [toastMessage, setToastMessage] = useState<{
    title: string;
    xp?: number;
    icon?: 'xp' | 'success' | 'streak' | 'info';
  } | null>(null);

  const showToast = (title: string, xp?: number, icon: 'xp' | 'success' | 'streak' | 'info' = 'xp') => {
    setToastMessage({ title, xp, icon });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Sync profile, lessons & leaderboard helper
  const refreshState = () => {
    const activeR = dataService.getCurrentRole();
    const updatedProfile = dataService.getUserProfile(activeR);
    setUserProfile(updatedProfile);
    setLessons(dataService.getLessons());
    setSpacedDeck(dataService.getSpacedRepetitionDeck(activeR));
    setLeaderboard(dataService.getLeaderboard());
  };

  // Login & Session handlers
  const handleLoginSuccess = (session: { email: string; role: UserRole; displayName: string }) => {
    const freshSession = authService.getCurrentSession();
    setCurrentSession(freshSession);
    setCurrentRole(session.role);
    dataService.setRole(session.role);
    setIsAuthModalOpen(false);
    refreshState();
    showToast(
      `Welcome, ${session.displayName}! Signed in as ${session.role === 'admin' ? 'Faculty Admin' : 'College Scholar'}.`,
      undefined,
      'success'
    );
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentSession(null);
    setIsRoleModalOpen(false);
    showToast('You have signed out of FinLingo.', undefined, 'info');
  };

  // Role selection & switching
  const handleSelectRole = (role: UserRole) => {
    dataService.setRole(role);
    setCurrentRole(role);
    setIsRoleModalOpen(false);

    // Keep active session in sync with role switch
    const targetEmail = role === 'admin' ? 'admin@finlingo.local' : 'learner@finlingo.local';
    const targetName = role === 'admin' ? 'Prof. Eleanor Vance' : 'Student Scholar';
    setCurrentSession({
      email: targetEmail,
      role,
      displayName: targetName,
      sessionToken: 'local_switch_' + Date.now(),
      sessionEpoch: Date.now(),
      loginTime: Date.now()
    });

    refreshState();
    if (role === 'user' && activeTab === 'admin') {
      setActiveTab('dashboard');
    }
    showToast(
      role === 'admin'
        ? 'Switched to Academic Admin Profile (Prof. Eleanor Vance)'
        : 'Switched to College Scholar Profile (Student Scholar)',
      undefined,
      'streak'
    );
  };

  const handleSetActiveTab = (tab: ActiveTab) => {
    // Application-logic level protection:
    if (tab === 'admin' && currentRole !== 'admin') {
      showToast('Access Denied: Admin role required for Admin Panel', undefined, 'xp');
      return;
    }
    setActiveTab(tab);
  };

  // Lesson actions (Protected by RBAC check)
  const handleOpenLesson = (lesson: Lesson) => {
    if (currentRole !== 'admin' && lesson.isAdminOnly) {
      setRestrictedLessonModal(lesson);
      return;
    }
    setActiveLessonModal(lesson);
  };

  const handleCompleteLesson = (lessonId: string, xpValue: number) => {
    const result = dataService.completeLesson(lessonId, xpValue);
    setUserProfile(result.profile);
    refreshState();

    if (result.isNewlyCompleted) {
      showToast('Lesson Mastered!', result.awardedXp, 'success');
    } else {
      showToast('Lesson Reviewed (Already Mastered)', undefined, 'info');
    }

    if (result.leveledUp) {
      setTimeout(() => {
        showToast(`Career Promotion: Level ${result.newLevel} - ${result.newLevelTitle}!`, undefined, 'xp');
      }, 700);
    }

    if (result.newAchievements && result.newAchievements.length > 0) {
      result.newAchievements.forEach((ach, idx) => {
        setTimeout(() => {
          showToast(`Achievement Unlocked: ${ach.title}!`, undefined, 'success');
        }, 1200 + idx * 500);
      });
    }
  };

  const handleToggleBookmark = (lessonId: string) => {
    dataService.toggleBookmarkLesson(lessonId);
    refreshState();
  };

  // Quiz actions (Protected by RBAC check)
  const handleStartQuiz = (lesson: Lesson) => {
    if (currentRole !== 'admin' && lesson.isAdminOnly) {
      setRestrictedLessonModal(lesson);
      return;
    }
    let questions = dataService.getQuestionsByLesson(lesson.id);
    if (!questions || questions.length === 0) {
      questions = dataService.getQuestionsByTrack(lesson.trackId);
    }
    if (questions && questions.length > 0) {
      setActiveQuizModal({ lesson, questions });
    } else {
      showToast('Practice quiz loaded', undefined, 'xp');
    }
  };

  const handleQuizComplete = (results: {
    lessonId?: string;
    totalAnswered: number;
    correctCount: number;
    earnedXp: number;
    isPerfect: boolean;
    wrongQuestions: QuizQuestion[];
  }) => {
    // Record into user profile using progression scoring engine
    const quizResult = dataService.recordQuizResults(
      results.lessonId,
      results.totalAnswered,
      results.correctCount,
      results.earnedXp,
      results.isPerfect
    );

    // Enqueue any missed questions into Spaced Repetition deck
    results.wrongQuestions.forEach((wrongQ) => {
      dataService.enqueueSpacedRepetition(wrongQ);
    });

    setUserProfile(quizResult.profile);
    refreshState();

    if (quizResult.awardedXp > 0) {
      const msg = results.isPerfect
        ? 'Flawless Quiz Assessment!'
        : quizResult.isImprovement
        ? 'Quiz Score Improved!'
        : 'Quiz Session Complete!';
      showToast(msg, quizResult.awardedXp, 'xp');
    } else {
      showToast('Practice Session Complete! (Max XP already achieved)', undefined, 'info');
    }

    if (quizResult.leveledUp) {
      setTimeout(() => {
        showToast(`Career Promotion: Level ${quizResult.newLevel} - ${quizResult.newLevelTitle}!`, undefined, 'xp');
      }, 700);
    }

    if (quizResult.newAchievements && quizResult.newAchievements.length > 0) {
      quizResult.newAchievements.forEach((ach, idx) => {
        setTimeout(() => {
          showToast(`Achievement Unlocked: ${ach.title}!`, undefined, 'success');
        }, 1200 + idx * 500);
      });
    }
  };

  // Spaced Repetition actions
  const handleAdvanceSpacedItem = (itemId: string, correct: boolean) => {
    const result = dataService.advanceSpacedRepetition(itemId, correct);
    if (result && correct) {
      showToast(
        result.isMastered ? 'Concept Mastered!' : 'Memory Interval Advanced!',
        result.awardedXp,
        'xp'
      );
      if (result.newAchievements && result.newAchievements.length > 0) {
        result.newAchievements.forEach((ach, idx) => {
          setTimeout(() => {
            showToast(`Achievement Unlocked: ${ach.title}!`, undefined, 'success');
          }, 800 + idx * 500);
        });
      }
    }
    refreshState();
  };

  const handleRemoveSpacedItem = (itemId: string) => {
    dataService.removeSpacedRepetitionItem(itemId);
    refreshState();
  };

  // Profile actions
  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    const current = dataService.getUserProfile();
    const merged = { ...current, ...updated };
    dataService.saveUserProfile(merged);
    refreshState();
    showToast('Profile Saved', undefined, 'success');
  };

  const handleResetData = (target?: 'user' | 'admin' | 'all') => {
    const roleTarget = target ?? currentRole;
    dataService.restoreDefaultData(roleTarget);
    refreshState();
    showToast(
      roleTarget === 'admin'
        ? 'Admin Profile & Settings Restored to Defaults'
        : roleTarget === 'user'
        ? 'Student Scholar Progress Restored to Defaults'
        : 'All Sample Data Restored to Defaults',
      undefined,
      'success'
    );
  };

  // Render AuthScreen if user is not authenticated or if modal is opened
  if (!currentSession || isAuthModalOpen) {
    return (
      <div
        className={`min-h-screen font-sans flex flex-col selection:bg-[#E96746] selection:text-white transition-colors duration-200 ${
          isDarkMode ? 'bg-[#0B1728] text-[#FFF8ED]' : 'bg-[#FFF8ED] text-[#263238]'
        }`}
      >
        <AuthScreen
          onLoginSuccess={handleLoginSuccess}
          initialRoleTab={currentRole}
          isDarkMode={isDarkMode}
        />
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
            <div
              className={`p-4 rounded-2xl shadow-xl border flex items-center gap-3 ${
                isDarkMode ? 'bg-[#12233A] border-[#1E324F] text-[#FFF8ED]' : 'bg-white border-[#EDE3D2] text-[#263238]'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-[#E96746] text-white flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className="font-bold text-xs">{toastMessage.title}</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen font-sans flex flex-col selection:bg-[#E96746] selection:text-white transition-colors duration-200 ${
        isDarkMode ? 'bg-[#0B1728] text-[#FFF8ED]' : 'bg-[#FFF8ED] text-[#263238]'
      }`}
    >
      {/* Top Navigation with Dark Mode & Standalone Tab Sync */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleSetActiveTab}
        userProfile={userProfile}
        currentRole={currentRole}
        accountEmail={currentSession?.email}
        onLogout={handleLogout}
        spacedRepetitionDueCount={spacedDeck.length}
        onOpenLegalCenter={() => handleOpenLegalCenter('privacy')}
        onOpenRoleSelection={() => setIsRoleModalOpen(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'dashboard' && (
          <DashboardView
            userProfile={userProfile}
            tracks={tracks}
            lessons={lessons}
            currentRole={currentRole}
            spacedRepetitionDueCount={spacedDeck.length}
            spacedRepetitionItems={spacedDeck}
            leaderboard={leaderboard}
            onSelectTrack={(trackId) => setSelectedTrackId(trackId)}
            onOpenLesson={handleOpenLesson}
            onStartQuiz={handleStartQuiz}
            setActiveTab={handleSetActiveTab}
            onOpenPractice={() => handleSetActiveTab('practice')}
            isDarkMode={isDarkMode}
          />
        )}

        {activeTab === 'tracks' && (
          <TracksView
            tracks={tracks}
            lessons={lessons}
            userProfile={userProfile}
            selectedTrackId={selectedTrackId}
            currentRole={currentRole}
            onSelectTrackId={setSelectedTrackId}
            onOpenLesson={handleOpenLesson}
            onStartQuiz={handleStartQuiz}
            onToggleBookmark={handleToggleBookmark}
            isDarkMode={isDarkMode}
          />
        )}

        {activeTab === 'practice' && (
          <SpacedRepetitionView
            items={spacedDeck}
            userProfile={userProfile}
            onAdvanceItem={handleAdvanceSpacedItem}
            onRemoveItem={handleRemoveSpacedItem}
            onNavigateToTracks={() => handleSetActiveTab('tracks')}
            isDarkMode={isDarkMode}
          />
        )}

        {activeTab === 'leaderboard' && (
          <LeaderboardView
            entries={leaderboard}
            userProfile={userProfile}
            isDarkMode={isDarkMode}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            userProfile={userProfile}
            currentRole={currentRole}
            accountEmail={currentSession?.email}
            onLogout={handleLogout}
            onOpenRoleSelection={() => setIsRoleModalOpen(true)}
            onUpdateProfile={handleUpdateProfile}
            onResetData={handleResetData}
            onOpenLegalCenter={handleOpenLegalCenter}
            onOpenConsentModal={() => setIsConsentModalOpen(true)}
            isDarkMode={isDarkMode}
            onToggleDarkMode={handleToggleDarkMode}
          />
        )}

        {activeTab === 'legal' && (
          <LegalView
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
            onResetData={handleResetData}
            isDarkMode={isDarkMode}
          />
        )}

        {activeTab === 'admin' && (
          <AdminPanel
            currentRole={currentRole}
            lessons={lessons}
            leaderboard={leaderboard}
            userProfile={currentRole === 'admin' ? dataService.getUserProfile('user') : userProfile}
            onRefreshData={refreshState}
            onSwitchRole={handleSelectRole}
            onOpenRoleSelection={() => setIsRoleModalOpen(true)}
            showToast={showToast}
            isDarkMode={isDarkMode}
          />
        )}
      </main>

      {/* Footer with Statutory Legal & Privacy Framework */}
      <footer
        className={`border-t pt-8 pb-10 text-xs transition-colors ${
          isDarkMode
            ? 'bg-[#0B192C] border-[#1E3A5F] text-[#E8F0F8]/70'
            : 'bg-white border-[#E8F0F8] text-[#263238]/70'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Top row: Brand & navigation */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-4 border-b border-[#E8F0F8] dark:border-[#1E3A5F]">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#173B63] dark:bg-[#132238] flex items-center justify-center text-white border border-[#F07856]/40">
                <Sparkles className="w-3.5 h-3.5 text-[#F07856]" />
              </div>
              <span
                className={`font-black text-sm tracking-tight ${
                  isDarkMode ? 'text-[#FFF8ED]' : 'text-[#173B63]'
                }`}
              >
                FinLingo
              </span>
              <span className="text-[#263238]/40 dark:text-[#E8F0F8]/40">•</span>
              <span className="text-xs">
                Commerce &amp; Finance Gamified Learning Platform for College Scholars
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`transition hover:text-[#F07856] cursor-pointer ${
                  isDarkMode ? 'text-[#E8F0F8]' : 'text-[#173B63]'
                }`}
              >
                Dashboard
              </button>
              <span>•</span>
              <button
                onClick={() => setActiveTab('tracks')}
                className={`transition hover:text-[#F07856] cursor-pointer ${
                  isDarkMode ? 'text-[#E8F0F8]' : 'text-[#173B63]'
                }`}
              >
                Curriculum
              </button>
              <span>•</span>
              <button
                onClick={() => setActiveTab('practice')}
                className={`transition hover:text-[#F07856] cursor-pointer ${
                  isDarkMode ? 'text-[#E8F0F8]' : 'text-[#173B63]'
                }`}
              >
                Spaced Review
              </button>
              <span>•</span>
              <button
                onClick={() => setActiveTab('leaderboard')}
                className={`transition hover:text-[#F07856] cursor-pointer ${
                  isDarkMode ? 'text-[#E8F0F8]' : 'text-[#173B63]'
                }`}
              >
                Leaderboard
              </button>
              <span>•</span>
              <button
                onClick={() => setIsRoleModalOpen(true)}
                className="text-[#E96746] dark:text-[#F07856] hover:underline font-bold transition cursor-pointer inline-flex items-center gap-1"
                title="Switch demo role between College Scholar and Academic Admin"
              >
                <Shield className="w-3 h-3" />
                <span>Role: {currentRole === 'admin' ? 'Admin' : 'Student'}</span>
              </button>
              {currentRole === 'admin' && (
                <>
                  <span>•</span>
                  <button
                    onClick={() => setActiveTab('admin')}
                    className="text-[#E96746] dark:text-[#F07856] hover:underline font-bold transition cursor-pointer"
                  >
                    Admin Panel
                  </button>
                </>
              )}
              <span>•</span>
              <button
                onClick={handleToggleDarkMode}
                className="inline-flex items-center gap-1 font-bold text-[#F07856] hover:underline cursor-pointer"
              >
                {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
            </div>
          </div>

          {/* Middle row: Statutory Legal and Policy Links */}
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-[#173B63] dark:text-[#FFF8ED]">
              <Shield className="w-4 h-4 text-[#F07856]" />
              <span>Legal &amp; Regulatory (India):</span>
            </div>

            <div className="flex flex-wrap items-center gap-x-3.5 gap-y-2">
              <button
                onClick={() => handleOpenLegalCenter('privacy')}
                className="hover:text-[#F07856] transition cursor-pointer font-medium hover:underline flex items-center gap-1"
              >
                <span>Privacy Policy (DPDPA 2023)</span>
              </button>
              <span>•</span>
              <button
                onClick={() => handleOpenLegalCenter('terms')}
                className="hover:text-[#F07856] transition cursor-pointer font-medium hover:underline"
              >
                Terms of Service
              </button>
              <span>•</span>
              <button
                onClick={() => handleOpenLegalCenter('security')}
                className="hover:text-[#F07856] transition cursor-pointer font-medium hover:underline"
              >
                Data Protection Notice
              </button>
              <span>•</span>
              <button
                onClick={() => handleOpenLegalCenter('cookies')}
                className="hover:text-[#F07856] transition cursor-pointer font-medium hover:underline"
              >
                Cookie &amp; Storage Notice
              </button>
              <span>•</span>
              <button
                onClick={() => handleOpenLegalCenter('deletion')}
                className="hover:text-[#F07856] transition cursor-pointer font-medium hover:underline text-[#DC2626] dark:text-[#EF4444]"
              >
                Account Deletion
              </button>
              <span>•</span>
              <button
                onClick={() => handleOpenLegalCenter('community')}
                className="hover:text-[#F07856] transition cursor-pointer font-medium hover:underline"
              >
                Community Rules
              </button>
              <span>•</span>
              <button
                onClick={() => handleOpenLegalCenter('disclaimer')}
                className="hover:text-[#F07856] transition cursor-pointer font-medium hover:underline text-[#F07856] font-semibold"
              >
                SEBI &amp; Academic Disclaimer
              </button>
              <span>•</span>
              <button
                onClick={() => handleOpenLegalCenter('grievance')}
                className="hover:text-[#F07856] transition cursor-pointer font-medium hover:underline"
              >
                Grievance Redressal (Rule 3(2))
              </button>
              <span>•</span>
              <button
                onClick={() => handleOpenLegalCenter('data-rights')}
                className="hover:text-[#F07856] transition cursor-pointer font-bold text-[#F07856] hover:underline"
              >
                Privacy Controls &amp; Data Export
              </button>
            </div>
          </div>

          {/* Bottom row: Explicit Statutory & Jurisdiction Disclaimers */}
          <div className="pt-2 text-[11px] leading-relaxed text-[#263238]/60 dark:text-[#E8F0F8]/60 border-t border-[#E8F0F8]/60 dark:border-[#1E3A5F]/60 flex flex-col md:flex-row items-center justify-between gap-2">
            <p>
              © {new Date().getFullYear()} FinLingo Education Technologies. Tailored for higher-education commerce students in the Republic of India. Educational study aid only — not registered under SEBI (Investment Advisers) Regulations, 2013; content does not constitute certified investment, statutory audit, or legal advice.
            </p>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="inline-flex items-center gap-1 font-semibold text-[#16A34A]">
                <CheckCircle2 className="w-3 h-3" />
                DPDPA 2023 Ready
              </span>
              <span>•</span>
              <button
                onClick={() => setActiveTab('legal')}
                className="font-bold text-[#F07856] hover:underline cursor-pointer"
              >
                View Legal Center
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Lesson Reading Modal */}
      <LessonDetailModal
        lesson={activeLessonModal}
        track={
          activeLessonModal
            ? tracks.find((t) => t.id === activeLessonModal.trackId)
            : undefined
        }
        isOpen={Boolean(activeLessonModal)}
        onClose={() => setActiveLessonModal(null)}
        isCompleted={
          activeLessonModal
            ? userProfile.completedLessonIds.includes(activeLessonModal.id)
            : false
        }
        isBookmarked={
          activeLessonModal
            ? userProfile.bookmarkedLessonIds.includes(activeLessonModal.id)
            : false
        }
        onCompleteLesson={handleCompleteLesson}
        onToggleBookmark={handleToggleBookmark}
        onStartQuiz={handleStartQuiz}
        isDarkMode={isDarkMode}
      />

      {/* Quiz Modal */}
      {activeQuizModal && (
        <QuizModal
          lesson={activeQuizModal.lesson}
          questions={activeQuizModal.questions}
          userProfile={userProfile}
          isOpen={Boolean(activeQuizModal)}
          onClose={() => setActiveQuizModal(null)}
          onQuizComplete={handleQuizComplete}
          onNavigateToPractice={() => setActiveTab('practice')}
          isDarkMode={isDarkMode}
        />
      )}


      {/* Legal & Privacy Center Modal */}
      <LegalCenterModal
        isOpen={isLegalModalOpen}
        onClose={() => setIsLegalModalOpen(false)}
        initialDocId={selectedLegalDocId}
        userProfile={userProfile}
        onUpdateProfile={handleUpdateProfile}
        onResetData={handleResetData}
        isDarkMode={isDarkMode}
      />

      {/* Affirmative Statutory Consent Modal (DPDPA 2023 & IT Act) */}
      <AffirmativeConsentModal
        isOpen={isConsentModalOpen}
        onClose={() => setIsConsentModalOpen(false)}
        onRecordConsent={handleRecordConsent}
        onOpenPolicyDoc={handleOpenLegalCenter}
        isDarkMode={isDarkMode}
      />

      {/* Restricted Academic Content Modal (RBAC Enforcement) */}
      {restrictedLessonModal && (
        <RestrictedAccessModal
          lesson={restrictedLessonModal}
          onClose={() => setRestrictedLessonModal(null)}
          onSwitchToAdmin={() => {
            setRestrictedLessonModal(null);
            handleSelectRole('admin');
          }}
          isDarkMode={isDarkMode}
        />
      )}

      {/* Demo Role Selection Modal / Screen */}
      {isRoleModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
          <div className="w-full max-w-5xl my-auto">
            <RoleSelectScreen
              currentRole={currentRole}
              onSelectRole={handleSelectRole}
              onCancel={() => setIsRoleModalOpen(false)}
              onOpenLogin={() => {
                setIsRoleModalOpen(false);
                setIsAuthModalOpen(true);
              }}
              isDarkMode={isDarkMode}
            />
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div
            className={`px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border ${
              isDarkMode
                ? 'bg-[#132238] text-[#FFF8ED] border-[#1E3A5F]'
                : 'bg-[#173B63] text-[#FFF8ED] border-[#173B63]'
            }`}
          >
            {toastMessage.icon === 'xp' ? (
              <div className="w-8 h-8 rounded-xl bg-[#F07856] text-white flex items-center justify-center font-black">
                <Sparkles className="w-4 h-4 fill-current" />
              </div>
            ) : toastMessage.icon === 'streak' ? (
              <div className="w-8 h-8 rounded-xl bg-[#F07856] text-white flex items-center justify-center">
                <Flame className="w-4 h-4 fill-current" />
              </div>
            ) : toastMessage.icon === 'info' ? (
              <div className="w-8 h-8 rounded-xl bg-blue-500 text-white flex items-center justify-center">
                <Info className="w-4 h-4" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-xl bg-[#16A34A] text-white flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            )}

            <div>
              <div className="text-xs font-bold leading-tight">{toastMessage.title}</div>
              {toastMessage.xp !== undefined && (
                <div className="text-[11px] text-[#F07856] font-extrabold">
                  +{toastMessage.xp} Experience Points Earned!
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
