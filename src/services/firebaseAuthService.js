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
 * Simplified Firebase Auth Service
 * Handles login, logout, register, password reset
 * Reads custom claims for admin role
 */
class AuthService {
  constructor() {
    this.auth = auth;
    this.googleProvider = new GoogleAuthProvider();
  }

  // Admin verify
  async adminVerify(user) {
    const idTokenResult = await user.getIdTokenResult();
    user.role = idTokenResult.claims.admin ? "admin" : "client";
    return user;
  }

  // Register new user and send data to backend
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

  // Login with email and password
  async login(email, password) {
    const userCredential = await signInWithEmailAndPassword(
      this.auth,
      email,
      password
    );
    const user = userCredential.user;
    return this.adminVerify(user);
  }

  // Login with Google
  async loginWithGoogle() {
    const result = await signInWithPopup(this.auth, this.googleProvider);
    const user = result.user;
    return this.adminVerify(user);
  }

  // Logout
  async logout() {
    await signOut(this.auth);
  }

  // Reset password
  async resetPassword(email) {
    await sendPasswordResetEmail(this.auth, email);
    return { message: "Correo de recuperación enviado" };
  }

  // Get current user
  getCurrentUser() {
    return this.auth.currentUser;
  }
}

const authService = new AuthService();
export default authService;
