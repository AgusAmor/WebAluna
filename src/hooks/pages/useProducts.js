/**
 * useProducts.js
 * Custom hook for managing product catalog state and logic.
 * Handles loading, filtering, sorting, and modal state for products.
 */

import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import {
  loadProducts,
  extractFamilies,
  filterAndSortProducts,
} from "../../services/products/productsService";

export function useProducts() {
  const { addItem } = useCart();
  const location = useLocation();

  // Product data state
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter and sort state
  const [selectedFamily, setSelectedFamily] = useState("all");
  const [priceSort, setPriceSort] = useState("none");

  // Modal state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  // Load products on mount
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const products = await loadProducts();
        setAllProducts(products);
      } catch (err) {
        setError(err.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Handle navigation from Home page with product to open
  useEffect(() => {
    if (location.state?.openProduct) {
      setSelectedProduct(location.state.openProduct);
      setImgLoaded(false);
      // Clear navigation state to prevent modal reopening on refresh
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [location.state]);

  // Compute filtered and sorted products
  const filteredProducts = filterAndSortProducts(
    allProducts,
    selectedFamily,
    priceSort
  );

  // Extract unique families for filter dropdown
  const families = extractFamilies(allProducts);

  /**
   * Adds product to cart
   * @param {Object} product - Product to add to cart
   */
  const handleAddToCart = (product) => {
    addItem(product);
  };

  /**
   * Opens product detail modal
   * @param {Object} product - Product to display in modal
   */
  const handleCardClick = (product) => {
    setSelectedProduct(product);
    setImgLoaded(false);
  };

  /**
   * Closes product detail modal
   */
  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  /**
   * Updates selected family filter
   * @param {string} family - Family name or "all"
   */
  const handleFamilyChange = (family) => {
    setSelectedFamily(family);
  };

  /**
   * Updates price sort order
   * @param {string} sort - Sort order: "asc", "desc", or "none"
   */
  const handlePriceSortChange = (sort) => {
    setPriceSort(sort);
  };

  return {
    allProducts,
    filteredProducts,
    loading,
    error,
    families,
    selectedFamily,
    priceSort,
    selectedProduct,
    imgLoaded,
    setImgLoaded,
    handleAddToCart,
    handleCardClick,
    handleCloseModal,
    handleFamilyChange,
    handlePriceSortChange,
  };
}
