/**
 * MobileNavigationMenu.jsx
 * Mobile dropdown navigation menu component.
 * Animated menu that appears below header on mobile devices.
 */

import { FiHome, FiShoppingBag, FiInfo, FiMail, FiUser } from "react-icons/fi";
import { MdLogout } from "react-icons/md";
import {
  getNavigationRoutes,
  isRouteActive,
} from "../../../services/ui/headerService";

const MobileNavigationMenu = ({
  isOpen,
  currentPath,
  onLinkClick,
  user,
  isAuthenticated,
  onNavigate,
  onLogout,
  onClose,
}) => {
  const routes = getNavigationRoutes();

  const getMobileNavLinkClasses = (isActive) => {
    const baseClasses =
      "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-family-sora cursor-pointer";
    const activeClasses = isActive
      ? "bg-gold text-blue-1 font-semibold"
      : "text-white hover:bg-blue-2";

    return `${baseClasses} ${activeClasses}`;
  };

  return (
    <>
      {/* Mobile dropdown menu */}
      <div
        className={`lg:hidden fixed top-20 left-0 right-0 bg-blue-1 shadow-lg z-40 overflow-hidden transition-all duration-300 ease-in-out border-t border-blue-2 ${
          isOpen ? "max-h-[calc(100vh-80px)] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="overflow-y-auto max-h-[calc(100vh-80px)]">
          {/* User Info Section */}
          {isAuthenticated && (
            <div className="px-4 py-3 border-b border-blue-2">
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {user?.displayName || "Usuario"}
                  </p>
                  <p className="text-xs text-gray-3 truncate">{user?.email}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => onNavigate("/perfil")}
                    className="p-2 text-white hover:text-gold hover:bg-blue-2 rounded-lg transition-colors"
                    aria-label="Mi Perfil"
                    title="Mi Perfil"
                  >
                    <FiUser size={18} />
                  </button>
                  <button
                    onClick={onLogout}
                    className="p-2 text-white bg-red-500 rounded-lg transition-colors"
                    aria-label="Cerrar sesión"
                    title="Cerrar sesión"
                  >
                    <MdLogout size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Menu */}
          <nav className="flex flex-col py-2 px-2 space-y-1">
            {routes.map((route) => {
              // Get icon based on route path
              let Icon;
              switch (route.path) {
                case "/":
                  Icon = FiHome;
                  break;
                case "/productos":
                  Icon = FiShoppingBag;
                  break;
                case "/sobre-nosotros":
                  Icon = FiInfo;
                  break;
                case "/contacto":
                  Icon = FiMail;
                  break;
                default:
                  Icon = FiHome;
              }

              return (
                <button
                  key={route.path}
                  onClick={() => onNavigate(route.path)}
                  className={getMobileNavLinkClasses(
                    isRouteActive(currentPath, route.path),
                  )}
                >
                  <Icon size={20} className="shrink-0" />
                  <span>{route.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Overlay for mobile - invisible but clickable to close */}
      {isOpen && (
        <div className="fixed inset-0 z-30 lg:hidden" onClick={onClose} />
      )}
    </>
  );
};

export default MobileNavigationMenu;
