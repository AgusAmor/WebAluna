/**
 * adminUtils.js
 * Centralized admin role verification logic
 */

/**
 * Check if a user has admin role
 * @param {Object} user - The user object from AuthContext
 * @returns {boolean} - True if user is admin, false otherwise
 */
export const isUserAdmin = (user) => {
  return user?.role === "admin";
};

/**
 * Check if a path is an admin route
 * @param {string} pathname - The current pathname
 * @returns {boolean} - True if the path is an admin route
 */
export const isAdminRoute = (pathname) => {
  return pathname.startsWith("/admin");
};

/**
 * Verify admin access - can be used in components or guards
 * @param {Object} user - The user object
 * @param {boolean} requireAdmin - Whether admin role is required
 * @returns {boolean} - True if user has required access level
 */
export const verifyAdminAccess = (user, requireAdmin = false) => {
  if (!requireAdmin) return true;
  return isUserAdmin(user);
};
