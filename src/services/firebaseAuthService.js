import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "./firebase";
import { DB_CONFIG } from "../constants/config";

/**
 * Unified Authentication Service - Firebase Implementation
 * Handles authentication and localStorage management
 */
class AuthService {
  constructor() {
    this.auth = auth;
    this.db = db;
    this.googleProvider = new GoogleAuthProvider();
    // Centralized timeouts (ms) used for Firestore operations
    this.timeouts = {
      short: 2000,
      long: 3000,
    };

    // Auto-logout after inactivity
    this.inactivityTimeoutMs = 3 * 60 * 1000; // 5 mins
    this.inactivityTimer = null;
    this._setupInactivityListener();
  }

  _setupInactivityListener() {
    // Only run in browser
    if (typeof window === "undefined") return;
    const resetTimer = () => {
      if (this.inactivityTimer) clearTimeout(this.inactivityTimer);
      this.inactivityTimer = setTimeout(() => {
        if (this.getCurrentUser()) {
          this.logout();
        }
      }, this.inactivityTimeoutMs);
    };
    //  Events that reset the inactivity timer to detect user activity
    ["mousemove", "keydown", "mousedown", "touchstart", "scroll"].forEach(
      (evt) => {
        window.addEventListener(evt, resetTimer, true);
      }
    );
    // Start the inactivity timer when the page loads
    resetTimer();
  }

