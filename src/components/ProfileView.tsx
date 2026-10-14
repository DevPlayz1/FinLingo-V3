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
  Lock
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

interface ProfileViewProps {
  userProfile: UserProfile;
  currentRole?: UserRole;
  onOpenRoleSelection?: () => void;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onResetData: () => void;
  onOpenFirebaseModal: () => void;
  onOpenLegalCenter: (docId?: LegalDocId) => void;
  onOpenConsentModal?: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  userProfile,
  currentRole,
  onOpenRoleSelection,
  onUpdateProfile,
  onResetData,
  onOpenFirebaseModal,
  onOpenLegalCenter,
  onOpenConsentModal,
  isDarkMode = false,
  onToggleDarkMode
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(userProfile.displayName);
  const [university, setUniversity] = useState(userProfile.university);
  const [major, setMajor] = useState(userProfile.major);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

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
      : 100;

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
                    placeholder="Student Scholar Name"
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

            {/* Demo Role Switcher */}
            {onOpenRoleSelection && (
              <button
                onClick={onOpenRoleSelection}
                className={`w-full py-2.5 px-3.5 rounded-xl border text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                  currentRole === 'admin'
                    ? 'bg-[#E96746] text-white border-[#E96746] shadow-2xs'
                    : isDarkMode
                    ? 'bg-[#0B192C] border-[#1E3A5F] text-[#FFF8ED] hover:bg-[#132238]'
                    : 'bg-[#FFF8ED] border-[#E8F0F8] text-[#173B63] hover:bg-white'
                }`}
                title="Switch between College Scholar (User) and Academic Admin roles"
              >
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>Demo Role Access</span>
                </span>
                <span className="uppercase text-[10px] tracking-wider font-extrabold underline">
                  {currentRole === 'admin' ? 'Admin Active' : 'Student Active'}
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
              {accuracy}%
            </div>
            <div
              className={`text-xs mt-1 ${
                isDarkMode ? 'text-[#E8F0F8]/70' : 'text-[#263238]/70'
              }`}
            >
              {userProfile.quizStats.totalCorrect}/{userProfile.quizStats.totalAnswered} Correct
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

      {/* System Settings & Firebase Schema Preview Card */}
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
              <span>Data Architecture &amp; Persistence</span>
            </h3>
            <p
              className={`text-xs sm:text-sm mt-0.5 ${
                isDarkMode ? 'text-[#E8F0F8]/70' : 'text-[#263238]/70'
              }`}
            >
              Operating on the canonical sample dataset with instant local persistence. Restore to pristine sample data anytime.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenFirebaseModal}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#173B63] dark:bg-[#1E3A5F] hover:bg-[#0F2742] text-white shadow-xs transition cursor-pointer"
            >
              View Backend Schema
            </button>
            <button
              onClick={() => setShowResetConfirm(true)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#DC2626] hover:bg-[#FEE2E2] border border-[#DC2626]/20 transition flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>
                {currentRole === 'admin'
                  ? 'Restore Admin Profile Defaults'
                  : 'Restore Scholar Progress Defaults'}
              </span>
            </button>
          </div>
        </div>

        {showResetConfirm && (
          <div className="p-4 rounded-xl bg-[#FEE2E2] border border-[#DC2626]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#7F1D1D]">
            <span>
              {currentRole === 'admin'
                ? 'Restore Admin profile and administrative settings to defaults? (Student Scholar learning progress, XP, and streaks will NOT be affected).'
                : 'Restore your student profile, XP, quiz records, and streaks to defaults? (Admin curriculum settings will NOT be affected).'}
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
