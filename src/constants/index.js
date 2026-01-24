/**
 * Constants - Centralized Export Point
 *
 * All application constants organized by domain:
 * - auth: Authentication and user roles
 * - cart: Shopping cart actions
 * - product: Order statuses
 * - route: Application routes
 * - validation: Form validation rules
 */

// Authentication & Authorization
export * from "./authConstants";

// Cart Operations
export * from "./cartConstants";

// Order Statuses
export * from "./orderConstants";

// Routes
export * from "./routeConstants";

// Validation
export * from "./validationConstants";

// Re-export for backward compatibility
export { USER_ROLES } from "./authConstants";
export { CART_ACTIONS } from "./cartConstants";
export { ORDER_STATUS } from "./orderConstants";
export { ROUTES } from "./routeConstants";
export { VALIDATION } from "./validationConstants";
