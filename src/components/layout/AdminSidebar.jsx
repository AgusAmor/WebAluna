import React from "react";
import { Link } from "react-router-dom";
import { HiMenu } from "react-icons/hi";
import {
  FiLogOut,
  FiUser,
  FiUsers,
  FiHome,
  FiShoppingBag,
  FiInfo,
  FiMail,
} from "react-icons/fi";
import { MdDashboard, MdShoppingCart, MdInventory2 } from "react-icons/md";
import isotipo from "../../assets/logos/isotipo.png";
import isotipogold from "../../assets/logos/isotipo-dorado.png";
import logotipo from "../../assets/logos/logotipo.png";
import { useAdminSidebar } from "../../hooks/admin";
import MobileAdminMenu from "../common/navigation/MobileAdminMenu.jsx";

const AdminSidebar = () => {
  const {
    isMenuOpen,
    isHovering,
    location,
    user,
    handleLogout,
    handleNavigate,
    toggleMobileMenu,
    closeSidebar,
    isActive,
    setIsHovering,
  } = useAdminSidebar();

  const menuItems = [
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
      label: "Productos",
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
    {
      label: "Mi Perfil",
      path: "/perfil",
      icon: FiUser,
    },
  ];

  return (
    <>
      {/* Header with hamburger menu - only visible on mobile */}
      <header className="bg-blue-1 border-blue-2 dark:bg-blue-1 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 transition-all duration-300">
          {/* Mobile Layout: Always the same (no scroll animation) */}
          <div className="flex lg:hidden items-center justify-between py-2 sm:py-3 md:py-4">
            <Link to="/" className="shrink-0">
              <img src={logotipo} alt="LogoAluna" style={{ height: "64px" }} />
            </Link>

            <div className="flex items-center gap-1 sm:gap-2">
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
        </div>
      </header>

      {/* Desktop Sidebar - only visible on desktop */}
      <aside
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className={`hidden lg:flex fixed left-0 top-0 h-screen bg-blue-1 text-white flex-col transition-all duration-300 ease-in-out z-50 overflow-y-auto
          ${isHovering ? "lg:w-64" : "lg:w-16"}
        `}
      >
        {/* Logo Section */}
        <div className="p-4 border-b border-blue-2 group">
          <Link to="/" className="flex items-center justify-start gap-3">
            <div className="relative h-10 w-10 shrink-0">
              <img
                src={isotipo}
                alt="LogoAluna"
                className="absolute inset-0 h-10 w-10 transition-opacity duration-300 group-hover:opacity-0"
              />
              <img
                src={isotipogold}
                alt="LogoAluna gold"
                className="absolute inset-0 h-10 w-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
            </div>
            <span
              className={`text-white font-family-comfortaa font-bold whitespace-nowrap transition-all group-hover:text-gold duration-300 ${
                isHovering ? "inline" : "hidden"
              }`}
            >
              Aluna
            </span>
          </Link>
        </div>

        {/* Admin Menu */}
        <nav className="p-2 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className={`w-full flex items-center ${isHovering ? "justify-start" : "justify-center"} gap-3 px-2 py-3 rounded-lg transition-colors text-sm font-family-sora cursor-pointer
                  ${
                    isActive(item.path)
                      ? "bg-gold text-blue-1 font-semibold"
                      : "text-white hover:bg-blue-2"
                  }
                `}
                title={item.label}
              >
                <Icon size={20} className="shrink-0" />
                <span
                  className={`whitespace-nowrap ${isHovering ? "inline" : "hidden"}`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* User Menu */}
        <nav className="p-2 space-y-2 border-t border-blue-2">
          {userMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className={`w-full flex items-center ${isHovering ? "justify-start" : "justify-center"} gap-3 px-2 py-3 rounded-lg transition-colors text-sm font-family-sora cursor-pointer
                  ${
                    location.pathname === item.path
                      ? "bg-gold text-blue-1 font-semibold"
                      : "text-white hover:bg-blue-2"
                  }
                `}
                title={item.label}
              >
                <Icon size={20} className="shrink-0" />
                <span
                  className={`whitespace-nowrap ${isHovering ? "inline" : "hidden"}`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* User Info Section - at the bottom */}
        <div className="p-4 border-t border-blue-2 flex items-center justify-between">
          <div className={isHovering ? "block" : "hidden"}>
            <p className="text-sm font-semibold truncate">
              {user?.displayName || "Admin"}
            </p>
            <p className="text-xs text-gray-3 truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-white bg-red-500 rounded-lg transition-colors cursor-pointer shrink-0"
            aria-label="Cerrar sesión"
            title="Cerrar sesión"
          >
            <FiLogOut size={18} />
          </button>
        </div>
      </aside>

      {/* Mobile Admin Menu - dropdown for mobile */}
      <MobileAdminMenu
        isOpen={isMenuOpen}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        isActive={isActive}
        user={user}
        onClose={closeSidebar}
      />
    </>
  );
};

export default AdminSidebar;
