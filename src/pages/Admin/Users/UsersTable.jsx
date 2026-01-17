import React from "react";
import { ImSpinner2 } from "react-icons/im";
import { formatDateTime } from "../../../utils/dateFormatter";
import { formatDefaultAddress } from "../../../services/users/userManagementService";

/**
 * UsersTable Component
 * Displays users list in a table format with edit and delete actions
 *
 * @param {Array} users - List of users to display
 * @param {Object} currentUser - Current authenticated user
 * @param {boolean} loading - Loading state
 * @param {string} error - Error message if any
 * @param {string} deletingId - ID of user being deleted
 * @param {string} filterName - Filter by name
 * @param {string} filterStatus - Filter by account status
 * @param {string} filterDateFrom - Filter from date
 * @param {string} filterDateTo - Filter to date
 * @param {Function} onEdit - Callback when edit button is clicked
 * @param {Function} onDelete - Callback when delete button is clicked
 */
const UsersTable = ({
  users,
  currentUser,
  loading,
  error,
  deletingId,
  filterName,
  filterStatus,
  filterDateFrom,
  filterDateTo,
  onEdit,
  onDelete,
}) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16">
        <ImSpinner2 className="animate-spin h-12 w-12 text-gold" />
        <span className="text-blue-2 font-bold text-lg">
          Cargando usuarios...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500 font-bold">{error}</div>
    );
  }

  // Helper function to safely convert Firestore timestamp to ISO date string
  const getDateString = (createdAt) => {
    if (!createdAt) return null;

    try {
      // If it's a Firestore Timestamp object with toDate method
      if (createdAt.toDate && typeof createdAt.toDate === "function") {
        return createdAt.toDate().toISOString().split("T")[0];
      }
      // If it's already a date string or valid date
      const date = new Date(createdAt);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split("T")[0];
      }
    } catch (error) {
      console.warn("Error converting date:", error);
    }
    return null;
  };

  // Apply filters to users
  const filteredUsers = users
    .filter((userItem) => !currentUser || userItem.id !== currentUser.uid)
    .filter((userItem) => {
      // Filter by name
      if (filterName) {
        const name = (userItem.displayName || "").toLowerCase();
        if (!name.includes(filterName.toLowerCase())) return false;
      }

      // Filter by status
      if (filterStatus) {
        if (userItem.accountStatus !== filterStatus) return false;
      }

      // Filter by date range
      if (filterDateFrom) {
        const userDate = getDateString(userItem.createdAt);
        if (!userDate || userDate < filterDateFrom) return false;
      }

      if (filterDateTo) {
        const userDate = getDateString(userItem.createdAt);
        if (!userDate || userDate > filterDateTo) return false;
      }

      return true;
    });

  return (
    <table className="min-w-full font-family-sora text-xs md:text-sm">
      <thead>
        <tr className="bg-gold text-white">
          <th className="py-2 px-1 font-bold text-center whitespace-nowrap">
            Nombre
          </th>
          <th className="py-2 px-1 font-bold text-center whitespace-nowrap">
            Email
          </th>
          <th className="py-2 px-1 font-bold text-center whitespace-nowrap">
            Teléfono
          </th>
          <th className="py-2 px-1 font-bold text-center whitespace-nowrap">
            Dirección
          </th>
          <th className="py-2 px-1 font-bold text-center whitespace-nowrap">
            Estado
          </th>
          <th className="py-2 px-1 font-bold text-center whitespace-nowrap">
            Fecha de creación
          </th>
          <th className="py-2 px-1 font-bold text-center whitespace-nowrap">
            Acciones
          </th>
        </tr>
      </thead>
      <tbody>
        {filteredUsers.length === 0 ? (
          <tr>
            <td colSpan="7" className="py-8 text-center text-gray-2">
              No hay usuarios que coincidan con los filtros
            </td>
          </tr>
        ) : (
          filteredUsers.map((userItem) => {
            const createdAt = formatDateTime(userItem.createdAt);
            return (
              <tr
                key={userItem.id}
                className="border-b border-gray-2 hover:bg-gray-3/40"
              >
                <td className="py-2 px-2 text-center">
                  {userItem.displayName || "-"}
                </td>
                <td className="py-2 px-2 text-center font-bold text-blue-1">
                  {userItem.email}
                </td>
                <td className="py-2 px-2 text-center">
                  {userItem.phone || "-"}
                </td>
                <td className="py-2 px-2 text-center">
                  {formatDefaultAddress(userItem.addresses)}
                </td>
                <td className="py-2 px-2 text-center">
                  {userItem.accountStatus || "-"}
                </td>
                <td className="py-2 px-2 text-center">{createdAt}</td>
                <td className="py-2 px-2 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <button
                      className="bg-blue-2 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-gold transition-colors w-24"
                      type="button"
                      onClick={() => onEdit(userItem)}
                    >
                      Editar
                    </button>
                    <button
                      className={`bg-red-500 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-red-700 transition-colors w-24 flex items-center justify-center ${
                        deletingId === userItem.id || userItem.admin
                          ? "opacity-60 cursor-not-allowed"
                          : ""
                      }`}
                      disabled={deletingId === userItem.id || userItem.admin}
                      title={
                        userItem.admin
                          ? "No se puede eliminar un usuario admin"
                          : "Eliminar usuario"
                      }
                      onClick={() => onDelete(userItem)}
                    >
                      {deletingId === userItem.id ? (
                        <span className="flex items-center justify-center w-full h-full">
                          <ImSpinner2 className="animate-spin h-5 w-5 mx-auto text-white" />
                        </span>
                      ) : userItem.admin ? (
                        "Admin"
                      ) : (
                        "Eliminar"
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
};

export default UsersTable;
