/**
 * Common Components - Centralized Exports
 *
 * Organized by category:
 * - forms: Form-related components
 * - modals: Modal dialogs
 * - navigation: Navigation components
 * - management: Admin management pages
 * - General utilities
 */

// Forms
export { default as AddressForm } from "./forms/AddressForm.jsx";

// Modals
export { default as ConfirmationModal } from "./modals/ConfirmationModal.jsx";
export { default as LoginModal } from "./modals/LoginModal.jsx";

// Navigation
export { default as MobileNavigationMenu } from "./navigation/MobileNavigationMenu.jsx";
export { default as NavigationLinks } from "./navigation/NavigationLinks.jsx";
export { default as UserMenuDropdown } from "./navigation/UserMenuDropdown.jsx";

// General
export { default as FloatingCartButton } from "./FloatingCartButton.jsx";
export { default as Hero } from "./Hero.jsx";
export { default as ProtectedRoute } from "./ProtectedRoute.jsx";
