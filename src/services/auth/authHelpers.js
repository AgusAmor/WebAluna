/**
 * authHelpers.js
 * Pure utility functions for authentication operations.
 * Contains validation and error handling logic with no React dependencies.
 */

import { isValidEmail } from "../../utils/validators";

/**
 * Validates password reset email
 * @param {string} email - Email to validate
 * @throws {Error} - If email is invalid
 */
export function validateResetEmail(email) {
  if (!isValidEmail(email)) {
    throw new Error("Please enter a valid email address.");
  }
}

/**
 * Handles authentication action with error handling
 * @param {Function} action - Async authentication action
 * @param {Function} setError - Error state setter
 * @param {Function} setLoading - Loading state setter
 * @param {Function} onSuccess - Success callback (receives result)
 * @returns {Promise<any>} - Result from action
 */
export async function handleAuthAction(
  action,
  setError,
  setLoading,
  onSuccess
) {
  try {
    setError(null);
    setLoading(true);
    const result = await action();
    if (onSuccess) {
      onSuccess(result);
    }
    return result;
  } catch (err) {
    setError(err.message);
    throw err;
  } finally {
    setLoading(false);
  }
}

/**
 * Gets user role from custom claims
 * @param {Object} user - Firebase user object
 * @returns {string|null} - User role or null
 */
export function getUserRole(user) {
  return user?.role || null;
}

/**
 * Checks if user is authenticated
 * @param {Object} user - User object
 * @returns {boolean} - True if user exists
 */
export function isAuthenticated(user) {
  return !!user;
}

/**
 * Checks if user has admin role
 * @param {Object} user - User object
 * @returns {boolean} - True if user is admin
 */
export function isAdmin(user) {
  return user?.role === "admin";
}

/**
 * Refreshes user token and gets updated claims
 * @param {Object} currentUser - Firebase Auth currentUser
 * @param {Function} adminVerify - Admin verification function
 * @returns {Promise<Object>} - User with updated role
 */
export async function refreshUserToken(currentUser, adminVerify) {
  if (!currentUser) return null;

  // Force token refresh to get updated custom claims
  await currentUser.getIdToken(true);
  // Reload user profile from Firebase
  await currentUser.reload();
  // Verify admin role and return updated user
  return await adminVerify(currentUser);
}

/**
 * Merges user profile updates with existing data
 * @param {Object} currentUser - Current user object
 * @param {Object} updatedData - New profile data
 * @returns {Object} - Merged user object
 */
export function mergeUserProfile(currentUser, updatedData) {
  return {
    ...currentUser,
    ...updatedData,
  };
}
