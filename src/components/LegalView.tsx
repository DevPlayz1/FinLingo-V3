import React, { useState, useMemo } from 'react';
import {
  Shield,
  FileText,
  Cookie,
  AlertTriangle,
  Mail,
  Download,
  Printer,
  Search,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
  UserCheck,
  Scale,
  Building2,
  Calendar,
  Info,
  Check,
  RotateCcw,
  Sliders,
  Send,
  HelpCircle,
  Trash2
} from 'lucide-react';
import { LegalDocId, UserProfile } from '../types';
import { LEGAL_DOCUMENTS, LegalDocument } from '../data/legalPolicies';
import { dataService } from '../services/dataService';
import { printOrSaveLegalDocument } from '../utils/printPdfHelper';

interface LegalViewProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onResetData: () => void;
  isDarkMode?: boolean;
}

export const LegalView: React.FC<LegalViewProps> = ({
  userProfile,
  onUpdateProfile,
  onResetData,
  isDarkMode = false
}) => {
  const [activeTab, setActiveTab] = useState<LegalDocId>('privacy');
  const [searchQuery, setSearchQuery] = useState('');
  const [showErasureConfirm, setShowErasureConfirm] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Inquire / Grievance form state
  const [showGrievanceForm, setShowGrievanceForm] = useState(false);
  const [grievanceSubject, setGrievanceSubject] = useState('');
  const [grievanceDescription, setGrievanceDescription] = useState('');
  const [grievanceType, setGrievanceType] = useState<'privacy' | 'content' | 'account' | 'other'>('privacy');
  const [grievanceSubmitted, setGrievanceSubmitted] = useState(false);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const navTabs: { id: LegalDocId; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'privacy', label: 'Privacy Policy', icon: <Shield className="w-4 h-4" />, badge: 'DPDPA 2023' },
    { id: 'terms', label: 'Terms of Service', icon: <FileText className="w-4 h-4" /> },
    { id: 'security', label: 'Data Protection Notice', icon: <Lock className="w-4 h-4" />, badge: 'Security' },
    { id: 'cookies', label: 'Cookies & Storage', icon: <Cookie className="w-4 h-4" /> },
    { id: 'deletion', label: 'Account Deletion Policy', icon: <Trash2 className="w-4 h-4" />, badge: 'Erasure' },
    { id: 'community', label: 'Community & Fair-Play', icon: <UserCheck className="w-4 h-4" /> },
    { id: 'disclaimer', label: 'Academic & Financial Disclaimer', icon: <Scale className="w-4 h-4" />, badge: 'SEBI' },
    { id: 'grievance', label: 'Grievance Redressal', icon: <Mail className="w-4 h-4" />, badge: 'Rule 3(2)' },
    { id: 'internal-security', label: 'Internal Security Policy', icon: <Building2 className="w-4 h-4" />, badge: 'Internal' },
    { id: 'data-rights', label: 'Privacy & Data Rights', icon: <Sliders className="w-4 h-4" />, badge: 'Self-Serve' }
  ];

  const currentDoc: LegalDocument | undefined =
    activeTab !== 'data-rights' ? LEGAL_DOCUMENTS[activeTab] : undefined;

  const filteredSections = useMemo(() => {
    if (!currentDoc) return [];
    if (!searchQuery.trim()) return currentDoc.sections;

    const q = searchQuery.toLowerCase();
    return currentDoc.sections.filter((sec) => {
      const headingMatch = sec.heading.toLowerCase().includes(q);
      const contentMatch = sec.content.some((c) => c.toLowerCase().includes(q));
      const subMatch = sec.subsections?.some(
        (sub) =>
          sub.subheading.toLowerCase().includes(q) ||
          sub.paragraphs.some((p) => p.toLowerCase().includes(q))
      );
      return headingMatch || contentMatch || subMatch;
    });
  }, [currentDoc, searchQuery]);

  const handleExportData = () => {
    try {
      const jsonString = dataService.exportUserDataJSON();
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `finlingo-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      triggerToast('Personal data bundle exported successfully (JSON format)');
    } catch {
      triggerToast('Unable to export data. Please check storage permissions.');
    }
  };

  const handleToggleLeaderboardPrivacy = () => {
    const current = userProfile.privacySettings?.isLeaderboardPublic !== false;
    const updated = dataService.updatePrivacySettings({ isLeaderboardPublic: !current });
    onUpdateProfile(updated);
    triggerToast(
      !current
        ? 'Public leaderboard ranking enabled'
        : 'Anonymous mode enabled: Your name is masked on the leaderboard'
    );
  };

  const handleToggleAvatarPrivacy = () => {
    const current = userProfile.privacySettings?.showAvatarPublicly !== false;
    const updated = dataService.updatePrivacySettings({ showAvatarPublicly: !current });
    onUpdateProfile(updated);
    triggerToast(
      !current
        ? 'Profile photo is now visible on leaderboard'
        : 'Profile photo hidden from the public leaderboard'
    );
  };

  const handleSubmitGrievance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!grievanceSubject.trim() || !grievanceDescription.trim()) return;

    const mailtoUrl = `mailto:grievance@finlingo.app?subject=${encodeURIComponent(
      `[FinLingo Grievance - ${grievanceType.toUpperCase()}] ${grievanceSubject}`
    )}&body=${encodeURIComponent(
      `Student Name: ${userProfile.displayName}\nStudent Email: ${userProfile.email}\nUniversity: ${userProfile.university}\nType: ${grievanceType}\n\nDescription:\n${grievanceDescription}\n\n[Filed via FinLingo Legal Center - Timestamp: ${new Date().toISOString()}]`
    )}`;

    window.open(mailtoUrl, '_blank');
    setGrievanceSubmitted(true);
    setTimeout(() => {
      setGrievanceSubmitted(false);
      setShowGrievanceForm(false);
      setGrievanceSubject('');
      setGrievanceDescription('');
      triggerToast('Grievance draft generated for grievance@finlingo.app');
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border shadow-sm transition-colors ${
          isDarkMode
            ? 'bg-[#132238] border-[#1E3A5F]'
            : 'bg-white border-[#E8F0F8]'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#173B63] dark:bg-[#0B192C] text-white flex items-center justify-center shadow-md border border-[#F07856]/40 flex-shrink-0">
              <Shield className="w-7 h-7 text-[#F07856]" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1
                  className={`text-2xl sm:text-3xl font-black tracking-tight ${
                    isDarkMode ? 'text-[#FFF8ED]' : 'text-[#173B63]'
                  }`}
                >
                  Legal, Privacy &amp; Data Rights Center
                </h1>
                <span className="inline-flex items-center text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FCE5DC] text-[#F07856] border border-[#F07856]/30">
                  Republic of India
                </span>
              </div>
              <p
                className={`text-xs sm:text-sm max-w-2xl leading-relaxed ${
                  isDarkMode ? 'text-[#E8F0F8]/80' : 'text-[#263238]/80'
                }`}
              >
                Comprehensive legal policies compliant with the Digital Personal Data Protection Act, 2023 (DPDPA), Information Technology Act, 2000, and non-advisory SEBI disclosures.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const result = printOrSaveLegalDocument(currentDoc);
                triggerToast(result.message);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 transition cursor-pointer ${
                isDarkMode
                  ? 'bg-[#1E3A5F] hover:bg-[#1E3A5F]/80 text-[#FFF8ED] border-[#1E3A5F]'
                  : 'bg-[#E8F0F8] hover:bg-[#173B63] hover:text-white text-[#173B63] border-[#173B63]/20'
              }`}
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={() => setActiveTab('data-rights')}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#F07856] hover:bg-[#D95D3B] text-white shadow-sm shadow-[#F07856]/30 transition cursor-pointer flex items-center gap-1.5"
            >
              <Sliders className="w-4 h-4" />
              <span>Manage My Data</span>
            </button>
          </div>
        </div>

        {/* Legal Tabs navigation */}
        <div className="mt-8 pt-6 border-t border-[#E8F0F8] dark:border-[#1E3A5F] overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-2 min-w-max">
            {navTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSearchQuery('');
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#F07856] text-white shadow-md shadow-[#F07856]/25'
                      : isDarkMode
                      ? 'bg-[#0B192C] text-[#E8F0F8]/80 hover:bg-[#1E3A5F] hover:text-white border border-[#1E3A5F]'
                      : 'bg-[#FFF8ED] text-[#173B63] hover:bg-[#E8F0F8] border border-[#173B63]/10'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`text-[9px] uppercase font-black px-1.5 py-0.5 rounded-md ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : isDarkMode
                          ? 'bg-[#1E3A5F] text-[#F07856]'
                          : 'bg-[#FCE5DC] text-[#F07856]'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="space-y-6">
        {/* Search for clause if in doc view */}
        {activeTab !== 'data-rights' && (
          <div
            className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 ${
              isDarkMode
                ? 'bg-[#132238] border-[#1E3A5F]'
                : 'bg-white border-[#E8F0F8]'
            }`}
          >
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-3 w-4 h-4 text-[#263238]/50 dark:text-[#E8F0F8]/50" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search provisions in ${currentDoc?.title || 'policy'}...`}
                className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border focus:outline-hidden focus:ring-2 focus:ring-[#F07856] transition ${
                  isDarkMode
                    ? 'bg-[#0B192C] text-[#FFF8ED] border-[#1E3A5F] placeholder:text-[#E8F0F8]/40'
                    : 'bg-[#FFF8ED] text-[#263238] border-[#173B63]/20 placeholder:text-[#263238]/40'
                }`}
              />
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs font-semibold text-[#F07856] hover:underline cursor-pointer"
              >
                Reset Search Filter
              </button>
            )}
          </div>
        )}

        {/* Tab Content */}
        {activeTab !== 'data-rights' && currentDoc && (
          <div className="space-y-6">
            {/* Header info */}
            <div
              className={`p-6 rounded-3xl border transition-colors ${
                isDarkMode
                  ? 'bg-[#132238] border-[#1E3A5F]'
                  : 'bg-white border-[#E8F0F8]'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-[#173B63] text-[#FFF8ED]">
                  {currentDoc.badge}
                </span>
                <div className="flex items-center gap-3 text-xs text-[#263238]/70 dark:text-[#E8F0F8]/70">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#F07856]" />
                    Effective: {currentDoc.effectiveDate}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-[#F07856]" />
                    Jurisdiction: {currentDoc.jurisdiction}
                  </span>
                </div>
              </div>

              <h2
                className={`text-xl sm:text-2xl font-black tracking-tight mb-2 ${
                  isDarkMode ? 'text-[#FFF8ED]' : 'text-[#173B63]'
                }`}
              >
                {currentDoc.title}
              </h2>
              <p
                className={`text-sm leading-relaxed ${
                  isDarkMode ? 'text-[#E8F0F8]/90' : 'text-[#263238]/90'
                }`}
              >
                {currentDoc.summary}
              </p>
            </div>

            {/* Legal / Staging notice */}
            <div
              className={`p-4 rounded-2xl border flex items-start gap-3 transition-colors ${
                isDarkMode
                  ? 'bg-[#1E3A5F]/40 border-[#1E3A5F] text-[#E8F0F8]'
                  : 'bg-[#FCE5DC]/60 border-[#F07856]/30 text-[#263238]'
              }`}
            >
              <AlertTriangle className="w-5 h-5 text-[#F07856] flex-shrink-0 mt-0.5" />
              <div className="text-xs leading-relaxed">
                <strong className="font-bold block text-[#F07856] mb-0.5">
                  Statutory Notice &amp; Legal Audit Advisory
                </strong>
                {currentDoc.lawyerReviewNotice}
              </div>
            </div>

            {/* Clauses */}
            <div className="space-y-6">
              {filteredSections.map((section) => (
                <div
                  key={section.id}
                  className={`p-6 rounded-3xl border transition-colors ${
                    isDarkMode
                      ? 'bg-[#132238]/80 border-[#1E3A5F]'
                      : 'bg-white border-[#E8F0F8]'
                  }`}
                >
                  <h3
                    className={`text-base font-extrabold tracking-tight mb-3 flex items-center gap-2 ${
                      isDarkMode ? 'text-[#FFF8ED]' : 'text-[#173B63]'
                    }`}
                  >
                    <span className="w-2 h-4 bg-[#F07856] rounded-full inline-block" />
                    {section.heading}
                  </h3>

                  <div className="space-y-3 text-xs sm:text-sm leading-relaxed text-[#263238]/85 dark:text-[#E8F0F8]/85">
                    {section.content.map((paragraph, idx) => (
                      <p key={idx} className="whitespace-pre-line">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {section.subsections && section.subsections.length > 0 && (
                    <div className="mt-5 pt-4 border-t border-[#E8F0F8] dark:border-[#1E3A5F] space-y-4">
                      {section.subsections.map((sub, sIdx) => (
                        <div key={sIdx} className="space-y-1.5 pl-3.5 border-l-2 border-[#F07856]/50">
                          <h4
                            className={`text-xs sm:text-sm font-bold ${
                              isDarkMode ? 'text-[#FFF8ED]' : 'text-[#173B63]'
                            }`}
                          >
                            {sub.subheading}
                          </h4>
                          {sub.paragraphs.map((p, pIdx) => (
                            <p
                              key={pIdx}
                              className="text-xs sm:text-sm text-[#263238]/80 dark:text-[#E8F0F8]/80 leading-relaxed whitespace-pre-line"
                            >
                              {p}
                            </p>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Grievance Action Button */}
            {activeTab === 'grievance' && (
              <div
                className={`p-6 rounded-3xl border text-center space-y-3 ${
                  isDarkMode
                    ? 'bg-[#132238] border-[#1E3A5F]'
                    : 'bg-white border-[#E8F0F8]'
                }`}
              >
                <h4
                  className={`text-base font-black ${
                    isDarkMode ? 'text-[#FFF8ED]' : 'text-[#173B63]'
                  }`}
                >
                  Need to file a formal statutory grievance or data inquiry?
                </h4>
                <p className="text-xs text-[#263238]/70 dark:text-[#E8F0F8]/70 max-w-xl mx-auto">
                  Submit your ticket directly to our designated Grievance Officer in compliance with Rule 3(2) of the Information Technology Rules, 2021 and Section 13 of the DPDPA 2023.
                </p>
                <button
                  onClick={() => setShowGrievanceForm(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F07856] text-white font-bold text-xs shadow-md shadow-[#F07856]/30 hover:bg-[#D95D3B] transition cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Lodge Statutory Grievance Ticket</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 6: Privacy & Data Rights Self-Service */}
        {activeTab === 'data-rights' && (
          <div className="space-y-6">
            <div
              className={`p-6 rounded-3xl border transition-colors ${
                isDarkMode
                  ? 'bg-[#132238] border-[#1E3A5F]'
                  : 'bg-white border-[#E8F0F8]'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#173B63] text-[#FFF8ED]">
                  DPDPA 2023 Self-Service Portal
                </span>
                <span className="text-xs text-[#263238]/70 dark:text-[#E8F0F8]/70">
                  Real-time Data Controls
                </span>
              </div>
              <h2
                className={`text-xl sm:text-2xl font-black tracking-tight mb-2 ${
                  isDarkMode ? 'text-[#FFF8ED]' : 'text-[#173B63]'
                }`}
              >
                Your Personal Data &amp; Privacy Dashboard
              </h2>
              <p
                className={`text-xs sm:text-sm leading-relaxed ${
                  isDarkMode ? 'text-[#E8F0F8]/80' : 'text-[#263238]/80'
                }`}
              >
                Under the Digital Personal Data Protection Act, 2023 and the Information Technology Act, 2000, you have the right to inspect, export, manage, and erase your personal educational telemetry stored by FinLingo.
              </p>
            </div>

            {/* Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tool 1 */}
              <div
                className={`p-6 rounded-3xl border flex flex-col justify-between transition-colors ${
                  isDarkMode
                    ? 'bg-[#132238] border-[#1E3A5F]'
                    : 'bg-white border-[#E8F0F8]'
                }`}
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-[#E8F0F8] dark:bg-[#1E3A5F] text-[#173B63] dark:text-[#FFF8ED] flex items-center justify-center font-bold">
                    <Download className="w-5 h-5 text-[#F07856]" />
                  </div>
                  <h3
                    className={`text-sm font-extrabold ${
                      isDarkMode ? 'text-[#FFF8ED]' : 'text-[#173B63]'
                    }`}
                  >
                    Export Portable Data (JSON)
                  </h3>
                  <p className="text-xs text-[#263238]/70 dark:text-[#E8F0F8]/70 leading-relaxed">
                    Download a structured, machine-readable JSON archive containing your full student profile, XP history, quiz answers, spaced repetition queue, and active consents (DPDPA Section 11 compliance).
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-[#E8F0F8] dark:border-[#1E3A5F]">
                  <button
                    onClick={handleExportData}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#173B63] dark:bg-[#1E3A5F] text-white hover:bg-[#0F2742] text-xs font-bold transition cursor-pointer shadow-sm"
                  >
                    <Download className="w-4 h-4 text-[#F07856]" />
                    <span>Download My Data (JSON)</span>
                  </button>
                </div>
              </div>

              {/* Tool 2 */}
              <div
                className={`p-6 rounded-3xl border flex flex-col justify-between transition-colors ${
                  isDarkMode
                    ? 'bg-[#132238] border-[#1E3A5F]'
                    : 'bg-white border-[#E8F0F8]'
                }`}
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-[#E8F0F8] dark:bg-[#1E3A5F] text-[#173B63] dark:text-[#FFF8ED] flex items-center justify-center font-bold">
                    <Eye className="w-5 h-5 text-[#F07856]" />
                  </div>
                  <h3
                    className={`text-sm font-extrabold ${
                      isDarkMode ? 'text-[#FFF8ED]' : 'text-[#173B63]'
                    }`}
                  >
                    Public Leaderboard Visibility
                  </h3>
                  <p className="text-xs text-[#263238]/70 dark:text-[#E8F0F8]/70 leading-relaxed">
                    Choose whether your student name and university are shown on the community leaderboard. If disabled, you participate anonymously as &ldquo;Anonymous Scholar&rdquo;.
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-[#E8F0F8] dark:border-[#1E3A5F] flex items-center justify-between">
                  <span className="text-xs font-bold">
                    {userProfile.privacySettings?.isLeaderboardPublic !== false
                      ? 'Public Ranking Active'
                      : 'Anonymous Mode (Private)'}
                  </span>
                  <button
                    onClick={handleToggleLeaderboardPrivacy}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      userProfile.privacySettings?.isLeaderboardPublic !== false
                        ? 'bg-[#F07856] text-white'
                        : 'bg-[#1E3A5F] text-[#FFF8ED]'
                    }`}
                  >
                    {userProfile.privacySettings?.isLeaderboardPublic !== false ? (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Make Private</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Make Public</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Tool 3 */}
              <div
                className={`p-6 rounded-3xl border flex flex-col justify-between transition-colors ${
                  isDarkMode
                    ? 'bg-[#132238] border-[#1E3A5F]'
                    : 'bg-white border-[#E8F0F8]'
                }`}
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-[#E8F0F8] dark:bg-[#1E3A5F] text-[#173B63] dark:text-[#FFF8ED] flex items-center justify-center font-bold">
                    <UserCheck className="w-5 h-5 text-[#F07856]" />
                  </div>
                  <h3
                    className={`text-sm font-extrabold ${
                      isDarkMode ? 'text-[#FFF8ED]' : 'text-[#173B63]'
                    }`}
                  >
                    Profile Photo Public Display
                  </h3>
                  <p className="text-xs text-[#263238]/70 dark:text-[#E8F0F8]/70 leading-relaxed">
                    Control whether your custom uploaded avatar is visible to peer students in rankings or replaced with neutral geometric initials.
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-[#E8F0F8] dark:border-[#1E3A5F] flex items-center justify-between">
                  <span className="text-xs font-bold">
                    {userProfile.privacySettings?.showAvatarPublicly !== false
                      ? 'Photo Visible to Peers'
                      : 'Initials Mode (Photo Hidden)'}
                  </span>
                  <button
                    onClick={handleToggleAvatarPrivacy}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      userProfile.privacySettings?.showAvatarPublicly !== false
                        ? 'bg-[#F07856] text-white'
                        : 'bg-[#1E3A5F] text-[#FFF8ED]'
                    }`}
                  >
                    {userProfile.privacySettings?.showAvatarPublicly !== false ? (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Hide Photo</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Show Photo</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Tool 4 */}
              <div
                className={`p-6 rounded-3xl border flex flex-col justify-between transition-colors ${
                  isDarkMode
                    ? 'bg-[#132238] border-[#1E3A5F]'
                    : 'bg-white border-[#E8F0F8]'
                }`}
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/40 text-red-600 flex items-center justify-center font-bold">
                    <RotateCcw className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-extrabold text-red-600 dark:text-red-400">
                    Right to Erasure (DPDPA Section 12)
                  </h3>
                  <p className="text-xs text-[#263238]/70 dark:text-[#E8F0F8]/70 leading-relaxed">
                    Withdraw consent and permanently delete all local storage records, quiz telemetry, spaced repetition memory decks, and profile details from your browser.
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-[#E8F0F8] dark:border-[#1E3A5F]">
                  <button
                    onClick={() => setShowErasureConfirm(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition cursor-pointer shadow-sm shadow-red-600/30"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Erase All Data &amp; Withdraw Consent</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Inventory table */}
            <div
              className={`p-6 rounded-3xl border transition-colors ${
                isDarkMode
                  ? 'bg-[#132238] border-[#1E3A5F]'
                  : 'bg-white border-[#E8F0F8]'
              }`}
            >
              <h3
                className={`text-sm font-extrabold mb-3 flex items-center gap-2 ${
                  isDarkMode ? 'text-[#FFF8ED]' : 'text-[#173B63]'
                }`}
              >
                <Info className="w-4 h-4 text-[#F07856]" />
                <span>Itemised Inventory of Data Stored on This Device</span>
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#E8F0F8] dark:border-[#1E3A5F] text-[#263238]/60 dark:text-[#E8F0F8]/60">
                      <th className="py-2.5 pr-4 font-bold">Category</th>
                      <th className="py-2.5 px-4 font-bold">Current Value / State</th>
                      <th className="py-2.5 px-4 font-bold">Storage Mechanism</th>
                      <th className="py-2.5 pl-4 font-bold">Purpose</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8F0F8] dark:divide-[#1E3A5F]">
                    <tr>
                      <td className="py-3 pr-4 font-semibold">Student Name</td>
                      <td className="py-3 px-4 font-mono text-[11px]">{userProfile.displayName}</td>
                      <td className="py-3 px-4">Local HTML5 Storage</td>
                      <td className="py-3 pl-4 text-[#263238]/70 dark:text-[#E8F0F8]/70">Profile personalisation</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-semibold">Email Identifier</td>
                      <td className="py-3 px-4 font-mono text-[11px]">{userProfile.email}</td>
                      <td className="py-3 px-4">Local HTML5 Storage</td>
                      <td className="py-3 pl-4 text-[#263238]/70 dark:text-[#E8F0F8]/70">Account index</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-semibold">Campus Affiliation</td>
                      <td className="py-3 px-4 font-mono text-[11px]">{userProfile.university || 'Unspecified'}</td>
                      <td className="py-3 px-4">Local HTML5 Storage</td>
                      <td className="py-3 pl-4 text-[#263238]/70 dark:text-[#E8F0F8]/70">College league grouping</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-semibold">Gamification XP</td>
                      <td className="py-3 px-4 font-mono text-[11px]">{userProfile.currentXp} XP (Level {userProfile.level})</td>
                      <td className="py-3 px-4">Local HTML5 Storage</td>
                      <td className="py-3 pl-4 text-[#263238]/70 dark:text-[#E8F0F8]/70">Academic progression</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-semibold">Spaced Repetition Deck</td>
                      <td className="py-3 px-4 font-mono text-[11px]">
                        {dataService.getSpacedRepetitionDeck().length} queued questions
                      </td>
                      <td className="py-3 px-4">Local HTML5 Storage</td>
                      <td className="py-3 pl-4 text-[#263238]/70 dark:text-[#E8F0F8]/70">Memory retention algorithm</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Erasure Confirm Modal */}
      {showErasureConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div
            className={`w-full max-w-md p-6 rounded-3xl shadow-2xl border space-y-4 animate-in fade-in zoom-in-95 duration-150 ${
              isDarkMode
                ? 'bg-[#0B192C] text-[#FFF8ED] border-red-500/40'
                : 'bg-white text-[#263238] border-red-200'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-red-600 dark:text-red-400">
                Confirm Data Erasure &amp; Consent Withdrawal
              </h3>
              <p className="text-xs text-[#263238]/80 dark:text-[#E8F0F8]/80 mt-1 leading-relaxed">
                This action will permanently erase your local profile, unlocked badges, study streaks, and spaced repetition queues under Section 12 of the Digital Personal Data Protection Act, 2023. This action cannot be reversed.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowErasureConfirm(false)}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                  isDarkMode
                    ? 'border-[#1E3A5F] hover:bg-[#1E3A5F]'
                    : 'border-[#173B63]/20 hover:bg-[#E8F0F8]'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowErasureConfirm(false);
                  onResetData();
                  triggerToast('All data erased successfully');
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white transition cursor-pointer shadow-sm shadow-red-600/30"
              >
                Yes, Erase All My Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grievance Ticket Submission Modal */}
      {showGrievanceForm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div
            className={`w-full max-w-lg p-6 rounded-3xl shadow-2xl border space-y-4 animate-in fade-in zoom-in-95 duration-150 ${
              isDarkMode
                ? 'bg-[#0B192C] text-[#FFF8ED] border-[#1E3A5F]'
                : 'bg-white text-[#263238] border-[#173B63]/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#F07856]" />
                <h3
                  className={`text-base font-black ${
                    isDarkMode ? 'text-[#FFF8ED]' : 'text-[#173B63]'
                  }`}
                >
                  Lodge Statutory Grievance Ticket
                </h3>
              </div>
              <button
                onClick={() => setShowGrievanceForm(false)}
                className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#263238]/70 dark:text-[#E8F0F8]/70">
              Submitted pursuant to Rule 3(2) of IT Rules, 2021 &amp; Section 13 of DPDPA 2023. Acknowledged within 48 hours; resolved within 15 days.
            </p>

            <form onSubmit={handleSubmitGrievance} className="space-y-3">
              <div>
                <label className="block text-xs font-bold mb-1">Grievance Category</label>
                <select
                  value={grievanceType}
                  onChange={(e) => setGrievanceType(e.target.value as any)}
                  className={`w-full p-2.5 text-xs rounded-xl border focus:outline-hidden focus:ring-2 focus:ring-[#F07856] ${
                    isDarkMode
                      ? 'bg-[#132238] text-[#FFF8ED] border-[#1E3A5F]'
                      : 'bg-[#FFF8ED] text-[#263238] border-[#173B63]/20'
                  }`}
                >
                  <option value="privacy">Privacy &amp; Data Rights (DPDPA 2023)</option>
                  <option value="content">Curriculum, Explanation or Question Accuracy</option>
                  <option value="account">Student Profile &amp; Leaderboard Record</option>
                  <option value="other">General Operational / IT Grievance</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={grievanceSubject}
                  onChange={(e) => setGrievanceSubject(e.target.value)}
                  placeholder="e.g., Question clarification or DPDPA data inquiry"
                  className={`w-full p-2.5 text-xs rounded-xl border focus:outline-hidden focus:ring-2 focus:ring-[#F07856] ${
                    isDarkMode
                      ? 'bg-[#132238] text-[#FFF8ED] border-[#1E3A5F]'
                      : 'bg-[#FFF8ED] text-[#263238] border-[#173B63]/20'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Detailed Description</label>
                <textarea
                  required
                  rows={4}
                  value={grievanceDescription}
                  onChange={(e) => setGrievanceDescription(e.target.value)}
                  placeholder="Provide precise details, context, and expected remedy..."
                  className={`w-full p-2.5 text-xs rounded-xl border focus:outline-hidden focus:ring-2 focus:ring-[#F07856] ${
                    isDarkMode
                      ? 'bg-[#132238] text-[#FFF8ED] border-[#1E3A5F]'
                      : 'bg-[#FFF8ED] text-[#263238] border-[#173B63]/20'
                  }`}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowGrievanceForm(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold border transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={grievanceSubmitted}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#F07856] text-white hover:bg-[#D95D3B] transition cursor-pointer shadow-md shadow-[#F07856]/30"
                >
                  {grievanceSubmitted ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Drafting Ticket...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Generate Grievance Ticket</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-70 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div
            className={`px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border ${
              isDarkMode
                ? 'bg-[#132238] text-[#FFF8ED] border-[#1E3A5F]'
                : 'bg-[#173B63] text-[#FFF8ED] border-[#173B63]'
            }`}
          >
            <div className="w-7 h-7 rounded-lg bg-[#F07856] text-white flex items-center justify-center font-bold">
              <Check className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold">{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};
