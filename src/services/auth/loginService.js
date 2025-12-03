/**
 * loginService.js
 * Business logic for login/register/password reset forms.
 * Contains pure functions with no React dependencies.
 */

import {
  isValidEmail,
  validatePassword as validatePasswordUtil,
} from "../../utils/validators";

/**
 * Validates password with Spanish error messages
 * @param {string} password - Password to validate
 * @returns {Object} - { isValid: boolean, error: string }
 */
export function validatePassword(password) {
  const error = validatePasswordUtil(password);
  if (error) {
    return {
      isValid: false,
      error: password
        ? "La contraseña debe tener al menos 6 caracteres"
        : "La contraseña es requerida",
    };
  }
  return { isValid: true, error: "" };
}

/**
 * Validates login form data
 * @param {Object} formData - Form data to validate
 * @returns {Object} - Errors object
 */
export function validateLoginForm(formData) {
  const errors = {};

  if (!formData.email.trim()) {
    errors.email = "El email es requerido";
  } else if (!isValidEmail(formData.email)) {
    errors.email = "Email inválido";
  }

  const passwordValidation = validatePassword(formData.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.error;
  }

  return errors;
}

/**
 * Validates register form data
 * @param {Object} formData - Form data to validate
 * @returns {Object} - Errors object
 */
export function validateRegisterForm(formData) {
  const errors = {};

  if (!formData.name.trim()) {
    errors.name = "El nombre es requerido";
  }

  if (!formData.email.trim()) {
    errors.email = "El email es requerido";
  } else if (!isValidEmail(formData.email)) {
    errors.email = "Email inválido";
  }

  const passwordValidation = validatePassword(formData.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.error;
  }

  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = "Las contraseñas no coinciden";
  }

  return errors;
}

/**
 * Validates password reset email
 * @param {string} email - Email to validate
 * @returns {Object} - { isValid: boolean, error: string }
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

/**
 * Creates empty form data object
 * @returns {Object} - Empty form data
 */
export function createEmptyFormData() {
  return {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };
}

/**
 * Gets modal title based on current mode
 * @param {boolean} isLogin - Whether in login mode
 * @param {boolean} showReset - Whether in reset mode
 * @returns {string} - Modal title
 */
export function getModalTitle(isLogin, showReset) {
  if (showReset) return "Reestablecer contraseña";
  return isLogin ? "Iniciar Sesión" : "Registrarse";
}

/**
 * Gets modal subtitle based on current mode
 * @param {boolean} isLogin - Whether in login mode
 * @param {boolean} showReset - Whether in reset mode
 * @returns {string} - Modal subtitle
 */
export function getModalSubtitle(isLogin, showReset) {
  if (showReset) return "Ingresa tu email para recibir instrucciones";
  return isLogin ? "Accede a tu cuenta" : "Crea una nueva cuenta";
}
