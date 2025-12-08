/**
 * headerService.js
 * Business logic for header navigation and user display.
 * Contains pure functions with no React dependencies.
 */

import { isUserAdmin } from "../../utils/adminUtils";

/**
 * Calculates logo size based on scroll state and viewport
 * @param {boolean} isScrolled - Whether page is scrolled
 * @param {boolean} isMobile - Whether viewport is mobile
 * @returns {number} - Logo height in pixels
 */
export function getLogoSize(isScrolled, isMobile) {
  if (isMobile) {
    return 64;
  }
  return isScrolled ? 48 : 80;
}

/**
 * Gets user display name for header
 * @param {Object} user - User object from auth
 * @param {boolean} shortVersion - Whether to show only first name
 * @returns {string} - Display name or email username
 */
export function getUserDisplayName(user, shortVersion = false) {
  if (!user) return "";

  // If displayName exists and is not empty
  if (user.displayName && user.displayName.trim() !== "") {
    return shortVersion ? user.displayName.split(" ")[0] : user.displayName;
  }

  // Fallback to email username (before '@')
  if (user.email) {
    return user.email.split("@")[0];
  }

  return "";
}

/**
 * Gets user role label for display
 * @param {Object} user - User object from auth
 * @returns {string} - Role label in Spanish
 */
export function getUserRoleLabel(user) {
  if (!user) return "Usuario";
  return isUserAdmin(user) ? "Administrador" : "Usuario";
}

/**
 * Determines if current route is active
 * @param {string} pathname - Current location pathname
 * @param {string} routePath - Route path to check
 * @returns {boolean} - Whether route is active
 */
export function isRouteActive(pathname, routePath) {
  return pathname === routePath;
}

/**
 * Gets navigation link classes based on active state
 * @param {boolean} isActive - Whether link is active
 * @returns {string} - CSS classes
 */
export function getNavLinkClasses(isActive) {
  const baseClasses =
    "font-family-comfortaa hover:underline transition-colors duration-300";
  const activeClasses = "text-gold font-bold";
  const inactiveClasses = "text-white hover:text-gold";

  return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
}

/**
 * Navigation routes configuration
 * @returns {Array} - Array of route objects
 */
export function getNavigationRoutes() {
  return [
    { path: "/", label: "Inicio" },
    { path: "/productos", label: "Productos" },
    { path: "/sobre-nosotros", label: "Nosotros" },
    { path: "/contacto", label: "Contacto" },
  ];
}
