/**
 * OptimizedImage Component
 *
 * Features:
 * - Automatic lazy loading
 * - Placeholder while loading
 * - Error handling
 * - WebP support
 * - Browser caching
 */

import React, { useState } from "react";
import { useLazyLoadImage } from "../../hooks/ui/useLazyLoadImage";
import PropTypes from "prop-types";

/**
 * Minimalist placeholder
 */
const DEFAULT_PLACEHOLDER = (
  <div className="w-full h-full bg-linear-to-br from-gray-2 to-gray-3 animate-pulse flex items-center justify-center">
    <div className="text-gray-1 text-sm">Loading...</div>
  </div>
);

/**
 * Optimized image component
 */
const OptimizedImage = ({
  src,
  alt = "Image",
  className = "",
  placeholder = DEFAULT_PLACEHOLDER,
  lazy = true,
  onLoad = null,
  onError = null,
  errorFallback = null,
  style = {},
  ...props
}) => {
  const [showError, setShowError] = useState(false);

  const { imageSrc, isLoaded, error, ref } = useLazyLoadImage(src, {
    placeholder: null,
    rootMargin: "50px",
    onLoad,
    onError: (err) => {
      setShowError(true);
      onError?.(err);
    },
  });

  // If error, show fallback
  if (showError && errorFallback) {
    return errorFallback;
  }

  // If error and no fallback, show placeholder
  if (showError) {
    return (
      <div
        className={`${className} flex items-center justify-center bg-gray-3`}
      >
        <div className="text-gray-1 text-sm text-center p-4">
          Failed to load image
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      style={style}
    >
      {/* Placeholder while loading */}
      {!isLoaded && placeholder && (
        <div className="absolute inset-0 z-0">{placeholder}</div>
      )}

      {/* Image */}
      {imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => {
            // Already handled by useLazyLoadImage
          }}
          onError={() => {
            setShowError(true);
          }}
          style={{
            ...style,
          }}
          {...props}
        />
      )}
    </div>
  );
};

OptimizedImage.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  className: PropTypes.string,
  placeholder: PropTypes.node,
  lazy: PropTypes.bool,
  onLoad: PropTypes.func,
  onError: PropTypes.func,
  errorFallback: PropTypes.node,
  style: PropTypes.object,
};

export default OptimizedImage;
