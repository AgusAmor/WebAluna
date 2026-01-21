import { useState, useCallback } from "react";
import {
  calculateRoute,
  calculateShippingCost,
} from "../../services/mapbox/directionsService";
import { SHIPPING_CONFIG } from "../../constants/config";

/**
 * Custom hook for calculating shipping costs based on delivery address
 * Uses Mapbox Directions API to get distance from warehouse to destination
 * Then calculates cost using formula: BASE_COST + (distance * COST_PER_KM)
 */
export function useShippingCost() {
  const [shippingCost, setShippingCost] = useState(null);
  const [shippingDistance, setShippingDistance] = useState(null);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Calculates shipping cost for a given delivery address
   * @param {Object} address - Address object with fields: street, number, city, region, postalCode
   * @param {number} productTotal - Total amount of products (before shipping). Free shipping if >= FREE_SHIPPING_THRESHOLD
   * @returns {Promise<Object>} Object with cost, distance, and metadata
   */
  const calculateCost = useCallback(async (address, productTotal = 0) => {
    if (!address || !address.street || !address.number || !address.city) {
      setError("Dirección incompleta para calcular envío");
      setShippingCost(null);
      setShippingDistance(null);
      return null;
    }

    setCalculating(true);
    setError(null);

    try {
      // Build destination address string
      const destinationAddress = `${address.street} ${address.number}, ${address.city}, ${address.region} ${address.postalCode}`;

      // Geocode destination address to get coordinates
      const { geocodeAddress } =
        await import("../../services/mapbox/geocodingService");

      // Get coordinates of destination
      const geocodingResult = await geocodeAddress(destinationAddress);
      if (!geocodingResult.success || geocodingResult.results.length === 0) {
        throw new Error("No se pudo validar la dirección de envío");
      }

      const destination = geocodingResult.results[0].coordinates;

      // Calculate route from warehouse to destination
      const route = await calculateRoute(
        SHIPPING_CONFIG.WAREHOUSE,
        destination,
      );

      if (!route.success) {
        throw new Error(route.error || "No se pudo calcular la ruta de envío");
      }

      const distanceKm = parseFloat(route.route.distance.kilometers);

      // Check if distance exceeds maximum shipping distance
      if (distanceKm > SHIPPING_CONFIG.MAX_SHIPPING_DISTANCE) {
        throw new Error(
          `La distancia de envío (${distanceKm} km) excede el máximo permitido (${SHIPPING_CONFIG.MAX_SHIPPING_DISTANCE} km)`,
        );
      }

      // Calculate cost
      let cost = calculateShippingCost(
        distanceKm,
        SHIPPING_CONFIG.BASE_COST,
        SHIPPING_CONFIG.COST_PER_KM,
      );

      // Apply free shipping if product total >= threshold
      if (productTotal >= SHIPPING_CONFIG.FREE_SHIPPING_THRESHOLD) {
        cost = 0;
      }

      // Update state
      setShippingDistance(distanceKm);
      setShippingCost(Math.round(cost)); // Round to nearest integer

      return {
        cost: Math.round(cost),
        distance: distanceKm,
        distanceFormatted: `${distanceKm.toFixed(2)} km`,
        costPerKm: SHIPPING_CONFIG.COST_PER_KM,
        baseCost: SHIPPING_CONFIG.BASE_COST,
        isFreeShipping: productTotal >= SHIPPING_CONFIG.FREE_SHIPPING_THRESHOLD,
      };
    } catch (err) {
      const errorMessage = err.message || "Error al calcular el costo de envío";
      console.error("Shipping Cost Calculation Error:", err);
      setError(errorMessage);
      setShippingCost(null);
      setShippingDistance(null);
      return null;
    } finally {
      setCalculating(false);
    }
  }, []);

  /**
   * Resets shipping cost calculation
   */
  const reset = useCallback(() => {
    setShippingCost(null);
    setShippingDistance(null);
    setError(null);
  }, []);

  return {
    shippingCost,
    shippingDistance,
    calculating,
    error,
    calculateCost,
    reset,
  };
}
