import { createContext, useContext, useState, useEffect } from "react";
import { notifyAuth } from "../services/ui/notificationService";
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
    // Track whether we have ever seen an authenticated user in this listener.
    // We use a local variable (not a ref) so it's scoped to this effect instance.
    // This lets us distinguish "user just logged out" (wasAuthenticated=true → null)
    // from "initial page load before auth is restored" (wasAuthenticated=false → null).
    // We only clear the cart on the former to preserve cart data across full-page
    // redirects (e.g. MercadoPago failure redirects back to the checkout page).
    let wasAuthenticated = false;

    // Listen for authentication state changes in Firebase Auth and update user role using custom claims
    const unsubscribe = authService.auth.onAuthStateChanged(
      async (currentUser) => {
        if (currentUser) {
          wasAuthenticated = true;
          try {
            // Parallelize validations for faster response
            const [tokenResult, userDocExists] = await Promise.all([
              currentUser.getIdToken(true),
              authService.checkUserDocExists(currentUser.uid),
            ]);

            if (userDocExists) {
              // Fetch user doc without retries initially (faster)
              const userDoc = await fetchUserById(currentUser.uid);

              if (userDoc.accountStatus === "suspended") {
                // Account is suspended - sign out and set error
                await authService.logout();
                setError(
                  "Tu cuenta ha sido suspendida. Contacta con el administrador.",
                );
                setUser(null);
              } else {
                const userWithRole = await authService.adminVerify(currentUser);
                setUser(userWithRole);
                setError(null); // Clear any previous error
              }
            } else {
              // User exists in Auth but not in Firestore
              // Retry only 1 more time (not 3 times)
              await new Promise((resolve) => setTimeout(resolve, 200));
              const retryExists = await authService.checkUserDocExists(
                currentUser.uid,
              );

              if (retryExists) {
                const userDoc = await fetchUserById(currentUser.uid);
                if (userDoc.accountStatus !== "suspended") {
                  const userWithRole =
                    await authService.adminVerify(currentUser);
                  setUser(userWithRole);
                  setError(null);
                  setLoading(false);
                  return;
                }
              }

              // Failed after retries
              await authService.logout();
              setUser(null);
            }
          } catch (err) {
            console.error("Error verifying user:", err);
            setUser(null);
          }
        } else {
          setUser(null);
          // Only clear the cart when the user actively logs out (wasAuthenticated=true).
          // Skip on initial page load where auth briefly resolves to null before
          // restoring the persisted session — clearing here would erase cart data
          // that CartContext just loaded from sessionStorage (e.g. after a MP redirect).
          if (wasAuthenticated) {
            cartStorageService.clearCart();
          }
        }
        setLoading(false);
      },
    );
    return () => unsubscribe();
  }, []);

  // Automatically log out the user after a period of inactivity
  useAutoLogout(
    () => {
      if (user) {
        logout();
        notifyAuth.sessionExpired();
      }
    },
    5 * 60 * 1000,
  );

  /**
   * Logs in a user using email and password credentials
   */
  const login = async (email, password) => {
    return handleAuthAction(
      () => authService.login(email, password),
      setError,
      setLoading,
      setUser,
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
      setUser,
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
      setUser,
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
        authService.adminVerify,
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
