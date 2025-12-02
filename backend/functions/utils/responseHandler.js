/**
 * HTTP Response Handler Utilities
 * Centralizes consistent error and success responses
 */

const admin = require("../config/firebaseAdmin.js");

/**
 * Sends a success JSON response
 * @param {object} res - Express response object
 * @param {any} data - Data to send in response
 * @param {number} statusCode - HTTP status code (default: 200)
 */
const sendSuccess = (res, data, statusCode = 200) => {
  res.status(statusCode).json(data);
};

/**
 * Sends an error response with consistent format
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {any} data - Additional error data (optional)
 */
const sendError = (res, statusCode, message, data = null) => {
  const error = { error: message };
  if (data !== null && data !== undefined) {
    error.details = data;
  }
  res.status(statusCode).json(error);
};

/**
 * Handles caught errors and sends appropriate response
 * @param {object} res - Express response object
 * @param {Error|object} error - Error object
 * @param {object} options - Options { status, defaultMessage }
 */
const handleError = (res, error, options = {}) => {
  const { status = 500, defaultMessage = "Internal server error" } = options;

  // If error is our custom error object with status
  if (error.status && error.message) {
    return sendError(res, error.status, error.message);
  }

  // If error has a code (Firebase errors)
  if (error.code && error.message) {
    return sendError(res, status, error.message, { code: error.code });
  }

  // Generic error
  sendError(res, status, error.message || defaultMessage);
};

/**
 * Wraps async route handlers to catch errors automatically
 * @param {Function} fn - Async handler function
 * @returns {Function} Wrapped handler function
 */
const asyncHandler = (fn) => (req, res) => {
  Promise.resolve(fn(req, res)).catch((error) => {
    handleError(res, error);
  });
};

module.exports = {
  sendSuccess,
  sendError,
  handleError,
  asyncHandler,
};
