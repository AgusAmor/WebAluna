import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { showCustomToast } from "../../services/ui/toastService.jsx";
import {
  notifyAuth,
  notifyOrders,
  notifyProfile,
} from "../../services/ui/notificationService";
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
import {
  getUserOrders,
  updateOrderStatus,
  deleteOrder,
} from "../../services/firebase/firebaseOrderService";
import { validateEmailExistence } from "../../services/validationService";
import { validateAddressStrict } from "../../services/mapbox/geocodingService";

/**
 * Custom hook for profile management
 * Encapsulates all profile-related business logic and state management
 */
export const useProfile = () => {
  const { user, updateUserProfile, refreshUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Modal & Selection States
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showFullHistory, setShowFullHistory] = useState(false);
  const [showFinalDeleteConfirm, setShowFinalDeleteConfirm] = useState(false);

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

  // Auto-open order modal if query param exists
  useEffect(() => {
    const orderNumberToOpen = searchParams.get("openOrder");
    if (orderNumberToOpen && userOrders && userOrders.length > 0) {
      const order = userOrders.find(
        (o) =>
          o.orderNumber === orderNumberToOpen ||
          o.orderNumber === parseInt(orderNumberToOpen),
      );

      if (order) {
        setSelectedOrder(order);
        setShowOrderDetails(true);
        // Clear param so it doesn't reopen on reload
        setSearchParams({}, { replace: true });
      }
    }
  }, [searchParams, userOrders, setSearchParams]);

  const confirmDeleteAccount = () => {
    setShowDeleteAccountConfirm(false);
    setShowFinalDeleteConfirm(true);
  };

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
      if (user && user.uid && typeof user.getIdToken === "function") {
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
      // Validate email existence if it changed
      if (editFormData?.email && editFormData.email !== userData.email) {
        const emailValidation = await validateEmailExistence(
          editFormData.email,
        );
        if (emailValidation !== true) {
          setError(
            typeof emailValidation === "string"
              ? emailValidation
              : "Email inválido",
          );
          setIsSaving(false);
          return;
        }
      }

      // Add strict validation for all addresses
      if (editFormData?.addresses && editFormData.addresses.length > 0) {
        for (let i = 0; i < editFormData.addresses.length; i++) {
          const addr = editFormData.addresses[i];
          const addressValidation = await validateAddressStrict(addr);
          if (!addressValidation.isValid) {
            // Include a helpful identifier if there are multiple addresses
            const prefix =
              editFormData.addresses.length > 1 ? `Dirección ${i + 1}: ` : "";
            setError(`${prefix}${addressValidation.reason}`);
            setIsSaving(false);
            return;
          }
        }
      }

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
   * Start editing profile and add empty address form
   */
  const handleStartEditWithAddress = () => {
    setIsEditingProfile(true);
    // Add empty address immediately after activating edit mode
    setEditFormData((prev) => ({
      ...prev,
      addresses: [...(prev.addresses || []), createEmptyAddress()],
    }));
  };

  /**
   * Request password reset
   */
  const handleResetPassword = async () => {
    setShowResetPasswordConfirm(false);
    setIsResettingPassword(true);
    try {
      await requestPasswordResetService(userData?.email);
      notifyAuth.passwordResetSent();
    } catch (err) {
      notifyProfile.emailError();
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

  const executeFinalDeleteAccount = async () => {
    const result = await handleDeleteAccount();

    if (result) {
      setShowFinalDeleteConfirm(false);
      // Show toast before navigation
      notifyAuth.accountDeleted();
      // Small delay to ensure toast is visible before navigating
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 500);
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
    if (!orderToCancel || !user || typeof user.getIdToken !== "function")
      return;

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
        token,
      );

      // Update local state with the complete updated order from backend
      setUserOrders((prevOrders) =>
        prevOrders.map((o) =>
          o.id === orderToCancel.id ? { ...o, ...updatedOrder } : o,
        ),
      );

      notifyOrders.cancelSuccess();
      setShowCancelOrderConfirm(false);
      setOrderToCancel(null);
    } catch (err) {
      console.error("Error cancelling order:", err);
      notifyOrders.cancelError(err.message);
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
    handleStartEditWithAddress,
    handleResetPassword,
    handleDeleteAccount,
    updateEditField,
    handleCancelOrder,
    handleConfirmCancelOrder,
    handleCancelOrderCancel,
    setShowResetPasswordConfirm,
    setShowDeleteAccountConfirm,

    // New exports
    selectedOrder,
    setSelectedOrder,
    showOrderDetails,
    setShowOrderDetails,
    showFullHistory,
    setShowFullHistory,
    showFinalDeleteConfirm,
    setShowFinalDeleteConfirm,
    confirmDeleteAccount,
    executeFinalDeleteAccount,
  };
};
