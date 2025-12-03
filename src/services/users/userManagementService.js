/**
 * userManagementService.js
 * Business logic for user management in the admin panel.
 * Contains pure functions with no React dependencies.
 */

import {
  fetchUsers,
  deleteUser,
  updateUser,
} from "../firebase/firebaseUserService";

/**
 * Retrieves Firebase Auth token from user object
 * @param {Object} user - Firebase Auth user object
 * @returns {Promise<string>} - Auth token
 * @throws {Error} - If token cannot be retrieved
 */
export async function getAuthToken(user) {
  if (!user) {
    throw new Error("No user provided");
  }

  let token = "";
  if (user.getIdToken) {
    token = await user.getIdToken(true);
  } else if (user.stsTokenManager?.accessToken) {
    token = user.stsTokenManager.accessToken;
  }

  if (!token) {
    throw new Error("User token not found. Please log in again.");
  }

  return token;
}

/**
 * Loads all users from the backend
 * @returns {Promise<Array>} - Array of user objects
 */
export async function loadUsers() {
  try {
    const data = await fetchUsers();
    return data;
  } catch (err) {
    throw new Error("Error loading users");
  }
}

/**
 * Updates an existing user in the backend
 * @param {string} userId - User ID to update
 * @param {Object} formData - User data to update
 * @param {Object} authUser - Firebase Auth user object
 * @returns {Promise<Array>} - Updated list of users
 */
export async function saveUserChanges(userId, formData, authUser) {
  const token = await getAuthToken(authUser);
  await updateUser(userId, formData, token);
  const updatedUsers = await loadUsers();
  return updatedUsers;
}

/**
 * Deletes a user from the backend
 * @param {string} userId - User ID to delete
 * @param {Object} authUser - Firebase Auth user object
 * @returns {Promise<void>}
 */
export async function deleteUserAccount(userId, authUser) {
  const token = await getAuthToken(authUser);
  await deleteUser(userId, token);
}

/**
 * Formats user's default address for display
 * @param {Array} addresses - Array of user addresses
 * @returns {string} - Formatted address string
 */
export function formatDefaultAddress(addresses) {
  if (!Array.isArray(addresses) || addresses.length === 0) {
    return "-";
  }

  const defaultAddress = addresses.find((a) => a.isDefault);
  if (!defaultAddress) return "-";

  const formatted = `${defaultAddress.street || ""} ${
    defaultAddress.number || ""
  } · ${defaultAddress.region || ""}`
    .trim()
    .replace(/^\s*·\s*$/, "-");

  return formatted || "-";
}
