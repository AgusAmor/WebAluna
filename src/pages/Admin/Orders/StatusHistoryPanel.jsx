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
          {/* Timeline dot */}
          <div className="absolute -left-3 top-2 w-3 h-3 bg-gold rounded-full border-2 border-white"></div>

          {/* Timeline line (connects to next item) */}
          {index < sortedHistory.length - 1 && (
            <div className="absolute -left-1.5 top-5 w-1 h-12 bg-gold/30"></div>
          )}

          {/* Content */}
          <div className="ml-4 bg-white border border-gray-3 rounded-lg p-3">
            <div className="mb-2">
              <OrderStatusBadge status={entry.status} />
            </div>

            <p className="text-xs text-gray-1 mb-2">
              {formatDateTime(entry.timestamp)}
            </p>

            <p className="text-xs text-blue-1 font-medium mb-2 line-clamp-2">
              {entry.note || `Estado actualizado a ${entry.status}`}
            </p>

            <p className="text-xs text-gray-1 italic">
              {getActorLabel(entry.updatedBy)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatusHistoryPanel;
