import React from 'react';
import { Lock, ShieldAlert, ArrowRight, X, Shield, BookOpen } from 'lucide-react';
import { Lesson } from '../types';

interface RestrictedAccessModalProps {
  lesson: Lesson;
  onClose: () => void;
  onAuthenticateAsAdmin?: () => void;
  onSwitchToAdmin?: () => void;
  isDarkMode?: boolean;
}

export const RestrictedAccessModal: React.FC<RestrictedAccessModalProps> = ({
  lesson,
  onClose,
  onAuthenticateAsAdmin,
  onSwitchToAdmin,
  isDarkMode = false
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className={`w-full max-w-lg rounded-3xl p-6 sm:p-8 border shadow-2xl relative transition-all ${
          isDarkMode
            ? 'bg-[#12233A] border-[#1E324F] text-[#FFF8ED]'
            : 'bg-[#FFFFFF] border-[#EDE3D2] text-[#263238]'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-5 right-5 p-2 rounded-xl transition cursor-pointer ${
            isDarkMode
              ? 'text-[#C1CDDC] hover:text-[#FFF8ED] hover:bg-[#1E324F]'
              : 'text-[#52647A] hover:text-[#263238] hover:bg-[#FFF8ED]'
          }`}
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-5">
          {/* Header Icon */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-amber-500/10 border border-amber-500/20 text-amber-500">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-500">
                Access Restricted
              </span>
              <h2
                className={`text-xl sm:text-2xl font-black ${
                  isDarkMode ? 'text-[#FFF8ED]' : 'text-[#263238]'
                }`}
              >
                Admin-Only Academic Module
              </h2>
            </div>
          </div>

          {/* Lesson Details Card */}
          <div
            className={`p-4 rounded-2xl border space-y-2 ${
              isDarkMode
                ? 'bg-[#0B1728] border-[#1E324F]'
                : 'bg-[#FFF8ED] border-[#EDE3D2]'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="uppercase text-[#E96746] dark:text-[#F07856] font-bold">
                {lesson.trackId} Track • Lesson #{lesson.order}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                Restricted Content
              </span>
            </div>
            <h3
              className={`font-black text-base ${
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
          </div>

          {/* Explanation Text */}
          <div
            className={`text-xs sm:text-sm leading-relaxed p-3.5 rounded-xl border flex items-start gap-2.5 ${
              isDarkMode
                ? 'bg-[#1E324F]/40 border-[#1E324F] text-[#C1CDDC]'
                : 'bg-[#FDECE7]/40 border-[#E96746]/20 text-[#52647A]'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-[#E96746] dark:text-[#F07856] shrink-0 mt-0.5" />
            <div>
              <strong className={isDarkMode ? 'text-[#FFF8ED]' : 'text-[#263238]'}>
                Application Role Enforcement:
              </strong>{' '}
              This module has been restricted to the <strong>Admin role</strong> by faculty
              administrators. Standard User accounts are blocked from accessing lesson materials,
              formulas, and quizzes for this topic.
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <button
              onClick={onAuthenticateAsAdmin || onSwitchToAdmin}
              className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white shadow-xs flex items-center justify-center gap-2 cursor-pointer bg-[#E96746] hover:bg-[#D45333] dark:bg-[#F07856] dark:hover:bg-[#D95D3B] transition-all hover:scale-101"
            >
              <Shield className="w-4 h-4" />
              <span>Sign In with Admin Credentials to Unlock</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs transition cursor-pointer border ${
                isDarkMode
                  ? 'border-[#1E324F] text-[#C1CDDC] hover:text-[#FFF8ED] hover:bg-[#1E324F]'
                  : 'border-[#EDE3D2] text-[#52647A] hover:text-[#263238] hover:bg-[#FFF8ED]'
              }`}
            >
              Return to Open Student Curriculum
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
