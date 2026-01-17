import React from "react";
import { ImSpinner2 } from "react-icons/im";
import { IoIosClose } from "react-icons/io";
import { formatDateTime } from "../../../utils/dateFormatter";
import { ORDER_STATUS } from "../../../constants";

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
        className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl min-w-[350px] relative flex flex-col animate-fadeInScale max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 text-blue-2 hover:text-gold transition-colors"
          onClick={onClose}
          aria-label="Close"
        >
          <IoIosClose size={24} />
        </button>

        <h2 className="text-2xl font-bold text-blue-1 font-family-comfortaa mb-4">
          Detalles del Pedido
        </h2>

        {/* Order Details */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-black font-family-sora text-sm">
                Número de Pedido
              </label>
              <p className="text-blue-1 font-bold">
                {selectedOrder.orderNumber || selectedOrder.id}
              </p>
            </div>
            <div>
              <label className="font-bold text-black font-family-sora text-sm">
                Estado
              </label>
              <p className="text-blue-1 font-bold">{selectedOrder.status}</p>
            </div>
            <div>
              <label className="font-bold text-black font-family-sora text-sm">
                Usuario
              </label>
              <p className="text-blue-1 font-bold">{selectedOrder.userName}</p>
            </div>
            <div>
              <label className="font-bold text-black font-family-sora text-sm">
                Email
              </label>
              <p className="text-blue-1 text-xs">
                {selectedOrder.userEmail || "-"}
              </p>
            </div>
            <div>
              <label className="font-bold text-black font-family-sora text-sm">
                Teléfono
              </label>
              <p className="text-blue-1">{selectedOrder.userPhone || "-"}</p>
            </div>
            <div>
              <label className="font-bold text-black font-family-sora text-sm">
                Fecha
              </label>
              <p className="text-blue-1">
                {selectedOrder.createdAt
                  ? formatDateTime(selectedOrder.createdAt)
                  : "N/A"}
              </p>
            </div>
            <div>
              <label className="font-bold text-black font-family-sora text-sm">
                Tipo de Entrega
              </label>
              <p className="text-blue-1">
                {selectedOrder.deliveryType === "pickup"
                  ? "Recoger"
                  : "A Domicilio"}
              </p>
            </div>
            <div>
              <label className="font-bold text-black font-family-sora text-sm">
                Subtotal
              </label>
              <p className="text-blue-1 font-bold">
                ${selectedOrder.subtotal || "0"}
              </p>
            </div>
          </div>

          {/* Delivery Address */}
          {selectedOrder.deliveryType !== "pickup" &&
            selectedOrder.deliveryAddress && (
              <div>
                <label className="font-bold text-black font-family-sora text-sm">
                  Dirección de Entrega
                </label>
                <p className="text-blue-1">{selectedOrder.deliveryAddress}</p>
              </div>
            )}

          {/* Shipping Cost */}
          {selectedOrder.shipping > 0 && (
            <div>
              <label className="font-bold text-black font-family-sora text-sm">
                Costo de Envío
              </label>
              <p className="text-blue-1 font-bold">${selectedOrder.shipping}</p>
            </div>
          )}

          {/* Order Items */}
          <div className="mt-6">
            <label className="font-bold text-black font-family-sora text-sm block mb-2">
              Productos ({selectedOrder.items?.length || 0})
            </label>
            <div className="bg-gray-50 rounded p-4">
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
                          <p className="text-xs text-gray-1">
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

        <div className="pt-4">
          <label className="font-bold text-black font-family-sora text-sm">
            Total
          </label>
          <p className="text-2xl font-bold text-gold">
            ${selectedOrder.totalAmount}
          </p>
        </div>

        {/* Status Selection */}
        <div className="border-t pt-4 mt-6">
          <label className="font-bold text-blue-1 font-family-sora text-sm block mb-2">
            Cambiar Estado
          </label>
          <select
            value={selectedStatus || ""}
            onChange={(e) => onStatusChange(e.target.value)}
            disabled={updatingId === selectedOrder.id}
            className={`w-full px-3 py-2 rounded-lg border border-gray-2 focus:outline-none focus:border-gold transition-colors font-family-sora ${
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

        {/* Modal Actions */}
        <div className="flex gap-4 mt-6 pt-4 border-t">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-2 text-gray-1 font-bold px-4 py-2 rounded-lg hover:bg-gray-1 hover:text-white transition-colors font-family-sora"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
