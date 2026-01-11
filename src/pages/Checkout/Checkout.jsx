import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaTruck,
  FaStore,
  FaMinus,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";
import { useCheckout } from "../../hooks/pages";
import { AddressRequiredModal } from "../../components/common/modals";
import { getCartItemKey } from "../../utils/cartItemUtils";
import {
  createOrderSummary,
  hasDefaultAddress,
} from "../../services/orders/orderService";
import { formatPrice } from "../../services/cart/cartModalService";
import { showCustomToast } from "../../services/ui/toastService.jsx";

const Checkout = () => {
  const navigate = useNavigate();
  const {
    userProfile,
    profileLoading,
    items,
    total,
    updateQuantity,
    removeItem,
    deliveryMethod,
    shippingCost,
    handleDeliveryMethodChange,
    showAddressModal,
    setShowAddressModal,
    handleAddressAdded,
    handlePayClick,
    loading,
    error,
    loadingOrder,
  } = useCheckout();

  // Redirect to cart if empty
  React.useEffect(() => {
    if (!items || items.length === 0) {
      navigate("/");
    }
  }, [items, navigate]);

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <ImSpinner2 className="animate-spin h-12 w-12 text-blue-2 mx-auto" />
          <p className="mt-4 text-blue-2 font-family-sora">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return null;
  }

  const orderSummary = createOrderSummary(items, shippingCost);

  return (
    <div className="min-h-screen py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={() => navigate("/productos")}
            className="flex items-center gap-2 text-blue-2 hover:text-gold transition-colors"
          >
            <FaArrowLeft size={20} />
            <span className="font-family-sora">Volver</span>
          </button>
          <h1 className="text-3xl font-bold font-family-comfortaa text-blue-1">
            Resumen del Pedido
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Products Section */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-2">
              <h2 className="text-xl font-bold font-family-comfortaa text-blue-1 mb-4">
                Productos
              </h2>
              <div className="space-y-4">
                {items.map((item, idx) => {
                  // Ensure all values are primitives
                  const id = String(item.id || idx);
                  const name = String(item.name || "Producto");
                  const type = String(item.type || "");
                  const price =
                    typeof item.price === "number"
                      ? item.price
                      : parseFloat(item.price) || 0;
                  const quantity =
                    typeof item.quantity === "number"
                      ? item.quantity
                      : parseInt(item.quantity) || 1;
                  const itemTotal = price * quantity;

                  return (
                    <div
                      key={`${id}-${type}-${idx}`}
                      className="flex items-center gap-4 pb-4 border-b border-gray-2 last:border-b-0"
                    >
                      {item.image && (
                        <img
                          src={String(item.image)}
                          alt={name}
                          className="w-20 h-20 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-bold text-blue-1 font-family-sora">
                          {name}
                        </h3>
                        {type && (
                          <p className="text-sm text-blue-2">Tipo: {type}</p>
                        )}
                        {item.family && (
                          <p className="text-sm text-blue-2">
                            Familia: {String(item.family || "")}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        {/* Controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              const itemKey = getCartItemKey(id, type);
                              if (quantity > 1) {
                                updateQuantity(itemKey, quantity - 1);
                              }
                            }}
                            className="text-blue-1 hover:bg-gold hover:text-black rounded-full p-2 transition-all duration-300"
                            title="Disminuir cantidad"
                          >
                            <FaMinus size={14} />
                          </button>
                          <span className="text-lg font-bold text-blue-1 min-w-8 text-center">
                            {quantity}
                          </span>
                          <button
                            onClick={() => {
                              const itemKey = getCartItemKey(id, type);
                              updateQuantity(itemKey, quantity + 1);
                            }}
                            className="text-blue-1 hover:bg-gold hover:text-black rounded-full p-2 transition-all duration-300"
                            title="Aumentar cantidad"
                          >
                            <FaPlus size={14} />
                          </button>
                        </div>

                        {/* Delete Button */}
                        <button
                          onClick={() => {
                            const itemKey = getCartItemKey(id, type);
                            removeItem(itemKey);
                            showCustomToast.info(
                              "Producto eliminado del carrito"
                            );
                          }}
                          className="text-gold hover:text-red-500 hover:bg-gray-2 rounded-full p-2 transition-all duration-300"
                          title="Eliminar producto"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                      <div className="text-right min-w-24">
                        <p className="text-sm text-blue-2 mb-1">
                          ${formatPrice(price)}
                        </p>
                        <p className="font-bold text-gold font-family-comfortaa">
                          ${formatPrice(itemTotal)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Totals */}
              <div className="mt-6 pt-4 border-t border-gray-2 space-y-2">
                <div className="flex justify-between text-blue-2">
                  <span>Subtotal:</span>
                  <span>${formatPrice(orderSummary.subtotal)}</span>
                </div>
                <div className="flex justify-between text-blue-2">
                  <span>Envío:</span>
                  <span>${formatPrice(orderSummary.shipping)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gold font-family-comfortaa">
                  <span>Total:</span>
                  <span>${formatPrice(orderSummary.total)}</span>
                </div>
              </div>
            </div>

            {/* Delivery Method Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold font-family-comfortaa text-blue-1 mb-4">
                Método de Entrega
              </h2>
              <div className="space-y-3">
                {/* Shipping Option */}
                <label
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    deliveryMethod === "shipping"
                      ? "border-gold"
                      : "border-gray-2 hover:border-gold"
                  }`}
                >
                  <input
                    type="radio"
                    name="delivery"
                    value="shipping"
                    checked={deliveryMethod === "shipping"}
                    onChange={(e) => handleDeliveryMethodChange(e.target.value)}
                    className="mr-4"
                  />
                  <div className="flex items-center gap-3 flex-1">
                    <FaTruck className="text-blue-2 text-xl" />
                    <div>
                      <p className="font-bold text-blue-1 font-family-sora">
                        Envío a domicilio
                      </p>
                      <p className="text-sm text-blue-2">
                        Envío gratis en pedidos mayores a $70000
                      </p>
                    </div>
                  </div>
                </label>

                {/* Pickup Option */}
                <label
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    deliveryMethod === "pickup"
                      ? "border-gold"
                      : "border-gray-2 hover:border-gold"
                  }`}
                >
                  <input
                    type="radio"
                    name="delivery"
                    value="pickup"
                    checked={deliveryMethod === "pickup"}
                    onChange={(e) => handleDeliveryMethodChange(e.target.value)}
                    className="mr-4"
                  />
                  <div className="flex items-center gap-3 flex-1">
                    <FaStore className="text-blue-2 text-xl" />
                    <div>
                      <p className="font-bold text-blue-1 font-family-sora">
                        Retiro en local
                      </p>
                      <p className="text-sm text-blue-2">
                        Retira tu pedido en nuestro local sin cargo
                      </p>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Sidebar - Right Side */}
          <div className="space-y-6">
            {/* Address Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-bold font-family-comfortaa text-blue-1 mb-4">
                Dirección de Entrega
              </h2>

              {deliveryMethod === "shipping" ? (
                <>
                  {userProfile && hasDefaultAddress(userProfile) ? (
                    <div className="bg-white p-4 rounded-lg text-sm text-blue-2 space-y-1 border border-gray-2">
                      {userProfile.addresses
                        .filter((addr) => addr.isDefault)
                        .map((addr, idx) => (
                          <div key={idx}>
                            <p className="font-bold text-xl text-blue-1">
                              {addr.street} {addr.number}
                            </p>
                            <p>{addr.apartment ? ` ${addr.apartment}` : ""}</p>
                            <p>
                              {addr.city}, {addr.region}
                            </p>
                            <p>CP: {addr.postalCode}</p>
                            <p className="mt-2 text-xs">{addr.recipientName}</p>
                            <p className=" text-xs">
                              Tel: {addr.recipientPhone}
                            </p>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-lg border border-gold bg-white">
                      <p className="text-sm text-blue-2 mb-3">
                        No tienes una dirección cargada. Por favor agrega una
                        para poder enviar tu pedido.
                      </p>
                      <button
                        onClick={() => setShowAddressModal(true)}
                        className="w-full bg-gold text-black px-4 py-2 rounded-lg font-family-sora hover:bg-blue-2 hover:text-white transition-colors"
                      >
                        Agregar Dirección
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-white p-4 rounded-lg border border-gray-2">
                  <p className="text-sm text-blue-1 font-family-sora">
                    Tu pedido será retirado en nuestro local.
                  </p>
                </div>
              )}
            </div>

            {/* Pay Button */}
            <button
              onClick={handlePayClick}
              disabled={
                loadingOrder ||
                loading ||
                (deliveryMethod === "shipping" &&
                  userProfile &&
                  !hasDefaultAddress(userProfile))
              }
              className="w-full bg-gold text-white font-bold font-family-sora py-3 rounded-lg hover:bg-blue-2  hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingOrder || loading ? "Procesando..." : "Pagar"}
            </button>

            {error && (
              <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Address Required Modal */}
      <AddressRequiredModal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        onAddressAdded={handleAddressAdded}
        isLoading={loading}
      />
    </div>
  );
};

export default Checkout;
