import { createContext, useContext, useState, useEffect } from "react";
import { useAutoLogout } from "../hooks/useAutoLogout.js";
import PropTypes from "prop-types";
import authService from "../services/firebaseAuthService";

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
          // Force token refresh to get updated custom claims
          await currentUser.getIdToken(true);
          const userWithRole = await authService.adminVerify(currentUser);
          setUser(userWithRole);
        } else {
          setUser(null);
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
    }
  }, 5 * 60 * 1000);

  /**
   * Logs in a user using email and password credentials
   * Updates user state and handles errors
   */
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      const user = await authService.login(email, password);
      setUser(user);
      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logs in a user using Google authentication popup
   * AuthService handles creating user document in Firestore if it's a new user
   * Updates user state and handles errors
   */
  const loginWithGoogle = async () => {
    try {
      setError(null);
      setLoading(true);
      const user = await authService.loginWithGoogle();
      setUser(user);
      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Registers a new user with email, password, and name
   * Updates user state and handles errors
   */
  const register = async (email, password, name) => {
    try {
      setError(null);
      setLoading(true);
      const user = await authService.register({ email, password, name });
      setUser(user);
      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logs out the current user and clears user state
   * Handles errors during logout
   */
  const logout = async () => {
    try {
      setError(null);
      await authService.logout();
      setUser(null);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  /**
   * Handles password reset request: verifies if the email exists and sends a reset email if valid
   * Returns a message or throws an error for UI display
   */
  const requestPasswordReset = async (email) => {
    setError(null);
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      throw new Error("Please enter a valid email address.");
    }
    const exists = await authService.verifyEmailExists(email);
    if (!exists) {
      throw new Error("Email is not registered.");
    }
    return await authService.resetPassword(email);
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
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
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
