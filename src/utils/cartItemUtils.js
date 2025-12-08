/**
 * cartItemUtils.js
 * Shared cart item utilities
 */

/**
 * Generates a unique key for a cart item based on product ID and type
 * @param {string} id - Product ID
 * @param {string} type - Item type ("normal" or product type)
 * @returns {string} Unique cart item key
 */
export const getCartItemKey = (id, type = "normal") =>
  `${id}_${type || "normal"}`;
