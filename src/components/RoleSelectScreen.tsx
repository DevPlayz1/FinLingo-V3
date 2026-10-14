import React from 'react';
import {
  Shield,
  GraduationCap,
  Sparkles,
  Lock,
  BookOpen,
  Trophy,
  Sliders,
  CheckCircle2,
  ArrowRight,
  Database,
  Info
} from 'lucide-react';
import { UserRole } from '../types';

interface RoleSelectScreenProps {
  onSelectRole: (role: UserRole) => void;
  currentRole?: UserRole | null;
  onCancel?: () => void;
  onOpenLogin?: () => void;
  isDarkMode?: boolean;
}

export const RoleSelectScreen: React.FC<RoleSelectScreenProps> = ({
  onSelectRole,
  currentRole,
  onCancel,
  onOpenLogin,
  isDarkMode = false
}) => {
  return (
    <div
      className={`min-h-screen flex flex-col justify-between p-4 sm:p-6 lg:p-8 transition-colors ${
        isDarkMode ? 'bg-[#0B1728] text-[#FFF8ED]' : 'bg-[#FFF8ED] text-[#263238]'
      }`}
    >
      {/* Top Header */}
      <div className="max-w-5xl mx-auto w-full pt-4 sm:pt-8 text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold shadow-2xs mb-2 transition-colors bg-white/80 dark:bg-[#12233A] border-[#EDE3D2] dark:border-[#1E324F] text-[#E96746] dark:text-[#F07856]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>FinLingo Role-Based Access Control (RBAC) • Phase 2 Demo</span>
        </div>

        <h1
          className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight ${
            isDarkMode ? 'text-[#FFF8ED]' : 'text-[#263238]'
          }`}
        >
          Select Your Demo Access Role
        </h1>

        <p
          className={`max-w-2xl mx-auto text-sm sm:text-base leading-relaxed ${
            isDarkMode ? 'text-[#C1CDDC]' : 'text-[#52647A]'
          }`}
        >
          Choose a role to experience FinLingo as an enrolled college scholar or test administrative
          curriculum controls, question management, and restricted-content governance.
        </p>
      </div>

      {/* Role Selection Cards Grid */}
      <div className="max-w-5xl mx-auto w-full py-8 sm:py-12 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {/* Card 1: User (Dev Purecha) */}
        <div
          className={`relative rounded-3xl p-6 sm:p-8 border transition-all duration-200 flex flex-col justify-between shadow-xs hover:shadow-lg ${
            isDarkMode
              ? 'bg-[#12233A] border-[#1E324F] hover:border-[#E96746]/50'
              : 'bg-[#FFFFFF] border-[#EDE3D2] hover:border-[#E96746]/50'
          }`}
        >
          {currentRole === 'user' && (
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold bg-[#E96746] text-white flex items-center gap-1 shadow-xs">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Current Role</span>
            </div>
          )}

          <div className="space-y-5">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-xs ${
                isDarkMode
                  ? 'bg-[#1E324F] border-[#1E324F] text-[#F07856]'
                  : 'bg-[#FDECE7] border-[#E96746]/20 text-[#E96746]'
              }`}
            >
              <GraduationCap className="w-7 h-7" />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#E96746] dark:text-[#F07856]">
                  Learner Profile
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#E96746]/10 text-[#E96746] dark:text-[#F07856]">
                  Dev Purecha
                </span>
              </div>
              <h2
                className={`text-2xl font-black ${
                  isDarkMode ? 'text-[#FFF8ED]' : 'text-[#263238]'
                }`}
              >
                User (College Scholar)
              </h2>
              <p
                className={`text-xs sm:text-sm mt-1.5 leading-relaxed ${
                  isDarkMode ? 'text-[#C1CDDC]' : 'text-[#52647A]'
                }`}
              >
                Dedicated local profile for <strong>Dev Purecha</strong>. Tracks lessons, XP points, quiz history, achievements, and streaks completely isolated from admin edits.
              </p>
            </div>

            {/* Permissions list */}
            <div className="space-y-2.5 pt-2 border-t border-[#EDE3D2] dark:border-[#1E324F]">
              <div className="text-xs font-bold uppercase tracking-wider text-[#52647A] dark:text-[#C1CDDC]/70">
                Granted Capabilities:
              </div>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className={isDarkMode ? 'text-[#FFF8ED]' : 'text-[#263238]'}>
                    Browse Accounting, Economics &amp; Finance tracks
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className={isDarkMode ? 'text-[#FFF8ED]' : 'text-[#263238]'}>
                    Take 200+ practice quizzes &amp; earn XP points
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className={isDarkMode ? 'text-[#FFF8ED]' : 'text-[#263238]'}>
                    Review spaced repetition flashcards &amp; streaks
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Lock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span className={isDarkMode ? 'text-[#C1CDDC]' : 'text-[#52647A]'}>
                    Restricted content is locked (<strong className="text-amber-500">Admin-Only</strong>)
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Lock className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span className={isDarkMode ? 'text-[#C1CDDC]' : 'text-[#52647A]'}>
                    No access to Admin Panel or question/curriculum editing
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-[#EDE3D2] dark:border-[#1E324F]">
            <button
              onClick={() => onSelectRole('user')}
              className="w-full py-3.5 px-5 rounded-2xl font-bold text-sm text-white shadow-sm flex items-center justify-center gap-2 cursor-pointer bg-[#263238] hover:bg-[#1A2328] dark:bg-[#1E324F] dark:hover:bg-[#284164] transition-all hover:scale-101 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#E96746]"
            >
              <span>Continue as College Scholar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Card 2: Admin (Academic Administrator) */}
        <div
          className={`relative rounded-3xl p-6 sm:p-8 border-2 transition-all duration-200 flex flex-col justify-between shadow-xs hover:shadow-lg ${
            isDarkMode
              ? 'bg-[#12233A] border-[#E96746]/60 hover:border-[#E96746]'
              : 'bg-[#FFFFFF] border-[#E96746]/40 hover:border-[#E96746]'
          }`}
        >
          {currentRole === 'admin' ? (
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold bg-[#E96746] text-white flex items-center gap-1 shadow-xs">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Current Role</span>
            </div>
          ) : (
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-[#FDECE7] dark:bg-[#1E324F] text-[#E96746] dark:text-[#F07856] border border-[#E96746]/30">
              Staff Privileges
            </div>
          )}

          <div className="space-y-5">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-xs ${
                isDarkMode
                  ? 'bg-[#1E324F] border-[#1E324F] text-[#F07856]'
                  : 'bg-[#FDECE7] border-[#E96746]/20 text-[#E96746]'
              }`}
            >
              <Shield className="w-7 h-7" />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#E96746] dark:text-[#F07856]">
                  Administrator Profile
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  Prof. Dr. Anjali Sane
                </span>
              </div>
              <h2
                className={`text-2xl font-black ${
                  isDarkMode ? 'text-[#FFF8ED]' : 'text-[#263238]'
                }`}
              >
                Admin (Academic Administrator)
              </h2>
              <p
                className={`text-xs sm:text-sm mt-1.5 leading-relaxed ${
                  isDarkMode ? 'text-[#C1CDDC]' : 'text-[#52647A]'
                }`}
              >
                Dedicated local profile for <strong>Prof. Dr. Anjali Sane</strong>. Manages restricted content, curriculum locks, question bank edits, and administrative scores without overwriting student progress.
              </p>
            </div>

            {/* Permissions list */}
            <div className="space-y-2.5 pt-2 border-t border-[#EDE3D2] dark:border-[#1E324F]">
              <div className="text-xs font-bold uppercase tracking-wider text-[#52647A] dark:text-[#C1CDDC]/70">
                Administrative Powers:
              </div>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className={isDarkMode ? 'text-[#FFF8ED]' : 'text-[#263238]'}>
                    Access dedicated <strong>Admin Panel</strong>
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className={isDarkMode ? 'text-[#FFF8ED]' : 'text-[#263238]'}>
                    Toggle <strong>Admin-Only restricted lessons</strong> on/off
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className={isDarkMode ? 'text-[#FFF8ED]' : 'text-[#263238]'}>
                    Read &amp; quiz on all lessons (including restricted)
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className={isDarkMode ? 'text-[#FFF8ED]' : 'text-[#263238]'}>
                    Edit quiz questions, options, answers &amp; explanations
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className={isDarkMode ? 'text-[#FFF8ED]' : 'text-[#263238]'}>
                    Modify sample leaderboard scores, XP values &amp; streaks
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-[#EDE3D2] dark:border-[#1E324F]">
            <button
              onClick={() => onSelectRole('admin')}
              className="w-full py-3.5 px-5 rounded-2xl font-bold text-sm text-white shadow-md flex items-center justify-center gap-2 cursor-pointer bg-[#E96746] hover:bg-[#D45333] dark:bg-[#F07856] dark:hover:bg-[#D95D3B] transition-all hover:scale-101 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#E96746]"
            >
              <Shield className="w-4 h-4" />
              <span>Launch as Academic Admin</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Demonstration Notice & Dismiss */}
      <div className="max-w-5xl mx-auto w-full pb-4 space-y-4">
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold">
          {onOpenLogin && (
            <button
              onClick={onOpenLogin}
              className="text-[#E96746] dark:text-[#F07856] underline underline-offset-4 cursor-pointer hover:opacity-85"
            >
              Sign In with Specific Credentials &amp; Manage Passwords
            </button>
          )}
          {onCancel && (
            <button
              onClick={onCancel}
              className={`underline underline-offset-4 cursor-pointer transition ${
                isDarkMode ? 'text-[#C1CDDC] hover:text-[#FFF8ED]' : 'text-[#52647A] hover:text-[#263238]'
              }`}
            >
              Return to Current View
            </button>
          )}
        </div>

        <div
          className={`p-4 rounded-2xl border text-xs leading-relaxed flex items-start gap-3 transition-colors ${
            isDarkMode
              ? 'bg-[#12233A]/70 border-[#1E324F] text-[#C1CDDC]'
              : 'bg-white/80 border-[#EDE3D2] text-[#52647A]'
          }`}
        >
          <Info className="w-4 h-4 text-[#E96746] dark:text-[#F07856] shrink-0 mt-0.5" />
          <div>
            <strong className={isDarkMode ? 'text-[#FFF8ED]' : 'text-[#263238]'}>
              Local Demonstration Notice:
            </strong>{' '}
            This role selector operates strictly on client-side state and local storage for Phase 2
            evaluation without external backend accounts. Client-side checks simulate Role-Based
            Access Control (RBAC) in the UI and business logic, but do not provide cryptographic
            security against local browser code inspection. In production, roles are verified
            server-side using cryptographically signed session tokens and server-enforced access controls.
          </div>
        </div>
      </div>
    </div>
  );
};
