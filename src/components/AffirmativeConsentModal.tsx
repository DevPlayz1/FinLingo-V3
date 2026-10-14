import React, { useState } from 'react';
import {
  Shield,
  FileText,
  CheckCircle2,
  Lock,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import { ConsentRecord, LegalDocId } from '../types';

interface AffirmativeConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRecordConsent: (record: ConsentRecord) => void;
  onOpenPolicyDoc: (docId: LegalDocId) => void;
  isDarkMode?: boolean;
}

export const AffirmativeConsentModal: React.FC<AffirmativeConsentModalProps> = ({
  isOpen,
  onClose,
  onRecordConsent,
  onOpenPolicyDoc,
  isDarkMode = false
}) => {
  // UNCHECKED by default - DPDP Act 2023 & Indian Law strictly requires affirmative action
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [confirmAge, setConfirmAge] = useState(false);
  const [optionalMarketing, setOptionalMarketing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms || !confirmAge) {
      setErrorMessage('Please confirm all required affirmative checkboxes before proceeding.');
      return;
    }

    const record: ConsentRecord = {
      termsAccepted: true,
      termsVersion: 'v2026.1-DPDPA',
      privacyNoticeAcknowledged: true,
      privacyVersion: 'v2026.1-DPDPA',
      timestamp: new Date().toISOString(),
      marketingOptIn: optionalMarketing,
      ageConfirmed18OrWithGuardian: true
    };

    onRecordConsent(record);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div
        className={`relative w-full max-w-xl rounded-3xl shadow-2xl border overflow-hidden flex flex-col transition-colors ${
          isDarkMode
            ? 'bg-[#132238] border-[#1E3A5F] text-[#FFF8ED]'
            : 'bg-[#FFF8ED] border-[#E8F0F8] text-[#263238]'
        }`}
      >
        {/* Header in Deep Educational Blue */}
        <div className="p-6 bg-[#173B63] dark:bg-[#0B192C] text-white flex items-center justify-between border-b border-[#173B63] dark:border-[#1E3A5F]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#F07856]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-[#FFF8ED]">
                Student Privacy &amp; Statutory Notice
              </h2>
              <p className="text-xs text-[#E8F0F8]/80">
                Digital Personal Data Protection Act, 2023 Notice
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs sm:text-sm">
          {/* Transparent Notice */}
          <div
            className={`p-4 rounded-2xl border space-y-2 leading-relaxed ${
              isDarkMode
                ? 'bg-[#0B192C] border-[#1E3A5F] text-[#E8F0F8]'
                : 'bg-white border-[#E8F0F8] text-[#263238]'
            }`}
          >
            <div className="font-bold flex items-center gap-1.5 text-[#173B63] dark:text-[#FFF8ED]">
              <Lock className="w-4 h-4 text-[#F07856]" />
              <span>Notice Before Personal Data Processing</span>
            </div>
            <p className="text-xs text-[#263238]/80 dark:text-[#E8F0F8]/80">
              Before you begin learning with FinLingo, please review how we handle your academic data in compliance with Indian cyber laws:
            </p>
            <ul className="space-y-1.5 text-xs text-[#263238]/70 dark:text-[#E8F0F8]/70 pl-3 list-disc">
              <li>
                <strong>Data Collected:</strong> Display name, email address, optional college affiliation, and quiz gamification scores (XP, streaks).
              </li>
              <li>
                <strong>Purpose:</strong> Delivering interactive lessons, calculating spaced review queues, and compiling peer study leaderboards.
              </li>
              <li>
                <strong>Privacy by Design:</strong> Your private email is never published. Optional avatar images are sanitized client-side.
              </li>
              <li>
                <strong>Self-Service Erasure:</strong> You can export your data in JSON or delete all records at any time from your profile.
              </li>
            </ul>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-[#DC2626]/10 border border-[#DC2626]/30 text-[#DC2626] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Affirmative Checkboxes */}
          <div className="space-y-3 pt-1">
            {/* 1. Essential Terms (Mandatory) */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => {
                  setAgreeTerms(e.target.checked);
                  setErrorMessage(null);
                }}
                className="mt-1 w-4 h-4 rounded border-gray-300 text-[#F07856] focus:ring-[#F07856]"
              />
              <span className="text-xs leading-normal">
                <span className="font-bold text-[#173B63] dark:text-[#FFF8ED]">
                  [Mandatory]&nbsp;
                </span>
                I have read and agree to the{' '}
                <button
                  type="button"
                  onClick={() => onOpenPolicyDoc('terms')}
                  className="text-[#F07856] font-semibold hover:underline inline-flex items-center gap-0.5"
                >
                  <span>Terms of Service (v2026.1)</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
                {' '}and acknowledge the{' '}
                <button
                  type="button"
                  onClick={() => onOpenPolicyDoc('privacy')}
                  className="text-[#F07856] font-semibold hover:underline inline-flex items-center gap-0.5"
                >
                  <span>Privacy Policy</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
                .
              </span>
            </label>

            {/* 2. Age Confirmation (Mandatory under DPDPA Section 9) */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={confirmAge}
                onChange={(e) => {
                  setConfirmAge(e.target.checked);
                  setErrorMessage(null);
                }}
                className="mt-1 w-4 h-4 rounded border-gray-300 text-[#F07856] focus:ring-[#F07856]"
              />
              <span className="text-xs leading-normal">
                <span className="font-bold text-[#173B63] dark:text-[#FFF8ED]">
                  [Mandatory]&nbsp;
                </span>
                I confirm that I am at least 18 years of age, or accessing FinLingo with the consent, guidance, and supervision of a parent or legal guardian.
              </span>
            </label>

            {/* 3. Unbundled Optional Marketing (Distinct choice) */}
            <div
              className={`p-3 rounded-xl border transition-colors ${
                isDarkMode ? 'bg-[#0B192C]/50 border-[#1E3A5F]' : 'bg-[#E8F0F8]/40 border-[#E8F0F8]'
              }`}
            >
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={optionalMarketing}
                  onChange={(e) => setOptionalMarketing(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-[#F07856] focus:ring-[#F07856]"
                />
                <span className="text-xs leading-normal">
                  <span className="font-bold text-[#16A34A]">
                    [Optional - Unbundled]&nbsp;
                  </span>
                  I agree to receive occasional academic newsletters, newly released track announcements, and exam prep tips. (Declining does not limit access to any lessons or quizzes).
                </span>
              </label>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-[#E8F0F8] dark:border-[#1E3A5F] flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-[11px] text-[#263238]/60 dark:text-[#E8F0F8]/60">
              Evidence timestamp will be recorded locally.
            </span>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="submit"
                disabled={!agreeTerms || !confirmAge}
                className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition shadow-md ${
                  agreeTerms && confirmAge
                    ? 'bg-[#F07856] hover:bg-[#d96240] text-white cursor-pointer'
                    : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm &amp; Proceed to Study</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
