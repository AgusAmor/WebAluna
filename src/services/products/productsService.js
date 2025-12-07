/**
 * productCatalogService.js
 * Business logic for the product catalog page.
 * Contains pure functions for filtering, sorting, and loading products.
 * Used by: useProducts hook for displaying product listings.
 */

import { fetchProducts } from "../firebase/firebaseProductService";

/**
 * Loads all products from Firestore
 * @returns {Promise<Array>} - Array of product objects
 */
export async function loadProducts() {
  try {
    const products = await fetchProducts();
    return products;
  } catch (err) {
    throw new Error("Failed to load products");
  }
}

/**
 * Extracts unique product families from products array
 * @param {Array} products - Array of product objects
 * @returns {Array} - Array of unique family names with "all" as first option
 */
export function extractFamilies(products) {
  const uniqueFamilies = [...new Set(products.map((p) => p.family))];
  return ["all", ...uniqueFamilies];
}

/**
 * Filters products by family
 * @param {Array} products - Array of product objects
 * @param {string} selectedFamily - Family filter value ("all" or specific family)
 * @returns {Array} - Filtered products
 */
export function filterProductsByFamily(products, selectedFamily) {
  if (selectedFamily === "all") {
    return products;
  }
  return products.filter((product) => product.family === selectedFamily);
}

/**
 * Sorts products by price
 * @param {Array} products - Array of product objects
 * @param {string} sortOrder - Sort order: "asc", "desc", or "none"
 * @returns {Array} - Sorted products
 */
export function sortProductsByPrice(products, sortOrder) {
  if (sortOrder === "none") {
    return products;
  }

  return [...products].sort((a, b) => {
    const priceA = a.pricing?.normal?.price ?? 0;
    const priceB = b.pricing?.normal?.price ?? 0;

    if (sortOrder === "asc") {
      return priceA - priceB;
    }
    if (sortOrder === "desc") {
      return priceB - priceA;
    }
    return 0;
  });
}

/**
 * Applies both family filter and price sorting to products
 * @param {Array} products - Array of product objects
 * @param {string} selectedFamily - Family filter value
 * @param {string} priceSort - Sort order: "asc", "desc", or "none"
 * @returns {Array} - Filtered and sorted products
 */
export function filterAndSortProducts(products, selectedFamily, priceSort) {
  const filtered = filterProductsByFamily(products, selectedFamily);
  const sorted = sortProductsByPrice(filtered, priceSort);
  return sorted;
}
