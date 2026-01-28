/**
 * MobileAdminMenu.jsx
 * Mobile dropdown menu for admin navigation.
 * Appears as a dropdown below the header on mobile devices.
 */

import { useLocation } from "react-router-dom";
import {
  MdDashboard,
  MdShoppingCart,
  MdInventory2,
  MdLogout,
} from "react-icons/md";
import {
  FiUsers,
  FiHome,
  FiShoppingBag,
  FiInfo,
  FiMail,
  FiUser,
} from "react-icons/fi";

const MobileAdminMenu = ({
  isOpen,
  onNavigate,
  onLogout,
  isActive,
  user,
  onClose,
}) => {
  const location = useLocation();

  const adminMenuItems = [
    {
      label: "Panel Admin",
      path: "/admin",
      icon: MdDashboard,
    },
    {
      label: "Productos",
      path: "/admin/productos",
      icon: MdInventory2,
    },
    {
      label: "Usuarios",
      path: "/admin/usuarios",
      icon: FiUsers,
    },
    {
      label: "Pedidos",
      path: "/admin/pedidos",
      icon: MdShoppingCart,
    },
  ];

  const userMenuItems = [
    {
      label: "Inicio",
      path: "/",
      icon: FiHome,
    },
    {
      label: "Catálogo",
      path: "/productos",
      icon: FiShoppingBag,
    },
    {
      label: "Nosotros",
      path: "/sobre-nosotros",
      icon: FiInfo,
    },
    {
      label: "Contacto",
      path: "/contacto",
      icon: FiMail,
    },
  ];

  const getMobileNavItemClasses = (path) => {
    const baseClasses =
      "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-family-sora cursor-pointer";
    const activeClasses = isActive(path)
      ? "bg-gold text-blue-1 font-semibold"
      : "text-white hover:bg-blue-2";

    return `${baseClasses} ${activeClasses}`;
  };

  const getUserItemClasses = (path) => {
    const baseClasses =
      "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-family-sora cursor-pointer";
    const activeClasses =
      location.pathname === path
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
          <div className="px-4 py-3 border-b border-blue-2">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {user?.displayName || "Admin"}
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

          {/* Admin Menu */}
          <nav className="flex flex-col py-2 px-2 space-y-1 border-b border-blue-2">
            {adminMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => onNavigate(item.path)}
                  className={getMobileNavItemClasses(item.path)}
                >
                  <Icon size={20} className="shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Pages Menu */}
          <nav className="flex flex-col py-2 px-2 space-y-1 border-b border-blue-2">
            {userMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => onNavigate(item.path)}
                  className={getUserItemClasses(item.path)}
                >
                  <Icon size={20} className="shrink-0" />
                  <span>{item.label}</span>
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

export default MobileAdminMenu;
