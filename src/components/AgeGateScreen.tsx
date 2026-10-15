/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserRole } from '../types';
import {
  Shield,
  ShieldAlert,
  CheckCircle2,
  Lock,
  ArrowRight,
  LogOut,
  Sparkles,
  Info,
  Scale,
  RotateCcw
} from 'lucide-react';

interface AgeGateScreenProps {
  userEmail: string;
  userName: string;
  userRole: UserRole;
  isDarkMode: boolean;
  initialUnder13?: boolean;
  onConfirmEligibility: () => void;
  onMarkUnder13: () => void;
  onClearUnder13: () => void;
  onLogout: () => void;
}

export const AgeGateScreen: React.FC<AgeGateScreenProps> = ({
  userEmail,
  userName,
  userRole,
  isDarkMode,
  initialUnder13 = false,
  onConfirmEligibility,
  onMarkUnder13,
  onClearUnder13,
  onLogout
}) => {
  // Checkbox MUST never be pre-selected
  const [isChecked, setIsChecked] = useState(false);
  const [isUnderAgeView, setIsUnderAgeView] = useState(initialUnder13);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContinue = () => {
    if (!isChecked || isSubmitting) return;
    setIsSubmitting(true);
    onConfirmEligibility();
  };

  const handleIndicateUnder13 = () => {
    setIsUnderAgeView(true);
    setIsChecked(false);
    onMarkUnder13();
  };

  const handleReturnToGate = () => {
    setIsUnderAgeView(false);
    setIsChecked(false);
    onClearUnder13();
  };

  return (
    <div
      className={`min-h-screen flex flex-col justify-between selection:bg-[#E96746] selection:text-white transition-colors duration-200 ${
        isDarkMode ? 'bg-[#0B1728] text-[#FFF8ED]' : 'bg-[#FFF8ED] text-[#263238]'
      }`}
    >
      {/* Top Header Bar */}
      <header
        className={`px-6 py-4 border-b flex items-center justify-between transition-colors ${
          isDarkMode ? 'bg-[#12233A]/80 border-[#1E324F]' : 'bg-white/80 border-[#EDE3D2]'
        } backdrop-blur-md sticky top-0 z-20`}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#173B63] dark:bg-[#1E324F] text-[#FFF8ED] flex items-center justify-center font-black text-lg shadow-sm border border-[#E96746]/30">
            F
          </div>
          <div>
            <div className="font-black text-base tracking-tight flex items-center gap-1.5">
              <span>FinLingo</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-[#E96746]/10 text-[#E96746] dark:text-[#F07856]">
                Academic
              </span>
            </div>
            <div className={`text-[11px] ${isDarkMode ? 'text-[#E8F0F8]/60' : 'text-[#263238]/60'}`}>
              Mandatory Age &amp; Privacy Verification
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={`hidden sm:flex flex-col text-right text-xs ${
              isDarkMode ? 'text-[#E8F0F8]/70' : 'text-[#263238]/70'
            }`}
          >
            <span className="font-bold text-xs truncate max-w-[160px]">{userName}</span>
            <span className="font-mono text-[10px] opacity-75">{userEmail}</span>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer ${
              isDarkMode
                ? 'border-[#1E324F] hover:bg-white/5 text-[#E8F0F8]'
                : 'border-[#EDE3D2] hover:bg-black/5 text-[#263238]'
            }`}
            title="Sign out to return to login"
          >
            <LogOut className="w-3.5 h-3.5 text-[#E96746]" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-lg">
          {!isUnderAgeView ? (
            /* Standard 13+ Eligibility Gate */
            <div
              className={`p-6 sm:p-8 rounded-3xl border shadow-xl transition-all duration-300 animate-in fade-in zoom-in-95 ${
                isDarkMode
                  ? 'bg-[#12233A] border-[#1E324F] shadow-black/40'
                  : 'bg-white border-[#EDE3D2] shadow-amber-900/5'
              }`}
            >
              {/* Shield Icon Badge */}
              <div className="w-14 h-14 rounded-2xl bg-[#E96746]/10 text-[#E96746] dark:text-[#F07856] flex items-center justify-center mb-6 shadow-xs border border-[#E96746]/20">
                <Shield className="w-7 h-7" />
              </div>

              {/* Title & Subtitle */}
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
                Age Eligibility Gate
              </h1>
              <p
                className={`text-xs sm:text-sm mb-6 leading-relaxed ${
                  isDarkMode ? 'text-[#E8F0F8]/75' : 'text-[#263238]/75'
                }`}
              >
                FinLingo is an academic financial literacy curriculum and simulation platform. In
                adherence to digital student safety protocols and educational terms, access to learning
                tracks, quizzes, and gamification is strictly restricted to learners aged 13 and older.
              </p>

              {/* Account Identification Pill */}
              <div
                className={`p-3.5 rounded-2xl border mb-6 flex items-center justify-between text-xs ${
                  isDarkMode
                    ? 'bg-[#0B1728]/60 border-[#1E324F] text-[#FFF8ED]'
                    : 'bg-[#FFF8ED] border-[#EDE3D2] text-[#263238]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#173B63] text-white flex items-center justify-center font-bold text-xs">
                    {userRole === 'admin' ? 'A' : 'U'}
                  </div>
                  <div>
                    <div className="font-bold flex items-center gap-1.5">
                      <span>{userName}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded-sm font-semibold bg-black/10 dark:bg-white/10">
                        {userRole === 'admin' ? 'Administrator' : 'Standard User'}
                      </span>
                    </div>
                    <div className="font-mono text-[11px] opacity-70">{userEmail}</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">
                    Pending 13+
                  </span>
                </div>
              </div>

              {/* Mandatory Confirmation Checkbox Card */}
              <div
                className={`p-4 sm:p-5 rounded-2xl border mb-6 transition-all cursor-pointer select-none ${
                  isChecked
                    ? isDarkMode
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-[#FFF8ED]'
                      : 'bg-emerald-50 border-emerald-300 text-[#173B63]'
                    : isDarkMode
                    ? 'bg-[#0B1728]/40 border-[#1E324F] hover:border-slate-500'
                    : 'bg-slate-50 border-[#EDE3D2] hover:border-slate-300'
                }`}
                onClick={() => setIsChecked(!isChecked)}
              >
                <label className="flex items-start gap-3.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => setIsChecked(e.target.checked)}
                    className="mt-0.5 w-5 h-5 rounded-md border-2 border-slate-400 text-[#E96746] focus:ring-[#E96746] cursor-pointer accent-[#E96746]"
                  />
                  <div className="flex-1">
                    <span className="font-bold text-sm block leading-snug">
                      I confirm that I am 13 years of age or older.
                    </span>
                    <span
                      className={`text-xs block mt-1 leading-relaxed ${
                        isDarkMode ? 'text-[#E8F0F8]/60' : 'text-[#263238]/65'
                      }`}
                    >
                      By checking this box, you confirm your eligibility to access FinLingo's curriculum,
                      quizzes, and interactive financial tools under our terms of service.
                    </span>
                  </div>
                </label>
              </div>

              {/* Privacy Notice Note */}
              <div
                className={`p-3.5 rounded-xl border mb-6 space-y-1.5 text-[11px] leading-relaxed ${
                  isDarkMode
                    ? 'bg-[#173B63]/20 border-[#1E324F] text-[#E8F0F8]/75'
                    : 'bg-blue-50/50 border-blue-100 text-[#173B63]/85'
                }`}
              >
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-[#E96746] shrink-0 mt-0.5" />
                  <span>
                    <strong>Privacy Assurance:</strong> FinLingo respects your privacy. We do not collect,
                    request, or store your date of birth or government identity documents.
                  </span>
                </div>
                <div className="text-[10px] opacity-70 pl-6 border-t border-black/5 dark:border-white/5 pt-1.5">
                  <strong>Notice of Limitation:</strong> This verification constitutes a self-declared eligibility confirmation and does not independently authenticate documentary proof of age.
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  type="button"
                  disabled={!isChecked || isSubmitting}
                  onClick={handleContinue}
                  className={`w-full py-3.5 px-6 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-md ${
                    isChecked && !isSubmitting
                      ? 'bg-[#E96746] hover:bg-[#D45333] dark:bg-[#F07856] dark:hover:bg-[#D95D3B] text-white cursor-pointer hover:shadow-lg active:scale-[0.99]'
                      : 'bg-slate-300 dark:bg-slate-800 text-slate-500 dark:text-slate-500 cursor-not-allowed opacity-60'
                  }`}
                >
                  <span>{isSubmitting ? 'Verifying Eligibility...' : 'Continue to FinLingo'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={handleIndicateUnder13}
                    className={`text-xs font-semibold underline underline-offset-4 transition hover:text-[#E96746] cursor-pointer ${
                      isDarkMode ? 'text-[#E8F0F8]/60' : 'text-[#263238]/60'
                    }`}
                  >
                    I am under 13 years of age
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Respectful Ineligible Notice for Under-13 Users */
            <div
              className={`p-6 sm:p-8 rounded-3xl border shadow-xl transition-all duration-300 animate-in fade-in zoom-in-95 ${
                isDarkMode
                  ? 'bg-[#12233A] border-amber-500/30 shadow-black/40'
                  : 'bg-white border-amber-200 shadow-amber-900/5'
              }`}
            >
              {/* Alert Badge */}
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-6 shadow-xs border border-amber-500/20">
                <ShieldAlert className="w-7 h-7" />
              </div>

              {/* Title & Respectful Message */}
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-3">
                Minimum Age Requirement
              </h1>

              <div
                className={`p-4 rounded-2xl border mb-6 space-y-3 text-xs sm:text-sm leading-relaxed ${
                  isDarkMode
                    ? 'bg-[#0B1728]/80 border-[#1E324F] text-[#E8F0F8]'
                    : 'bg-amber-50/60 border-amber-200/60 text-[#263238]'
                }`}
              >
                <p>
                  <strong>Thank you for your interest in FinLingo.</strong>
                </p>
                <p>
                  FinLingo's curriculum, advanced accounting models, economics simulations, and
                  gamification features are specifically designed for learners aged <strong>13 years or older</strong>,
                  in accordance with digital student safety standards and educational privacy policies.
                </p>
                <p className="text-xs opacity-80">
                  Because you indicated that you are under 13, access to educational modules, practice quizzes,
                  and gamification is currently unavailable for this account.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleReturnToGate}
                  className={`w-full py-3 px-5 rounded-2xl font-bold text-xs sm:text-sm border transition flex items-center justify-center gap-2 cursor-pointer ${
                    isDarkMode
                      ? 'border-[#1E324F] hover:bg-white/5 text-[#E8F0F8]'
                      : 'border-[#EDE3D2] hover:bg-black/5 text-[#263238]'
                  }`}
                >
                  <RotateCcw className="w-4 h-4 text-[#E96746]" />
                  <span>I made a mistake — Return to Confirmation</span>
                </button>

                <button
                  type="button"
                  onClick={onLogout}
                  className="w-full py-3 px-5 rounded-2xl font-bold text-xs sm:text-sm bg-[#173B63] hover:bg-[#0F2742] dark:bg-[#1E3A5F] dark:hover:bg-[#152942] text-white transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <LogOut className="w-4 h-4 text-[#E96746]" />
                  <span>Sign Out / Switch Account</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer
        className={`px-6 py-4 text-center text-xs border-t transition-colors ${
          isDarkMode ? 'border-[#1E324F] text-[#E8F0F8]/50' : 'border-[#EDE3D2] text-[#263238]/50'
        }`}
      >
        <span>FinLingo Educational System • Age Verification Standard • No Personal Data Collected</span>
      </footer>
    </div>
  );
};
