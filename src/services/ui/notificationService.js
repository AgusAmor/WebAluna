/**
 * Centralized notification service
 * Provides specific notification functions for different app features
 */

import { showCustomToast } from "./toastService";
import { NOTIFICATION_MESSAGES } from "../../constants/notificationMessages";

/**
 * Authentication notifications
 */
export const notifyAuth = {
  loginSuccess: (name) =>
    showCustomToast.success(NOTIFICATION_MESSAGES.auth.loginSuccess(name)),
  logoutSuccess: () =>
    showCustomToast.success(NOTIFICATION_MESSAGES.auth.logoutSuccess),
  logoutError: () =>
    showCustomToast.error(NOTIFICATION_MESSAGES.auth.logoutError),
  sessionExpired: () =>
    showCustomToast.info(NOTIFICATION_MESSAGES.auth.sessionExpired),
  passwordResetSent: () =>
    showCustomToast.success(NOTIFICATION_MESSAGES.auth.passwordResetSent),
  accountDeleted: () =>
    showCustomToast.success(NOTIFICATION_MESSAGES.auth.accountDeleted),
};

/**
 * Cart notifications
 */
export const notifyCart = {
  productAdded: (productName) =>
    showCustomToast.info(NOTIFICATION_MESSAGES.cart.productAdded(productName)),
  productTypeExists: (productName, type) =>
    showCustomToast.info(NOTIFICATION_MESSAGES.cart.productAdded(productName)),
  loginRequiredToAdd: () =>
    showCustomToast.info(NOTIFICATION_MESSAGES.cart.loginRequiredToAdd),
  productRemoved: (productName) =>
    showCustomToast.info(
      NOTIFICATION_MESSAGES.cart.productRemoved(productName),
    ),
};

/**
 * Checkout notifications
 */
export const notifyCheckout = {
  addressAdded: () =>
    showCustomToast.success(NOTIFICATION_MESSAGES.checkout.addressAdded),
  orderConfirmation: () =>
    showCustomToast.success(NOTIFICATION_MESSAGES.checkout.orderConfirmation),
  orderSuccess: (orderNumber) =>
    showCustomToast.success(`¡Pedido #${orderNumber} realizado con éxito!`),
  deliveryInfo: (message) =>
    showCustomToast.info(NOTIFICATION_MESSAGES.checkout.deliveryInfo(message)),
  error: (message) =>
    showCustomToast.error(NOTIFICATION_MESSAGES.checkout.error(message)),
};

/**
 * Orders notifications
 */
export const notifyOrders = {
  statusUpdated: () =>
    showCustomToast.success(NOTIFICATION_MESSAGES.orders.statusUpdated),
  cancelSuccess: () =>
    showCustomToast.success(NOTIFICATION_MESSAGES.orders.cancelSuccess),
  cancelError: (message) =>
    showCustomToast.error(NOTIFICATION_MESSAGES.orders.cancelError(message)),
  loadError: (message) =>
    showCustomToast.error(NOTIFICATION_MESSAGES.orders.loadError(message)),
  updateError: (message) =>
    showCustomToast.error(NOTIFICATION_MESSAGES.orders.updateError(message)),
};

/**
 * Profile notifications
 */
export const notifyProfile = {
  emailSent: (email) =>
    showCustomToast.success(NOTIFICATION_MESSAGES.profile.emailSent(email)),
  emailError: () =>
    showCustomToast.error(NOTIFICATION_MESSAGES.profile.emailError),
};
