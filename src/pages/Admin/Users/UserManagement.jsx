import React from "react";
import { ImSpinner2 } from "react-icons/im";
import { Hero } from "../../../components/common";
import UserForm from "./UserForm";
import { useUserManagement } from "../../../hooks";
import { formatDate, formatDateTime } from "../../../utils/dateFormatter";
import { formatDefaultAddress } from "../../../services/users/userManagementService";

const UserManagement = () => {
  const {
    users,
    loading,
    error,
    showModal,
    saving,
    editUser,
    deletingId,
    currentUser,
    handleEditUser,
    handleCloseModal,
    handleSubmitUser,
    handleDeleteUser,
  } = useUserManagement();

  return (
    <div className="min-h-screen bg-gray-3 px-4 py-2 pb-20">
      <Hero
        title="Gestión de Usuarios"
        subtitle="Administra los usuarios registrados en el sistema."
      />
      <div className="max-w-6xl mx-auto">
        {/* Modal for adding or editing a user */}
        {showModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                handleCloseModal();
              }
            }}
          >
            <div
              className="bg-white rounded-xl shadow-lg p-8 w-full max-w-3xl min-w-[350px] relative flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-3 right-3 text-blue-2 hover:text-gold text-xl font-bold"
                onClick={handleCloseModal}
                aria-label="Close"
              >
                ×
              </button>
              <h2 className="text-2xl font-bold text-blue-2 mb-4 font-family-comfortaa">
                {editUser ? "Editar usuario" : "Agregar usuario"}
              </h2>
              <UserForm
                initialUser={editUser}
                saving={saving}
                error={error}
                onCancel={handleCloseModal}
                onSubmit={handleSubmitUser}
                buttonLabel={editUser ? "Guardar cambios" : "Agregar usuario"}
              />
            </div>
          </div>
        )}
        {/* Users table listing all registered users */}
        <div className="bg-white rounded-xl shadow-md mt-2 overflow-x-auto">
          {loading ? (
            <div className="text-center py-8 text-blue-2 font-bold">
              Cargando usuarios...
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500 font-bold">
              {error}
            </div>
          ) : (
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
                {users
                  .filter(
                    (userItem) =>
                      !currentUser || userItem.id !== currentUser.uid
                  )
                  .map((userItem) => {
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
                            {/* Edit button: opens modal with user data for editing */}
                            <button
                              className="bg-blue-2 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-gold transition-colors w-24"
                              type="button"
                              onClick={() => handleEditUser(userItem)}
                            >
                              Editar
                            </button>
                            {/* Delete button: removes user from Firestore and Authentication */}
                            <button
                              className={`bg-red-500 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-red-700 transition-colors w-24 flex items-center justify-center ${
                                deletingId === userItem.id || userItem.admin
                                  ? "opacity-60 cursor-not-allowed"
                                  : ""
                              }`}
                              disabled={
                                deletingId === userItem.id || userItem.admin
                              }
                              title={
                                userItem.admin
                                  ? "No se puede eliminar un usuario admin"
                                  : "Eliminar usuario"
                              }
                              onClick={() => handleDeleteUser(userItem)}
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
                  })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
