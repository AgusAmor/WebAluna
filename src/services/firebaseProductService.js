// Service to fetch products from Firebase backend Cloud Functions

const BASE_URL = import.meta.env.VITE_FIREBASE_FUNCTIONS_BASE_URL;

/**
 * Fetches all products from the backend Cloud Function.
 * @returns {Promise<Array>} Array of product objects
 * @throws {Error} If the request fails
 */
export async function fetchProducts() {
  const response = await fetch(`${BASE_URL}/getProducts`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  const data = await response.json();
  return data.products;
}

/**
 * Fetches a single product by its ID from the backend Cloud Function.
 * @param {string} id - The product ID
 * @returns {Promise<Object>} Product object
 * @throws {Error} If the request fails
 */
export async function fetchProductById(id) {
  const response = await fetch(`${BASE_URL}/getProductById?id=${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }
  return await response.json();
}
