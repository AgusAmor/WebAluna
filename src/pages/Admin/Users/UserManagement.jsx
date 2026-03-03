import React from "react";
import { Hero, ConfirmationModal } from "../../../components/common";
import Pagination from "../../../components/common/Pagination";
import UserModal from "./UserModal";
import UserFilters from "./UserFilters";
import UsersTable from "./UsersTable";
import UserForm from "./UserForm";
import { useUserManagement } from "../../../hooks";
import usePagination from "../../../hooks/admin/usePagination";

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

  // Filter users based on filters
  const filteredUsers = React.useMemo(() => {
    return users
      .filter((user) => !user.admin) // Exclude admin users
      .filter((user) => {
        const matchesName =
          !filterName ||
          user.displayName?.toLowerCase().includes(filterName.toLowerCase()) ||
          user.email?.toLowerCase().includes(filterName.toLowerCase());

        const matchesStatus = !filterStatus || user.status === filterStatus;

        const userDate = user.createdAt ? new Date(user.createdAt) : new Date();
        const matchesDateFrom =
          !filterDateFrom || userDate >= new Date(filterDateFrom);

        const matchesDateTo =
          !filterDateTo || userDate <= new Date(filterDateTo);

        return matchesName && matchesStatus && matchesDateFrom && matchesDateTo;
      });
  }, [users, filterName, filterStatus, filterDateFrom, filterDateTo]);

  // Paginación
  const {
    paginatedItems: paginatedUsers,
    currentPage,
    setCurrentPage,
    totalItems: totalUsers,
  } = usePagination(filteredUsers, 20, [
    filterName,
    filterStatus,
    filterDateFrom,
    filterDateTo,
  ]);

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

        {/* Account Status Modal */}
        <ConfirmationModal
          isOpen={showDeleteModal}
          title={
            userToDelete?.accountStatus === "suspended"
              ? "Activar usuario"
              : "Suspender usuario"
          }
          message={`¿Estás seguro que deseas ${
            userToDelete?.accountStatus === "suspended"
              ? "activar"
              : "suspender"
          } la cuenta del usuario ${
            userToDelete?.displayName || userToDelete?.email || "seleccionado"
          }?`}
          description={
            userToDelete?.accountStatus === "suspended"
              ? "El usuario podrá acceder nuevamente a su cuenta."
              : "El usuario no podrá acceder a su cuenta. Podrás reactivarla más tarde."
          }
          onConfirm={confirmDeleteUser}
          onCancel={cancelDeleteUser}
          isLoading={!!deletingId}
          confirmText={
            userToDelete?.accountStatus === "suspended"
              ? "Activar"
              : "Suspender"
          }
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
            users={paginatedUsers}
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
          <Pagination
            totalItems={totalUsers}
            itemsPerPage={20}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
