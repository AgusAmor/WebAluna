import { Link } from "react-router-dom";
import { FiUser } from "react-icons/fi";
import { HiMenu } from "react-icons/hi";
import { MdLogin } from "react-icons/md";
import logo from "../../assets/logos/logotipo.png";
import {
  LoginModal,
  UserMenuDropdown,
  NavigationLinks,
  MobileNavigationMenu,
} from "../common";
import { useHeader } from "../../hooks";
import {
  getLogoSize,
  getUserDisplayName,
} from "../../services/ui/headerService";

const Header = () => {
  const {
    scrollProgress,
    isMenuOpen,
    isLoginModalOpen,
    showUserMenu,
    location,
    user,
    isAuthenticated,
    handleLogout,
    handleNavigate,
    toggleMobileMenu,
    toggleUserMenu,
    openLoginModal,
    closeLoginModal,
    closeUserMenu,
  } = useHeader();

  const logoSizeMobile = getLogoSize(false, true);

  // Calculate intermediate logo size based on scroll progress for smooth transition
  // Smooth transition from 80px to 48px as scrollProgress goes from 0 to 1
  const smoothLogoSize = 80 + (48 - 80) * scrollProgress;

  return (
    <>
      <header className="bg-blue-1 border-blue-2 dark:bg-blue-1 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 transition-all duration-300">
          {/* Mobile Layout: Always the same (no scroll animation) */}
          <div className="flex lg:hidden items-center justify-between py-2 sm:py-3 md:py-4">
            <Link to="/" className="shrink-0">
              <img
                src={logo}
                alt="LogoAluna"
                style={{ height: `${Math.max(logoSizeMobile, 40)}px` }}
              />
            </Link>

            <div className="flex items-center gap-1 sm:gap-2">
              {/* Login button - only visible when not authenticated */}
              {!isAuthenticated && (
                <button
                  onClick={openLoginModal}
                  className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-2 text-white hover:text-gold transition-colors text-xs sm:text-sm rounded-lg hover:bg-blue-2"
                  aria-label="Login"
                >
                  <MdLogin size={20} />
                  <span className="hidden sm:inline font-family-comfortaa">
                    Iniciar Sesión
                  </span>
                </button>
              )}

              {/* Hamburger menu */}
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-white rounded-lg hover:bg-blue-2 focus:outline-none focus:ring-2 focus:ring-gold"
                aria-controls="mobile-menu"
                aria-expanded={isMenuOpen}
              >
                <span className="sr-only">Open menu</span>
                <HiMenu className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Desktop Layout: With smooth scroll-based animation */}
          <div
            className="hidden lg:flex items-center"
            style={{
              justifyContent:
                scrollProgress > 0.5 ? "space-between" : "flex-start",
              flexDirection: scrollProgress > 0.5 ? "row" : "column",
              paddingTop: 24 + (16 - 24) * scrollProgress,
              paddingBottom: 24 + (16 - 24) * scrollProgress,
              gap: 16 - (16 - 24) * scrollProgress,
              willChange: "padding, gap, flex-direction, justify-content",
            }}
          >
            <Link to="/" className="shrink-0">
              <img
                src={logo}
                alt="LogoAluna"
                style={{ height: `${smoothLogoSize}px` }}
                className="transition-all duration-300 ease-out"
              />
            </Link>

            {/* Navigation - visible in both states but positioned differently */}
            <div>
              <NavigationLinks currentPath={location.pathname} />
            </div>

            {/* User menu - repositions based on scroll progress */}
            <div
              style={{
                position: scrollProgress > 0.5 ? "relative" : "absolute",
                right: scrollProgress > 0.5 ? "auto" : "50px",
                top: scrollProgress > 0.5 ? "auto" : "50%",
                transform: scrollProgress > 0.5 ? "none" : "translateY(-50%)",
                willChange: "position, right, top, transform",
              }}
            >
              {isAuthenticated ? (
                <div className="relative user-menu-container">
                  <button
                    onClick={toggleUserMenu}
                    className="flex items-center gap-2 px-3 py-2 text-white hover:text-gold transition-colors rounded-lg hover:bg-blue-2"
                  >
                    <FiUser size={20} />
                    <span className="text-sm font-family-comfortaa">
                      {getUserDisplayName(user, true)}
                    </span>
                  </button>
                  {showUserMenu && (
                    <UserMenuDropdown
                      user={user}
                      onAdminClick={() => handleNavigate("/admin")}
                      onProfileClick={() => handleNavigate("/perfil")}
                      onLogout={handleLogout}
                      onClose={closeUserMenu}
                    />
                  )}
                </div>
              ) : (
                <button
                  onClick={openLoginModal}
                  className="flex items-center gap-2 px-4 py-2 bg-gold text-blue-1 rounded-lg hover:bg-blue-2 hover:text-white transition-colors font-semibold font-family-comfortaa"
                >
                  <FiUser size={18} />
                  Iniciar Sesión
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile dropdown menu outside header with animation */}
      <MobileNavigationMenu
        isOpen={isMenuOpen}
        currentPath={location.pathname}
        onLinkClick={toggleMobileMenu}
        user={user}
        isAuthenticated={isAuthenticated}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        onClose={toggleMobileMenu}
      />

      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
    </>
  );
};

export default Header;
