import { storage } from "./firebase";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

// Service to fetch products from Firebase backend Cloud Functions
const BASE_URL = import.meta.env.VITE_FIREBASE_FUNCTIONS_BASE_URL;

/**
 * Deletes a product from Firestore.
 * Sends the product ID and user token for authentication.
 * @param {string} id - Product ID
 * @param {string} token - Firebase Auth token
 * @returns {Promise<Object>} Result
 */
export async function deleteProduct(id, token) {
  const response = await fetch(`${BASE_URL}/deleteProduct`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to delete product");
  }
  return await response.json();
}

/**
 * Deletes an image from Firebase Storage.
 * Extracts the storage path from the image URL and deletes the file.
 * @param {string} imageUrl - Full image URL
 * @returns {Promise<void>}
 */
export async function deleteProductImage(imageUrl) {
  // Extract storage path from imageUrl
  const match = imageUrl.match(/\/o\/([^?]+)/);
  if (!match || !match[1])
    throw new Error("No se pudo extraer el path de la imagen");
  const filePath = decodeURIComponent(match[1]);
  const fileRef = ref(storage, filePath);
  await deleteObject(fileRef);
}

/**
 * Replaces a product image in Firebase Storage.
 * Deletes the previous image using its URL, then uploads the new image file.
 * Returns the new image URL.
 * @param {File} newFile - The new image file to upload
 * @param {string} newPath - The storage path for the new image (e.g., 'products/filename.jpg')
 * @param {string} oldImageUrl - The full URL of the previous image to delete
 * @returns {Promise<string>} - The public URL of the uploaded image
 */
export async function replaceProductImage(newFile, newPath, oldImageUrl) {
  if (oldImageUrl) {
    try {
      await deleteProductImage(oldImageUrl);
    } catch (err) {
      // Log error but continue with upload
      console.error("Error deleting previous image:", err);
    }
  }
  return await uploadProductImage(newFile, newPath);
}

/**
 * Uploads an image file to Firebase Storage and returns its public URL.
 * Uses the provided file and storage path.
 * @param {File} file - The image file to upload
 * @param {string} path - The storage path (e.g., 'products/filename.jpg')
 * @returns {Promise<string>} - The public URL of the uploaded image
 */
export async function uploadProductImage(file, path) {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}

/**
 * Creates a new product by sending product data.
 * Requires a valid Firebase Auth token for authentication.
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
 * Updates an existing product in Firestore.
 * Requires the product ID, updated fields, and a valid Firebase Auth token.
 * @param {string} id - Product ID
 * @param {Object} productData - Campos a actualizar
 * @param {string} token - Firebase Auth token
 * @returns {Promise<Object>} Result
 */
export async function updateProduct(id, productData, token) {
  const response = await fetch(`${BASE_URL}/updateProduct`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id, ...productData }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to update product");
  }
  return await response.json();
}

/**
 * Fetches all products.
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
 * Fetches a single product by ID.
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
