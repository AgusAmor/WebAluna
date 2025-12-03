import authService from "./firebaseAuthService";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";

/**
 * Account Service
 * Handles all account-related business logic (deletion, password reset, etc.)
 */

/**
 * Deletes the current user account from both Firestore and Firebase Auth
 * @param {object} user - Firebase user object
 * @returns {object} result with success message
 */
export const deleteCurrentAccount = async (user) => {
  if (!user) {
    throw new Error("No user is currently authenticated");
  }

  try {
    // Call authService to handle deletion logic
    // This deletes from Firebase Auth first, then Firestore
    await authService.deleteCurrentUserAccount(user.uid);
  } finally {
    // Always sign out to clear the session, regardless of errors
    // This ensures a clean logout even if deletion partially fails
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Error during final sign out:", err);
    }
  }

  return { message: "Account deleted successfully" };
};

/**
 * Requests a password reset for the given email
 * @param {string} email - Email address to reset password for
 * @returns {object} result with success message
 */
export const requestPasswordReset = async (email) => {
  if (!email) {
    throw new Error("Email is required");
  }

  return await authService.resetPassword(email);
};

export default {
  deleteCurrentAccount,
  requestPasswordReset,
};
