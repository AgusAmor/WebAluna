import React from "react";
import { IoIosClose } from "react-icons/io";

/**
 * UserFilters Component
 * Reusable filter section for users management
 * Allows filtering by user name, account status, and creation date
 */
const UserFilters = ({
  users,
  filterName,
  setFilterName,
  filterStatus,
  setFilterStatus,
  filterDateFrom,
  setFilterDateFrom,
  filterDateTo,
  setFilterDateTo,
}) => {
  const hasFilters =
    filterName || filterStatus || filterDateFrom || filterDateTo;

  const clearAllFilters = () => {
    setFilterName("");
    setFilterStatus("");
    setFilterDateFrom("");
    setFilterDateTo("");
  };

  // Don't show filters if no users
  if (!users || users.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-3 rounded-xl shadow-md p-6 mb-6 border border-gold/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-blue-1 font-family-sora flex items-center gap-2">
          <span className="w-1 h-6 bg-gold rounded-full"></span>
          Filtros de Búsqueda
        </h3>
        {hasFilters && (
          <button
            onClick={clearAllFilters}
            className="text-xs px-3 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors font-family-sora font-bold"
          >
            Limpiar Todos
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Filter by Name */}
        <div className="flex flex-col">
          <label className="font-bold text-blue-1 font-family-sora text-xs uppercase tracking-wide mb-2">
            Buscar
          </label>
          <input
            type="text"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            placeholder="Buscar por texto"
            className="px-3 py-2.5 rounded-lg border-2 border-gray-1 bg-white focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all font-family-sora text-sm"
          />
        </div>

        {/* Filter by Status */}
        <div className="flex flex-col">
          <label className="font-bold text-blue-1 font-family-sora text-xs uppercase tracking-wide mb-2">
            Estado de Cuenta
          </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2.5 rounded-lg border-2 border-gray-1 bg-white focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all font-family-sora text-sm cursor-pointer"
          >
            <option value="">Todos</option>
            <option value="active">Activo</option>
            <option value="suspended">Suspendido</option>
          </select>
        </div>

        {/* Filter by Date From */}
        <div className="flex flex-col">
          <label className="font-bold text-blue-1 font-family-sora text-xs uppercase tracking-wide mb-2">
            Desde
          </label>
          <input
            type="date"
            value={filterDateFrom}
            onChange={(e) => setFilterDateFrom(e.target.value)}
            className="px-3 py-2.5 rounded-lg border-2 border-gray-1 bg-white focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all font-family-sora text-sm"
          />
        </div>

        {/* Filter by Date To */}
        <div className="flex flex-col">
          <label className="font-bold text-blue-1 font-family-sora text-xs uppercase tracking-wide mb-2">
            Hasta
          </label>
          <input
            type="date"
            value={filterDateTo}
            onChange={(e) => setFilterDateTo(e.target.value)}
            className="px-3 py-2.5 rounded-lg border-2 border-gray-1 bg-white focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all font-family-sora text-sm"
          />
        </div>
      </div>

      {/* Active Filters Display */}
      {hasFilters && (
        <div className="mt-4 pt-4 border-t border-gold/20 flex flex-wrap gap-2">
          {filterName && (
            <span className="inline-flex items-center gap-2 bg-blue-1 text-white px-3 py-1 rounded-full text-xs font-bold font-family-sora">
              {filterName}
              <button
                onClick={() => setFilterName("")}
                className="hover:opacity-70"
                aria-label="Clear name filter"
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
          {filterDateFrom && (
            <span className="inline-flex items-center gap-2 bg-blue-1/70 text-white px-3 py-1 rounded-full text-xs font-bold font-family-sora">
              Desde {filterDateFrom}
              <button
                onClick={() => setFilterDateFrom("")}
                className="hover:opacity-70"
                aria-label="Clear from date filter"
              >
                <IoIosClose size={16} />
              </button>
            </span>
          )}
          {filterDateTo && (
            <span className="inline-flex items-center gap-2 bg-blue-1/70 text-white px-3 py-1 rounded-full text-xs font-bold font-family-sora">
              Hasta {filterDateTo}
              <button
                onClick={() => setFilterDateTo("")}
                className="hover:opacity-70"
                aria-label="Clear to date filter"
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

export default UserFilters;
