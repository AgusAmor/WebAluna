/**
 * Services Layer - Central Export Point
 *
 * Unified services for authentication, products, users, and storage management
 * All services use the centralized apiClient for consistent error handling
 */

// Authentication Service
export { default as authService } from "./firebaseAuthService.js";

// Products Service
export { default as productsService } from "./firebaseProductsService.js";

// Users Service
export * from "./firebaseUserService.js";

// Cart Storage Service
export { cartStorageService } from "./cartStorageService.js";

// Firebase configuration (for direct usage if needed)
export * from "./firebase.js";

// API Client (for advanced use cases)
export * from "./apiClient.js";
