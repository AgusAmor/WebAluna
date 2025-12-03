import React from "react";
import { MdAdd } from "react-icons/md";
import { IoIosClose } from "react-icons/io";
import { ImSpinner2 } from "react-icons/im";
import { Hero } from "../../../components/common";
import ProductForm from "./ProductForm";
import { useProductManagement } from "../../../hooks";

// ProductManagement component: handles product CRUD, modal state, and UI feedback for admin product management.
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
    setImagePreview,
    handleCreateProduct,
    handleEditProduct,
    handleCloseModal,
    handleSubmitProduct,
    handleDeleteProduct,
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
        {/* Modal for adding or editing a product. Reuses ProductForm component. */}
        {showModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                handleCloseModal();
              }
            }}
          >
            <div
              className="bg-white rounded-xl shadow-lg p-8 w-full max-w-3xl min-w-[350px] relative h-[600px] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-3 right-3 text-blue-2 hover:text-gold"
                onClick={handleCloseModal}
                aria-label="Close"
              >
                <IoIosClose className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-bold text-blue-2 mb-4 font-family-comfortaa">
                {editProduct ? "Editar producto" : "Agregar producto"}
              </h2>
              <ProductForm
                initialProduct={editProduct}
                imagePreview={imagePreview}
                setImagePreview={setImagePreview}
                saving={saving}
                error={error}
                buttonLabel={editProduct ? "Aplicar cambios" : "Guardar"}
                onCancel={handleCloseModal}
                onSubmit={handleSubmitProduct}
              />
            </div>
          </div>
        )}
        {/* Product table */}
        <div className="bg-white rounded-xl shadow-md mt-2 overflow-x-auto">
          {loading ? (
            <div className="text-center py-8 text-blue-2 font-bold">
              Cargando productos...
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500 font-bold">
              {error}
            </div>
          ) : (
            <table className="min-w-full font-family-sora text-xs md:text-sm">
              <thead>
                <tr className="bg-gold text-white">
                  <th className="py-2 px-1 font-bold text-center whitespace-nowrap">
                    Imagen
                  </th>
                  <th className="py-2 px-1 font-bold text-center whitespace-nowrap">
                    Nombre
                  </th>
                  <th className="py-2 px-1 font-bold text-center whitespace-nowrap">
                    Familia
                  </th>
                  <th className="py-2 px-1 font-bold text-center whitespace-nowrap">
                    Precio Normal
                  </th>
                  <th className="py-2 px-1 font-bold text-center whitespace-nowrap">
                    Precio Small
                  </th>
                  <th className="py-2 px-1 font-bold text-center whitespace-nowrap">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-gray-2 hover:bg-gray-3/40"
                  >
                    <td className="py-2 px-2 text-center">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg mx-auto"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-2 flex items-center justify-center rounded-lg text-xs text-gray-3 mx-auto">
                          Sin imagen
                        </div>
                      )}
                    </td>
                    <td className="py-2 px-2 font-bold text-blue-1 text-center">
                      {product.name}
                    </td>
                    <td className="py-2 px-2 text-center">
                      {product.family || "-"}
                    </td>
                    <td className="py-2 px-2 text-gold font-bold text-center">
                      ${product.pricing?.normal?.price ?? "-"}
                    </td>
                    <td className="py-2 px-2 text-gold font-bold text-center">
                      ${product.pricing?.small?.price ?? "-"}
                    </td>
                    <td className="py-2 px-2 text-center">
                      <div className="flex flex-col items-center gap-2">
                        {/* Edit button: opens modal with product data for editing. */}
                        <button
                          className="bg-blue-2 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-gold transition-colors w-24"
                          type="button"
                          onClick={() => handleEditProduct(product)}
                        >
                          Editar
                        </button>
                        {/* Delete button: removes product and image from Firestore/Storage. */}
                        <button
                          className={`bg-red-500 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-red-700 transition-colors w-24 flex items-center justify-center ${
                            deletingId === product.id
                              ? "opacity-60 cursor-not-allowed"
                              : ""
                          }`}
                          disabled={deletingId === product.id}
                          onClick={() => handleDeleteProduct(product)}
                        >
                          {deletingId === product.id ? (
                            <span className="flex items-center justify-center w-full h-full">
                              <ImSpinner2 className="animate-spin h-5 w-5 mx-auto text-white" />
                            </span>
                          ) : (
                            "Eliminar"
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;
