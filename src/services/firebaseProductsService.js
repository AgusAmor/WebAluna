import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "./firebase";
import { DB_CONFIG } from "../constants/config";

class ProductsService {
  constructor() {
    this.db = db;
    this.storage = storage;
    this.collectionName = DB_CONFIG.FIREBASE.COLLECTIONS.PRODUCTS;
  }

  async getAllProducts(options = {}) {
    try {
      const {
        category = null,
        orderByField = "createdAt",
        orderDirection = "desc",
        limitCount = 50,
      } = options;

      let q = query(
        collection(this.db, this.collectionName),
        orderBy(orderByField, orderDirection)
      );

      if (category) {
        q = query(q, where("category", "==", category));
      }

      if (limitCount) {
        q = query(q, limit(limitCount));
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Get Products Error:", error);
      throw error;
    }
  }

  async getProductById(productId) {
    try {
      const docRef = doc(this.db, this.collectionName, productId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        };
      } else {
        throw new Error("Producto no encontrado");
      }
    } catch (error) {
      console.error("Get Product Error:", error);
      throw error;
    }
  }

  async createProduct(productData) {
    try {
      const docRef = await addDoc(collection(this.db, this.collectionName), {
        ...productData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return {
        id: docRef.id,
        ...productData,
      };
    } catch (error) {
      console.error("Create Product Error:", error);
      throw error;
    }
  }

  async updateProduct(productId, updates) {
    try {
      const docRef = doc(this.db, this.collectionName, productId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });

      return await this.getProductById(productId);
    } catch (error) {
      console.error("Update Product Error:", error);
      throw error;
    }
  }

  async deleteProduct(productId) {
    try {
      const docRef = doc(this.db, this.collectionName, productId);
      await deleteDoc(docRef);
      return { success: true, message: "Producto eliminado" };
    } catch (error) {
      console.error("Delete Product Error:", error);
      throw error;
    }
  }

  async uploadProductImage(file, productId) {
    try {
      const timestamp = Date.now();
      const fileName = `products/${productId}/${timestamp}_${file.name}`;
      const storageRef = ref(this.storage, fileName);

      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      return downloadURL;
    } catch (error) {
      console.error("Upload Image Error:", error);
      throw error;
    }
  }

  async deleteProductImage(imageUrl) {
    try {
      const imageRef = ref(this.storage, imageUrl);
      await deleteObject(imageRef);
      return { success: true };
    } catch (error) {
      console.error("Delete Image Error:", error);
      throw error;
    }
  }

  async searchProducts(searchTerm, category = null) {
    try {
      let q = collection(this.db, this.collectionName);

      if (category) {
        q = query(q, where("category", "==", category));
      }

      const querySnapshot = await getDocs(q);
      const products = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const searchLower = searchTerm.toLowerCase();
      return products.filter(
        (product) =>
          product.name?.toLowerCase().includes(searchLower) ||
          product.description?.toLowerCase().includes(searchLower)
      );
    } catch (error) {
      console.error("Search Products Error:", error);
      throw error;
    }
  }

  /**
   * Get products by category
   */
  async getProductsByCategory(category) {
    try {
      const q = query(
        collection(this.db, this.collectionName),
        where("category", "==", category)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Get Products by Category Error:", error);
      throw error;
    }
  }

  async getFeaturedProducts(limitCount = 8) {
    try {
      const q = query(
        collection(this.db, this.collectionName),
        where("featured", "==", true),
        orderBy("createdAt", "desc"),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Get Featured Products Error:", error);
      throw error;
    }
  }

  /**
   * Search products by name or description
   * @param {string} searchTerm - Term to search for
   * @param {string} category - Optional category filter
   * @returns {Promise<Array>} Matching products
   */
  async searchProducts(searchTerm, category = null) {
    try {
      let q = query(collection(this.db, this.collectionName));

      if (category) {
        q = query(q, where("category", "==", category));
      }

      const querySnapshot = await getDocs(q);
      const products = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Filter by search term (client-side)
      const searchLower = searchTerm.toLowerCase();
      return products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower)
      );
    } catch (error) {
      console.error("Search Products Error:", error);
      throw error;
    }
  }

  /**
   * Get products by category
   * @param {string} category - Category name
   * @returns {Promise<Array>} Products in category
   */
  async getProductsByCategory(category) {
    try {
      const q = query(
        collection(this.db, this.collectionName),
        where("category", "==", category),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Get Products by Category Error:", error);
      throw error;
    }
  }

  /**
   * Format price for display
   * @param {number} price - Price value
   * @returns {string} Formatted price
   */
  formatPrice(price) {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(price);
  }

  /**
   * Calculate display price (considers discounts)
   * @param {Object} product - Product data
   * @returns {number} Display price
   */
  getDisplayPrice(product) {
    if (product.discountPrice && product.discountPrice < product.price) {
      return product.discountPrice;
    }
    return product.price;
  }

  /**
   * Check if product is in stock
   * @param {Object} product - Product data
   * @returns {boolean} True if in stock
   */
  isInStock(product) {
    return product.available && product.stock > 0;
  }

  /**
   * Check if product is on sale
   * @param {Object} product - Product data
   * @returns {boolean} True if on sale
   */
  isOnSale(product) {
    return product.discountPrice && product.discountPrice < product.price;
  }

  /**
   * Format product for display with additional computed fields
   * @param {Object} product - Product data
   * @returns {Object} Enhanced product data
   */
  formatProductForDisplay(product) {
    return {
      ...product,
      displayPrice: this.getDisplayPrice(product),
      formattedPrice: this.formatPrice(this.getDisplayPrice(product)),
      formattedOriginalPrice: this.isOnSale(product)
        ? this.formatPrice(product.price)
        : null,
      inStock: this.isInStock(product),
      onSale: this.isOnSale(product),
      discountPercentage: this.isOnSale(product)
        ? Math.round((1 - product.discountPrice / product.price) * 100)
        : null,
    };
  }
}

// Create and export singleton instance
const productsService = new ProductsService();
export default productsService;
