/**
 * firebaseAuthCoreService.js
 * Frontend core authentication service
 * Handles login, logout, registration, password reset, and account deletion
 * All operations performed on the frontend client using Firebase SDKs
 */

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  deleteUser,
} from "firebase/auth";
import { auth } from "./firebase";
import { fetchUserById } from "./firebaseUserService";
import { validateEmailDomain } from "./firebaseEmailService";
import {
  checkUserDocExists,
  checkUserAccountStatus,
} from "./firebaseUserCheckService";

const BASE_URL = import.meta.env.VITE_FIREBASE_FUNCTIONS_BASE_URL;

/**
 * Gets user role from Firebase custom claims
 * @param {Object} user - Firebase user object
 * @returns {Promise<Object>} User object with role property
 */
async function verifyUserRole(user) {
  try {
    const idTokenResult = await user.getIdTokenResult();
    user.role = idTokenResult.claims.admin ? "admin" : "client";
    return user;
  } catch (error) {
    console.error("Error verifying user role:", error);
    user.role = "client";
    return user;
  }
}

/**
 * Creates user document in Firestore after registration
 * @param {Object} user - Firebase user object
 * @param {string} displayName - User display name
 * @returns {Promise<void>}
 * @throws {Error} If document creation fails
 */
async function createUserDocumentAfterRegistration(user, displayName) {
  const userDataForStorage = {
    uid: user.uid,
    email: user.email,
    displayName: displayName,
    phone: user.phoneNumber || "",
    emailVerified: user.emailVerified,
    createdAt: user.metadata?.creationTime || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    accountStatus: "active",
    addresses: [],
    totalOrders: 0,
    totalSpent: 0,
  };

  try {
    const token = await user.getIdToken();
    const response = await fetch(`${BASE_URL}/createUserDoc`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userDataForStorage),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create user document");
    }
  } catch (error) {
    console.error("Error creating user document:", error);
    throw error;
  }
}

/**
 * Creates user document after Google login if it doesn't exist
 * @param {Object} user - Firebase user object
 * @returns {Promise<void>}
 */
async function createUserDocumentIfNotExists(user) {
  const userExists = await checkUserDocExists(user.uid);
  if (userExists) return;

  const userDataForStorage = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || "",
    phone: user.phoneNumber || "",
    photoURL: user.photoURL || "",
    emailVerified: user.emailVerified,
    createdAt: user.metadata?.creationTime || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    accountStatus: "active",
    addresses: [],
    totalOrders: 0,
    totalSpent: 0,
  };

  try {
    const token = await user.getIdToken();
    const response = await fetch(`${BASE_URL}/createUserDoc`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userDataForStorage),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(
        "Error creating user document after Google login:",
        errorData,
      );
      throw new Error(errorData.message || "Failed to create user document");
    }
  } catch (error) {
    console.error("Error creating user document:", error);
    throw error;
  }
}

/**
 * Updates last login timestamp
 * @param {string} uid - User ID
 * @returns {Promise<void>}
 */
