/**
 * userFormService.js
 * Business logic for user form operations.
 * Contains pure functions with no React dependencies.
 */

// Import address utilities from centralized location
import {
  createEmptyAddress,
  updateDefaultAddress,
  addNewAddress,
  removeAddressAtIndex,
} from "../../utils/addressUtils.js";

// Import phone utilities from centralized location
import {
  splitPhoneNumber,
  combinePhoneNumber,
} from "../../utils/phoneUtils.js";

/**
 * Normalizes user data for form state
 * @param {Object} user - User object from backend
 * @returns {Object} - Normalized form state
 */
export function normalizeUserData(user) {
  if (!user) {
    return {
      displayName: "",
      email: "",
      phone: "",
      phoneCountry: "+549",
      phoneLocal: "",
      accountStatus: "active",
      addresses: [],
    };
  }

  const { phoneCountry, phoneLocal } = splitPhoneNumber(user.phone);
  const emptyAddress = createEmptyAddress();

  return {
    displayName: user.displayName || "",
    email: user.email || "",
    phone: user.phone || "",
    phoneCountry,
    phoneLocal,
    accountStatus: user.accountStatus || "active",
    addresses:
      Array.isArray(user.addresses) && user.addresses.length > 0
        ? user.addresses.map((a, i) => {
            // Split recipientPhone if it exists as a string
            const {
              phoneCountry: recipientPhoneCountry,
              phoneLocal: recipientPhoneLocal,
            } = a.recipientPhone
              ? splitPhoneNumber(a.recipientPhone)
              : { phoneCountry: "+549", phoneLocal: "" };

            return {
              ...emptyAddress,
              ...a,
              id: a.id || `addr-${i + 1}`,
              recipientPhoneCountry,
              recipientPhoneLocal,
            };
          })
        : [],
  };
}

// Re-export address and phone utilities for convenience
export {
  createEmptyAddress,
  updateDefaultAddress,
  addNewAddress,
  removeAddressAtIndex,
} from "../../utils/addressUtils.js";
export {
  splitPhoneNumber,
  combinePhoneNumber,
} from "../../utils/phoneUtils.js";

/**
 * Prepares form data for submission
 * @param {Object} formData - Current form state
 * @returns {Object} - Prepared data for backend
 */
export function prepareUserFormData(formData) {
  const phone = combinePhoneNumber(formData.phoneCountry, formData.phoneLocal);

  // Clean addresses by removing the temporary 'id' field and combining phone fields
  const cleanAddresses = formData.addresses.map(
    ({ id, recipientPhoneCountry, recipientPhoneLocal, ...addr }) => {
      const recipientPhone = combinePhoneNumber(
        recipientPhoneCountry,
        recipientPhoneLocal,
      );
      return {
        ...addr,
        recipientPhone,
      };
    },
  );

  return {
    displayName: formData.displayName,
    email: formData.email,
    phone,
    addresses: cleanAddresses,
    accountStatus: formData.accountStatus,
  };
}
