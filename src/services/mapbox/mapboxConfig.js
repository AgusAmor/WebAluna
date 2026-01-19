/**
 * Mapbox Configuration
 *
 * Centralizes all Mapbox API configuration and constants
 * Handles authentication with Mapbox token
 */

export const MAPBOX_CONFIG = {
  // Access token from environment variables
  TOKEN: import.meta.env.VITE_MAPBOX_TOKEN,

  // API Base URL
  BASE_URL: "https://api.mapbox.com",

  // API Endpoints
  ENDPOINTS: {
    GEOCODING: "/geocoding/v5/mapbox.places",
    DIRECTIONS: "/directions/v5/mapbox/driving",
  },

  // Geocoding options
  GEOCODING: {
    LIMIT: 5,
    TYPES: "place,address,postcode",
    COUNTRY: "AR", // Argentina
    PROXIMITY_BIAS: true, // Sesgado a proximidad
  },

  // Directions options
  DIRECTIONS: {
    GEOMETRIES: "geojson",
    OVERVIEW: "full",
    STEPS: true,
    CONTINUE_STRAIGHT: true,
  },

  // Timeouts
  TIMEOUT: 10000,
};

/**
 * Validates that Mapbox token is configured
 * @throws {Error} If token is missing
 */
export const validateMapboxToken = () => {
  if (!MAPBOX_CONFIG.TOKEN) {
    throw new Error(
      "Mapbox token not configured. Please set VITE_MAPBOX_TOKEN in your environment variables.",
    );
  }
  return true;
};
