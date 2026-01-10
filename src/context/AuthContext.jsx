import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAutoLogout } from "../hooks";
import PropTypes from "prop-types";
import authService from "../services/firebase/firebaseAuthService";
import { fetchUserById } from "../services/firebase/firebaseUserService";
import { cartStorageService } from "../services/cart/cartStorageService";
import {
  validateResetEmail,
  handleAuthAction,
  isAuthenticated,
  isAdmin,
  refreshUserToken,
  mergeUserProfile,
} from "../services/auth/authHelpers";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Listen for authentication state changes in Firebase Auth and update user role using custom claims
    const unsubscribe = authService.auth.onAuthStateChanged(
      async (currentUser) => {
        if (currentUser) {
          try {
            // Force token refresh to get updated custom claims
            await currentUser.getIdToken(true);

            // Verify that user document exists in Firestore before setting user
            // This prevents showing user as logged in if registration failed
            const userDocExists = await authService.checkUserDocExists(
              currentUser.uid
            );

            if (userDocExists) {
              // Check if account is suspended BEFORE setting user as authenticated
              const userDoc = await fetchUserById(currentUser.uid);
              if (userDoc.accountStatus === "suspended") {
                // Account is suspended - sign out and set error
                await authService.logout();
                setError(
                  "Tu cuenta ha sido suspendida. Contacta con el administrador."
                );
                setUser(null);
              } else {
                const userWithRole = await authService.adminVerify(currentUser);
                setUser(userWithRole);
                setError(null); // Clear any previous error
              }
            } else {
              // User exists in Auth but not in Firestore - sign them out
              await authService.logout();
              setUser(null);
            }
          } catch (err) {
            console.error("Error verifying user:", err);
            setUser(null);
          }
        } else {
          setUser(null);
          // Clear cart when user logs out
          cartStorageService.clearCart();
        }
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Automatically log out the user after a period of inactivity
  useAutoLogout(() => {
    if (user) {
      logout();
      toast.info("Sesión cerrada por inactividad", {
        position: "bottom-right",
        autoClose: 4000,
      });
    }
  }, 5 * 60 * 1000);

  /**
   * Logs in a user using email and password credentials
   */
  const login = async (email, password) => {
    return handleAuthAction(
      () => authService.login(email, password),
      setError,
      setLoading,
      setUser
    );
  };

  /**
   * Logs in a user using Google authentication popup
   */
  const loginWithGoogle = async () => {
    return handleAuthAction(
      () => authService.loginWithGoogle(),
      setError,
      setLoading,
      setUser
    );
  };

  /**
   * Registers a new user with email, password, and name
   */
  const register = async (email, password, name) => {
    return handleAuthAction(
      () => authService.register({ email, password, name }),
      setError,
      setLoading,
      setUser
    );
  };

  /**
   * Logs out the current user and clears user state
   * Also clears the shopping cart for security
   * Handles errors during logout
   */
  const logout = async () => {
    try {
      setError(null);
      // Clear cart before logout
      cartStorageService.clearCart();
      await authService.logout();
      setUser(null);
      return true; // Return success
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  /**
   * Handles password reset request
   */
  const requestPasswordReset = async (email) => {
    setError(null);
    validateResetEmail(email);
    const exists = await authService.verifyEmailExists(email);
    if (!exists) {
      throw new Error("Email is not registered.");
    }
    return await authService.resetPassword(email);
  };

  /**
   * Updates the user profile in the context
   */
  const updateUserProfile = (updatedData) => {
    if (user) {
      setUser((prevUser) => mergeUserProfile(prevUser, updatedData));
    }
  };

  /**
   * Refreshes the current user object from Firebase Auth
   */
  const refreshUser = async () => {
    const currentUser = authService.auth.currentUser;
    if (currentUser) {
      const userWithRole = await refreshUserToken(
        currentUser,
        authService.adminVerify
      );
      setUser(userWithRole);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    loginWithGoogle,
    register,
    logout,
    requestPasswordReset,
    updateUserProfile,
    refreshUser,
    isAuthenticated: isAuthenticated(user),
    isAdmin: isAdmin(user),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Custom hook to access the authentication context
 * Throws an error if used outside of AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default useAuth;
