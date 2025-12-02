const admin = require("../config/firebaseAdmin.js");

/**
 * Authentication and Authorization Utilities
 * Centralizes token verification, admin checks, and permission validation
 */

/**
 * Verifies Firebase Auth token and extracts decoded claims
 * @param {string} authHeader - Authorization header (format: "Bearer <token>")
 * @returns {Promise<object>} Decoded token with uid and claims
 * @throws {object} Error object with status and message
 */
const verifyToken = async (authHeader) => {
  if (!authHeader) {
    throw { status: 401, message: "No token provided" };
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    throw { status: 401, message: "Invalid token format" };
  }

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    return decoded;
  } catch (err) {
    throw { status: 401, message: "Invalid token" };
  }
};

/**
 * Checks if a decoded token has admin privileges
 * @param {object} decoded - Decoded token with claims
 * @returns {boolean} True if admin, false otherwise
 */
const isAdmin = (decoded) => {
  return decoded && decoded.admin === true;
};

/**
 * Middleware to verify token and check admin status
 * @param {object} req - Express request object
 * @returns {Promise<object>} Decoded token
 * @throws {object} Error object with status and message if not authenticated or not admin
 */
const requireAdmin = async (req) => {
  const decoded = await verifyToken(req.headers.authorization);
  if (!isAdmin(decoded)) {
    throw { status: 403, message: "Only admins can perform this action" };
  }
  return decoded;
};

/**
 * Middleware to verify token and check if user can access their own data or is admin
 * @param {object} req - Express request object
 * @param {string} userId - User ID to check access for
 * @returns {Promise<object>} Decoded token
 * @throws {object} Error object with status and message
 */
const requireTokenAndAuth = async (req, userId) => {
  const decoded = await verifyToken(req.headers.authorization);
  if (!isAdmin(decoded) && decoded.uid !== userId) {
    throw { status: 403, message: "Cannot access another user's data" };
  }
  return decoded;
};

module.exports = {
  verifyToken,
  isAdmin,
  requireAdmin,
  requireTokenAndAuth,
};
