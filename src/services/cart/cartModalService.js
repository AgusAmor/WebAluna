/**
 * cartModalService.js
 * Business logic for cart modal operations.
 */

/**
 * Generates unique cart item key for rendering
 * @param {string} id - Product ID
 * @param {string} type - Product type
 * @returns {string} - Unique key
 */
export function getCartItemKey(id, type = "normal") {
  return `${id}_${type || "normal"}`;
}

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
 * @param {string} imageBase64 - Base64 image data
 * @returns {string|null} - Image source or null
 */
export function getImageSource(imageBase64) {
  return imageBase64 ? `data:image/jpeg;base64,${imageBase64}` : null;
}

/**
 * Checks if cart is empty
 * @param {Array} items - Cart items
 * @returns {boolean} - True if empty
 */
export function isCartEmpty(items) {
  return !items || items.length === 0;
}
