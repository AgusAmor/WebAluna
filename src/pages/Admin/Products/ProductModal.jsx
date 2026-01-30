import React from "react";
import { IoIosClose } from "react-icons/io";
import { useModalScroll } from "../../../hooks/ui";
import ProductForm from "./ProductForm";

/**
 * ProductModal Component
 * Modal dialog for creating or editing products
 *
 * @param {boolean} isOpen - Whether modal is open
 * @param {Object} product - Product being edited (null if creating new)
 * @param {string} imagePreview - Image preview URL
 * @param {Function} setImagePreview - Callback to update image preview
 * @param {boolean} saving - Saving state
 * @param {string} error - Error message if any
 * @param {Function} onClose - Callback when modal is closed
 * @param {Function} onSubmit - Callback when form is submitted
 */
const ProductModal = ({
  isOpen,
  product,
  imagePreview,
  setImagePreview,
  saving,
  error,
  onClose,
  onSubmit,
}) => {
  useModalScroll(isOpen);
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 overflow-hidden"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="bg-white rounded-xl shadow-lg p-6 md:p-8 w-full max-w-3xl min-w-[350px] relative max-h-[90vh] flex flex-col animate-fadeInScale"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 cursor-pointer text-blue-2 hover:text-gold hover:scale-150 transition-all z-10"
          onClick={onClose}
          aria-label="Close"
        >
          <IoIosClose size={26} />
        </button>
        <h2 className="text-xl md:text-2xl font-bold text-blue-2 mb-4 font-family-comfortaa shrink-0 pr-8">
          {product ? "Editar producto" : "Agregar producto"}
        </h2>
        <ProductForm
          initialProduct={product}
          imagePreview={imagePreview}
          setImagePreview={setImagePreview}
          saving={saving}
          error={error}
          buttonLabel={product ? "Aplicar cambios" : "Guardar"}
          onCancel={onClose}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
};

export default ProductModal;
