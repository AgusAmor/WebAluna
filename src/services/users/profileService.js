import { updateProfile } from "firebase/auth";
import { fetchUserById, updateUser } from "../firebase/firebaseUserService";

/**
 * Profile Service - Business logic for user profile management
 * Separates business logic from UI components
 */

/**
 * Splits a phone number in E.164 format into country code and local number
 * @param {string} phone - Phone number in E.164 format (e.g., "+5491123456789")
 * @returns {Object} Object with phoneCountry and phoneLocal
 */
export const splitPhoneNumber = (phone) => {
  let phoneCountry = "+549";
  let phoneLocal = "";

  if (phone && /^\+\d{8,15}$/.test(phone)) {
    const match = phone.match(/^(\+\d{1,3})(\d{6,12})$/);
    if (match) {
      phoneCountry = match[1];
      phoneLocal = match[2];
    }
  }

  return { phoneCountry, phoneLocal };
};

/**
 * Combines phone country code and local number into E.164 format
 * @param {string} phoneCountry - Country code (e.g., "+549")
 * @param {string} phoneLocal - Local number (e.g., "1123456789")
 * @returns {string} Combined phone number
 */
export const combinePhoneNumber = (phoneCountry, phoneLocal) => {
  return `${phoneCountry}${phoneLocal}`;
};

/**
 * Ensures user data has addresses array initialized
 * @param {Object} userData - User data object
 * @returns {Object} User data with addresses array
 */
export const normalizeUserData = (userData) => {
  return {
    ...userData,
    addresses: userData.addresses || [],
  };
};

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
 * Removes address at specific index
 * @param {Array} addresses - Current addresses array
 * @param {number} idx - Index of address to remove
 * @returns {Array} Updated addresses array
 */
export const removeAddressAtIndex = (addresses, idx) => {
  return addresses.filter((_, i) => i !== idx);
};

/**
 * Creates a new empty address object
 * @returns {Object} Empty address object
 */
export const createEmptyAddress = () => ({
  street: "",
  number: "",
  apartment: "",
  city: "",
  region: "",
  postalCode: "",
  recipientName: "",
  recipientPhone: "",
  isDefault: false,
});

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
      editFormData.phoneLocal
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
