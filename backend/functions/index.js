const { onRequest } = require("firebase-functions/v2/https");
const handleCors = require("./middlewares/corsMiddleware.js");

// Import all handlers
const {
  createUserDoc,
  verifyUserEmail,
  getUsers,
  getUserById,
  deleteUser,
  updateUserDoc,
  setAdminRole,
} = require("./users.js");

const {
  getProducts,
  getProductById,
  deleteProduct,
  updateProduct,
  createProduct,
} = require("./products.js");

const REGION = "southamerica-east1";

/**
 * Wraps an async handler with CORS support
 * @param {Function} handler - Async handler function
 * @returns {Function} Express middleware
 */
const withCors = (handler) => async (req, res) => {
  if (handleCors(req, res)) return;
  await handler(req, res);
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

exports.getUsers = createCloudFunction(getUsers);
exports.getUserById = createCloudFunction(getUserById);
exports.createUserDoc = createCloudFunction(createUserDoc);
exports.verifyUserEmail = createCloudFunction(verifyUserEmail);
exports.updateUserDoc = createCloudFunction(updateUserDoc);
exports.deleteUser = createCloudFunction(deleteUser);
exports.setAdminRole = createCloudFunction(setAdminRole);

// ============================================
// PRODUCT FUNCTIONS
// ============================================

exports.getProducts = createCloudFunction(getProducts);
exports.getProductById = createCloudFunction(getProductById);
exports.createProduct = createCloudFunction(createProduct);
exports.updateProduct = createCloudFunction(updateProduct);
exports.deleteProduct = createCloudFunction(deleteProduct);
