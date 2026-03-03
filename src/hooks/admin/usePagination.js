import React from "react";

/**
 * usePagination Hook
 * Maneja toda la lógica de paginación de forma reutilizable
 *
 * @param {Array} items - Array de items a paginar
 * @param {number} itemsPerPage - Items por página (default 20)
 * @param {Array} dependencies - Dependencias para resetear a página 1
 * @returns {Object} - { paginatedItems, currentPage, setCurrentPage, totalPages }
 */
const usePagination = (items = [], itemsPerPage = 20, dependencies = []) => {
  const [currentPage, setCurrentPage] = React.useState(1);

  // Reset a página 1 cuando cambian las dependencias
  React.useEffect(() => {
    setCurrentPage(1);
  }, dependencies);

  // Calcular índices
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  return {
    paginatedItems: items.slice(startIndex, endIndex),
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems: items.length,
  };
};

export default usePagination;
