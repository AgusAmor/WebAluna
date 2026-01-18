import React from "react";
import { formatDateTime } from "../../utils/dateFormatter";
import { ORDER_STATUS } from "../../constants";
import { OrderStatusBadge } from "./index";

/**
 * OrderCard Component - Displays order information in a card format
 * Reusable component for showing individual orders
 * @param {Object} order - Order object with id, orderNumber, createdAt, status, items, totalAmount, etc.
 * @param {Function} onViewDetails - Callback when user wants to see full order details
 * @param {Function} onCancel - Callback when user wants to cancel a pending order
 */
const OrderCard = ({ order, onViewDetails, onCancel }) => {
  const itemCount = order.items ? order.items.length : 0;

  return (
    <div className="rounded-xl border border-gray-2 shadow-md p-4">
      {/* Header: Order Number & Status Badge */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <p className="text-sm font-bold text-blue-1">
          {order.orderNumber || order.id?.slice(-8)}
        </p>

        {/* Status Badge */}
        <OrderStatusBadge status={order.status} />
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
