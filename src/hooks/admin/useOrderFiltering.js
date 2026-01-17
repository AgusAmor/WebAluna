import { useCallback } from "react";

/**
 * useOrderFiltering Hook
 * Encapsulates order filtering and sorting logic
 * @returns {Object} Filtering utilities and functions
 */
const useOrderFiltering = () => {
  // Helper function to convert createdAt to Date object
  const getOrderDate = useCallback((createdAt) => {
    if (!createdAt) return new Date(0);

    // Handle ISO string (most common after backend fix)
    if (typeof createdAt === "string") {
      return new Date(createdAt);
    }

    // Handle Firestore Timestamp object
    if (createdAt.toDate && typeof createdAt.toDate === "function") {
      return createdAt.toDate();
    }

    // Handle object with seconds property
    if (createdAt.seconds) {
      return new Date(createdAt.seconds * 1000);
    }

    // Handle Date object
    if (createdAt instanceof Date) {
      return createdAt;
    }

    // Handle number (timestamp in milliseconds)
    if (typeof createdAt === "number") {
      return new Date(createdAt);
    }

    return new Date(0);
  }, []);

  // Helper to get date only (YYYY-MM-DD) in local time
  const getLocalDateString = useCallback((date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, []);

  // Filter function
  const getFilteredOrders = useCallback(
    (orders, filterUser, filterStatus, filterDateFrom, filterDateTo) => {
      let filtered = orders.filter((order) => {
        // Filter by user
        if (
          filterUser &&
          !order.userName.toLowerCase().includes(filterUser.toLowerCase())
        ) {
          return false;
        }

        // Filter by status
        if (filterStatus && order.status !== filterStatus) {
          return false;
        }

        // Filter by date range
        if (filterDateFrom || filterDateTo) {
          const orderDate = getOrderDate(order.createdAt);
          const orderDateString = getLocalDateString(orderDate);

          // If filterDateFrom is set, compare date strings
          if (filterDateFrom && orderDateString < filterDateFrom) {
            return false;
          }

          // If filterDateTo is set, compare date strings
          if (filterDateTo && orderDateString > filterDateTo) {
            return false;
          }
        }

        return true;
      });

      // Sort by date (newest first by default)
      filtered.sort((a, b) => {
        const dateA = getOrderDate(a.createdAt).getTime();
        const dateB = getOrderDate(b.createdAt).getTime();
        return dateB - dateA;
      });

      return filtered;
    },
    [getOrderDate, getLocalDateString],
  );

  return {
    getFilteredOrders,
    getOrderDate,
    getLocalDateString,
  };
};

export default useOrderFiltering;
