/**
 * Mapbox Geocoding Service
 *
 * Handles address to coordinates conversion and address validation
 * Used for shipping address validation and location detection
 * Includes strict validation to ensure addresses match exactly
 */

import { MAPBOX_CONFIG, validateMapboxToken } from "./mapboxConfig.js";

/**
 * Validates if a result matches the query well enough
 * Checks relevance score and address components
 * @param {Object} feature - Mapbox feature result
 * @param {string} query - Original query string
 * @returns {boolean} True if result is a good match
 */
const isValidMatch = (feature, query) => {
  // Minimum relevance score (0-1) - reduced from 0.7 for more flexibility
  const MIN_RELEVANCE = 0.5;

  // Check relevance score
  if (feature.relevance < MIN_RELEVANCE) {
    return false;
  }

  // The place_name should contain most of the original query terms
  const queryLower = query.toLowerCase();
  const placeLower = feature.place_name.toLowerCase();

  // Split query into meaningful parts (ignore conjunctions)
  const queryParts = queryLower
    .split(/[,\s]+/)
    .filter(
      (part) =>
        part.length > 2 && !["de", "en", "la", "el", "y"].includes(part),
    );

  // Check that most query parts are in the result
  if (queryParts.length > 0) {
    const matchingParts = queryParts.filter((part) =>
      placeLower.includes(part),
    );
    const matchPercentage = matchingParts.length / queryParts.length;

    // At least 40% of query parts should be in the result (reduced from 60%)
    if (matchPercentage < 0.4) {
      return false;
    }
  }

  return true;
};

/**
 * Geocodes an address string to coordinates with strict validation
 * @param {string} address - Address to geocode
 * @param {Object} options - Optional configuration
 * @returns {Promise<Object>} Geocoding result with validation
 */
export const geocodeAddress = async (address, options = {}) => {
  try {
    validateMapboxToken();

    if (!address || address.trim().length === 0) {
      throw new Error("Address cannot be empty");
    }

    const params = new URLSearchParams({
      access_token: MAPBOX_CONFIG.TOKEN,
      limit: options.limit || MAPBOX_CONFIG.GEOCODING.LIMIT,
      types: options.types || MAPBOX_CONFIG.GEOCODING.TYPES,
      country: options.country || MAPBOX_CONFIG.GEOCODING.COUNTRY,
    });

    const encodedAddress = encodeURIComponent(address);
    const url = `${MAPBOX_CONFIG.BASE_URL}${MAPBOX_CONFIG.ENDPOINTS.GEOCODING}/${encodedAddress}.json?${params}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Geocoding failed: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.features || data.features.length === 0) {
      return {
        success: false,
        results: [],
        message: "No results found for this address",
      };
    }

    // Filter results with strict validation
    const validResults = data.features.filter((feature) =>
      isValidMatch(feature, address),
    );

    if (validResults.length === 0) {
      return {
        success: false,
        results: [],
        message: "No exact matches found for this address",
      };
    }

    // Format results for easier consumption
    const results = validResults.map((feature) => ({
      id: feature.id,
      address: feature.place_name,
      coordinates: {
        latitude: feature.center[1],
        longitude: feature.center[0],
      },
      placeType: feature.place_type,
      context: feature.context,
      relevance: feature.relevance,
    }));

    return {
      success: true,
      results,
      query: address,
    };
  } catch (error) {
    console.error("Geocoding Service Error:", error);
    return {
      success: false,
      results: [],
      error: error.message,
    };
  }
};

/**
 * Validates if an address exists
 * @param {string} address - Address to validate
 * @returns {Promise<boolean>} True if address is valid
 */
export const validateAddress = async (address) => {
  try {
    const result = await geocodeAddress(address);
    return result.success && result.results.length > 0;
  } catch (error) {
    console.error("Address Validation Error:", error);
    return false;
  }
};

/**
 * Checks if address parts are present in the geocoding result
 */
export const validateAddressMatch = (query, result, addressObj = {}) => {
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
  const queryStreet = streetMatch ? streetMatch[1].trim().toLowerCase() : null;

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
};

/**
 * Strict validation function for form submissions
 */
export const validateAddressStrict = async (addressObj) => {
  if (!addressObj) {
    return { isValid: false, reason: "Dirección incompleta" };
  }

  const { street, number, city, region, postalCode } = addressObj;

  // Check ALL required fields - strict check
  if (
    !street?.trim() ||
    !number ||
    !city?.trim() ||
    !region?.trim() ||
    !postalCode?.trim()
  ) {
    return {
      isValid: false,
      reason:
        "Completa todos los campos: calle, número, ciudad, barrio y código postal",
    };
  }

  // Validate number format (positive integer)
  if (isNaN(number) || number <= 0) {
    return {
      isValid: false,
      reason: "El número de altura debe ser un valor positivo",
    };
  }

  // Build complete address string with all fields
  const fullAddress = `${street} ${number}, ${city}, ${region} ${postalCode}`;

  try {
    const result = await geocodeAddress(fullAddress);

    if (!result.success || result.results.length === 0) {
      return {
        isValid: false,
        reason: "No encontramos esta dirección. Verifica que sea correcta.",
      };
    }

    const firstResult = result.results[0];

    // Strict validation: check if parts match
    return validateAddressMatch(fullAddress, firstResult.address, addressObj);
  } catch (error) {
    console.error("Address strict validation error:", error);
    return {
      isValid: false,
      reason: "Error al validar la dirección. Intenta de nuevo.",
    };
  }
};
