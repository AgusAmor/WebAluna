const { onRequest } = require("firebase-functions/v2/https");

// Import all handlers
const {
  createUserDoc,
  verifyUserEmail,
  validateEmailDomain,
  updateLastLogin,
  deleteUser,
  deleteSelfUser,
  updateUserDoc,
  setAdminRole,
} = require("./users.js");

const {
  deleteProduct,
  updateProduct,
  createProduct,
} = require("./products.js");

const {
  createOrder,
  getOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} = require("./orders.js");

const { onOrderStatusChanged } = require("./utils/emailService.js");

// Mercado Pago Functions
const {
  createMPPreference,
  mercadopagoWebhook,
  getMPPaymentStatus,
} = require("./mercadopago.js");

const { sendContactMessage } = require("./utils/contactHandler.js");

const REGION = "southamerica-east1";

/**
 * CORS wrapper
 * @param {Function} handler - Handler function to wrap
 * @returns {Function} Cloud Function wrapper
 */
const withCors = (handler) => async (req, res) => {
  // Parse JSON body if it's a string (Firebase v2 requirement)
  if (typeof req.body === "string") {
    try {
      req.body = JSON.parse(req.body);
    } catch (e) {
      console.warn("Could not parse body as JSON:", e.message);
      // Leave as string, let handler deal with it
    }
  }

  // Set CORS headers immediately
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, HEAD, POST, PUT, DELETE, OPTIONS",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With, Accept",
  );
  res.setHeader("Access-Control-Max-Age", "86400");

  // Handle preflight OPTIONS immediately
  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  try {
    await handler(req, res);
  } catch (error) {
    console.error("Unhandled error in Cloud Function:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

/**
 * Creates a Cloud Function wrapper
 * @param {Function} handler - Handler function to wrap
 * @returns {Function} Cloud Function
 */
const createCloudFunction = (handler) =>
  onRequest({ region: REGION }, withCors(handler));

// ============================================
// USER FUNCTIONS
// ============================================

exports.createUserDoc = createCloudFunction(createUserDoc);
exports.verifyUserEmail = createCloudFunction(verifyUserEmail);
exports.validateEmailDomain = createCloudFunction(validateEmailDomain);
exports.updateLastLogin = createCloudFunction(updateLastLogin);
exports.updateUserDoc = createCloudFunction(updateUserDoc);
exports.deleteUser = createCloudFunction(deleteUser);
exports.deleteSelfUser = createCloudFunction(deleteSelfUser);
exports.setAdminRole = createCloudFunction(setAdminRole);

// ============================================
// PRODUCT FUNCTIONS
// ============================================

exports.createProduct = createCloudFunction(createProduct);
exports.updateProduct = createCloudFunction(updateProduct);
exports.deleteProduct = createCloudFunction(deleteProduct);

// ============================================
// ORDER FUNCTIONS
// ============================================

exports.createOrder = createCloudFunction(createOrder);
exports.getOrder = createCloudFunction(getOrder);
exports.getUserOrders = createCloudFunction(getUserOrders);
exports.getAllOrders = createCloudFunction(getAllOrders);
exports.updateOrderStatus = createCloudFunction(updateOrderStatus);
exports.deleteOrder = createCloudFunction(deleteOrder);

// ============================================
// FIRESTORE TRIGGERS
// ============================================

exports.onOrderStatusChanged = onOrderStatusChanged;

// ============================================
// MERCADO PAGO FUNCTIONS
// ============================================

exports.createMPPreference = createCloudFunction(createMPPreference);
exports.getMPPaymentStatus = createCloudFunction(getMPPaymentStatus);
exports.mercadopagoWebhook = onRequest({ region: REGION }, mercadopagoWebhook);

// ============================================
// CONTACT FUNCTIONS
// ============================================

exports.sendContactMessage = createCloudFunction(sendContactMessage);
