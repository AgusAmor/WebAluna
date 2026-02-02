/**
 * mercadopagoConfig.js
 * Configuration for Mercado Pago integration
 * Handles SDK initialization and credentials
 */

const { MercadoPagoConfig, Preference } = require("mercadopago");
const { defineString } = require("firebase-functions/params");

/**
 * Define MP credentials as Firebase Function parameters
 * These should be set in firebase.json or via Firebase console
 * Using production credentials of a test user (as explained by user)
 */
const mpAccessToken = defineString("MERCADOPAGO_ACCESS_TOKEN");

/**
 * Initialize Mercado Pago SDK
 * This is called once and reused across functions
 */
let mpClient = null;

function initMercadoPago() {
  if (mpClient) {
    return mpClient;
  }

  try {
    const token = mpAccessToken.value();
    if (!token) {
      throw new Error("MERCADOPAGO_ACCESS_TOKEN is not configured");
    }

    mpClient = new MercadoPagoConfig({
      accessToken: token,
      timeout: 5000,
    });

    // console.log("Mercado Pago SDK initialized successfully");
    return mpClient;
  } catch (error) {
    console.error("Error initializing Mercado Pago:", error);
    throw error;
  }
}

/**
 * Get or create MP client
 */
function getMPClient() {
  return initMercadoPago();
}

/**
 * Constants for MP integration
 */
const MP_CONFIG = {
  // Notification types we care about
  NOTIFICATION_TYPES: {
    PAYMENT: "payment",
    MERCHANT_ORDER: "merchant_order",
  },

  // Payment statuses from MP
  PAYMENT_STATUS: {
    PENDING: "pending",
    APPROVED: "approved",
    AUTHORIZED: "authorized",
    REJECTED: "rejected",
    CANCELLED: "cancelled",
    REFUNDED: "refunded",
    CHARGED_BACK: "charged_back",
  },

  // Preferred statuses that should update order
  SUCCESS_STATUSES: ["approved"],
  FAILURE_STATUSES: ["rejected", "cancelled"],
  PENDING_STATUSES: ["pending", "authorized"],
};

module.exports = {
  MercadoPagoConfig,
  Preference,
  mpAccessToken,
  initMercadoPago,
  getMPClient,
  MP_CONFIG,
};
