import React, { useState, useRef, useEffect } from 'react';
import {
  GraduationCap,
  Award,
  Flame,
  Target,
  BookOpen,
  Database,
  RotateCcw,
  Edit2,
  Check,
  Crown,
  Camera,
  Trash2,
  UploadCloud,
  X,
  AlertCircle,
  CheckCircle2,
  Sun,
  Moon,
  Sparkles,
  Shield,
  Sliders,
  Download,
  Scale,
  FileText,
  Eye,
  EyeOff,
  Lock,
  LogOut
} from 'lucide-react';
import { UserProfile, LegalDocId, UserRole } from '../types';
import { calculateLevelProgress } from '../services/gamification';
import { UserAvatar } from './UserAvatar';
import { dataService } from '../services/dataService';
import {
  validateImageFile,
  optimizeProfileImage,
  OptimizedImageResult
} from '../utils/imageValidation';
import { authService } from '../services/authService';
import { validatePassword } from '../utils/passwordPolicy';
import { eligibilityService } from '../services/eligibilityService';

interface ProfileViewProps {
  userProfile: UserProfile;
  currentRole?: UserRole;
  onOpenRoleSelection?: () => void;
  onLogout?: () => void;
  accountEmail?: string;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onResetData: () => void;
  onOpenLegalCenter: (docId?: LegalDocId) => void;
  onOpenConsentModal?: () => void;
  onRevokeAgeEligibility?: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  userProfile,
  currentRole,
  onOpenRoleSelection,
  onLogout,
  accountEmail,
  onUpdateProfile,
  onResetData,
  onOpenLegalCenter,
  onOpenConsentModal,
  onRevokeAgeEligibility,
  isDarkMode = false,
  onToggleDarkMode
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(userProfile.displayName);
  const [university, setUniversity] = useState(userProfile.university);
  const [major, setMajor] = useState(userProfile.major);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // In-app Password Management State
  const [isPasswordSectionOpen, setIsPasswordSectionOpen] = useState(false);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordChangeStatus, setPasswordChangeStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

  const passwordValidation = validatePassword(newPasswordInput);
  const passwordsMatch = newPasswordInput.length > 0 && newPasswordInput === confirmPasswordInput;

  // Sync inputs whenever active profile changes (e.g. switching demo roles)
  useEffect(() => {
    setDisplayName(userProfile.displayName);
    setUniversity(userProfile.university);
    setMajor(userProfile.major);
  }, [userProfile.displayName, userProfile.university, userProfile.major, userProfile.uid]);

  // Photo Upload & Preview State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewResult, setPreviewResult] = useState<OptimizedImageResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);

  const levelProgress = calculateLevelProgress(userProfile.currentXp);

  // Age Eligibility State & Handler
  const [showRevokeAgeConfirm, setShowRevokeAgeConfirm] = useState(false);
  const activeEmail = accountEmail || (currentRole === 'admin' ? 'admin@finlingo.local' : 'learner@finlingo.local');
  const activeRole: UserRole = currentRole || 'user';
  const eligibilityRecord = eligibilityService.getEligibility(activeEmail, activeRole);

  const handleRevokeEligibility = () => {
    eligibilityService.revokeEligibility(activeEmail, activeRole);
    setShowRevokeAgeConfirm(false);
    triggerSuccessToast('13+ Age Eligibility revoked. Returning to verification gate...');
    if (onRevokeAgeEligibility) {
      onRevokeAgeEligibility();
    }
  };

  const handleSaveProfile = () => {
    onUpdateProfile({
      displayName,
      university,
      major
    });
    setIsEditing(false);
    triggerSuccessToast('Profile details updated successfully');
  };

