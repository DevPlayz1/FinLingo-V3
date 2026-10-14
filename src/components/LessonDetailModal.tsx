import React from 'react';
import {
  X,
  BookOpen,
  CheckCircle,
  Bookmark,
  Clock,
  Sparkles,
  Building,
  Lightbulb,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { Lesson, LearningTrack } from '../types';

interface LessonDetailModalProps {
  lesson: Lesson | null;
  track?: LearningTrack;
  isOpen: boolean;
  onClose: () => void;
  isCompleted: boolean;
  isBookmarked: boolean;
  onCompleteLesson: (lessonId: string, xpValue: number) => void;
  onToggleBookmark: (lessonId: string) => void;
  onStartQuiz: (lesson: Lesson) => void;
  isDarkMode?: boolean;
}

export const LessonDetailModal: React.FC<LessonDetailModalProps> = ({
  lesson,
  track,
  isOpen,
  onClose,
  isCompleted,
  isBookmarked,
  onCompleteLesson,
  onToggleBookmark,
  onStartQuiz,
  isDarkMode = false
}) => {
  if (!isOpen || !lesson) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div
        className={`relative w-full max-w-3xl rounded-3xl shadow-2xl border overflow-hidden flex flex-col max-h-[90vh] transition-colors ${
          isDarkMode
            ? 'bg-[#0B192C] border-[#1E3A5F] text-[#E2E8F0]'
            : 'bg-[#FFF8ED] border-[#E8F0F8] text-[#263238]'
        }`}
      >
        {/* Header Banner in Deep Educational Blue */}
        <div
          className={`p-6 sm:p-7 text-white border-b ${
            isDarkMode ? 'bg-[#132238] border-[#1E3A5F]' : 'bg-[#173B63] border-[#173B63]'
          }`}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#E8F0F8]">
              <span className="bg-white/15 px-2.5 py-0.5 rounded-md font-bold text-[#FFF8ED]">
                {track?.title || 'Learning Track'}
              </span>
              <span>•</span>
              <span>{lesson.moduleTitle}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleBookmark(lesson.id)}
                className={`p-2 rounded-xl transition focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#F07856] ${
                  isBookmarked
                    ? 'bg-[#F07856] text-white shadow-xs'
                    : 'bg-white/10 hover:bg-white/20 text-[#FFF8ED]'
                }`}
                title={isBookmarked ? 'Bookmarked' : 'Bookmark lesson'}
              >
                <Bookmark className="w-4 h-4 fill-current" />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#FFF8ED] transition focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#F07856]"
                title="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="mt-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#FFF8ED]">
              {lesson.title}
            </h2>
            <div className="mt-2.5 inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-xs sm:text-sm font-semibold text-[#E8F0F8]">
              <Sparkles className="w-3.5 h-3.5 text-[#F07856]" />
              <span>Core Subject Term: <strong className="text-[#F07856]">{lesson.term}</strong></span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="mt-5 flex items-center gap-4 text-xs text-[#E8F0F8] font-medium">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#F07856]" />
              <span>{lesson.estimatedMinutes} min estimated study</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#F07856]" />
              <span className="font-bold text-[#FFF8ED]">+{lesson.xpValue} XP reward</span>
            </div>
            {isCompleted && (
              <>
                <span>•</span>
                <div className="flex items-center gap-1 text-[#DCFCE7] font-bold">
                  <CheckCircle className="w-4 h-4 text-[#16A34A]" />
                  <span>Mastered</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div
          className={`p-6 sm:p-7 overflow-y-auto space-y-6 text-sm sm:text-base leading-relaxed ${
            isDarkMode ? 'bg-[#0B192C] text-[#E2E8F0]' : 'bg-[#FFF8ED] text-[#263238]'
          }`}
        >
          {/* Executive Definition Card */}
          <div
            className={`p-4 sm:p-5 rounded-2xl border shadow-2xs ${
              isDarkMode
                ? 'bg-[#132238] border-[#1E3A5F] text-[#E2E8F0]'
                : 'bg-white border-[#E8F0F8] text-[#263238]'
            }`}
          >
            <h3
              className={`text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5 ${
                isDarkMode ? 'text-[#FFF8ED]' : 'text-[#173B63]'
              }`}
            >
              <BookOpen className="w-4 h-4 text-[#F07856]" />
              Concise Learning Definition
            </h3>
            <p className="font-medium text-sm sm:text-base">{lesson.shortDefinition}</p>
          </div>

          {/* Detailed Conceptual Analysis */}
          <div
            className={`p-4 sm:p-5 rounded-2xl border shadow-2xs ${
              isDarkMode
                ? 'bg-[#132238] border-[#1E3A5F] text-[#E2E8F0]'
                : 'bg-white border-[#E8F0F8] text-[#263238]'
            }`}
          >
            <h3
              className={`font-extrabold text-base mb-2 ${
                isDarkMode ? 'text-[#FFF8ED]' : 'text-[#173B63]'
              }`}
            >
              Detailed Conceptual Analysis
            </h3>
            <p className="leading-relaxed whitespace-pre-line text-sm sm:text-base">
              {lesson.detailedExplanation}
            </p>
          </div>

          {/* Formula or Accounting Model if present */}
          {lesson.formula && (
            <div
              className={`p-5 rounded-2xl font-mono shadow-inner border ${
                isDarkMode
                  ? 'bg-[#132238] border-[#1E3A5F] text-[#FFF8ED]'
                  : 'bg-[#173B63] border-[#173B63] text-[#FFF8ED]'
              }`}
            >
              <div className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#F07856] mb-1.5">
                Mathematical Model / Accounting Equation
              </div>
              <div className="text-base sm:text-lg font-bold text-[#FFF8ED]">
                {lesson.formula}
              </div>
            </div>
          )}

          {/* Real-World Corporate Example */}
          <div
            className={`p-5 rounded-2xl border shadow-2xs ${
              isDarkMode
                ? 'bg-[#132238] border-[#1E3A5F] text-[#E2E8F0]'
                : 'bg-white border-[#E8F0F8] text-[#263238]'
            }`}
          >
            <div
              className={`flex items-center gap-2 font-bold text-sm mb-2 ${
                isDarkMode ? 'text-[#FFF8ED]' : 'text-[#173B63]'
              }`}
            >
              <Building className="w-4 h-4 text-[#F07856]" />
              <span>Real-World Business Case: {lesson.realWorldExample.companyOrContext}</span>
            </div>
            <p className="text-sm leading-relaxed">{lesson.realWorldExample.description}</p>
            {lesson.realWorldExample.keyMetric && (
              <div
                className={`mt-3 pt-3 border-t text-xs font-semibold flex items-center gap-2 ${
                  isDarkMode ? 'border-[#1E3A5F] text-[#E8F0F8]' : 'border-[#E8F0F8] text-[#173B63]'
                }`}
              >
                <span
                  className={`px-2 py-0.5 rounded font-mono ${
                    isDarkMode ? 'bg-[#1E3A5F] text-[#FFF8ED]' : 'bg-[#E8F0F8] text-[#173B63]'
                  }`}
                >
                  Key Metric
                </span>
                <span>{lesson.realWorldExample.keyMetric}</span>
              </div>
            )}
          </div>

          {/* Pro Tip & Common Misconception */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              className={`p-4 rounded-2xl border shadow-2xs ${
                isDarkMode
                  ? 'bg-[#132238] border-[#F07856]/40 text-[#E2E8F0]'
                  : 'bg-white border-[#FCE5DC] text-[#263238]'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-[#F07856] mb-1.5">
                <Lightbulb className="w-4 h-4 text-[#F07856]" />
                Wall Street &amp; Exam Pro-Tip
              </div>
              <p className="text-xs sm:text-sm leading-normal">{lesson.proTip}</p>
            </div>

            {lesson.commonMisconception && (
              <div
                className={`p-4 rounded-2xl border shadow-2xs ${
                  isDarkMode
                    ? 'bg-[#132238] border-[#DC2626]/40 text-[#E2E8F0]'
                    : 'bg-white border-[#FCE5DC] text-[#263238]'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-[#DC2626] mb-1.5">
                  <AlertTriangle className="w-4 h-4 text-[#DC2626]" />
                  Common Exam Trap
                </div>
                <p className="text-xs sm:text-sm leading-normal">{lesson.commonMisconception}</p>
              </div>
            )}
          </div>

          {/* Key Takeaways */}
          <div
            className={`p-5 rounded-2xl border shadow-2xs ${
              isDarkMode
                ? 'bg-[#132238] border-[#1E3A5F]'
                : 'bg-white border-[#E8F0F8]'
            }`}
          >
            <h4
              className={`font-extrabold text-sm mb-3 ${
                isDarkMode ? 'text-[#FFF8ED]' : 'text-[#173B63]'
              }`}
            >
              Key Takeaways for Students
            </h4>
            <ul className="space-y-2">
              {lesson.keyTakeaways.map((takeaway, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                      isDarkMode
                        ? 'bg-[#1E3A5F] text-[#FFF8ED]'
                        : 'bg-[#E8F0F8] text-[#173B63]'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span>{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div
          className={`p-4 sm:p-5 border-t flex flex-wrap items-center justify-between gap-3 ${
            isDarkMode ? 'bg-[#132238] border-[#1E3A5F]' : 'bg-white border-[#E8F0F8]'
          }`}
        >
          <div>
            {!isCompleted ? (
              <button
                onClick={() => onCompleteLesson(lesson.id, lesson.xpValue)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border transition shadow-2xs flex items-center gap-2 ${
                  isDarkMode
                    ? 'bg-[#1E3A5F] text-[#FFF8ED] border-[#1E3A5F] hover:bg-[#F07856]'
                    : 'bg-[#E8F0F8] text-[#173B63] border-[#173B63]/20 hover:bg-[#173B63] hover:text-white'
                }`}
              >
                <CheckCircle className="w-4 h-4 text-[#F07856]" />
                <span>Mark Lesson Mastered (+{lesson.xpValue} XP)</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#16A34A] px-3.5 py-1.5 rounded-xl bg-[#DCFCE7] border border-[#16A34A]/30">
                <CheckCircle className="w-4 h-4 text-[#16A34A]" />
                <span>Lesson Mastered (+{lesson.xpValue} XP Earned)</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                isDarkMode ? 'text-[#E8F0F8]/70 hover:bg-[#1E3A5F]' : 'text-[#263238]/70 hover:bg-[#E8F0F8]'
              }`}
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onStartQuiz(lesson);
              }}
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#F07856] hover:bg-[#D95D3B] text-white shadow-md shadow-[#F07856]/25 flex items-center gap-2 transition"
            >
              <span>Practice Quiz Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
