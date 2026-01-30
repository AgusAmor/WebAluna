import React from "react";
import { formatDateTime } from "../../../utils/dateFormatter";
import { ORDER_STATUS } from "../../../constants";
import { OrderStatusBadge } from "../../../components/ecommerce";

/**
 * StatusHistoryPanel Component
 * Displays the status change history of an order in a vertical timeline
 */
const StatusHistoryPanel = ({ statusHistory, userId }) => {
  if (!statusHistory || statusHistory.length === 0) {
    return (
      <div className="text-center text-gray-1">
        <p>No hay historial disponible</p>
      </div>
    );
  }

  // Reverse to show latest first
  const sortedHistory = [...statusHistory].reverse();

  const getActorLabel = (updatedBy) => {
    if (updatedBy === "system") {
      return "Sistema";
    }
    if (updatedBy === userId) {
      return "Cliente";
    }
    return "Administrador";
  };

  return (
    <div className="space-y-3 max-h-full overflow-y-auto pr-2">
      {sortedHistory.map((entry, index) => (
        <div key={index} className="relative">
          {/* Content */}
          <div className="ml-4 bg-white border-l-4 border-gold rounded-lg p-3 shadow-sm">
            <div className="mb-2">
              <OrderStatusBadge status={entry.status} />
            </div>

            <p className="text-xs text-blue-2 mb-2 font-semibold">
              {formatDateTime(entry.timestamp)}
            </p>

            <p className="text-xs text-blue-1 font-medium mb-2 wrap-break-word whitespace-normal">
              {entry.note || `Estado actualizado a ${entry.status}`}
            </p>

            <p className="text-xs text-blue-2 italic font-semibold">
              {getActorLabel(entry.updatedBy)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatusHistoryPanel;
