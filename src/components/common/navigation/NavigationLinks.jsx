/**
 * NavigationLinks.jsx
 * Reusable navigation links component.
 * Renders navigation menu with active state highlighting.
 */

import { Link } from "react-router-dom";
import {
  getNavigationRoutes,
  isRouteActive,
  getNavLinkClasses,
} from "../../../services/ui/headerService";

const NavigationLinks = ({ currentPath }) => {
  const routes = getNavigationRoutes();

  return (
    <nav className="flex flex-row space-x-8">
      {routes.map((route) => (
        <Link
          key={route.path}
          to={route.path}
          className={getNavLinkClasses(isRouteActive(currentPath, route.path))}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
};

export default NavigationLinks;