async function updateLastLoginTimestamp(uid) {
  try {
    const user = auth.currentUser;
    if (!user) return;

    const token = await user.getIdToken();
    await fetch(`${BASE_URL}/updateLastLogin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ uid }),
    });
  } catch (error) {
    console.error("Error updating last login timestamp:", error);
    // Non-critical error, don't throw
  }
}

/**
 * Registers a new user with email, password, and name
 * @param {Object} params - { email, password, name }
 * @returns {Promise<Object>} User object with role property
 * @throws {Error} If registration fails
 */
export async function registerUser({ email, password, name }) {
  // Validate email domain BEFORE creating Firebase Auth account
  await validateEmailDomain(email);

  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );
  const user = userCredential.user;

  try {
    await updateProfile(user, { displayName: name });
    await createUserDocumentAfterRegistration(user, name);
    return verifyUserRole(user);
  } catch (error) {
    // If Firestore document creation fails, delete the user from Firebase Auth
    try {
      await deleteUser(user);
    } catch (deleteError) {
      console.error(
        "Failed to cleanup user after registration error:",
        deleteError,
      );
    }
    throw error;
  }
}

/**
 * Logs in a user using email and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>} User object with role property
 * @throws {Error} If login fails
 */
export async function loginUser(email, password) {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password,
  );
  const user = userCredential.user;

  try {
    // Check if user account is suspended
    const userDoc = await fetchUserById(user.uid);
    if (userDoc.accountStatus === "suspended") {
      await signOut(auth);
      throw new Error(
        "Tu cuenta ha sido suspendida. Contacta con el administrador.",
      );
    }

    // Update lastLoginAt
    await updateLastLoginTimestamp(user.uid);
    return verifyUserRole(user);
  } catch (error) {
    // If checking account status failed, sign out
    try {
      await signOut(auth);
    } catch (e) {
      // Ignore logout error
    }
    throw error;
  }
}

/**
 * Logs in a user using Google authentication
 * @returns {Promise<Object>} User object with role property
 * @throws {Error} If login fails
 */
export async function loginWithGoogle() {
  try {
    const googleProvider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Create user document if it doesn't exist
    await createUserDocumentIfNotExists(user);

    // Update last login timestamp
    await updateLastLoginTimestamp(user.uid);

    return verifyUserRole(user);
  } catch (error) {
    console.error("Google login error:", error);

    // Handle specific Google auth errors
    if (error.code === "auth/popup-closed-by-user") {
      throw new Error("Login cancelado");
    }
    if (error.code === "auth/cancelled-popup-request") {
      throw new Error("Login cancelado");
    }
    if (error.code === "auth/popup-blocked") {
      throw new Error("Popup bloqueado. Habilita las ventanas emergentes.");
    }

    throw error;
  }
}

/**
 * Logs out the current user
 * @returns {Promise<void>}
 */
export async function logoutUser() {
  await signOut(auth);
}

/**
 * Sends a password reset email
 * @param {string} email
 * @returns {Promise<Object>} Success message
 * @throws {Error} If email is not registered
 */
export async function resetUserPassword(email) {
  try {
    await sendPasswordResetEmail(auth, email);
    return { message: "Password reset email sent" };
  } catch (error) {
    if (error.code === "auth/user-not-found") {
      throw new Error("Email is not registered");
    }
    throw error;
  }
}

/**
 * Deletes the current user account
 * Deletes from Firebase Auth first, then attempts to delete from Firestore
 * @param {string} uid - User ID
 * @returns {Promise<Object>} Success message
 * @throws {Error} If deletion fails
 */
export async function deleteCurrentUserAccount(uid) {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error("No user is currently authenticated");
  }

  console.log(
    `[deleteCurrentUserAccount] Starting account deletion for user: ${uid}`,
  );

  try {
    // Delete from Firebase Auth FIRST
    console.log(`[deleteCurrentUserAccount] Deleting from Firebase Auth...`);
    await deleteUser(currentUser);
    console.log(
      `[deleteCurrentUserAccount] User successfully deleted from Firebase Auth`,
    );
  } catch (error) {
    console.error("Error deleting user from Firebase Auth:", error);
    throw new Error(
      "No se pudo eliminar la cuenta de Firebase Auth. Intenta de nuevo.",
    );
  }

  // Delete from Firestore as best-effort (token is already invalid)
  try {
    console.log(
      `[deleteCurrentUserAccount] Deleting from Firestore via backend...`,
    );
    const response = await fetch(`${BASE_URL}/deleteSelfUser`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid }),
    });

    console.log(
      `[deleteCurrentUserAccount] Backend response status: ${response.status}`,
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error(
        "Warning: User deleted from Auth but failed to delete from Firestore:",
        errorData,
      );
    } else {
      console.log(
        `[deleteCurrentUserAccount] User successfully deleted from Firestore`,
      );
    }
  } catch (err) {
    console.error(
      "Warning: User deleted from Auth but failed to delete from Firestore:",
      err,
    );
  }

  console.log(`[deleteCurrentUserAccount] Account deletion process completed`);
  return { message: "User account deleted successfully" };
}

/**
 * Alias for verifyUserRole - exported for backward compatibility
 * @param {Object} user - Firebase user object
 * @returns {Promise<Object>} User object with role property
 */
export const adminVerify = verifyUserRole;

/**
 * Export auth instance for direct access (used in contexts/hooks)
 * Allows access to Firebase auth methods like onAuthStateChanged, currentUser
 */
export { auth };
