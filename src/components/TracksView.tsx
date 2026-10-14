import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  ArrowRight,
  Bookmark,
  Search,
  Building,
  Lock
} from 'lucide-react';
import { LearningTrack, Lesson, UserProfile, UserRole } from '../types';

interface TracksViewProps {
  tracks: LearningTrack[];
  lessons: Lesson[];
  userProfile: UserProfile;
  selectedTrackId: string | null;
  currentRole?: UserRole;
  onSelectTrackId: (trackId: string | null) => void;
  onOpenLesson: (lesson: Lesson) => void;
  onStartQuiz: (lesson: Lesson) => void;
  onToggleBookmark: (lessonId: string) => void;
  isDarkMode?: boolean;
}

export const TracksView: React.FC<TracksViewProps> = ({
  tracks,
  lessons,
  userProfile,
  selectedTrackId,
  currentRole = 'user',
  onSelectTrackId,
  onOpenLesson,
  onStartQuiz,
  onToggleBookmark,
  isDarkMode = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'uncompleted'>('all');

  const filteredLessons = lessons.filter((lesson) => {
    const matchesTrack = selectedTrackId ? lesson.trackId === selectedTrackId : true;
    const matchesSearch =
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.shortDefinition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.realWorldExample.companyOrContext.toLowerCase().includes(searchQuery.toLowerCase());

    const isCompleted = userProfile.completedLessonIds.includes(lesson.id);
    const matchesStatus =
      filterStatus === 'all'
        ? true
        : filterStatus === 'completed'
        ? isCompleted
        : !isCompleted;

    return matchesTrack && matchesSearch && matchesStatus;
  });

  const activeTrack = tracks.find((t) => t.id === selectedTrackId);

  // Compute next available uncompleted lesson in current view
  const uncompletedEligible = lessons
    .filter((l) => (selectedTrackId ? l.trackId === selectedTrackId : true))
    .filter((l) => !userProfile.completedLessonIds.includes(l.id))
    .filter((l) => currentRole === 'admin' || !l.isAdminOnly);
  const nextUpLessonId = uncompletedEligible[0]?.id;

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header and Track Selector Bar */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1
              className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                isDarkMode ? 'text-[#FFF8ED]' : 'text-[#173B63]'
              }`}
            >
              Curriculum Tracks &amp; Lessons
            </h1>
            <p
              className={`text-sm mt-1 ${
                isDarkMode ? 'text-[#E8F0F8]/70' : 'text-[#263238]/70'
              }`}
            >
              Select an area of commerce specialization or browse fundamental concepts below.
            </p>
          </div>

          {/* Quick Track Switcher Tabs */}
          <div
            className={`flex items-center gap-1.5 p-1 rounded-xl border self-start sm:self-auto overflow-x-auto max-w-full ${
              isDarkMode ? 'bg-[#132238] border-[#1E3A5F]' : 'bg-[#E8F0F8] border-[#E8F0F8]'
            }`}
          >
            <button
              onClick={() => onSelectTrackId(null)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#F07856] ${
                selectedTrackId === null
                  ? isDarkMode
                    ? 'bg-[#F07856] text-white shadow-xs'
                    : 'bg-[#173B63] text-white shadow-xs'
                  : isDarkMode
                  ? 'text-[#E8F0F8] hover:text-[#FFF8ED] hover:bg-[#1E3A5F]'
                  : 'text-[#173B63] hover:text-[#173B63] hover:bg-white/60'
              }`}
            >
              All Tracks
            </button>
            {tracks.map((t) => (
              <button
                key={t.id}
                onClick={() => onSelectTrackId(t.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#F07856] ${
                  selectedTrackId === t.id
                    ? isDarkMode
                      ? 'bg-[#F07856] text-white shadow-xs'
                      : 'bg-[#173B63] text-white shadow-xs'
                    : isDarkMode
                    ? 'text-[#E8F0F8] hover:text-[#FFF8ED] hover:bg-[#1E3A5F]'
                    : 'text-[#173B63] hover:text-[#173B63] hover:bg-white/60'
                }`}
              >
                {t.id === 'accounting' ? 'Accounting' : t.id === 'economics' ? 'Economics' : 'Finance'}
              </button>
            ))}
          </div>
        </div>

        {/* Active Track Highlight Banner (if a track is selected) */}
        {activeTrack && (
          <div
            className={`mt-5 p-6 rounded-2xl text-white border shadow-md transition-colors ${
              isDarkMode
                ? 'bg-[#132238] border-[#1E3A5F]'
                : 'bg-[#173B63] border-[#173B63]'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#E8F0F8]">
                  <span
                    className={`px-2.5 py-0.5 rounded-md font-bold ${
                      isDarkMode
                        ? 'bg-[#1E3A5F] text-[#F07856]'
                        : 'bg-[#FCE5DC] text-[#F07856]'
                    }`}
                  >
                    Active Track
                  </span>
                  <span>•</span>
                  <span>Target Careers: {activeTrack.targetCareer}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#FFF8ED]">
                  {activeTrack.title}
                </h2>
                <p className="text-xs sm:text-sm text-[#E8F0F8] leading-relaxed">
                  {activeTrack.detailedDescription}
                </p>
              </div>

              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-xs p-4 rounded-xl border border-white/20 shrink-0">
                <div className="text-center">
                  <span className="block text-xl font-extrabold text-[#FFF8ED]">
                    {activeTrack.totalLessons}
                  </span>
                  <span className="text-[11px] text-[#E8F0F8]">Lessons</span>
                </div>
                <div className="h-8 w-px bg-white/20" />
                <div className="text-center">
                  <span className="block text-xl font-extrabold text-[#F07856]">
                    +{activeTrack.totalLessons * 40}
                  </span>
                  <span className="text-[11px] text-[#E8F0F8]">Lesson XP</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div
        className={`flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl border shadow-2xs transition-colors ${
          isDarkMode
            ? 'bg-[#132238] border-[#1E3A5F]'
            : 'bg-white border-[#E8F0F8]'
        }`}
      >
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#263238]/40 dark:text-[#E8F0F8]/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search concepts (e.g. EBITDA, CAPM, Elasticity)..."
            className={`w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border focus:outline-hidden focus:border-[#F07856] focus:ring-2 focus:ring-[#F07856]/20 ${
              isDarkMode
                ? 'bg-[#0B192C] border-[#1E3A5F] text-[#FFF8ED] placeholder-[#E8F0F8]/40'
                : 'bg-[#FFF8ED]/50 border-[#E8F0F8] text-[#263238]'
            }`}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span
            className={`text-xs font-bold ${
              isDarkMode ? 'text-[#E8F0F8]/70' : 'text-[#263238]/70'
            }`}
          >
            Filter Status:
          </span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold focus:outline-hidden focus:border-[#F07856] ${
              isDarkMode
                ? 'bg-[#0B192C] border-[#1E3A5F] text-[#FFF8ED]'
                : 'bg-[#E8F0F8]/50 border-[#E8F0F8] text-[#173B63]'
            }`}
          >
            <option value="all">All Lessons ({lessons.length})</option>
            <option value="completed">Completed ({userProfile.completedLessonIds.length})</option>
            <option value="uncompleted">Incomplete</option>
          </select>
        </div>
      </div>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLessons.map((lesson) => {
          const isCompleted = userProfile.completedLessonIds.includes(lesson.id);
          const isBookmarked = userProfile.bookmarkedLessonIds.includes(lesson.id);

          return (
            <div
              key={lesson.id}
              className={`rounded-2xl border transition-all duration-200 shadow-2xs hover:shadow-md flex flex-col justify-between p-5 sm:p-6 ${
                isDarkMode
                  ? isCompleted
                    ? 'bg-[#132238] border-[#16A34A]/40'
                    : 'bg-[#132238] border-[#1E3A5F] hover:border-[#F07856]/50'
                  : isCompleted
                  ? 'bg-white border-[#16A34A]/30 ring-1 ring-[#16A34A]/10'
                  : 'bg-white border-[#E8F0F8] hover:border-[#F07856]/40'
              }`}
            >
              <div>
                {/* Lesson Header Tags */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                        isDarkMode
                          ? 'bg-[#1E3A5F] text-[#FFF8ED] border-[#1E3A5F]'
                          : 'bg-[#E8F0F8] text-[#173B63] border-[#173B63]/10'
                      }`}
                    >
                      {lesson.trackId.toUpperCase()}
                    </span>
                    <span
                      className={`text-xs font-medium ${
                        isDarkMode ? 'text-[#E8F0F8]/50' : 'text-[#263238]/50'
                      }`}
                    >
                      Lesson #{lesson.order}
                    </span>
                    {lesson.isAdminOnly && (
                      <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded-md border border-amber-500/30">
                        <Lock className="w-3 h-3" />
                        <span>Admin Only</span>
                      </span>
                    )}
                    {lesson.id === nextUpLessonId && !isCompleted && (
                      <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 rounded-md border border-blue-300 dark:border-blue-700">
                        Next Up
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap justify-end">
                    <button
                      onClick={() => onToggleBookmark(lesson.id)}
                      className={`p-1.5 rounded-lg transition focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#F07856] ${
                        isBookmarked
                          ? 'text-[#F07856] bg-[#FCE5DC]'
                          : isDarkMode
                          ? 'text-[#E8F0F8]/40 hover:text-[#FFF8ED] hover:bg-[#1E3A5F]'
                          : 'text-[#263238]/40 hover:text-[#173B63] hover:bg-[#E8F0F8]'
                      }`}
                      title={isBookmarked ? 'Bookmarked' : 'Bookmark lesson'}
                    >
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>
                    {isCompleted && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full border border-[#16A34A]/20">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mastered</span>
                      </span>
                    )}
                    {userProfile.lessonQuizRecords?.[lesson.id] && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100/70 dark:bg-amber-900/30 px-2 py-0.5 rounded-full border border-amber-300/40">
                        Quiz: {userProfile.lessonQuizRecords[lesson.id].bestScore}/{userProfile.lessonQuizRecords[lesson.id].totalQuestions}
                      </span>
                    )}
                  </div>
                </div>

                {/* Lesson Title & Core Term */}
                <h3
                  className={`font-extrabold text-base sm:text-lg leading-snug ${
                    isDarkMode ? 'text-[#FFF8ED]' : 'text-[#173B63]'
                  }`}
                >
                  {lesson.title}
                </h3>

                <div
                  className={`mt-2 text-xs font-bold px-2.5 py-1 rounded-md inline-block border ${
                    isDarkMode
                      ? 'bg-[#1E3A5F] text-[#F07856] border-[#F07856]/30'
                      : 'bg-[#FCE5DC]/60 text-[#F07856] border-[#F07856]/20'
                  }`}
                >
                  Concept:{' '}
                  <span
                    className={`font-black ${
                      isDarkMode ? 'text-[#FFF8ED]' : 'text-[#173B63]'
                    }`}
                  >
                    {lesson.term}
                  </span>
                </div>

                <p
                  className={`mt-2.5 text-xs sm:text-sm leading-relaxed line-clamp-3 ${
                    isDarkMode ? 'text-[#E8F0F8]/80' : 'text-[#263238]'
                  }`}
                >
                  {lesson.shortDefinition}
                </p>

                {/* Corporate Case Tag */}
                <div
                  className={`mt-4 pt-3 border-t flex items-center gap-2 text-xs ${
                    isDarkMode
                      ? 'border-[#1E3A5F] text-[#E8F0F8]/70'
                      : 'border-[#E8F0F8] text-[#263238]/70'
                  }`}
                >
                  <Building className="w-3.5 h-3.5 text-[#F07856] shrink-0" />
                  <span className="truncate">
                    Case:{' '}
                    <strong className={isDarkMode ? 'text-[#FFF8ED]' : 'text-[#173B63]'}>
                      {lesson.realWorldExample.companyOrContext}
                    </strong>
                  </span>
                </div>
              </div>

              {/* Bottom Actions */}
              <div
                className={`mt-5 pt-3.5 border-t flex items-center justify-between gap-2 ${
                  isDarkMode ? 'border-[#1E3A5F]' : 'border-[#E8F0F8]'
                }`}
              >
                <div
                  className={`flex items-center gap-2 text-[11px] font-semibold ${
                    isDarkMode ? 'text-[#E8F0F8]/60' : 'text-[#263238]/60'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#F07856]" />
                    {lesson.estimatedMinutes}m
                  </span>
                  <span>•</span>
                  <span className="text-[#F07856] font-bold">+{lesson.xpValue} XP</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenLesson(lesson)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                      lesson.isAdminOnly && currentRole !== 'admin'
                        ? 'border border-amber-500/40 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10'
                        : isDarkMode
                        ? 'text-[#FFF8ED] hover:bg-[#1E3A5F]'
                        : 'text-[#173B63] hover:bg-[#E8F0F8]'
                    }`}
                  >
                    {lesson.isAdminOnly && currentRole !== 'admin' && <Lock className="w-3 h-3 text-amber-500" />}
                    <span>{lesson.isAdminOnly && currentRole !== 'admin' ? 'Admin Only' : isCompleted ? 'Review Lesson' : 'Read Lesson'}</span>
                  </button>
                  <button
                    onClick={() => onStartQuiz(lesson)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-xs transition flex items-center gap-1 cursor-pointer ${
                      lesson.isAdminOnly && currentRole !== 'admin'
                        ? 'bg-amber-600 hover:bg-amber-700 text-white'
                        : 'bg-[#F07856] hover:bg-[#D95D3B] text-white'
                    }`}
                  >
                    {lesson.isAdminOnly && currentRole !== 'admin' ? (
                      <>
                        <Lock className="w-3 h-3" />
                        <span>Locked</span>
                      </>
                    ) : (
                      <>
                        <span>{userProfile.lessonQuizRecords?.[lesson.id] ? 'Retake Quiz' : 'Practice Quiz'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredLessons.length === 0 && (
        <div
          className={`p-12 text-center rounded-2xl border ${
            isDarkMode
              ? 'bg-[#132238] border-[#1E3A5F]'
              : 'bg-white border-[#E8F0F8]'
          }`}
        >
          <BookOpen className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
          <h3
            className={`font-bold text-lg ${
              isDarkMode ? 'text-[#FFF8ED]' : 'text-[#173B63]'
            }`}
          >
            No curriculum matches
          </h3>
          <p
            className={`text-xs sm:text-sm mt-1 max-w-sm mx-auto ${
              isDarkMode ? 'text-[#E8F0F8]/70' : 'text-[#263238]/70'
            }`}
          >
            Try adjusting your search query or reset the filter to view all curriculum lessons.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setFilterStatus('all');
              onSelectTrackId(null);
            }}
            className="mt-4 px-4 py-2 rounded-xl text-xs font-bold bg-[#F07856] text-white"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
