/**
 * Centralized notification messages
 * All toast messages organized by category
 */

export const NOTIFICATION_MESSAGES = {
  // Authentication
  auth: {
    loginSuccess: (name) => `¡Bienvenid@${name ? " " + name : ""}!`,
    logoutSuccess: "Sesión cerrada correctamente",
    logoutError: "Error al cerrar sesión",
    sessionExpired: "Sesión cerrada por inactividad",
    passwordResetSent:
      "Correo de recuperación enviado. Revisa tu bandeja de entrada.",
    accountDeleted: "Tu cuenta ha sido eliminada exitosamente",
  },

  // Cart
  cart: {
    productAdded: (productName) => `"${productName}" se agregó al carrito.`,
    loginRequiredToAdd:
      "Debes iniciar sesión para agregar productos al carrito.",
    productRemoved: (productName) => `"${productName}" se eliminó del carrito`,
  },

  // Checkout
  checkout: {
    addressAdded: "Dirección agregada exitosamente",
    orderConfirmation:
      "Pronto serás notificad@ por mail sobre el estado de tu pedido...",
    deliveryInfo: (message) => message,
    error: (message) => message,
  },

  // Orders
  orders: {
    statusUpdated: "Estado actualizado exitosamente",
    cancelSuccess: "Pedido cancelado exitosamente",
    cancelError: (message) =>
      message || "Error al cancelar el pedido. Intenta de nuevo.",
    loadError: (message) => message || "Error al cargar los pedidos",
    updateError: (message) => message || "Error al actualizar el estado",
  },
};
