import { useState } from "react";
import { CartModal } from "../modal/CartModal.jsx";
import "./floatingCartButton.css";

function FloatingCartButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="floating-cart-btn"
        onClick={() => setIsOpen(true)}
        title="Ver carrito"
      >
        carrito
      </button>

      {isOpen && <CartModal onClose={() => setIsOpen(false)} />}
    </>
  );
}

export default FloatingCartButton;
