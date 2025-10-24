import { API_CONFIG } from "../constants/config";

/**
 * Authentication Service - Generic Implementation
 * Ready for future integration with Firebase, Supabase, or custom API
 */
export const authService = {
  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} User data
   */
  async login(email, password) {
    try {
      // TODO: Implement authentication logic
      // This could be Firebase, Supabase, or custom API

      // Placeholder implementation
      console.log("Login attempt:", { email });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock user data
      const userData = {
        id: "1",
        email,
        name: "Usuario Demo",
        role: "client",
      };

      // Store user data locally
      localStorage.setItem("aluna_user_data", JSON.stringify(userData));

      return userData;
    } catch (error) {
      throw new Error("Error en el inicio de sesión");
    }
  },

  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @returns {Promise} User data
   */
  async register(userData) {
    try {
      // TODO: Implement registration logic
      console.log("Register attempt:", userData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock user data
      const newUser = {
        id: Date.now().toString(),
        ...userData,
        role: "client",
      };

      // Store user data locally
      localStorage.setItem("aluna_user_data", JSON.stringify(newUser));

      return newUser;
    } catch (error) {
      throw new Error("Error en el registro");
    }
  },

  /**
   * Logout user
   */
  async logout() {
    try {
      // TODO: Implement logout logic (clear server session, etc.)

      // Clear local storage
      localStorage.removeItem("aluna_user_data");
      localStorage.removeItem("aluna_cart_data");

      console.log("User logged out");
    } catch (error) {
      console.error("Logout error:", error);
      // Clear local storage even if logout fails
      localStorage.removeItem("aluna_user_data");
      localStorage.removeItem("aluna_cart_data");
    }
  },

  /**
   * Get current user data
   * @returns {Promise} User data
   */
  async getCurrentUser() {
    try {
      // TODO: Implement get current user logic
      // This should verify token with server/Firebase

      const userData = this.getStoredUserData();
      if (userData) {
        return userData;
      }

      throw new Error("No authenticated user");
    } catch (error) {
      this.logout(); // Clear invalid data
      throw error;
    }
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  isAuthenticated() {
    const userData = this.getStoredUserData();
    return !!userData;
  },

  /**
   * Get stored user data
   * @returns {Object|null} User data
   */
  getStoredUserData() {
    try {
      const userData = localStorage.getItem("aluna_user_data");
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Error parsing stored user data:", error);
      return null;
    }
  },

  /**
   * Check if user has specific role
   * @param {string} role - Role to check
   * @returns {boolean} True if user has role
   */
  hasRole(role) {
    const userData = this.getStoredUserData();
    return userData && userData.role === role;
  },
};
