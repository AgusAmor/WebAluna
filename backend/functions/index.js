const { onRequest } = require("firebase-functions/v2/https");
const handleCors = require("./middlewares/corsMiddleware.js");

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

const REGION = "southamerica-east1";

/**
 * Wraps an async handler with CORS support
 * Ensures CORS headers are set before and after the handler executes
 * @param {Function} handler - Async handler function
 * @returns {Function} Express middleware
 */
const withCors = (handler) => async (req, res) => {
  // Handle CORS preflight and set headers
  if (handleCors(req, res)) {
    return; // Preflight request handled
  }

  // Ensure CORS headers are still present for actual request
  res.setHeader("Access-Control-Allow-Origin", "*");

  try {
    await handler(req, res);
  } catch (error) {
    console.error("Unhandled error in Cloud Function:", error);
    // Make sure CORS headers are still present in error response
    res.setHeader("Access-Control-Allow-Origin", "*");
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
