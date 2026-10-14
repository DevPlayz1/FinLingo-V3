import React from 'react';
import {
  Flame,
  Award,
  Sparkles,
  BookOpen,
  Brain,
  Trophy,
  User,
  LayoutDashboard,
  Database,
  Sun,
  Moon,
  GraduationCap,
  Shield
} from 'lucide-react';
import { ActiveTab, UserProfile } from '../types';
import { UserAvatar } from './UserAvatar';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  userProfile: UserProfile;
  spacedRepetitionDueCount: number;
  onOpenFirebaseModal: () => void;
  onOpenLegalCenter?: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userProfile,
  spacedRepetitionDueCount,
  onOpenFirebaseModal,
  onOpenLegalCenter,
  isDarkMode,
  onToggleDarkMode
}) => {
  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'tracks', label: 'Tracks & Lessons', icon: <BookOpen className="w-4 h-4" /> },
    {
      id: 'practice',
      label: 'Spaced Review',
      icon: <Brain className="w-4 h-4" />,
      badge: spacedRepetitionDueCount > 0 ? spacedRepetitionDueCount : undefined
    },
    { id: 'leaderboard', label: 'Leaderboard', icon: <Trophy className="w-4 h-4" /> },
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> }
  ];

  return (
    <header
      className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors ${
        isDarkMode
          ? 'bg-[#0B192C]/95 border-[#1E3A5F] shadow-sm'
          : 'bg-white/95 border-[#E8F0F8] shadow-xs'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & College Edition Sync */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2.5 group text-left focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#F07856] rounded-xl p-1 -ml-1 transition"
              title="Return to Dashboard"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#173B63] dark:bg-[#132238] flex items-center justify-center text-white shadow-sm shadow-[#173B63]/20 border border-[#F07856]/30 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-[#F07856]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`font-black text-xl tracking-tight transition-colors ${
                      isDarkMode ? 'text-[#FFF8ED]' : 'text-[#173B63]'
                    }`}
                  >
                    FinLingo
                  </span>
                </div>
                <p
                  className={`text-[11px] hidden sm:block -mt-0.5 font-medium transition-colors ${
                    isDarkMode ? 'text-[#E8F0F8]/70' : 'text-[#263238]/70'
                  }`}
                >
                  Commerce &amp; Finance Mastery
                </p>
              </div>
            </button>

            {/* Standalone "College Edu" Tab Pill - fully synced with curriculum tracks tab */}
            <button
              onClick={() => setActiveTab('tracks')}
              className={`hidden sm:inline-flex items-center gap-1 text-[11px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border transition-all cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#F07856] ${
                activeTab === 'tracks'
                  ? 'bg-[#F07856] text-white border-[#F07856] shadow-xs'
                  : isDarkMode
                  ? 'bg-[#1E3A5F] text-[#FFF8ED] border-[#1E3A5F] hover:border-[#F07856]/50'
                  : 'bg-[#FCE5DC] text-[#F07856] border-[#F07856]/30 hover:bg-[#F07856] hover:text-white'
              }`}
              title="Collegiate Curriculum Tracks (Accounting, Economics, Finance)"
            >
              <GraduationCap className="w-3 h-3" />
              <span>College Edu</span>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav
            className={`hidden md:flex items-center gap-1 p-1 rounded-xl border transition-colors ${
              isDarkMode
                ? 'bg-[#132238] border-[#1E3A5F]'
                : 'bg-[#E8F0F8]/80 border-[#E8F0F8]'
            }`}
            aria-label="Main Navigation"
          >
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-150 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#F07856] ${
                    isActive
                      ? isDarkMode
                        ? 'bg-[#F07856] text-white shadow-sm shadow-[#F07856]/30 font-bold'
                        : 'bg-[#173B63] text-white shadow-sm shadow-[#173B63]/25 font-bold'
                      : isDarkMode
                      ? 'text-[#E8F0F8] hover:text-[#FFF8ED] hover:bg-[#1E3A5F]'
                      : 'text-[#173B63] hover:text-[#173B63] hover:bg-white/80'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span
                      className={`text-xs px-1.5 py-0.2 rounded-full font-bold leading-tight ${
                        isActive
                          ? isDarkMode
                            ? 'bg-[#173B63] text-[#FFF8ED]'
                            : 'bg-[#F07856] text-white'
                          : 'bg-[#F07856] text-white animate-pulse'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action / Gamification Metrics & Dark Mode Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Global Dark / Light Mode Switcher */}
            <button
              onClick={onToggleDarkMode}
              className={`p-2 rounded-xl border transition-all cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#F07856] flex items-center justify-center ${
                isDarkMode
                  ? 'bg-[#132238] border-[#1E3A5F] text-[#F07856] hover:bg-[#1E3A5F]'
                  : 'bg-[#FFF8ED] border-[#E8F0F8] text-[#173B63] hover:bg-[#E8F0F8]'
              }`}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-[#F07856]" />
              ) : (
                <Moon className="w-4 h-4 text-[#173B63]" />
              )}
            </button>

            {/* Streak Counter */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs sm:text-sm font-bold shadow-2xs transition-colors ${
                isDarkMode
                  ? 'bg-[#132238] border-[#1E3A5F] text-[#FFF8ED]'
                  : 'bg-[#FCE5DC] border-[#F07856]/30 text-[#263238]'
              }`}
              title={`${userProfile.streakDays}-day active learning streak`}
            >
              <Flame className="w-4 h-4 text-[#F07856] fill-[#F07856]" />
              <span className={isDarkMode ? 'text-[#FFF8ED]' : 'text-[#173B63]'}>
                {userProfile.streakDays}
              </span>
              <span className="hidden sm:inline font-semibold text-[#F07856] text-xs">d</span>
            </div>

            {/* Total XP Badge */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs sm:text-sm font-bold shadow-2xs transition-colors ${
                isDarkMode
                  ? 'bg-[#132238] border-[#1E3A5F] text-[#FFF8ED]'
                  : 'bg-[#E8F0F8] border-[#173B63]/20 text-[#173B63]'
              }`}
              title={`${userProfile.currentXp} Total XP earned`}
            >
              <Award className="w-4 h-4 text-[#F07856]" />
              <span>{userProfile.currentXp}</span>
              <span className="text-[11px] font-bold text-[#F07856]">XP</span>
            </div>

            {/* User Level Pill with UserAvatar */}
            <button
              onClick={() => setActiveTab('profile')}
              className={`hidden lg:flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border cursor-pointer transition focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#F07856] ${
                isDarkMode
                  ? 'bg-[#132238] hover:bg-[#1E3A5F] border-[#1E3A5F]'
                  : 'bg-white hover:bg-[#FFF8ED] border-[#E8F0F8]'
              }`}
              title="View student profile and learning statistics"
            >
              <UserAvatar
                src={userProfile.avatar}
                name={userProfile.displayName}
                size="xs"
                ring={false}
              />
              <div className="text-left leading-tight">
                <span
                  className={`text-[11px] font-extrabold block ${
                    isDarkMode ? 'text-[#FFF8ED]' : 'text-[#173B63]'
                  }`}
                >
                  Lvl {userProfile.level}
                </span>
                <span
                  className={`text-[10px] block truncate max-w-[90px] ${
                    isDarkMode ? 'text-[#E8F0F8]/70' : 'text-[#263238]/70'
                  }`}
                >
                  {userProfile.levelTitle}
                </span>
              </div>
            </button>

            {/* Architecture Details Modal Button */}
            <button
              onClick={onOpenFirebaseModal}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#F07856] ${
                isDarkMode
                  ? 'bg-[#132238] text-[#E8F0F8] border-[#1E3A5F] hover:bg-[#1E3A5F]'
                  : 'bg-[#E8F0F8] text-[#173B63] border-[#173B63]/20 hover:bg-[#173B63] hover:text-white'
              }`}
              title="Architecture details: Designed for Firebase Auth & Cloud Firestore"
            >
              <Database className="w-3.5 h-3.5 text-[#F07856]" />
              <span className="hidden sm:inline">Backend Schema</span>
            </button>

            {/* Legal & Privacy Center Button */}
            {onOpenLegalCenter && (
              <button
                onClick={onOpenLegalCenter}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#F07856] ${
                  activeTab === 'legal'
                    ? 'bg-[#F07856] text-white border-[#F07856]'
                    : isDarkMode
                    ? 'bg-[#132238] text-[#E8F0F8] border-[#1E3A5F] hover:bg-[#1E3A5F]'
                    : 'bg-[#E8F0F8] text-[#173B63] border-[#173B63]/20 hover:bg-[#173B63] hover:text-white'
                }`}
                title="FinLingo Legal & Privacy Center (DPDPA 2023, IT Act, SEBI disclosures)"
              >
                <Shield className="w-3.5 h-3.5 text-[#F07856]" />
                <span className="hidden xl:inline">Privacy &amp; Legal</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div
          className={`md:hidden flex items-center justify-around py-2 border-t transition-colors ${
            isDarkMode ? 'border-[#1E3A5F] bg-[#0B192C]' : 'border-[#E8F0F8] bg-white'
          }`}
        >
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-xs font-medium focus:outline-hidden ${
                  isActive
                    ? 'text-[#F07856] font-bold'
                    : isDarkMode
                    ? 'text-[#E8F0F8]/70 hover:text-[#FFF8ED]'
                    : 'text-[#263238]/70 hover:text-[#173B63]'
                }`}
              >
                <div className="relative">
                  {item.icon}
                  {item.badge !== undefined && (
                    <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-[#F07856] text-white text-[10px] flex items-center justify-center font-bold">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px]">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
