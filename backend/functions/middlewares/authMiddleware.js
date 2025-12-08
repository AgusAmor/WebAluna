const { verifyToken, isAdmin } = require("../utils/authUtils.js");

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

module.exports = { requireAdmin, requireTokenAndAuth };
