import { db } from "./firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { apiPost, apiPostAuth } from "./apiClient";

/**
 * Fetches all users directly from Firestore.
 * Provides faster load times by bypassing Cloud Functions.
 * @returns {Promise<Array>} Array of user objects with IDs
 * @throws {Error} If Firestore read fails
 */
export async function fetchUsers() {
  try {
    const usersCollection = collection(db, "users");
    const snapshot = await getDocs(usersCollection);
    const users = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return users;
  } catch (error) {
    console.error("Error fetching users from Firestore:", error);
    throw new Error("Failed to fetch users from Firestore");
  }
}

/**
 * Fetches a single user by ID directly from Firestore.
 * @param {string} id - User ID
 * @returns {Promise<Object>} User object with id property
 * @throws {Error} If user not found
 */
export async function fetchUserById(id) {
  if (!id || typeof id !== "string") {
    throw new Error("Valid user ID is required");
  }
  try {
    const userDoc = doc(db, "users", id);
    const snapshot = await getDoc(userDoc);

    if (!snapshot.exists()) {
      throw new Error("User not found");
    }

    return {
      id: snapshot.id,
      ...snapshot.data(),
    };
  } catch (error) {
    console.error("Error fetching user by ID from Firestore:", error);
    throw error;
  }
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
