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
import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

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
   * Verifies that a user document exists in Firestore.
   * Used to ensure user was successfully created in Firestore after Auth registration.
   * @param {string} uid - User ID
   * @returns {boolean} true if user document exists in Firestore
   */
  async checkUserDocExists(uid) {
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
   * Validates email domain by checking MX records
   * @param {string} email - Email to validate
   * @throws {Error} If domain is invalid
   */
  async validateEmailDomain(email) {
    const domain = email.split("@")[1];
    if (!domain) {
      throw new Error("La dirección de correo no es válida");
    }

    // Call backend to validate email domain
    try {
      const response = await fetch(`${BASE_URL}/validateEmailDomain`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "La dirección de correo no existe o no es válida"
        );
      }

      return true;
    } catch (error) {
      throw new Error("La dirección de correo no existe o no es válida");
    }
  }

  /**
   * Registers a new user with email, password, and name.
   * Creates user in Firebase Auth, then validates and creates Firestore document.
   * If Firestore creation fails, deletes the user from Auth to keep systems in sync.
   * @param {object} param0 - { email, password, name }
   * @returns {object} user with role property
   * @throws {Error} If user creation fails
   */
  async register({ email, password, name }) {
    // Validate email domain BEFORE creating Firebase Auth account
    await this.validateEmailDomain(email);

    const userCredential = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    );
    const user = userCredential.user;

    try {
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
      const createUserResponse = await fetch(`${BASE_URL}/createUserDoc`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userDataForStorage),
      });

      if (!createUserResponse.ok) {
        const errorData = await createUserResponse.json();
        throw new Error(errorData.message || "Failed to create user document");
      }

      return this.adminVerify(user);
    } catch (error) {
      // If Firestore document creation fails, delete the user from Firebase Auth
      // to keep both systems in sync
      try {
        await user.delete();
      } catch (deleteError) {
        console.error(
          "Failed to clean up user after registration error:",
          deleteError
        );
      }
      throw error;
    }
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
   * Uses checkUserDocExists to verify if user document exists locally.
   * @returns {object} user with role property
   */
  async loginWithGoogle() {
    try {
      const result = await signInWithPopup(this.auth, this.googleProvider);
      const user = result.user;

      // Get authentication token
      const token = await user.getIdToken();

      // Check if user document exists in Firestore using local method
      const userExists = await this.checkUserDocExists(user.uid);

      // If user doesn't exist, create document in Firestore
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

        const createUserResponse = await fetch(`${BASE_URL}/createUserDoc`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(userDataForStorage),
        });

        if (!createUserResponse.ok) {
          const errorData = await createUserResponse.json();
          console.error("Error creating user document:", errorData);
          throw new Error(
            errorData.message || "Failed to create user document"
          );
        }
      }

      // Update lastLoginAt for all logins (new or existing)
      try {
        await fetch(`${BASE_URL}/updateLastLogin`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ uid: user.uid }),
        });
      } catch (loginError) {
        console.error("Error updating last login:", loginError);
        // Non-critical error, continue
      }

      return this.adminVerify(user);
    } catch (error) {
      console.error("Google login error:", error);
      // Re-throw with user-friendly message
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
