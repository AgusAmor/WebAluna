// Firebase User Service
// Provides CRUD operations for users via backend Cloud Functions

const BASE_URL = import.meta.env.VITE_FIREBASE_FUNCTIONS_BASE_URL;

/**
 * Fetches all users from Firestore via Cloud Function.
 * @returns {Promise<Array>} Array of user objects
 */
export async function fetchUsers() {
  const response = await fetch(`${BASE_URL}/getUsers`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  const data = await response.json();
  return data.users;
}

/**
 * Fetches a single user by ID from Firestore via Cloud Function.
 * @param {string} id - The user ID
 * @returns {Promise<Object>} User object
 */
export async function fetchUserById(id) {
  const response = await fetch(`${BASE_URL}/getUserById?id=${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }
  return await response.json();
}

/**
 * Deletes a user from Firestore via Cloud Function.
 * Requires the user ID and a valid Firebase Auth token.
 * @param {string} id - User ID
 * @param {string} token - Firebase Auth token
 * @returns {Promise<Object>} Result
 */
export async function deleteUser(id, token) {
  const response = await fetch(`${BASE_URL}/deleteUser`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to delete user");
  }
  return await response.json();
}
