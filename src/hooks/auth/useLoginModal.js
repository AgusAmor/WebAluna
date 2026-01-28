/**
 * useLoginModal.js
 * Custom hook for managing login/register modal state and logic.
 * Encapsulates form state, validation, and authentication flow.
 */

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { showCustomToast } from "../../services/ui/toastService.jsx";
import { useAuth } from "../../context/AuthContext";
import { isUserAdmin } from "../../utils/adminUtils";
import {
  validateLoginForm,
  validateRegisterForm,
  createEmptyFormData,
} from "../../services/auth/loginService";

export function useLoginModal(isOpen, onClose) {
  const [isLogin, setIsLogin] = useState(true);
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");
  const [formData, setFormData] = useState(createEmptyFormData());
  const [errors, setErrors] = useState({});
  const [loginSuccessHandled, setLoginSuccessHandled] = useState(false);
  const lastErrorShownRef = useRef(null);
  const loginAttemptTimeRef = useRef(null);

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

  console.log(
    "useLoginModal render - isOpen:",
    isOpen,
    "loading:",
    loading,
    "user:",
    user?.email,
    "isAuthenticated:",
    isAuthenticated,
    "error:",
    error,
  );

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      console.log("Modal abierto, reseteando flags");
      lastErrorShownRef.current = null;
      loginAttemptTimeRef.current = null;
      setLoginSuccessHandled(false);
    }
  }, [isOpen]);

  /**
   * Handles input changes for login/register form
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  /**
   * Handles input changes for password reset form
   */
  const handleResetChange = (e) => {
    setResetEmail(e.target.value);
    if (resetError) setResetError("");
    if (resetSuccess) setResetSuccess("");
  };

  /**
   * Handles password reset form submission
   */
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setResetError("");
    setResetSuccess("");
    try {
      await requestPasswordReset(resetEmail);
      setResetSuccess("Se ha enviado el correo de recuperación");
      showCustomToast.success(
        "Correo de recuperación enviado. Revisa tu bandeja de entrada.",
      );
      // Reset form after short delay
      setTimeout(() => {
        handleBackToLogin();
      }, 2000);
    } catch (err) {
      setResetError(
        err.message || "No se pudo enviar el correo. Verifica el email.",
      );
    }
  };

  /**
   * Validates form based on current mode
   */
  const validateForm = () => {
    const newErrors = isLogin
      ? validateLoginForm(formData)
      : validateRegisterForm(formData);

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles login/register form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    loginAttemptTimeRef.current = Date.now();

    try {
      let result;
      if (isLogin) {
        result = await login(formData.email, formData.password);
      } else {
        result = await register(
          formData.email,
          formData.password,
          formData.name,
        );
      }

      console.log("Login/registro exitoso, resultado:", result);

      // Show welcome toast immediately after successful login
      const welcomeMessage = `¡Bienvenido${
        result?.displayName ? " " + result.displayName.split(" ")[0] : ""
      }!`;

      showCustomToast.success(welcomeMessage);

      // Small delay then navigate and close
      setTimeout(() => {
        // Navigate based on user role
        if (isUserAdmin(result)) {
          console.log("Navegando a /admin");
          navigate("/admin");
        } else {
          console.log("Navegando a /");
          navigate("/");
        }

        // Close modal and reset
        onClose();
        setFormData(createEmptyFormData());
        setErrors({});
        loginAttemptTimeRef.current = null;
      }, 300);
    } catch (err) {
      console.error("Error en login/registro:", err);
      // Error is already displayed by the context
    }
  };

  /**
   * Handles Google login
   */
  const handleGoogleLogin = async () => {
    loginAttemptTimeRef.current = Date.now();

    try {
      const result = await loginWithGoogle();
      console.log("Google login exitoso, resultado:", result);

      // Show welcome toast
      const welcomeMessage = `¡Bienvenido${
        result?.displayName ? " " + result.displayName.split(" ")[0] : ""
      }!`;

      showCustomToast.success(welcomeMessage);

      // Navigate and close
      setTimeout(() => {
        if (isUserAdmin(result)) {
          console.log("Navegando a /admin");
          navigate("/admin");
        } else {
          console.log("Navegando a /");
          navigate("/");
        }

        onClose();
        setFormData(createEmptyFormData());
        setErrors({});
        loginAttemptTimeRef.current = null;
      }, 300);
    } catch (err) {
      console.error("Error en Google login:", err);
      // Error is already displayed by the context
    }
  };

  /**
   * Switches between login and register modes
   */
  const handleSwitchMode = () => {
    setIsLogin(!isLogin);
    setFormData(createEmptyFormData());
    setErrors({});
  };

  /**
   * Shows password reset form
   */
  const handleShowReset = () => {
    setShowReset(true);
    setResetEmail("");
    setResetError("");
    setResetSuccess("");
  };

  /**
   * Hides password reset form
   */
  const handleBackToLogin = () => {
    setShowReset(false);
    setResetEmail("");
    setResetError("");
    setResetSuccess("");
  };

  return {
    // State
    isLogin,
    showReset,
    resetEmail,
    resetError,
    resetSuccess,
    formData,
    errors,
    loading,
    error,
    // Handlers
    handleChange,
    handleResetChange,
    handleResetSubmit,
    handleSubmit,
    handleGoogleLogin,
    handleSwitchMode,
    handleShowReset,
    handleBackToLogin,
  };
}
