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

/**
 * Firebase Authentication Service
 * Provides methods for login, logout, registration, password reset, and Google login.
 * Handles custom claims to determine admin role.
 * Sends user data to backend after registration.
 */

const BASE_URL = import.meta.env.VITE_FIREBASE_FUNCTIONS_BASE_URL;
class AuthService {
  /**
   * Checks if an email exists in Firebase Authentication by calling backend Cloud Function.
   * @param {string} email
   * @returns {boolean} true if exists, false otherwise
   */
  async verifyEmailExists(email) {
    const response = await fetch(`${BASE_URL}/verifyUserEmail`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    if (response.ok && typeof data.exists === "boolean") {
      return data.exists;
    }
    throw new Error(data.error || "Could not verify email");
  }
  constructor() {
    this.auth = auth;
    this.googleProvider = new GoogleAuthProvider();
  }

  /**
   * Checks if the user has the admin custom claim and sets the role property.
   * @param {object} user - Firebase user object
   * @returns {object} user with role property
   */
  async adminVerify(user) {
    const idTokenResult = await user.getIdTokenResult();
    user.role = idTokenResult.claims.admin ? "admin" : "client";
    return user;
  }

  /**
   * Registers a new user with email, password, and name.
   * Updates user profile and sends user data to backend API.
   * @param {object} param0 - { email, password, name }
   * @returns {object} user with role property
   */
  async register({ email, password, name }) {
    const userCredential = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    );
    const user = userCredential.user;
    await updateProfile(user, { displayName: name });

    // Build user data object for backend
    const userDataForStorage = {
      uid: user.uid,
      email: user.email,
      displayName: name,
      phone: user.phoneNumber || "",
      emailVerified: user.emailVerified,
      createdAt: user.metadata?.creationTime || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      accountStatus: "active",
      addresses: [],
      totalOrders: 0,
      totalSpent: 0,
    };

    // Send user data to backend
    const token = await user.getIdToken();
    await fetch(`${BASE_URL}/createUserDoc`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userDataForStorage),
    });

    return this.adminVerify(user);
  }

  /**
   * Logs in a user using email and password.
   * @param {string} email
   * @param {string} password
   * @returns {object} user with role property
   */
  async login(email, password) {
    const userCredential = await signInWithEmailAndPassword(
      this.auth,
      email,
      password
    );
    const user = userCredential.user;

    // Update lastLoginAt for email/password login
    try {
      const token = await user.getIdToken();
      await fetch(`${BASE_URL}/updateLastLogin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ uid: user.uid }),
      });
    } catch (err) {
      console.error("Error updating last login timestamp:", err);
    }

    return this.adminVerify(user);
  }

  /**
   * Logs in a user using Google authentication popup.
   * If it's a new user, creates a user document in Firestore.
   * @returns {object} user with role property
   */
  async loginWithGoogle() {
    const result = await signInWithPopup(this.auth, this.googleProvider);
    const user = result.user;

    // Check if user document exists in Firestore
    const token = await user.getIdToken();
    let userExists = false;
    try {
      const response = await fetch(`${BASE_URL}/getUserById?id=${user.uid}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      // User exists if response is successful
      userExists = response.ok;

      // If user doesn't exist (404 or error), create document in Firestore
      if (!userExists) {
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
        await fetch(`${BASE_URL}/createUserDoc`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(userDataForStorage),
        });
      }

      // Update lastLoginAt for all logins (new or existing)
      await fetch(`${BASE_URL}/updateLastLogin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ uid: user.uid }),
      });
    } catch (err) {
      // Log error but don't fail - user authentication succeeded
      console.error("Error checking/creating user in Firestore:", err);
    }

    return this.adminVerify(user);
  }

  /**
   * Logs out the current user from Firebase Authentication.
   */
  async logout() {
    await signOut(this.auth);
  }

  /**
   * Sends a password reset email to the provided address if the user exists in Firebase Authentication.
   * Throws an error if the email is not registered.
   * @param {string} email
   * @returns {object} message indicating success
   */
  async resetPassword(email) {
    try {
      // Firebase Auth client SDK does not provide getUserByEmail; sendPasswordResetEmail throws if user does not exist.
      await sendPasswordResetEmail(this.auth, email);
      return { message: "Password reset email sent" };
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        throw new Error("Email is not registered");
      }
      throw error;
    }
  }

  /**
   * Deletes the currently authenticated user from Firebase Auth.
   * This uses the Client SDK deleteUser which allows users to delete their own account.
   * Also calls backend to delete user document from Firestore.
   * @param {string} uid - User ID to delete
   * @returns {object} message indicating success
   */
  async deleteCurrentUserAccount(uid) {
    const currentUser = this.auth.currentUser;
    if (!currentUser) {
      throw new Error("No user is currently authenticated");
    }

    try {
      // Delete user from Firebase Auth FIRST using Client SDK
      // This invalidates the token immediately, so must be done before backend call
      await deleteUser(currentUser);
    } catch (error) {
      console.error("Error deleting user from Firebase Auth:", error);
      throw new Error(
        "No se pudo eliminar la cuenta de Firebase Auth. Intenta de nuevo."
      );
    }

    // Delete user document from Firestore AFTER Auth deletion
    // We do this as best-effort since token is already invalid
    // The backend should use Admin SDK for this
    try {
      await fetch(`${BASE_URL}/deleteSelfUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid }),
      });
    } catch (err) {
      console.error(
        "Warning: User deleted from Auth but failed to delete from Firestore:",
        err
      );
      // Don't throw - user is already deleted from Auth
    }

    return { message: "User account deleted successfully" };
  }

  /**
   * Returns the currently authenticated user, or null if not logged in.
   * @returns {object|null} Firebase user object
   */
  getCurrentUser() {
    return this.auth.currentUser;
  }
}

const authService = new AuthService();
export default authService;
