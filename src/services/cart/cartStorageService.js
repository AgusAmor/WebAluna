/**
 * Cart Storage Service
 * Handles sessionStorage operations for the shopping cart
 * Uses sessionStorage to persist cart during the session (cleared when tab closes)
 */

// Using sessionStorage instead of localStorage for cart data
// This persists cart across page reloads but clears when the tab is closed
const CART_STORAGE_KEY = "aluna_cart_session";

export const cartStorageService = {
  /**
   * Save cart data to sessionStorage
   * @param {Object} cartData - Cart state to save
   */
  saveCart(cartData) {
    try {
      // Only save if there are items
      if (!cartData || !cartData.items || cartData.items.length === 0) {
        return;
      }

      const dataToSave = {
        items: cartData.items,
        total: cartData.total,
        itemCount: cartData.itemCount,
        savedAt: Date.now(),
      };

      sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      // Silently fail if sessionStorage is not available
    }
  },

  /**
   * Load cart data from sessionStorage
   * @returns {Object|null} Saved cart data or null
   */
  loadCart() {
    try {
      const savedData = sessionStorage.getItem(CART_STORAGE_KEY);

      if (!savedData) {
        return null;
      }

      const cartData = JSON.parse(savedData);

      return {
        items: cartData.items || [],
        total: cartData.total || 0,
        itemCount: cartData.itemCount || 0,
      };
    } catch (error) {
      return null;
    }
  },

  /**
   * Clear cart from sessionStorage
   * Dispatches a 'cartCleared' event that CartContext can listen to
   */
  clearCart() {
    try {
      sessionStorage.removeItem(CART_STORAGE_KEY);
      // Dispatch event to notify CartContext
      window.dispatchEvent(new Event("cartCleared"));
    } catch (error) {
      // Silently fail
    }
  },

  /**
   * Check if cart exists in sessionStorage
   * @returns {boolean} True if cart exists
   */
  hasStoredCart() {
    try {
      return sessionStorage.getItem(CART_STORAGE_KEY) !== null;
    } catch (error) {
      return false;
    }
  },
};
