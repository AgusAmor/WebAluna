import firebaseProductsService from "./firebaseProductsService";

/**
 * Products Service - Firebase Implementation
 */
export const productsService = {
  /**
   * Get all products
   * @param {Object} filters - Filter options
   * @returns {Promise<Array>} Products array
   */
  async getProducts(filters = {}) {
    try {
      const options = {
        category: filters.category || null,
        orderByField: filters.orderBy || "createdAt",
        orderDirection: filters.orderDirection || "desc",
        limitCount: filters.limit || 50,
      };

      let products = await firebaseProductsService.getAllProducts(options);

      
      if (filters.available !== undefined) {
        products = products.filter((p) => p.available === filters.available);
      }

      if (filters.featured !== undefined) {
        products = products.filter((p) => p.featured === filters.featured);
      }

      return products;
    } catch (error) {
      console.error("Error getting products:", error);
      throw error;
    }
  },

  /**
   * Get product by ID
   * @param {string} productId - Product ID
   * @returns {Promise<Object>} Product data
   */
  async getProduct(productId) {
    try {
      return await firebaseProductsService.getProductById(productId);
    } catch (error) {
      console.error("Error getting product:", error);
      throw error;
    }
  },

  /**
   * Get featured products
   * @param {number} limit - Number of products to fetch
   * @returns {Promise<Array>} Featured products
   */
  async getFeaturedProducts(limit = 8) {
    try {
      return await firebaseProductsService.getFeaturedProducts(limit);
    } catch (error) {
      console.error("Error getting featured products:", error);
      throw error;
    }
  },

  /**
   * Search products
   * @param {string} searchTerm - Search term
   * @param {string} category - Optional category filter
   * @returns {Promise<Array>} Search results
   */
  async searchProducts(searchTerm, category = null) {
    try {
      return await firebaseProductsService.searchProducts(searchTerm, category);
    } catch (error) {
      console.error("Error searching products:", error);
      throw error;
    }
  },

  /**
   * Get products by category
   * @param {string} category - Category name
   * @returns {Promise<Array>} Products in category
   */
  async getProductsByCategory(category) {
    try {
      return await firebaseProductsService.getProductsByCategory(category);
    } catch (error) {
      console.error("Error getting products by category:", error);
      throw error;
    }
  },

  

  /**
   * Create new product (Admin only)
   * @param {Object} productData - Product data
   * @returns {Promise<Object>} Created product
   */
  async createProduct(productData) {
    try {
      return await firebaseProductsService.createProduct(productData);
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  },

  /**
   * Update product (Admin only)
   * @param {string} productId - Product ID
   * @param {Object} updates - Updates to apply
   * @returns {Promise<Object>} Updated product
   */
  async updateProduct(productId, updates) {
    try {
      return await firebaseProductsService.updateProduct(productId, updates);
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  },

  /**
   * Delete product (Admin only)
   * @param {string} productId - Product ID
   * @returns {Promise<Object>} Delete result
   */
  async deleteProduct(productId) {
    try {
      return await firebaseProductsService.deleteProduct(productId);
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  },

  /**
   * Upload product image (Admin only)
   * @param {File} file - Image file
   * @param {string} productId - Product ID
   * @returns {Promise<string>} Image URL
   */
  async uploadProductImage(file, productId) {
    try {
      return await firebaseProductsService.uploadProductImage(file, productId);
    } catch (error) {
      console.error("Error uploading product image:", error);
      throw error;
    }
  },

  /**
   * Delete product image (Admin only)
   * @param {string} imageUrl - Image URL
   * @returns {Promise<Object>} Delete result
   */
  async deleteProductImage(imageUrl) {
    try {
      return await firebaseProductsService.deleteProductImage(imageUrl);
    } catch (error) {
      console.error("Error deleting product image:", error);
      throw error;
    }
  },
};
