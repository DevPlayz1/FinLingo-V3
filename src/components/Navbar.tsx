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
  Shield,
  GraduationCap,
  ShieldAlert
} from 'lucide-react';
import { ActiveTab, UserProfile, UserRole } from '../types';
import { UserAvatar } from './UserAvatar';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  userProfile: UserProfile;
  currentRole: UserRole;
  spacedRepetitionDueCount: number;
  onOpenFirebaseModal: () => void;
  onOpenLegalCenter?: () => void;
  onOpenRoleSelection: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userProfile,
  currentRole,
  spacedRepetitionDueCount,
  onOpenFirebaseModal,
  onOpenLegalCenter,
  onOpenRoleSelection,
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

  if (currentRole === 'admin') {
    navItems.push({
      id: 'admin',
      label: 'Admin Panel',
      icon: <ShieldAlert className="w-4 h-4" />
    });
  }

  return (
    <header
      className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors ${
        isDarkMode
          ? 'bg-[#0B1728]/95 border-[#1E324F] shadow-xs'
          : 'bg-[#FFFFFF]/95 border-[#EDE3D2] shadow-xs'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & College Edition Sync */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2.5 group text-left focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#E96746] dark:focus-visible:ring-[#F07856] rounded-xl p-1 -ml-1 transition cursor-pointer"
              title="Return to Dashboard"
            >
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shadow-xs border group-hover:scale-105 transition-transform ${
                  isDarkMode
                    ? 'bg-[#12233A] border-[#1E324F]'
                    : 'bg-[#FDECE7] border-[#E96746]/25'
                }`}
              >
                <Sparkles className="w-5 h-5 text-[#E96746] dark:text-[#F07856]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`font-black text-xl tracking-tight transition-colors ${
                      isDarkMode ? 'text-[#FFF8ED]' : 'text-[#263238]'
                    }`}
                  >
                    FinLingo
                  </span>
                </div>
                <p
                  className={`text-[11px] hidden sm:block -mt-0.5 font-medium transition-colors ${
                    isDarkMode ? 'text-[#C1CDDC]' : 'text-[#52647A]'
                  }`}
                >
                  Gamified Commerce Academy
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav
            className={`hidden md:flex items-center gap-1 p-1 rounded-xl border transition-colors ${
              isDarkMode
                ? 'bg-[#12233A] border-[#1E324F]'
                : 'bg-[#FFF8ED] border-[#EDE3D2]'
            }`}
            aria-label="Main Navigation"
          >
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-150 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#E96746] dark:focus-visible:ring-[#F07856] cursor-pointer ${
                    isActive
                      ? 'bg-[#E96746] dark:bg-[#F07856] text-white shadow-xs font-bold'
                      : isDarkMode
                      ? 'text-[#C1CDDC] hover:text-[#FFF8ED] hover:bg-[#1E324F]'
                      : 'text-[#263238] hover:text-[#E96746] hover:bg-[#FFFFFF]'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span
                      className={`text-xs px-1.5 py-0.2 rounded-full font-bold leading-tight ${
                        isActive
                          ? 'bg-[#0B1728] text-white'
                          : 'bg-[#E96746] dark:bg-[#F07856] text-white animate-pulse'
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
              className={`p-2 rounded-xl border transition-all cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#E96746] dark:focus-visible:ring-[#F07856] flex items-center justify-center ${
                isDarkMode
                  ? 'bg-[#12233A] border-[#1E324F] text-[#F07856] hover:bg-[#1E324F]'
                  : 'bg-[#FFF8ED] border-[#EDE3D2] text-[#263238] hover:bg-[#FFFFFF]'
              }`}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-[#F07856]" />
              ) : (
                <Moon className="w-4 h-4 text-[#263238]" />
              )}
            </button>

            {/* Streak Counter */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs sm:text-sm font-bold shadow-2xs transition-colors ${
                isDarkMode
                  ? 'bg-[#12233A] border-[#1E324F] text-[#FFF8ED]'
                  : 'bg-[#FDECE7] border-[#E96746]/25 text-[#263238]'
              }`}
              title={`${userProfile.streakDays}-day active learning streak`}
            >
              <Flame className="w-4 h-4 text-[#E96746] dark:text-[#F07856] fill-current" />
              <span className={isDarkMode ? 'text-[#FFF8ED]' : 'text-[#263238]'}>
                {userProfile.streakDays}
              </span>
              <span className="hidden sm:inline font-semibold text-[#E96746] dark:text-[#F07856] text-xs">d</span>
            </div>

            {/* Total XP Badge */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs sm:text-sm font-bold shadow-2xs transition-colors ${
                isDarkMode
                  ? 'bg-[#12233A] border-[#1E324F] text-[#FFF8ED]'
                  : 'bg-[#FFFFFF] border-[#EDE3D2] text-[#263238]'
              }`}
              title={`${userProfile.currentXp} Total XP earned`}
            >
              <Award className="w-4 h-4 text-[#E96746] dark:text-[#F07856]" />
              <span className={isDarkMode ? 'text-[#FFF8ED]' : 'text-[#263238]'}>
                {userProfile.currentXp}
              </span>
              <span className="text-[11px] font-bold text-[#E96746] dark:text-[#F07856]">XP</span>
            </div>

            {/* User Level Pill with UserAvatar */}
            <button
              onClick={() => setActiveTab('profile')}
              className={`hidden lg:flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border cursor-pointer transition focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#E96746] dark:focus-visible:ring-[#F07856] ${
                isDarkMode
                  ? 'bg-[#12233A] hover:bg-[#1E324F] border-[#1E324F]'
                  : 'bg-[#FFFFFF] hover:bg-[#FFF8ED] border-[#EDE3D2]'
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
                    isDarkMode ? 'text-[#FFF8ED]' : 'text-[#263238]'
                  }`}
                >
                  Lvl {userProfile.level}
                </span>
                <span
                  className={`text-[10px] block truncate max-w-[90px] ${
                    isDarkMode ? 'text-[#C1CDDC]' : 'text-[#52647A]'
                  }`}
                >
                  {userProfile.levelTitle}
                </span>
              </div>
            </button>

            {/* Active Demo Role Switcher Badge */}
            <button
              onClick={onOpenRoleSelection}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#E96746] dark:focus-visible:ring-[#F07856] cursor-pointer ${
                currentRole === 'admin'
                  ? 'bg-[#E96746] dark:bg-[#F07856] text-white border-[#E96746] shadow-2xs hover:scale-102'
                  : isDarkMode
                  ? 'bg-[#12233A] text-[#FFF8ED] border-[#1E324F] hover:bg-[#1E324F]'
                  : 'bg-[#FFFFFF] text-[#263238] border-[#EDE3D2] hover:bg-[#FFF8ED]'
              }`}
              title="Active Demo Role - Click to switch between Admin and Student User"
            >
              {currentRole === 'admin' ? (
                <Shield className="w-3.5 h-3.5" />
              ) : (
                <GraduationCap className="w-3.5 h-3.5 text-[#E96746] dark:text-[#F07856]" />
              )}
              <span className="capitalize">{currentRole === 'admin' ? 'Admin' : 'Student'}</span>
              <span className="text-[10px] opacity-75 font-normal underline hidden sm:inline">Switch</span>
            </button>

            {/* Architecture Details Modal Button */}
            <button
              onClick={onOpenFirebaseModal}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#E96746] dark:focus-visible:ring-[#F07856] cursor-pointer ${
                isDarkMode
                  ? 'bg-[#12233A] text-[#C1CDDC] border-[#1E324F] hover:bg-[#1E324F] hover:text-[#FFF8ED]'
                  : 'bg-[#FFFFFF] text-[#52647A] border-[#EDE3D2] hover:bg-[#FFF8ED] hover:text-[#263238]'
              }`}
              title="Architecture details: Designed for Firebase Auth & Cloud Firestore"
            >
              <Database className="w-3.5 h-3.5 text-[#E96746] dark:text-[#F07856]" />
              <span className="hidden sm:inline">Backend</span>
            </button>

            {/* Legal & Privacy Center Button */}
            {onOpenLegalCenter && (
              <button
                onClick={onOpenLegalCenter}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#E96746] dark:focus-visible:ring-[#F07856] cursor-pointer ${
                  activeTab === 'legal'
                    ? 'bg-[#E96746] dark:bg-[#F07856] text-white border-[#E96746] dark:border-[#F07856]'
                    : isDarkMode
                    ? 'bg-[#12233A] text-[#C1CDDC] border-[#1E324F] hover:bg-[#1E324F] hover:text-[#FFF8ED]'
                    : 'bg-[#FFFFFF] text-[#52647A] border-[#EDE3D2] hover:bg-[#FFF8ED] hover:text-[#263238]'
                }`}
                title="FinLingo Legal & Privacy Center"
              >
                <Shield className="w-3.5 h-3.5 text-[#E96746] dark:text-[#F07856]" />
                <span className="hidden xl:inline">Legal</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div
          className={`md:hidden flex items-center justify-around py-2 border-t transition-colors ${
            isDarkMode ? 'border-[#1E324F] bg-[#0B1728]' : 'border-[#EDE3D2] bg-[#FFFFFF]'
          }`}
        >
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-xs font-medium focus:outline-hidden cursor-pointer ${
                  isActive
                    ? 'text-[#E96746] dark:text-[#F07856] font-bold'
                    : isDarkMode
                    ? 'text-[#C1CDDC] hover:text-[#FFF8ED]'
                    : 'text-[#52647A] hover:text-[#263238]'
                }`}
              >
                <div className="relative">
                  {item.icon}
                  {item.badge !== undefined && (
                    <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-[#E96746] dark:bg-[#F07856] text-white text-[10px] flex items-center justify-center font-bold">
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
