/**
 * validators.js
 * Centralized validation utilities.
 * Pure functions for data validation across the application.
 */

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid
 */
export function isValidPhone(phone) {
  const phoneRegex = /^\+?\d{8,15}$/;
  return phoneRegex.test(phone);
}

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @returns {string|null} - Error message or null if valid
 */
export function validatePassword(password) {
  if (!password || password.length < 6) {
    return "La contraseña debe tener al menos 6 caracteres";
  }
  return null;
}

/**
 * Validates required field
 * @param {any} value - Value to validate
 * @param {string} fieldName - Name of the field for error message
 * @returns {string|null} - Error message or null if valid
 */
export function validateRequired(value, fieldName = "Este campo") {
  if (!value || (typeof value === "string" && value.trim() === "")) {
    return `${fieldName} es requerido`;
  }
  return null;
}

/**
 * Validates string length
 * @param {string} value - Value to validate
 * @param {number} min - Minimum length
 * @param {number} max - Maximum length
 * @param {string} fieldName - Field name for error message
 * @returns {string|null} - Error message or null if valid
 */
export function validateLength(value, min, max, fieldName = "Este campo") {
  if (!value) return null;
  const length = value.length;
  if (length < min) {
    return `${fieldName} debe tener al menos ${min} caracteres`;
  }
  if (length > max) {
    return `${fieldName} no puede tener más de ${max} caracteres`;
  }
  return null;
}

/**
 * Validates numeric value within range
 * @param {number} value - Value to validate
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @param {string} fieldName - Field name for error message
 * @returns {string|null} - Error message or null if valid
 */
export function validateRange(value, min, max, fieldName = "Este valor") {
  const num = Number(value);
  if (isNaN(num)) {
    return `${fieldName} debe ser un número`;
  }
  if (num < min || num > max) {
    return `${fieldName} debe estar entre ${min} y ${max}`;
  }
  return null;
}
