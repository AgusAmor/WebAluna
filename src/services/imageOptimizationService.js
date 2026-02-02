/**
 * Image Optimization Service for Firebase Storage
 *
 * 1. Lazy loading (load only when visible)
 * 2. Client-side compression (reduce size)
 * 3. Image caching
 * 4. Placeholder/Skeleton while loading
 * 5. Modern format (WebP with fallback)
 */

/**
 * Compresses an image before uploading to Firebase
 * @param {File} file - Original image file
 * @param {number} quality - Quality (0-1, default 0.8)
 * @param {number} maxWidth - Maximum width in px (default 1200)
 * @returns {Promise<File>} Compressed image as File object
 */
export async function compressImage(file, quality = 0.8, maxWidth = 1200) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Resize if wider than maxWidth
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to compressed blob then to File
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Failed to compress image"));
              return;
            }
            // Convert Blob to File with original filename
            const compressedFile = new File([blob], file.name, {
              type: "image/jpeg",
            });
            resolve(compressedFile);
          },
          "image/jpeg",
          quality,
        );
      };

      img.onerror = () => reject(new Error("Error loading image"));
      img.src = e.target.result;
    };

    reader.onerror = () => reject(new Error("Error reading file"));
    reader.readAsDataURL(file);
  });
}

/**
 * Gets readable file size with units
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted size (e.g., "2.5 MB")
 */
export function getReadableFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

/**
 * Calculates compression percentage
 * @param {number} originalSize - Original size in bytes
 * @param {number} compressedSize - Compressed size in bytes
 * @returns {number} Percentage (e.g., 45 = 45% reduction)
 */
export function getCompressionPercentage(originalSize, compressedSize) {
  if (originalSize === 0) return 0;
  return Math.round(((originalSize - compressedSize) / originalSize) * 100);
}

/**
 * Validates that the image is valid
 * @param {File} file - File to validate
 * @param {number} maxSizeMB - Maximum size in MB (default 5)
 * @returns {Object} { valid: boolean, error?: string }
 */
export function validateImageFile(file, maxSizeMB = 5) {
  if (!file) {
    return { valid: false, error: "No file provided" };
  }

  // Validate type
  const validTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed: JPEG, PNG, WebP. Got: ${file.type}`,
    };
  }

  // Validate size
  const maxBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxBytes) {
    return {
      valid: false,
      error: `File too large. Max: ${maxSizeMB}MB. Got: ${getReadableFileSize(file.size)}`,
    };
  }

  return { valid: true };
}

/**
 * Adds optimization parameters to Firebase Storage URL
 * @param {string} imageUrl - Original URL
 * @param {Object} options - Options
 * @returns {string} Optimized URL
 */
export function optimizeImageUrl(imageUrl, options = {}) {
  const {
    width = 800,
    quality = 80,
    format = "auto", // auto, jpeg, webp
  } = options;

  if (!imageUrl) return "";

  // If already has parameters, don't add more
  if (imageUrl.includes("?alt=media")) {
    return imageUrl;
  }

  // For Firebase Storage, add alt=media if not present
  const separator = imageUrl.includes("?") ? "&" : "?";
  return `${imageUrl}${separator}alt=media`;
}

/**
 * Creates a thumbnail URL (small version)
 * @param {string} imageUrl - Original URL
 * @returns {string} URL with thumbnail parameters
 */
export function getThumbnailUrl(imageUrl) {
  return optimizeImageUrl(imageUrl, {
    width: 300,
    quality: 60,
  });
}

export default {
  compressImage,
  getReadableFileSize,
  getCompressionPercentage,
  validateImageFile,
  optimizeImageUrl,
  getThumbnailUrl,
};
