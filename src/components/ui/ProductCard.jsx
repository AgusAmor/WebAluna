import PropTypes from "prop-types";

const ProductCard = ({ product, onCardClick, onAddToCart }) => {
  return (
    <div
      onClick={() => onCardClick(product)}
      className="bg-white rounded-xl shadow-md p-4 text-center transition-transform duration-200 cursor-pointer hover:-translate-y-1 hover:shadow-xl font-family-comfortaa"
    >
      {/* Product Image - Square */}
      {product.imageBase64 ? (
        <img
          src={`data:image/jpeg;base64,${product.imageBase64}`}
          alt={product.name}
          className="w-full aspect-square object-cover mb-4 rounded-xl"
        />
      ) : (
        <div className="w-full aspect-square bg-linear-to-br from-blue-3 to-blue-2 mb-4 rounded-xl flex items-center justify-center">
          <span className="text-white text-sm">Sin imagen</span>
        </div>
      )}

      {/* Product Info */}
      <h3 className="font-black text-blue-1 mb-1">{product.name}</h3>
      {product.family && (
        <p className="text-sm text-blue-2 font-semibold mb-1">
          {product.family}
        </p>
      )}
      <p className="text-lg font-bold text-gold mb-3">${product.price}</p>

      {/* Add to Cart Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onAddToCart(product);
        }}
        className="bg-blue-2 text-white px-4 py-2 rounded-lg text-sm font-bold font-family-comfortaa hover:bg-gold transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
      >
        Agregar al carrito
      </button>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    family: PropTypes.string,
    imageBase64: PropTypes.string,
  }).isRequired,
  onCardClick: PropTypes.func.isRequired,
  onAddToCart: PropTypes.func.isRequired,
};

export default ProductCard;
