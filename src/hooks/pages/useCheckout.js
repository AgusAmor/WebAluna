/**
 * useCheckout.js
 * Custom hook for checkout page logic
 * Handles user profile loading, delivery method selection, order creation, and cart management
 */

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { createOrder as createOrderViaCloudFunction } from "../../services/firebase/firebaseOrderService";
import {
  fetchUserById,
  updateUser,
} from "../../services/firebase/firebaseUserService";
import {
  generateOrderNumber,
  createOrderSummary,
  formatOrderItems,
  createInitialStatusHistory,
  extractCustomerInfo,
  extractShippingAddress,
  validateOrderData,
  hasDefaultAddress,
} from "../../services/orders/orderService";
import { showCustomToast } from "../../services/ui/toastService.jsx";

export function useCheckout() {
  const { user } = useAuth();
  const { items, total, clearCart, updateQuantity, removeItem } = useCart();

  const [userProfile, setUserProfile] = useState(null);
  const [deliveryMethod, setDeliveryMethod] = useState("shipping");
  const [shippingCost] = useState(0);
  const [profileLoading, setProfileLoading] = useState(true);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);

  /**
   * Load user profile on mount
   */
  useEffect(() => {
    const loadUserProfile = async () => {
      if (user?.uid) {
        try {
          const profile = await fetchUserById(user.uid);
          setUserProfile(profile);
        } catch (err) {
          console.warn("Could not fetch user profile:", err);
          setUserProfile(null);
        } finally {
          setProfileLoading(false);
        }
      }
    };

    loadUserProfile();
  }, [user?.uid]);

  /**
   * Handle delivery method change
   */
  const handleDeliveryMethodChange = (method) => {
    setDeliveryMethod(method);
    // If switching to shipping and no default address, show address modal
    if (
      method === "shipping" &&
      userProfile &&
      !hasDefaultAddress(userProfile)
    ) {
      setShowAddressModal(true);
    }
  };

  /**
   * Handles adding a new address when user doesn't have default
   * @param {Object} address - Address object to add
   * @returns {Promise<void>}
   */
  const handleAddressAdded = async (address) => {
    try {
      setLoading(true);
      setError(null);

      if (!user || !user.uid) {
        throw new Error("Usuario no autenticado");
      }

      // Get Firebase Auth token
      const token = await user.getIdToken();
      if (!token) {
        throw new Error("Error de autenticación");
      }

      // Ensure we have the latest user profile
      let currentUserProfile = userProfile;
      if (!currentUserProfile) {
        try {
          currentUserProfile = await fetchUserById(user.uid);
        } catch (err) {
          console.warn("Could not fetch user profile:", err);
          currentUserProfile = { uid: user.uid };
        }
      }

      // Add the new address to user profile
      const updatedAddresses = currentUserProfile?.addresses
        ? [...currentUserProfile.addresses, address]
        : [address];

      // Update user in Firestore via Cloud Function
      await updateUser(user.uid, { addresses: updatedAddresses }, token);

      // Update local user profile state with the new address
      const updatedUserProfile = {
        ...currentUserProfile,
        addresses: updatedAddresses,
      };
      setUserProfile(updatedUserProfile);

      setShowAddressModal(false);
      setLoading(false);

      showCustomToast.success("Dirección agregada exitosamente");

      return true;
    } catch (err) {
      const errorMessage = err.message || "Error al agregar dirección";
      setError(errorMessage);
      setLoading(false);
      showCustomToast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  /**
   * Handle pay button click
   */
  const handlePayClick = async () => {
    // Validate delivery method requirements
    if (
      deliveryMethod === "shipping" &&
      userProfile &&
      !hasDefaultAddress(userProfile)
    ) {
      showCustomToast.error(
        "Por favor agrega una dirección antes de finalizar el pedido"
      );
      setShowAddressModal(true);
      return;
    }

    setLoadingOrder(true);
    try {
      // Validate that user is authenticated
      if (!user || !user.uid) {
        throw new Error("Debes estar autenticado para completar el pedido");
      }

      // Get Firebase Auth token
      const token = await user.getIdToken();
      if (!token) {
        throw new Error("Error de autenticación");
      }

      // Validate that cart has items
      if (!items || items.length === 0) {
        throw new Error("El carrito está vacío");
      }

      // Use current user profile
      let currentUserProfile = userProfile;
      if (!currentUserProfile) {
        try {
          currentUserProfile = await fetchUserById(user.uid);
        } catch (err) {
          console.warn("Could not fetch full user profile:", err);
          currentUserProfile = user;
        }
      }

      // Check if user has default address for shipping
      if (
        deliveryMethod === "shipping" &&
        !hasDefaultAddress(currentUserProfile)
      ) {
        setShowAddressModal(true);
        throw new Error("Por favor agrega una dirección predeterminada");
      }

      // Build order object
      const orderData = {
        orderNumber: generateOrderNumber(),
        userId: user.uid,
        customerInfo: extractCustomerInfo(currentUserProfile),
        status: "pending",
        items: formatOrderItems(items),
        summary: createOrderSummary(items, shippingCost),
        delivery: {
          method: deliveryMethod,
          shippingAddress:
            deliveryMethod === "shipping"
              ? extractShippingAddress(currentUserProfile)
              : null,
        },
        statusHistory: createInitialStatusHistory(new Date()),
      };

      // Validate order data
      const validation = validateOrderData(orderData);
      if (!validation.isValid) {
        throw new Error(`Validación fallida: ${validation.errors.join(", ")}`);
      }

      // Create order via Cloud Function (with security validation on backend)
      const createdOrder = await createOrderViaCloudFunction(orderData, token);

      showCustomToast.success(
        `Orden ${createdOrder.orderNumber} realizada con éxito, pronto seras notificado por mail sobre el estado de tu pedido..`
      );

      // Clear cart after successful order creation
      clearCart();

      return createdOrder;
    } catch (err) {
      const errorMessage = err.message || "Error al procesar el pedido";
      setError(errorMessage);
      showCustomToast.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoadingOrder(false);
    }
  };

  return {
    // User and profile data
    user,
    userProfile,
    profileLoading,
    // Cart data
    items,
    total,
    updateQuantity,
    removeItem,
    // Delivery method
    deliveryMethod,
    shippingCost,
    handleDeliveryMethodChange,
    // Address modal
    showAddressModal,
    setShowAddressModal,
    handleAddressAdded,
    // Checkout
    handlePayClick,
    loading,
    error,
    setError,
    loadingOrder,
    hasDefaultAddress: userProfile ? hasDefaultAddress(userProfile) : false,
  };
}
