import React, { useState, useMemo } from "react";
import { MdAdd } from "react-icons/md";
import { Hero, ConfirmationModal } from "../../../components/common";
import Pagination from "../../../components/common/Pagination";
import ProductModal from "./ProductModal";
import ProductFilters from "./ProductFilters";
import ProductsTable from "./ProductsTable";
import { useProductManagement } from "../../../hooks";
import usePagination from "../../../hooks/admin/usePagination";
import {
  extractFamilies,
  filterAndSortProducts,
} from "../../../services/products/productsService";

/**
 * ProductManagement Component
 * Main orchestrator for product management page
 * Handles CRUD operations, modal state, and UI coordination
 */
const ProductManagement = () => {
  const {
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
    setImagePreview,
    handleCreateProduct,
    handleEditProduct,
    handleCloseModal,
    handleSubmitProduct,
    handleDeleteProduct,
    confirmDeleteProduct,
    cancelDeleteProduct,
  } = useProductManagement();

  // Filter states
  const [filterName, setFilterName] = useState("");
  const [filterFamily, setFilterFamily] = useState("all");
  const [priceSort, setPriceSort] = useState("none");

  // Compute families for the filter dropdown
  const families = useMemo(() => extractFamilies(products), [products]);

  // Apply text search, family filter and price sort
  const filteredProducts = useMemo(() => {
    let result = filterAndSortProducts(products, filterFamily, priceSort);
    if (filterName.trim()) {
      const q = filterName.trim().toLowerCase();
      result = result.filter((p) => (p.name || "").toLowerCase().includes(q));
    }
    return result;
  }, [products, filterName, filterFamily, priceSort]);

  // Paginación
  const {
    paginatedItems: paginatedProducts,
    currentPage,
    setCurrentPage,
    totalItems: totalProducts,
  } = usePagination(filteredProducts, 20, [filteredProducts.length]);

  return (
    <div className="min-h-screen bg-gray-3 px-4 py-2 pb-20">
      <Hero
        title="Gestión de Productos"
        subtitle="Aquí podrás administrar los productos del catálogo."
      />
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-center mb-4 mt-2">
          <button
            className="flex items-center gap-2 bg-gold text-white font-bold px-6 py-2 rounded-lg shadow hover:bg-blue-2 hover:text-white transition-colors"
            onClick={handleCreateProduct}
          >
            <MdAdd size={22} />
            Agregar producto
          </button>
        </div>

        {/* Filters */}
        <ProductFilters
          products={products}
          families={families}
          filterName={filterName}
          setFilterName={setFilterName}
          filterFamily={filterFamily}
          setFilterFamily={setFilterFamily}
          priceSort={priceSort}
          setPriceSort={setPriceSort}
        />

        {/* Product Modal */}
        <ProductModal
          isOpen={showModal}
          product={editProduct}
          imagePreview={imagePreview}
          setImagePreview={setImagePreview}
          saving={saving}
          error={error}
          onClose={handleCloseModal}
          onSubmit={handleSubmitProduct}
        />

        {/* Products Table */}
        <div className="bg-white rounded-xl shadow-md mt-2 overflow-x-auto">
          <ProductsTable
            products={paginatedProducts}
            loading={loading}
            error={error}
            deletingId={deletingId}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
          />
          <Pagination
            totalItems={totalProducts}
            itemsPerPage={20}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={showDeleteConfirm}
          title="Eliminar Producto"
          message={`¿Estás seguro de que deseas eliminar "${productToDelete?.name}"?`}
          description="Esta acción es irreversible y el producto será eliminado permanentemente del catálogo."
          onConfirm={confirmDeleteProduct}
          onCancel={cancelDeleteProduct}
          isLoading={!!deletingId}
          confirmText="Eliminar"
          cancelText="Cancelar"
          variant="danger"
        />
      </div>
    </div>
  );
};

export default ProductManagement;
