import React from "react";
import { formatDateTime } from "../../utils/dateFormatter";
import { ORDER_STATUS } from "../../constants";

/**
 * OrderCard Component - Displays order information in a card format
 * Reusable component for showing individual orders
 * @param {Object} order - Order object with id, orderNumber, createdAt, status, items, totalAmount, etc.
 * @param {Function} onViewDetails - Callback when user wants to see full order details
 * @param {Function} onCancel - Callback when user wants to cancel a pending order
 */
const OrderCard = ({ order, onViewDetails, onCancel }) => {
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

  const itemCount = order.items ? order.items.length : 0;

  return (
    <div className="bg-gradient-to-br from-white to-gray-0 rounded-xl border border-gray-2 shadow-md hover:shadow-lg transition-all duration-300 p-4">
      {/* Header: Order Number & Status Badge */}
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm font-bold text-blue-1">
          #{order.orderNumber || order.id?.slice(-8)}
        </p>

        {/* Status Badge */}
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${getStatusColor(
            order.status
          )}`}
        >
          {getStatusLabel(order.status)}
        </span>
      </div>

      {/* Order Items & Price */}
      <div className="flex gap-3 mb-3 pb-3 border-b border-gray-2">
        {/* Products List */}
        <div className="flex-1">
          <div className="space-y-1">
            {order.items && order.items.length > 0 ? (
              <>
                {order.items.slice(0, 2).map((item, index) => (
                  <p key={index} className="text-xs text-gray-1 truncate">
                    • {item.productName}
                    {item.size && ` - ${item.size}`}
                    {item.quantity > 1 && ` (x${item.quantity})`}
                  </p>
                ))}
                {itemCount > 2 && (
                  <p className="text-xs text-gold font-bold">
                    +{itemCount - 2} más
                  </p>
                )}
              </>
            ) : (
              <p className="text-xs text-gray-1">Sin productos</p>
            )}
          </div>
        </div>

        {/* Total Price */}
        <div className="text-right">
          <p className="text-lg font-bold text-gold whitespace-nowrap">
            ${order.totalAmount || order.summary?.total || "0"}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 justify-end">
        {/* Cancel button - only show for orders that haven't started printing yet */}
        {(order.status === ORDER_STATUS.PENDING ||
          order.status === ORDER_STATUS.CONFIRMED) &&
          onCancel && (
            <button
              onClick={() => onCancel(order)}
              className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded text-xs font-bold transition-colors"
            >
              Cancelar
            </button>
          )}
        {onViewDetails && (
          <button
            onClick={() => onViewDetails(order)}
            className="px-3 py-1.5 bg-blue-1 hover:bg-blue-2 text-white rounded text-xs font-bold transition-colors"
          >
            Ver Detalles
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderCard;
