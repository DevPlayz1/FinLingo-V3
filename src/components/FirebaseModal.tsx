import React from 'react';
import {
  X,
  Database,
  ShieldCheck,
  CheckCircle2,
  Layers,
  Code,
  Image as ImageIcon
} from 'lucide-react';

interface FirebaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FirebaseModal: React.FC<FirebaseModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="relative bg-[#FFF8ED] dark:bg-[#132238] w-full max-w-2xl rounded-3xl shadow-2xl border border-[#E8F0F8] dark:border-[#1E3A5F] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header in Deep Educational Blue */}
        <div className="p-6 bg-[#173B63] dark:bg-[#0B192C] text-white flex items-center justify-between border-b border-[#173B63] dark:border-[#1E3A5F]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#F07856]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-[#FFF8ED]">
                FinLingo Backend Architecture
              </h2>
              <p className="text-xs text-[#E8F0F8]">
                Clean Repository Pattern Ready for Firebase Auth, Cloud Firestore &amp; Storage
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#FFF8ED] transition focus:outline-hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-[#263238] dark:text-[#FFF8ED] text-sm bg-[#FFF8ED] dark:bg-[#132238]">
          {/* Current Status Notice */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#0B192C] border border-[#E8F0F8] dark:border-[#1E3A5F] shadow-2xs">
            <div className="flex items-center gap-2 font-bold mb-1 text-[#173B63] dark:text-[#FFF8ED]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] animate-pulse" />
              <span>Current Status: Structured Client Storage &amp; Canvas Optimization Active</span>
            </div>
            <p className="text-xs text-[#263238]/80 dark:text-[#E8F0F8]/80 leading-relaxed">
              All UI controls, quizzes, profile photo uploads with binary magic byte validation, canvas compression, and spaced repetition loops are 100% operational. The application cleanly decouples views from storage via{' '}
              <code className="bg-[#E8F0F8] dark:bg-[#1E3A5F] text-[#173B63] dark:text-[#F07856] px-1.5 py-0.5 rounded font-mono text-xs">
                src/services/dataService.ts
              </code>.
            </p>
          </div>

          {/* Profile Photo & Firebase Storage Blueprint */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0B192C] border border-[#E8F0F8] dark:border-[#1E3A5F] shadow-2xs space-y-3">
            <h3 className="font-extrabold text-[#173B63] dark:text-[#FFF8ED] text-base flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#F07856]" />
              Profile Photo &amp; Firebase Storage Architecture
            </h3>
            <p className="text-xs text-[#263238]/80 dark:text-[#E8F0F8]/80 leading-relaxed">
              Uploaded photos undergo client-side validation (<strong className="text-[#F07856]">&lt; 5MB</strong>, JPEG/PNG/WebP, header magic bytes verification) and HTML5 canvas compression before persistence.
            </p>
            <div className="p-3.5 rounded-xl bg-[#0B192C] text-[#E8F0F8] font-mono text-xs space-y-1 border border-[#1E3A5F]">
              <div className="text-[#F07856] font-bold">// Firebase Storage Security Rules:</div>
              <div>match /users/{'{uid}'}/avatar/{'{fileName}'} {'{'}</div>
              <div className="pl-4 text-[#16A34A]">allow read: if true;</div>
              <div className="pl-4 text-[#16A34A]">
                allow write, delete: if request.auth != null &amp;&amp; request.auth.uid == uid
              </div>
              <div className="pl-8 text-neutral-400">
                &amp;&amp; request.resource.size &lt; 5 * 1024 * 1024
              </div>
              <div className="pl-8 text-neutral-400">
                &amp;&amp; request.resource.contentType.matches('image/(jpeg|png|webp)');
              </div>
              <div>{'}'}</div>
            </div>
          </div>

          {/* Firestore Collections Blueprint */}
          <div className="p-5 rounded-2xl bg-[#173B63] dark:bg-[#0B192C] text-[#FFF8ED] shadow-inner space-y-2 border border-[#173B63] dark:border-[#1E3A5F]">
            <h3 className="font-extrabold text-[#FFF8ED] text-base flex items-center gap-2">
              <Code className="w-4 h-4 text-[#F07856]" />
              Target Cloud Firestore Collection Schema
            </h3>
            <div className="font-mono text-xs space-y-1.5 overflow-x-auto text-[#E8F0F8] pt-2">
              <div>
                <span className="text-[#F07856]">/users/{'{uid}'}</span>{' '}
                <span className="text-[#E8F0F8]/70">
                  // UserProfile (XP, level, streak, university, avatar, photoStoragePath)
                </span>
              </div>
              <div>
                <span className="text-[#F07856]">/users/{'{uid}'}/spaced_repetition/{'{id}'}</span>{' '}
                <span className="text-[#E8F0F8]/70">// Interval stages 0-3</span>
              </div>
              <div>
                <span className="text-[#F07856]">/learning_tracks/{'{trackId}'}</span>{' '}
                <span className="text-[#E8F0F8]/70">// Accounting, Economics, Finance</span>
              </div>
              <div>
                <span className="text-[#F07856]">/lessons/{'{lessonId}'}</span>{' '}
                <span className="text-[#E8F0F8]/70">// Financial terms, cases, formulas</span>
              </div>
              <div>
                <span className="text-[#F07856]">/quizzes/{'{quizId}'}</span>{' '}
                <span className="text-[#E8F0F8]/70">// MCQ questions &amp; explanations</span>
              </div>
              <div>
                <span className="text-[#F07856]">/leaderboards/weekly</span>{' '}
                <span className="text-[#E8F0F8]/70">// Collegiate student rankings</span>
              </div>
            </div>
          </div>

          {/* Security Standards */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#0B192C] border border-[#E8F0F8] dark:border-[#1E3A5F] text-xs text-[#263238] dark:text-[#E8F0F8] space-y-1 shadow-2xs">
            <div className="flex items-center gap-1.5 font-bold text-[#173B63] dark:text-[#FFF8ED]">
              <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
              <span>Security &amp; Privacy Discipline</span>
            </div>
            <p className="leading-relaxed">
              No private credentials or passwords are leaked in client code. User uploads are sandboxed to the user's isolated document and validated for authenticity.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white dark:bg-[#0B192C] border-t border-[#E8F0F8] dark:border-[#1E3A5F] flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#F07856] hover:bg-[#D95D3B] text-white transition shadow-sm"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
