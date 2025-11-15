import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../../context/AuthContext";
import { GoogleLoginButton } from "../ui";
import { FiMail, FiLock, FiUser } from "react-icons/fi";

const LoginModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const {
    login,
    loginWithGoogle,
    register,
    loading,
    error,
    user,
    isAuthenticated,
    requestPasswordReset,
  } = useAuth();
  const navigate = useNavigate();

  // Close modal automatically when user logs in successfully
  useEffect(() => {
    if (isAuthenticated && user && isOpen) {
      // Si el usuario tiene rol admin, navega a /admin
      if (user.role === "admin") {
        navigate("/admin");
      }
      // Cierra el modal y resetea el formulario
      onClose();
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setErrors({});
    }
  }, [isAuthenticated, user, isOpen, onClose, navigate]);

  if (!isOpen) return null;

  // Handles input changes for login/register form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handles input changes for password reset form
  const handleResetChange = (e) => {
    setResetEmail(e.target.value);
    if (resetError) setResetError("");
    if (resetSuccess) setResetSuccess("");
  };

  // Handles password reset form submission (visual only)
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setResetError("");
    setResetSuccess("");
    try {
      await requestPasswordReset(resetEmail);
      setResetSuccess("Se ha enviado el correo de recuperación");
    } catch (err) {
      setResetError(
        err.message || "No se pudo enviar el correo. Verifica el email."
      );
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!isLogin && !formData.name.trim()) {
      newErrors.name = "El nombre es requerido";
    }
    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }
    if (!formData.password) {
      newErrors.password = "La contraseña es requerida";
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }
    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.email, formData.password, formData.name);
      }
      // Modal se cierra automáticamente por useEffect
    } catch (err) {
      // El error ya se muestra por el contexto
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      // Modal se cierra automáticamente por useEffect
    } catch (err) {
      // El error ya se muestra por el contexto
    }
  };

  const handleSwitchMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setErrors({});
  };

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
          className="relative bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-5">
            <h2 className="text-center text-xl font-bold font-family-comfortaa text-blue-1">
              {showReset
                ? "Reestablecer contraseña"
                : isLogin
                ? "Iniciar Sesión"
                : "Registrarse"}
            </h2>
            <p className="text-center text-gray-1 mt-2 text-sm">
              {showReset
                ? "Ingresa tu email para recibir instrucciones"
                : isLogin
                ? "Accede a tu cuenta"
                : "Crea una nueva cuenta"}
            </p>
          </div>
          {/* Content */}
          <div className="flex-1 overflow-y-auto px-5 pb-5 max-h-[60vh]">
            {/* Error message */}
            {!showReset && error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}
            {/* Formulario de recuperación */}
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
                  {loading ? "Enviando..." : "Enviar instrucciones"}
                </button>
                <div className="text-center mt-6">
                  <button
                    type="button"
                    onClick={() => setShowReset(false)}
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
                      onClick={() => setShowReset(true)}
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
