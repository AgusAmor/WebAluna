import PropTypes from "prop-types";
import { useEffect } from "react";
import { FiMail, FiLock, FiUser } from "react-icons/fi";
import { IoIosClose } from "react-icons/io";
import { toast } from "react-toastify";
import { GoogleLoginButton } from "../../ui";
import { useLoginModal } from "../../../hooks";
import {
  getModalTitle,
  getModalSubtitle,
} from "../../../services/auth/loginService";

const LoginModal = ({ isOpen, onClose }) => {
  const {
    isLogin,
    showReset,
    resetEmail,
    resetError,
    resetSuccess,
    formData,
    errors,
    loading,
    error,
    handleChange,
    handleResetChange,
    handleResetSubmit,
    handleSubmit,
    handleGoogleLogin,
    handleSwitchMode,
    handleShowReset,
    handleBackToLogin,
  } = useLoginModal(isOpen, onClose);

  // Format error message for better UX
  const getErrorMessage = (error) => {
    if (!error) return "";

    const errorStr = error.toLowerCase();

    // Helper function to check multiple conditions
    const includes = (...terms) =>
      terms.some((term) => errorStr.includes(term));

    // Email domain validation
    if (
      includes(
        "email domain",
        "mail server",
        "domain could not be verified",
        "failed to create user document",
      )
    ) {
      return "La dirección de correo no existe o no es válida.";
    }

    // Firebase auth errors
    if (includes("auth/email-already-in-use", "email-already-in-use")) {
      return "Este correo ya está registrado. Intenta iniciar sesión.";
    }
    if (includes("auth/invalid-email", "invalid-email")) {
      return "El formato del correo electrónico no es válido.";
    }
    if (
      includes(
        "auth/user-not-found",
        "user-not-found",
        "email is not registered",
      )
    ) {
      return "No existe una cuenta con este correo.";
    }
    if (includes("auth/wrong-password", "wrong-password")) {
      return "La contraseña es incorrecta.";
    }
    if (includes("auth/invalid-credential", "invalid-credential")) {
      return "Correo o contraseña incorrectos.";
    }
    if (includes("auth/too-many-requests", "too-many-requests")) {
      return "Demasiados intentos fallidos. Por favor, espera unos minutos.";
    }
    if (includes("auth/weak-password", "weak-password")) {
      return "La contraseña debe tener al menos 6 caracteres.";
    }
    if (includes("auth/network-request-failed", "network")) {
      return "Error de conexión. Verifica tu internet.";
    }
    if (
      includes(
        "auth/popup-closed-by-user",
        "auth/cancelled-popup-request",
        "popup-closed",
        "cancelled",
      )
    ) {
      return "Inicio de sesión cancelado.";
    }
    if (includes("auth/popup-blocked", "popup-blocked")) {
      return "Ventana emergente bloqueada. Por favor, habilita las ventanas emergentes.";
    }
    if (includes("auth/operation-not-allowed", "operation-not-allowed")) {
      return "Este método de inicio de sesión no está disponible.";
    }
    if (includes("auth/account-exists-with-different-credential")) {
      return "Ya existe una cuenta con este correo usando otro método de inicio de sesión.";
    }
    if (includes("auth/requires-recent-login", "requires-recent-login")) {
      return "Por seguridad, debes volver a iniciar sesión.";
    }
    if (includes("auth/user-disabled", "user-disabled")) {
      return "Esta cuenta ha sido deshabilitada.";
    }
    if (includes("suspendida", "suspended")) {
      return "Tu cuenta ha sido suspendida. Contacta con el administrador.";
    }
    if (errorStr.includes("password") && errorStr.includes("reset")) {
      return "Hubo un problema al enviar el correo de recuperación.";
    }
    if (includes("login")) {
      return "Error al iniciar sesión. Por favor, intenta nuevamente.";
    }
    if (includes("register", "registration")) {
      return "Error al crear la cuenta. Por favor, intenta nuevamente.";
    }

    // Default friendly message
    return "Ocurrió un error. Por favor, verifica tus datos e intenta nuevamente.";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-family-sora">
      {/* Backdrop */}
      <div
        className="fixed inset-0 backdrop-blur-sm"
        style={{ backgroundColor: "rgba(38,78,96,0.45)" }}
        onClick={onClose}
      ></div>
      {/* Modal */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="relative bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden animate-fadeInScale"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute top-3 right-3 cursor-pointer text-blue-2 hover:text-gold hover:scale-150 transition-all z-10"
            onClick={onClose}
            aria-label="Close"
          >
            <IoIosClose size={26} />
          </button>
          {/* Header */}
          <div className="p-5">
            <h2 className="text-center text-xl font-bold font-family-comfortaa text-blue-1">
              {getModalTitle(isLogin, showReset)}
            </h2>
            <p className="text-center text-gray-1 mt-2 text-sm">
              {getModalSubtitle(isLogin, showReset)}
            </p>
          </div>
          {/* Content */}
          <div className="flex-1 overflow-y-auto px-5 pb-5 max-h-[60vh]">
            {/* Global Error Message */}
            {error && !showReset && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg animate-shake">
                <p className="text-red-600 text-sm font-family-sora">
                  {getErrorMessage(error)}
                </p>
              </div>
            )}

            {/* Password Recovery Form */}
            {showReset ? (
              <form onSubmit={handleResetSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-blue-1 font-family-comfortaa">
                    Email
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-1" />
                    <input
                      type="email"
                      name="resetEmail"
                      value={resetEmail}
                      onChange={handleResetChange}
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-2 ${
                        resetError ? "border-red-500" : "border-gray-2"
                      }`}
                      placeholder="tu@email.com"
                      disabled={loading}
                    />
                  </div>
                  {resetError && (
                    <p className="text-red-500 text-xs mt-1">{resetError}</p>
                  )}
                  {resetSuccess && (
                    <p className="text-green-600 text-xs mt-1">
                      {resetSuccess}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-2 text-white px-6 py-2 rounded-lg font-family-sora hover:bg-gold hover:text-blue-1 hover:scale-105 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Enviando..." : "Enviar correo de recuperación"}
                </button>
                <div className="text-center mt-6">
                  <button
                    type="button"
                    onClick={handleBackToLogin}
                    className="text-blue-2 hover:text-gold hover:underline transition-colors text-sm"
                  >
                    Volver a iniciar sesión
                  </button>
                </div>
              </form>
            ) : (
              <>
                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLogin && (
                    <div>
                      <label className="block text-sm font-medium mb-1 text-blue-1 font-family-comfortaa">
                        Nombre completo
                      </label>
                      <div className="relative">
                        <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-1" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-2 ${
                            errors.name ? "border-red-500" : "border-gray-2"
                          }`}
                          placeholder="Tu nombre completo"
                          disabled={loading}
                        />
                      </div>
                      {errors.name && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.name}
                        </p>
                      )}
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium mb-1 text-blue-1 font-family-comfortaa">
                      Email
                    </label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-1" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-2 ${
                          errors.email ? "border-red-500" : "border-gray-2"
                        }`}
                        placeholder="tu@email.com"
                        disabled={loading}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-blue-1 font-family-comfortaa">
                      Contraseña
                    </label>
                    <div className="relative">
                      <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-1" />
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-2 ${
                          errors.password ? "border-red-500" : "border-gray-2"
                        }`}
                        placeholder="••••••••"
                        disabled={loading}
                      />
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.password}
                      </p>
                    )}
                  </div>
                  {!isLogin && (
                    <div>
                      <label className="block text-sm font-medium mb-1 text-blue-1 font-family-comfortaa">
                        Confirmar contraseña
                      </label>
                      <div className="relative">
                        <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-1" />
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-2 ${
                            errors.confirmPassword
                              ? "border-red-500"
                              : "border-gray-2"
                          }`}
                          placeholder="••••••••"
                          disabled={loading}
                        />
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-2 text-white px-6 py-2 rounded-lg font-family-sora hover:bg-gold hover:text-blue-1 hover:scale-105 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading
                      ? "Cargando..."
                      : isLogin
                        ? "Iniciar Sesión"
                        : "Registrarse"}
                  </button>
                </form>
                {/* Divider */}
                <div className="flex items-center my-6">
                  <div className="flex-1 border-t border-gray-2"></div>
                  <span className="px-4 text-sm text-gray-1">O</span>
                  <div className="flex-1 border-t border-gray-2"></div>
                </div>
                {/* Google Login */}
                <GoogleLoginButton
                  onClick={handleGoogleLogin}
                  loading={loading}
                  disabled={loading}
                />
                {/* Switch mode y reset */}
                <div className="text-center mt-6 space-y-2">
                  <button
                    onClick={handleSwitchMode}
                    disabled={loading}
                    className="text-blue-2 hover:text-gold hover:underline transition-colors text-sm"
                  >
                    {isLogin
                      ? "¿No tienes cuenta? Regístrate"
                      : "¿Ya tienes cuenta? Inicia sesión"}
                  </button>
                  {isLogin && (
                    <button
                      type="button"
                      onClick={handleShowReset}
                      className="block w-full text-blue-2 hover:text-gold hover:underline transition-colors text-xs mt-2"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

LoginModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default LoginModal;
