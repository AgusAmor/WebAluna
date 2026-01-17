import React from "react";
import { ImSpinner2 } from "react-icons/im";

/**
 * ProductsTable Component
 * Displays product list in a table format with edit and delete actions
 *
 * @param {Array} products - List of products to display
 * @param {boolean} loading - Loading state
 * @param {string} error - Error message if any
 * @param {string} deletingId - ID of product being deleted
 * @param {Function} onEdit - Callback when edit button is clicked
 * @param {Function} onDelete - Callback when delete button is clicked
 */
const ProductsTable = ({
  products,
  loading,
  error,
  deletingId,
  onEdit,
  onDelete,
}) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16">
        <ImSpinner2 className="animate-spin h-12 w-12 text-gold" />
        <span className="text-blue-2 font-bold text-lg">
          Cargando productos...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500 font-bold">{error}</div>
    );
  }

  return (
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
            <td className="py-2 px-2 text-center">{product.family || "-"}</td>
            <td className="py-2 px-2 text-gold font-bold text-center">
              ${product.pricing?.normal?.price ?? "-"}
            </td>
            <td className="py-2 px-2 text-gold font-bold text-center">
              ${product.pricing?.small?.price ?? "-"}
            </td>
            <td className="py-2 px-2 text-center">
              <div className="flex flex-col items-center gap-2">
                <button
                  className="bg-blue-2 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-gold transition-colors w-24"
                  type="button"
                  onClick={() => onEdit(product)}
                >
                  Editar
                </button>
                <button
                  className={`bg-red-500 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-red-700 transition-colors w-24 flex items-center justify-center ${
                    deletingId === product.id
                      ? "opacity-60 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={deletingId === product.id}
                  onClick={() => onDelete(product)}
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
  );
};

export default ProductsTable;
