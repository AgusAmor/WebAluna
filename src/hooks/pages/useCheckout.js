/**
 * useCheckout.js
 * Custom hook for checkout page logic
 * Handles user profile loading, delivery method selection, order creation, and cart management
 */

import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useShippingCost } from "../checkout/useShippingCost";
import {
  createOrder as createOrderViaCloudFunction,
  cancelFailedOrder,
} from "../../services/firebase/firebaseOrderService";
import { redirectToMercadoPago } from "../../services/mercadopagoService";
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
import {
  notifyCheckout,
  notifyOrders,
} from "../../services/ui/notificationService";

export function useCheckout() {
  const navigate = useNavigate();
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
  const [showSelectAddressModal, setShowSelectAddressModal] = useState(false);
  const [showShippingInfoModal, setShowShippingInfoModal] = useState(false);
  const [selectedShippingAddress, setSelectedShippingAddress] = useState(null);

  const [showOrderConfirmModal, setShowOrderConfirmModal] = useState(false);
  const [showPaymentErrorModal, setShowPaymentErrorModal] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [returnedFromMP, setReturnedFromMP] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [pollingActive, setPollingActive] = useState(false);

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
        calculateShippingCost(defaultAddress, total);
      }
    } else if (deliveryMethod === "pickup") {
      resetShipping();
    }
  }, [
    deliveryMethod,
    userProfile,
    calculateShippingCost,
    resetShipping,
    total,
  ]);

  /**
   * Load pending order from localStorage when page loads (after MP redirect)
   */
  useEffect(() => {
    const pendingOrderId = localStorage.getItem("pendingOrderId");
    const pendingOrderData = localStorage.getItem("pendingOrderData");

    // console.log("[Checkout] useEffect - Load from localStorage");
    // console.log("[Checkout] pendingOrderId:", pendingOrderId);
    // console.log("[Checkout] pendingOrderData exists:", !!pendingOrderData);

    if (pendingOrderData) {
      try {
        const order = JSON.parse(pendingOrderData);
        // console.log(
        //   "[Checkout] Setting createdOrder from localStorage:",
        //   order.id,
        // );
        setCreatedOrder(order);
      } catch (err) {
        console.warn("[Checkout] Could not parse stored order data:", err);
      }
    }
  }, []);

  /**
   * Detect when user returns from Mercado Pago payment
   * MP redirects with query params like: ?collection_status=approved&collection_id=123
   */
  useEffect(() => {
    const collectionStatus = searchParams.get("collection_status");
    const collectionId = searchParams.get("collection_id");
    const preferenceId = searchParams.get("preference_id");

    // console.log("[Checkout] useEffect - Check MP return params");
    // console.log("[Checkout] collection_status:", collectionStatus);
    // console.log("[Checkout] collection_id:", collectionId);
    // console.log("[Checkout] preference_id:", preferenceId);
    // console.log("[Checkout] createdOrder:", createdOrder?.id);

    // Check our own mp_return marker first — it's always present on failure redirects
    // because we embed it in the back_url. MP appends its own params after ours.
    if (searchParams.get("mp_return") === "failure") {
      sessionStorage.removeItem("pendingMPRedirect");
      // Wait until user auth is restored before cancelling (fresh page load from MP)
      if (!user) return;
      // Cancel the pending order — delete it from Firebase and revert totalOrders
      const failedOrderId = localStorage.getItem("pendingOrderId");
      if (failedOrderId) {
        localStorage.removeItem("pendingOrderId");
        localStorage.removeItem("pendingOrderData");
        user
          .getIdToken()
          .then((token) => cancelFailedOrder(failedOrderId, token))
          .catch(() => {});
      }
      setReturnedFromMP(true);
      setPaymentError(
        "No pudimos procesar el pago. Por favor intente nuevamente.",
      );
      setShowPaymentErrorModal(true);
      setPollingActive(false);
      // NOTE: URL is cleared when user closes the modal (handleClosePaymentErrorModal)
      // to prevent ShippingInfoBanner from triggering while modal is open
    } else if (collectionStatus && collectionStatus !== "null") {
      // User returned from MP with a valid collection_status — clear the bfcache flag
      sessionStorage.removeItem("pendingMPRedirect");
      if (collectionStatus === "approved") {
        setReturnedFromMP(true);
        setShowOrderConfirmModal(true);
        setPollingActive(true);
        setSearchParams({}, { replace: true });
      } else if (
        collectionStatus === "rejected" ||
        collectionStatus === "cancelled"
      ) {
        // Wait until user auth is restored before cancelling (fresh page load from MP)
        if (!user) return;
        // Cancel the pending order — delete it from Firebase and revert totalOrders
        const failedOrderId = localStorage.getItem("pendingOrderId");
        if (failedOrderId) {
          localStorage.removeItem("pendingOrderId");
          localStorage.removeItem("pendingOrderData");
          user
            .getIdToken()
            .then((token) => cancelFailedOrder(failedOrderId, token))
            .catch(() => {});
        }
        setReturnedFromMP(true);
        setPaymentError(
          collectionStatus === "rejected"
            ? "El pago fue rechazado. Intentá con otro medio de pago."
            : "El pago fue cancelado.",
        );
        setShowPaymentErrorModal(true);
        setPollingActive(false);
        // NOTE: URL is cleared when user closes the modal
      } else if (collectionStatus === "pending") {
        setPollingActive(true);
        setSearchParams({}, { replace: true });
      }
    }
  }, [searchParams, createdOrder, user]);

  /**
   * Polling to detect when order status changes to "confirmed"
   * This happens when the webhook updates the order after MP webhook notification
   */
  useEffect(() => {
    if (!pollingActive || !createdOrder?.id || !user) {
      return;
    }

    const pollInterval = setInterval(async () => {
      try {
        const token = await user.getIdToken();
        const response = await fetch(
          `https://southamerica-east1-aluna-1af1f.cloudfunctions.net/getOrder?orderId=${createdOrder.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.ok) {
          const orderData = await response.json();
          // console.log(
          //   "[Checkout] Polling - Order status:",
          //   orderData.data?.status,
          // );

          // Check if order was confirmed by webhook
          if (orderData.data?.status === "confirmed") {
            // console.log("[Checkout] ✓ Order confirmed by webhook!");
            setCreatedOrder(orderData.data);
            setPollingActive(false);
            clearInterval(pollInterval);
            // Modal handled by Home.jsx if redirected there
          }
        }
      } catch (err) {
        // console.warn("[Checkout] Polling error (non-critical):", err.message);
        // Don't fail on polling errors - just continue polling
      }
    }, 2000); // Poll every 2 seconds

    return () => clearInterval(pollInterval);
  }, [pollingActive, createdOrder?.id, user]);

  /**
   * Recalculate shipping cost with a specific address
   * @param {Object} address - Address to calculate shipping for
   */
  const recalculateShippingWithAddress = (address) => {
    if (address && deliveryMethod === "shipping") {
      calculateShippingCost(address, total);
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

      notifyCheckout.addressAdded();

      // Return the address with the generated ID
      return addressWithId;
    } catch (err) {
      const errorMessage = err.message || "Error al agregar dirección";
      setError(errorMessage);
      setLoading(false);
      notifyCheckout.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  /**
   * Handle address selection from modal
   */
  const handleAddressSelected = async (selectedAddress) => {
    try {
      // If it's a new address (doesn't have an ID), add it to profile
      if (!selectedAddress.id) {
        const addedAddressWithId = await handleAddressAdded(selectedAddress);
        // Use the address with the generated ID for shipping
        setSelectedShippingAddress(addedAddressWithId);
        recalculateShippingWithAddress(addedAddressWithId);
      } else {
        // If it's an existing address, use it for this checkout (don't change default)
        setSelectedShippingAddress(selectedAddress);
        recalculateShippingWithAddress(selectedAddress);
      }
      setShowSelectAddressModal(false);
    } catch (err) {
      console.error("Error selecting address:", err);
    }
  };

  /**
   * Handle pay button click - Integrates with Mercado Pago
   * Flow: 1. Create order in Firestore (status: pending)
   *       2. Create MP preference and get redirect URL
   *       3. Redirect to MP for payment
   *       4. User completes/cancels payment on MP
   *       5. MP redirects back to /checkout with query params
   *       6. Show success/error modal based on MP status
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

      // Step 1: Create order in Firebase with "pending" status BEFORE redirecting to MP
      // This ensures the order exists even if MP doesn't send webhook
      try {
        const createdOrderData = await createOrderViaCloudFunction(
          orderData,
          token,
        );

        // console.log(
        //   "[Checkout] ✓ Order created in pending status:",
        //   createdOrderData.id,
        // );

        // Save created order to state for later reference
        setCreatedOrder(createdOrderData);

        // Also save to localStorage as backup
        localStorage.setItem(
          "pendingOrderData",
          JSON.stringify(createdOrderData),
        );
        localStorage.setItem("pendingOrderId", createdOrderData.id);

        // Step 2: Redirect to Mercado Pago for payment
        // Pass the order data WITH the actual Firebase ID
        try {
          const orderDataWithId = {
            ...orderData,
            id: createdOrderData.id, // Use the actual Firebase ID
          };

          const mpPaymentUrl = await redirectToMercadoPago(
            orderDataWithId,
            token,
          );

          // Redirect to Mercado Pago
          // Set flag so pageshow handler knows we left to MP (for browser-back detection)
          sessionStorage.setItem("pendingMPRedirect", "true");
          window.location.href = mpPaymentUrl;
        } catch (mpError) {
          // If MP redirect fails, show error modal and keep user in checkout
          const errorMessage =
            mpError.message || "Error al redirigir a Mercado Pago";
          setPaymentError(errorMessage);
          setShowPaymentErrorModal(true);
          setLoadingOrder(false);
        }
      } catch (createErr) {
        throw new Error(
          `Error al crear el pedido: ${createErr.message || "Error desconocido"}`,
        );
      }
    } catch (err) {
      const errorMessage = err.message || "Error al procesar el pedido";
      setError(errorMessage);
      setPaymentError(errorMessage);
      setShowPaymentErrorModal(true);
      setLoadingOrder(false);
    }
  };

  /**
   * Reset loading states when page is restored from bfcache (browser back button).
   * window.location.href navigation leaves loading=true in frozen state.
   * If the user had been redirected to MP, also show the payment error modal.
   */
  useEffect(() => {
    const handlePageShow = (e) => {
      if (e.persisted) {
        setLoading(false);
        setLoadingOrder(false);
        // If we set this flag before redirecting to MP, the user pressed Back
        if (sessionStorage.getItem("pendingMPRedirect") === "true") {
          sessionStorage.removeItem("pendingMPRedirect"); // Cancel the pending order silently
          const failedOrderId = localStorage.getItem("pendingOrderId");
          if (failedOrderId && user) {
            user
              .getIdToken()
              .then((token) => cancelFailedOrder(failedOrderId, token))
              .catch(() => {});
          }
          localStorage.removeItem("pendingOrderId");
          localStorage.removeItem("pendingOrderData");
          setReturnedFromMP(true);
          setPaymentError(
            "No pudimos procesar el pago. Por favor intente nuevamente.",
          );
          setShowPaymentErrorModal(true);
          setPollingActive(false);
        }
      }
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  /**
   * Handle closing the payment error modal.
   * Clears URL params here (not on detect) so ShippingInfoBanner
   * doesn't open while the error modal is still visible.
   * Does NOT reset returnedFromMP — that stays true so the empty-cart
   * redirect guard doesn't fire and the user remains in checkout.
   */
  const handleClosePaymentErrorModal = () => {
    setShowPaymentErrorModal(false);
    setLoadingOrder(false);
    setLoading(false);
    setSearchParams({}, { replace: true });
  };

  /**
   * Handle order confirmation from modal
   * Shows toast, clears cart, and redirects to home
   */
  const handleOrderConfirmation = () => {
    // console.log("[Checkout] handleOrderConfirmation called");
    if (createdOrder) {
      notifyCheckout.orderConfirmation();
    }

    // Clear cart immediately
    clearCart();

    // Clear localStorage after confirming
    localStorage.removeItem("pendingOrderId");
    localStorage.removeItem("pendingOrderData");

    // Close modal
    setShowOrderConfirmModal(false);

    // Reset state
    setCreatedOrder(null);
    setPollingActive(false);

    // Redirect to home
    navigate("/");
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
    // Order confirmation modal
    showOrderConfirmModal,
    setShowOrderConfirmModal,
    handleOrderConfirmation,
    createdOrder,
    // Payment error modal
    showPaymentErrorModal,
    setShowPaymentErrorModal,
    handleClosePaymentErrorModal,
    paymentError,
    returnedFromMP,
    // Checkout
    handlePayClick,
    loading,
    error,
    setError,
    loadingOrder,
    hasDefaultAddress: userProfile ? hasDefaultAddress(userProfile) : false,

    // UI logic moved from component
    showSelectAddressModal,
    setShowSelectAddressModal,
    showShippingInfoModal,
    setShowShippingInfoModal,
    selectedShippingAddress,
    setSelectedShippingAddress,
    handleAddressSelected,
  };
}
