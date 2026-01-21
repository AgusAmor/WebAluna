/**
 * useCheckout.js
 * Custom hook for checkout page logic
 * Handles user profile loading, delivery method selection, order creation, and cart management
 */

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useShippingCost } from "../checkout/useShippingCost";
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
  const {
    shippingCost,
    calculating: calculatingShipping,
    error: shippingError,
    calculateCost: calculateShippingCost,
    reset: resetShipping,
  } = useShippingCost();

  const [userProfile, setUserProfile] = useState(null);
  const [deliveryMethod, setDeliveryMethod] = useState("shipping");
  const [profileLoading, setProfileLoading] = useState(true);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);

  /**
   * Normalize addresses by adding IDs if they don't have one
   */
  const normalizeAddresses = (profile) => {
    if (!profile?.addresses) return profile;

    const normalizedAddresses = profile.addresses.map((addr, idx) => ({
      ...addr,
      id: addr.id || `addr_${idx}_${Date.now()}`,
    }));

    return {
      ...profile,
      addresses: normalizedAddresses,
    };
  };

  /**
   * Load user profile on mount
   */
  useEffect(() => {
    const loadUserProfile = async () => {
      if (user?.uid) {
        try {
          const profile = await fetchUserById(user.uid);
          // Normalize addresses to ensure they have IDs
          const normalizedProfile = normalizeAddresses(profile);
          setUserProfile(normalizedProfile);
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
   * Calculate shipping cost when delivery method or address changes
   */
  useEffect(() => {
    if (
      deliveryMethod === "shipping" &&
      userProfile &&
      hasDefaultAddress(userProfile)
    ) {
      const defaultAddress = userProfile.addresses.find(
        (addr) => addr.isDefault,
      );
      if (defaultAddress) {
        calculateShippingCost(defaultAddress);
      }
    } else if (deliveryMethod === "pickup") {
      resetShipping();
    }
  }, [deliveryMethod, userProfile, calculateShippingCost, resetShipping]);

  /**
   * Recalculate shipping cost with a specific address
   * @param {Object} address - Address to calculate shipping for
   */
  const recalculateShippingWithAddress = (address) => {
    if (address && deliveryMethod === "shipping") {
      calculateShippingCost(address);
    }
  };

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

      // Generate a unique ID for the new address if it doesn't have one
      const addressWithId = {
        ...address,
        id:
          address.id ||
          `addr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      };

      // Add the new address to user profile
      const updatedAddresses = currentUserProfile?.addresses
        ? [...currentUserProfile.addresses, addressWithId]
        : [addressWithId];

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

      // Return the address with the generated ID
      return addressWithId;
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
   * @param {Object} shippingAddress - Selected shipping address for this checkout
   */
  const handlePayClick = async (shippingAddress) => {
    // Validate delivery method requirements
    if (
      deliveryMethod === "shipping" &&
      !shippingAddress &&
      userProfile &&
      !hasDefaultAddress(userProfile)
    ) {
      showCustomToast.error(
        "Por favor agrega una dirección antes de finalizar el pedido",
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
        customerInfo: {
          ...extractCustomerInfo(currentUserProfile),
          // Ensure email comes from authenticated user object (Firebase Auth)
          // This guarantees email is always available, even if userProfile is incomplete
          email: user.email || extractCustomerInfo(currentUserProfile).email,
        },
        status: "pending",
        items: formatOrderItems(items),
        summary: createOrderSummary(items, shippingCost),
        delivery: {
          method: deliveryMethod,
          shippingAddress:
            deliveryMethod === "shipping"
              ? shippingAddress || extractShippingAddress(currentUserProfile)
              : null,
          cost: deliveryMethod === "shipping" ? shippingCost || 0 : 0,
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
        `Orden ${createdOrder.orderNumber} realizada con éxito, pronto seras notificado por mail sobre el estado de tu pedido..`,
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
    calculatingShipping,
    shippingError,
    handleDeliveryMethodChange,
    recalculateShippingWithAddress,
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
