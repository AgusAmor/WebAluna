import React from "react";
import { ORDER_STATUS } from "../../constants";

/**
 * OrderStatusBadge Component
 * Displays order status with appropriate color coding
 * Reusable across the application
 *
 * @param {string} status - Order status from ORDER_STATUS constants
 * @param {string} className - Additional CSS classes (optional)
 */
const OrderStatusBadge = ({ status, className = "" }) => {
  const getStatusColor = (status) => {
    switch (status) {
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
        return "bg-red-100 text-red-500";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      [ORDER_STATUS.CONFIRMED]: "Confirmado",
      [ORDER_STATUS.PRINTING]: "Imprimiendo",
      [ORDER_STATUS.DISPATCHED]: "Despachado",
      [ORDER_STATUS.DELIVERED]: "Entregado",
      [ORDER_STATUS.WITHDRAWN]: "Retirado",
      [ORDER_STATUS.CANCELLED]: "Cancelado",
    };
    return statusMap[status] || status;
  };

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${getStatusColor(
        status,
      )} ${className}`}
    >
      {getStatusLabel(status)}
    </span>
  );
};

export default OrderStatusBadge;
