/**
 * Performance optimization utilities
 * Debounce, memoization, throttle
 */

/**
 * Debounce to reduce function calls (search, filter, etc)
 * @param {function} fn - Function to debounce
 * @param {number} delay - Delay in ms
 * @returns {function} Debounced function
 */
export function debounce(fn, delay = 300) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Throttle to limit calls within time windows
 * @param {function} fn - Function to throttle
 * @param {number} limit - Limit in ms
 * @returns {function} Throttled function
 */
export function throttle(fn, limit = 300) {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      fn(...args);
    }
  };
}

/**
 * Memoize hook to avoid re-computations
 * @param {*} value - Value to memoize
 * @param {array} dependencies - Dependencies array
 * @returns {*} Memoized value
 */
export function useMemoValue(value, dependencies) {
  const React = require("react");
  return React.useMemo(() => value, dependencies);
}

/**
 * Memoized callback
 * @param {function} callback - Callback to memoize
 * @param {array} dependencies - Dependencies array
 * @returns {function} Memoized callback
 */
export function useMemoCallback(callback, dependencies) {
  const React = require("react");
  return React.useCallback(callback, dependencies);
}

/**
 * Hook for real-time value debouncing
 * Useful for search inputs, filters, etc
 */
export function useDebouncedValue(value, delay = 300) {
  const React = require("react");
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook to measure render performance
 * Useful for debugging
 */
export function useRenderTime(componentName) {
  const React = require("react");

  React.useEffect(() => {
    const renderTime = performance.now();
    return () => {
      const now = performance.now();
      console.log(
        `${componentName} render time: ${(now - renderTime).toFixed(2)}ms`,
      );
    };
  });
}

export default {
  debounce,
  throttle,
  useMemoValue,
  useMemoCallback,
  useDebouncedValue,
  useRenderTime,
};
