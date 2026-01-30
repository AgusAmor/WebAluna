import React from "react";
import { MdAdd } from "react-icons/md";
import { Hero, ConfirmationModal } from "../../../components/common";
import ProductModal from "./ProductModal";
import ProductsTable from "./ProductsTable";
import { useProductManagement } from "../../../hooks";

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
            products={products}
            loading={loading}
            error={error}
            deletingId={deletingId}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
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
