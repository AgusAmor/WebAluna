import React from "react";
import { IoIosClose } from "react-icons/io";
import { formatDate } from "../../utils/dateFormatter";
import { ORDER_STATUS } from "../../constants";
import { OrderStatusBadge } from "./index";
import { useModalScroll } from "../../hooks/ui";

/**
 * OrderDetailsModal Component
 * Displays detailed information about a specific order
 *
 * @param {boolean} isOpen - Whether modal is open
 * @param {Object} order - Order object with full details
 * @param {Function} onClose - Callback when modal is closed
 * @param {Function} onCancel - Callback when user wants to cancel the order
 */
const OrderDetailsModal = ({ isOpen, order, onClose, onCancel }) => {
  useModalScroll(isOpen);

  if (!isOpen || !order) return null;

  const canCancel =
    order.status === ORDER_STATUS.PENDING ||
    order.status === ORDER_STATUS.CONFIRMED;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-family-sora">
      {/* Backdrop */}
      <div
        className="fixed inset-0 backdrop-blur-sm"
        style={{ backgroundColor: "rgba(38,78,96,0.45)" }}
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-screen items-center justify-center p-3 sm:p-4">
        <div
          className="relative bg-white rounded-lg sm:rounded-xl shadow-xl max-w-3xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden animate-fadeInScale flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button - Absolute positioned */}
          <button
            className="absolute top-3 right-3 cursor-pointer text-gray-3 hover:text-gold hover:scale-150 transition-all z-10"
            onClick={onClose}
            aria-label="Close"
          >
            <IoIosClose size={26} />
          </button>

          {/* Badge positioned left of close button - Mobile only */}
          <div className="absolute top-3 right-12 z-10 md:hidden">
            <OrderStatusBadge status={order.status} />
          </div>

          {/* Header */}
          <div className="py-4 px-5 sm:py-6 sm:px-8 border-b border-gray-2 shrink-0 bg-blue-2">
            <h2 className="text-lg sm:text-2xl font-bold font-family-comfortaa text-white">
              Detalles del Pedido
            </h2>
            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-base sm:text-lg text-gold font-bold">
                    #{order.orderNumber || order.id?.slice(-8)}
                  </p>
                  <div className="hidden md:block">
                    <OrderStatusBadge status={order.status} />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-blue-3 flex-wrap">
                  <span>Emitido {formatDate(order.createdAt)}</span>
                  {order.statusHistory && order.statusHistory.length > 0 && (
                    <span>
                      • Actualizado{" "}
                      {formatDate(
                        order.statusHistory[order.statusHistory.length - 1]
                          .timestamp,
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-5 sm:px-8 py-5 sm:py-8 space-y-6">
            {/* Products */}
            <div>
              <label className="text-xs font-semibold text-blue-1 uppercase tracking-wide block mb-4 font-family-sora">
                Productos ({order.items?.length || 0})
              </label>
              <div className="bg-blue-2/20 rounded-lg border-l-4 border-gold p-5">
                {order.items && order.items.length > 0 ? (
                  <div className="space-y-3">
                    {order.items.map((item, index) => {
                      const unitPrice = item.unitPrice || 0;
                      const quantity = item.quantity || 1;
                      const subtotal = unitPrice * quantity;

                      return (
                        <div
                          key={index}
                          className="bg-white rounded-lg p-4 flex justify-between items-center gap-3"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-blue-1 text-sm sm:text-base truncate">
                              {item.productName}
                            </p>
                            <p className="text-xs text-blue-2 font-medium">
                              Tamaño: {item.size || "normal"}
                            </p>
                            <p className="text-xs text-blue-3 font-medium mt-1">
                              ${unitPrice.toFixed(2)} x {quantity}
                            </p>
                          </div>
                          <span className="font-bold text-gold text-sm sm:text-base shrink-0">
                            ${subtotal.toFixed(2)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-blue-2 text-sm">
                    No hay productos en este pedido
                  </p>
                )}
              </div>
            </div>

            {/* Delivery Information */}
            {order.delivery && (
              <div>
                <label className="text-xs font-semibold text-blue-2 uppercase tracking-wide block mb-4">
                  Información de Entrega
                </label>
                <div className="p-5 bg-blue-3/20 rounded-lg border-l-4 border-gold">
                  <div className="flex items-center justify-between mb-2 gap-2">
                    <p className="text-xs sm:text-sm font-medium text-blue-1">
                      {order.delivery.method === "shipping"
                        ? "Envío a domicilio"
                        : "Retiro en local"}
                    </p>
                    {order.delivery.method === "shipping" &&
                      (order.shipping !== undefined ||
                        order.summary?.shipping !== undefined) && (
                        <p className="text-sm sm:text-base font-semibold text-gold shrink-0">
                          ${order.shipping ?? order.summary?.shipping ?? "0"}
                        </p>
                      )}
                  </div>
                  {order.delivery.shippingAddress && (
                    <p className="text-sm sm:text-base text-blue-2 font-bold wrap-break-word">
                      {order.delivery.shippingAddress.street}{" "}
                      {order.delivery.shippingAddress.number} ·{" "}
                      {order.delivery.shippingAddress.region}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="bg-blue-3/10 border-t border-gold rounded-lg p-5 sm:p-6 shrink-0">
            <div className="space-y-2">
              {(order.subtotal !== undefined ||
                order.summary?.subtotal !== undefined) && (
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-blue-2">Subtotal:</span>
                  <span className="font-medium text-blue-1">
                    ${order.subtotal ?? order.summary?.subtotal ?? "0"}
                  </span>
                </div>
              )}
              {(order.shipping !== undefined ||
                order.summary?.shipping !== undefined) && (
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-blue-2">Envío:</span>
                  <span className="font-medium text-gold">
                    ${order.shipping ?? order.summary?.shipping ?? "0"}
                  </span>
                </div>
              )}
              <div className="border-t border-blue-2 pt-2 sm:pt-3 mt-2 sm:mt-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-blue-2 text-sm sm:text-base">
                    Total:
                  </span>
                  <span className="font-bold text-xl sm:text-2xl text-gold">
                    ${order.totalAmount ?? order.summary?.total ?? "0"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer - Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 p-5 sm:p-6 border-t border-gray-3 shrink-0">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 sm:py-2 px-4 border-2 border-gray-2 rounded-lg text-gray-1 hover:bg-gold hover:text-white hover:border-gold transition-all font-semibold text-sm"
            >
              Cerrar
            </button>
            {canCancel && onCancel && (
              <button
                onClick={() => {
                  onCancel(order);
                  onClose();
                }}
                className="flex-1 py-2.5 sm:py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 hover:scale-105 transition-all font-semibold text-sm"
              >
                Cancelar Pedido
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
