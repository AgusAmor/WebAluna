/**
 * useUserManagement.js
 * Custom hook for managing user CRUD operations in the admin panel.
 * Encapsulates state management and orchestrates business logic.
 */

import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  loadUsers,
  saveUserChanges,
  deleteUserAccount,
} from "../../services/users/userManagementService";
import { normalizeUserData } from "../../services/users/userFormService";

export function useUserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const { user } = useAuth();

  // Load users on mount
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await loadUsers();
        setUsers(data);
      } catch (err) {
        setError(err.message || "Error loading users");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  /**
   * Opens modal for editing a user
   * @param {Object} userToEdit - User object to edit
   */
  const handleEditUser = (userToEdit) => {
    // Normalize user data to ensure consistent field structure (especially addresses)
    const normalizedUser = normalizeUserData(userToEdit);
    setEditUser(normalizedUser);
    setShowModal(true);
  };

  /**
   * Closes modal and resets edit state
   */
  const handleCloseModal = () => {
    setShowModal(false);
    setEditUser(null);
  };

  /**
   * Handles user form submission (update only)
   * @param {Object} formData - Form data to save
   */
  const handleSubmitUser = async (formData) => {
    if (!editUser || !user) return;

    setSaving(true);
    setError(null);
    try {
      const updatedUsers = await saveUserChanges(editUser.id, formData, user);
      setUsers(updatedUsers);
      handleCloseModal();
    } catch (err) {
      setError(err.message || "Error al guardar usuario");
    } finally {
      setSaving(false);
    }
  };

  /**
   * Handles user deletion
   * @param {Object} userToDelete - User object to delete
   */
  const handleDeleteUser = async (userToDelete) => {
    if (deletingId || userToDelete.admin) return;

    setDeletingId(userToDelete.id);
    setError(null);

    try {
      await deleteUserAccount(userToDelete.id, user);
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
    } catch (err) {
      setError(err.message || "Error deleting user");
    } finally {
      setDeletingId(null);
    }
  };

  return {
    users,
    loading,
    error,
    showModal,
    saving,
    editUser,
    deletingId,
    currentUser: user,
    handleEditUser,
    handleCloseModal,
    handleSubmitUser,
    handleDeleteUser,
  };
}
