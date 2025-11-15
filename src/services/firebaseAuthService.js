import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "./firebase";

/**
 * Firebase Authentication Service
 * Provides methods for login, logout, registration, password reset, and Google login.
 * Handles custom claims to determine admin role.
 * Sends user data to backend after registration.
 */
class AuthService {
  /**
   * Checks if an email exists in Firebase Authentication by calling backend Cloud Function.
   * @param {string} email
   * @returns {boolean} true if exists, false otherwise
   */
  async verifyEmailExists(email) {
    const response = await fetch(
      "https://southamerica-east1-aluna-1af1f.cloudfunctions.net/verifyUserEmail",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }
    );
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
      lastLoginAt: user.metadata?.lastSignInTime || new Date().toISOString(),
      accountStatus: "active",
      addresses: [],
      totalOrders: 0,
      totalSpent: 0,
    };

    // Send user data to backend
    const token = await user.getIdToken();
    await fetch(
      "https://southamerica-east1-aluna-1af1f.cloudfunctions.net/createUserDoc",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userDataForStorage),
      }
    );

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
    return this.adminVerify(user);
  }

  /**
   * Logs in a user using Google authentication popup.
   * @returns {object} user with role property
   */
  async loginWithGoogle() {
    const result = await signInWithPopup(this.auth, this.googleProvider);
    const user = result.user;
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
   * Returns the currently authenticated user, or null if not logged in.
   * @returns {object|null} Firebase user object
   */
  getCurrentUser() {
    return this.auth.currentUser;
  }
}

const authService = new AuthService();
export default authService;
