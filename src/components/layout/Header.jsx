import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiUser, FiLogOut } from "react-icons/fi";
import { HiMenu } from "react-icons/hi";
import logo from "../../assets/logos/logotipo.png";
import { useAuth } from "../../context/AuthContext";
import { LoginModal } from "../common";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      setShowUserMenu(false);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleProfileClick = () => {
    setShowUserMenu(false);
    if (user?.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/profile");
    }
  };

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest(".user-menu-container")) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showUserMenu]);

  const logoSizeMobile = 64;
  const logoSizeDesktop = isScrolled ? 48 : 80;

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
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="p-2 text-white hover:text-gold transition-colors"
                    aria-label="User menu"
                  >
                    <FiUser size={20} />
                  </button>
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-2">
                        <p className="text-sm font-semibold text-blue-1 truncate">
                          {/* Show display name if available, otherwise show email username (before '@') */}
                          {user?.displayName && user.displayName.trim() !== ""
                            ? user.displayName
                            : user?.email
                            ? user.email.split("@")[0]
                            : ""}
                        </p>
                        <p className="text-xs text-gray-1">
                          {user?.role === "admin" ? "Administrador" : "Usuario"}
                        </p>
                      </div>
                      <button
                        onClick={handleProfileClick}
                        className="w-full text-left px-4 py-2 text-sm text-blue-1 hover:bg-gray-3 transition-colors"
                      >
                        {user?.role === "admin" ? "Panel Admin" : "Mi Perfil"}
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-3 transition-colors flex items-center gap-2"
                      >
                        <FiLogOut size={16} />
                        Cerrar Sesión
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="p-2 text-white hover:text-gold transition-colors"
                  aria-label="Login"
                >
                  <FiUser size={20} />
                </button>
              )}

              {/* Hamburger menu */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
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
                <nav className="flex flex-row space-x-8">
                  <Link
                    to="/"
                    className={`font-family-comfortaa hover:underline transition-colors duration-300 ${
                      location.pathname === "/"
                        ? "text-gold font-bold"
                        : "text-white hover:text-gold"
                    }`}
                  >
                    Inicio
                  </Link>
                  <Link
                    to="/productos"
                    className={`font-family-comfortaa hover:underline transition-colors duration-300 ${
                      location.pathname === "/productos"
                        ? "text-gold font-bold"
                        : "text-white hover:text-gold"
                    }`}
                  >
                    Productos
                  </Link>
                  <Link
                    to="/sobre-nosotros"
                    className={`font-family-comfortaa hover:underline transition-colors duration-300 ${
                      location.pathname === "/sobre-nosotros"
                        ? "text-gold font-bold"
                        : "text-white hover:text-gold"
                    }`}
                  >
                    Nosotros
                  </Link>
                  <Link
                    to="/contacto"
                    className={`font-family-comfortaa hover:underline transition-colors duration-300 ${
                      location.pathname === "/contacto"
                        ? "text-gold font-bold"
                        : "text-white hover:text-gold"
                    }`}
                  >
                    Contacto
                  </Link>
                </nav>

                {/* User menu desktop */}
                {isAuthenticated ? (
                  <div className="relative user-menu-container">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-2 px-3 py-2 text-white hover:text-gold transition-colors rounded-lg hover:bg-blue-2"
                    >
                      <FiUser size={20} />
                      <span className="text-sm font-family-comfortaa">
                        {/* Show first name if available, otherwise show email username (before '@') */}
                        {user?.displayName && user.displayName.trim() !== ""
                          ? user.displayName.split(" ")[0]
                          : user?.email
                          ? user.email.split("@")[0]
                          : ""}
                      </span>
                    </button>
                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50">
                        <div className="px-4 py-3 border-b border-gray-2">
                          <p className="text-sm font-semibold text-blue-1 truncate">
                            {/* Show display name if available, otherwise show email username (before '@') */}
                            {user?.displayName && user.displayName.trim() !== ""
                              ? user.displayName
                              : user?.email
                              ? user.email.split("@")[0]
                              : ""}
                          </p>
                          <p className="text-xs text-gray-1">{user?.email}</p>
                          <p className="text-xs text-gold font-semibold mt-1">
                            {user?.role === "admin"
                              ? "Administrador"
                              : "Usuario"}
                          </p>
                        </div>
                        <button
                          onClick={handleProfileClick}
                          className="w-full text-left px-4 py-2 text-sm text-blue-1 hover:bg-gray-3 transition-colors"
                        >
                          {user?.role === "admin" ? "Panel Admin" : "Mi Perfil"}
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-3 transition-colors flex items-center gap-2"
                        >
                          <FiLogOut size={16} />
                          Cerrar Sesión
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
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

                <nav className="flex flex-row space-x-8">
                  <Link
                    to="/"
                    className={`font-family-comfortaa hover:underline transition-colors duration-300 ${
                      location.pathname === "/"
                        ? "text-gold font-bold"
                        : "text-white hover:text-gold"
                    }`}
                  >
                    Inicio
                  </Link>
                  <Link
                    to="/productos"
                    className={`font-family-comfortaa hover:underline transition-colors duration-300 ${
                      location.pathname === "/productos"
                        ? "text-gold font-bold"
                        : "text-white hover:text-gold"
                    }`}
                  >
                    Productos
                  </Link>
                  <Link
                    to="/sobre-nosotros"
                    className={`font-family-comfortaa hover:underline transition-colors duration-300 ${
                      location.pathname === "/sobre-nosotros"
                        ? "text-gold font-bold"
                        : "text-white hover:text-gold"
                    }`}
                  >
                    Nosotros
                  </Link>
                  <Link
                    to="/contacto"
                    className={`font-family-comfortaa hover:underline transition-colors duration-300 ${
                      location.pathname === "/contacto"
                        ? "text-gold font-bold"
                        : "text-white hover:text-gold"
                    }`}
                  >
                    Contacto
                  </Link>
                </nav>
              </div>

              {/* User button positioned absolute right center */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2">
                {isAuthenticated ? (
                  <div className="relative user-menu-container">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-2 px-3 py-2 text-white hover:text-gold transition-colors rounded-lg hover:bg-blue-2"
                    >
                      <FiUser size={20} />
                      <span className="text-sm font-family-comfortaa">
                        {/* Show first name if available, otherwise show email username (before '@') */}
                        {user?.displayName && user.displayName.trim() !== ""
                          ? user.displayName.split(" ")[0]
                          : user?.email
                          ? user.email.split("@")[0]
                          : ""}
                      </span>
                    </button>
                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50">
                        <div className="px-4 py-3 border-b border-gray-2">
                          <p className="text-sm font-semibold text-blue-1 truncate">
                            {/* Show display name if available, otherwise show email username (before '@') */}
                            {user?.displayName && user.displayName.trim() !== ""
                              ? user.displayName
                              : user?.email
                              ? user.email.split("@")[0]
                              : ""}
                          </p>
                          <p className="text-xs text-gray-1">{user?.email}</p>
                          <p className="text-xs text-gold font-semibold mt-1">
                            {user?.role === "admin"
                              ? "Administrador"
                              : "Usuario"}
                          </p>
                        </div>
                        <button
                          onClick={handleProfileClick}
                          className="w-full text-left px-4 py-2 text-sm text-blue-1 hover:bg-gray-3 transition-colors"
                        >
                          {user?.role === "admin" ? "Panel Admin" : "Mi Perfil"}
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-3 transition-colors flex items-center gap-2"
                        >
                          <FiLogOut size={16} />
                          Cerrar Sesión
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
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
      <div
        className={`lg:hidden fixed top-[88px] left-0 right-0 bg-blue-1 shadow-lg z-40 overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col py-2 px-4 space-y-1">
          <Link
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className={`font-family-comfortaa block py-2 px-3 rounded hover:bg-blue-2 hover:underline transition-colors duration-300 ${
              location.pathname === "/"
                ? "text-gold font-bold"
                : "text-white hover:text-gold"
            }`}
          >
            Inicio
          </Link>
          <Link
            to="/productos"
            onClick={() => setIsMenuOpen(false)}
            className={`font-family-comfortaa block py-2 px-3 rounded hover:bg-blue-2 hover:underline transition-colors duration-300 ${
              location.pathname === "/productos"
                ? "text-gold font-bold"
                : "text-white hover:text-gold"
            }`}
          >
            Productos
          </Link>
          <Link
            to="/sobre-nosotros"
            onClick={() => setIsMenuOpen(false)}
            className={`font-family-comfortaa block py-2 px-3 rounded hover:bg-blue-2 hover:underline transition-colors duration-300 ${
              location.pathname === "/sobre-nosotros"
                ? "text-gold font-bold"
                : "text-white hover:text-gold"
            }`}
          >
            Nosotros
          </Link>
          <Link
            to="/contacto"
            onClick={() => setIsMenuOpen(false)}
            className={`font-family-comfortaa block py-2 px-3 rounded hover:bg-blue-2 hover:underline transition-colors duration-300 ${
              location.pathname === "/contacto"
                ? "text-gold font-bold"
                : "text-white hover:text-gold"
            }`}
          >
            Contacto
          </Link>
        </nav>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
};

export default Header;
