import authService from "../firebase/firebaseAuthService";
import {
  signOut,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { auth } from "../firebase/firebase";

/**
 * Account Service
 * Handles all account-related business logic (deletion, password reset, etc.)
 */

/**
 * Re-authenticates the current user for sensitive operations
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<void>}
 */
export const reauthenticateUser = async (email, password) => {
  if (!auth.currentUser) {
    throw new Error("No user is currently authenticated");
  }

  const credential = EmailAuthProvider.credential(email, password);
  try {
    await reauthenticateWithCredential(auth.currentUser, credential);
  } catch (error) {
    if (error.code === "auth/wrong-password") {
      throw new Error("La contraseña es incorrecta");
    } else if (error.code === "auth/user-not-found") {
      throw new Error("Usuario no encontrado");
    } else {
      throw new Error("Error al re-autenticar. Intenta de nuevo.");
    }
  }
};

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
      // Silent fail - session will be cleared anyway
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
  reauthenticateUser,
  requestPasswordReset,
};
