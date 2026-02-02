/**
 * useLazyLoadImage hook
 * Lazy loads images when visible in the viewport
 * Supports placeholder while loading
 */

import { useEffect, useRef, useState } from "react";

/**
 * Hook for lazy loading images
 * @param {string} src - Image URL
 * @param {Object} options - Options
 * @returns {Object} { imageSrc, isLoaded, error }
 */
export function useLazyLoadImage(src, options = {}) {
  const {
    placeholder = null,
    threshold = "0px",
    rootMargin = "50px", // Preload 50px before becoming visible
    onLoad = null,
    onError = null,
  } = options;

  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    if (!src) return;

    // If IntersectionObserver not supported, load directly
    if (!("IntersectionObserver" in window)) {
      setImageSrc(src);
      setIsLoaded(true);
      return;
    }

    // Create observer
    observerRef.current = new IntersectionObserver(
      async (entries) => {
        entries.forEach(async (entry) => {
          if (entry.isIntersecting && imageSrc === placeholder) {
            // Load image
            try {
              const img = new Image();

              img.onload = () => {
                setImageSrc(src);
                setIsLoaded(true);
                setError(null);
                onLoad?.();
              };

              img.onerror = () => {
                const err = new Error("Failed to load image");
                setError(err);
                onError?.(err);
              };

              img.src = src;
            } catch (err) {
              setError(err);
              onError?.(err);
            }

            // Stop observing
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      {
        threshold: parseFloat(threshold),
        rootMargin,
      },
    );

    // Observe element
    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [src, placeholder, threshold, rootMargin, onLoad, onError]);

  return {
    imageSrc,
    isLoaded,
    error,
    ref: imgRef,
  };
}

export default useLazyLoadImage;
