/**
 * Mapbox Directions Service
 *
 * Handles route calculation and distance/time estimation
 * Used for shipping cost calculation based on distance
 */

import { MAPBOX_CONFIG, validateMapboxToken } from "./mapboxConfig.js";
import { SHIPPING_CONFIG } from "../../constants/config.js";

/**
 * Calculates route between two coordinates
 * @param {Object} origin - Starting point {latitude, longitude}
 * @param {Object} destination - Ending point {latitude, longitude}
 * @param {Object} options - Optional configuration
 * @returns {Promise<Object>} Route information with distance and duration
 */
export const calculateRoute = async (origin, destination, options = {}) => {
  try {
    validateMapboxToken();

    // Validate coordinates
    if (!isValidCoordinates(origin) || !isValidCoordinates(destination)) {
      throw new Error("Invalid coordinates provided");
    }

    const coordinates = `${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}`;

    const params = new URLSearchParams({
      access_token: MAPBOX_CONFIG.TOKEN,
      geometries: options.geometries || MAPBOX_CONFIG.DIRECTIONS.GEOMETRIES,
      overview: options.overview || MAPBOX_CONFIG.DIRECTIONS.OVERVIEW,
      steps: options.steps || MAPBOX_CONFIG.DIRECTIONS.STEPS,
      continue_straight:
        options.continue_straight || MAPBOX_CONFIG.DIRECTIONS.CONTINUE_STRAIGHT,
    });

    const url = `${MAPBOX_CONFIG.BASE_URL}${MAPBOX_CONFIG.ENDPOINTS.DIRECTIONS}/${coordinates}?${params}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Directions API failed: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.routes || data.routes.length === 0) {
      return {
        success: false,
        route: null,
        message: "No route found between these coordinates",
      };
    }

    const route = data.routes[0];

    return {
      success: true,
      route: {
        distance: {
          meters: route.distance,
          kilometers: (route.distance / 1000).toFixed(2),
          miles: ((route.distance / 1000) * 0.621371).toFixed(2),
        },
        duration: {
          seconds: route.duration,
          minutes: (route.duration / 60).toFixed(2),
          hours: (route.duration / 3600).toFixed(2),
        },
        geometry: route.geometry,
        steps: route.legs?.[0]?.steps || [],
      },
      origin,
      destination,
    };
  } catch (error) {
    console.error("Directions Service Error:", error);
    return {
      success: false,
      route: null,
      error: error.message,
    };
  }
};

/**
 * Validates coordinate format
 * @param {Object} coords - Coordinates object
 * @returns {boolean} True if coordinates are valid
 */
const isValidCoordinates = (coords) => {
  if (!coords || typeof coords !== "object") return false;

  const lat = coords.latitude;
  const lng = coords.longitude;

  if (typeof lat !== "number" || typeof lng !== "number") return false;

  // Validate latitude range (-90 to 90)
  if (lat < -90 || lat > 90) return false;

  // Validate longitude range (-180 to 180)
  if (lng < -180 || lng > 180) return false;

  return true;
};

/**
 * Calculates shipping cost based on distance
 * @param {number} distanceKm - Distance in kilometers
 * @param {number} baseCost - Base shipping cost (defaults to SHIPPING_CONFIG.BASE_COST)
 * @param {number} costPerKm - Cost per kilometer (defaults to SHIPPING_CONFIG.COST_PER_KM)
 * @returns {number} Total shipping cost
 */
export const calculateShippingCost = (
  distanceKm,
  baseCost = SHIPPING_CONFIG.BASE_COST,
  costPerKm = SHIPPING_CONFIG.COST_PER_KM,
) => {
  if (typeof distanceKm !== "number" || distanceKm < 0) {
    throw new Error("Invalid distance provided");
  }

  return baseCost + distanceKm * costPerKm;
};
