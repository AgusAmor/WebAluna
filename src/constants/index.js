/**
 * Constants - Centralized Export Point
 *
 * All application constants organized by domain:
 * - auth: Authentication and user roles
 * - cart: Shopping cart actions
 * - product: Product categories and order status
 * - route: Application routes
 * - ui: UI settings and storage keys
 * - validation: Form validation rules
 */

// Authentication & Authorization
export * from "./authConstants";

// Cart Operations
export * from "./cartConstants";

// Product & Orders
export * from "./productConstants";

// Routes
export * from "./routeConstants";

// UI & Storage
export * from "./uiConstants";

// Validation
export * from "./validationConstants";

// Re-export for backward compatibility
export { USER_ROLES } from "./authConstants";
export { CART_ACTIONS } from "./cartConstants";
export { PRODUCT_CATEGORIES, ORDER_STATUS } from "./productConstants";
export { ROUTES } from "./routeConstants";
export { UI_CONSTANTS, STORAGE_KEYS } from "./uiConstants";
export { VALIDATION } from "./validationConstants";
