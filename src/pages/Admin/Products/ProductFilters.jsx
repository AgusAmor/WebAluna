import React from "react";
import { IoIosClose } from "react-icons/io";

/**
 * ProductFilters Component
 * Filter section for product management with text search, family and price sort.
 */
const ProductFilters = ({
  products,
  families,
  filterName,
  setFilterName,
  filterFamily,
  setFilterFamily,
  priceSort,
  setPriceSort,
}) => {
  const hasFilters =
    filterName ||
    (filterFamily && filterFamily !== "all") ||
    priceSort !== "none";

  const clearAllFilters = () => {
    setFilterName("");
    setFilterFamily("all");
    setPriceSort("none");
  };

  if (!products || products.length === 0) {
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
            Limpiar todos
          </button>
        )}
      </div>

      {/* Family + price sort */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col">
          <label className="font-bold text-blue-1 font-family-sora text-xs uppercase tracking-wide mb-1">
            Familia
          </label>
          <select
            value={filterFamily}
            onChange={(e) => setFilterFamily(e.target.value)}
            className="px-3 py-2 rounded-lg border-2 border-gray-1 bg-white focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all font-family-sora text-sm cursor-pointer"
          >
            <option value="all">Todas las familias</option>
            {(families || [])
              .filter((f) => f !== "all")
              .map((family) => (
                <option key={family} value={family}>
                  {family}
                </option>
              ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="font-bold text-blue-1 font-family-sora text-xs uppercase tracking-wide mb-1">
            Ordenar por Precio
          </label>
          <select
            value={priceSort}
            onChange={(e) => setPriceSort(e.target.value)}
            className="px-3 py-2 rounded-lg border-2 border-gray-1 bg-white focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all font-family-sora text-sm cursor-pointer"
          >
            <option value="none">Sin ordenar</option>
            <option value="asc">Menor a Mayor</option>
            <option value="desc">Mayor a Menor</option>
          </select>
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
                aria-label="Limpiar búsqueda"
              >
                <IoIosClose size={16} />
              </button>
            </span>
          )}
          {filterFamily && filterFamily !== "all" && (
            <span className="inline-flex items-center gap-2 bg-blue-2 text-white px-3 py-1 rounded-full text-xs font-bold font-family-sora">
              {filterFamily}
              <button
                onClick={() => setFilterFamily("all")}
                className="hover:opacity-70"
                aria-label="Limpiar familia"
              >
                <IoIosClose size={16} />
              </button>
            </span>
          )}
          {priceSort !== "none" && (
            <span className="inline-flex items-center gap-2 bg-gold text-white px-3 py-1 rounded-full text-xs font-bold font-family-sora">
              {priceSort === "asc"
                ? "Precio: Menor a Mayor"
                : "Precio: Mayor a Menor"}
              <button
                onClick={() => setPriceSort("none")}
                className="hover:opacity-70"
                aria-label="Limpiar orden"
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

export default ProductFilters;
