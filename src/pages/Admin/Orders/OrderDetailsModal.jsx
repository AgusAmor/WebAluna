import React from "react";
import { ImSpinner2 } from "react-icons/im";
import { IoIosClose } from "react-icons/io";
import { MdHistory } from "react-icons/md";
import { formatDate } from "../../../utils/dateFormatter";
import { ORDER_STATUS } from "../../../constants";
import { OrderStatusBadge } from "../../../components/ecommerce";
import StatusHistoryPanel from "./StatusHistoryPanel";
import { useOrderDetailsModal } from "../../../hooks/admin";
import { useModalScroll } from "../../../hooks/ui";

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
  useModalScroll(isOpen);
  const { showHistoryModal, openHistoryModal, closeHistoryModal } =
    useOrderDetailsModal();

  if (!isOpen || !selectedOrder) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-2 sm:p-4 overflow-hidden"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="bg-white rounded-lg sm:rounded-xl shadow-lg w-full max-w-sm sm:max-w-md md:max-w-4xl lg:max-w-6xl xl:max-w-7xl relative flex flex-col md:flex-row animate-fadeInScale max-h-[95vh] sm:max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 cursor-pointer text-gray-3 hover:text-gold hover:scale-150 transition-all z-10"
          onClick={onClose}
          aria-label="Close"
        >
          <IoIosClose size={26} />
        </button>

        {/* Badge positioned left of close button - Mobile only */}
        <div className="absolute top-3 right-12 z-10 md:hidden">
          <OrderStatusBadge status={selectedOrder.status} />
        </div>

        {/* Left Panel - Status History (hidden on mobile, shown on desktop) */}
        <div className="hidden md:flex md:w-72 lg:w-80 border-r border-gray-2 flex-col shrink-0 bg-blue-1 rounded-l-lg sm:rounded-l-xl">
          <div className="p-6 flex-1 flex flex-col overflow-hidden">
            <h3 className="text-lg font-bold text-white font-family-comfortaa mb-6 shrink-0">
              Historial del Pedido
            </h3>
            <div className="flex-1 overflow-y-auto pr-2">
              <StatusHistoryPanel
                statusHistory={selectedOrder.statusHistory}
                userId={selectedOrder.userId}
              />
            </div>
          </div>

          {/* Left Footer - Status Selection (Desktop) */}
          <div className="p-6 border-t border-blue-2 shrink-0 bg-blue-2">
            <label className="font-bold text-white font-family-sora text-xs uppercase tracking-wide block mb-3">
              Cambiar Estado
            </label>
            <select
              value={selectedStatus || ""}
              onChange={(e) => onStatusChange(e.target.value)}
              disabled={updatingId === selectedOrder.id}
              className={`w-full px-2 md:px-3 py-2 rounded-lg border-2 border-gold focus:outline-none focus:border-gold transition-colors font-family-sora text-xs md:text-sm ${
                updatingId === selectedOrder.id
                  ? "bg-gray-100 cursor-not-allowed opacity-60"
                  : "bg-white hover:bg-blue-3/10"
              }`}
            >
              <option value="">-- Seleccionar estado --</option>
              <option value={ORDER_STATUS.PENDING}>Pendiente</option>
              <option value={ORDER_STATUS.CONFIRMED}>Confirmado</option>
              <option value={ORDER_STATUS.PRINTING}>Imprimiendo</option>
              <option value={ORDER_STATUS.DISPATCHED}>Despachado</option>
              {selectedOrder.deliveryType === "pickup" ? (
                <option value={ORDER_STATUS.WITHDRAWN}>Retirado</option>
              ) : (
                <option value={ORDER_STATUS.DELIVERED}>Entregado</option>
              )}
              {selectedOrder.status !== ORDER_STATUS.DELIVERED && (
                <option value={ORDER_STATUS.CANCELLED}>Cancelado</option>
              )}
            </select>
          </div>
        </div>

        {/* Right Panel - Order Details */}
        <div className="flex-1 flex flex-col min-w-0 bg-white overflow-hidden rounded-lg md:rounded-l-none md:rounded-r-xl">
          <div className="py-4 px-5 sm:py-6 sm:px-8 border-b border-gray-2 shrink-0 bg-blue-2">
            <h2 className="text-lg sm:text-2xl font-bold font-family-comfortaa text-white mb-3">
              Detalles del Pedido
            </h2>
            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-base sm:text-lg text-gold font-bold">
                    #{selectedOrder.orderNumber || selectedOrder.id?.slice(-8)}
                  </p>
                  <div className="hidden md:block">
                    <OrderStatusBadge status={selectedOrder.status} />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-blue-3 flex-wrap">
                  <span>Emitido {formatDate(selectedOrder.createdAt)}</span>
                  {selectedOrder.statusHistory &&
                    selectedOrder.statusHistory.length > 0 && (
                      <span>
                        • Actualizado{" "}
                        {formatDate(
                          selectedOrder.statusHistory[
                            selectedOrder.statusHistory.length - 1
                          ].timestamp,
                        )}
                      </span>
                    )}
                </div>
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-5 sm:px-8 lg:px-10 space-y-5 sm:space-y-6 py-6">
            {/* Customer Info */}
            <div className="bg-blue-3/30 border-l-4 border-gold rounded-lg p-5 sm:p-6">
              <h3 className="font-bold text-blue-1 font-family-sora text-sm mb-3 flex items-center gap-2">
                <span className="w-1 h-5 bg-gold rounded-full"></span>
                Información del Cliente
              </h3>
              <div className="space-y-1">
                <p className="text-blue-1 font-bold text-base">
                  {selectedOrder.userName}
                </p>
                <p className="text-blue-2 text-sm break-all">
                  {selectedOrder.userEmail || "-"}
                </p>
                <p className="text-blue-2 text-sm">
                  {selectedOrder.userPhone || "-"}
                </p>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-blue-3/30 border-l-4 border-gold rounded-lg p-5 sm:p-6">
              <h3 className="font-bold text-blue-1 font-family-sora text-sm mb-3 flex items-center gap-2">
                <span className="w-1 h-5 bg-gold rounded-full"></span>
                Información de Entrega
              </h3>
              <div className="space-y-1">
                <p className="text-blue-1 font-bold text-base">
                  {selectedOrder.deliveryType === "pickup"
                    ? "Retiro en local"
                    : "Envío a domicilio"}
                </p>
                {selectedOrder.deliveryType !== "pickup" &&
                  selectedOrder.deliveryAddress && (
                    <p className="text-blue-2 text-sm font-medium warp-break-word">
                      {selectedOrder.deliveryAddress}
                    </p>
                  )}
                {(selectedOrder.shipping !== undefined ||
                  selectedOrder.summary?.shipping !== undefined) && (
                  <p className="text-gold font-bold text-base">
                    $
                    {selectedOrder.shipping ??
                      selectedOrder.summary?.shipping ??
                      "0"}
                  </p>
                )}
                {/* Recipient info */}
                {(() => {
                  const addr = selectedOrder.delivery?.shippingAddress;
                  const recipientName = addr?.recipientName || "";
                  const recipientPhone = addr?.recipientPhone || "";
                  if (!recipientName && !recipientPhone) return null;
                  return (
                    <div className="mt-2 pt-2 border-t border-gold/30">
                      {recipientName && (
                        <p className="text-blue-1 font-bold text-sm">
                          {recipientName}
                        </p>
                      )}
                      {recipientPhone && (
                        <p className="text-blue-2 text-sm">{recipientPhone}</p>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-0">
              <label className="font-bold text-blue-1 font-family-sora text-sm block mb-3">
                Productos ({selectedOrder.items?.length || 0})
              </label>
              <div className="bg-blue-3/20 rounded-lg border-l-4 border-gold p-5 sm:p-6">
                {selectedOrder.items && selectedOrder.items.length > 0 ? (
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => {
                      const rawPrice =
                        item.unitPrice === null || item.unitPrice === undefined
                          ? 0
                          : typeof item.unitPrice === "number"
                            ? item.unitPrice
                            : parseFloat(item.unitPrice) || 0;
                      const rawQty =
                        item.quantity === null || item.quantity === undefined
                          ? 1
                          : typeof item.quantity === "number"
                            ? item.quantity
                            : parseFloat(item.quantity) || 1;

                      const unitPrice = rawPrice;
                      const quantity = rawQty;
                      const subtotal = unitPrice * quantity;

                      // Inline price formatter
                      const formatPrice = (val) => {
                        const rounded = Math.round(val * 100) / 100;
                        const str = rounded.toString();
                        const [whole, decimal] = str.split(".");
                        return `${whole}.${(decimal || "00").padEnd(2, "0").substring(0, 2)}`;
                      };

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
                              ${formatPrice(unitPrice)} x {quantity}
                            </p>
                          </div>
                          <span className="font-bold text-gold text-sm sm:text-base shrink-0">
                            ${formatPrice(subtotal)}
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

            {/* History Button - Mobile only */}
            <div className="md:hidden mt-5">
              <button
                onClick={openHistoryModal}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-2 hover:bg-blue-1 text-white rounded-lg font-semibold transition-all"
              >
                <MdHistory size={20} />
                Ver Historial del Pedido
              </button>
            </div>
          </div>

          {/* Fixed Footer */}
          <div className="flex flex-col gap-4 p-5 sm:p-8 border-t-2 border-blue-2 bg-blue-3/10 shrink-0">
            {/* Order Summary */}
            <div className="bg-white rounded-lg border-l-4 border-gold p-5 sm:p-6">
              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-blue-2 font-bold">Subtotal:</span>
                  <span className="text-blue-1 font-bold text-sm sm:text-base">
                    $
                    {selectedOrder.subtotal ??
                      selectedOrder.summary?.subtotal ??
                      "0"}
                  </span>
                </div>
                {(selectedOrder.shipping !== undefined ||
                  selectedOrder.summary?.shipping !== undefined) && (
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-blue-2 font-bold">Envío:</span>
                    <span className="text-blue-1 font-bold text-sm sm:text-base">
                      $
                      {selectedOrder.shipping ??
                        selectedOrder.summary?.shipping ??
                        "0"}
                    </span>
                  </div>
                )}
                <div className="flex justify-between border-t-2 border-blue-2 pt-2 mt-2">
                  <span className="font-bold text-blue-1 text-sm sm:text-base">
                    Total:
                  </span>
                  <span className="text-xl sm:text-2xl text-gold font-bold">
                    $
                    {selectedOrder.totalAmount ??
                      selectedOrder.summary?.total ??
                      "0"}
                  </span>
                </div>
              </div>
            </div>

            {/* Status Selection and Buttons */}
          </div>
        </div>
      </div>

      {/* History Modal - Mobile only */}
      {showHistoryModal && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 p-4"
          onClick={closeHistoryModal}
        >
          <div
            className="bg-blue-1 rounded-xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-hidden animate-fadeInScale flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-blue-2 shrink-0 bg-blue-2 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white font-family-comfortaa">
                Historial del Pedido
              </h3>
              <button
                className="cursor-pointer text-white hover:text-gold hover:scale-110 transition-all"
                onClick={closeHistoryModal}
                aria-label="Close"
              >
                <IoIosClose size={32} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <StatusHistoryPanel
                statusHistory={selectedOrder.statusHistory}
                userId={selectedOrder.userId}
              />
            </div>

            {/* Status Selection */}
            <div className="p-6 border-t border-blue-2 shrink-0 bg-blue-2">
              <label className="font-bold text-white font-family-sora text-xs uppercase tracking-wide block mb-3">
                Cambiar Estado
              </label>
              <select
                value={selectedStatus || ""}
                onChange={(e) => onStatusChange(e.target.value)}
                disabled={updatingId === selectedOrder.id}
                className={`w-full px-3 py-2.5 rounded-lg border-2 border-gold focus:outline-none focus:border-gold transition-colors font-family-sora text-sm ${
                  updatingId === selectedOrder.id
                    ? "bg-gray-100 cursor-not-allowed opacity-60"
                    : "bg-white hover:bg-blue-3/10"
                }`}
              >
                <option value="">-- Seleccionar estado --</option>
                <option value={ORDER_STATUS.PENDING}>Pendiente</option>
                <option value={ORDER_STATUS.CONFIRMED}>Confirmado</option>
                <option value={ORDER_STATUS.PRINTING}>Imprimiendo</option>
                <option value={ORDER_STATUS.DISPATCHED}>Despachado</option>
                {selectedOrder.deliveryType === "pickup" ? (
                  <option value={ORDER_STATUS.WITHDRAWN}>Retirado</option>
                ) : (
                  <option value={ORDER_STATUS.DELIVERED}>Entregado</option>
                )}
                {selectedOrder.status !== ORDER_STATUS.DELIVERED && (
                  <option value={ORDER_STATUS.CANCELLED}>Cancelado</option>
                )}
              </select>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-blue-2 shrink-0 bg-blue-2">
              <button
                onClick={closeHistoryModal}
                className="w-full py-2.5 px-4 bg-gold hover:bg-gold/90 text-white rounded-lg font-semibold transition-all"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetailsModal;
