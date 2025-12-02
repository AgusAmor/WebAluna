import { apiGet, apiPost, apiPostAuth } from "./apiClient";

/**
 * Fetches all users from Firestore.
 * @returns {Promise<Array>} Array of user objects
 */
export async function fetchUsers() {
  const data = await apiGet("/getUsers");
  return data.users;
}

/**
 * Fetches a single user by ID.
 * @param {string} id - User ID
 * @returns {Promise<Object>} User object
 */
export async function fetchUserById(id) {
  if (!id || typeof id !== "string") {
    throw new Error("Valid user ID is required");
  }
  return apiGet("/getUserById", { query: { id } });
}

/**
 * Deletes a user from Firestore.
 * @param {string} id - User ID
 * @param {string} token - Firebase Auth token
 * @returns {Promise<Object>} Result
 */
export async function deleteUser(id, token) {
  return apiPostAuth("/deleteUser", { id }, token);
}

/**
 * Updates a user in Firestore.
 * @param {string} id - User ID
 * @param {Object} userData - User data to update
 * @param {string} token - Firebase Auth token
 * @returns {Promise<Object>} Result
 */
export async function updateUser(id, userData, token) {
  // Use apiClient directly to support query params
  const BASE_URL = import.meta.env.VITE_FIREBASE_FUNCTIONS_BASE_URL;
  const response = await fetch(`${BASE_URL}/updateUserDoc?id=${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to update user");
  }
  return response.json();
}

/**
 * Sets a user as admin or removes admin privileges.
 * Only admin users can call this function.
 * @param {string} userId - User ID to promote/demote
 * @param {boolean} isAdmin - Whether user should be admin
 * @param {string} token - Firebase Auth token
 * @returns {Promise<Object>} Result
 */
export async function setAdminRole(userId, isAdmin, token) {
  if (!userId || typeof userId !== "string") {
    throw new Error("Valid user ID is required");
  }
  if (typeof isAdmin !== "boolean") {
    throw new Error("isAdmin must be a boolean");
  }
  return apiPostAuth("/setAdminRole", { userId, isAdmin }, token);
}
