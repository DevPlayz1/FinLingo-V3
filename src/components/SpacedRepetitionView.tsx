import React, { useState } from 'react';
import {
  Brain,
  CheckCircle2,
  XCircle,
  ArrowRight,
  BookOpen,
  ShieldCheck,
  Check,
  RotateCcw
} from 'lucide-react';
import { SpacedRepetitionItem, UserProfile } from '../types';
import { XP_REWARDS } from '../services/gamification';

interface SpacedRepetitionViewProps {
  items: SpacedRepetitionItem[];
  userProfile: UserProfile;
  onAdvanceItem: (itemId: string, correct: boolean) => void;
  onRemoveItem: (itemId: string) => void;
  onNavigateToTracks: () => void;
  isDarkMode?: boolean;
}

export const SpacedRepetitionView: React.FC<SpacedRepetitionViewProps> = ({
  items,
  onAdvanceItem,
  onRemoveItem,
  onNavigateToTracks,
  isDarkMode = false
}) => {
  const [selectedTrack, setSelectedTrack] = useState<string>('all');
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [reviewMode, setReviewMode] = useState<'interactive' | 'flashcard'>('interactive');
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  const filteredItems = items.filter((item) => {
    if (selectedTrack === 'all') return true;
    return item.trackId === selectedTrack;
  });

  const currentItem = filteredItems[activeItemIndex];

  const handleSelectAnswer = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isAnswerSubmitted || !currentItem) return;
    setIsAnswerSubmitted(true);
    const isCorrect = selectedOption === currentItem.correctOptionIndex;
    onAdvanceItem(currentItem.id, isCorrect);
  };

  const handleNextCard = () => {
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setIsCardFlipped(false);
    if (activeItemIndex < filteredItems.length - 1) {
      setActiveItemIndex((prev) => prev + 1);
    } else {
      setActiveItemIndex(0);
    }
  };

  const getRepetitionBadge = (level: number) => {
    switch (level) {
      case 0:
        return {
          label: 'Needs Review (Stage 0)',
          color: 'bg-[#FEE2E2] text-[#7F1D1D] border-[#DC2626]/20'
        };
      case 1:
        return {
          label: 'Review in 1 Day (Stage 1)',
          color: 'bg-[#FCE5DC] text-[#F07856] border-[#F07856]/30'
        };
      case 2:
        return {
          label: 'Review in 3 Days (Stage 2)',
          color: isDarkMode
            ? 'bg-[#1E3A5F] text-[#FFF8ED] border-[#1E3A5F]'
            : 'bg-[#E8F0F8] text-[#173B63] border-[#173B63]/20'
        };
      case 3:
      default:
        return {
          label: 'Concept Mastered ✓',
          color: 'bg-[#DCFCE7] text-[#14532D] border-[#16A34A]/20'
        };
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Educational Banner in Deep Educational Blue */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border shadow-lg transition-colors ${
          isDarkMode
            ? 'bg-[#132238] border-[#1E3A5F] text-[#FFF8ED]'
            : 'bg-[#173B63] border-[#173B63] text-white shadow-[#173B63]/15'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-xs text-[#FFF8ED]">
              <Brain className="w-3.5 h-3.5 text-[#F07856]" />
              <span>Cognitive Active Retrieval</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#FFF8ED]">
              Spaced Repetition Review Deck
            </h1>
            <p className="text-[#E8F0F8] text-xs sm:text-sm leading-relaxed">
              When questions are answered incorrectly during quizzes, they enter this deck. Revisiting them at staggered intervals defeats the forgetting curve and cements financial knowledge into long-term memory.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-white shrink-0">
            <div className="text-center px-2">
              <span className="block text-2xl font-black text-[#F07856]">{items.length}</span>
              <span className="text-[11px] text-[#E8F0F8] font-medium">In Queue</span>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div className="text-center px-2">
              <span className="block text-2xl font-black text-[#FFF8ED]">
                {items.filter((i) => i.repetitionLevel >= 2).length}
              </span>
              <span className="text-[11px] text-[#E8F0F8] font-medium">Advancing</span>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Mode Toggle and Track Filter */}
      <div
        className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-3.5 sm:p-4 rounded-2xl border shadow-2xs transition-colors ${
          isDarkMode
            ? 'bg-[#132238] border-[#1E3A5F]'
            : 'bg-white border-[#E8F0F8]'
        }`}
      >
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span
            className={`text-xs font-bold ${
              isDarkMode ? 'text-[#FFF8ED]' : 'text-[#173B63]'
            }`}
          >
            Filter Track:
          </span>
          <div
            className={`flex items-center gap-1 p-1 rounded-xl ${
              isDarkMode ? 'bg-[#0B192C]' : 'bg-[#E8F0F8]'
            }`}
          >
            {['all', 'accounting', 'economics', 'finance'].map((track) => (
              <button
                key={track}
                onClick={() => {
                  setSelectedTrack(track);
                  setActiveItemIndex(0);
                  setSelectedOption(null);
                  setIsAnswerSubmitted(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition capitalize focus:outline-hidden ${
                  selectedTrack === track
                    ? isDarkMode
                      ? 'bg-[#F07856] text-white shadow-xs'
                      : 'bg-[#173B63] text-white shadow-xs'
                    : isDarkMode
                    ? 'text-[#E8F0F8] hover:text-[#FFF8ED] hover:bg-[#1E3A5F]'
                    : 'text-[#173B63] hover:text-[#173B63] hover:bg-white/60'
                }`}
              >
                {track}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <button
            onClick={() => {
              setReviewMode('interactive');
              setIsCardFlipped(false);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition focus:outline-hidden ${
              reviewMode === 'interactive'
                ? 'bg-[#F07856] text-white shadow-xs'
                : isDarkMode
                ? 'text-[#E8F0F8] hover:bg-[#1E3A5F]'
                : 'text-[#173B63] hover:bg-[#E8F0F8]'
            }`}
          >
            Quiz Mode
          </button>
          <button
            onClick={() => {
              setReviewMode('flashcard');
              setIsAnswerSubmitted(false);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition focus:outline-hidden ${
              reviewMode === 'flashcard'
                ? 'bg-[#F07856] text-white shadow-xs'
                : isDarkMode
                ? 'text-[#E8F0F8] hover:bg-[#1E3A5F]'
                : 'text-[#173B63] hover:bg-[#E8F0F8]'
            }`}
          >
            Flashcard Flip
          </button>
        </div>
      </div>

      {/* Active Spaced Repetition Card */}
      {filteredItems.length > 0 && currentItem ? (
        <div
          className={`rounded-3xl border shadow-md overflow-hidden flex flex-col transition-colors ${
            isDarkMode
              ? 'bg-[#132238] border-[#1E3A5F]'
              : 'bg-white border-[#E8F0F8]'
          }`}
        >
          {/* Card Meta Header */}
          <div
            className={`p-4 sm:p-5 border-b flex items-center justify-between ${
              isDarkMode
                ? 'bg-[#0B192C] border-[#1E3A5F]'
                : 'bg-[#FFF8ED] border-[#E8F0F8]'
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${
                  isDarkMode
                    ? 'bg-[#1E3A5F] text-[#FFF8ED] border-[#1E3A5F]'
                    : 'bg-[#E8F0F8] text-[#173B63] border-[#173B63]/10'
                }`}
              >
                {currentItem.trackId.toUpperCase()}
              </span>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-md border ${
                  getRepetitionBadge(currentItem.repetitionLevel).color
                }`}
              >
                {getRepetitionBadge(currentItem.repetitionLevel).label}
              </span>
            </div>

            <div
              className={`text-xs font-semibold ${
                isDarkMode ? 'text-[#E8F0F8]/70' : 'text-[#263238]/70'
              }`}
            >
              Item {activeItemIndex + 1} of {filteredItems.length}
            </div>
          </div>

          {/* Mode 1: Interactive Question Mode */}
          {reviewMode === 'interactive' ? (
            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <h3
                  className={`text-lg sm:text-xl font-extrabold leading-snug ${
                    isDarkMode ? 'text-[#FFF8ED]' : 'text-[#173B63]'
                  }`}
                >
                  {currentItem.prompt}
                </h3>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {currentItem.options.map((option, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === currentItem.correctOptionIndex;

                  let btnStyle = isDarkMode
                    ? 'border-[#1E3A5F] hover:border-[#F07856]/40 bg-[#0B192C] text-[#FFF8ED]'
                    : 'border-[#E8F0F8] hover:border-[#173B63]/40 bg-white text-[#263238]';
                  let iconBg = isDarkMode
                    ? 'bg-[#1E3A5F] text-[#FFF8ED]'
                    : 'bg-[#E8F0F8] text-[#173B63]';

                  if (isSelected && !isAnswerSubmitted) {
                    btnStyle = isDarkMode
                      ? 'border-[#F07856] bg-[#1E3A5F] text-[#FFF8ED] ring-2 ring-[#F07856]/40'
                      : 'border-[#F07856] bg-[#FCE5DC]/40 text-[#173B63] ring-2 ring-[#F07856]/30';
                    iconBg = 'bg-[#F07856] text-white';
                  }

                  if (isAnswerSubmitted) {
                    if (isCorrect) {
                      btnStyle =
                        'border-[#16A34A] bg-[#DCFCE7] text-[#14532D] ring-2 ring-[#16A34A]/30 font-semibold';
                      iconBg = 'bg-[#16A34A] text-white';
                    } else if (isSelected && !isCorrect) {
                      btnStyle =
                        'border-[#DC2626] bg-[#FEE2E2] text-[#7F1D1D] ring-2 ring-[#DC2626]/30';
                      iconBg = 'bg-[#DC2626] text-white';
                    } else {
                      btnStyle = isDarkMode
                        ? 'border-[#1E3A5F] opacity-40 bg-[#0B192C] text-[#E8F0F8]/50'
                        : 'border-[#E8F0F8] opacity-50 bg-white text-[#263238]/60';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswerSubmitted}
                      onClick={() => handleSelectAnswer(idx)}
                      className={`w-full p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all duration-200 text-sm sm:text-base font-medium shadow-2xs focus:outline-hidden card-interactive hover-lift ${btnStyle}`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${iconBg}`}
                      >
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <div className="flex-1 leading-snug">{option}</div>
                      {isAnswerSubmitted && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-[#16A34A] shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Instant Explanation Box */}
              {isAnswerSubmitted && (
                <div
                  className={`p-5 rounded-2xl border ${
                    selectedOption === currentItem.correctOptionIndex
                      ? 'bg-[#DCFCE7] border-[#16A34A]/40 text-[#14532D]'
                      : 'bg-[#FEE2E2] border-[#DC2626]/40 text-[#7F1D1D]'
                  }`}
                >
                  <div className="flex items-center gap-2 font-extrabold mb-1.5 text-sm sm:text-base">
                    {selectedOption === currentItem.correctOptionIndex ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-[#16A34A]" />
                        <span className="text-[#14532D]">
                          Mastery Stage Advanced! (+{XP_REWARDS.SPACED_REPETITION_PRACTICE} XP)
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-[#DC2626]" />
                        <span className="text-[#7F1D1D]">
                          Interval reset to Stage 0 for reinforcement
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm leading-relaxed">{currentItem.explanation}</p>
                </div>
              )}
            </div>
          ) : (
            /* Mode 2: Flashcard Flip Mode */
            <div
              className={`p-8 sm:p-12 text-center min-h-[300px] flex flex-col justify-center items-center ${
                isDarkMode ? 'bg-[#132238]' : 'bg-white'
              }`}
            >
              {!isCardFlipped ? (
                <div className="space-y-4 max-w-lg">
                  <span
                    className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md ${
                      isDarkMode
                        ? 'bg-[#1E3A5F] text-[#FFF8ED]'
                        : 'bg-[#E8F0F8] text-[#173B63]'
                    }`}
                  >
                    Prompt Card
                  </span>
                  <h3
                    className={`text-xl sm:text-2xl font-extrabold leading-relaxed ${
                      isDarkMode ? 'text-[#FFF8ED]' : 'text-[#173B63]'
                    }`}
                  >
                    {currentItem.prompt}
                  </h3>
                  <button
                    onClick={() => setIsCardFlipped(true)}
                    className="mt-4 px-5 py-2.5 rounded-xl bg-[#F07856] text-white font-bold text-sm shadow-md shadow-[#F07856]/25 hover:bg-[#D95D3B] transition"
                  >
                    Flip to Reveal Answer &amp; Rationale
                  </button>
                </div>
              ) : (
                <div className="space-y-4 max-w-lg animate-in fade-in duration-200">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#14532D] bg-[#DCFCE7] px-3 py-1 rounded-md border border-[#16A34A]/30">
                    Correct Answer
                  </span>
                  <h3 className="text-lg sm:text-xl font-extrabold text-[#14532D]">
                    {currentItem.options[currentItem.correctOptionIndex]}
                  </h3>
                  <div
                    className={`p-4 rounded-2xl border text-left text-xs sm:text-sm leading-relaxed ${
                      isDarkMode
                        ? 'bg-[#0B192C] border-[#1E3A5F] text-[#E8F0F8]'
                        : 'bg-[#FFF8ED] border-[#E8F0F8] text-[#263238]'
                    }`}
                  >
                    <strong
                      className={`block mb-1 ${
                        isDarkMode ? 'text-[#FFF8ED]' : 'text-[#173B63]'
                      }`}
                    >
                      Pedagogical Rationale:
                    </strong>
                    {currentItem.explanation}
                  </div>
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      onClick={() => {
                        onAdvanceItem(currentItem.id, false);
                        handleNextCard();
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-[#FEE2E2] text-[#7F1D1D] border border-[#DC2626]/20 hover:bg-[#DC2626]/10 transition cursor-pointer btn-interactive hover-lift"
                    >
                      Need Practice (Reset)
                    </button>
                    <button
                      onClick={() => {
                        onAdvanceItem(currentItem.id, true);
                        handleNextCard();
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-[#16A34A] text-white shadow-xs hover:bg-[#15803D] transition flex items-center gap-1.5 cursor-pointer btn-interactive hover-lift"
                    >
                      <Check className="w-4 h-4" />
                      <span>Got It! (Advance Stage)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Bottom Card Footer */}
          {reviewMode === 'interactive' && (
            <div
              className={`p-4 sm:p-5 border-t flex items-center justify-between gap-3 ${
                isDarkMode
                  ? 'bg-[#0B192C] border-[#1E3A5F]'
                  : 'bg-[#FFF8ED] border-[#E8F0F8]'
              }`}
            >
              <button
                onClick={() => onRemoveItem(currentItem.id)}
                className={`text-xs font-semibold hover:text-[#DC2626] transition ${
                  isDarkMode ? 'text-[#E8F0F8]/60' : 'text-[#263238]/60'
                }`}
              >
                Dismiss from Review Deck
              </button>

              <div className="flex items-center gap-2">
                {!isAnswerSubmitted ? (
                  <button
                    disabled={selectedOption === null}
                    onClick={handleSubmitAnswer}
                    className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#F07856] hover:bg-[#D95D3B] disabled:opacity-50 text-white shadow-md shadow-[#F07856]/25 transition"
                  >
                    Check Answer
                  </button>
                ) : (
                  <button
                    onClick={handleNextCard}
                    className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white shadow-md flex items-center gap-2 transition ${
                      isDarkMode
                        ? 'bg-[#F07856] hover:bg-[#D95D3B]'
                        : 'bg-[#173B63] hover:bg-[#0F2742]'
                    }`}
                  >
                    <span>Next Review Card</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Empty State */
        <div
          className={`p-12 text-center rounded-3xl border shadow-xs max-w-lg mx-auto ${
            isDarkMode
              ? 'bg-[#132238] border-[#1E3A5F]'
              : 'bg-white border-[#E8F0F8]'
          }`}
        >
          <div className="w-16 h-16 rounded-2xl bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center mx-auto mb-4 border border-[#16A34A]/20">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h3
            className={`text-xl font-extrabold ${
              isDarkMode ? 'text-[#FFF8ED]' : 'text-[#173B63]'
            }`}
          >
            Review Deck Cleared!
          </h3>
          <p
            className={`text-xs sm:text-sm mt-2 leading-relaxed ${
              isDarkMode ? 'text-[#E8F0F8]/80' : 'text-[#263238]/80'
            }`}
          >
            You currently have zero missed questions pending in this track queue. Keep testing your skills in lesson quizzes to uncover any blind spots!
          </p>
          <button
            onClick={onNavigateToTracks}
            className="mt-6 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#F07856] hover:bg-[#D95D3B] text-white shadow-md shadow-[#F07856]/25 transition flex items-center gap-2 mx-auto"
          >
            <BookOpen className="w-4 h-4" />
            <span>Practise Curriculum Quizzes</span>
          </button>
        </div>
      )}
    </div>
  );
};
