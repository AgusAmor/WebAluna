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
    id: user.id, // Preserve the user ID
    displayName: user.displayName || "",
    email: user.email || "",
    phone: user.phone || "",
    phoneCountry,
    phoneLocal,
    accountStatus: user.accountStatus || "active",
    createdAt: user.createdAt || null,
    lastLoginAt: user.lastLoginAt || null,
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

            // Map old field names to new ones for backward compatibility
            const mappedAddress = {
              ...a,
              region: a.region || a.state || "",
              postalCode: a.postalCode || a.zipCode || "",
            };

            return {
              ...emptyAddress,
              ...mappedAddress,
              // Ensure string fields are strings, never null or number
              street: String(mappedAddress.street || ""),
              number: mappedAddress.number ? String(mappedAddress.number) : "",
              apartment: String(mappedAddress.apartment || ""),
              city: String(mappedAddress.city || ""),
              region: String(mappedAddress.region || ""),
              postalCode: String(mappedAddress.postalCode || ""),
              recipientName: String(mappedAddress.recipientName || ""),
              recipientPhoneCountry: recipientPhoneCountry,
              recipientPhoneLocal: String(recipientPhoneLocal || ""),
              id: a.id || `addr_${i}_${Date.now()}`,
              isDefault: Boolean(mappedAddress.isDefault),
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
    ({
      id,
      recipientPhoneCountry,
      recipientPhoneLocal,
      apartment,
      ...addr
    }) => {
      const recipientPhone = combinePhoneNumber(
        recipientPhoneCountry,
        recipientPhoneLocal,
      );

      // Build address object with only Firestore-expected fields
      const cleanedAddress = {
        street: addr.street || "",
        number: addr.number ? String(addr.number) : "",
        city: addr.city || "",
        region: addr.region || "",
        postalCode: addr.postalCode || "",
        recipientName: addr.recipientName || "",
        recipientPhone: recipientPhone || "",
        isDefault: Boolean(addr.isDefault),
      };

      // Only include apartment if it has a value
      if (apartment && apartment.trim()) {
        cleanedAddress.apartment = apartment;
      }

      return cleanedAddress;
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
