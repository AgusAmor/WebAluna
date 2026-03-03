import React from "react";
import { IoIosClose } from "react-icons/io";
import { ORDER_STATUS } from "../../../constants";

/**
 * OrderFilters Component
 * Reusable filter section for orders management
 */
const OrderFilters = ({
  orders,
  products,
  filterUser,
  setFilterUser,
  filterStatus,
  setFilterStatus,
  filterProduct,
  setFilterProduct,
  filterDelivery,
  setFilterDelivery,
  hideFinished,
  setHideFinished,
}) => {
  const hasFilters =
    filterUser || filterStatus || filterProduct || filterDelivery;

  const clearAllFilters = () => {
    setFilterUser("");
    setFilterStatus("");
    setFilterProduct("");
    setFilterDelivery("");
  };

  // Don't show filters if no orders
  if (!orders || orders.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-3 rounded-xl shadow-md px-4 py-3 mb-4 border border-gold/20">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-blue-1 font-family-sora flex items-center gap-2">
          <span className="w-1 h-5 bg-gold rounded-full"></span>
          Filtros
        </h3>
        {hasFilters && (
          <button
            onClick={clearAllFilters}
            className="text-xs px-3 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors font-family-sora font-bold"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Row 1: text search + hide finished toggle */}
      <div className="flex gap-3 mb-3 items-end">
        <div className="flex flex-col flex-1">
          <label className="font-bold text-blue-1 font-family-sora text-xs uppercase tracking-wide mb-1">
            Buscar
          </label>
          <input
            type="text"
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
            placeholder="Nombre, email, dirección o código..."
            className="px-3 py-2 rounded-lg border-2 border-gray-1 bg-white focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all font-family-sora text-sm"
          />
        </div>
        <div className="flex flex-col shrink-0">
          <button
            type="button"
            onClick={() => setHideFinished((v) => !v)}
            className={`px-3 py-2 rounded-lg border-2 font-family-sora text-xs font-bold transition-all whitespace-nowrap ${
              hideFinished
                ? "bg-blue-1 border-blue-1 text-white hover:bg-blue-2 hover:border-blue-2"
                : "bg-white border-gold text-gold hover:bg-gold/10"
            }`}
          >
            {hideFinished ? "Ver finalizados" : "Ocultar finalizados"}
          </button>
        </div>
      </div>

      {/* Row 2: status + delivery + product */}
      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col">
          <label className="font-bold text-blue-1 font-family-sora text-xs uppercase tracking-wide mb-1">
            Estado
          </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-lg border-2 border-gray-1 bg-white focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all font-family-sora text-sm cursor-pointer"
          >
            <option value="">Todos</option>
            <option value={ORDER_STATUS.PENDING}>Pendiente</option>
            <option value={ORDER_STATUS.CONFIRMED}>Confirmado</option>
            <option value={ORDER_STATUS.PRINTING}>Imprimiendo</option>
            <option value={ORDER_STATUS.DISPATCHED}>Despachado</option>
            <option value={ORDER_STATUS.DELIVERED}>Entregado</option>
            <option value={ORDER_STATUS.WITHDRAWN}>Retirado</option>
            <option value={ORDER_STATUS.CANCELLED}>Cancelado</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="font-bold text-blue-1 font-family-sora text-xs uppercase tracking-wide mb-1">
            Tipo de Entrega
          </label>
          <select
            value={filterDelivery}
            onChange={(e) => setFilterDelivery(e.target.value)}
            className="px-3 py-2 rounded-lg border-2 border-gray-1 bg-white focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all font-family-sora text-sm cursor-pointer"
          >
            <option value="">Todos</option>
            <option value="pickup">Retiro en local</option>
            <option value="delivery">Envío a domicilio</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="font-bold text-blue-1 font-family-sora text-xs uppercase tracking-wide mb-1">
            Producto
          </label>
          <select
            value={filterProduct}
            onChange={(e) => setFilterProduct(e.target.value)}
            className="px-3 py-2 rounded-lg border-2 border-gray-1 bg-white focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all font-family-sora text-sm cursor-pointer"
          >
            <option value="">Todos</option>
            {(products || []).map((p) => (
              <option key={p.id} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasFilters && (
        <div className="mt-4 pt-4 border-t border-gold/20 flex flex-wrap gap-2">
          {filterUser && (
            <span className="inline-flex items-center gap-2 bg-blue-1 text-white px-3 py-1 rounded-full text-xs font-bold font-family-sora">
              {filterUser}
              <button
                onClick={() => setFilterUser("")}
                className="hover:opacity-70"
                aria-label="Clear user filter"
              >
                <IoIosClose size={16} />
              </button>
            </span>
          )}
          {filterDelivery && (
            <span className="inline-flex items-center gap-2 bg-blue-2 text-white px-3 py-1 rounded-full text-xs font-bold font-family-sora">
              {filterDelivery === "pickup" ? "Retiro" : "Envío"}
              <button
                onClick={() => setFilterDelivery("")}
                className="hover:opacity-70"
                aria-label="Clear delivery filter"
              >
                <IoIosClose size={16} />
              </button>
            </span>
          )}
          {filterProduct && (
            <span className="inline-flex items-center gap-2 bg-blue-2 text-white px-3 py-1 rounded-full text-xs font-bold font-family-sora">
              {filterProduct}
              <button
                onClick={() => setFilterProduct("")}
                className="hover:opacity-70"
                aria-label="Clear product filter"
              >
                <IoIosClose size={16} />
              </button>
            </span>
          )}
          {filterStatus && (
            <span className="inline-flex items-center gap-2 bg-gold text-gray-0 px-3 py-1 rounded-full text-xs font-bold font-family-sora">
              {filterStatus}
              <button
                onClick={() => setFilterStatus("")}
                className="hover:opacity-70"
                aria-label="Clear status filter"
              >
                <IoIosClose size={16} />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderFilters;
