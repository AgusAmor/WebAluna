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
 * Firebase Authentication Service
 */
class FirebaseAuthService {
  constructor() {
    this.auth = auth;
    this.db = db;
    this.googleProvider = new GoogleAuthProvider();
  }

  /**
   * Register a new user with email and password
   */
  async register(email, password, displayName) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      const user = userCredential.user;

      await updateProfile(user, { displayName });

      const basicUserData = {
        uid: user.uid,
        email: user.email,
        displayName: displayName,
        role: "user",
      };

      setDoc(doc(this.db, DB_CONFIG.FIREBASE.COLLECTIONS.USERS, user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: displayName,
        role: "user",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }).catch((error) => {
        console.warn("Could not create user document:", error.message);
      });

      return {
        user: basicUserData,
      };
    } catch (error) {
      console.error("Registration Error:", error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Sign in with email and password
   */
  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      const user = userCredential.user;

      const idTokenResult = await user.getIdTokenResult();
      const isAdmin = idTokenResult.claims.admin === true;

      const basicUserData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: isAdmin ? "admin" : "user",
        admin: isAdmin,
      };

      localStorage.setItem("aluna_user_data", JSON.stringify(basicUserData));

      this.getUserDataInBackground(user.uid).then((firestoreData) => {
        if (firestoreData) {
          const completeData = { ...basicUserData, ...firestoreData };
          localStorage.setItem("aluna_user_data", JSON.stringify(completeData));
        }
      });

      return {
        user: basicUserData,
        token: await user.getIdToken(),
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
   */
  async loginWithGoogle() {
    try {
      const result = await signInWithPopup(this.auth, this.googleProvider);
      const user = result.user;

      const idTokenResult = await user.getIdTokenResult();
      const isAdmin = idTokenResult.claims.admin === true;

      const basicUserData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: isAdmin ? "admin" : "user",
        admin: isAdmin,
      };

      localStorage.setItem("aluna_user_data", JSON.stringify(basicUserData));

      this.ensureUserDocumentExists(user).then((firestoreData) => {
        if (firestoreData) {
          const completeData = { ...basicUserData, ...firestoreData };
          localStorage.setItem("aluna_user_data", JSON.stringify(completeData));
        }
      });

      return {
        user: basicUserData,
        token: await user.getIdToken(),
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
   * Sign out
   */
  async logout() {
    try {
      await signOut(this.auth);
      localStorage.removeItem("aluna_auth_token");
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
   * Get current user data from Firestore
   */
  async getCurrentUserData() {
    const user = this.getCurrentUser();
    if (!user) return null;

    try {
      const idTokenResult = await user.getIdTokenResult();
      const isAdmin = idTokenResult.claims.admin === true;

      let userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: isAdmin ? "admin" : "user",
        admin: isAdmin,
      };

      try {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), 3000)
        );

        const firestorePromise = getDoc(
          doc(this.db, DB_CONFIG.FIREBASE.COLLECTIONS.USERS, user.uid)
        );

        const userDoc = await Promise.race([firestorePromise, timeoutPromise]);

        if (userDoc.exists()) {
          const firestoreData = userDoc.data();

          userData = {
            ...userData,
            ...firestoreData,

            role: isAdmin ? "admin" : firestoreData.role || "user",
            admin: isAdmin,
          };
        }
      } catch (error) {
        console.warn(
          "Could not fetch user data from Firestore:",
          error.message
        );
      }

      return userData;
    } catch (error) {
      console.error("Error getting user token:", error);
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
          const idTokenResult = await user.getIdTokenResult();
          const isAdmin = idTokenResult.claims.admin === true;

          const basicUserData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            role: isAdmin ? "admin" : "user",
            admin: isAdmin,
          };

          callback(basicUserData);

          this.getCurrentUserData().then((completeData) => {
            if (completeData) {
              callback(completeData);
            }
          });
        } catch (error) {
          console.error("Error getting token:", error);

          const basicUserData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            role: "user",
          };
          callback(basicUserData);
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
}

const firebaseAuthService = new FirebaseAuthService();
export default firebaseAuthService;