  /**
   * Register a new user with email and password
   * @param {Object} userData - {email, password, name}
   * @returns {Promise<Object>} User data with token
   */
  async register(userData) {
    const { email, password, name } = userData;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });

      const userDataForStorage = {
        uid: user.uid,
        email: user.email,
        displayName: name,
        role: "user",
        createdAt: new Date().toISOString(),
      };

      // Store in Firestore
      await setDoc(
        doc(this.db, DB_CONFIG.FIREBASE.COLLECTIONS.USERS, user.uid),
        {
          ...userDataForStorage,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }
      );

      const token = await user.getIdToken();

      // Cache user data for better UX
      this.cacheUserData(userDataForStorage);

      return {
        user: userDataForStorage,
        token: token,
      };
    } catch (error) {
      console.error("Registration Error:", error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Sign in with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} User data with token
   */
  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      const user = userCredential.user;

      // Execute operations in parallel for faster login
      const [userDataSettled, tokenSettled, idTokenResultSettled] =
        await Promise.allSettled([
          this.getUserData(user.uid),
          user.getIdToken(),
          user.getIdTokenResult().catch(() => null),
        ]);

      const firestoreData =
        userDataSettled.status === "fulfilled" ? userDataSettled.value : null;
      const authToken =
        tokenSettled.status === "fulfilled" ? tokenSettled.value : null;
      const tokenResult =
        idTokenResultSettled.status === "fulfilled"
          ? idTokenResultSettled.value
          : null;

      // Delegate to common post-login processing
      const processed = await this.processPostLogin(
        user,
        firestoreData,
        authToken,
        tokenResult
      );

      return processed;
    } catch (error) {
      console.error("Login Error:", error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Get user data from Firestore in background
   */
  async getUserDataInBackground(uid) {
    try {
      const userDocRef = doc(
        this.db,
        DB_CONFIG.FIREBASE.COLLECTIONS.USERS,
        uid
      );

      const userDoc = await this.getDocWithTimeout(
        userDocRef,
        this.timeouts.long
      );

      if (userDoc && userDoc.exists()) {
        return userDoc.data();
      }
    } catch (error) {
      console.warn("Background fetch failed:", error.message);
    }
    return null;
  }

  /**
   * Sign in with Google
   * @returns {Promise<Object>} User data with token
   */
  async loginWithGoogle() {
    try {
      const result = await signInWithPopup(this.auth, this.googleProvider);
      const user = result.user;
      // Execute operations in parallel for faster login
      const [userDataSettled, tokenSettled, idTokenResultSettled] =
        await Promise.allSettled([
          this.getUserData(user.uid),
          user.getIdToken(),
          user.getIdTokenResult().catch(() => null),
        ]);

      const firestoreData =
        userDataSettled.status === "fulfilled" ? userDataSettled.value : null;
      const authToken =
        tokenSettled.status === "fulfilled" ? tokenSettled.value : null;
      const tokenResult =
        idTokenResultSettled.status === "fulfilled"
          ? idTokenResultSettled.value
          : null;

      // Ensure doc exists (non-blocking create if not present)
      if (!firestoreData) {
        const newUserData = this.makeNewUserDataFromAuth(user);
        setDoc(doc(this.db, DB_CONFIG.FIREBASE.COLLECTIONS.USERS, user.uid), {
          ...newUserData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }).catch((error) =>
          console.warn("Could not create user document:", error)
        );

        // use the newly built data as fallback
        // keep createdAt as ISO string to match previous shape
        firestoreData = newUserData;
      }

      // Delegate common post-login processing
      const processed = await this.processPostLogin(
        user,
        firestoreData,
        authToken,
        tokenResult
      );

      return processed;
    } catch (error) {
      console.error("Google Login Error:", error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Ensure user document exists in Firestore
   */
  async ensureUserDocumentExists(user) {
    try {
      const userDocRef = doc(
        this.db,
        DB_CONFIG.FIREBASE.COLLECTIONS.USERS,
        user.uid
      );

      const userDoc = await this.getDocWithTimeout(
        userDocRef,
        this.timeouts.long
      );

      if (!userDoc) return null;

      if (!userDoc.exists()) {
        const newUserData = this.makeNewUserDataFromAuth(user);
        await setDoc(userDocRef, newUserData);
        return newUserData;
      } else {
        return userDoc.data();
      }
    } catch (error) {
      console.warn("Could not access Firestore:", error.message);
      return null;
    }
  }

  /**
   * Sign out user
   */
  async logout() {
    try {
      await signOut(this.auth);
      this.clearUserCache();
    } catch (error) {
      console.error("Logout Error:", error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Send password reset email
   */
  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(this.auth, email);
      return { message: "Correo de recuperación enviado" };
    } catch (error) {
      console.error("Password Reset Error:", error);
      throw this.handleAuthError(error);
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
      // Execute operations in parallel
      const [firestoreData, tokenResult] = await Promise.allSettled([
        this.getUserData(user.uid),
        user.getIdTokenResult().catch(() => null),
      ]);

      const userData =
        firestoreData.status === "fulfilled" ? firestoreData.value : null;
      const tokenData =
        tokenResult.status === "fulfilled" ? tokenResult.value : null;

      // Build consistent user object
      return this.buildUserDataFromAuthAndFirestore(user, userData, tokenData, {
        includeEmailVerified: true,
      });
    } catch (error) {
      console.error("Error getting current user data:", error);
      return null;
    }
  }

  /**
   * Check if user has admin privileges (simplified for performance)
   * @param {Object} tokenResult - Firebase ID token result (optional)
   * @param {Object} firestoreData - User data from Firestore (optional)
   * @returns {boolean} True if user is admin
   */
  checkAdminStatus(tokenResult = null, firestoreData = null) {
    // Quick check - no async operations
    return (
      tokenResult?.claims?.admin === true || firestoreData?.role === "admin"
    );
  }

  /**
   * Update user profile
   */
  async updateUserProfile(updates) {
    const user = this.getCurrentUser();
    if (!user) throw new Error("No user logged in");

    try {
      if (updates.displayName) {
        await updateProfile(user, { displayName: updates.displayName });
      }

      await updateDoc(
        doc(this.db, DB_CONFIG.FIREBASE.COLLECTIONS.USERS, user.uid),
        {
          ...updates,
          updatedAt: serverTimestamp(),
        }
      );

      return await this.getCurrentUserData();
    } catch (error) {
      console.error("Update Profile Error:", error);
      throw error;
    }
  }

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback) {
    return onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        try {
          // Use the optimized getCurrentUserData method
          const userData = await this.getCurrentUserData();
          callback(userData);
        } catch (error) {
          console.error("Error getting user data in auth state change:", error);

          // Fallback to basic user data
          callback({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            role: "user",
            isAdmin: false,
          });
        }
      } else {
        callback(null);
      }
    });
  }

  /**
   * Handle Firebase auth errors
   */
  handleAuthError(error) {
    const errorMessages = {
      "auth/email-already-in-use": "Este correo ya está registrado",
      "auth/invalid-email": "Correo electrónico inválido",
      "auth/user-not-found": "Usuario no encontrado",
      "auth/wrong-password": "Contraseña incorrecta",
      "auth/weak-password": "La contraseña debe tener al menos 6 caracteres",
      "auth/too-many-requests": "Demasiados intentos. Intenta más tarde",
      "auth/network-request-failed": "Error de conexión",
      "auth/popup-closed-by-user": "Ventana cerrada por el usuario",
    };

    return new Error(errorMessages[error.code] || error.message);
  }

  /**
   * Cache user data in localStorage for better UX
   * @param {Object} userData - User data to cache
   */
  cacheUserData(userData) {
    try {
      const cacheData = {
        ...userData,
        cachedAt: Date.now(),
      };
      localStorage.setItem("aluna_user_cache", JSON.stringify(cacheData));
    } catch (error) {
      console.warn("Could not cache user data:", error);
    }
  }

  /**
   * Get cached user data (with expiration check)
   * @returns {Object|null} Cached user data or null
   */
  getCachedUserData() {
    try {
      const cached = localStorage.getItem("aluna_user_cache");
      if (!cached) return null;

      const cacheData = JSON.parse(cached);

      // Check if cache is not too old (1 hour)
      const maxAge = 60 * 60 * 1000; // 1 hour in ms
      if (Date.now() - cacheData.cachedAt > maxAge) {
        this.clearUserCache();
        return null;
      }

      return cacheData;
    } catch (error) {
      console.warn("Error reading user cache:", error);
      return null;
    }
  }

  /**
   * Clear user data cache
   */
  clearUserCache() {
    try {
      localStorage.removeItem("aluna_user_cache");
    } catch (error) {
      console.warn("Could not clear user cache:", error);
    }
  }

  /**
   * Get user data quickly - tries cache first, then Firestore
   * @param {string} uid - User ID
   * @returns {Promise<Object|null>} User data
   */
  async getUserDataQuick(uid) {
    // Try cache first
    const cached = this.getCachedUserData();
    if (cached && cached.uid === uid) {
      return cached;
    }

    // Fallback to Firestore
    return this.getUserData(uid);
  }

  /**
   * Get user data from Firestore
   * @param {string} uid - User ID
   * @returns {Promise<Object|null>} User data
   */
  async getUserData(uid) {
    try {
      const userDocRef = doc(
        this.db,
        DB_CONFIG.FIREBASE.COLLECTIONS.USERS,
        uid
      );

      const userDoc = await this.getDocWithTimeout(
        userDocRef,
        this.timeouts.short
      );
      return userDoc && userDoc.exists() ? userDoc.data() : null;
    } catch (error) {
      console.warn("Error getting user data:", error.message);
      return null;
    }
  }

  /**
   * Update user data in Firestore
   * @param {string} uid - User ID
   * @param {Object} updates - Data to update
   */
  async updateUserData(uid, updates) {
    try {
      await updateDoc(doc(this.db, DB_CONFIG.FIREBASE.COLLECTIONS.USERS, uid), {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating user data:", error);
      throw error;
    }
  }

  /**
   * Get a Firestore document with a timeout to avoid hanging requests
   * @param {DocumentReference} docRef
   * @param {number} timeoutMs
   * @returns {Promise<DocumentSnapshot|null>}
   */
  async getDocWithTimeout(docRef, timeoutMs = 2000) {
    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout getting doc")), timeoutMs)
      );

      const snap = await Promise.race([getDoc(docRef), timeoutPromise]);
      return snap;
    } catch (error) {
      // Return null on timeout or failures; caller may choose to continue silently
      // console.warn('getDocWithTimeout error', error.message);
      return null;
    }
  }

  /**
   * Build a minimal new user data object from an Auth user object
   * @param {User} user
   */
  makeNewUserDataFromAuth(user) {
    return {
      uid: user.uid,
      email: user.email,
      displayName:
        user.displayName || (user.email ? user.email.split("@")[0] : ""),
      photoURL: user.photoURL || null,
      role: "user",
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Common post-login processing for both email/password and OAuth flows
   * - determines admin status
   * - builds user data to cache
   * - triggers lastLogin update
   * @returns {{user: Object, token: string}}
   */
  async processPostLogin(user, firestoreData, authToken, tokenResult) {
    // Determine admin status
    const userDataForStorage = this.buildUserDataFromAuthAndFirestore(
      user,
      firestoreData,
      tokenResult,
      { includeLastLogin: true }
    );

    // Cache user data
    this.cacheUserData(userDataForStorage);

    // Update last login asynchronously
    this.updateUserData(user.uid, {
      lastLoginAt: serverTimestamp(),
    }).catch((error) => console.warn("Could not update last login:", error));

    return {
      user: userDataForStorage,
      token: authToken,
    };
  }

  /**
   * Build a consistent user data object from Auth user + Firestore doc + token claims
   * @param {User} user - Firebase Auth user
   * @param {Object|null} firestoreData - Firestore user doc data
   * @param {Object|null} tokenResult - ID token result (claims)
   * @param {Object} options - { includeEmailVerified?: boolean, includeLastLogin?: boolean }
   */
  buildUserDataFromAuthAndFirestore(
    user,
    firestoreData = null,
    tokenResult = null,
    options = {}
  ) {
    const { includeEmailVerified = false, includeLastLogin = false } = options;

    const isAdmin = this.checkAdminStatus(tokenResult, firestoreData);

    const base = {
      uid: user.uid,
      email: user.email,
      displayName:
        user.displayName ||
        (firestoreData && firestoreData.displayName) ||
        (user.email ? user.email.split("@")[0] : ""),
      photoURL:
        user.photoURL || (firestoreData && firestoreData.photoURL) || null,
      role: isAdmin ? "admin" : (firestoreData && firestoreData.role) || "user",
      isAdmin: isAdmin,
      ...(firestoreData || {}),
    };

    if (includeEmailVerified) {
      base.emailVerified = !!user.emailVerified;
    }

    if (includeLastLogin) {
      base.lastLoginAt = new Date().toISOString();
    }

    return base;
  }
}

const authService = new AuthService();
export default authService;
