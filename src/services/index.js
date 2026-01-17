/**
 * Services Layer - Central Export Point
 *
 * Organized service exports by domain:
 * - auth: Authentication and account management
 * - cart: Shopping cart operations
 * - firebase: Firebase integrations
 * - products: Product management
 * - ui: UI-related services (header, home)
 * - users: User profile and management
 * - validation: Centralized form validation
 */

// ===== VALIDATION SERVICES =====
export * from "./validationService.js";

// ===== AUTH SERVICES =====
export { default as authService } from "./firebase/firebaseAuthService.js";
export * from "./auth/authHelpers.js";
export * from "./auth/loginService.js";
export * from "./auth/accountService.js";

// ===== CART SERVICES =====
export { cartStorageService } from "./cart/cartStorageService.js";
export * from "./cart/cartService.js";
export * from "./cart/cartModalService.js";

// ===== FIREBASE SERVICES =====
export * from "./firebase/firebase.js";
export * from "./firebase/apiClient.js";
export * from "./firebase/firebaseProductService.js";
export * from "./firebase/firebaseUserService.js";

// ===== PRODUCT SERVICES =====
export * from "./products/productManagementService.js";
export * from "./products/productsService.js";

// ===== UI SERVICES =====
export * from "./ui/headerService.js";
export * from "./ui/homeService.js";

// ===== USER SERVICES =====
export * from "./users/index.js";
