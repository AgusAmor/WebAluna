import React from "react";
import { Hero } from "../../../components/common";
import UserModal from "./UserModal";
import UsersTable from "./UsersTable";
import UserForm from "./UserForm";
import { useUserManagement } from "../../../hooks";

/**
 * UserManagement Component
 * Main orchestrator for user management page
 * Handles CRUD operations, modal state, and UI coordination
 */
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
        {/* User Modal */}
        <UserModal
          isOpen={showModal}
          user={editUser}
          saving={saving}
          error={error}
          onClose={handleCloseModal}
          onSubmit={handleSubmitUser}
        >
          <UserForm
            initialUser={editUser}
            saving={saving}
            error={error}
            onCancel={handleCloseModal}
            onSubmit={handleSubmitUser}
            buttonLabel={editUser ? "Guardar cambios" : "Agregar usuario"}
          />
        </UserModal>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-md mt-2 overflow-x-auto">
          <UsersTable
            users={users}
            currentUser={currentUser}
            loading={loading}
            error={error}
            deletingId={deletingId}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
          />
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
