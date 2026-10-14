/**
 * Image Validation and Processing Utility
 * Ensures secure client-side validation of file formats, file sizes, and magic byte headers,
 * along with client-side canvas-based resizing and compression.
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  file?: File;
}

export const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

/**
 * Validates the file using both MIME check and binary magic bytes.
 */
export async function validateImageFile(file: File): Promise<ValidationResult> {
  // 1. Basic file size check
  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      isValid: false,
      error: `File is too large (${sizeInMb} MB). Maximum permitted file size is 5 MB.`
    };
  }

  // 2. MIME type check
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: `Unsupported file format (${file.type || 'unknown'}). Please upload a JPEG, PNG, or WebP image.`
    };
  }

  // 3. Binary magic bytes inspection
  try {
    const buffer = await file.slice(0, 16).arrayBuffer();
    const bytes = new Uint8Array(buffer);

    const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
    const isPng =
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47;
    const isWebp =
      bytes[0] === 0x52 && // R
      bytes[1] === 0x49 && // I
      bytes[2] === 0x46 && // F
      bytes[3] === 0x46 && // F
      bytes[8] === 0x57 && // W
      bytes[9] === 0x45 && // E
      bytes[10] === 0x42 && // B
      bytes[11] === 0x50; // P

    if (!isJpeg && !isPng && !isWebp) {
      return {
        isValid: false,
        error: 'Security verification failed: File contents do not match a valid JPEG, PNG, or WebP image header.'
      };
    }
  } catch {
    return {
      isValid: false,
      error: 'Unable to read file headers. Please select a valid image file.'
    };
  }

  return { isValid: true, file };
}

/**
 * Resizes and compresses an image to max 512x512 pixels with high visual fidelity.
 * Returns a clean, web-ready data URL or Blob.
 */
export function resizeAndCompressImage(
  file: File,
  maxDimension = 512,
  quality = 0.88
): Promise<{ dataUrl: string; width: number; height: number; sizeBytes: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error('Failed to read file from disk.'));

    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to decode image data. Corrupted or unsupported file.'));

      img.onload = () => {
        // Compute scaled dimensions maintaining aspect ratio
        let targetWidth = img.width;
        let targetHeight = img.height;

        if (targetWidth > maxDimension || targetHeight > maxDimension) {
          if (targetWidth > targetHeight) {
            targetHeight = Math.round((targetHeight * maxDimension) / targetWidth);
            targetWidth = maxDimension;
          } else {
            targetWidth = Math.round((targetWidth * maxDimension) / targetHeight);
            targetHeight = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Canvas 2D rendering context unavailable.'));
          return;
        }

        // High quality smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        // Prefer WebP if supported, fallback to JPEG
        let dataUrl: string;
        try {
          dataUrl = canvas.toDataURL('image/webp', quality);
          if (!dataUrl.startsWith('data:image/webp')) {
            dataUrl = canvas.toDataURL('image/jpeg', quality);
          }
        } catch {
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        // Approximate size in bytes from base64
        const stringLength = dataUrl.length - 'data:image/webp;base64,'.length;
        const sizeBytes = Math.round((stringLength * 3) / 4);

        resolve({
          dataUrl,
          width: targetWidth,
          height: targetHeight,
          sizeBytes
        });
      };

      img.src = reader.result as string;
    };

    reader.readAsDataURL(file);
  });
}
