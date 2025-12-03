/**
 * useHeader.js
 * Custom hook for managing header state and interactions.
 * Encapsulates scroll detection, menu state, and user menu logic.
 */

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function useHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  // Scroll detection with requestAnimationFrame for performance
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollPosition = window.scrollY;

          if (scrollPosition > 120) {
            setIsScrolled(true);
          } else if (scrollPosition < 60) {
            setIsScrolled(false);
          }

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
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  /**
   * Navigates to profile or admin panel based on user role
   */
  const handleProfileClick = () => {
    setShowUserMenu(false);
    if (user?.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/profile");
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
    isScrolled,
    isMenuOpen,
    isLoginModalOpen,
    showUserMenu,
    location,
    user,
    isAuthenticated,
    // Handlers
    handleLogout,
    handleProfileClick,
    handleNavigate,
    toggleMobileMenu,
    toggleUserMenu,
    openLoginModal,
    closeLoginModal,
    closeUserMenu,
  };
}
