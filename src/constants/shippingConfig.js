/**
 * shippingConfig.js
 * Shipping configuration constants
 * Used for calculating shipping costs based on distance
 */

export const SHIPPING_CONFIG = {
  // Shipping cost calculation
  BASE_COST: 3000, // ARS
  COST_PER_KM: 800, // ARS per km
  MAX_SHIPPING_DISTANCE: 100, // km
  FREE_SHIPPING_THRESHOLD: 80000, // ARS

  // Warehouse location for distance calculation
  WAREHOUSE: {
    latitude: -34.5657935,
    longitude: -58.5007791,
  },
};
