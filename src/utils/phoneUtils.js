/**
 * phoneUtils.js
 * Shared phone number utilities used across user profile and form management
 */

/**
 * Splits a combined phone number into country code and local number
 * @param {string} phone - Combined phone number (e.g., "+1 234567890")
 * @returns {object} { phoneCountry, phoneLocal } or { phoneCountry: "", phoneLocal: "" }
 */
export const splitPhoneNumber = (phone) => {
  if (!phone) {
    return { phoneCountry: "", phoneLocal: "" };
  }
  const match = phone.match(/^\+(\d+)\s?(.*)$/);
  if (match) {
    return {
      phoneCountry: `+${match[1]}`,
      phoneLocal: match[2] || "",
    };
  }
  return { phoneCountry: "", phoneLocal: phone };
};

/**
 * Combines country code and local number into a single phone string
 * @param {string} phoneCountry - Country code (e.g., "+1")
 * @param {string} phoneLocal - Local number
 * @returns {string} Combined phone number
 */
export const combinePhoneNumber = (phoneCountry, phoneLocal) => {
  if (!phoneCountry || !phoneLocal) return "";
  return `${phoneCountry} ${phoneLocal}`.trim();
};
