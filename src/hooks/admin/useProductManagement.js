import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  loadProducts,
  extractProductFormData,
  handleProductImageUpload,
  saveProduct,
  deleteProductWithImage,
} from "../../services/products/productManagementService";

/**
 * Custom hook for product management
 * Encapsulates all product management business logic and state
 */
export const useProductManagement = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editProduct, setEditProduct] = useState(null);

  /**
   * Load products on component mount
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await loadProducts();
        setProducts(data);
      } catch (err) {
        console.error("Error loading products:", err);
        setError("Error al cargar productos");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  /**
   * Refresh products list from backend
   */
  const refreshProducts = async () => {
    try {
      const data = await loadProducts();
      setProducts(data);
    } catch (err) {
      console.error("Error refreshing products:", err);
      setError("Error al actualizar productos");
    }
  };

  /**
   * Open modal for creating new product
   */
  const handleCreateProduct = () => {
    setEditProduct(null);
    setImagePreview(null);
    setShowModal(true);
  };

  /**
   * Open modal for editing existing product
   */
  const handleEditProduct = (product) => {
    setEditProduct(product);
    setImagePreview(product.imageUrl || null);
    setShowModal(true);
  };

  /**
   * Close modal and reset state
   */
  const handleCloseModal = () => {
    setShowModal(false);
    setEditProduct(null);
    setImagePreview(null);
    setError(null);
  };

  /**
   * Handle form submission (create or update)
   */
  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    if (saving) return;

    setError(null);
    setSaving(true);

    try {
      // Extract form data
      const formData = extractProductFormData(e.target);

      // Handle image upload
      let imageUrl = imagePreview || editProduct?.imageUrl || "";
      if (formData.file) {
        imageUrl = await handleProductImageUpload(formData.file, editProduct);
      } else if (!imageUrl) {
        throw new Error("Image is required");
      }

      // Save product
      await saveProduct({
        formData,
        imageUrl,
        user,
        existingProduct: editProduct,
      });

      // Refresh products list
      await refreshProducts();

      // Close modal
      handleCloseModal();
    } catch (err) {
      console.error("Error saving product:", err);
      setError(
        err.message ||
          (editProduct ? "Error editing product" : "Error creating product")
      );
    } finally {
      setSaving(false);
    }
  };

  /**
   * Handle product deletion
   */
  const handleDeleteProduct = async (product) => {
    if (deletingId) return;

    setDeletingId(product.id);
    setError(null);

    try {
      await deleteProductWithImage(product.id, product.imageUrl, user);

      // Remove from local state
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
    } catch (err) {
      console.error("Error deleting product:", err);
      setError(err.message || "Error deleting product");
    } finally {
      setDeletingId(null);
    }
  };

  return {
    // State
    products,
    loading,
    error,
    showModal,
    imagePreview,
    saving,
    deletingId,
    editProduct,

    // Actions
    setImagePreview,
    handleCreateProduct,
    handleEditProduct,
    handleCloseModal,
    handleSubmitProduct,
    handleDeleteProduct,
  };
};
