/**
 * UserMenuDropdown.jsx
 * Reusable user menu dropdown component.
 * Shows user info and navigation options based on role.
 */

import { FiLogOut } from "react-icons/fi";
import {
  getUserDisplayName,
  getUserRoleLabel,
} from "../../../services/ui/headerService";
import { isUserAdmin } from "../../../utils/adminUtils";

const UserMenuDropdown = ({
  user,
  onAdminClick,
  onProfileClick,
  onLogout,
  onClose,
}) => {
  const isAdmin = isUserAdmin(user);

  return (
    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50">
      {/* User Info Section */}
      <div className="px-4 py-3 border-b border-gray-2">
        <p className="text-sm font-semibold text-blue-1 truncate">
          {getUserDisplayName(user, false)}
        </p>
        <p className="text-xs text-gray-1">{user?.email}</p>
        <p className="text-xs text-gold font-semibold mt-1">
          {getUserRoleLabel(user)}
        </p>
      </div>

      {/* Navigation Options */}
      {isAdmin ? (
        <>
          <button
            onClick={() => {
              onClose();
              onAdminClick();
            }}
            className="w-full text-left px-4 py-2 text-sm text-blue-1 hover:bg-gray-3 transition-colors"
          >
            Panel Admin
          </button>
          <button
            onClick={() => {
              onClose();
              onProfileClick();
            }}
            className="w-full text-left px-4 py-2 text-sm text-blue-1 hover:bg-gray-3 transition-colors"
          >
            Mi Perfil
          </button>
        </>
      ) : (
        <button
          onClick={() => {
            onClose();
            onProfileClick();
          }}
          className="w-full text-left px-4 py-2 text-sm text-blue-1 hover:bg-gray-3 transition-colors"
        >
          Mi Perfil
        </button>
      )}

      {/* Logout Button */}
      <button
        onClick={onLogout}
        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-3 transition-colors flex items-center gap-2"
      >
        <FiLogOut size={16} />
        Cerrar Sesión
      </button>
    </div>
  );
};

export default UserMenuDropdown;
