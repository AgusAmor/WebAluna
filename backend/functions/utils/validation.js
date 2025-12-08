/**
 * Request Parsing and Validation Utilities
 * Centralizes common parsing and validation logic
 */

const dns = require("dns").promises;

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
 * Validates that the email domain has valid MX records (mail server exists)
 * This ensures the domain can actually receive emails
 * @param {string} email - Email address to validate
 * @returns {Promise<boolean>} True if domain has valid MX records
 * @throws {object} Error object with status and message
 */
const validateEmailDomain = async (email) => {
  try {
    const domain = email.split("@")[1];
    if (!domain) {
      throw {
        status: 400,
        message: "La dirección de correo no existe o no es válida",
      };
    }

    // Check for MX records (mail server records)
    const mxRecords = await dns.resolveMx(domain);
    if (!mxRecords || mxRecords.length === 0) {
      throw {
        status: 400,
        message: "La dirección de correo no existe o no es válida",
      };
    }

    return true;
  } catch (error) {
    // If it's our custom error, throw it
    if (error.status) {
      throw error;
    }
    // If DNS lookup fails, es dominio inválido
    throw {
      status: 400,
      message: "La dirección de correo no existe o no es válida",
    };
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
 * Validates required fields
 * Checks that fields exist and are not empty/null/undefined
 * For strings: also checks that trimmed value is not empty
 * For arrays/objects: checks that they exist and are not empty
 * @param {object} data - Object containing fields
 * @param {string[]} requiredFields - Array of field names that are required
 * @throws {object} Error object with status and message
 */
const validateRequiredFields = (data, requiredFields) => {
  const missing = requiredFields.filter((field) => {
    const value = data[field];

    // Check if field exists
    if (value === null || value === undefined) {
      return true;
    }

    // For strings: check trim is not empty
    if (typeof value === "string") {
      return value.trim().length === 0;
    }

    // For arrays: check length > 0
    if (Array.isArray(value)) {
      return value.length === 0;
    }

    // For objects: check if not empty (has properties)
    if (typeof value === "object") {
      return Object.keys(value).length === 0;
    }

    // If it's any other truthy value, it's valid
    return !value;
  });

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
  validateEmailDomain,
  validateId,
  validateRequiredFields,
};
