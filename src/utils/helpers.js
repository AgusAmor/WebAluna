/**
 * Format currency according to app configuration
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: ARS)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = "ARS") => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format date to locale string
 * @param {Date|string} date - Date to format
 * @param {string} locale - Locale code (default: es-AR)
 * @returns {string} Formatted date string
 */
export const formatDate = (date, locale = "es-AR") => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Generate slug from string
 * @param {string} text - Text to convert to slug
 * @returns {string} Slug string
 */
export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Calculate cart total
 * @param {Array} cartItems - Array of cart items
 * @returns {number} Total amount
 */
export const calculateCartTotal = (cartItems) => {
  return cartItems.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
};

/**
 * Generate unique ID
 * @returns {string} Unique ID
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Capitalize first letter of string
 * @param {string} string - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, length = 100) => {
  if (text.length <= length) return text;
  return text.substring(0, length) + "...";
};

/**
 * Check if user has specific role
 * @param {Object} user - User object
 * @param {string} role - Role to check
 * @returns {boolean} True if user has role
 */
export const hasRole = (user, role) => {
  return user && user.role === role;
};

/**
 * Get image URL with fallback
 * @param {string} imagePath - Image path
 * @param {string} fallback - Fallback image path
 * @returns {string} Image URL
 */
export const getImageUrl = (
  imagePath,
  fallback = "/images/placeholder.jpg"
) => {
  return imagePath || fallback;
};
