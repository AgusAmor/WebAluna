/**
 * orderService.js
 * Business logic for order operations.
 * Contains pure functions for order creation and processing.
 */

/**
 * Generates a human-readable order number
 * Format: ALN-YYYYMMDD-XXXXX (where XXXXX is a random 5-digit number for uniqueness)
 * @param {Date} date - Order date (default: current date)
 * @returns {string} - Formatted order number
 */
export function generateOrderNumber(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  // Generate a random 5-digit number for uniqueness
  const randomSequence = String(Math.floor(Math.random() * 90000) + 10000);

  return `ALN-${year}${month}${day}-${randomSequence}`;
}

/**
 * Creates order summary from cart items
 * @param {Array} items - Cart items
 * @param {number} shippingCost - Shipping cost
 * @returns {Object} - Order summary {subtotal, shipping, total}
 */
export function createOrderSummary(items, shippingCost = 0) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const total = subtotal + shippingCost;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    shipping: Math.round(shippingCost * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
}

/**
 * Formats cart items for order
 * @param {Array} items - Cart items from context
 * @returns {Array} - Formatted order items
 */
export function formatOrderItems(items) {
  return items.map((item) => ({
    productId: item.id,
    productName: item.name,
    family: item.family || "Standard", // Default family if not specified
    size: item.type || "normal",
    quantity: item.quantity,
    unitPrice: item.price,
  }));
}

/**
 * Creates initial status history entry
 * @param {Date} createdAt - Creation timestamp
 * @returns {Array} - Initial status history
 */
export function createInitialStatusHistory(createdAt) {
  return [
    {
      status: "pending",
      timestamp: createdAt,
      note: "Pedido creado y pendiente de confirmación",
      updatedBy: "system",
    },
  ];
}

/**
 * Extracts customer info from user object
 * @param {Object} user - User object from Firestore/Auth
 * @returns {Object} - Customer info {name, email, phone}
 */
export function extractCustomerInfo(user) {
  return {
    name: user.displayName || user.name || "Cliente",
    email: user.email || "",
    phone: user.phone || "",
  };
}

/**
 * Extracts shipping address from user object
 * @param {Object} user - User object from Firestore/Auth
 * @returns {Object|null} - Shipping address or null if not available
 */
export function extractShippingAddress(user) {
  if (!user.addresses || user.addresses.length === 0) {
    return null;
  }

  // Get the default address, or fallback to first address
  const address =
    user.addresses.find((addr) => addr.isDefault) || user.addresses[0];
  return {
    street: address.street || "",
    number: address.number || "",
    apartment: address.apartment || "",
    city: address.city || "",
    region: address.region || "",
    postalCode: address.postalCode || "",
    recipientName: address.recipientName || "",
    recipientPhone: address.recipientPhone || "",
    isDefault: address.isDefault || false,
  };
}

/**
 * Validates order data before submission
 * @param {Object} orderData - Order object to validate
 * @returns {Object} - {isValid: boolean, errors: Array<string>}
 */
export function validateOrderData(orderData) {
  const errors = [];

  if (!orderData.userId) errors.push("User ID is required");
  if (!orderData.customerInfo?.email) errors.push("Customer email is required");
  if (!orderData.customerInfo?.name) errors.push("Customer name is required");
  if (!orderData.items || orderData.items.length === 0)
    errors.push("Order must have at least one item");
  if (!orderData.summary?.total) errors.push("Order summary is required");
  if (!orderData.delivery?.method) errors.push("Delivery method is required");

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates if user has a default address
 * @param {Object} user - User object from Firestore/Auth
 * @returns {boolean} - True if user has a default address
 */
export function hasDefaultAddress(user) {
  if (!user || !user.addresses || user.addresses.length === 0) {
    return false;
  }

  return user.addresses.some((addr) => addr.isDefault);
}
