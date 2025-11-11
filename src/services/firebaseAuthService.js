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
      const [userData, token, idTokenResult] = await Promise.allSettled([
        this.getUserData(user.uid),
        user.getIdToken(),
        user.getIdTokenResult().catch(() => null),
      ]);

      // Extract results
      const firestoreData =
        userData.status === "fulfilled" ? userData.value : null;
      const authToken = token.status === "fulfilled" ? token.value : null;
      const tokenResult =
        idTokenResult.status === "fulfilled" ? idTokenResult.value : null;

      // Quick admin check
      const isAdmin =
        tokenResult?.claims?.admin === true || firestoreData?.role === "admin";

      const userDataForStorage = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: isAdmin ? "admin" : "user",
        isAdmin: isAdmin,
        lastLoginAt: new Date().toISOString(),
        ...firestoreData,
      };

      // Cache user data for better UX
      this.cacheUserData(userDataForStorage);

      // Update last login in Firestore (background - no await)
      this.updateUserData(user.uid, {
        lastLoginAt: serverTimestamp(),
      }).catch((error) => console.warn("Could not update last login:", error));

      return {
        user: userDataForStorage,
        token: authToken,
      };
    } catch (error) {
      console.error("Login Error:", error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Get user data from Firestore in background (non-blocking)
   */
  async getUserDataInBackground(uid) {
    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), 3000)
      );

      const firestorePromise = getDoc(
        doc(this.db, DB_CONFIG.FIREBASE.COLLECTIONS.USERS, uid)
      );

      const userDoc = await Promise.race([firestorePromise, timeoutPromise]);

      if (userDoc.exists()) {
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
      const [userData, token, idTokenResult] = await Promise.allSettled([
        this.getUserData(user.uid),
        user.getIdToken(),
        user.getIdTokenResult().catch(() => null),
      ]);

      // Extract results
      let firestoreData =
        userData.status === "fulfilled" ? userData.value : null;
      const authToken = token.status === "fulfilled" ? token.value : null;
      const tokenResult =
        idTokenResult.status === "fulfilled" ? idTokenResult.value : null;

      // Create user document if doesn't exist (background operation if possible)
      if (!firestoreData) {
        const newUserData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email.split("@")[0],
          photoURL: user.photoURL,
          role: "user",
          createdAt: new Date().toISOString(),
        };

        // Create document in background to not block login
        setDoc(doc(this.db, DB_CONFIG.FIREBASE.COLLECTIONS.USERS, user.uid), {
          ...newUserData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }).catch((error) =>
          console.warn("Could not create user document:", error)
        );

        firestoreData = newUserData;
      }

      // Quick admin check
      const isAdmin =
        tokenResult?.claims?.admin === true || firestoreData?.role === "admin";

      const userDataForStorage = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: isAdmin ? "admin" : "user",
        isAdmin: isAdmin,
        lastLoginAt: new Date().toISOString(),
        ...firestoreData,
      };

      // Cache user data for better UX
      this.cacheUserData(userDataForStorage);

      // Update last login in Firestore (background - no await)
      this.updateUserData(user.uid, {
        lastLoginAt: serverTimestamp(),
      }).catch((error) => console.warn("Could not update last login:", error));

      return {
        user: userDataForStorage,
        token: token,
      };
    } catch (error) {
      console.error("Google Login Error:", error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Ensure user document exists in Firestore (background operation)
   */
  async ensureUserDocumentExists(user) {
    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), 3000)
      );

      const userDocRef = doc(
        this.db,
        DB_CONFIG.FIREBASE.COLLECTIONS.USERS,
        user.uid
      );

      const firestorePromise = getDoc(userDocRef).then(async (userDoc) => {
        if (!userDoc.exists()) {
          const newUserData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            role: "user",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          };
          await setDoc(userDocRef, newUserData);
          return newUserData;
        } else {
          return userDoc.data();
        }
      });

      return await Promise.race([firestorePromise, timeoutPromise]);
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

      // Quick admin check
      const isAdmin = this.checkAdminStatus(tokenData, userData);

      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        role: isAdmin ? "admin" : "user",
        isAdmin: isAdmin,
        ...userData,
      };
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
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout getting user data")), 2000)
      );

      const firestorePromise = getDoc(
        doc(this.db, DB_CONFIG.FIREBASE.COLLECTIONS.USERS, uid)
      );

      const userDoc = await Promise.race([firestorePromise, timeoutPromise]);
      return userDoc.exists() ? userDoc.data() : null;
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
}

// Create and export singleton instance
const authService = new AuthService();
export default authService;
