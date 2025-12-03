/**
 * Cart Storage Service
 * Handles localStorage operations for the shopping cart
 */

import { STORAGE_KEYS } from "../../constants";

// canonical key to use going forward
const CANONICAL_CART_KEY = STORAGE_KEYS?.CART_DATA || "aluna_cart_data";

// Cleanup any other cart-related keys that don't match the key used by CartModal
// This ensures only a single cart instance remains in localStorage.
try {
  if (typeof localStorage !== "undefined") {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      // remove any key that contains 'aluna_cart' but is not the canonical one
      // also remove exact legacy key 'cart' when found
      if (
        (key.includes("aluna_cart") && key !== CANONICAL_CART_KEY) ||
        key === "cart"
      ) {
        try {
          localStorage.removeItem(key);
          // adjust index since localStorage length changed
          i--;
        } catch (e) {
          // ignore removal errors
        }
      }
    }
  }
} catch (e) {
  // ignore if localStorage is not available (e.g., during SSR)
}

// legacy keys that older versions may have used
const LEGACY_CART_KEYS = ["aluna_cart", "cart"];

export const cartStorageService = {
  /**
   * Save cart data to localStorage
   * @param {Object} cartData - Cart state to save
   */
  saveCart(cartData) {
    try {
      const dataToSave = {
        items: cartData.items,
        total: cartData.total,
        itemCount: cartData.itemCount,
        lastUpdated: Date.now(),
      };

      // Always write to the canonical key
      localStorage.setItem(CANONICAL_CART_KEY, JSON.stringify(dataToSave));

      // Remove legacy keys so only one cart entry remains
      LEGACY_CART_KEYS.forEach((k) => {
        try {
          if (k !== CANONICAL_CART_KEY) localStorage.removeItem(k);
        } catch (e) {
          /* ignore */
        }
      });
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  },

  /**
   * Load cart data from localStorage
   * @returns {Object|null} Saved cart data or null
   */
  loadCart() {
    try {
      // Prefer canonical key, but migrate from legacy keys when needed
      let savedData = localStorage.getItem(CANONICAL_CART_KEY);

      if (!savedData) {
        for (const k of LEGACY_CART_KEYS) {
          const v = localStorage.getItem(k);
          if (v) {
            savedData = v;
            try {
              // migrate to canonical
              localStorage.setItem(CANONICAL_CART_KEY, v);
            } catch (e) {
              /* ignore */
            }
            try {
              localStorage.removeItem(k);
            } catch (e) {}
            break;
          }
        }
      }

      if (!savedData) return null;

      const cartData = JSON.parse(savedData);

      // Check if cart data is not too old (7 days)
      const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days in ms
      if (cartData.lastUpdated && Date.now() - cartData.lastUpdated > maxAge) {
        this.clearCart();
        return null;
      }

      return {
        items: cartData.items || [],
        total: cartData.total || 0,
        itemCount: cartData.itemCount || 0,
      };
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      return null;
    }
  },

  /**
   * Clear cart from localStorage
   */
  clearCart() {
    try {
      // remove canonical and legacy keys
      try {
        localStorage.removeItem(CANONICAL_CART_KEY);
      } catch (e) {}
      LEGACY_CART_KEYS.forEach((k) => {
        try {
          localStorage.removeItem(k);
        } catch (e) {}
      });
    } catch (error) {
      console.error("Error clearing cart from localStorage:", error);
    }
  },

  /**
   * Check if cart exists in localStorage
   * @returns {boolean} True if cart exists
   */
  hasStoredCart() {
    try {
      // consider canonical or any legacy key as existing (migration will standardize)
      if (localStorage.getItem(CANONICAL_CART_KEY) !== null) return true;
      return LEGACY_CART_KEYS.some((k) => localStorage.getItem(k) !== null);
    } catch (error) {
      console.error("Error checking stored cart:", error);
      return false;
    }
  },
};
