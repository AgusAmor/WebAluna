import React from "react";
import { IoIosClose } from "react-icons/io";
import { formatDate } from "../../utils/dateFormatter";
import { ORDER_STATUS } from "../../constants";
import { OrderStatusBadge } from "./index";

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
  if (!isOpen || !order) return null;

  const canCancel =
    order.status === ORDER_STATUS.PENDING ||
    order.status === ORDER_STATUS.CONFIRMED;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-family-sora">
      {/* Backdrop */}
      <div
        className="fixed inset-0 backdrop-blur-sm"
        style={{ backgroundColor: "rgba(38,78,96,0.45)" }}
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-fadeInScale flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button - Absolute positioned */}
          <button
            className="absolute top-4 right-4 text-blue-2 hover:text-gold hover:scale-110 transition-all z-10"
            onClick={onClose}
            aria-label="Close"
          >
            <IoIosClose className="w-8 h-8" />
          </button>

          {/* Header */}
          <div className="py-5 px-6 border-b border-gray-2 shrink-0">
            <div className="flex items-start justify-between pr-8">
              <h2 className="text-2xl font-bold font-family-comfortaa text-blue-2">
                Detalles del Pedido
              </h2>
              <div className="flex flex-col items-end gap-1 relative">
                <OrderStatusBadge status={order.status} />
                {order.statusHistory && order.statusHistory.length > 0 && (
                  <p className="text-xs text-gray-1 absolute top-8 right-0 whitespace-nowrap">
                    Actualizado{" "}
                    {formatDate(
                      order.statusHistory[order.statusHistory.length - 1]
                        .timestamp,
                    )}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-start justify-between mt-1">
              <div className="flex flex-col gap-1">
                <p className="text-lg text-gold font-bold">
                  #{order.orderNumber || order.id?.slice(-8)}
                </p>
                <p className="text-xs text-gray-1">
                  Emitido {formatDate(order.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {/* Products */}
            <div>
              <label className="text-xs font-semibold text-gray-1 uppercase tracking-wide block mb-3">
                Productos ({order.items?.length || 0})
              </label>
              <div className="bg-white rounded-md border border-gray-3 p-4">
                {order.items && order.items.length > 0 ? (
                  <div className="space-y-3">
                    {order.items.map((item, index) => {
                      const unitPrice = item.unitPrice || 0;
                      const quantity = item.quantity || 1;
                      const subtotal = unitPrice * quantity;

                      return (
                        <div
                          key={index}
                          className="flex justify-between items-center text-sm pb-2 border-b border-gray-300 last:border-b-0"
                        >
                          <div className="flex-1">
                            <p className="font-bold text-blue-1">
                              {item.productName}
                            </p>
                            <p className="text-xs text-gray-1">
                              {item.family && `${item.family} - `}
                              Tamaño: {item.size || "normal"}
                            </p>
                            <p className="text-xs font-medium text-blue-3">
                              ${unitPrice.toFixed(2)} x {quantity}
                            </p>
                          </div>
                          <span className="font-bold text-gold ml-4">
                            ${subtotal.toFixed(2)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-1 text-sm">
                    No hay productos en este pedido
                  </p>
                )}
              </div>
            </div>

            {/* Delivery Information */}
            {order.delivery && (
              <div>
                <label className="text-xs font-semibold text-gray-1 uppercase tracking-wide block mb-3">
                  Información de Entrega
                </label>
                <div className="p-4 bg-white rounded-lg border border-gray-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-blue-1">
                      {order.delivery.method === "shipping"
                        ? "Envío a domicilio"
                        : "Retiro en local"}
                    </p>
                    {order.delivery.method === "shipping" &&
                      (order.shipping !== undefined ||
                        order.summary?.shipping !== undefined) && (
                        <p className="text-sm font-semibold text-gold">
                          ${order.shipping ?? order.summary?.shipping ?? "0"}
                        </p>
                      )}
                  </div>
                  {order.delivery.shippingAddress && (
                    <p className="text-xs text-gray-1">
                      {order.delivery.shippingAddress.street}{" "}
                      {order.delivery.shippingAddress.number} ·
                      {order.delivery.shippingAddress.region}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="bg-white border-t border-gray-2 rounded-lg p-4">
            <div className="space-y-1">
              {(order.subtotal !== undefined ||
                order.summary?.subtotal !== undefined) && (
                <div className="flex justify-between text-sm">
                  <span className="text-blue-2">Subtotal:</span>
                  <span className="font-medium text-blue-1">
                    ${order.subtotal ?? order.summary?.subtotal ?? "0"}
                  </span>
                </div>
              )}
              {(order.shipping !== undefined ||
                order.summary?.shipping !== undefined) && (
                <div className="flex justify-between text-sm">
                  <span className="text-blue-2">Envío:</span>
                  <span className="font-medium text-blue-1">
                    ${order.shipping ?? order.summary?.shipping ?? "0"}
                  </span>
                </div>
              )}
              <div className="flex justify-between border-t border-blue-1/20 pt-2 mt-2">
                <span className="font-bold text-blue-2">Total:</span>
                <span className="font-bold text-lg text-gold">
                  ${order.totalAmount ?? order.summary?.total ?? "0"}
                </span>
              </div>
            </div>
          </div>

          {/* Footer - Action Buttons */}
          <div className="flex gap-3 p-4 border-t border-gray-3 shrink-0">
            <button
              onClick={onClose}
              className="flex-1 py-2 px-4 border-2 border-gray-2 rounded-lg text-gray-1 hover:bg-gold hover:text-white hover:border-gold transition-all font-semibold text-sm"
            >
              Cerrar
            </button>
            {canCancel && onCancel && (
              <button
                onClick={() => {
                  onCancel(order);
                  onClose();
                }}
                className="flex-1 py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 hover:scale-105 transition-all font-semibold text-sm"
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
