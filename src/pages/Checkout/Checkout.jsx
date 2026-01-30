import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaTruck,
  FaStore,
  FaMinus,
  FaPlus,
  FaTrash,
  FaInfoCircle,
  FaCheckCircle,
} from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";
import { useCheckout } from "../../hooks/pages";
import {
  ShippingInfoBanner,
  DeliveryLocationMap,
} from "../../components/checkout";
import {
  AddressRequiredModal,
  SelectAddressModal,
  SingleButtonConfirmationModal,
} from "../../components/common/modals";
import { getCartItemKey } from "../../utils/cartItemUtils";
import {
  createOrderSummary,
  hasDefaultAddress,
} from "../../services/orders/orderService";
import { formatPrice } from "../../services/cart/cartModalService";
import { showCustomToast } from "../../services/ui/toastService.jsx";
import { notifyCart } from "../../services/ui/notificationService";

const Checkout = () => {
  const navigate = useNavigate();
  const [showSelectAddressModal, setShowSelectAddressModal] = useState(false);
  const [showShippingInfoModal, setShowShippingInfoModal] = useState(false);
  const [selectedShippingAddress, setSelectedShippingAddress] = useState(null);
  const {
    userProfile,
    profileLoading,
    items,
    total,
    updateQuantity,
    removeItem,
    deliveryMethod,
    shippingCost,
    calculatingShipping,
    shippingError,
    handleDeliveryMethodChange,
    recalculateShippingWithAddress,
    showAddressModal,
    setShowAddressModal,
    handleAddressAdded,
    handlePayClick,
    loading,
    error,
    loadingOrder,
    showOrderConfirmModal,
    setShowOrderConfirmModal,
    handleOrderConfirmation,
    createdOrder,
  } = useCheckout();

  // Redirect to cart if empty
  React.useEffect(() => {
    if (!items || items.length === 0) {
      navigate("/");
    }
  }, [items, navigate]);

  // Handle address selection from modal
  const handleAddressSelected = async (selectedAddress) => {
    try {
      // If it's a new address (doesn't have an ID), add it to profile
      if (!selectedAddress.id) {
        const addedAddressWithId = await handleAddressAdded(selectedAddress);
        // Use the address with the generated ID for shipping
        setSelectedShippingAddress(addedAddressWithId);
        recalculateShippingWithAddress(addedAddressWithId);
      } else {
        // If it's an existing address, use it for this checkout (don't change default)
        setSelectedShippingAddress(selectedAddress);
        recalculateShippingWithAddress(selectedAddress);
      }
      setShowSelectAddressModal(false);
    } catch (err) {
      console.error("Error selecting address:", err);
    }
  };

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
    <div className="min-h-screen py-4 sm:py-6 md:py-8 bg-white">
      {/* Shipping Info Modal - appears when navigating to checkout */}
      <ShippingInfoBanner
        isOpen={showShippingInfoModal}
        setIsOpen={setShowShippingInfoModal}
      />

      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <button
            onClick={() => navigate("/productos")}
            className="flex items-center gap-2 text-blue-2 hover:text-gold transition-colors text-sm md:text-base"
          >
            <FaArrowLeft size={18} className="md:w-5 md:h-5" />
            <span className="font-family-sora">Volver</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold font-family-comfortaa text-blue-1">
            Resumen del Pedido
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* Products Section */}
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6 border border-gray-2">
              <h2 className="text-lg md:text-xl font-bold font-family-comfortaa text-blue-1 mb-3 md:mb-4">
                Productos
              </h2>
              <div className="space-y-3 md:space-y-4">
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
                          className="w-20 h-20 object-cover rounded shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-blue-1 font-family-sora line-clamp-1">
                          {name}
                        </h3>
                        {type && (
                          <p className="text-sm text-blue-2">Tamaño: {type}</p>
                        )}
                        {item.family && (
                          <p className="text-sm text-blue-2">
                            Familia: {String(item.family || "")}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-3 flex-wrap">
                        {/* Delete Button */}
                        <button
                          onClick={() => {
                            const itemKey = getCartItemKey(id, type);
                            removeItem(itemKey);
                            notifyCart.productRemoved(product.name);
                          }}
                          className="text-gold hover:text-red-500 p-1 transition-all duration-300"
                          title="Eliminar"
                        >
                          <FaTrash size={12} />
                        </button>
                        {/* Controls */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              const itemKey = getCartItemKey(id, type);
                              if (quantity > 1) {
                                updateQuantity(itemKey, quantity - 1);
                              }
                            }}
                            className="text-blue-1 hover:text-gold p-1 transition-all duration-300"
                            title="Menos"
                          >
                            <FaMinus size={12} />
                          </button>
                          <span className="text-sm font-bold text-blue-1 min-w-6 text-center">
                            {quantity}
                          </span>
                          <button
                            onClick={() => {
                              const itemKey = getCartItemKey(id, type);
                              updateQuantity(itemKey, quantity + 1);
                            }}
                            className="text-blue-1 hover:text-gold p-1 transition-all duration-300"
                            title="Más"
                          >
                            <FaPlus size={12} />
                          </button>
                        </div>
                      </div>
                      <div className="text-right min-w-20">
                        <p className="text-xs text-blue-2 mb-1">
                          ${formatPrice(price)}
                        </p>
                        <p className="font-bold text-gold font-family-comfortaa text-sm">
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
                  <div className="flex items-center gap-2">
                    {deliveryMethod === "pickup" ? (
                      <span className="text-gold font-semibold">Sin cargo</span>
                    ) : deliveryMethod === "shipping" && calculatingShipping ? (
                      <>
                        <ImSpinner2 className="animate-spin h-4 w-4" />
                        <span className="text-xs">Calculando...</span>
                      </>
                    ) : deliveryMethod === "shipping" && shippingError ? (
                      <span className="text-xs text-red-500">
                        {shippingError}
                      </span>
                    ) : deliveryMethod === "shipping" &&
                      orderSummary.subtotal >= 80000 ? (
                      <span className="text-gold font-semibold">¡Gratis!</span>
                    ) : (
                      <span>${formatPrice(shippingCost)}</span>
                    )}
                  </div>
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
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors gap-3 ${
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
                    className="shrink-0"
                  />
                  <div className="flex items-center gap-3 flex-1">
                    <FaTruck className="text-blue-2 text-xl shrink-0" />
                    <div className="min-w-0">
                      <p className="font-bold text-blue-1 font-family-sora text-base">
                        Envío a domicilio
                      </p>
                      <p className="text-sm text-blue-2 line-clamp-2">
                        Gratis en pedidos mayores a $80.000
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setShowShippingInfoModal(true);
                    }}
                    className="text-blue-2 hover:text-gold transition-colors p-2 cursor-pointer shrink-0"
                    title="Info"
                  >
                    <FaInfoCircle className="h-5 w-5" />
                  </button>
                </label>

                {/* Pickup Option */}
                <label
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors gap-3 ${
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
                    className="shrink-0"
                  />
                  <div className="flex items-center gap-3 flex-1">
                    <FaStore className="text-blue-2 text-xl shrink-0" />
                    <div className="min-w-0">
                      <p className="font-bold text-blue-1 font-family-sora text-base">
                        Retiro en local
                      </p>
                      <p className="text-sm text-blue-2 line-clamp-2">
                        Retira tu pedido sin cargo
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
                  {userProfile &&
                  (hasDefaultAddress(userProfile) ||
                    selectedShippingAddress) ? (
                    <>
                      <div className="bg-white p-4 rounded-lg text-sm text-blue-2 space-y-1 border border-gray-2 mb-4">
                        {(() => {
                          const addressToShow =
                            selectedShippingAddress ||
                            userProfile.addresses.find(
                              (addr) => addr.isDefault,
                            );

                          return (
                            <div>
                              <p className="font-bold text-xl text-blue-1">
                                {addressToShow.street} {addressToShow.number}
                              </p>
                              <p>
                                {addressToShow.apartment
                                  ? ` ${addressToShow.apartment}`
                                  : ""}
                              </p>
                              <p>
                                {addressToShow.city}, {addressToShow.region}
                              </p>
                              <p>CP: {addressToShow.postalCode}</p>
                              <p className="mt-2 text-xs">
                                {addressToShow.recipientName}
                              </p>
                              <p className=" text-xs">
                                Tel: {addressToShow.recipientPhone}
                              </p>
                            </div>
                          );
                        })()}
                      </div>

                      {/* Mapa de entrega */}
                      {(() => {
                        const addressToShow =
                          selectedShippingAddress ||
                          userProfile.addresses.find((addr) => addr.isDefault);
                        return (
                          <DeliveryLocationMap
                            clientAddress={addressToShow}
                            deliveryMethod="shipping"
                          />
                        );
                      })()}

                      <button
                        onClick={() => setShowSelectAddressModal(true)}
                        className="w-full mt-3 py-2 px-4 bg-blue-2 text-white rounded-lg font-family-sora hover:bg-blue-1 transition-colors"
                      >
                        Cambiar Dirección
                      </button>
                    </>
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
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border border-gray-2 space-y-2">
                    <h3 className="font-bold text-blue-1 font-family-sora">
                      Aluna - Punto de Retiro
                    </h3>
                    <p className="text-sm text-blue-2">
                      <strong>Dirección:</strong>{" "}
                      <a
                        href="https://www.google.com/maps/place/Pje.+Beethoven+3590,+C1431+Cdad.+Aut%C3%B3noma+de+Buenos+Aires/@-34.5657891,-58.503354,17z/data=!3m1!4b1!4m6!3m5!1s0x95bcb6fbc88e33a3:0x992ce3839f477b11!8m2!3d-34.5657935!4d-58.5007791!16s%2Fg%2F11fy_f0k39?entry=ttu&g_ep=EgoyMDI2MDEyMS4wIKXMDSoASAFQAw%3D%3D"
                        target="_blank"
                        className="text-gold font-medium hover:text-blue-3 transition-all"
                      >
                        Beethoven 3590
                      </a>
                    </p>
                    <p className="text-sm text-blue-2">
                      Podrás retirar tu pedido en nuestro local sin cargo.
                    </p>
                  </div>

                  {/* Mapa de retiro */}
                  <DeliveryLocationMap
                    clientAddress={null}
                    deliveryMethod="pickup"
                  />
                </div>
              )}
            </div>

            {/* Pay Button */}
            <button
              onClick={() => handlePayClick(selectedShippingAddress)}
              disabled={
                loadingOrder ||
                loading ||
                (deliveryMethod === "shipping" &&
                  !selectedShippingAddress &&
                  userProfile &&
                  !hasDefaultAddress(userProfile))
              }
              className="w-full bg-gold text-white font-bold font-family-sora py-2 md:py-3 text-sm md:text-base rounded-lg hover:bg-blue-2 hover:scale-105 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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

      {/* Select Address Modal */}
      <SelectAddressModal
        isOpen={showSelectAddressModal}
        onClose={() => setShowSelectAddressModal(false)}
        onAddressSelected={handleAddressSelected}
        addresses={userProfile?.addresses || []}
        currentAddress={
          selectedShippingAddress ||
          userProfile?.addresses?.find((addr) => addr.isDefault) ||
          null
        }
        isLoading={loading}
      />

      {/* Order Confirmation Modal */}
      <SingleButtonConfirmationModal
        isOpen={showOrderConfirmModal}
        title="Gracias por elegirnos para transformar tu espacio."
        message="Tu pedido ha sido realizado exitosamente"
        description={
          createdOrder
            ? `Número de orden: ${createdOrder.orderNumber}`
            : "Procesando orden..."
        }
        onConfirm={handleOrderConfirmation}
        confirmText="Ir al Inicio"
        icon={<FaCheckCircle />}
        isLoading={false}
      />
    </div>
  );
};

export default Checkout;
