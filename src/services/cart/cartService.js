/**
 * cartService.js
 * Business logic for shopping cart operations.
 * Contains pure functions with no React dependencies.
 */

/**
 * Generates unique cart item key
 * @param {string} id - Product ID
 * @param {string} type - Product type/size (e.g., "normal", "small")
 * @returns {string} - Unique key for cart item
 */
export function getCartItemKey(id, type = "normal") {
  return `${id}_${type}`;
}

/**
 * Calculates total price for cart items
 * @param {Array} items - Array of cart items
 * @returns {number} - Total price
 */
export function calculateCartTotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

/**
 * Calculates total item count for cart
 * @param {Array} items - Array of cart items
 * @returns {number} - Total item count
 */
export function calculateItemCount(items) {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

/**
 * Finds item in cart by key
 * @param {Array} items - Array of cart items
 * @param {string} itemKey - Unique item key
 * @returns {Object|undefined} - Found item or undefined
 */
export function findCartItem(items, itemKey) {
  return items.find((item) => getCartItemKey(item.id, item.type) === itemKey);
}

/**
 * Adds or updates item quantity in cart
 * @param {Array} items - Current cart items
 * @param {Object} newItem - Item to add
 * @returns {Array} - Updated cart items
 */
export function addItemToCart(items, newItem) {
  const itemKey = getCartItemKey(newItem.id, newItem.selectedType || "normal");
  const existingItem = findCartItem(items, itemKey);

  if (existingItem) {
    // Update existing item quantity
    return items.map((item) =>
      getCartItemKey(item.id, item.type) === itemKey
        ? {
            ...item,
            quantity: item.quantity + (newItem.quantity || 1),
          }
        : item
    );
  } else {
    // Add new item
    return [
      ...items,
      {
        ...newItem,
        price: newItem.selectedPrice,
        size: newItem.selectedSize,
        type: newItem.selectedType,
        quantity: newItem.quantity || 1,
      },
    ];
  }
}

/**
 * Updates item quantity in cart
 * @param {Array} items - Current cart items
 * @param {string} itemKey - Item key to update
 * @param {number} newQuantity - New quantity
 * @returns {Array} - Updated cart items (filters out items with quantity 0)
 */
export function updateItemQuantity(items, itemKey, newQuantity) {
  return items
    .map((item) => {
      const currentKey = getCartItemKey(item.id, item.type);
      return currentKey === itemKey
        ? { ...item, quantity: Math.max(0, newQuantity) }
        : item;
    })
    .filter((item) => item.quantity > 0);
}

/**
 * Removes item from cart
 * @param {Array} items - Current cart items
 * @param {string} itemKey - Item key to remove
 * @returns {Array} - Updated cart items
 */
export function removeItemFromCart(items, itemKey) {
  return items.filter((item) => getCartItemKey(item.id, item.type) !== itemKey);
}

/**
 * Prepares cart state with calculated totals
 * @param {Array} items - Cart items
 * @returns {Object} - Cart state with totals
 */
export function prepareCartState(items) {
  return {
    items,
    total: calculateCartTotal(items),
    itemCount: calculateItemCount(items),
  };
}
