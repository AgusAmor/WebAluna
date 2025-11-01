import { useState } from "react";
import { useCart } from "../../context/CartContext";
import CartModal from "../ecommerce/CartModal";
import { FiShoppingCart } from "react-icons/fi";

const FloatingCartButton = () => {
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const { itemCount } = useCart();

  return (
    <>
      {/* Floating Cart Button */}
      <button
        onClick={() => setIsCartModalOpen(true)}
        className="fixed bottom-6 left-6 bg-azul-2 hover:bg-azul-1 text-blanco rounded-full p-4 shadow-lg transition-all duration-300 transform hover:scale-110 z-50"
      >
        <div className="relative">
          {/* Cart Icon (react-icons) */}
          <FiShoppingCart className="w-6 h-6" />

          {/* Item Count Badge */}
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-dorado text-negro text-xs rounded-full px-2 py-1 min-w-5 text-center leading-none">
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
  );
};

export default FloatingCartButton;
