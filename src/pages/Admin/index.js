/**
 * Admin Pages - Centralized Exports
 *
 * Organized by domain:
 * - Products: Product management pages
 * - Users: User management pages
 * - Orders: Order management pages
 */

export { default } from "./Admin.jsx";

// Product Management
export { default as ProductManagement } from "./Products/ProductManagement.jsx";
export { default as ProductForm } from "./Products/ProductForm.jsx";

// User Management
export { default as UserManagement } from "./Users/UserManagement.jsx";
export { default as UserForm } from "./Users/UserForm.jsx";

// Order Management
export { default as OrderManagement } from "./Orders/OrderManagement.jsx";
