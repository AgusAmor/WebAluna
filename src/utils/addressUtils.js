/**
 * addressUtils.js
 * Shared address utilities used across user profile and form management
 */

/**
 * Creates an empty address object with default structure
 * @returns {object} Empty address object
 */
export const createEmptyAddress = () => ({
  street: "",
  number: "",
  city: "",
  state: "",
  zipCode: "",
  isDefault: false,
});

/**
 * Updates the default flag for an address and clears it from others
 * @param {Array} addresses - Array of address objects
 * @param {number} idx - Index of address to set as default
 * @param {string} fieldName - Field name being updated
 * @param {boolean} checked - New value for the field
 * @returns {Array} Updated addresses array
 */
export const updateDefaultAddress = (addresses, idx, fieldName, checked) => {
  if (fieldName === "isDefault" && checked) {
    return addresses.map((addr, i) => ({
      ...addr,
      isDefault: i === idx,
    }));
  }
  return addresses.map((addr, i) => ({
    ...addr,
    [fieldName]: i === idx ? checked : addr[fieldName],
  }));
};

/**
 * Removes an address at the specified index
 * @param {Array} addresses - Array of address objects
 * @param {number} idx - Index to remove
 * @returns {Array} Updated addresses array
 */
export const removeAddressAtIndex = (addresses, idx) =>
  addresses.filter((_, i) => i !== idx);

/**
 * Adds a new empty address to the array
 * @param {Array} addresses - Current addresses array
 * @returns {Array} Updated addresses array with new empty address
 */
export const addNewAddress = (addresses) => [
  ...addresses,
  createEmptyAddress(),
];
