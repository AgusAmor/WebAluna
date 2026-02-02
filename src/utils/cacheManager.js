/**
 * Cache utility to optimize queries and improve performance
 * Avoids multiple requests to the same endpoint
 */

class CacheManager {
  constructor() {
    this.cache = new Map();
    this.timers = new Map();
  }

  /**
   * Get value from cache
   * @param {string} key - Cache key
   * @returns {*} Cached value or undefined
   */
  get(key) {
    return this.cache.get(key);
  }

  /**
   * Save to cache with TTL (time to live)
   * @param {string} key - Cache key
   * @param {*} value - Value to cache
   * @param {number} ttl - Time in ms (default: 5 minutes)
   */
  set(key, value, ttl = 5 * 60 * 1000) {
    // Clear previous timer if exists
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
    }

    // Save to cache
    this.cache.set(key, value);

    // Set timer to clean up
    const timer = setTimeout(() => {
      this.cache.delete(key);
      this.timers.delete(key);
    }, ttl);

    this.timers.set(key, timer);
  }

  /**
   * Check if exists in cache
   * @param {string} key - Cache key
   * @returns {boolean}
   */
  has(key) {
    return this.cache.has(key);
  }

  /**
   * Clear all cache
   */
  clear() {
    this.timers.forEach((timer) => clearTimeout(timer));
    this.cache.clear();
    this.timers.clear();
  }

  /**
   * Invalidate a specific key
   * @param {string} key - Key to invalidate
   */
  invalidate(key) {
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
      this.timers.delete(key);
    }
    this.cache.delete(key);
  }
}

// Singleton instance
export const queryCache = new CacheManager();

/**
 * Hook to use cache in queries
 * Avoids unnecessary re-renders and duplicate requests
 */
export function useCachedQuery(key, queryFn, ttl = 5 * 60 * 1000) {
  const [data, setData] = require("react").useState(null);
  const [loading, setLoading] = require("react").useState(true);
  const [error, setError] = require("react").useState(null);

  require("react").useEffect(() => {
    async function fetch() {
      // Check cache first
      if (queryCache.has(key)) {
        setData(queryCache.get(key));
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const result = await queryFn();
        queryCache.set(key, result, ttl);
        setData(result);
        setError(null);
      } catch (err) {
        setError(err);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }

    fetch();
  }, [key, queryFn, ttl]);

  return { data, loading, error };
}

export default queryCache;
