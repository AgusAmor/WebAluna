import { useState, useCallback, useRef } from "react";
import { geocodeAddress } from "../../services/mapbox/geocodingService";

/**
 * Custom Hook for Address Validation with Mapbox Geocoding
 * Validates if an address exists in the real world using Mapbox API
 * Includes strict validation to ensure addresses are accurate
 * Includes cooldown to prevent excessive API calls
 */
export function useAddressValidation() {
  const [validating, setValidating] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [validationSuccess, setValidationSuccess] = useState({});
  const [cooldownEnd, setCooldownEnd] = useState({});

  // Store last validation time for each field
  const lastValidationRef = useRef({});

  // Cooldown duration in milliseconds (1 second)
  const COOLDOWN_MS = 1000;

  /**
   * Checks if address parts are present in the geocoding result
   * @param {string} query - Original address query
   * @param {string} result - Geocoding result address
   * @param {Object} addressObj - Full address object with postal code and region
   * @returns {Object} Validation details
   */
  const validateAddressMatch = useCallback((query, result, addressObj = {}) => {
    const queryLower = query.toLowerCase();
    const resultLower = result.toLowerCase();

    // Extract number from query (e.g., "1234" from "Av. Corrientes 1234")
    const numberMatch = query.match(/\s(\d+)/);
    const queryNumber = numberMatch ? numberMatch[1] : null;

    // Strict validation: Check if number exists in result
    if (queryNumber && !resultLower.includes(queryNumber)) {
      return {
        isValid: false,
        reason: "La altura no coincide con esta dirección",
      };
    }

    // Extract street name (everything before the number)
    const streetMatch = query.match(/^([^0-9]+)/);
    const queryStreet = streetMatch
      ? streetMatch[1].trim().toLowerCase()
      : null;

    // Strict validation: Check if street is in result
    if (queryStreet && !resultLower.includes(queryStreet)) {
      return {
        isValid: false,
        reason: "La calle no coincide con la dirección encontrada",
      };
    }

    // Strict validation: Check region/barrio if provided
    if (addressObj.region && addressObj.region.trim()) {
      const queryRegion = addressObj.region.trim().toLowerCase();

      // Check if region/barrio is in the result
      if (!resultLower.includes(queryRegion)) {
        return {
          isValid: false,
          reason: "El barrio no coincide con esta dirección",
        };
      }
    }

    // Strict validation: Check postal code if provided
    if (addressObj.postalCode && addressObj.postalCode.trim()) {
      const queryPostal = addressObj.postalCode.trim().toLowerCase();

      // Check if postal code is in the result
      if (!resultLower.includes(queryPostal)) {
        return {
          isValid: false,
          reason: "El código postal no coincide con esta dirección",
        };
      }
    }

    return {
      isValid: true,
      reason: null,
    };
  }, []);

  /**
   * Validates a single address using Geocoding
   * @param {string} address - Full address string to validate
   * @param {string} fieldId - Unique identifier for the address field
   * @param {Object} addressObj - Optional full address object for strict validation
   * @returns {Promise<boolean>} True if address is valid
   */
  const validateSingleAddress = useCallback(
    async (address, fieldId, addressObj = {}) => {
      // Clear previous messages
      setValidationErrors((prev) => ({ ...prev, [fieldId]: null }));
      setValidationSuccess((prev) => ({ ...prev, [fieldId]: null }));

      // Validate that address is not empty
      if (!address || address.trim().length === 0) {
        setValidationErrors((prev) => ({
          ...prev,
          [fieldId]: "La dirección es requerida",
        }));
        return false;
      }

      try {
        setValidating(true);

        const result = await geocodeAddress(address);

        if (!result.success || result.results.length === 0) {
          setValidationErrors((prev) => ({
            ...prev,
            [fieldId]:
              "No encontramos esta dirección. Verifica que sea correcta.",
          }));
          return false;
        }

        const firstResult = result.results[0];

        // Strict validation: check if parts match
        const matchValidation = validateAddressMatch(
          address,
          firstResult.address,
          addressObj,
        );

        if (!matchValidation.isValid) {
          setValidationErrors((prev) => ({
            ...prev,
            [fieldId]: matchValidation.reason,
          }));
          return false;
        }

        setValidationSuccess((prev) => ({
          ...prev,
          [fieldId]: `Dirección validada: ${firstResult.address}`,
        }));
        return true;
      } catch (error) {
        console.error("Address validation error:", error);
        setValidationErrors((prev) => ({
          ...prev,
          [fieldId]: "Error al validar la dirección. Intenta de nuevo.",
        }));
        return false;
      } finally {
        setValidating(false);
      }
    },
    [validateAddressMatch],
  );

  /**
   * Checks if validation is on cooldown for a specific field
   * @param {string} fieldId - Field identifier
   * @returns {boolean} True if on cooldown
   */
  const isOnCooldown = useCallback((fieldId) => {
    const lastValidation = lastValidationRef.current[fieldId];
    if (!lastValidation) return false;

    const now = Date.now();
    return now - lastValidation < COOLDOWN_MS;
  }, []);

  /**
   * Gets remaining cooldown time for a field
   * @param {string} fieldId - Field identifier
   * @returns {number} Milliseconds remaining (0 if no cooldown)
   */
  const getRemainingCooldown = useCallback((fieldId) => {
    const lastValidation = lastValidationRef.current[fieldId];
    if (!lastValidation) return 0;

    const now = Date.now();
    const remaining = COOLDOWN_MS - (now - lastValidation);
    return remaining > 0 ? remaining : 0;
  }, []);

  /**
   * Validates an address object with street, number, city, etc.
   * Combines the fields into a complete address string for validation
   * @param {Object} addressObj - Address object with street, number, city, region, postalCode
   * @param {string} fieldId - Unique identifier for the address field
   * @returns {Promise<boolean>} True if address is valid
   */
  const validateAddressObject = useCallback(
    async (addressObj, fieldId) => {
      // Check if on cooldown - silently skip without showing message
      if (isOnCooldown(fieldId)) {
        return false;
      }

      if (!addressObj) {
        setValidationErrors((prev) => ({
          ...prev,
          [fieldId]: "Dirección incompleta",
        }));
        return false;
      }

      const { street, number, city, region, postalCode } = addressObj;

      // Check ALL required fields - strict check (not empty strings)
      if (
        !street?.trim() ||
        !number ||
        !city?.trim() ||
        !region?.trim() ||
        !postalCode?.trim()
      ) {
        setValidationErrors((prev) => ({
          ...prev,
          [fieldId]:
            "Completa todos los campos: calle, número, ciudad, barrio y código postal",
        }));
        return false;
      }

      // Validate number format (positive integer)
      if (isNaN(number) || number <= 0) {
        setValidationErrors((prev) => ({
          ...prev,
          [fieldId]: "El número de altura debe ser un valor positivo",
        }));
        return false;
      }

      // Build complete address string with all fields
      const fullAddress = `${street} ${number}, ${city}, ${region} ${postalCode}`;

      // Record validation time for cooldown
      lastValidationRef.current[fieldId] = Date.now();

      const result = await validateSingleAddress(
        fullAddress,
        fieldId,
        addressObj,
      );

      return result;
    },
    [validateSingleAddress, isOnCooldown, getRemainingCooldown],
  );

  /**
   * Clears validation errors and success messages for a field
   * @param {string} fieldId - Field identifier to clear
   */
  const clearValidation = useCallback((fieldId) => {
    setValidationErrors((prev) => ({ ...prev, [fieldId]: null }));
    setValidationSuccess((prev) => ({ ...prev, [fieldId]: null }));
  }, []);

  /**
   * Clears all validation messages
   */
  const clearAllValidations = useCallback(() => {
    setValidationErrors({});
    setValidationSuccess({});
  }, []);

  return {
    validating,
    validationErrors,
    validationSuccess,
    cooldownEnd,
    validateSingleAddress,
    validateAddressObject,
    clearValidation,
    clearAllValidations,
    isOnCooldown,
    getRemainingCooldown,
  };
}
