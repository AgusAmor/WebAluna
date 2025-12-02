/**
 * Request Parsing and Validation Utilities
 * Centralizes common parsing and validation logic
 */

/**
 * Parses request body, handling both JSON strings and objects
 * @param {any} body - Raw request body
 * @returns {object} Parsed body as object
 * @throws {object} Error object with status and message
 */
const parseBody = (body) => {
  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch (e) {
      throw { status: 400, message: "Invalid JSON body" };
    }
  }
  return body || {};
};

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email format
 */
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/**
 * Validates that email is present and in valid format
 * @param {string} email - Email to validate
 * @throws {object} Error object with status and message
 */
const validateEmail = (email) => {
  if (!email || !isValidEmail(email)) {
    throw { status: 400, message: "Valid email is required" };
  }
};

/**
 * Validates that ID is a non-empty string
 * @param {string} id - ID to validate
 * @param {string} fieldName - Field name for error message (default: "ID")
 * @throws {object} Error object with status and message
 */
const validateId = (id, fieldName = "ID") => {
  if (!id || typeof id !== "string" || id.trim().length === 0) {
    throw { status: 400, message: `Valid ${fieldName} is required` };
  }
};

/**
 * Validates required string fields
 * @param {object} data - Object containing fields
 * @param {string[]} requiredFields - Array of field names that are required
 * @throws {object} Error object with status and message
 */
const validateRequiredFields = (data, requiredFields) => {
  const missing = requiredFields.filter((field) => !data[field]?.trim());
  if (missing.length > 0) {
    throw {
      status: 400,
      message: `Missing required fields: ${missing.join(", ")}`,
    };
  }
};

module.exports = {
  parseBody,
  isValidEmail,
  validateEmail,
  validateId,
  validateRequiredFields,
};
