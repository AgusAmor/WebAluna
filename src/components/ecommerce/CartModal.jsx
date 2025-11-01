import PropTypes from "prop-types";
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import { useCart } from "../../context/CartContext";

const CartModal = ({ isOpen, onClose }) => {
  const { items, total, updateQuantity, removeItem, clearCart } = useCart();

  if (!isOpen) return null;

  const handleCheckout = () => {
    clearCart();
    alert("Compra finalizada!");
    onClose();
  };

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
          className="relative bg-blanco rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-5">
            <h2 className="text-center text-xl font-bold font-family-comfortaa text-azul-1">
              Tu Carrito
            </h2>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-5 pb-5 max-h-[50vh]">
            {items.length === 0 ? (
              <p className="text-center text-gris-1 py-8 font-family-sora">
                No hay productos en el carrito.
              </p>
            ) : (
              <ul className="space-y-4">
                {items.map((item) => (
                  <li key={item.id} className="flex gap-4 items-center">
                    {/* Product Image */}
                    <div className="w-15 h-15 bg-gris-2 rounded-md shrink-0">
                      {item.imageBase64 ? (
                        <img
                          src={`data:image/jpeg;base64,${item.imageBase64}`}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-15 h-15 bg-gris-2 rounded-md"></div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <h4 className="font-family-comfortaa font-semibold text-azul-2 mb-1">
                        {item.name}
                      </h4>
                      <p className="font-family-comfortaa font-black text-dorado mb-2">
                        ${item.price}
                      </p>

                      {/* Controls */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-azul-1 hover:text-dorado hover:scale-150 transition-all duration-300"
                          aria-label="Eliminar producto"
                        >
                          <FaTrash />
                        </button>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="text-azul-1 hover:text-dorado hover:scale-150 transition-all duration-300"
                          aria-label="Disminuir cantidad"
                        >
                          <FaMinus />
                        </button>
                        <span className="text-2xl font-family-comfortaa font-black text-azul-2 min-w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="text-azul-1 hover:text-dorado hover:scale-150 transition-all duration-300"
                          aria-label="Aumentar cantidad"
                        >
                          <FaPlus />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-gris-2 p-5">
              <p className="text-xl font-bold text-dorado text-center mb-4 font-family-comfortaa">
                Total: ${Math.round(total).toLocaleString("es-AR")}
              </p>

              <div className="flex justify-center gap-8">
                <button
                  onClick={clearCart}
                  className="bg-azul-2 text-blanco px-6 py-2 rounded-lg font-family-sora hover:bg-dorado hover:scale-110 transition-all duration-300"
                >
                  Vaciar Carrito
                </button>
                <button
                  onClick={handleCheckout}
                  className="bg-azul-2 text-blanco px-6 py-2 rounded-lg font-family-sora hover:bg-dorado hover:scale-110 transition-all duration-300"
                >
                  Finalizar Compra
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
