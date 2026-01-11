/**
 * useCartModal.js
 * Custom hook for cart modal state and operations.
 * Navigates to checkout page instead of processing order directly.
 */

import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { showCustomToast } from "../../services/ui/toastService.jsx";

export function useCartModal(onClose) {
  const { items, total, updateQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();

  /**
   * Navigates to checkout page
   */
  const handleCheckout = async () => {
    if (!items || items.length === 0) {
      showCustomToast.error("El carrito está vacío");
      return;
    }

    // Close modal and navigate to checkout page
    onClose();
    navigate("/checkout");
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
    checkoutLoading: false,
  };
}
