/**
 * firebaseAuthService.js
 * Facade for Firebase Authentication Services
 * Re-exports functions from specialized auth modules
 * Maintains backward compatibility while improving code organization
 */

// Core authentication functions
export {
  registerUser,
  loginUser,
  loginWithGoogle,
  logoutUser,
  resetUserPassword,
  deleteCurrentUserAccount,
  adminVerify,
  auth,
} from "./firebaseAuthCoreService";

// Email validation functions
export { verifyEmailExists, validateEmailDomain } from "./firebaseEmailService";

// User status check functions
export {
  checkUserDocExists,
  checkUserAccountStatus,
  getCurrentUser,
} from "./firebaseUserCheckService";

// Default export for backward compatibility
import {
  registerUser,
  loginUser,
  loginWithGoogle,
  logoutUser,
  resetUserPassword,
  deleteCurrentUserAccount,
  adminVerify,
  auth,
} from "./firebaseAuthCoreService";

import { verifyEmailExists, validateEmailDomain } from "./firebaseEmailService";

import {
  checkUserDocExists,
  checkUserAccountStatus,
  getCurrentUser,
} from "./firebaseUserCheckService";

const authService = {
  registerUser,
  loginUser,
  loginWithGoogle,
  logoutUser,
  resetUserPassword,
  deleteCurrentUserAccount,
  verifyEmailExists,
  validateEmailDomain,
  checkUserDocExists,
  checkUserAccountStatus,
  getCurrentUser,
  adminVerify,
  auth,
  // Aliases for backward compatibility
  register: registerUser,
  login: loginUser,
  logout: logoutUser,
  resetPassword: resetUserPassword,
};

export default authService;
