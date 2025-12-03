/**
 * userFormService.js
 * Business logic for user form operations.
 * Contains pure functions with no React dependencies.
 */

/**
 * Creates an empty address template
 * @returns {Object} - Empty address object
 */
export function createEmptyAddress() {
  return {
    id: `addr-${Date.now()}`,
    street: "",
    apartment: "",
    city: "",
    region: "",
    postalCode: "",
    isDefault: false,
    recipientName: "",
    recipientPhone: "",
  };
}

/**
 * Splits E.164 phone number into country code and local number
 * @param {string} phone - E.164 formatted phone number
 * @returns {Object} - { phoneCountry, phoneLocal }
 */
export function splitPhoneNumber(phone) {
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
}

/**
 * Combines country code and local number into E.164 format
 * @param {string} phoneCountry - Country code (e.g., "+549")
 * @param {string} phoneLocal - Local phone number
 * @returns {string} - E.164 formatted phone number
 */
export function combinePhoneNumber(phoneCountry, phoneLocal) {
  if (phoneCountry && phoneLocal) {
    return `${phoneCountry}${phoneLocal}`;
  }
  return "";
}

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
      role: "user",
      admin: false,
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
    role: user.role || "user",
    admin: !!user.admin,
    addresses:
      Array.isArray(user.addresses) && user.addresses.length > 0
        ? user.addresses.map((a, i) => ({
            ...emptyAddress,
            ...a,
            id: a.id || `addr-${i + 1}`,
          }))
        : [],
  };
}

/**
 * Updates addresses when isDefault changes
 * @param {Array} addresses - Current addresses array
 * @param {number} idx - Index of address being updated
 * @param {string} fieldName - Field name being changed
 * @param {boolean} checked - New checked value for isDefault
 * @returns {Array} - Updated addresses array
 */
export function updateDefaultAddress(addresses, idx, fieldName, checked) {
  let updated = [...addresses];

  // If isDefault is checked, unset for all others
  if (fieldName === "isDefault" && checked) {
    updated = updated.map((addr, i) => ({
      ...addr,
      isDefault: i === idx,
    }));
  }

  // If only one address exists, ensure it's default
  if (updated.length === 1 && !updated[0].isDefault) {
    updated[0].isDefault = true;
  }

  return updated;
}

/**
 * Adds a new address to the addresses array
 * @param {Array} addresses - Current addresses array
 * @returns {Array} - Updated addresses array with new address
 */
export function addNewAddress(addresses) {
  const isFirstAddress =
    !addresses ||
    addresses.length === 0 ||
    (addresses.length === 1 &&
      Object.values(addresses[0]).every(
        (v) => v === "" || v === false || v === null
      ));

  const newAddress = {
    ...createEmptyAddress(),
    id: `addr-${Date.now()}`,
    isDefault: isFirstAddress,
  };

  return isFirstAddress ? [newAddress] : [...addresses, newAddress];
}

/**
 * Removes an address from the addresses array
 * @param {Array} addresses - Current addresses array
 * @param {number} idx - Index of address to remove
 * @returns {Array} - Updated addresses array
 */
export function removeAddressAtIndex(addresses, idx) {
  const filtered = addresses.filter((_, i) => i !== idx);
  return filtered.length ? filtered : [createEmptyAddress()];
}

/**
 * Prepares form data for submission
 * @param {Object} formData - Current form state
 * @returns {Object} - Prepared data for backend
 */
export function prepareUserFormData(formData) {
  const phone = combinePhoneNumber(formData.phoneCountry, formData.phoneLocal);

  return {
    ...formData,
    phone,
  };
}
