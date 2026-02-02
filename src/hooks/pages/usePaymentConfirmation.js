import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { createOrder } from "../../services/firebase/firebaseOrderService";

/**
 * Hook to handle payment confirmation logic on the Home page.
 * Checks for MercadoPago query params and creates the order if approved.
 */
export const usePaymentConfirmation = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const { user } = useAuth();

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [processingOrder, setProcessingOrder] = useState(false);
  const [createdOrderNumber, setCreatedOrderNumber] = useState(null);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      const status = searchParams.get("collection_status");
      const paymentId = searchParams.get("payment_id");
      const savedPayload = localStorage.getItem("pendingOrderPayload");

      // Only process if approved and we have a pending order payload
      if (status === "approved" && savedPayload && !processingOrder) {
        try {
          setProcessingOrder(true);
          const orderData = JSON.parse(savedPayload);

          // Prepare final order data
          // Remove temp IDs so Firestore generates a real ID
          delete orderData.id;
          delete orderData.tempId;

          const finalOrderData = {
            ...orderData,
            status: "confirmed", // Force confirmed status
            paymentStatus: "approved",
            mercadopagoPaymentId: paymentId,
            createdAt: new Date(), // Update timestamp
            statusHistory: [
              {
                status: "confirmed",
                timestamp: new Date(),
                note: `Pedido confirmado. Pago ID: ${paymentId}`,
                updatedBy: "system",
              },
            ],
          };

          if (user) {
            const token = await user.getIdToken();
            const newOrder = await createOrder(finalOrderData, token);

            setCreatedOrderNumber(newOrder.orderNumber);
            setShowSuccessModal(true);
            clearCart();
            localStorage.removeItem("pendingOrderPayload");

            // Clear URL params without reloading
            setSearchParams({});
          }
        } catch (error) {
          console.error("Error creating order after payment:", error);
          // Optional: Handle error
        } finally {
          setProcessingOrder(false);
        }
      }
    };

    checkPaymentStatus();
  }, [searchParams, user, clearCart, setSearchParams, processingOrder]);

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    // Redirect to profile with query param to open the specific order
    navigate(`/perfil?openOrder=${createdOrderNumber}`);
  };

  return {
    showSuccessModal,
    processingOrder,
    createdOrderNumber,
    handleCloseModal,
  };
};
