/**
 * validationService.js
 * Centralized validation service
 * Single source of truth for all form validation logic
 * Used by both frontend and backend
 */

import { VALIDATION } from "../constants/validationConstants.js";

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
export function isValidEmail(email) {
  return VALIDATION.EMAIL_REGEX.test(email);
}

/**
 * Validates phone number format (international format)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid
 */
export function isValidPhone(phone) {
  return VALIDATION.PHONE_REGEX.test(phone);
}

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @returns {string|null} Error message or null if valid
 */
export function validatePassword(password) {
  if (!password || password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
    return `La contraseña debe tener al menos ${VALIDATION.PASSWORD_MIN_LENGTH} caracteres`;
  }
  return null;
}

/**
 * Validates required field
 * @param {any} value - Value to validate
 * @param {string} fieldName - Name of the field for error message
 * @returns {string|null} Error message or null if valid
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
 * @returns {string|null} Error message or null if valid
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
 * @returns {string|null} Error message or null if valid
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

/**
 * Validates a form object against rules
 * @param {Object} formData - Form data to validate
 * @param {Object} rules - Validation rules { fieldName: [validator1, validator2, ...] }
 * @returns {Object} Errors object { fieldName: errorMessage }
 */
export function validateForm(formData, rules) {
  const errors = {};

  for (const [fieldName, validators] of Object.entries(rules)) {
    const value = formData[fieldName];

    // Validators should be functions that return error message or null
    for (const validator of validators) {
      const error = validator(value, fieldName);
      if (error) {
        errors[fieldName] = error;
        break; // Stop at first error for this field
      }
    }
  }

  return errors;
}

/**
 * Creates a validator function for required fields
 * @param {string} fieldName - Field name
 * @returns {Function} Validator function
 */
export function createRequiredValidator(fieldName) {
  return (value) => validateRequired(value, fieldName);
}

/**
 * Creates a validator function for email fields
 * @param {string} fieldName - Field name (default: "Email")
 * @returns {Function} Validator function
 */
export function createEmailValidator(fieldName = "Email") {
  return (value) => {
    const requiredError = validateRequired(value, fieldName);
    if (requiredError) return requiredError;
    if (!isValidEmail(value)) return `${fieldName} inválido`;
    return null;
  };
}

/**
 * Creates a validator function for password fields
 * @param {string} fieldName - Field name (default: "Contraseña")
 * @returns {Function} Validator function
 */
export function createPasswordValidator(fieldName = "Contraseña") {
  return (value) => {
    const requiredError = validateRequired(value, fieldName);
    if (requiredError) return requiredError;
    return validatePassword(value);
  };
}

/**
 * Creates a validator function for matching fields (e.g., password confirmation)
 * @param {string} fieldName - Field name for error message
 * @param {string} otherValue - Value to match against
 * @returns {Function} Validator function
 */
export function createMatchValidator(fieldName, otherValue) {
  return (value) => {
    if (value !== otherValue) {
      return `${fieldName} no coinciden`;
    }
    return null;
  };
}

/**
 * Validates login form
 * @param {Object} formData - { email, password }
 * @returns {Object} Errors object
 */
export function validateLoginForm(formData) {
  return validateForm(formData, {
    email: [createEmailValidator("Email")],
    password: [createPasswordValidator("Contraseña")],
  });
}

/**
 * Validates registration form
 * @param {Object} formData - { name, email, password, confirmPassword }
 * @returns {Object} Errors object
 */
export function validateRegisterForm(formData) {
  const errors = validateForm(formData, {
    name: [createRequiredValidator("Nombre")],
    email: [createEmailValidator("Email")],
    password: [createPasswordValidator("Contraseña")],
  });

  // Check password confirmation
  if (formData.password && formData.confirmPassword !== formData.password) {
    errors.confirmPassword = "Las contraseñas no coinciden";
  }

  return errors;
}

/**
 * Validates password reset email
 * @param {string} email
 * @returns {Object} { isValid: boolean, error: string }
 */
export function validateResetEmail(email) {
  if (!email.trim()) {
    return { isValid: false, error: "El email es requerido" };
  }
  if (!isValidEmail(email)) {
    return { isValid: false, error: "Email inválido" };
  }
  return { isValid: true, error: "" };
}
