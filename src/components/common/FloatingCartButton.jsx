import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import CartModal from "../ecommerce/CartModal";
import { FaShoppingCart } from "react-icons/fa";
import { isAdminRoute } from "../../utils/adminUtils";

const FloatingCartButton = () => {
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const { itemCount } = useCart();
  const location = useLocation();

  const isAdminPage = isAdminRoute(location.pathname);

  return (
    <>
      {!isAdminPage && (
        <>
          {/* Floating Cart Button */}
          <button
            onClick={() => setIsCartModalOpen(true)}
            className="fixed bottom-5 left-5 z-50 bg-blue-2 text-white rounded-full p-4 shadow-lg cursor-pointer hover:bg-gold hover:scale-110 transition-all duration-300"
            title="Ver carrito"
            aria-label="Abrir carrito de compras"
          >
            <div className="relative">
              <FaShoppingCart className="w-6 h-6" />

              {/* Item Count Badge */}
              {itemCount > 0 && (
                <span className="absolute -top-3 -right-3 bg-gold text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
                  {itemCount}
                </span>
              )}
            </div>
          </button>

          {/* Cart Modal */}
          <CartModal
            isOpen={isCartModalOpen}
            onClose={() => setIsCartModalOpen(false)}
          />
        </>
      )}
    </>
  );
};

export default FloatingCartButton;
