/**
 * Constants - Centralized Export Point
 *
 * All application constants organized by domain:
 * - auth: Authentication and user roles
 * - cart: Shopping cart actions
 * - product: Product categories
 * - route: Application routes
 * - ui: UI settings and storage keys
 * - validation: Form validation rules
 */

// Authentication & Authorization
export * from "./authConstants";

// Cart Operations
export * from "./cartConstants";

// Product
export * from "./productConstants";

// Routes
export * from "./routeConstants";

// Validation
export * from "./validationConstants";

// Re-export for backward compatibility
export { USER_ROLES } from "./authConstants";
export { CART_ACTIONS } from "./cartConstants";
export { PRODUCT_CATEGORIES, ORDER_STATUS } from "./productConstants";
export { ROUTES } from "./routeConstants";
export { VALIDATION } from "./validationConstants";
