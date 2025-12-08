/**
 * useCheckout.js
 * Custom hook for checkout and order creation process.
 * Handles order creation via Cloud Functions, validation, and error management.
 */

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { createOrder as createOrderViaCloudFunction } from "../../services/firebase/firebaseOrderService";
import { fetchUserById, updateUser } from "../../services/firebase/firebaseUserService";
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

export function useCheckout() {
  const { user } = useAuth();
  const { items, total, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  /**
   * Handles adding a new address when user doesn't have default
   * @param {Object} address - Address object to add
   * @returns {Promise<void>}
   */
  const handleAddAddressAndContinue = async (address) => {
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
      await updateUser(user.uid, {
        addresses: updatedAddresses,
      }, token);

      // Update local user profile state with the new address
      const updatedUserProfile = {
        ...currentUserProfile,
        addresses: updatedAddresses,
      };
      setUserProfile(updatedUserProfile);

      setShowAddressModal(false);
      setLoading(false);
      
      // Success - just close modal, user will click "Finalizar Compra" again
      return true;
    } catch (err) {
      const errorMessage = err.message || "Error al agregar dirección";
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  };

  /**
   * Proceeds with checkout after validating address
   * @param {Object} options - Checkout options
   * @param {Object} preLoadedUserProfile - Pre-loaded user profile to skip fetch
   * @returns {Promise<Object>} - Created order data
   */
  const proceedWithCheckout = async (options = {}, preLoadedUserProfile = null) => {
    const { deliveryMethod = "shipping", shippingCost = 0 } = options;

    try {
      setLoading(true);
      setError(null);

      // Validate that user is authenticated
      if (!user || !user.uid) {
        throw new Error("Debes estar autenticado para completar la compra");
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

      // Get full user profile from Firestore for address and complete info
      // Use preLoadedUserProfile if provided (e.g., when coming from handleAddAddressAndContinue)
      let currentUserProfile = preLoadedUserProfile || userProfile;
      if (!currentUserProfile) {
        try {
          currentUserProfile = await fetchUserById(user.uid);
          setUserProfile(currentUserProfile);
        } catch (err) {
          // If fetchUserById fails, use available user data
          console.warn("Could not fetch full user profile:", err);
          currentUserProfile = user;
        }
      }

      // Check if user has default address
      if (!hasDefaultAddress(currentUserProfile)) {
        setShowAddressModal(true);
        setLoading(false);
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

      // Clear cart after successful order creation
      clearCart();

      setLoading(false);
      return createdOrder;
    } catch (err) {
      const errorMessage = err.message || "Error al procesar la compra";
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  };

  /**
   * Main checkout handler
   */
  const handleCheckout = async (options = {}) => {
    return proceedWithCheckout(options);
  };

  return {
    handleCheckout,
    loading,
    error,
    setError,
    showAddressModal,
    setShowAddressModal,
    handleAddAddressAndContinue,
  };
}
