import React from "react";
import { ImSpinner2 } from "react-icons/im";
import { IoIosClose } from "react-icons/io";
import { formatDate } from "../../../utils/dateFormatter";
import { ORDER_STATUS } from "../../../constants";
import { OrderStatusBadge } from "../../../components/ecommerce";

/**
 * OrderDetailsModal Component
 * Displays order details and allows status changes
 */
const OrderDetailsModal = ({
  isOpen,
  selectedOrder,
  selectedStatus,
  updatingId,
  onClose,
  onStatusChange,
}) => {
  if (!isOpen || !selectedOrder) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="bg-white rounded-xl shadow-lg w-full max-w-2xl min-w-[350px] relative flex flex-col animate-fadeInScale max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 text-blue-2 hover:text-gold transition-colors z-10"
          onClick={onClose}
          aria-label="Close"
        >
          <IoIosClose size={24} />
        </button>

        <h2 className="text-2xl font-bold text-blue-1 font-family-comfortaa mb-4 px-8 pt-8 shrink-0">
          Detalles del Pedido
        </h2>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-8 space-y-4">
          {/* Header Info */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="font-bold text-blue-2 font-family-sora text-xs uppercase tracking-wide block mb-2">
                Número de Pedido
              </label>
              <p className="text-lg text-gold font-bold">
                #{selectedOrder.orderNumber || selectedOrder.id?.slice(-8)}
              </p>
            </div>
            <div>
              <label className="font-bold text-blue-2 font-family-sora text-xs uppercase tracking-wide block mb-2">
                Fecha de Emisión
              </label>
              <p className="text-sm text-blue-1">
                {selectedOrder.createdAt
                  ? formatDate(selectedOrder.createdAt)
                  : "N/A"}
              </p>
            </div>
            <div>
              <label className="font-bold text-blue-2 font-family-sora text-xs uppercase tracking-wide block mb-2">
                Estado
              </label>
              <div className="flex-col gap-1">
                <OrderStatusBadge status={selectedOrder.status} />
                {selectedOrder.statusHistory &&
                  selectedOrder.statusHistory.length > 0 && (
                    <p className="text-xs text-gray-1 mt-1">
                      Actualizado{" "}
                      {formatDate(
                        selectedOrder.statusHistory[
                          selectedOrder.statusHistory.length - 1
                        ].timestamp,
                      )}
                    </p>
                  )}
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-white border border-gray-3 rounded-lg p-4">
            <h3 className="font-bold text-blue-2 font-family-sora text-sm mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-gold rounded-full"></span>
              Información del Cliente
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-gray-1 text-xs uppercase tracking-wide block mb-1">
                  Usuario
                </label>
                <p className="text-blue-1 font-medium">
                  {selectedOrder.userName}
                </p>
              </div>
              <div>
                <label className="font-semibold text-gray-1 text-xs uppercase tracking-wide block mb-1">
                  Email
                </label>
                <p className="text-blue-1 text-sm">
                  {selectedOrder.userEmail || "-"}
                </p>
              </div>
              <div className="col-span-2">
                <label className="font-semibold text-gray-1 text-xs uppercase tracking-wide block mb-1">
                  Teléfono
                </label>
                <p className="text-blue-1">{selectedOrder.userPhone || "-"}</p>
              </div>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="bg-white border border-gray-3 rounded-lg p-4">
            <h3 className="font-bold text-blue-2 font-family-sora text-sm mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-gold rounded-full"></span>
              Información de Entrega
            </h3>
            <div className="space-y-3">
              <div>
                <label className="font-semibold text-gray-1 text-xs uppercase tracking-wide block mb-1">
                  Tipo de Entrega
                </label>
                <p className="text-blue-1 font-medium">
                  {selectedOrder.deliveryType === "pickup"
                    ? "Retiro en local"
                    : "Envío a domicilio"}
                </p>
              </div>
              {selectedOrder.deliveryType !== "pickup" &&
                selectedOrder.deliveryAddress && (
                  <div>
                    <label className="font-semibold text-gray-1 text-xs uppercase tracking-wide block mb-1">
                      Dirección de Entrega
                    </label>
                    <p className="text-blue-1 text-sm">
                      {selectedOrder.deliveryAddress}
                    </p>
                  </div>
                )}
              {(selectedOrder.shipping !== undefined ||
                selectedOrder.summary?.shipping !== undefined) && (
                <div>
                  <label className="font-semibold text-gray-1 text-xs uppercase tracking-wide block mb-1">
                    Costo de Envío
                  </label>
                  <p className="text-gold font-bold">
                    $
                    {selectedOrder.shipping ??
                      selectedOrder.summary?.shipping ??
                      "0"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-7">
            <label className="font-bold text-black font-family-sora text-sm block mb-2">
              Productos ({selectedOrder.items?.length || 0})
            </label>
            <div className="bg-white rounded-md border border-gray-3 p-4">
              {selectedOrder.items && selectedOrder.items.length > 0 ? (
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => {
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
        </div>

        {/* Fixed Footer */}
        <div className="flex flex-col gap-4 p-6 border-t border-gray-2 shrink-0">
          {/* Order Summary */}
          <div className="bg-white rounded-lg">
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-1 font-medium">Subtotal:</span>
                <span className="text-blue-1 font-bold">
                  $
                  {selectedOrder.subtotal ??
                    selectedOrder.summary?.subtotal ??
                    "0"}
                </span>
              </div>
              {(selectedOrder.shipping !== undefined ||
                selectedOrder.summary?.shipping !== undefined) && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-1 font-medium">Envío:</span>
                  <span className="text-blue-1 font-bold">
                    $
                    {selectedOrder.shipping ??
                      selectedOrder.summary?.shipping ??
                      "0"}
                  </span>
                </div>
              )}
              <div className="flex justify-between border-t border-blue-1/20 pt-2 mt-2">
                <span className="font-bold text-blue-2">Total:</span>
                <span className="text-xl text-gold font-bold">
                  $
                  {selectedOrder.totalAmount ??
                    selectedOrder.summary?.total ??
                    "0"}
                </span>
              </div>
            </div>
          </div>

          {/* Status Selection and Buttons */}
          <div className="flex gap-3 border-t border-gray-3 pt-4">
            <div className="flex-1">
              <label className="font-bold text-blue-2 font-family-sora text-xs uppercase tracking-wide block mb-2">
                Cambiar Estado
              </label>
              <select
                value={selectedStatus || ""}
                onChange={(e) => onStatusChange(e.target.value)}
                disabled={updatingId === selectedOrder.id}
                className={`w-full px-3 py-2 rounded-lg border border-gray-2 focus:outline-none focus:border-gold transition-colors font-family-sora text-sm ${
                  updatingId === selectedOrder.id
                    ? "bg-gray-100 cursor-not-allowed opacity-60"
                    : "bg-white hover:border-gold"
                }`}
              >
                <option value="">-- Seleccionar estado --</option>
                <option value={ORDER_STATUS.PENDING}>Pendiente</option>
                <option value={ORDER_STATUS.CONFIRMED}>Confirmado</option>
                <option value={ORDER_STATUS.PRINTING}>Imprimiendo</option>
                <option value={ORDER_STATUS.DISPATCHED}>Despachado</option>
                <option value={ORDER_STATUS.DELIVERED}>Entregado</option>
                <option value={ORDER_STATUS.WITHDRAWN}>Retirado</option>
                <option value={ORDER_STATUS.CANCELLED}>Cancelado</option>
              </select>
            </div>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-2 text-gray-1 font-bold px-4 py-2 rounded-lg hover:bg-gray-1 hover:text-white transition-colors font-family-sora text-sm self-end"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
