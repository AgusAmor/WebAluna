/**
 * cartModalService.js
 * Business logic for cart modal operations.
 */

import { getCartItemKey } from "../../utils/cartItemUtils";

/**
 * Formats price for display
 * @param {number} price - Price value
 * @returns {string} - Formatted price
 */
export function formatPrice(price) {
  return Math.round(price).toLocaleString("es-AR");
}

/**
 * Calculates subtotal for cart item
 * @param {number} price - Item price
 * @param {number} quantity - Item quantity
 * @returns {number} - Subtotal
 */
export function calculateSubtotal(price, quantity) {
  return price * quantity;
}

/**
 * Formats subtotal for display
 * @param {number} price - Item price
 * @param {number} quantity - Item quantity
 * @returns {string} - Formatted subtotal
 */
export function formatSubtotal(price, quantity) {
  return formatPrice(calculateSubtotal(price, quantity));
}

/**
 * Gets image source for product
 * Accepts either base64 encoded image data or URL
 * @param {string} imageData - Base64 image data OR image URL
 * @returns {string|null} - Image source or null
 */
export function getImageSource(imageData) {
  if (!imageData) return null;

  // If it's a URL (starts with http or https)
  if (
    typeof imageData === "string" &&
    (imageData.startsWith("http://") || imageData.startsWith("https://"))
  ) {
    return imageData;
  }

  // If it's base64 data
  if (typeof imageData === "string") {
    return `data:image/jpeg;base64,${imageData}`;
  }

  return null;
}

/**
 * Checks if cart is empty
 * @param {Array} items - Cart items
 * @returns {boolean} - True if empty
 */
export function isCartEmpty(items) {
  return !items || items.length === 0;
}
