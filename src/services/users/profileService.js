import { updateProfile } from "firebase/auth";
import { fetchUserById, updateUser } from "../firebase/firebaseUserService";

// Import address and phone utilities from centralized locations
import {
  createEmptyAddress,
  removeAddressAtIndex,
} from "../../utils/addressUtils.js";
import {
  splitPhoneNumber,
  combinePhoneNumber,
} from "../../utils/phoneUtils.js";

// Import user normalization from userFormService
import { normalizeUserData } from "./userFormService.js";

/**
 * Prepares user data for editing by adding phone split fields
 * @param {Object} userData - User data from Firestore
 * @returns {Object} Edit form data with phoneCountry and phoneLocal
 */
export const prepareUserDataForEdit = (userData) => {
  const { phoneCountry, phoneLocal } = splitPhoneNumber(userData.phone);
  return {
    ...userData,
    phoneCountry,
    phoneLocal,
  };
};

/**
 * Updates address at specific index with ensuring default address uniqueness
 * @param {Array} addresses - Current addresses array
 * @param {number} idx - Index of address to update
 * @param {string} name - Field name to update
 * @param {any} value - New value
 * @returns {Array} Updated addresses array
 */
export const updateAddressAtIndex = (addresses, idx, name, value) => {
  const newAddresses = [...(addresses || [])];
  newAddresses[idx] = {
    ...newAddresses[idx],
    [name]: value,
  };

  // If setting this address as default, unset all others
  if (name === "isDefault" && value === true) {
    newAddresses.forEach((addr, i) => {
      if (i !== idx) addr.isDefault = false;
    });
  }

  return newAddresses;
};

/**
 * Saves profile changes to backend and updates local state
 * @param {Object} params - Parameters object
 * @param {Object} params.user - Current authenticated user
 * @param {Object} params.editFormData - Form data to save
 * @param {Function} params.updateUserProfile - Context function to update user profile
 * @param {Function} params.refreshUser - Context function to refresh user from Firebase
 * @returns {Promise<Object>} Updated user data
 */
export const saveProfileChanges = async ({
  user,
  editFormData,
  updateUserProfile,
  refreshUser,
}) => {
  if (!user) throw new Error("Usuario no autenticado");

  const token = await user.getIdToken();
  const updateData = {
    displayName: editFormData.displayName,
    email: editFormData.email,
    phone: combinePhoneNumber(
      editFormData.phoneCountry,
      editFormData.phoneLocal,
    ),
    addresses: editFormData.addresses || [],
  };

  // Update Firestore
  await updateUser(user.uid, updateData, token);

  // Update Firebase Auth displayName
  await updateProfile(user, {
    displayName: editFormData.displayName,
  });

  // Reload user data from server
  const updatedData = await fetchUserById(user.uid);
  const normalizedData = normalizeUserData(updatedData);

  // Update context
  updateUserProfile({
    displayName: normalizedData.displayName,
    email: normalizedData.email,
    phone: normalizedData.phone,
    addresses: normalizedData.addresses,
  });

  // Refresh complete user object
  await refreshUser();

  return normalizedData;
};

/**
 * Loads user profile data and prepares it for display/editing
 * @param {string} userId - User ID to load
 * @returns {Promise<Object>} Object with userData and editFormData
 */
export const loadUserProfile = async (userId) => {
  const data = await fetchUserById(userId);
  const userData = normalizeUserData(data);
  const editFormData = prepareUserDataForEdit(userData);

  return { userData, editFormData };
};

// Re-export utilities from centralized locations for convenience
export {
  removeAddressAtIndex,
  createEmptyAddress,
} from "../../utils/addressUtils.js";
export {
  splitPhoneNumber,
  combinePhoneNumber,
} from "../../utils/phoneUtils.js";
export { normalizeUserData } from "./userFormService.js";
