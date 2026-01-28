import PropTypes from "prop-types";
import { useState } from "react";
import { IoIosClose } from "react-icons/io";

const ProductDetailModal = ({ product, isOpen, onClose, onAddToCart }) => {
  const [selectedType, setSelectedType] = useState("normal");
  if (!isOpen || !product) return null;

  const selectedPrice = product.pricing?.[selectedType]?.price;
  const selectedSize = product.pricing?.[selectedType]?.size;

  return (
    <div className="relative bg-white rounded-xl shadow-2xl border border-gray-2 max-w-xs sm:max-w-sm md:max-w-3xl w-full max-h-[90vh] sm:max-h-[80vh] overflow-y-auto p-3 sm:p-6 animate-fadeInScale flex flex-col md:flex-row gap-4 md:gap-10">
      <button
        className="absolute top-2 right-2 sm:top-3 sm:right-3 cursor-pointer text-blue-2 hover:text-gold hover:scale-150 transition-all z-10"
        onClick={onClose}
        aria-label="Close"
      >
        <IoIosClose size={20} />
      </button>
      {/* Left: Product Image or Placeholder */}
      <div className="shrink-0 flex justify-center items-center w-full md:w-72">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-40 sm:w-60 md:w-80 aspect-square object-cover rounded-lg"
          />
        ) : (
          <div className="w-40 sm:w-60 md:w-80 aspect-square bg-linear-to-br from-blue-3 to-blue-2 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs">Sin imagen</span>
          </div>
        )}
      </div>
      {/* Right: Product Details */}
      <div className="flex-1 flex flex-col justify-start">
        <h2 className="text-lg sm:text-2xl font-black text-blue-1 mb-1 sm:mb-2 font-family-comfortaa">
          {product.name}
        </h2>
        {product.family && (
          <p className="text-xs sm:text-sm text-blue-2 font-semibold mb-1 sm:mb-2">
            Familia: {product.family}
          </p>
        )}
        {product.description && (
          <p className="text-xs sm:text-sm text-gray-1 mb-2 sm:mb-4 font-family-sora line-clamp-2 sm:line-clamp-none">
            {product.description}
          </p>
        )}
        {/* Selectable price/size vertical list */}
        {product.pricing && (
          <div className="mb-4">
            <h3 className="text-sm sm:text-lg font-bold text-blue-2 mb-1 sm:mb-2">
              Precios y medidas
            </h3>
            <ul className="space-y-1 sm:space-y-2">
              {Object.entries(product.pricing).map(([type, info]) => (
                <li key={type}>
                  <button
                    type="button"
                    className={`w-full flex items-center justify-between rounded-lg shadow-sm font-bold transition-all duration-200 focus:outline-none focus:ring-2 cursor-pointer text-xs sm:text-sm
                      ${
                        selectedType === type
                          ? "bg-gold text-white ring-gold opacity-100 scale-100 sm:scale-105 px-3 sm:px-5 py-2 sm:py-3"
                          : "bg-blue-2 text-white opacity-70 scale-100 px-2 sm:px-4 py-1.5 sm:py-2"
                      }`}
                    onClick={() => setSelectedType(type)}
                  >
                    <span className="flex gap-2 items-center">
                      <span
                        className={`font-family-sora rounded-full transition-all duration-200
                        ${
                          selectedType === type
                            ? "text-xs sm:text-sm px-2 sm:px-3 py-0.5 sm:py-1 bg-gold text-white opacity-100 scale-100 sm:scale-105"
                            : "text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gold text-white opacity-70 scale-100"
                        }`}
                      >
                        {type}
                      </span>
                      <span className="text-gray-3 text-xs">{info.size}</span>
                    </span>
                    <span className="text-sm sm:text-lg font-black">
                      ${info.price}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* Add to Cart Button */}
        <button
          onClick={() =>
            onAddToCart({
              ...product,
              selectedPrice,
              selectedSize,
              selectedType,
            })
          }
          className="bg-blue-2 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold font-family-comfortaa hover:bg-gold transition-all duration-300 hover:-translate-y-0.5 active:scale-95 w-full mt-2 sm:mt-4"
        >
          Agregar al carrito
        </button>
        {product.createdBy && (
          <p className="text-xs text-gray-2 mt-1 sm:mt-2">
            Creado por: {product.createdBy}
          </p>
        )}
        {product.createdAt && (
          <p className="text-xs text-gray-2">
            Creado el: {new Date(product.createdAt).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
};

ProductDetailModal.propTypes = {
  product: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAddToCart: PropTypes.func.isRequired,
};

export default ProductDetailModal;
