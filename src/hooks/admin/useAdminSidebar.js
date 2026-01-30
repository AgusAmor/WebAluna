/**
 * useAdminSidebar.js
 * Custom hook for managing admin sidebar state and interactions.
 * Handles mobile menu, logout, and navigation logic for admin navigation.
 */

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { notifyAuth } from "../../services/ui/notificationService";

export function useAdminSidebar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  /**
   * Closes the mobile menu
   */
  const closeSidebar = () => {
    setIsMenuOpen(false);
  };

  /**
   * Handles user logout
   */
  const handleLogout = async () => {
    try {
      await logout();
      closeSidebar();
      navigate("/");
      notifyAuth.logoutSuccess();
    } catch (error) {
      console.error("Logout error:", error);
      notifyAuth.logoutError();
    }
  };

  /**
   * Navigates to a path and closes the menu
   * @param {string} path - Path to navigate to
   */
  const handleNavigate = (path) => {
    navigate(path);
    closeSidebar();
  };

  /**
   * Toggles mobile menu
   */
  const toggleMobileMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  /**
   * Checks if a path is active
   */
  const isActive = (path) => location.pathname.startsWith(path);

  return {
    // State
    isMenuOpen,
    isHovering,
    location,
    user,
    // Handlers
    handleLogout,
    handleNavigate,
    toggleMobileMenu,
    closeSidebar,
    isActive,
    // Setters
    setIsHovering,
  };
}
