import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { showCustomToast } from "../../services/ui/toastService.jsx";
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
  requestPasswordReset as requestPasswordResetService,
} from "../../services/auth/accountService";
import { getUserOrders, updateOrderStatus, deleteOrder } from "../../services/firebase/firebaseOrderService";

/**
 * Custom hook for profile management
 * Encapsulates all profile-related business logic and state management
 */
export const useProfile = () => {
  const { user, updateUserProfile, refreshUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
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
  const [showCancelOrderConfirm, setShowCancelOrderConfirm] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [isCancellingOrder, setIsCancellingOrder] = useState(false);

  /**
   * Load user profile data on mount or when user changes
   * Includes retry logic for race conditions when profile is just created
   */
  useEffect(() => {
    const fetchData = async () => {
      if (user && user.uid) {
        let retries = 3;
        let lastError = null;

        while (retries > 0) {
          try {
            const {
              userData: loadedUserData,
              editFormData: loadedEditFormData,
            } = await loadUserProfile(user.uid);
            setUserData(loadedUserData);
            setEditFormData(loadedEditFormData);
            setLoading(false);
            return; // Success, exit the function
          } catch (e) {
            lastError = e;
            // console.warn(
            //   `Error fetching user profile (attempt ${4 - retries}/3):`,
            //   e
            // );
            retries--;

            // If there are retries left, wait before trying again
            if (retries > 0) {
              await new Promise((resolve) => setTimeout(resolve, 1000));
            }
          }
        }

        // All retries failed
        // console.error("Error fetching user profile after retries:", lastError);
        setUserData(null);
        setLoading(false);
      } else {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  /**
   * Load user orders on mount
   */
  useEffect(() => {
    const fetchOrders = async () => {
      if (user && user.uid) {
        try {
          setLoadingOrders(true);
          const token = await user.getIdToken();
          const response = await getUserOrders(token);
          
          if (response && response.orders) {
            // Sort orders by date (newest first)
            const sortedOrders = response.orders.sort((a, b) => {
              const dateA = new Date(a.createdAt).getTime();
              const dateB = new Date(b.createdAt).getTime();
              return dateB - dateA;
            });
            setUserOrders(sortedOrders);
          }
        } catch (err) {
          console.error("Error fetching user orders:", err);
          setUserOrders([]);
        } finally {
          setLoadingOrders(false);
        }
      }
    };

    fetchOrders();
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
      // console.error("Error saving profile:", err);
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
      showCustomToast.success(
        "Correo de recuperación enviado. Revisa tu bandeja de entrada (también el correo no deseado o SPAM)."
      );
    } catch (err) {
      showCustomToast.error("Error al enviar el email. Intenta nuevamente.");
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
      // console.error("Error deleting account:", err);
      // Check if the error is due to requiring recent login
      if (
        err.code === "auth/requires-recent-login" ||
        err.message.includes("requires-recent-login")
      ) {
        setError("Se requiere re-autenticación. Por favor intenta de nuevo.");
        setIsDeletingAccount(false);
        setTimeout(() => setError(null), 4000);
        return false;
      }
      setError("Error al eliminar la cuenta. Intenta nuevamente.");
      setIsDeletingAccount(false);
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

  /**
   * Cancel a pending order
   */
  const handleCancelOrder = async (order) => {
    setOrderToCancel(order);
    setShowCancelOrderConfirm(true);
  };

  /**
   * Confirm cancel order
   */
  const handleConfirmCancelOrder = async () => {
    if (!orderToCancel) return;

    try {
      setIsCancellingOrder(true);
      const token = await user.getIdToken();
      const updatedOrder = await updateOrderStatus(
        {
          orderId: orderToCancel.id,
          newStatus: "cancelled",
          note: "Pedido cancelado por el cliente",
          updatedBy: user.uid,
        },
        token
      );
      
      // Update local state with the complete updated order from backend
      setUserOrders((prevOrders) =>
        prevOrders.map((o) =>
          o.id === orderToCancel.id ? { ...o, ...updatedOrder } : o
        )
      );
      
      showCustomToast.success("Pedido cancelado exitosamente");
      setShowCancelOrderConfirm(false);
      setOrderToCancel(null);
    } catch (err) {
      console.error("Error cancelling order:", err);
      showCustomToast.error("Error al cancelar el pedido. Intenta de nuevo.");
    } finally {
      setIsCancellingOrder(false);
    }
  };

  /**
   * Cancel the cancel operation
   */
  const handleCancelOrderCancel = () => {
    setShowCancelOrderConfirm(false);
    setOrderToCancel(null);
  };

  return {
    // State
    userData,
    userOrders,
    loading,
    loadingOrders,
    isEditingProfile,
    isSaving,
    error,
    success,
    editFormData,
    isResettingPassword,
    isDeletingAccount,
    showResetPasswordConfirm,
    showDeleteAccountConfirm,
    showCancelOrderConfirm,
    orderToCancel,
    isCancellingOrder,

    //Handlers
    handleAddressChange,
    handleAddAddress,
    handleRemoveAddress,
    handleSaveProfile,
    handleCancelEdit,
    handleStartEdit,
    handleResetPassword,
    handleDeleteAccount,
    updateEditField,
    handleCancelOrder,
    handleConfirmCancelOrder,
    handleCancelOrderCancel,
    setShowResetPasswordConfirm,
    setShowDeleteAccountConfirm,
  };
};
