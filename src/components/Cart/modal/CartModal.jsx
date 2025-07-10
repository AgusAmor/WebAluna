import { useCart } from "../../../context/CartContext";
import "./cartModal.css";

export function CartModal({ onClose }) {
  const { cartItems, addToCart, removeFromCart, clearCart, setCartItems } =
    useCart();

  const decreaseQuantity = (id) => {
    setCartItems((prev) => {
      return prev
        .map((item) => {
          if (item.id === id) {
            if (item.quantity === 1) {
              return null;
            }
            return { ...item, quantity: item.quantity - 1 };
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  return (
    <div className="cart-modal-overlay" onClick={onClose}>
      <div className="cart-modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Tu Carrito</h2>
        {cartItems.length === 0 ? (
          <p>No hay productos en el carrito.</p>
        ) : (
          <ul>
            {cartItems.map((item) => (
              <li key={item.id} className="cart-item">
                <img src={item.img} alt={item.name} />
                <div>
                  <h4>{item.name}</h4>
                  <p>${item.price}</p>
                  <div className="cart-controls">
                    <button onClick={() => decreaseQuantity(item.id)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => addToCart(item)}>+</button>
                    <button onClick={() => removeFromCart(item.id)}>🗑</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {cartItems.length > 0 && (
          <div className="cart-actions">
            <button onClick={clearCart}>Vaciar Carrito</button>
            <button
              onClick={() => {
                clearCart();
                alert("Compra finalizada!");
              }}
            >
              Finalizar Compra
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
