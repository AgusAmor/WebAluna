/**
 * useHeader.js
 * Custom hook for managing header state and interactions.
 * Encapsulates scroll detection, menu state, and user menu logic.
 */

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { notifyAuth } from "../../services/ui/notificationService";
import { useAuth } from "../../context/AuthContext";
import { isUserAdmin } from "../../utils/adminUtils";

export function useHeader() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  // Scroll detection with smooth progress calculation
  useEffect(() => {
    let ticking = false;
    const SCROLL_START = 0;
    const SCROLL_END = 150;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollPosition = window.scrollY;

          // Calculate smooth progress (0 to 1) for all animations
          const progress = Math.min(
            Math.max(
              (scrollPosition - SCROLL_START) / (SCROLL_END - SCROLL_START),
              0,
            ),
            1,
          );
          setScrollProgress(progress);

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Click outside handler for user menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest(".user-menu-container")) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showUserMenu]);

  /**
   * Handles user logout
   */
  const handleLogout = async () => {
    try {
      await logout();
      setShowUserMenu(false);
      navigate("/");
      notifyAuth.logoutSuccess();
    } catch (error) {
      console.error("Logout error:", error);
      notifyAuth.logoutError();
    }
  };

  /**
   * Navigates to specific page and closes menus
   * @param {string} path - Path to navigate to
   */
  const handleNavigate = (path) => {
    setShowUserMenu(false);
    setIsMenuOpen(false);
    navigate(path);
  };

  /**
   * Toggles mobile menu
   */
  const toggleMobileMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  /**
   * Toggles user menu dropdown
   */
  const toggleUserMenu = () => {
    setShowUserMenu((prev) => !prev);
  };

  /**
   * Opens login modal
   */
  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  /**
   * Closes login modal
   */
  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  /**
   * Closes user menu
   */
  const closeUserMenu = () => {
    setShowUserMenu(false);
  };

  return {
    // State
    scrollProgress,
    isMenuOpen,
    isLoginModalOpen,
    showUserMenu,
    location,
    user,
    isAuthenticated,
    // Handlers
    handleLogout,
    handleNavigate,
    toggleMobileMenu,
    toggleUserMenu,
    openLoginModal,
    closeLoginModal,
    closeUserMenu,
  };
}
