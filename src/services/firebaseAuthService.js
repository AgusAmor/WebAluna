import admin from "./firebaseAdmin.js";
import { DB_CONFIG } from "../constants/config.js";

/**
 * Unified Authentication Service - Firebase Admin SDK Implementation
 * Handles authentication and Firestore management
 */
class AuthService {
  constructor() {
    this.auth = admin.auth;
    this.db = admin.db;
  }

  /**
   * Register a new user with email and password
   * @param {Object} userData - {email, password, name}
   * @returns {Promise<Object>} User data
   */
  async register(userData) {
    const { email, password, name } = userData;

    try {
      const user = await this.auth.createUser({
        email,
        password,
        displayName: name,
      });

      const userDataForStorage = {
        uid: user.uid,
        email: user.email,
        displayName: name,
        role: "user",
        createdAt: new Date().toISOString(),
      };

      await this.db
        .collection(DB_CONFIG.FIREBASE.COLLECTIONS.USERS)
        .doc(user.uid)
        .set({
          ...userDataForStorage,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

      return {
        user: userDataForStorage,
      };
    } catch (error) {
      console.error("Registration Error:", error);
      throw error;
    }
  }

  /**
   * Sign in with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object} User data
   */
  async login(email, password) {
    try {
      const userCredential = await this.auth.signInWithEmailAndPassword(
        email,
        password
      );
      const user = userCredential.user;

      // Get user data from Firestore
      const userData = await this.getUserData(user.uid);

      return {
        user: userData,
      };
    } catch (error) {
      console.error("Login Error:", error);
      throw error;
    }
  }

  /**
   * Get user data from Firestore
   * @param {string} uid - User ID
   * @returns {Promise<Object|null>} User data
   */
  async getUserData(uid) {
    try {
      const userDoc = await this.db
        .collection(DB_CONFIG.FIREBASE.COLLECTIONS.USERS)
        .doc(uid)
        .get();

      return userDoc.exists ? userDoc.data() : null;
    } catch (error) {
      console.warn("Error getting user data:", error.message);
      return null;
    }
  }

  /**
   * Sign out user
   */
  async logout() {
    try {
      await this.auth.signOut();
    } catch (error) {
      console.error("Logout Error:", error);
      throw error;
    }
  }

  /**
   * Send password reset email
   */
  async resetPassword(email) {
    try {
      await this.auth.sendPasswordResetEmail(email);
      return { message: "Correo de recuperación enviado" };
    } catch (error) {
      console.error("Password Reset Error:", error);
      throw error;
    }
  }

  /**
   * Get current user
   */
  getCurrentUser() {
    return this.auth.currentUser;
  }

  /**
   * Get current user data from Firebase Auth + Firestore
   */
  async getCurrentUserData() {
    const user = this.auth.currentUser;
    if (!user) return null;

    try {
      // Get user data from Firestore
      const userData = await this.getUserData(user.uid);

      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        role: userData?.role || "user",
        isAdmin: userData?.role === "admin",
        ...userData,
      };
    } catch (error) {
      console.error("Error getting current user data:", error);
      return null;
    }
  }

  /**
   * Update user profile
   */
  async updateUserProfile(updates) {
    const user = this.getCurrentUser();
    if (!user) throw new Error("No user logged in");

    try {
      if (updates.displayName) {
        await this.auth.updateProfile(user, { displayName: updates.displayName });
      }

      await this.db
        .collection(DB_CONFIG.FIREBASE.COLLECTIONS.USERS)
        .doc(user.uid)
        .update({
          ...updates,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

      return await this.getCurrentUserData();
    } catch (error) {
      console.error("Update Profile Error:", error);
      throw error;
    }
  }
}

// Create and export singleton instance
const authService = new AuthService();
export default authService;
