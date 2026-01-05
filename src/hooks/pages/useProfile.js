import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  loadUserProfile,
  saveProfileChanges,
  updateAddressAtIndex,
  removeAddressAtIndex,
  createEmptyAddress,
  prepareUserDataForEdit,
} from "../../services/users/profileService";
import {
  deleteCurrentAccount,
  reauthenticateUser,
  requestPasswordReset as requestPasswordResetService,
} from "../../services/auth/accountService";

/**
 * Custom hook for profile management
 * Encapsulates all profile-related business logic and state management
 */
export const useProfile = () => {
  const { user, updateUserProfile, refreshUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editFormData, setEditFormData] = useState(null);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [showResetPasswordConfirm, setShowResetPasswordConfirm] =
    useState(false);
  const [showDeleteAccountConfirm, setShowDeleteAccountConfirm] =
    useState(false);
  const [showReauthModal, setShowReauthModal] = useState(false);
  const [reauthPassword, setReauthPassword] = useState("");
  const [isReauthenticating, setIsReauthenticating] = useState(false);

  /**
   * Load user profile data on mount or when user changes
   */
  useEffect(() => {
    const fetchData = async () => {
      if (user && user.uid) {
        try {
          const { userData: loadedUserData, editFormData: loadedEditFormData } =
            await loadUserProfile(user.uid);
          setUserData(loadedUserData);
          setEditFormData(loadedEditFormData);
        } catch (e) {
          console.error("Error fetching user profile:", e);
          setUserData(null);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  /**
   * Handle address field changes
   */
  const handleAddressChange = (idx, e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    setEditFormData((prev) => ({
      ...prev,
      addresses: updateAddressAtIndex(prev.addresses, idx, name, fieldValue),
    }));
  };

  /**
   * Add a new empty address
   */
  const handleAddAddress = () => {
    setEditFormData((prev) => ({
      ...prev,
      addresses: [...(prev.addresses || []), createEmptyAddress()],
    }));
  };

  /**
   * Remove address at index
   */
  const handleRemoveAddress = (idx) => {
    setEditFormData((prev) => ({
      ...prev,
      addresses: removeAddressAtIndex(prev.addresses, idx),
    }));
  };

  /**
   * Save profile changes
   */
  const handleSaveProfile = async () => {
    setError(null);
    setSuccess(null);
    setIsSaving(true);

    try {
      const updatedData = await saveProfileChanges({
        user,
        editFormData,
        updateUserProfile,
        refreshUser,
      });

      setUserData(updatedData);
      setEditFormData(prepareUserDataForEdit(updatedData));
      setIsEditingProfile(false);
      setSuccess("Cambios guardados exitosamente");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error saving profile:", err);
      setError("Error al guardar los cambios. Intenta nuevamente.");
      setTimeout(() => setError(null), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Cancel edit mode
   */
  const handleCancelEdit = () => {
    setEditFormData(prepareUserDataForEdit(userData));
    setIsEditingProfile(false);
    setError(null);
  };

  /**
   * Start editing profile
   */
  const handleStartEdit = () => {
    setIsEditingProfile(true);
  };

  /**
   * Request password reset
   */
  const handleResetPassword = async () => {
    setShowResetPasswordConfirm(false);
    setIsResettingPassword(true);
    try {
      await requestPasswordResetService(userData?.email);
      setSuccess(
        "Email de recuperación enviado. Revisa tu bandeja de entrada (también el correo no deseado o SPAM)."
      );
      setTimeout(() => setSuccess(null), 4000);
    } catch (err) {
      console.error("Error resetting password:", err);
      setError("Error al enviar el email. Intenta nuevamente.");
      setTimeout(() => setError(null), 4000);
    } finally {
      setIsResettingPassword(false);
    }
  };

  /**
   * Delete user account
   */
  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true);
    try {
      await deleteCurrentAccount(user);
      setShowDeleteAccountConfirm(false);
      setIsDeletingAccount(false);
      return true; // Signal successful deletion for navigation
    } catch (err) {
      console.error("Error deleting account:", err);
      // Check if the error is due to requiring recent login
      if (
        err.code === "auth/requires-recent-login" ||
        err.message.includes("requires-recent-login")
      ) {
        setError(null);
        setIsDeletingAccount(false);
        setShowReauthModal(true);
        return false;
      }
      setError("Error al eliminar la cuenta. Intenta nuevamente.");
      setIsDeletingAccount(false);
      setTimeout(() => setError(null), 4000);
      return false;
    }
  };

  /**
   * Handle re-authentication for account deletion
   */
  const handleReauthenticate = async () => {
    if (!reauthPassword) {
      setError("Por favor ingresa tu contraseña");
      return;
    }

    setIsReauthenticating(true);
    try {
      await reauthenticateUser(userData?.email, reauthPassword);
      setShowReauthModal(false);
      setReauthPassword("");
      setError(null);
      setIsReauthenticating(false);

      // Now proceed with deletion after successful re-authentication
      setIsDeletingAccount(true);
      setShowFinalDeleteConfirm(true);
      try {
        await deleteCurrentAccount(user);
        return true;
      } catch (err) {
        console.error("Error deleting account after re-auth:", err);
        setError("Error al eliminar la cuenta. Intenta nuevamente.");
        setIsDeletingAccount(false);
        setTimeout(() => setError(null), 4000);
        return false;
      }
    } catch (err) {
      console.error("Re-authentication error:", err);
      setError(err.message || "Error al re-autenticar. Intenta nuevamente.");
      setIsReauthenticating(false);
      setTimeout(() => setError(null), 4000);
      return false;
    }
  };

  /**
   * Update a single field in edit form
   */
  const updateEditField = (field, value) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return {
    // State
    userData,
    loading,
    isEditingProfile,
    isSaving,
    error,
    success,
    editFormData,
    isResettingPassword,
    isDeletingAccount,
    showResetPasswordConfirm,
    showDeleteAccountConfirm,
    showReauthModal,
    reauthPassword,
    isReauthenticating,

    // Actions
    handleAddressChange,
    handleAddAddress,
    handleRemoveAddress,
    handleSaveProfile,
    handleCancelEdit,
    handleStartEdit,
    handleResetPassword,
    handleDeleteAccount,
    handleReauthenticate,
    updateEditField,
    setShowResetPasswordConfirm,
    setShowDeleteAccountConfirm,
    setShowReauthModal,
    setReauthPassword,
  };
};
