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

  const FINISHED_STATUSES = ["delivered", "withdrawn", "cancelled"];

  // Filter function
  const getFilteredOrders = useCallback(
    (
      orders,
      filterUser,
      filterStatus,
      filterProduct,
      filterDelivery,
      hideFinished,
    ) => {
      let filtered = orders.filter((order) => {
        // Hide finished orders
        if (hideFinished && FINISHED_STATUSES.includes(order.status)) {
          return false;
        }

        // Filter by text: name, email, address, or order code
        if (filterUser) {
          const q = filterUser.toLowerCase();
          const matchesName = order.userName?.toLowerCase().includes(q);
          const matchesEmail = order.userEmail?.toLowerCase().includes(q);
          const matchesAddress = order.deliveryAddress
            ?.toLowerCase()
            .includes(q);
          const matchesOrderNumber =
            order.orderNumber?.toString().toLowerCase().includes(q) ||
            order.id?.toLowerCase().includes(q);
          if (
            !matchesName &&
            !matchesEmail &&
            !matchesAddress &&
            !matchesOrderNumber
          )
            return false;
        }

        // Filter by status
        if (filterStatus && order.status !== filterStatus) {
          return false;
        }

        // Filter by product name
        if (filterProduct) {
          const hasProduct = order.items?.some(
            (item) => item.productName === filterProduct,
          );
          if (!hasProduct) return false;
        }

        // Filter by delivery type
        if (filterDelivery && order.deliveryType !== filterDelivery) {
          return false;
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
    [getOrderDate, getLocalDateString, FINISHED_STATUSES],
  );

  return {
    getFilteredOrders,
    getOrderDate,
    getLocalDateString,
  };
};

export default useOrderFiltering;
