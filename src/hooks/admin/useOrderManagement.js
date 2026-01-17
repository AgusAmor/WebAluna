import { useState, useCallback } from "react";
import { ORDER_STATUS } from "../../constants";
import { showCustomToast } from "../../services/ui/toastService";
import { updateOrderStatus } from "../../services/firebase/firebaseOrderService";

/**
 * useOrderManagement Hook
 * Encapsulates order management logic for admin orders page
 * @param {Object} user - Current user object
 * @returns {Object} Order management state and handlers
 */
const useOrderManagement = (user) => {
  const [orders, setOrders] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);
  const [isCancellingOrder, setIsCancellingOrder] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const handleUpdateStatus = useCallback(
    async (orderId, currentStatus) => {
      // Define status flow based on ORDER_STATUS constants
      const statusFlow = {
        [ORDER_STATUS.PENDING]: ORDER_STATUS.CONFIRMED,
        [ORDER_STATUS.CONFIRMED]: ORDER_STATUS.PRINTING,
        [ORDER_STATUS.PRINTING]: ORDER_STATUS.DISPATCHED,
        [ORDER_STATUS.DISPATCHED]: ORDER_STATUS.DELIVERED,
        [ORDER_STATUS.DELIVERED]: ORDER_STATUS.DELIVERED,
        [ORDER_STATUS.WITHDRAWN]: ORDER_STATUS.WITHDRAWN,
        [ORDER_STATUS.CANCELLED]: ORDER_STATUS.CANCELLED,
      };

      const nextStatus = statusFlow[currentStatus] || currentStatus;

      if (nextStatus === currentStatus) {
        showCustomToast.info("Este pedido ya está en estado final");
        return;
      }

      try {
        setUpdatingId(orderId);
        const token = await user.getIdToken();

        await updateOrderStatus(
          {
            orderId,
            newStatus: nextStatus,
            note: `Estado actualizado por administrador`,
            updatedBy: user.uid,
          },
          token,
        );

        // Update local state
        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderId ? { ...order, status: nextStatus } : order,
          ),
        );
        showCustomToast.success("Estado actualizado exitosamente");
      } catch (error) {
        console.error("Error updating order status:", error);
        showCustomToast.error(error.message || "Error al actualizar el estado");
      } finally {
        setUpdatingId(null);
      }
    },
    [user],
  );

  const handleCancelOrder = useCallback(
    (orderId) => {
      const order = orders.find((o) => o.id === orderId);
      setOrderToCancel(order);
      setShowCancelConfirm(true);
    },
    [orders],
  );

  const handleConfirmCancelOrder = useCallback(async () => {
    if (!orderToCancel) return;

    try {
      setIsCancellingOrder(true);
      const token = await user.getIdToken();

      const updatedOrder = await updateOrderStatus(
        {
          orderId: orderToCancel.id,
          newStatus: "cancelled",
          note: "Pedido cancelado por administrador",
          updatedBy: user.uid,
        },
        token,
      );

      // Update local state with the complete updated order from backend
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderToCancel.id ? { ...order, ...updatedOrder } : order,
        ),
      );
      showCustomToast.success("Pedido cancelado exitosamente");
      setShowCancelConfirm(false);
      setOrderToCancel(null);
    } catch (error) {
      console.error("Error cancelling order:", error);
      showCustomToast.error(error.message || "Error al cancelar el pedido");
    } finally {
      setIsCancellingOrder(false);
    }
  }, [orderToCancel, user]);

  const handleCancelOrderCancel = useCallback(() => {
    setShowCancelConfirm(false);
    setOrderToCancel(null);
  }, []);

  return {
    orders,
    setOrders,
    updatingId,
    isCancellingOrder,
    orderToCancel,
    showCancelConfirm,
    setShowCancelConfirm,
    handleUpdateStatus,
    handleCancelOrder,
    handleConfirmCancelOrder,
    handleCancelOrderCancel,
  };
};

export default useOrderManagement;
