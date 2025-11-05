import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../../hooks/useAuth";
import { GoogleLoginButton } from "../ui";
import { FiMail, FiLock, FiUser } from "react-icons/fi";

const LoginModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const { login, loginWithGoogle, register, loading, error } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

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
      let userData;
      if (isLogin) {
        userData = await login(formData.email, formData.password);
      } else {
        userData = await register(
          formData.email,
          formData.password,
          formData.name
        );
      }

      
      await new Promise((resolve) => setTimeout(resolve, 300));

      
      if (userData?.role === "admin") {
        navigate("/admin");
      }

      onClose();
    } catch (err) {
      console.error("Auth error:", err);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const userData = await loginWithGoogle();

      
      await new Promise((resolve) => setTimeout(resolve, 300));

      
      if (userData?.role === "admin") {
        navigate("/admin");
      }

      onClose();
    } catch (err) {
      console.error("Google login error:", err);
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
      {/* Backdrop - mismo estilo que CartModal */}
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
              {isLogin ? "Iniciar Sesión" : "Registrarse"}
            </h2>
            <p className="text-center text-gray-1 mt-2 text-sm">
              {isLogin ? "Accede a tu cuenta" : "Crea una nueva cuenta"}
            </p>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-5 pb-5 max-h-[60vh]">
            {/* Error message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}

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
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
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
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
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
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
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

            {/* Switch mode */}
            <div className="text-center mt-6">
              <button
                onClick={handleSwitchMode}
                disabled={loading}
                className="text-blue-2 hover:text-gold hover:underline transition-colors text-sm"
              >
                {isLogin
                  ? "¿No tienes cuenta? Regístrate"
                  : "¿Ya tienes cuenta? Inicia sesión"}
              </button>
            </div>
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
