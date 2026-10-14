/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Image validation, magic bytes verification, and client-side optimization
 * for FinLingo student profile photos.
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  detectedType?: string;
  originalSize?: number;
}

export interface OptimizedImageResult {
  dataUrl: string;
  mimeType: string;
  originalSizeBytes: number;
  optimizedSizeBytes: number;
  compressionRatio: number;
  width: number;
  height: number;
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB limit
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * Validates file size and inspects file magic bytes (headers) to prevent MIME spoofing.
 */
export async function validateImageFile(file: File): Promise<ValidationResult> {
  // 1. Size check
  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(2);
    return {
      isValid: false,
      error: `File size (${sizeInMb} MB) exceeds the 5 MB maximum limit. Please select a smaller photo.`,
      originalSize: file.size
    };
  }

  // 2. Client MIME check
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: 'Unsupported file format. Please upload a JPEG (.jpg, .jpeg), PNG (.png), or WebP (.webp) photo.',
      originalSize: file.size
    };
  }

  // 3. Inspect binary magic bytes to guarantee file authenticity
  try {
    const sliceBuffer = await file.slice(0, 16).arrayBuffer();
    const bytes = new Uint8Array(sliceBuffer);

    // JPEG signature: FF D8 FF
    const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;

    // PNG signature: 89 50 4E 47 0D 0A 1A 0A
    const isPng =
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47 &&
      bytes[4] === 0x0d &&
      bytes[5] === 0x0a &&
      bytes[6] === 0x1a &&
      bytes[7] === 0x0a;

    // WebP signature: RIFF .... WEBP
    const isWebp =
      bytes[0] === 0x52 &&
      bytes[1] === 0x49 &&
      bytes[2] === 0x46 &&
      bytes[3] === 0x46 &&
      bytes[8] === 0x57 &&
      bytes[9] === 0x45 &&
      bytes[10] === 0x42 &&
      bytes[11] === 0x50;

    if (!isJpeg && !isPng && !isWebp) {
      return {
        isValid: false,
        error: 'File signature does not match a valid JPEG, PNG, or WebP image. Corrupted or invalid files are rejected.',
        originalSize: file.size
      };
    }

    const detectedType = isJpeg ? 'image/jpeg' : isPng ? 'image/png' : 'image/webp';
    return {
      isValid: true,
      detectedType,
      originalSize: file.size
    };
  } catch (err) {
    return {
      isValid: false,
      error: `Could not inspect file contents: ${err instanceof Error ? err.message : 'Unknown read error'}`,
      originalSize: file.size
    };
  }
}

/**
 * Resizes and compresses user profile images to a balanced 512x512 square frame
 * to guarantee optimal rendering performance and prevent storage bloat.
 */
export async function optimizeProfileImage(
  file: File,
  targetDimension = 512,
  quality = 0.88
): Promise<OptimizedImageResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file into memory.'));

    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to decode image data into browser canvas.'));

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = targetDimension;
          canvas.height = targetDimension;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Could not initialize 2D canvas context.'));
            return;
          }

          // Crop and center: cover algorithm for 1:1 circular aspect ratio
          const minDim = Math.min(img.width, img.height);
          const sourceX = (img.width - minDim) / 2;
          const sourceY = (img.height - minDim) / 2;

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          ctx.drawImage(
            img,
            sourceX,
            sourceY,
            minDim,
            minDim,
            0,
            0,
            targetDimension,
            targetDimension
          );

          // Prefer WebP with JPEG fallback
          let outputMime = 'image/webp';
          let dataUrl = canvas.toDataURL('image/webp', quality);
          if (!dataUrl.startsWith('data:image/webp')) {
            outputMime = 'image/jpeg';
            dataUrl = canvas.toDataURL('image/jpeg', quality);
          }

          // Calculate approximate byte size of base64
          const base64Data = dataUrl.split(',')[1] || '';
          const optimizedSizeBytes = Math.round((base64Data.length * 3) / 4);

          resolve({
            dataUrl,
            mimeType: outputMime,
            originalSizeBytes: file.size,
            optimizedSizeBytes,
            compressionRatio: Math.round((1 - optimizedSizeBytes / file.size) * 100),
            width: targetDimension,
            height: targetDimension
          });
        } catch (e) {
          reject(e);
        }
      };

      img.src = readerEvent.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Extracts initials from a display name (e.g., "Student Scholar" -> "SS", "John" -> "J").
 */
export function getInitials(name?: string): string {
  if (!name || !name.trim()) return 'FS'; // FinLingo Student
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Returns a stable, harmonious color background for the initials avatar.
 */
export function getInitialsColor(name?: string): { bg: string; text: string; border: string } {
  const palette = [
    { bg: 'bg-[#173B63]', text: 'text-[#FFF8ED]', border: 'border-[#F07856]/40' },
    { bg: 'bg-[#F07856]', text: 'text-white', border: 'border-white/30' },
    { bg: 'bg-[#1E3A5F]', text: 'text-[#FFF8ED]', border: 'border-[#F07856]/30' },
    { bg: 'bg-[#D95D3B]', text: 'text-[#FFF8ED]', border: 'border-white/40' },
    { bg: 'bg-[#0B192C]', text: 'text-[#FFF8ED]', border: 'border-[#F07856]/50' }
  ];

  if (!name) return palette[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % palette.length;
  return palette[index];
}
