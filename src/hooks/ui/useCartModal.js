/**
 * useCartModal.js
 * Custom hook for cart modal state and operations.
 * Handles checkout process with order creation.
 */

import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useCheckout } from "../checkout";
import { toast } from "react-toastify";

export function useCartModal(onClose) {
  const { items, total, updateQuantity, removeItem, clearCart } = useCart();
  const {
    handleCheckout: processCheckout,
    loading,
    error,
    showAddressModal,
    setShowAddressModal,
    handleAddAddressAndContinue,
  } = useCheckout();
  const navigate = useNavigate();

  /**
   * Handles checkout process - creates order and saves to Firestore
   */
  const handleCheckout = async () => {
    try {
      // Process checkout with default shipping method and cost
      const createdOrder = await processCheckout({
        deliveryMethod: "shipping",
        shippingCost: 0, // TODO: Calculate based on delivery method
      });

      // Show success message with order number
      toast.success(
        `¡Compra completada! Número de pedido: ${createdOrder.orderNumber}`,
        {
          position: "bottom-right",
          autoClose: 5000,
        }
      );

      // Close modal
      onClose();

      // Navigate to orders page or home
      navigate("/perfil", { state: { activeTab: "orders" } });
    } catch (err) {
      // Error is already set in the hook, only show toast for non-address errors
      // Address modal will be opened automatically if needed
      if (checkoutError && !checkoutError.includes("dirección predeterminada")) {
        toast.error(checkoutError || "Error al procesar la compra", {
          position: "bottom-right",
          autoClose: 5000,
        });
      }
    }
  };

  /**
   * Navigates to catalog page
   */
  const handleGoToCatalog = () => {
    onClose();
    navigate("/productos");
  };

  /**
   * Removes item from cart
   * @param {string} itemKey - Unique item key
   */
  const handleRemoveItem = (itemKey) => {
    removeItem(itemKey);
  };

  /**
   * Updates item quantity
   * @param {string} itemKey - Unique item key
   * @param {number} newQuantity - New quantity
   */
  const handleUpdateQuantity = (itemKey, newQuantity) => {
    updateQuantity(itemKey, newQuantity);
  };

  /**
   * Increases item quantity by 1
   * @param {string} itemKey - Unique item key
   * @param {number} currentQuantity - Current quantity
   */
  const handleIncreaseQuantity = (itemKey, currentQuantity) => {
    handleUpdateQuantity(itemKey, currentQuantity + 1);
  };

  /**
   * Decreases item quantity by 1
   * @param {string} itemKey - Unique item key
   * @param {number} currentQuantity - Current quantity
   */
  const handleDecreaseQuantity = (itemKey, currentQuantity) => {
    handleUpdateQuantity(itemKey, currentQuantity - 1);
  };

  /**
   * Clears all items from cart
   */
  const handleClearCart = () => {
    clearCart();
  };

  return {
    items,
    total,
    handleCheckout,
    handleGoToCatalog,
    handleRemoveItem,
    handleIncreaseQuantity,
    handleDecreaseQuantity,
    handleClearCart,
    checkoutLoading: loading,
    checkoutError: error,
    showAddressModal,
    setShowAddressModal,
    handleAddAddressAndContinue,
  };
}
