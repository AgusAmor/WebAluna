import PropTypes from "prop-types";
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import { useCartModal } from "../../hooks";
import {
  getCartItemKey,
  formatPrice,
  formatSubtotal,
  getImageSource,
  isCartEmpty,
} from "../../services/cart/cartModalService";

const CartModal = ({ isOpen, onClose }) => {
  const {
    items,
    total,
    handleCheckout,
    handleGoToCatalog,
    handleRemoveItem,
    handleIncreaseQuantity,
    handleDecreaseQuantity,
    handleClearCart,
  } = useCartModal(onClose);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-family-sora">
      {/* Backdrop - manteniendo tu fondo actual */}
      <div
        className="fixed inset-0 backdrop-blur-sm"
        style={{ backgroundColor: "rgba(38,78,96,0.45)" }}
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="relative bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-5">
            <h2 className="text-center text-xl font-bold font-family-comfortaa text-blue-1">
              Tu Carrito
            </h2>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-5 pb-5 max-h-[50vh]">
            {isCartEmpty(items) ? (
              <div className="text-center py-8">
                <p className="text-gray-1 mb-4 font-family-sora">
                  No hay productos en el carrito.
                </p>
                <button
                  onClick={handleGoToCatalog}
                  className="bg-blue-2 text-white px-6 py-2 rounded-lg font-family-sora hover:bg-gold hover:scale-105 transition-all duration-300"
                >
                  Ver Catálogo
                </button>
              </div>
            ) : (
              <ul className="space-y-4">
                {items.map((item) => {
                  const itemKey = getCartItemKey(item.id, item.type);
                  // Support both imageUrl (from Firestore) and imageBase64 (legacy)
                  const imageSrc = getImageSource(
                    item.imageUrl || item.imageBase64
                  );

                  return (
                    <li
                      key={itemKey}
                      className="flex gap-4 items-center bg-white rounded-lg p-3 shadow-sm"
                    >
                      {/* Product Image */}
                      <div className="w-15 h-15 bg-gold rounded-md shrink-0 flex items-center justify-center border-2 border-blue-2">
                        {imageSrc ? (
                          <img
                            src={imageSrc}
                            alt={item.name}
                            className="w-full h-full object-cover rounded-md"
                          />
                        ) : (
                          <div className="w-15 h-15 bg-gray-2 rounded-md"></div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1">
                        <h4 className="font-family-comfortaa font-semibold text-blue-1 mb-1 flex items-center gap-2">
                          {item.name}
                          {item.type && (
                            <span className="bg-gold text-white text-xs px-2 py-1 rounded-full font-family-sora">
                              {item.type}
                            </span>
                          )}
                        </h4>
                        <p className="font-family-comfortaa font-black text-gold mb-2">
                          ${item.price}
                        </p>

                        {/* Controls + Subtotal */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleRemoveItem(itemKey)}
                            className="text-gold hover:text-blue-1 hover:bg-gray-2 rounded-full p-2 transition-all duration-300"
                            aria-label="Eliminar producto"
                          >
                            <FaTrash />
                          </button>
                          <button
                            onClick={() =>
                              handleDecreaseQuantity(itemKey, item.quantity)
                            }
                            className="text-blue-1 hover:bg-gold hover:text-black rounded-full p-2 transition-all duration-300"
                            aria-label="Disminuir cantidad"
                          >
                            <FaMinus />
                          </button>
                          <span className="text-2xl font-family-comfortaa font-black text-blue-1 min-w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleIncreaseQuantity(itemKey, item.quantity)
                            }
                            className="text-blue-1 hover:bg-gold hover:text-black rounded-full p-2 transition-all duration-300"
                            aria-label="Aumentar cantidad"
                          >
                            <FaPlus />
                          </button>
                          <span className="text-xs text-blue-2 ml-2 font-family-sora font-bold">
                            Subtotal: $
                            {formatSubtotal(item.price, item.quantity)}
                          </span>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Footer */}
          {!isCartEmpty(items) && (
            <div className="border-t border-gray-2 p-5">
              <p className="text-xl font-bold text-gold text-center mb-4 font-family-comfortaa">
                Total: ${formatPrice(total)}
              </p>

              <div className="flex flex-col gap-3">
                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleClearCart}
                    className="bg-blue-2 text-white px-6 py-2 rounded-lg font-family-sora hover:bg-gold hover:scale-105 transition-all duration-300"
                  >
                    Vaciar Carrito
                  </button>
                  <button
                    onClick={handleCheckout}
                    className="bg-blue-2 text-white px-6 py-2 rounded-lg font-family-sora hover:bg-gold hover:scale-105 transition-all duration-300"
                  >
                    Finalizar Compra
                  </button>
                </div>
                <button
                  onClick={handleGoToCatalog}
                  className="bg-white text-blue-2 border-2 border-blue-2 px-6 py-2 rounded-lg font-family-sora hover:bg-blue-2 hover:text-white transition-all duration-300"
                >
                  Continuar Comprando
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

CartModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CartModal;
