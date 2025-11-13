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
    // Listen for session changes in Firebase Auth
    const unsubscribe = authService.auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Auto-logout after inactivity
  useAutoLogout(() => {
    if (user) {
      logout();
    }
  }, 5 * 60 * 1000);

  /**
   * Login with email and password
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
   * Login with Google
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
   * Register new user
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
   * Logout
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
   * Reset password
   */
  const resetPassword = async (email) => {
    try {
      setError(null);
      return await authService.resetPassword(email);
    } catch (err) {
      setError(err.message);
      throw err;
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
    resetPassword,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Custom hook to use auth context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default useAuth;
