import React from "react";
import { Hero, ConfirmationModal } from "../../../components/common";
import UserModal from "./UserModal";
import UserFilters from "./UserFilters";
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
    showDeleteModal,
    userToDelete,
    cancelDeleteUser,
    confirmDeleteUser,
  } = useUserManagement();

  // Filter states
  const [filterName, setFilterName] = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState("");
  const [filterDateFrom, setFilterDateFrom] = React.useState("");
  const [filterDateTo, setFilterDateTo] = React.useState("");

  return (
    <div className="min-h-screen bg-gray-3 px-4 py-2 pb-20">
      <Hero
        title="Gestión de Usuarios"
        subtitle="Administra los usuarios registrados en el sistema."
      />
      <div className="max-w-6xl mx-auto">
        {/* User Filters */}
        <UserFilters
          users={users}
          filterName={filterName}
          setFilterName={setFilterName}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterDateFrom={filterDateFrom}
          setFilterDateFrom={setFilterDateFrom}
          filterDateTo={filterDateTo}
          setFilterDateTo={setFilterDateTo}
        />

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={showDeleteModal}
          title="Eliminar usuario"
          message={`¿Estás seguro que deseas eliminar al usuario ${userToDelete?.displayName || userToDelete?.email || "seleccionado"}?`}
          description="Esta acción eliminará permanentemente la cuenta del usuario y sus datos asociados. No se puede deshacer."
          onConfirm={confirmDeleteUser}
          onCancel={cancelDeleteUser}
          isLoading={!!deletingId}
          confirmText="Eliminar"
          cancelText="Cancelar"
          variant="danger"
        />

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
            filterName={filterName}
            filterStatus={filterStatus}
            filterDateFrom={filterDateFrom}
            filterDateTo={filterDateTo}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
          />
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
