import { storage, db } from "./firebase";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { apiPost, apiGet, apiPostAuth } from "./apiClient";

/**
 * Deletes a product from Firestore.
 * @param {string} id - Product ID
 * @param {string} token - Firebase Auth token
 * @returns {Promise<Object>} Result
 */
export async function deleteProduct(id, token) {
  return apiPostAuth("/deleteProduct", { id }, token);
}

/**
 * Deletes an image from Firebase Storage.
 * @param {string} imageUrl - Full image URL
 * @throws {Error} If path cannot be extracted
 */
export async function deleteProductImage(imageUrl) {
  const match = imageUrl.match(/\/o\/([^?]+)/);
  if (!match || !match[1]) {
    throw new Error("Could not extract image path from URL");
  }
  const filePath = decodeURIComponent(match[1]);
  await deleteObject(ref(storage, filePath));
}

/**
 * Replaces a product image in Firebase Storage.
 * Deletes the previous image, then uploads the new one.
 * @param {File} newFile - New image file
 * @param {string} newPath - Storage path for new image
 * @param {string} oldImageUrl - URL of previous image
 * @returns {Promise<string>} Public URL of uploaded image
 */
export async function replaceProductImage(newFile, newPath, oldImageUrl) {
  if (oldImageUrl) {
    try {
      await deleteProductImage(oldImageUrl);
    } catch (err) {
      console.error("Error deleting previous image:", err);
    }
  }
  return uploadProductImage(newFile, newPath);
}

/**
 * Uploads an image to Firebase Storage.
 * @param {File} file - Image file
 * @param {string} path - Storage path
 * @returns {Promise<string>} Public URL
 */
export async function uploadProductImage(file, path) {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

/**
 * Creates a new product.
 * @param {Object} product - Product data
 * @param {string} token - Firebase Auth token
 * @returns {Promise<Object>} Created product info
 */
export async function createProduct(product, token) {
  return apiPostAuth("/createProduct", product, token);
}

/**
 * Updates an existing product.
 * @param {string} id - Product ID
 * @param {Object} productData - Fields to update
 * @param {string} token - Firebase Auth token
 * @returns {Promise<Object>} Result
 */
export async function updateProduct(id, productData, token) {
  return apiPostAuth("/updateProduct", { id, ...productData }, token);
}

/**
 * Fetches all products directly from Firestore.
 * Provides faster load times by bypassing Cloud Functions.
 * @returns {Promise<Array>} Array of products with IDs
 * @throws {Error} If Firestore read fails
 */
export async function fetchProducts() {
  try {
    const productsCollection = collection(db, "products");
    const snapshot = await getDocs(productsCollection);
    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return products;
  } catch (error) {
    console.error("Error fetching products from Firestore:", error);
    throw new Error("Failed to fetch products from Firestore");
  }
}

/**
 * Fetches a single product by ID directly from Firestore.
 * @param {string} id - Product ID
 * @returns {Promise<Object>} Product object with id property
 * @throws {Error} If product not found
 */
export async function fetchProductById(id) {
  try {
    const productDoc = doc(db, "products", id);
    const snapshot = await getDoc(productDoc);

    if (!snapshot.exists()) {
      throw new Error("Product not found");
    }

    return {
      id: snapshot.id,
      ...snapshot.data(),
    };
  } catch (error) {
    console.error("Error fetching product by ID from Firestore:", error);
    throw error;
  }
}
