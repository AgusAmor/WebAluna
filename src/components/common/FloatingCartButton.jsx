import React, { useState } from "react";
import { useCart } from "../../context/CartContext";
import CartModal from "../ecommerce/CartModal";

const FloatingCartButton = () => {
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const { itemCount } = useCart();

  return (
    <>
      {/* Floating Cart Button */}
      <button
        onClick={() => setIsCartModalOpen(true)}
        className="fixed bottom-6 left-6 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 transform hover:scale-110 z-50"
      >
        <div className="relative">
          {/* Cart Icon */}
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6M7 13H5.4M17 21v-2a2 2 0 00-2-2H9a2 2 0 00-2 2v2"
            />
          </svg>

          {/* Item Count Badge */}
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-5 text-center leading-none">
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
