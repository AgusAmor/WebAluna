import { storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

/**
 * Uploads an image file to Firebase Storage and returns its public URL.
 * @param {File} file - The image file to upload
 * @param {string} path - The storage path (e.g., 'products/filename.jpg')
 * @returns {Promise<string>} - The public URL of the uploaded image
 */
export async function uploadProductImage(file, path) {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}
// Service to fetch products from Firebase backend Cloud Functions

const BASE_URL = import.meta.env.VITE_FIREBASE_FUNCTIONS_BASE_URL;

/**
 * Creates a new product by sending product data and image to the backend Cloud Function.
 * @param {Object} product - Product data (name, price, description, etc.)
 * @param {string} imageBase64 - Base64-encoded image string
 * @param {string} imageMimeType - MIME type of the image (e.g., 'image/png')
 * @param {string} token - Firebase Auth token for authentication
 * @returns {Promise<Object>} Created product info
 * @throws {Error} If the request fails
 */
/**
 * Creates a new product by sending product data (with imageUrl) to the backend Cloud Function.
 * @param {Object} product - Product data (name, price, description, imageUrl, etc.)
 * @param {string} token - Firebase Auth token for authentication
 * @returns {Promise<Object>} Created product info
 * @throws {Error} If the request fails
 */
export async function createProduct(product, token) {
  const response = await fetch(`${BASE_URL}/createProduct`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(product),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to create product");
  }
  return await response.json();
}

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
