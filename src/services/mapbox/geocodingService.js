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
  // Minimum relevance score (0-1)
  const MIN_RELEVANCE = 0.7;

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

    // At least 60% of query parts should be in the result
    if (matchPercentage < 0.6) {
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
