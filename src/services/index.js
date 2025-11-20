/**
 * Services Layer - Central Export Point
 *
 * Unified services for authentication, products, and storage management
 */

// Authentication Service
export { default as authService } from "./firebaseAuthService.js";

// Products Service
export { default as productsService } from "./firebaseProductsService.js";

// Users Service
export { default as usersService } from "./firebaseUserService.js";

// Cart Storage Service
export { cartStorageService } from "./cartStorageService.js";

// Firebase configuration (for direct usage if needed)
export * from "./firebase.js";
