/**
 * useCartModal.js
 * Custom hook for cart modal state and operations.
 */

import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

export function useCartModal(onClose) {
  const { items, total, updateQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();

  /**
   * Handles checkout process
   */
  const handleCheckout = () => {
    clearCart();
    alert("Compra finalizada!");
    onClose();
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
  };
}
