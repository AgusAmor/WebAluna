/**
 * Cart Storage Service
 * Handles localStorage operations for the shopping cart
 */

const CART_STORAGE_KEY = "aluna_cart";

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
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(dataToSave));
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
      const savedData = localStorage.getItem(CART_STORAGE_KEY);
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
      localStorage.removeItem(CART_STORAGE_KEY);
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
      return localStorage.getItem(CART_STORAGE_KEY) !== null;
    } catch (error) {
      console.error("Error checking stored cart:", error);
      return false;
    }
  },
};