  const triggerSuccessToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => {
      setSuccessToast(null);
    }, 3500);
  };

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
      triggerSuccessToast('Personal data bundle exported (JSON format)');
    } catch {
      triggerSuccessToast('Unable to export data.');
    }
  };

  const handleToggleLeaderboardPrivacy = () => {
    const current = userProfile.privacySettings?.isLeaderboardPublic !== false;
    const updated = dataService.updatePrivacySettings({ isLeaderboardPublic: !current });
    onUpdateProfile(updated);
    triggerSuccessToast(
      !current
        ? 'Public leaderboard ranking enabled'
        : 'Anonymous mode: Your name is masked on the leaderboard'
    );
  };

  const handleToggleAvatarPrivacy = () => {
    const current = userProfile.privacySettings?.showAvatarPublicly !== false;
    const updated = dataService.updatePrivacySettings({ showAvatarPublicly: !current });
    onUpdateProfile(updated);
    triggerSuccessToast(
      !current
        ? 'Photo visible to peer students on leaderboard'
        : 'Photo hidden from public leaderboard'
    );
  };

  // Open device file picker
  const handleOpenFileInput = () => {
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  // Process selected file with validation and canvas optimization
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setErrorMessage(null);
    setIsProcessing(true);
    setIsUploadModalOpen(true);

    // 1. Strict validation (size <= 5MB, JPEG/PNG/WebP, magic bytes verification)
    const validation = await validateImageFile(file);
    if (!validation.isValid) {
      setErrorMessage(validation.error || 'Invalid image file.');
      setIsProcessing(false);
      return;
    }

    // 2. High-performance canvas crop & WebP/JPEG compression
    try {
      const optimized = await optimizeProfileImage(file, 512, 0.88);
      setPreviewResult(optimized);
      setUploadProgress(100);
    } catch (err) {
      setErrorMessage(
        `Image processing error: ${err instanceof Error ? err.message : 'Could not decode image'}`
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Confirm photo upload & persist into UserProfile store
  const handleConfirmPhotoUpload = () => {
    if (!previewResult) return;

    setIsSaving(true);
    setUploadProgress(40);

    // Simulated network/storage latency for realistic feedback
    setTimeout(() => {
      setUploadProgress(100);
      onUpdateProfile({
        avatar: previewResult.dataUrl,
        photoStoragePath: `users/${userProfile.uid}/avatar/profile_${Date.now()}.webp`,
        photoUpdatedAt: Date.now()
      });
      setIsSaving(false);
      setIsUploadModalOpen(false);
      setSelectedFile(null);
      setPreviewResult(null);
      triggerSuccessToast('Profile photo updated and saved');
    }, 450);
  };

  // Cancel and discard photo upload preview
  const handleCancelPhotoUpload = () => {
    setIsUploadModalOpen(false);
    setSelectedFile(null);
    setPreviewResult(null);
    setErrorMessage(null);
  };

  // Remove photo and restore default initials avatar
  const handleRemovePhoto = () => {
    onUpdateProfile({
      avatar: '',
      photoStoragePath: undefined,
      photoUpdatedAt: undefined
    });
    setShowRemoveConfirm(false);
    triggerSuccessToast('Profile photo removed. Initial avatar restored.');
  };

  const accuracy =
    userProfile.quizStats.totalAnswered > 0
      ? Math.round(
          (userProfile.quizStats.totalCorrect / userProfile.quizStats.totalAnswered) * 100
        )
      : 0;

  return (
    <div className="space-y-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Hidden File Input with strictly accepted image types */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
        aria-label="Upload profile image"
      />

      {/* Floating Success Notification */}
      {successToast && (
        <div className="fixed top-20 right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="bg-[#173B63] dark:bg-[#132238] text-[#FFF8ED] px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-[#F07856]/40">
            <CheckCircle2 className="w-5 h-5 text-[#F07856]" />
            <span className="text-xs font-bold">{successToast}</span>
          </div>
        </div>
      )}

      {/* Student Profile Card */}
      <div
        className={`rounded-3xl border shadow-md p-6 sm:p-8 overflow-hidden relative transition-colors ${
          isDarkMode
            ? 'bg-[#132238] border-[#1E3A5F]'
            : 'bg-white border-[#E8F0F8]'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
            {/* User Avatar with Hover Upload Action */}
            <div className="relative group">
              <UserAvatar
                src={userProfile.avatar}
                name={userProfile.displayName}
                size="xl"
                levelBadge={userProfile.level}
                ringClassName="ring-4 ring-[#F07856]/40 shadow-lg"
              />

              {/* Upload Overlay Button */}
              <button
                onClick={handleOpenFileInput}
                className="absolute inset-0 rounded-full bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold cursor-pointer"
                title="Change or upload profile photo"
                aria-label="Change profile photo"
              >
                <Camera className="w-5 h-5 text-[#F07856] mb-0.5" />
                <span>Upload</span>
              </button>
            </div>

            <div>
              {!isEditing ? (
                <>
                  <div className="flex items-center gap-2">
                    <h1
                      className={`text-xl sm:text-2xl font-extrabold ${
                        isDarkMode ? 'text-[#FFF8ED]' : 'text-[#173B63]'
                      }`}
                    >
                      {userProfile.displayName}
                    </h1>
                    <button
                      onClick={() => setIsEditing(true)}
                      className={`p-1.5 rounded-lg transition ${
                        isDarkMode
                          ? 'text-[#E8F0F8]/50 hover:text-[#F07856] hover:bg-[#1E3A5F]'
                          : 'text-[#263238]/40 hover:text-[#F07856] hover:bg-[#FFF8ED]'
                      }`}
                      title="Edit Profile Info"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div
                    className={`text-xs sm:text-sm font-medium flex flex-wrap items-center gap-2 mt-1 ${
                      isDarkMode ? 'text-[#E8F0F8]/70' : 'text-[#263238]/70'
                    }`}
                  >
                    <span
                      className={`flex items-center gap-1 font-semibold ${
                        isDarkMode ? 'text-[#FFF8ED]' : 'text-[#173B63]'
                      }`}
                    >
                      <GraduationCap className="w-4 h-4 text-[#F07856]" />
                      {userProfile.university}
                    </span>
                    <span>•</span>
                    <span>
                      {userProfile.major} (Class of {userProfile.graduationYear})
                    </span>
                  </div>
                </>
              ) : (
                <div className="space-y-2 mt-1">
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className={`text-sm font-bold border rounded-xl px-3 py-1.5 w-full focus:outline-hidden focus:border-[#F07856] ${
                      isDarkMode
                        ? 'bg-[#0B192C] border-[#1E3A5F] text-[#FFF8ED]'
                        : 'bg-[#FFF8ED] border-[#E8F0F8] text-[#263238]'
                    }`}
                    placeholder={currentRole === 'admin' ? 'Prof. Dr. Anjali Sane' : 'Dev Purecha'}
                  />
                  <input
                    type="text"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    className={`text-xs border rounded-xl px-3 py-1.5 w-full focus:outline-hidden focus:border-[#F07856] ${
                      isDarkMode
                        ? 'bg-[#0B192C] border-[#1E3A5F] text-[#FFF8ED]'
                        : 'bg-[#FFF8ED] border-[#E8F0F8] text-[#263238]'
                    }`}
                    placeholder="University"
                  />
                  <input
                    type="text"
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                    className={`text-xs border rounded-xl px-3 py-1.5 w-full focus:outline-hidden focus:border-[#F07856] ${
                      isDarkMode
                        ? 'bg-[#0B192C] border-[#1E3A5F] text-[#FFF8ED]'
                        : 'bg-[#FFF8ED] border-[#E8F0F8] text-[#263238]'
                    }`}
                    placeholder="Academic Major"
                  />
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={handleSaveProfile}
                      className="px-3.5 py-1 rounded-xl bg-[#F07856] text-white text-xs font-bold flex items-center gap-1 shadow-xs hover:bg-[#D95D3B]"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Save Changes
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold ${
                        isDarkMode
                          ? 'text-[#E8F0F8]/70 hover:bg-[#1E3A5F]'
                          : 'text-[#263238]/70 hover:bg-[#E8F0F8]'
                      }`}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Photo Actions Bar */}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button
                  onClick={handleOpenFileInput}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F07856] text-white hover:bg-[#D95D3B] shadow-2xs transition"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>{userProfile.avatar ? 'Change Photo' : 'Upload Photo'}</span>
                </button>

                {userProfile.avatar && (
                  <button
                    onClick={() => setShowRemoveConfirm(true)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border transition ${
                      isDarkMode
                        ? 'border-[#1E3A5F] text-[#E8F0F8]/70 hover:text-[#DC2626] hover:bg-[#1E3A5F]'
                        : 'border-[#E8F0F8] text-[#263238]/70 hover:text-[#DC2626] hover:bg-[#FEE2E2]'
                    }`}
                    title="Remove photo and use initials avatar"
                  >
                    <Trash2 className="w-3 h-3 text-[#DC2626]" />
                    <span>Remove</span>
                  </button>
                )}

                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                    isDarkMode
                      ? 'bg-[#1E3A5F] text-[#FFF8ED] border-[#1E3A5F]'
                      : 'bg-[#E8F0F8] text-[#173B63] border-[#173B63]/10'
                  }`}
                >
                  <Crown className="w-3.5 h-3.5 text-[#F07856]" />
                  <span>
                    Level {userProfile.level}: {userProfile.levelTitle}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Level Progress Bar & Dark Theme Switcher */}
          <div className="flex flex-col gap-3 w-full sm:w-64">
            <div
              className={`p-4 rounded-2xl border ${
                isDarkMode
                  ? 'bg-[#0B192C] border-[#1E3A5F]'
                  : 'bg-[#FFF8ED] border-[#E8F0F8]'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                <span className={isDarkMode ? 'text-[#E8F0F8]' : 'text-[#173B63]'}>
                  Next Career Rank
                </span>
                <span className="text-[#F07856]">{levelProgress.percent}%</span>
              </div>
              <div
                className={`w-full h-2.5 rounded-full overflow-hidden ${
                  isDarkMode ? 'bg-[#132238]' : 'bg-[#E8F0F8]'
                }`}
              >
                <div
                  className="bg-[#F07856] h-full rounded-full transition-all duration-300"
                  style={{ width: `${levelProgress.percent}%` }}
                />
              </div>
              <div
                className={`mt-2 text-[11px] text-right ${
                  isDarkMode ? 'text-[#E8F0F8]/70' : 'text-[#263238]/70'
                }`}
              >
                {levelProgress.neededXp > 0
                  ? `${levelProgress.neededXp} XP to promotion`
                  : 'Highest Rank Reached!'}
              </div>
            </div>

            {/* In-page Dark/Light Theme Switcher Button */}
            {onToggleDarkMode && (
              <button
                onClick={onToggleDarkMode}
                className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-between transition focus:outline-hidden ${
                  isDarkMode
                    ? 'bg-[#1E3A5F] border-[#1E3A5F] text-[#FFF8ED] hover:bg-[#1E3A5F]/80'
                    : 'bg-[#E8F0F8] border-[#E8F0F8] text-[#173B63] hover:bg-[#E8F0F8]/80'
                }`}
              >
                <span className="flex items-center gap-2">
                  {isDarkMode ? (
                    <Sun className="w-4 h-4 text-[#F07856]" />
                  ) : (
                    <Moon className="w-4 h-4 text-[#173B63]" />
                  )}
                  <span>Theme Preference</span>
                </span>
                <span className="text-[#F07856] uppercase text-[10px] tracking-wider font-extrabold">
                  {isDarkMode ? 'Dark Active' : 'Light Active'}
                </span>
              </button>
            )}

            {/* Active Session Role Display */}
            <div
              className={`w-full py-2.5 px-3.5 rounded-xl border text-xs font-bold flex items-center justify-between ${
                currentRole === 'admin'
                  ? 'bg-[#E96746]/10 border-[#E96746]/30 text-[#E96746] dark:text-[#F07856]'
                  : isDarkMode
                  ? 'bg-[#0B192C] border-[#1E3A5F] text-[#FFF8ED]'
                  : 'bg-[#FFF8ED] border-[#EDE3D2] text-[#173B63]'
              }`}
              title="Active Role - Switching roles strictly requires signing out"
            >
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Active Role</span>
              </span>
              <span className="uppercase text-[10px] tracking-wider font-extrabold">
                {currentRole === 'admin' ? 'Faculty Admin' : 'College Scholar'}
              </span>
            </div>

            {/* Account Sign Out Button */}
            {onLogout && (
              <button
                onClick={onLogout}
                className={`w-full py-2.5 px-3.5 rounded-xl border text-xs font-bold transition flex items-center justify-between cursor-pointer border-rose-300 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40`}
                title="Sign out of your active FinLingo session"
              >
                <span className="flex items-center gap-2">
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out of Account</span>
                </span>
                <span className="text-[10px] opacity-80 underline">
                  {accountEmail || 'Sign Out'}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Remove Photo Confirmation Dialog */}
        {showRemoveConfirm && (
          <div
            className={`mt-4 p-4 rounded-2xl border flex items-center justify-between gap-3 text-xs ${
              isDarkMode
                ? 'bg-[#1E3A5F] border-[#DC2626]/40 text-[#FFF8ED]'
                : 'bg-[#FEE2E2] border-[#DC2626]/30 text-[#7F1D1D]'
            }`}
          >
            <span>
              Restore default avatar with initials ({displayName.slice(0, 2).toUpperCase()})?
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleRemovePhoto}
                className="px-3 py-1 bg-[#DC2626] text-white rounded-lg font-bold hover:bg-[#B91C1C]"
              >
                Yes, Remove
              </button>
              <button
                onClick={() => setShowRemoveConfirm(false)}
                className="px-2 py-1 font-semibold hover:underline"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Profile Photo Upload & Preview Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className={`w-full max-w-md rounded-3xl border shadow-2xl p-6 overflow-hidden relative ${
              isDarkMode
                ? 'bg-[#132238] border-[#1E3A5F] text-[#FFF8ED]'
                : 'bg-white border-[#E8F0F8] text-[#263238]'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E8F0F8]/30">
              <div className="flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-[#F07856]" />
                <h3
                  className={`font-black text-base ${
                    isDarkMode ? 'text-[#FFF8ED]' : 'text-[#173B63]'
                  }`}
                >
                  Profile Photo Preview
                </h3>
              </div>
              <button
                onClick={handleCancelPhotoUpload}
                className="p-1 rounded-full hover:bg-black/10 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Error Message */}
            {errorMessage ? (
              <div className="my-5 p-4 rounded-2xl bg-[#FEE2E2] border border-[#DC2626]/30 text-xs text-[#7F1D1D] flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#DC2626] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold">Validation Error</div>
                  <div>{errorMessage}</div>
                  <button
                    onClick={handleOpenFileInput}
                    className="mt-2 inline-flex items-center gap-1 font-bold text-[#DC2626] underline"
                  >
                    Select another image
                  </button>
                </div>
              </div>
            ) : isProcessing ? (
              /* Processing Spinner */
              <div className="py-12 flex flex-col items-center justify-center gap-3">
                <div className="w-10 h-10 border-4 border-[#F07856] border-t-transparent rounded-full animate-spin" />
                <div className="text-xs font-semibold">Validating and compressing photo...</div>
              </div>
            ) : previewResult ? (
              /* Interactive Preview Content */
              <div className="py-5 space-y-4">
                <div className="flex flex-col items-center justify-center">
                  <div className="relative w-36 h-36 rounded-full overflow-hidden ring-4 ring-[#F07856] shadow-xl">
                    <img
                      src={previewResult.dataUrl}
                      alt="Crop preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-[#F07856] mt-2 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Cropped 512x512 Circular Frame
                  </span>
                </div>

                {/* Compression Specs */}
                <div
                  className={`p-3.5 rounded-2xl border text-xs space-y-1.5 ${
                    isDarkMode
                      ? 'bg-[#0B192C] border-[#1E3A5F]'
                      : 'bg-[#FFF8ED] border-[#E8F0F8]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-neutral-500">Original Size:</span>
                    <span className="font-semibold">
                      {(previewResult.originalSizeBytes / 1024).toFixed(1)} KB
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-neutral-500">Optimized Size:</span>
                    <span className="font-bold text-[#16A34A]">
                      {(previewResult.optimizedSizeBytes / 1024).toFixed(1)} KB (
                      {previewResult.compressionRatio}% lighter)
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-neutral-500">Encoding:</span>
                    <span className="font-mono text-[10px] uppercase">
                      {previewResult.mimeType.replace('image/', '')}
                    </span>
                  </div>
                </div>

                {/* Upload Progress Bar (when saving) */}
                {isSaving && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-bold text-[#F07856]">
                      <span>Saving to Student Record...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-black/10 overflow-hidden">
                      <div
                        className="bg-[#F07856] h-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : null}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E8F0F8]/30">
              <button
                onClick={handleCancelPhotoUpload}
                disabled={isSaving}
                className="px-4 py-2 rounded-xl text-xs font-semibold hover:bg-black/10 transition"
              >
                Cancel
              </button>
              {previewResult && !errorMessage && (
                <button
                  onClick={handleConfirmPhotoUpload}
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-[#F07856] text-white text-xs font-bold hover:bg-[#D95D3B] shadow-md transition flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : 'Confirm & Save Photo'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Learning Statistics Grid */}
      <div>
        <h2
          className={`text-xl font-extrabold mb-4 ${
            isDarkMode ? 'text-[#FFF8ED]' : 'text-[#173B63]'
          }`}
        >
          Academic Learning Statistics
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            className={`p-5 rounded-2xl border shadow-2xs transition-colors ${
              isDarkMode
                ? 'bg-[#132238] border-[#1E3A5F]'
                : 'bg-white border-[#E8F0F8]'
            }`}
          >
            <div className="flex items-center justify-between text-[#263238]/60 dark:text-[#E8F0F8]/60 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Total XP</span>
              <Award className="w-4 h-4 text-[#F07856]" />
            </div>
            <div
              className={`text-2xl font-black ${
                isDarkMode ? 'text-[#FFF8ED]' : 'text-[#173B63]'
              }`}
            >
              {userProfile.currentXp}
            </div>
            <div
              className={`text-xs mt-1 ${
                isDarkMode ? 'text-[#E8F0F8]/70' : 'text-[#263238]/70'
              }`}
            >
              Experience Points
            </div>
          </div>

          <div
            className={`p-5 rounded-2xl border shadow-2xs transition-colors ${
              isDarkMode
                ? 'bg-[#132238] border-[#1E3A5F]'
                : 'bg-white border-[#E8F0F8]'
            }`}
          >
            <div className="flex items-center justify-between text-[#263238]/60 dark:text-[#E8F0F8]/60 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Study Streak</span>
              <Flame className="w-4 h-4 fill-[#F07856] text-[#F07856]" />
            </div>
            <div
              className={`text-2xl font-black ${
                isDarkMode ? 'text-[#FFF8ED]' : 'text-[#173B63]'
              }`}
            >
              {userProfile.streakDays} Days
            </div>
            <div
              className={`text-xs mt-1 ${
                isDarkMode ? 'text-[#E8F0F8]/70' : 'text-[#263238]/70'
              }`}
            >
              Consecutive Days
            </div>
          </div>

          <div
            className={`p-5 rounded-2xl border shadow-2xs transition-colors ${
              isDarkMode
                ? 'bg-[#132238] border-[#1E3A5F]'
                : 'bg-white border-[#E8F0F8]'
            }`}
          >
            <div className="flex items-center justify-between text-[#263238]/60 dark:text-[#E8F0F8]/60 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Accuracy</span>
              <Target className="w-4 h-4 text-[#F07856]" />
            </div>
            <div
              className={`text-2xl font-black ${
                isDarkMode ? 'text-[#FFF8ED]' : 'text-[#173B63]'
              }`}
            >
              {userProfile.quizStats.totalAnswered > 0 ? `${accuracy}%` : '0%'}
            </div>
            <div
              className={`text-xs mt-1 ${
                isDarkMode ? 'text-[#E8F0F8]/70' : 'text-[#263238]/70'
              }`}
            >
              {userProfile.quizStats.totalAnswered > 0
                ? `${userProfile.quizStats.totalCorrect}/${userProfile.quizStats.totalAnswered} Correct`
                : 'No attempts yet'}
            </div>
          </div>

          <div
            className={`p-5 rounded-2xl border shadow-2xs transition-colors ${
              isDarkMode
                ? 'bg-[#132238] border-[#1E3A5F]'
                : 'bg-white border-[#E8F0F8]'
            }`}
          >
            <div className="flex items-center justify-between text-[#263238]/60 dark:text-[#E8F0F8]/60 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Curriculum</span>
              <BookOpen className="w-4 h-4 text-[#F07856]" />
            </div>
            <div
              className={`text-2xl font-black ${
                isDarkMode ? 'text-[#FFF8ED]' : 'text-[#173B63]'
              }`}
            >
              {userProfile.completedLessonIds.length}
            </div>
            <div
              className={`text-xs mt-1 ${
                isDarkMode ? 'text-[#E8F0F8]/70' : 'text-[#263238]/70'
              }`}
            >
              Lessons Mastered
            </div>
          </div>
        </div>
      </div>

      {/* Track Mastery Progress */}
      <div
        className={`p-6 rounded-2xl border shadow-2xs space-y-4 transition-colors ${
          isDarkMode
            ? 'bg-[#132238] border-[#1E3A5F]'
            : 'bg-white border-[#E8F0F8]'
        }`}
      >
        <h3
          className={`font-extrabold text-base sm:text-lg ${
            isDarkMode ? 'text-[#FFF8ED]' : 'text-[#173B63]'
          }`}
        >
          Track Mastery Breakdown
        </h3>
        <div className="space-y-4">
          <div>
            <div
              className={`flex items-center justify-between text-xs font-semibold mb-1.5 ${
                isDarkMode ? 'text-[#E8F0F8]' : 'text-[#263238]'
              }`}
            >
              <span>Financial Accounting &amp; Reporting</span>
              <span className="font-extrabold text-[#F07856]">
                {userProfile.trackProgress.accounting}%
              </span>
            </div>
            <div
              className={`w-full h-2.5 rounded-full overflow-hidden ${
                isDarkMode ? 'bg-[#0B192C]' : 'bg-[#E8F0F8]'
              }`}
            >
              <div
                className="bg-[#F07856] h-full rounded-full transition-all duration-300"
                style={{ width: `${userProfile.trackProgress.accounting}%` }}
              />
            </div>
          </div>

          <div>
            <div
              className={`flex items-center justify-between text-xs font-semibold mb-1.5 ${
                isDarkMode ? 'text-[#E8F0F8]' : 'text-[#263238]'
              }`}
            >
              <span>Macro &amp; Microeconomics</span>
              <span className="font-extrabold text-[#F07856]">
                {userProfile.trackProgress.economics}%
              </span>
            </div>
            <div
              className={`w-full h-2.5 rounded-full overflow-hidden ${
                isDarkMode ? 'bg-[#0B192C]' : 'bg-[#E8F0F8]'
              }`}
            >
              <div
                className="bg-[#F07856] h-full rounded-full transition-all duration-300"
                style={{ width: `${userProfile.trackProgress.economics}%` }}
              />
            </div>
          </div>

          <div>
            <div
              className={`flex items-center justify-between text-xs font-semibold mb-1.5 ${
                isDarkMode ? 'text-[#E8F0F8]' : 'text-[#263238]'
              }`}
            >
              <span>Corporate Finance &amp; Valuation</span>
              <span className="font-extrabold text-[#F07856]">
                {userProfile.trackProgress.finance}%
              </span>
            </div>
            <div
              className={`w-full h-2.5 rounded-full overflow-hidden ${
                isDarkMode ? 'bg-[#0B192C]' : 'bg-[#E8F0F8]'
              }`}
            >
              <div
                className="bg-[#F07856] h-full rounded-full transition-all duration-300"
                style={{ width: `${userProfile.trackProgress.finance}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Achievements & Badges */}
      <div className="space-y-4">
        <h2
          className={`text-xl font-extrabold ${
            isDarkMode ? 'text-[#FFF8ED]' : 'text-[#173B63]'
          }`}
        >
          Achievements &amp; Honor Badges
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {userProfile.achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-4 rounded-2xl border transition-colors ${
                ach.isUnlocked
                  ? isDarkMode
                    ? 'bg-[#132238] border-[#F07856]/40 shadow-xs'
                    : 'bg-white border-[#FCE5DC] shadow-2xs'
                  : isDarkMode
                  ? 'bg-[#0B192C] border-[#1E3A5F] opacity-60'
                  : 'bg-[#FFF8ED] border-[#E8F0F8] opacity-60'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    ach.isUnlocked
                      ? 'bg-[#FCE5DC] text-[#F07856] shadow-xs'
                      : isDarkMode
                      ? 'bg-[#1E3A5F] text-[#E8F0F8]/40'
                      : 'bg-[#E8F0F8] text-[#263238]/40'
                  }`}
                >
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4
                    className={`font-bold text-sm leading-snug ${
                      isDarkMode ? 'text-[#FFF8ED]' : 'text-[#173B63]'
                    }`}
                  >
                    {ach.title}
                  </h4>
                  <p
                    className={`text-xs mt-0.5 leading-normal ${
                      isDarkMode ? 'text-[#E8F0F8]/70' : 'text-[#263238]/70'
                    }`}
                  >
                    {ach.description}
                  </p>
                  <span
                    className={`inline-block text-[10px] font-bold uppercase tracking-wider mt-2 px-2.5 py-0.5 rounded-md ${
                      ach.isUnlocked
                        ? 'bg-[#DCFCE7] text-[#14532D] border border-[#16A34A]/20'
                        : isDarkMode
                        ? 'bg-[#1E3A5F] text-[#E8F0F8]/60'
                        : 'bg-[#E8F0F8] text-[#263238]/60'
                    }`}
                  >
                    {ach.isUnlocked ? 'Unlocked ✓' : 'In Progress'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Statutory Data Rights & Privacy Controls (DPDPA 2023 & IT Act) */}
      <div
        className={`p-6 rounded-2xl border space-y-5 transition-colors ${
          isDarkMode
            ? 'bg-[#132238] border-[#1E3A5F]'
            : 'bg-white border-[#E8F0F8]'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#173B63] dark:bg-[#0B192C] text-white flex items-center justify-center flex-shrink-0 shadow-sm border border-[#F07856]/40">
              <Shield className="w-5 h-5 text-[#F07856]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3
                  className={`font-extrabold text-base sm:text-lg tracking-tight ${
                    isDarkMode ? 'text-[#FFF8ED]' : 'text-[#173B63]'
                  }`}
                >
                  Privacy Controls &amp; Statutory Data Rights
                </h3>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FCE5DC] text-[#F07856]">
                  DPDPA 2023
                </span>
              </div>
              <p
                className={`text-xs sm:text-sm mt-0.5 leading-relaxed ${
                  isDarkMode ? 'text-[#E8F0F8]/70' : 'text-[#263238]/70'
                }`}
              >
                Manage your personal data, anonymous leaderboard mode, machine-readable data portability, and statutory rights under Indian privacy laws.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onOpenLegalCenter('privacy')}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#173B63] dark:bg-[#1E3A5F] hover:bg-[#0F2742] text-white transition cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <FileText className="w-3.5 h-3.5 text-[#F07856]" />
              <span>Privacy Policy</span>
            </button>
            <button
              onClick={() => onOpenLegalCenter('data-rights')}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#F07856] hover:bg-[#D95D3B] text-white transition cursor-pointer flex items-center gap-1.5 shadow-sm shadow-[#F07856]/25"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Full Privacy Center</span>
            </button>
          </div>
        </div>

        {/* Live Privacy Toggles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* Toggle 1: Leaderboard Public Visibility */}
          <div
            className={`p-3.5 rounded-xl border flex flex-col justify-between gap-3 ${
              isDarkMode
                ? 'bg-[#0B192C]/80 border-[#1E3A5F]'
                : 'bg-[#FFF8ED]/80 border-[#E8F0F8]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span>Leaderboard Mode</span>
                {userProfile.privacySettings?.isLeaderboardPublic !== false ? (
                  <Eye className="w-3.5 h-3.5 text-[#16A34A]" />
                ) : (
                  <EyeOff className="w-3.5 h-3.5 text-[#F07856]" />
                )}
              </div>
              <p className="text-[11px] text-[#263238]/70 dark:text-[#E8F0F8]/70 leading-tight">
                {userProfile.privacySettings?.isLeaderboardPublic !== false
                  ? 'Your name & campus are visible on rankings.'
                  : 'Masked as "Anonymous Scholar".'}
              </p>
            </div>
            <button
              onClick={handleToggleLeaderboardPrivacy}
              className={`w-full py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                userProfile.privacySettings?.isLeaderboardPublic !== false
                  ? 'bg-white dark:bg-[#132238] text-[#173B63] dark:text-[#FFF8ED] border border-[#173B63]/20 dark:border-[#1E3A5F] hover:bg-[#E8F0F8]'
                  : 'bg-[#F07856] text-white hover:bg-[#D95D3B]'
              }`}
            >
              {userProfile.privacySettings?.isLeaderboardPublic !== false
                ? 'Enable Anonymous Mode'
                : 'Restore Public Ranking'}
            </button>
          </div>

          {/* Toggle 2: Photo Public Visibility */}
          <div
            className={`p-3.5 rounded-xl border flex flex-col justify-between gap-3 ${
              isDarkMode
                ? 'bg-[#0B192C]/80 border-[#1E3A5F]'
                : 'bg-[#FFF8ED]/80 border-[#E8F0F8]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span>Avatar Display</span>
                {userProfile.privacySettings?.showAvatarPublicly !== false ? (
                  <Eye className="w-3.5 h-3.5 text-[#16A34A]" />
                ) : (
                  <EyeOff className="w-3.5 h-3.5 text-[#F07856]" />
                )}
              </div>
              <p className="text-[11px] text-[#263238]/70 dark:text-[#E8F0F8]/70 leading-tight">
                {userProfile.privacySettings?.showAvatarPublicly !== false
                  ? 'Uploaded photo is shown to peers.'
                  : 'Photo is replaced with clean initials.'}
              </p>
            </div>
            <button
              onClick={handleToggleAvatarPrivacy}
              className={`w-full py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                userProfile.privacySettings?.showAvatarPublicly !== false
                  ? 'bg-white dark:bg-[#132238] text-[#173B63] dark:text-[#FFF8ED] border border-[#173B63]/20 dark:border-[#1E3A5F] hover:bg-[#E8F0F8]'
                  : 'bg-[#F07856] text-white hover:bg-[#D95D3B]'
              }`}
            >
              {userProfile.privacySettings?.showAvatarPublicly !== false
                ? 'Hide Photo from Peers'
                : 'Show Photo to Peers'}
            </button>
          </div>

          {/* Tool 3: Machine-Readable Export */}
          <div
            className={`p-3.5 rounded-xl border flex flex-col justify-between gap-3 ${
              isDarkMode
                ? 'bg-[#0B192C]/80 border-[#1E3A5F]'
                : 'bg-[#FFF8ED]/80 border-[#E8F0F8]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span>Data Portability</span>
                <Download className="w-3.5 h-3.5 text-[#F07856]" />
              </div>
              <p className="text-[11px] text-[#263238]/70 dark:text-[#E8F0F8]/70 leading-tight">
                Export all local records, quiz scores, and memory deck as structured JSON.
              </p>
            </div>
            <button
              onClick={handleExportData}
              className="w-full py-1.5 rounded-lg text-xs font-bold bg-[#173B63] dark:bg-[#1E3A5F] text-white hover:bg-[#0F2742] transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Download className="w-3 h-3 text-[#F07856]" />
              <span>Export JSON File</span>
            </button>
          </div>
        </div>

        {/* Quick Statutory Link Pill Strip */}
        <div className="flex flex-wrap items-center gap-2 pt-2 text-xs border-t border-[#E8F0F8] dark:border-[#1E3A5F]">
          <span className="text-[#263238]/60 dark:text-[#E8F0F8]/60 text-[11px] font-semibold">
            Statutory Notices:
          </span>
          <button
            onClick={() => onOpenLegalCenter('disclaimer')}
            className="text-[#F07856] hover:underline font-bold text-[11px] flex items-center gap-1 cursor-pointer"
          >
            <Scale className="w-3 h-3" />
            <span>SEBI Non-Advisory Notice</span>
          </button>
          <span>•</span>
          <button
            onClick={() => onOpenLegalCenter('cookies')}
            className="text-[#F07856] hover:underline font-bold text-[11px] flex items-center gap-1 cursor-pointer"
          >
            <span>LocalStorage Manifest</span>
          </button>
          <span>•</span>
          <button
            onClick={() => onOpenLegalCenter('grievance')}
            className="text-[#F07856] hover:underline font-bold text-[11px] flex items-center gap-1 cursor-pointer"
          >
            <span>Designated Grievance Officer</span>
          </button>
        </div>

        {/* Affirmative Consent Audit Trail / Record */}
        <div
          className={`p-3.5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
            userProfile.consentRecord?.termsAccepted
              ? isDarkMode
                ? 'bg-[#16A34A]/10 border-[#16A34A]/30 text-[#E8F0F8]'
                : 'bg-[#16A34A]/5 border-[#16A34A]/20 text-[#173B63]'
              : isDarkMode
              ? 'bg-[#F07856]/10 border-[#F07856]/30 text-[#FFF8ED]'
              : 'bg-[#FFF8ED] border-[#F07856]/30 text-[#263238]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <CheckCircle2
              className={`w-4 h-4 flex-shrink-0 ${
                userProfile.consentRecord?.termsAccepted ? 'text-[#16A34A]' : 'text-[#F07856]'
              }`}
            />
            <div>
              <div className="text-xs font-bold">
                {userProfile.consentRecord?.termsAccepted
                  ? `Statutory Consent Recorded: ${userProfile.consentRecord.termsVersion}`
                  : 'Statutory Consent Pending Review'}
              </div>
              <div className="text-[11px] opacity-75">
                {userProfile.consentRecord?.termsAccepted
                  ? `Recorded on ${new Date(
                      userProfile.consentRecord.timestamp
                    ).toLocaleDateString()} at ${new Date(
                      userProfile.consentRecord.timestamp
                    ).toLocaleTimeString()} (Marketing Opt-In: ${
                      userProfile.consentRecord.marketingOptIn ? 'Yes' : 'No - Unbundled'
                    })`
                  : 'Digital Personal Data Protection Act, 2023 requires affirmative confirmation before processing.'}
              </div>
            </div>
          </div>
          {onOpenConsentModal && (
            <button
              onClick={onOpenConsentModal}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#173B63] dark:bg-[#1E3A5F] text-white hover:bg-[#0F2742] transition cursor-pointer flex-shrink-0"
            >
              {userProfile.consentRecord?.termsAccepted ? 'Review / Update Consent' : 'Record Consent'}
            </button>
          )}
        </div>
      </div>

      {/* 13+ Age Eligibility Verification Card (Mandatory Requirement) */}
      <div
        className={`p-6 rounded-2xl border space-y-4 transition-colors ${
          isDarkMode
            ? 'bg-[#132238] border-[#1E3A5F]'
            : 'bg-white border-[#E8F0F8]'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3
              className={`font-extrabold text-sm sm:text-base flex items-center gap-2 ${
                isDarkMode ? 'text-[#FFF8ED]' : 'text-[#173B63]'
              }`}
            >
              <Shield className="w-4 h-4 text-[#E96746] dark:text-[#F07856]" />
              <span>Age Eligibility (13+ Gate)</span>
            </h3>
            <p
              className={`text-xs sm:text-sm mt-0.5 ${
                isDarkMode ? 'text-[#E8F0F8]/70' : 'text-[#263238]/70'
              }`}
            >
              Academic digital safety standard: FinLingo is strictly restricted to users aged 13 and older. Full date of birth or government IDs are never collected.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {activeRole === 'admin' ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Faculty Admin (Exempt)</span>
              </span>
            ) : eligibilityRecord.isConfirmed ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>13+ eligibility confirmed</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Not confirmed</span>
              </span>
            )}
          </div>
        </div>

        <div
          className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs ${
            isDarkMode ? 'bg-[#0B1728]/50 border-[#1E324F]' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div>
            <div className="font-semibold">
              Status for {userProfile.displayName} ({activeEmail}):
            </div>
            <div className="opacity-75 text-[11px] mt-0.5">
              {activeRole === 'admin'
                ? 'Faculty Administrator account is verified through institutional academic governance. Exempt from student age verification.'
                : eligibilityRecord.isConfirmed
                ? `Confirmed on ${new Date(eligibilityRecord.confirmedAt || Date.now()).toLocaleDateString()} • Student Scholar Account`
                : 'Pending affirmative 13+ confirmation.'}
            </div>
          </div>

          {activeRole !== 'admin' && eligibilityRecord.isConfirmed && (
            <button
              type="button"
              onClick={() => setShowRevokeAgeConfirm(true)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 border border-rose-500/30 hover:bg-rose-500/10 transition cursor-pointer shrink-0"
            >
              Revoke 13+ Confirmation
            </button>
          )}
        </div>

        {showRevokeAgeConfirm && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-700 dark:text-rose-300 space-y-3 animate-in fade-in duration-200">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block">Revoke Age Eligibility Confirmation?</strong>
                <span>
                  Revoking your age confirmation will immediately lock out access to all educational modules, quizzes, spaced review, and profile content until 13+ eligibility is re-confirmed.
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowRevokeAgeConfirm(false)}
                className="px-3 py-1 rounded-lg border font-semibold hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRevokeEligibility}
                className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer transition"
              >
                Yes, Revoke Confirmation
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Account Security & Password Management (Requirements 2 & 3) */}
      <div
        className={`p-6 rounded-2xl border space-y-4 transition-colors ${
          isDarkMode
            ? 'bg-[#132238] border-[#1E3A5F]'
            : 'bg-white border-[#E8F0F8]'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3
              className={`font-extrabold text-sm sm:text-base flex items-center gap-2 ${
                isDarkMode ? 'text-[#FFF8ED]' : 'text-[#173B63]'
              }`}
            >
              <Lock className="w-4 h-4 text-[#E96746] dark:text-[#F07856]" />
              <span>Account Security &amp; Password Management</span>
            </h3>
            <p
              className={`text-xs sm:text-sm mt-0.5 ${
                isDarkMode ? 'text-[#E8F0F8]/70' : 'text-[#263238]/70'
              }`}
            >
              Account Email: <strong className="font-mono text-[#E96746] dark:text-[#F07856]">{accountEmail || (currentRole === 'admin' ? 'admin@finlingo.local' : 'learner@finlingo.local')}</strong> • Protected via Web Crypto PBKDF2 (100k rounds)
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsPasswordSectionOpen(!isPasswordSectionOpen);
              setPasswordChangeStatus(null);
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#E96746] hover:bg-[#D45333] dark:bg-[#F07856] dark:hover:bg-[#D95D3B] text-white shadow-xs transition cursor-pointer self-start sm:self-auto flex items-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{isPasswordSectionOpen ? 'Close Password Form' : 'Change Password'}</span>
          </button>
        </div>

        {isPasswordSectionOpen && (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!passwordValidation.isValid || !passwordsMatch) return;
              setIsSubmittingPassword(true);
              setPasswordChangeStatus(null);
              try {
                const targetEmail = accountEmail || (currentRole === 'admin' ? 'admin@finlingo.local' : 'learner@finlingo.local');
                const result = await authService.changePassword(targetEmail, newPasswordInput);
                if (result.success) {
                  setPasswordChangeStatus({
                    type: 'success',
                    message: 'Password updated successfully! Your account credentials and session have been refreshed.'
                  });
                  setNewPasswordInput('');
                  setConfirmPasswordInput('');
                } else {
                  setPasswordChangeStatus({
                    type: 'error',
                    message: result.error || 'Failed to update password.'
                  });
                }
              } catch {
                setPasswordChangeStatus({
                  type: 'error',
                  message: 'An error occurred while updating the password.'
                });
              } finally {
                setIsSubmittingPassword(false);
              }
            }}
            className="p-4 sm:p-5 rounded-2xl border space-y-4 bg-black/5 dark:bg-[#0B1728] border-[#EDE3D2] dark:border-[#1E324F] animate-in fade-in duration-200"
          >
            {passwordChangeStatus && (
              <div
                className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 ${
                  passwordChangeStatus.type === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'
                }`}
              >
                {passwordChangeStatus.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                )}
                <span>{passwordChangeStatus.message}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* New Password */}
              <div>
                <label className={`text-xs font-bold block mb-1.5 ${isDarkMode ? 'text-[#FFF8ED]' : 'text-[#263238]'}`}>
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 opacity-50" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    required
                    placeholder="Enter new password"
                    className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#E96746] transition ${
                      isDarkMode ? 'bg-[#12233A] border-[#1E324F] text-[#FFF8ED]' : 'bg-white border-[#EDE3D2] text-[#263238]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 opacity-70 hover:opacity-100 cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className={`text-xs font-bold block mb-1.5 ${isDarkMode ? 'text-[#FFF8ED]' : 'text-[#263238]'}`}>
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 opacity-50" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPasswordInput}
                    onChange={(e) => setConfirmPasswordInput(e.target.value)}
                    required
                    placeholder="Confirm new password"
                    className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#E96746] transition ${
                      isDarkMode ? 'bg-[#12233A] border-[#1E324F] text-[#FFF8ED]' : 'bg-white border-[#EDE3D2] text-[#263238]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 opacity-70 hover:opacity-100 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Password Match Status */}
            {confirmPasswordInput.length > 0 && (
              <div className="flex items-center gap-1.5 text-xs font-semibold">
                {passwordsMatch ? (
                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Passwords match</span>
                  </span>
                ) : (
                  <span className="text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Passwords do not match</span>
                  </span>
                )}
              </div>
            )}

            {/* Dynamic Strength Indicator & 5 Requirement Checks */}
            <div className={`p-4 rounded-xl border space-y-3 ${isDarkMode ? 'bg-[#12233A] border-[#1E324F]' : 'bg-white border-[#EDE3D2]'}`}>
              <div className="flex items-center justify-between text-xs font-bold">
                <span>Password Strength:</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-black ${
                    passwordValidation.strength === 'Strong'
                      ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                      : passwordValidation.strength === 'Medium'
                      ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                      : 'bg-rose-500/20 text-rose-500'
                  }`}
                >
                  {passwordValidation.strength}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 rounded-full ${
                    passwordValidation.strength === 'Strong'
                      ? 'bg-emerald-500'
                      : passwordValidation.strength === 'Medium'
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${passwordValidation.score}%` }}
                />
              </div>

              {/* 5 Requirements Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                {passwordValidation.checks.map((req) => (
                  <div
                    key={req.id}
                    className={`flex items-center gap-2 text-xs transition-colors ${
                      req.met
                        ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                        : isDarkMode
                        ? 'text-[#C1CDDC]/60'
                        : 'text-[#52647A]'
                    }`}
                  >
                    {req.met ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-slate-400 shrink-0" />
                    )}
                    <span>{req.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setIsPasswordSectionOpen(false);
                  setNewPasswordInput('');
                  setConfirmPasswordInput('');
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold border transition cursor-pointer hover:bg-black/5 dark:hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmittingPassword || !passwordValidation.isValid || !passwordsMatch}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#E96746] hover:bg-[#D45333] transition cursor-pointer shadow-xs disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{isSubmittingPassword ? 'Saving Password...' : 'Save New Password'}</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Local Storage Data Architecture & Persistence Card */}
      <div
        className={`p-6 rounded-2xl border space-y-4 transition-colors ${
          isDarkMode
            ? 'bg-[#132238] border-[#1E3A5F]'
            : 'bg-white border-[#E8F0F8]'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3
              className={`font-extrabold text-sm sm:text-base flex items-center gap-2 ${
                isDarkMode ? 'text-[#FFF8ED]' : 'text-[#173B63]'
              }`}
            >
              <Database className="w-4 h-4 text-[#F07856]" />
              <span>Data Architecture &amp; Local Persistence</span>
            </h3>
            <p
              className={`text-xs sm:text-sm mt-0.5 ${
                isDarkMode ? 'text-[#E8F0F8]/70' : 'text-[#263238]/70'
              }`}
            >
              {currentRole === 'admin'
                ? 'Operating on local browser storage with instant persistence. Restore to default admin settings anytime.'
                : 'Operating on local browser storage with instant persistence. Learning progress, quiz records, and study streaks are saved securely.'}
            </p>
          </div>

          {currentRole === 'admin' && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowResetConfirm(true)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#DC2626] hover:bg-[#FEE2E2] border border-[#DC2626]/20 transition flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restore Admin Profile Defaults</span>
              </button>
            </div>
          )}
        </div>

        {currentRole === 'admin' && showResetConfirm && (
          <div className="p-4 rounded-xl bg-[#FEE2E2] border border-[#DC2626]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#7F1D1D]">
            <span>
              Restore Admin profile and administrative settings to defaults? (Dev Purecha's learning progress, XP, and streaks will NOT be affected).
            </span>
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              <button
                onClick={() => {
                  onResetData();
                  setShowResetConfirm(false);
                }}
                className="px-3 py-1 bg-[#DC2626] text-white rounded-lg font-bold hover:bg-[#B91C1C]"
              >
                Yes, Reset
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-2 py-1 text-[#263238]/70 font-semibold hover:underline"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
