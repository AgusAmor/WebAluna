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
  suspendUserAccount,
  activateUserAccount,
} from "../../services/users/userManagementService";
import { normalizeUserData } from "../../services/users/userFormService";
import { validateAddressStrict } from "../../services/mapbox/geocodingService";

export function useUserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
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
      // Add address validation for all addresses
      if (formData?.addresses && formData.addresses.length > 0) {
        for (let i = 0; i < formData.addresses.length; i++) {
          const addr = formData.addresses[i];
          const addressValidation = await validateAddressStrict(addr);
          if (!addressValidation.isValid) {
            const prefix =
              formData.addresses.length > 1 ? `Dirección ${i + 1}: ` : "";
            setError(`${prefix}${addressValidation.reason}`);
            setSaving(false);
            return;
          }
        }
      }

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
   * Initiates the user deletion process by opening the confirmation modal
   * @param {Object} user - User object to delete
   */
  const handleDeleteUser = (user) => {
    if (user.admin) return; // Cannot delete admins via this method normally
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  /**
   * Closes the delete confirmation modal
   */
  const cancelDeleteUser = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  /**
   * Confirms and executes user account suspension or activation
   */
  const confirmDeleteUser = async () => {
    if (!userToDelete || deletingId || userToDelete.admin) return;

    setDeletingId(userToDelete.id);
    setError(null);

    try {
      let updatedUsers;
      if (userToDelete.accountStatus === "suspended") {
        // Activate suspended user
        updatedUsers = await activateUserAccount(userToDelete.id, user);
      } else {
        // Suspend active user
        updatedUsers = await suspendUserAccount(userToDelete.id, user);
      }
      setUsers(updatedUsers);
      setShowDeleteModal(false);
      setUserToDelete(null);
    } catch (err) {
      setError(err.message || "Error updating user status");
      setShowDeleteModal(false);
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
    showDeleteModal,
    userToDelete,
    cancelDeleteUser,
    confirmDeleteUser,
  };
}
