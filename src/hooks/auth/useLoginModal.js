/**
 * useLoginModal.js
 * Custom hook for managing login/register modal state and logic.
 * Encapsulates form state, validation, and authentication flow.
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
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
      // Navigate to admin panel if user is admin
      if (user.role === "admin") {
        navigate("/admin");
      }
      // Close modal and reset form
      onClose();
      setFormData(createEmptyFormData());
      setErrors({});
    }
  }, [isAuthenticated, user, isOpen, onClose, navigate]);

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
    } catch (err) {
      setResetError(
        err.message || "No se pudo enviar el correo. Verifica el email."
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

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.email, formData.password, formData.name);
      }
      // Modal closes automatically via useEffect
    } catch (err) {
      // Error is already displayed by the context
    }
  };

  /**
   * Handles Google login
   */
  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      // Modal closes automatically via useEffect
    } catch (err) {
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
