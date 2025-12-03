import { Link } from "react-router-dom";
import { FiUser } from "react-icons/fi";
import { HiMenu } from "react-icons/hi";
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
    isScrolled,
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
  const logoSizeDesktop = getLogoSize(isScrolled, false);

  return (
    <>
      <header className="bg-blue-1 border-blue-2 dark:bg-blue-1 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          {/* Mobile Layout: Always the same (no scroll animation) */}
          <div className="flex lg:hidden items-center justify-between py-4">
            <Link to="/" className="shrink-0">
              <img
                src={logo}
                alt="LogoAluna"
                style={{ height: `${logoSizeMobile}px` }}
              />
            </Link>

            <div className="flex items-center gap-2">
              {/* User button mobile */}
              {isAuthenticated ? (
                <div className="relative user-menu-container">
                  <button
                    onClick={toggleUserMenu}
                    className="p-2 text-white hover:text-gold transition-colors"
                    aria-label="User menu"
                  >
                    <FiUser size={20} />
                  </button>
                  {showUserMenu && (
                    <UserMenuDropdown
                      user={user}
                      onAdminClick={() => handleNavigate("/admin")}
                      onProfileClick={() => handleNavigate("/profile")}
                      onLogout={handleLogout}
                      onClose={closeUserMenu}
                    />
                  )}
                </div>
              ) : (
                <button
                  onClick={openLoginModal}
                  className="p-2 text-white hover:text-gold transition-colors"
                  aria-label="Login"
                >
                  <FiUser size={20} />
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

          {/* Desktop Layout: With scroll-based animation */}
          {isScrolled ? (
            <div className="hidden lg:flex items-center justify-between py-4 transition-all duration-500">
              <Link to="/" className="shrink-0">
                <img
                  src={logo}
                  alt="LogoAluna"
                  style={{ height: `${logoSizeDesktop}px` }}
                  className="transition-all duration-500 ease-out"
                />
              </Link>

              <div className="flex items-center gap-6">
                <NavigationLinks currentPath={location.pathname} />

                {/* User menu desktop */}
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
                        onProfileClick={() => handleNavigate("/profile")}
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
          ) : (
            <div className="hidden lg:block relative py-6 transition-all duration-500">
              <div className="flex flex-col items-center gap-4">
                <Link to="/">
                  <img
                    src={logo}
                    alt="LogoAluna"
                    style={{ height: `${logoSizeDesktop}px` }}
                    className="transition-all duration-500 ease-out"
                  />
                </Link>

                <NavigationLinks currentPath={location.pathname} />
              </div>

              {/* User button positioned absolute right center */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2">
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
                        onProfileClick={() => handleNavigate("/profile")}
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
          )}
        </div>
      </header>

      {/* Mobile dropdown menu outside header with animation */}
      <MobileNavigationMenu
        isOpen={isMenuOpen}
        currentPath={location.pathname}
        onLinkClick={toggleMobileMenu}
      />

      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
    </>
  );
};

export default Header;
