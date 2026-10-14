import React, { useState, useEffect } from 'react';
import {
  Shield,
  GraduationCap,
  Sparkles,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  AlertTriangle,
  Info,
  Clock
} from 'lucide-react';
import { UserRole } from '../types';
import { authService, INITIAL_CREDENTIALS } from '../services/authService';

interface AuthScreenProps {
  onLoginSuccess: (session: { email: string; role: UserRole; displayName: string }) => void;
  initialRoleTab?: UserRole;
  isDarkMode?: boolean;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onLoginSuccess,
  initialRoleTab = 'user',
  isDarkMode = false
}) => {
  // Selected tab on Login screen ('user' vs 'admin')
  const [selectedRoleTab, setSelectedRoleTab] = useState<UserRole>(initialRoleTab);

  // Form input states
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Status & feedback
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lockoutCountdown, setLockoutCountdown] = useState<number | null>(null);

  // Clear inputs and errors on role tab switch
  useEffect(() => {
    setEmailInput('');
    setPasswordInput('');
    setErrorMessage(null);
  }, [selectedRoleTab]);

  // Lockout countdown timer ticker
  useEffect(() => {
    if (lockoutCountdown === null || lockoutCountdown <= 0) return;
    const timer = setInterval(() => {
      setLockoutCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          setErrorMessage(null);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutCountdown]);

  // 1. Handle Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutCountdown && lockoutCountdown > 0) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    setInfoMessage(null);

    // If inputs are left blank, use predefined account for the active tab seamlessly
    const creds = selectedRoleTab === 'admin' ? INITIAL_CREDENTIALS.admin : INITIAL_CREDENTIALS.user;
    const effectiveEmail = emailInput.trim() || creds.email;
    const effectivePassword = passwordInput || creds.defaultPassword;

    try {
      const result = await authService.login(effectiveEmail, effectivePassword, selectedRoleTab);

      if (result.success && result.user) {
        if (result.assignedRoleMismatch) {
          setInfoMessage(
            `Notice: Logged in as ${result.assignedRoleMismatch.accountRole.toUpperCase()} based on registered account credentials.`
          );
        }
        onLoginSuccess({
          email: result.user.email,
          role: result.user.role,
          displayName: result.user.displayName
        });
      } else {
        setErrorMessage(result.error || 'Invalid email or password.');
        if (result.lockSeconds) {
          setLockoutCountdown(result.lockSeconds);
        }
      }
    } catch (err) {
      setErrorMessage('An unexpected error occurred during authentication.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Theme tokens
  const primaryText = isDarkMode ? 'text-[#FFF8ED]' : 'text-[#263238]';
  const secondaryText = isDarkMode ? 'text-[#C1CDDC]' : 'text-[#52647A]';
  const cardBg = isDarkMode ? 'bg-[#12233A]' : 'bg-[#FFFFFF]';
  const cardBorder = isDarkMode ? 'border-[#1E324F]' : 'border-[#EDE3D2]';
  const inputBg = isDarkMode ? 'bg-[#0B1728]' : 'bg-[#FFF8ED]';

  return (
    <div
      className={`min-h-screen flex flex-col justify-between p-4 sm:p-6 lg:p-8 transition-colors ${
        isDarkMode ? 'bg-[#0B1728] text-[#FFF8ED]' : 'bg-[#FFF8ED] text-[#263238]'
      }`}
    >
      {/* Top Header & Brand Bar */}
      <header className="max-w-5xl mx-auto w-full pt-2 sm:pt-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-xs border ${
              isDarkMode
                ? 'bg-[#12233A] border-[#1E324F]'
                : 'bg-[#FDECE7] border-[#E96746]/25'
            }`}
          >
            <Sparkles className="w-5 h-5 text-[#E96746] dark:text-[#F07856]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`font-black text-xl tracking-tight ${primaryText}`}>FinLingo</span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#E96746]/10 text-[#E96746] dark:text-[#F07856] border border-[#E96746]/20">
                Sign In
              </span>
            </div>
            <p className={`text-[11px] ${secondaryText}`}>Gamified Commerce &amp; Finance Academy</p>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-md w-full mx-auto my-8">
        <div className={`rounded-3xl p-6 sm:p-8 border shadow-lg space-y-6 transition-all ${cardBg} ${cardBorder}`}>
          {/* Header with Title & Subtitle */}
          <div className="space-y-1.5 text-center">
            <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${primaryText}`}>
              Sign in to FinLingo
            </h1>
            <p className={`text-xs sm:text-sm ${secondaryText}`}>
              Sign in to access your learning dashboard or admin console
            </p>
          </div>

          {/* Entry Options: User Login vs Admin Login Tabs */}
          <div className={`grid grid-cols-2 p-1 rounded-2xl border ${cardBorder} ${inputBg}`}>
            <button
              type="button"
              onClick={() => setSelectedRoleTab('user')}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                selectedRoleTab === 'user'
                  ? 'bg-[#E96746] text-white shadow-xs'
                  : isDarkMode
                  ? 'text-[#C1CDDC] hover:text-[#FFF8ED]'
                  : 'text-[#52647A] hover:text-[#263238]'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>User Login</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRoleTab('admin')}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                selectedRoleTab === 'admin'
                  ? 'bg-[#E96746] text-white shadow-xs'
                  : isDarkMode
                  ? 'text-[#C1CDDC] hover:text-[#FFF8ED]'
                  : 'text-[#52647A] hover:text-[#263238]'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Admin Login</span>
            </button>
          </div>

          {/* Account Role Info Callout */}
          <div
            className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
              selectedRoleTab === 'admin'
                ? 'bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-300'
                : 'bg-[#E96746]/10 border-[#E96746]/20 text-[#E96746] dark:text-[#F07856]'
            }`}
          >
            <div className="flex items-center gap-2">
              {selectedRoleTab === 'admin' ? (
                <Shield className="w-4 h-4 shrink-0" />
              ) : (
                <GraduationCap className="w-4 h-4 shrink-0" />
              )}
              <span className="font-semibold">
                {selectedRoleTab === 'admin'
                  ? 'Faculty Admin Account (Prof. Dr. Anjali Sane)'
                  : 'College Scholar Account (Dev Purecha)'}
              </span>
            </div>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/10">
              {selectedRoleTab}
            </span>
          </div>

          {/* Error & Info Alerts */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-start gap-2.5 animate-in fade-in duration-150">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span>{errorMessage}</span>
                {lockoutCountdown !== null && lockoutCountdown > 0 && (
                  <div className="mt-1 font-bold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Cooldown remaining: {lockoutCountdown} seconds</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {infoMessage && (
            <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs flex items-center gap-2.5">
              <Info className="w-4 h-4 shrink-0" />
              <span>{infoMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className={`text-xs font-bold block mb-1.5 ${primaryText}`}>
                Account Email Address
              </label>
              <div className="relative">
                <Mail className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${secondaryText}`} />
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Enter email address"
                  className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#E96746] transition ${inputBg} ${cardBorder} ${primaryText}`}
                />
              </div>
            </div>

            <div>
              <label className={`text-xs font-bold block mb-1.5 ${primaryText}`}>Password</label>
              <div className="relative">
                <Lock className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${secondaryText}`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter account password"
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#E96746] transition ${inputBg} ${cardBorder} ${primaryText}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg ${secondaryText} hover:${primaryText} cursor-pointer`}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded-sm accent-[#E96746]"
                />
                <span className={secondaryText}>Remember session</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || (lockoutCountdown !== null && lockoutCountdown > 0)}
              className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white shadow-md flex items-center justify-center gap-2 cursor-pointer bg-[#E96746] hover:bg-[#D45333] dark:bg-[#F07856] dark:hover:bg-[#D95D3B] transition-all hover:scale-101 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span>Verifying Credentials...</span>
              ) : (
                <>
                  <span>Sign In to {selectedRoleTab === 'admin' ? 'Admin Portal' : 'Academy'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </main>

      {/* Footer with Statutory / Local Security Architecture Disclaimer */}
      <footer className="max-w-4xl mx-auto w-full pt-4 text-center space-y-2">
        <div
          className={`p-3.5 rounded-2xl border text-[11px] leading-relaxed flex items-start sm:items-center justify-center gap-2.5 ${cardBg} ${cardBorder} ${secondaryText}`}
        >
          <Info className="w-4 h-4 text-[#E96746] dark:text-[#F07856] shrink-0" />
          <div className="text-left sm:text-center">
            <strong>Local Demonstration Notice:</strong> This application operates in local demo mode without an external backend or authentication provider. Passwords are saved with browser Web Crypto PBKDF2 using unique salts, but client-side storage is not secure against inspection or tampering. Production systems require trusted server-side authentication (e.g. Argon2id / bcrypt) and HTTP-only session cookies.
          </div>
        </div>
      </footer>
    </div>
  );
};
