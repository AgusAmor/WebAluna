import React from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

/**
 * Pagination Component
 * Displays pagination controls for tables
 *
 * @param {number} totalItems - Total number of items
 * @param {number} itemsPerPage - Items to display per page
 * @param {number} currentPage - Current active page (1-based)
 * @param {Function} onPageChange - Callback when page changes
 */
const Pagination = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page) => {
    onPageChange(page);
  };

  const getPageNumbers = () => {
    const delta = 1; // Show 1 page before and after current
    const range = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      range.unshift("...");
    }
    range.unshift(1);

    if (currentPage + delta < totalPages - 1) {
      range.push("...");
    }
    range.push(totalPages);

    return range.filter((value, index, self) => self.indexOf(value) === index);
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex justify-center items-center gap-2 py-4 px-4 bg-gray-3 rounded-b-xl">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="p-2 rounded-lg bg-white hover:bg-gray-2 disabled:bg-gray-3 disabled:text-gray-1 transition-colors"
      >
        <MdChevronLeft size={20} />
      </button>

      <div className="flex gap-1">
        {pageNumbers.map((page, index) =>
          page === "..." ? (
            <span
              key={`dots-${index}`}
              className="px-2 py-1 text-gray-1 font-bold"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => handlePageClick(page)}
              className={`min-w-10 h-10 rounded-lg font-bold transition-colors ${
                currentPage === page
                  ? "bg-blue-2 text-white"
                  : "bg-white text-blue-2 hover:bg-gray-2"
              }`}
            >
              {page}
            </button>
          ),
        )}
      </div>

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg bg-white hover:bg-gray-2 disabled:bg-gray-3 disabled:text-gray-1 transition-colors"
      >
        <MdChevronRight size={20} />
      </button>

      <span className="ml-4 text-sm text-gray-1 font-bold">
        Página {currentPage} de {totalPages}
      </span>
    </div>
  );
};

export default Pagination;
