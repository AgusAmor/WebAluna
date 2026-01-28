/**
 * Constants - Centralized Export Point
 *
 * All application constants organized by domain:
 * - cart: Shopping cart actions
 * - order: Order statuses
 * - validation: Form validation rules
 * - shipping: Shipping cost configuration
 */

// Cart Operations
export * from "./cartConstants";

// Order Statuses
export * from "./orderConstants";

// Validation
export * from "./validationConstants";

// Shipping Configuration
export { SHIPPING_CONFIG } from "./shippingConfig";

// Re-export for backward compatibility
export { CART_ACTIONS } from "./cartConstants";
export { ORDER_STATUS } from "./orderConstants";
export { VALIDATION } from "./validationConstants";
