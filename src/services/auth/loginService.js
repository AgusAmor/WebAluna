/**
 * loginService.js
 * Business logic for login/register/password reset forms.
 * Contains pure functions with no React dependencies.
 * Re-exports validation functions from validationService
 */

// Re-export validation functions from centralized service
export {
  validateLoginForm,
  validateRegisterForm,
  validateResetEmail,
} from "../validationService.js";

/**
 * Creates empty form data object for login
 * @returns {Object} - Empty login form data
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
