/**
 * useLoginModal.js
 * Custom hook for managing login/register modal state and logic.
 * Encapsulates form state, validation, and authentication flow.
 */

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
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

  // Reset error tracking when modal opens
  useEffect(() => {
    if (isOpen) {
      lastErrorShownRef.current = null;
      loginAttemptTimeRef.current = null;
    }
  }, [isOpen]);

  // Handle login result (success or error)
  useEffect(() => {
    if (!isOpen || loading) return; // Wait for loading to finish

    // Check if there was a recent login attempt
    const wasRecentLoginAttempt =
      loginAttemptTimeRef.current &&
      Date.now() - loginAttemptTimeRef.current < 3000;

    // If there's an error from a recent login attempt, just mark it as shown
    // The error will be displayed in the modal automatically
    if (error && wasRecentLoginAttempt) {
      lastErrorShownRef.current = error;
      return; // Keep modal open, don't do anything else
    }

    // If login was successful (user exists and is authenticated with no error)
    if (user && isAuthenticated && !error) {
      // If there was a recent login attempt, wait a bit to ensure no error comes
      if (wasRecentLoginAttempt) {
        const timer = setTimeout(() => {
          // After delay, check again if there's still no error
          if (!error) {
            toast.success(
              `¡Bienvenido${
                user.displayName ? " " + user.displayName.split(" ")[0] : ""
              }!`,
              {
                position: "bottom-right",
                autoClose: 3000,
              }
            );

            // Navigate to admin panel if user is admin
            if (isUserAdmin(user)) {
              navigate("/admin");
            } else {
              navigate("/");
            }

            // Close modal and reset form
            onClose();
            setFormData(createEmptyFormData());
            setErrors({});
            loginAttemptTimeRef.current = null;
          }
        }, 500);

        return () => clearTimeout(timer);
      } else {
        // No recent attempt, show success immediately
        toast.success(
          `¡Bienvenido${
            user.displayName ? " " + user.displayName.split(" ")[0] : ""
          }!`,
          {
            position: "bottom-right",
            autoClose: 3000,
          }
        );

        // Navigate to admin panel if user is admin
        if (isUserAdmin(user)) {
          navigate("/admin");
        } else {
          navigate("/");
        }

        // Close modal and reset form
        onClose();
        setFormData(createEmptyFormData());
        setErrors({});
      }
    }
  }, [loading, error, user, isAuthenticated, isOpen, onClose, navigate]);

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
      toast.success(
        "Correo de recuperación enviado. Revisa tu bandeja de entrada.",
        {
          position: "bottom-right",
          autoClose: 4000,
        }
      );
      // Reset form after short delay
      setTimeout(() => {
        handleBackToLogin();
      }, 2000);
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

    loginAttemptTimeRef.current = Date.now();

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
    loginAttemptTimeRef.current = Date.now();

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
