/**
 * homeService.js
 * Business logic for the home page.
 * Contains pure functions with no React dependencies.
 */

import { fetchProducts } from "../firebase/firebaseProductService";

/**
 * Loads products from backend for featured products carousel
 * @returns {Promise<Array>} - Array of product objects
 */
export async function loadFeaturedProducts() {
  try {
    const products = await fetchProducts();
    return products;
  } catch (err) {
    throw new Error("No se pudieron cargar los productos");
  }
}

/**
 * Calculates carousel animation parameters
 * @param {number} productCount - Number of products in carousel
 * @returns {Object} - Animation configuration
 */
export function getCarouselConfig(productCount) {
  const itemWidth = 320 + 24; // 20rem (320px) + 1.5rem gap (24px)
  const scrollSpeed = 0.4; // pixels per frame
  const resetPoint = itemWidth * productCount;

  return {
    itemWidth,
    scrollSpeed,
    resetPoint,
  };
}

/**
 * Duplicates product array for infinite carousel effect
 * @param {Array} products - Original products array
 * @returns {Array} - Duplicated products array
 */
export function duplicateProductsForCarousel(products) {
  return [...products, ...products];
}
