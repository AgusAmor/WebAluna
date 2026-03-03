import React from "react";
import { ImSpinner2 } from "react-icons/im";
import { FaEye } from "react-icons/fa";
import { TbPlayerTrackNextFilled } from "react-icons/tb";
import { TiCancel } from "react-icons/ti";

import { formatDateTime } from "../../../utils/dateFormatter";
import { ORDER_STATUS } from "../../../constants";
import { OrderStatusBadge } from "../../../components/ecommerce";

/**
 * OrdersTable Component
 * Displays orders in a table format with actions
 */
const OrdersTable = ({
  filteredOrders,
  updatingId,
  isCancellingOrder,
  orderToCancel,
  onViewOrder,
  onUpdateStatus,
  onDeleteOrder,
}) => {
  if (!filteredOrders || filteredOrders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-blue-1 text-lg font-family-sora">
          No hay pedidos que coincidan con los filtros aplicados.
        </p>
      </div>
    );
  }

  return (
    <table className="min-w-full font-family-sora text-xs md:text-sm">
      <thead>
        <tr className="bg-gold text-white">
          <th className="py-2 px-1 font-bold text-center whitespace-nowrap">
            Usuario
          </th>
          <th className="py-2 px-1 font-bold text-center whitespace-nowrap">
            Fecha
          </th>
          <th className="py-2 px-1 font-bold text-center whitespace-nowrap">
            Entrega
          </th>
          <th className="py-2 px-1 font-bold text-center whitespace-nowrap">
            Productos
          </th>
          <th className="py-2 px-1 font-bold text-center whitespace-nowrap">
            Total
          </th>
          <th className="py-2 px-1 font-bold text-center whitespace-nowrap">
            Estado
          </th>
          <th className="py-2 px-1 font-bold text-center whitespace-nowrap">
            Acciones
          </th>
        </tr>
      </thead>
      <tbody>
        {filteredOrders.map((order) => {
          // Sum total quantity of all items
          const itemCount = order.items
            ? order.items.reduce((sum, item) => sum + (item.quantity || 1), 0)
            : 0;
          const deliveryInfo =
            order.deliveryType === "pickup"
              ? "Retiro"
              : order.deliveryAddress || "N/A";

          return (
            <tr
              key={order.id}
              className="border-b border-gray-2 hover:bg-gray-3/40"
            >
              <td className="py-2 px-2 font-bold text-blue-1 text-center">
                {order.userName}
              </td>
              <td className="py-2 px-2 text-center">
                {formatDateTime(order.createdAt) || "-"}
              </td>
              <td className="py-2 px-2 text-center text-sm">{deliveryInfo}</td>
              <td className="py-2 px-2 text-center">{itemCount}</td>
              <td className="py-2 px-2 text-gold font-bold text-center">
                ${order.totalAmount || "0"}
              </td>
              <td className="py-2 px-2 text-center">
                <OrderStatusBadge status={order.status} />
              </td>
              <td className="py-2 px-2 text-center">
                <div className="flex flex-row items-center gap-2 justify-center">
                  {/* View button */}
                  <button
                    className="bg-blue-2 text-white p-2 rounded-lg font-bold transition-colors flex items-center justify-center gap-1.5 hover:bg-gold cursor-pointer"
                    onClick={() => onViewOrder(order)}
                  >
                    <FaEye className="w-4 h-4" />
                  </button>
                  {/* Update Status button */}
                  <button
                    className={`text-white p-2 rounded-lg font-bold transition-colors flex items-center justify-center gap-1.5 ${
                      updatingId === order.id
                        ? "bg-gray-400 cursor-not-allowed opacity-60"
                        : order.status === ORDER_STATUS.DELIVERED ||
                            order.status === ORDER_STATUS.WITHDRAWN ||
                            order.status === ORDER_STATUS.CANCELLED
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700"
                    }`}
                    disabled={
                      updatingId === order.id ||
                      order.status === ORDER_STATUS.DELIVERED ||
                      order.status === ORDER_STATUS.WITHDRAWN ||
                      order.status === ORDER_STATUS.CANCELLED
                    }
                    onClick={() => onUpdateStatus(order.id, order.status)}
                  >
                    {updatingId === order.id ? (
                      <span className="flex items-center justify-center w-full h-full">
                        <ImSpinner2 className="animate-spin h-4 w-4" />
                      </span>
                    ) : (
                      <TbPlayerTrackNextFilled className="h-4 w-4" />
                    )}
                  </button>
                  {/* Cancel button */}
                  <button
                    className={`text-white p-1.5 rounded-lg font-bold transition-colors flex items-center justify-center gap-1.5  ${
                      isCancellingOrder && orderToCancel?.id === order.id
                        ? "bg-red-500 opacity-60 cursor-not-allowed"
                        : [
                              ORDER_STATUS.PENDING,
                              ORDER_STATUS.CONFIRMED,
                              ORDER_STATUS.PRINTING,
                              ORDER_STATUS.DISPATCHED,
                            ].includes(order.status)
                          ? "bg-red-500 hover:bg-red-700"
                          : "bg-gray-400 cursor-not-allowed"
                    }`}
                    disabled={
                      (isCancellingOrder && orderToCancel?.id === order.id) ||
                      ![
                        ORDER_STATUS.PENDING,
                        ORDER_STATUS.CONFIRMED,
                        ORDER_STATUS.PRINTING,
                        ORDER_STATUS.DISPATCHED,
                      ].includes(order.status)
                    }
                    onClick={() => onDeleteOrder(order.id)}
                  >
                    {isCancellingOrder && orderToCancel?.id === order.id ? (
                      <span className="flex items-center justify-center w-full h-full">
                        <ImSpinner2 className="animate-spin h-5 w-5 mx-auto text-white" />
                      </span>
                    ) : (
                      <TiCancel className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default OrdersTable;
