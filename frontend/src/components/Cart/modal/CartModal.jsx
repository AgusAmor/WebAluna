import { useEffect, useState } from "react";
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import { useCart } from "../../../context/CartContext";
import "./cartModal.css";

export function CartModal({ onClose }) {
  const { cartItems, addToCart, removeFromCart, clearCart, setCartItems } =
    useCart();

  const [fullCartItems, setFullCartItems] = useState([]);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const responses = await Promise.all(
          cartItems.map((item) =>
            fetch(`http://localhost:5000/products/${item.id}`).then((res) =>
              res.json()
            )
          )
        );

        const enrichedItems = responses.map((product, i) => ({
          ...product,
          quantity: cartItems[i].quantity,
        }));
        setFullCartItems(enrichedItems);
      } catch (err) {
        console.error("Error al cargar detalles del producto:", err);
      }
    };

    if (cartItems.length > 0) {
      fetchProductData();
    } else {
      setFullCartItems([]);
    }
  }, [cartItems]);

  const decreaseQuantity = (id) => {
    setCartItems((prev) => {
      return prev
        .map((item) => {
          if (item.id === id) {
            if (item.quantity === 1) return null;
            return { ...item, quantity: item.quantity - 1 };
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const total = fullCartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="cart-modal-overlay" onClick={onClose}>
      <div className="cart-modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Tu Carrito</h2>
        {fullCartItems.length === 0 ? (
          <p>No hay productos en el carrito.</p>
        ) : (
          <div>
            <ul>
              {fullCartItems.map((item) => (
                <li key={item.id} className="cart-item">
                  <img src={item.img} alt={item.name} />
                  <div>
                    <h4>{item.name}</h4>
                    <p>${item.price}</p>
                    <div className="cart-controls">
                      <button onClick={() => removeFromCart(item.id)}>
                        <FaTrash />
                      </button>
                      <button onClick={() => decreaseQuantity(item.id)}>
                        <FaMinus />
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => addToCart(item)}>
                        <FaPlus />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <p className="cart-total">
              {" "}
              Total: ${Math.round(total).toLocaleString("es-AR")}
            </p>
          </div>
        )}

        {fullCartItems.length > 0 && (
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
