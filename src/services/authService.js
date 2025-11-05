import firebaseAuthService from "./firebaseAuthService";

/**
 * Authentication Service - Firebase Implementation
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
      const result = await firebaseAuthService.login(email, password);

      if (result.token) {
        localStorage.setItem("aluna_auth_token", result.token);
      }

      localStorage.setItem("aluna_user_data", JSON.stringify(result.user));

      return result.user;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  /**
   * Login with Google
   * @returns {Promise} User data
   */
  async loginWithGoogle() {
    try {
      const result = await firebaseAuthService.loginWithGoogle();

      if (result.token) {
        localStorage.setItem("aluna_auth_token", result.token);
      }

      localStorage.setItem("aluna_user_data", JSON.stringify(result.user));

      return result.user;
    } catch (error) {
      console.error("Google login error:", error);
      throw error;
    }
  },

  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @returns {Promise} User data
   */
  async register(userData) {
    try {
      const { email, password, name } = userData;
      const result = await firebaseAuthService.register(email, password, name);

      localStorage.setItem("aluna_user_data", JSON.stringify(result.user));

      return result.user;
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  },

  /**
   * Logout user
   */
  async logout() {
    try {
      await firebaseAuthService.logout();

      localStorage.removeItem("aluna_user_data");
      localStorage.removeItem("aluna_auth_token");
      localStorage.removeItem("aluna_cart_data");

      console.log("User logged out");
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.removeItem("aluna_user_data");
      localStorage.removeItem("aluna_auth_token");
      localStorage.removeItem("aluna_cart_data");
    }
  },

  /**
   * Reset password
   * @param {string} email - User email
   * @returns {Promise} Result
   */
  async resetPassword(email) {
    try {
      return await firebaseAuthService.resetPassword(email);
    } catch (error) {
      console.error("Reset password error:", error);
      throw error;
    }
  },

  /**
   * Get current user data
   * @returns {Promise} User data
   */
  async getCurrentUser() {
    try {
      const userData = await firebaseAuthService.getCurrentUserData();

      if (userData) {
        localStorage.setItem("aluna_user_data", JSON.stringify(userData));
        return userData;
      }

      throw new Error("No authenticated user");
    } catch (error) {
      this.logout();
      throw error;
    }
  },

  /**
   * Update user profile
   * @param {Object} updates - Profile updates
   * @returns {Promise} Updated user data
   */
  async updateProfile(updates) {
    try {
      const userData = await firebaseAuthService.updateUserProfile(updates);

      localStorage.setItem("aluna_user_data", JSON.stringify(userData));

      return userData;
    } catch (error) {
      console.error("Update profile error:", error);
      throw error;
    }
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  isAuthenticated() {
    const currentUser = firebaseAuthService.getCurrentUser();
    return !!currentUser;
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

  /**
   * Listen to auth state changes
   * @param {Function} callback - Callback function
   * @returns {Function} Unsubscribe function
   */
  onAuthStateChange(callback) {
    return firebaseAuthService.onAuthStateChange(callback);
  },
};
