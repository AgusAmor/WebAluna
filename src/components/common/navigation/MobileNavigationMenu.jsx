/**
 * MobileNavigationMenu.jsx
 * Mobile dropdown navigation menu component.
 * Animated menu that appears below header on mobile devices.
 */

import { Link } from "react-router-dom";
import {
  getNavigationRoutes,
  isRouteActive,
  getNavLinkClasses,
} from "../../../services/ui/headerService";

const MobileNavigationMenu = ({ isOpen, currentPath, onLinkClick }) => {
  const routes = getNavigationRoutes();

  // Modified classes for mobile menu layout
  const getMobileNavLinkClasses = (isActive) => {
    const baseClasses =
      "font-family-comfortaa block py-2 px-3 rounded hover:bg-blue-2 hover:underline transition-colors duration-300";
    const activeClasses = "text-gold font-bold";
    const inactiveClasses = "text-white hover:text-gold";

    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  };

  return (
    <div
      className={`lg:hidden fixed top-[88px] left-0 right-0 bg-blue-1 shadow-lg z-40 overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      <nav className="flex flex-col py-2 px-4 space-y-1">
        {routes.map((route) => (
          <Link
            key={route.path}
            to={route.path}
            onClick={onLinkClick}
            className={getMobileNavLinkClasses(
              isRouteActive(currentPath, route.path)
            )}
          >
            {route.label}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default MobileNavigationMenu;
