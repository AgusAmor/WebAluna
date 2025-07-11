import { useState } from "react";
import { useLocation } from "react-router-dom";
import { CartModal } from "../modal/CartModal.jsx";
import { FaShoppingCart } from "react-icons/fa";
import "./floatingCartButton.css";

function FloatingCartButton() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminPage ? (
        <>
          <button
            className="floating-cart-btn"
            onClick={() => setIsOpen(true)}
            title="Ver carrito"
          >
            <FaShoppingCart />
          </button>
        </>
      ) : null}

      {isOpen && <CartModal onClose={() => setIsOpen(false)} />}
    </>
  );
}

export default FloatingCartButton;
