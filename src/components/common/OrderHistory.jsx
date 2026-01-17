import React from "react";
import { ImSpinner2 } from "react-icons/im";
import { OrderCard } from "../index";

/**
 * OrderHistory Component
 * Displays the complete order history for the current user
 *
 * @param {Array} orders - All orders for the user
 * @param {boolean} loading - Loading state
 * @param {Function} onViewDetails - Callback when viewing order details
 * @param {Function} onCancel - Callback when cancelling an order
 */
const OrderHistory = ({ orders, loading, onViewDetails, onCancel }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <ImSpinner2 className="animate-spin text-gold" size={40} />
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-1 text-lg">No hay pedidos registrados</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-1 mb-4">
        Total de pedidos:{" "}
        <span className="font-bold text-blue-1">{orders.length}</span>
      </p>

      <div className="space-y-4">
        {orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onViewDetails={onViewDetails}
            onCancel={onCancel}
          />
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
