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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

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
          (editProduct ? "Error editing product" : "Error creating product"),
      );
    } finally {
      setSaving(false);
    }
  };

  /**
   * Open delete confirmation modal
   */
  const handleDeleteProduct = (product) => {
    setProductToDelete(product);
    setShowDeleteConfirm(true);
  };

  /**
   * Confirm and execute product deletion
   */
  const confirmDeleteProduct = async () => {
    if (deletingId || !productToDelete) return;

    setDeletingId(productToDelete.id);
    setError(null);

    try {
      await deleteProductWithImage(
        productToDelete.id,
        productToDelete.imageUrl,
        user,
      );

      // Remove from local state
      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));

      // Close confirmation modal
      setShowDeleteConfirm(false);
      setProductToDelete(null);
    } catch (err) {
      console.error("Error deleting product:", err);
      setError(err.message || "Error deleting product");
    } finally {
      setDeletingId(null);
    }
  };

  /**
   * Cancel product deletion
   */
  const cancelDeleteProduct = () => {
    setShowDeleteConfirm(false);
    setProductToDelete(null);
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
    showDeleteConfirm,
    productToDelete,

    // Handlers
    setImagePreview,
    handleCreateProduct,
    handleEditProduct,
    handleCloseModal,
    handleSubmitProduct,
    handleDeleteProduct,
    confirmDeleteProduct,
    cancelDeleteProduct,
  };
};
