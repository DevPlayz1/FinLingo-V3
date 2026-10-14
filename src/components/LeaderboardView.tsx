import React from 'react';
import {
  Trophy,
  Flame,
  Award,
  Sparkles,
  Crown,
  GraduationCap,
  TrendingUp
} from 'lucide-react';
import { LeaderboardEntry, UserProfile } from '../types';
import { UserAvatar } from './UserAvatar';

interface LeaderboardViewProps {
  entries: LeaderboardEntry[];
  userProfile: UserProfile;
  isDarkMode?: boolean;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  entries,
  userProfile,
  isDarkMode = false
}) => {
  const currentUserEntry =
    entries.find((e) => e.isCurrentUser || e.id === 'lb-curr') || entries[3] || entries[0];
  const nextCompetitor = entries.find((e) => e.rank === currentUserEntry.rank - 1);
  const xpDifference = nextCompetitor ? nextCompetitor.xp - currentUserEntry.xp : 0;

  const top3 = entries.slice(0, 3);

  return (
    <div className="space-y-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header Banner in Deep Educational Blue */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border shadow-lg transition-colors ${
          isDarkMode
            ? 'bg-[#132238] border-[#1E3A5F] text-[#FFF8ED]'
            : 'bg-[#173B63] border-[#173B63] text-white shadow-[#173B63]/15'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-xs text-[#FFF8ED]">
              <Crown className="w-3.5 h-3.5 text-[#F07856]" />
              <span>Collegiate Commerce Rankings</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#FFF8ED]">
              Global Student Leaderboard
            </h1>
            <p className="text-[#E8F0F8] text-xs sm:text-sm">
              Benchmark your commerce and finance acumen against top student cohorts worldwide.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center gap-3 shrink-0">
            <Trophy className="w-8 h-8 text-[#F07856] shrink-0" />
            <div>
              <span className="text-[11px] text-[#E8F0F8] block font-medium">Your Standing</span>
              <span className="text-xl font-black text-[#FFF8ED]">
                Rank #{currentUserEntry.rank}
              </span>
              <span className="text-xs text-[#F07856] font-bold ml-1.5">
                ({currentUserEntry.xp} XP)
              </span>
            </div>
          </div>
        </div>

        {/* Motivational nudge */}
        {nextCompetitor && xpDifference > 0 && (
          <div className="mt-5 p-3 rounded-xl bg-white/10 border border-white/15 flex items-center gap-2 text-xs text-[#E8F0F8]">
            <TrendingUp className="w-4 h-4 text-[#F07856] shrink-0" />
            <span>
              You’re only <strong className="text-[#FFF8ED]">{xpDifference} XP</strong> away from passing{' '}
              <strong className="text-[#FFF8ED]">
                #{nextCompetitor.rank} {nextCompetitor.displayName}
              </strong>{' '}
              ({nextCompetitor.university})!
            </span>
          </div>
        )}
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        {/* Rank 2 (Silver) */}
        {top3[1] && (
          <div
            className={`order-2 md:order-1 p-5 rounded-2xl border shadow-xs flex flex-col items-center text-center relative overflow-hidden transition-colors ${
              isDarkMode ? 'bg-[#132238] border-[#1E3A5F]' : 'bg-white border-[#E8F0F8]'
            }`}
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-sm mb-3 border ${
                isDarkMode
                  ? 'bg-[#1E3A5F] text-[#FFF8ED] border-[#1E3A5F]'
                  : 'bg-[#E8F0F8] text-[#173B63] border-[#173B63]/20'
              }`}
            >
              🥈 2
            </div>

            <UserAvatar
              src={top3[1].isCurrentUser ? userProfile.avatar : top3[1].avatar}
              name={top3[1].isCurrentUser ? userProfile.displayName : top3[1].displayName}
              size="lg"
              className="mb-2"
              ringClassName="ring-4 ring-[#E8F0F8]"
            />

            <h3
              className={`font-extrabold text-base ${
                isDarkMode ? 'text-[#FFF8ED]' : 'text-[#173B63]'
              }`}
            >
              {top3[1].isCurrentUser ? userProfile.displayName : top3[1].displayName}
            </h3>
            <span
              className={`text-xs font-medium flex items-center gap-1 mt-0.5 ${
                isDarkMode ? 'text-[#E8F0F8]/70' : 'text-[#263238]/70'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-[#F07856]" />
              {top3[1].university}
            </span>
            <div
              className={`mt-3 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                isDarkMode ? 'bg-[#1E3A5F] text-[#FFF8ED]' : 'bg-[#E8F0F8] text-[#173B63]'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-[#F07856]" />
              <span>{top3[1].xp} XP</span>
            </div>
          </div>
        )}

        {/* Rank 1 (Gold with Coral accent) */}
        {top3[0] && (
          <div
            className={`order-1 md:order-2 p-6 rounded-2xl border-2 border-[#F07856] shadow-md flex flex-col items-center text-center relative overflow-hidden md:-mt-3 transition-colors ${
              isDarkMode ? 'bg-[#132238]' : 'bg-white'
            }`}
          >
            <div className="absolute top-0 inset-x-0 h-1.5 bg-[#F07856]" />
            <div
              className={`w-11 h-11 rounded-full flex items-center justify-center font-black text-base mb-3 border shadow-sm ${
                isDarkMode
                  ? 'bg-[#1E3A5F] text-[#F07856] border-[#F07856]/40'
                  : 'bg-[#FCE5DC] text-[#F07856] border-[#F07856]/40'
              }`}
            >
              👑 1
            </div>

            <UserAvatar
              src={top3[0].isCurrentUser ? userProfile.avatar : top3[0].avatar}
              name={top3[0].isCurrentUser ? userProfile.displayName : top3[0].displayName}
              size="xl"
              className="mb-2"
              ringClassName="ring-4 ring-[#FCE5DC]"
            />

            <h3
              className={`font-extrabold text-lg ${
                isDarkMode ? 'text-[#FFF8ED]' : 'text-[#173B63]'
              }`}
            >
              {top3[0].isCurrentUser ? userProfile.displayName : top3[0].displayName}
            </h3>
            <span
              className={`text-xs font-semibold flex items-center gap-1 mt-0.5 ${
                isDarkMode ? 'text-[#E8F0F8]/70' : 'text-[#263238]/70'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-[#F07856]" />
              {top3[0].university}
            </span>
            <div className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FCE5DC] text-[#173B63] text-sm font-extrabold shadow-2xs">
              <Sparkles className="w-4 h-4 text-[#F07856]" />
              <span>{top3[0].xp} XP</span>
            </div>
          </div>
        )}

        {/* Rank 3 (Bronze) */}
        {top3[2] && (
          <div
            className={`order-3 md:order-3 p-5 rounded-2xl border shadow-xs flex flex-col items-center text-center relative overflow-hidden transition-colors ${
              isDarkMode ? 'bg-[#132238] border-[#1E3A5F]' : 'bg-white border-[#E8F0F8]'
            }`}
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-sm mb-3 border ${
                isDarkMode
                  ? 'bg-[#1E3A5F] text-[#FFF8ED] border-[#1E3A5F]'
                  : 'bg-[#FFF8ED] text-[#263238] border-[#E8F0F8]'
              }`}
            >
              🥉 3
            </div>

            <UserAvatar
              src={top3[2].isCurrentUser ? userProfile.avatar : top3[2].avatar}
              name={top3[2].isCurrentUser ? userProfile.displayName : top3[2].displayName}
              size="lg"
              className="mb-2"
              ringClassName="ring-4 ring-[#FFF8ED]"
            />

            <h3
              className={`font-extrabold text-base ${
                isDarkMode ? 'text-[#FFF8ED]' : 'text-[#173B63]'
              }`}
            >
              {top3[2].isCurrentUser ? userProfile.displayName : top3[2].displayName}
            </h3>
            <span
              className={`text-xs font-medium flex items-center gap-1 mt-0.5 ${
                isDarkMode ? 'text-[#E8F0F8]/70' : 'text-[#263238]/70'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-[#F07856]" />
              {top3[2].university}
            </span>
            <div
              className={`mt-3 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                isDarkMode ? 'bg-[#1E3A5F] text-[#FFF8ED]' : 'bg-[#E8F0F8] text-[#173B63]'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-[#F07856]" />
              <span>{top3[2].xp} XP</span>
            </div>
          </div>
        )}
      </div>

      {/* Rankings Table */}
      <div
        className={`rounded-2xl border shadow-2xs overflow-hidden transition-colors ${
          isDarkMode ? 'bg-[#132238] border-[#1E3A5F]' : 'bg-white border-[#E8F0F8]'
        }`}
      >
        <div
          className={`p-4 border-b flex items-center justify-between ${
            isDarkMode ? 'bg-[#0B192C] border-[#1E3A5F]' : 'bg-[#FFF8ED] border-[#E8F0F8]'
          }`}
        >
          <h3
            className={`font-bold text-sm sm:text-base ${
              isDarkMode ? 'text-[#FFF8ED]' : 'text-[#173B63]'
            }`}
          >
            All Student Standings
          </h3>
          <span
            className={`text-xs font-medium ${
              isDarkMode ? 'text-[#E8F0F8]/60' : 'text-[#263238]/60'
            }`}
          >
            Updated live by XP
          </span>
        </div>

        <div
          className={`divide-y ${
            isDarkMode ? 'divide-[#1E3A5F]' : 'divide-[#E8F0F8]'
          }`}
        >
          {entries.map((entry) => {
            const isUser = entry.isCurrentUser || entry.id === 'lb-curr';
            const avatarSrc = isUser ? userProfile.avatar : entry.avatar;
            const displayName = isUser ? userProfile.displayName : entry.displayName;

            return (
              <div
                key={entry.id}
                className={`p-4 flex items-center justify-between gap-4 transition ${
                  isUser
                    ? isDarkMode
                      ? 'bg-[#1E3A5F]/70 border-l-4 border-[#F07856]'
                      : 'bg-[#E8F0F8]/80 border-l-4 border-[#F07856]'
                    : isDarkMode
                    ? 'hover:bg-[#1E3A5F]/30'
                    : 'hover:bg-[#FFF8ED]/50'
                }`}
              >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                      entry.rank === 1
                        ? 'bg-[#F07856] text-white font-black'
                        : entry.rank === 2
                        ? isDarkMode
                          ? 'bg-[#1E3A5F] text-[#FFF8ED]'
                          : 'bg-[#173B63] text-white font-bold'
                        : entry.rank === 3
                        ? 'bg-[#FCE5DC] text-[#173B63] font-bold'
                        : isDarkMode
                        ? 'bg-[#0B192C] text-[#E8F0F8]'
                        : 'bg-[#E8F0F8] text-[#173B63]'
                    }`}
                  >
                    #{entry.rank}
                  </div>

                  <UserAvatar
                    src={avatarSrc}
                    name={displayName}
                    size="sm"
                    ringClassName="ring-2 ring-[#E8F0F8]/50"
                  />

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-bold text-sm truncate ${
                          isDarkMode ? 'text-[#FFF8ED]' : 'text-[#173B63]'
                        }`}
                      >
                        {displayName}
                      </span>
                      {isUser && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#F07856] text-white">
                          YOU
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-xs truncate block ${
                        isDarkMode ? 'text-[#E8F0F8]/70' : 'text-[#263238]/70'
                      }`}
                    >
                      {entry.university} •{' '}
                      <span
                        className={
                          isDarkMode
                            ? 'text-[#FFF8ED] font-semibold'
                            : 'text-[#173B63] font-semibold'
                        }
                      >
                        {entry.badge}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-5 shrink-0">
                  <div className="flex items-center gap-1 text-xs font-bold text-[#F07856]">
                    <Flame className="w-3.5 h-3.5 fill-[#F07856]" />
                    <span>{entry.streak}d</span>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-sm sm:text-base font-extrabold block ${
                        isDarkMode ? 'text-[#FFF8ED]' : 'text-[#173B63]'
                      }`}
                    >
                      {entry.xp}{' '}
                      <span
                        className={`text-xs font-semibold ${
                          isDarkMode ? 'text-[#E8F0F8]/60' : 'text-[#263238]/60'
                        }`}
                      >
                        XP
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
