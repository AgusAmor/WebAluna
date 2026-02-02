import {
  fetchProducts,
  createProduct,
  uploadProductImage,
  deleteProduct,
  updateProduct,
  replaceProductImage,
  deleteProductImage,
} from "../firebase/firebaseProductService";

/**
 * productManagementService.js
 * Business logic for admin product management.
 * Handles: CRUD operations, form processing, image management.
 * Used by: useProductManagement hook for admin product panel.
 */

/**
 * Extracts form data from a product form submission
 * @param {HTMLFormElement} form - The form element
 * @returns {Object} Extracted form data
 */
export const extractProductFormData = (form) => {
  return {
    name: form.elements["name"].value,
    description: form.elements["description"].value,
    family: form.elements["family"].value,
    normalPrice: form.elements["normalPrice"].value,
    normalSize: form.elements["normalSize"].value,
    smallPrice: form.elements["smallPrice"].value,
    smallSize: form.elements["smallSize"].value,
    file: form.querySelector("#product-image-upload")?.files?.[0],
  };
};

/**
 * Builds a product object from form data
 * @param {Object} formData - Extracted form data
 * @param {string} imageUrl - URL of the uploaded image
 * @returns {Object} Product object ready for backend
 */
export const buildProductObject = (formData, imageUrl) => {
  return {
    name: formData.name,
    description: formData.description,
    family: formData.family,
    imageUrl,
    pricing: {
      normal: {
        price: Number(formData.normalPrice),
        size: formData.normalSize,
      },
      small: {
        price: Number(formData.smallPrice),
        size: formData.smallSize,
      },
    },
  };
};

/**
 * Handles product image upload or replacement
 * @param {File} file - Image file to upload
 * @param {Object|null} existingProduct - Existing product (for edits)
 * @returns {Promise<string>} URL of the uploaded image
 */
export const handleProductImageUpload = async (
  file,
  existingProduct = null,
) => {
  if (!file) {
    throw new Error("Image file is required");
  }

  const uniqueName = `products/${Date.now()}_${Math.floor(
    Math.random() * 10000,
  )}_${file.name}`;

  if (existingProduct?.imageUrl) {
    // Replace existing image
    return await replaceProductImage(
      file,
      uniqueName,
      existingProduct.imageUrl,
    );
  } else {
    // Upload new image
    return await uploadProductImage(file, uniqueName);
  }
};

/**
 * Gets Firebase Auth token from user object
 * @param {Object} user - Firebase user object
 * @returns {Promise<string>} Auth token
 * @throws {Error} If token cannot be retrieved
 */
export const getAuthToken = async (user) => {
  if (!user) {
    throw new Error("User not authenticated");
  }

  let token = "";
  if (user.getIdToken) {
    token = await user.getIdToken(true); // force refresh
  } else if (user.stsTokenManager?.accessToken) {
    token = user.stsTokenManager.accessToken;
  }

  if (!token) {
    throw new Error("User token not found. Please log in again.");
  }

  return token;
};

/**
 * Saves a product (create or update)
 * @param {Object} params - Parameters object
 * @param {Object} params.formData - Extracted form data
 * @param {string} params.imageUrl - URL of the product image
 * @param {Object} params.user - Firebase user object
 * @param {Object|null} params.existingProduct - Existing product for updates
 * @returns {Promise<void>}
 */
export const saveProduct = async ({
  formData,
  imageUrl,
  user,
  existingProduct = null,
}) => {
  const token = await getAuthToken(user);
  const product = buildProductObject(formData, imageUrl);

  if (existingProduct) {
    await updateProduct(existingProduct.id, product, token);
  } else {
    await createProduct(product, token);
  }
};

/**
 * Deletes a product and its associated image
 * @param {string} productId - ID of the product to delete
 * @param {string} imageUrl - URL of the product image
 * @param {Object} user - Firebase user object
 * @returns {Promise<void>}
 */
export const deleteProductWithImage = async (productId, imageUrl, user) => {
  // console.log("Deleting product:", productId, "with image:", imageUrl);

  const token = await getAuthToken(user);

  // Delete product from Firestore
  await deleteProduct(productId, token);
  // console.log("Product deleted from Firestore");

  // Delete image from Storage if exists
  if (imageUrl) {
    try {
      await deleteProductImage(imageUrl);
      // console.log("Image deleted from Storage successfully");
    } catch (imgErr) {
      console.error("Error deleting image from storage:", imgErr);
      // Don't throw - product is already deleted, but log the error
      throw new Error(
        `Product deleted but failed to delete image: ${imgErr.message}`,
      );
    }
  } else {
    console.warn("No image URL provided, skipping image deletion");
  }
};

/**
 * Loads all products from backend
 * @returns {Promise<Array>} Array of products
 */
export const loadProducts = async () => {
  return await fetchProducts();
};
