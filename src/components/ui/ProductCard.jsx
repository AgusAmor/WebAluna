import PropTypes from "prop-types";
import { useState } from "react";
import OptimizedImage from "./OptimizedImage";

const ProductCard = ({ product, onCardClick, onAddToCart }) => {
  // Track selected price type: "normal" or "small"
  const [selectedType, setSelectedType] = useState("normal");

  // Get selected price and size
  const selectedPrice = product.pricing?.[selectedType]?.price;
  const selectedSize = product.pricing?.[selectedType]?.size;

  return (
    <div
      onClick={() => onCardClick(product)}
      className="bg-white rounded-xl shadow-md p-4 text-center transition-transform duration-200 cursor-pointer hover:-translate-y-1 hover:shadow-xl font-family-comfortaa"
    >
      {/* Product Image or Placeholder */}
      {product.imageUrl ? (
        <OptimizedImage
          src={product.imageUrl}
          alt={product.name}
          className="w-full aspect-square object-cover mb-4 rounded-xl"
          placeholder={
            <div className="w-full aspect-square bg-gray-2 animate-pulse rounded-xl" />
          }
        />
      ) : (
        <div className="w-full aspect-square bg-linear-to-br from-blue-3 to-blue-2 mb-4 rounded-xl flex items-center justify-center">
          <span className="text-white text-sm">Sin imagen</span>
        </div>
      )}

      {/* Product Info */}
      <h3 className="font-black text-blue-1 mb-1">{product.name}</h3>
      {product.family && (
        <p className="text-sm text-blue-2 font-semibold mb-2">
          {product.family}
        </p>
      )}
      {/* Pricing with selectable badges */}
      {product.pricing && (
        <div className="mb-3 flex justify-center gap-2">
          <button
            type="button"
            className={`inline-block px-3 py-1 rounded-full text-xs font-bold shadow-sm focus:outline-none focus:ring-2 cursor-pointer hover:scale-105 transition ${
              selectedType === "normal"
                ? "bg-gold/90 text-white ring-gold"
                : "bg-blue-2/90 text-white"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedType("normal");
            }}
          >
            N: ${product.pricing.normal.price}
          </button>
          <button
            type="button"
            className={`inline-block px-3 py-1 rounded-full text-xs font-bold shadow-sm focus:outline-none focus:ring-2 cursor-pointer hover:scale-105 transition ${
              selectedType === "small"
                ? "bg-gold/90 text-white ring-gold"
                : "bg-blue-2/90 text-white"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedType("small");
            }}
          >
            S: ${product.pricing.small.price}
          </button>
        </div>
      )}

      {/* Add to Cart Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onAddToCart({
            ...product,
            selectedPrice,
            selectedSize,
            selectedType,
          });
        }}
        className="bg-blue-2 text-white px-4 py-2 rounded-lg text-sm font-bold font-family-comfortaa hover:bg-gold transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
      >
        Agregar al carrito
      </button>
      <p className="mt-3 text-xs text-gray-3 font-family-sora">
        Click para ver más detalles
      </p>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    name: PropTypes.string.isRequired,
    family: PropTypes.string,
    description: PropTypes.string,
    pricing: PropTypes.shape({
      normal: PropTypes.shape({
        price: PropTypes.number.isRequired,
        size: PropTypes.string.isRequired,
      }),
      small: PropTypes.shape({
        price: PropTypes.number.isRequired,
        size: PropTypes.string.isRequired,
      }),
    }),
  }).isRequired,
  onCardClick: PropTypes.func.isRequired,
  onAddToCart: PropTypes.func.isRequired,
};

export default ProductCard;
