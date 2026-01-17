/**
 * firebaseUserCheckService.js
 * Frontend service for user status verification
 * Checks user account status, suspension state, and document existence
 * All operations performed on the frontend client
 */

import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

const BASE_URL = import.meta.env.VITE_FIREBASE_FUNCTIONS_BASE_URL;

/**
 * Verifies that a user document exists in Firestore
 * Used to ensure user was successfully created after registration
 * @param {string} uid - User ID
 * @returns {Promise<boolean>} True if user document exists
 */
export async function checkUserDocExists(uid) {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    return userSnap.exists();
  } catch (error) {
    console.error("Error checking user document:", error);
    return false;
  }
}

/**
 * Checks if a user account is suspended
 * Fetches user document from Firestore to verify account status
 * @param {string} uid - User ID
 * @returns {Promise<string>} Account status (active, suspended, etc.)
 * @throws {Error} If user document cannot be retrieved
 */
export async function checkUserAccountStatus(uid) {
  try {
    const response = await fetch(`${BASE_URL}/getUserDoc?id=${uid}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error("No se pudo verificar el estado de la cuenta");
    }

    const data = await response.json();
    return data.accountStatus || "active";
  } catch (error) {
    console.error("Error checking account status:", error);
    throw error;
  }
}

/**
 * Gets the current authenticated user
 * @returns {Object|null} Firebase user object or null if not authenticated
 */
export function getCurrentUser() {
  return auth.currentUser;
}
