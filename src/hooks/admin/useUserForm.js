/**
 * useUserForm.js
 * Custom hook for managing user form state and operations.
 * Encapsulates form state management and address manipulation logic.
 */

import { useState, useEffect } from "react";
import {
  normalizeUserData,
  updateDefaultAddress,
  addNewAddress,
  removeAddressAtIndex,
  prepareUserFormData,
} from "../../services/users/userFormService";

export function useUserForm(initialUser = null) {
  const [form, setForm] = useState(normalizeUserData(null));

  // Populate form when initialUser changes
  useEffect(() => {
    setForm(normalizeUserData(initialUser));
  }, [initialUser]);

  /**
   * Handles changes for main user fields
   * @param {Event} e - Input change event
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "role") {
      setForm((prev) => ({
        ...prev,
        role: value,
        admin: value === "admin",
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  /**
   * Handles changes for address fields
   * @param {number} idx - Address index
   * @param {Event} e - Input change event
   */
  const handleAddressChange = (idx, e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => {
      let addresses = prev.addresses.map((addr, i) =>
        i === idx
          ? { ...addr, [name]: type === "checkbox" ? checked : value }
          : addr
      );

      addresses = updateDefaultAddress(addresses, idx, name, checked);

      return { ...prev, addresses };
    });
  };

  /**
   * Adds a new empty address
   */
  const handleAddAddress = () => {
    setForm((prev) => ({
      ...prev,
      addresses: addNewAddress(prev.addresses),
    }));
  };

  /**
   * Removes an address at given index
   * @param {number} idx - Address index to remove
   */
  const handleRemoveAddress = (idx) => {
    setForm((prev) => ({
      ...prev,
      addresses: removeAddressAtIndex(prev.addresses, idx),
    }));
  };

  /**
   * Prepares and returns form data for submission
   * @returns {Object} - Prepared form data
   */
  const getFormData = () => {
    return prepareUserFormData(form);
  };

  return {
    form,
    handleChange,
    handleAddressChange,
    handleAddAddress,
    handleRemoveAddress,
    getFormData,
  };
}
