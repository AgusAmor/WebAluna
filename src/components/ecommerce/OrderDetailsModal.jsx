import React from "react";
import { IoIosClose } from "react-icons/io";
import { formatDateTime } from "../../utils/dateFormatter";
import { ORDER_STATUS } from "../../constants";

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

  const getStatusColor = (status) => {
    switch (status) {
      case ORDER_STATUS.PENDING:
        return "bg-yellow-100 text-yellow-700";
      case ORDER_STATUS.CONFIRMED:
        return "bg-blue-100 text-blue-700";
      case ORDER_STATUS.PRINTING:
        return "bg-orange-100 text-orange-700";
      case ORDER_STATUS.DISPATCHED:
        return "bg-purple-100 text-purple-700";
      case ORDER_STATUS.DELIVERED:
        return "bg-green-100 text-green-700";
      case ORDER_STATUS.WITHDRAWN:
        return "bg-green-100 text-green-700";
      case ORDER_STATUS.CANCELLED:
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      [ORDER_STATUS.PENDING]: "Pendiente",
      [ORDER_STATUS.CONFIRMED]: "Confirmado",
      [ORDER_STATUS.PRINTING]: "Imprimiendo",
      [ORDER_STATUS.DISPATCHED]: "Despachado",
      [ORDER_STATUS.DELIVERED]: "Entregado",
      [ORDER_STATUS.WITHDRAWN]: "Retirado",
      [ORDER_STATUS.CANCELLED]: "Cancelado",
    };
    return statusMap[status] || status;
  };

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
            <div className="flex items-center justify-between pr-8">
              <h2 className="text-2xl font-bold font-family-comfortaa text-blue-2">
                Detalles del Pedido
              </h2>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${getStatusColor(
                  order.status,
                )}`}
              >
                {getStatusLabel(order.status)}
              </span>
            </div>
            <p className="text-lg text-gold font-bold mt-3">
              #{order.orderNumber || order.id?.slice(-8)}
            </p>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-1 uppercase tracking-wide block mb-2">
                  Fecha de Pedido
                </label>
                <p className="text-sm text-blue-1 font-medium">
                  {formatDateTime(order.createdAt)}
                </p>
              </div>
              {order.updatedAt && (
                <div>
                  <label className="text-xs font-semibold text-gray-1 uppercase tracking-wide block mb-2">
                    Última Actualización
                  </label>
                  <p className="text-sm text-blue-1 font-medium">
                    {formatDateTime(order.updatedAt)}
                  </p>
                </div>
              )}
            </div>

            {/* Products */}
            <div>
              <label className="text-xs font-semibold text-gray-1 uppercase tracking-wide block mb-3">
                Productos ({order.items?.length || 0})
              </label>
              <div className="space-y-3">
                {order.items && order.items.length > 0 ? (
                  order.items.map((item, index) => (
                    <div
                      key={index}
                      className="p-4 bg-white rounded-lg border border-gray-3"
                    >
                      <div className="flex justify-between mb-2">
                        <p className="font-bold text-blue-1">
                          {item.productName}
                        </p>
                        <p className="font-bold text-gold">
                          ${item.unitPrice || "0"}
                        </p>
                      </div>
                      <div className="text-xs text-gray-1 space-y-1">
                        {item.family && <p>Familia: {item.family}</p>}
                        {item.size && <p>Tamaño: {item.size}</p>}
                        {item.quantity && (
                          <p className="font-medium text-blue-1">
                            Cantidad: {item.quantity}
                          </p>
                        )}
                        <p className="text-blue-2 font-semibold pt-1 border-t border-gray-3 mt-2">
                          Subtotal: ${item.unitPrice * item.quantity || "0"}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-1">
                    Sin productos registrados
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
