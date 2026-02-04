import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

/**
 * Hook to handle payment confirmation logic on the Home page.
 * Detects Mercado Pago redirect and shows appropriate modal.
 */
export const usePaymentConfirmation = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [processingOrder, setProcessingOrder] = useState(false);
  const [createdOrderNumber, setCreatedOrderNumber] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const collectionStatus = searchParams.get("collection_status");
    const pendingOrderId = localStorage.getItem("pendingOrderId");
    const pendingOrderData = localStorage.getItem("pendingOrderData");

    // Only process if we came from Mercado Pago and have a pending order
    if (!collectionStatus || !pendingOrderId || !pendingOrderData) {
      return;
    }

    if (processingOrder) {
      return;
    }

    try {
      setProcessingOrder(true);
      const orderData = JSON.parse(pendingOrderData);

      console.log("[Payment Confirmation] Mercado Pago redirect detected");
      console.log(
        "[Payment Confirmation] Collection status:",
        collectionStatus,
      );

      // Handle based on collection_status from Mercado Pago
      if (collectionStatus === "approved") {
        console.log("[Payment Confirmation] Payment approved");
        setCreatedOrderNumber(orderData.orderNumber);
        setShowSuccessModal(true);
        clearCart();
      } else if (collectionStatus === "pending") {
        console.log("[Payment Confirmation] Payment pending");
        setShowErrorModal(true);
        setErrorMessage(
          "Tu pago está en proceso. Te notificaremos cuando se confirme.",
        );
      } else if (collectionStatus === "rejected") {
        console.log("[Payment Confirmation] Payment rejected");
        setShowErrorModal(true);
        setErrorMessage(
          "El pago fue rechazado. Intenta con otro método de pago.",
        );
      }

      // Clean up localStorage and URL params
      localStorage.removeItem("pendingOrderId");
      localStorage.removeItem("pendingOrderData");
      setSearchParams({});

      setProcessingOrder(false);
    } catch (error) {
      console.error("[Payment Confirmation] Error processing payment:", error);
      setShowErrorModal(true);
      setErrorMessage("Error al procesar el pago.");
      setProcessingOrder(false);
    }
  }, [searchParams, processingOrder, clearCart, setSearchParams]);

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    navigate(`/perfil?openOrder=${createdOrderNumber}`);
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
  };

  return {
    showSuccessModal,
    showErrorModal,
    processingOrder,
    createdOrderNumber,
    errorMessage,
    handleCloseSuccessModal,
    handleCloseErrorModal,
  };
};
