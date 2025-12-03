/**
 * Date Formatting Utilities
 * Helper functions for consistent date formatting across the application
 */

/**
 * Formats a date to dd/MM/yyyy format for display
 * Handles multiple date formats: Firestore Timestamp, ISO string, Date object
 * @param {*} dateStr - Date in various formats
 * @returns {string} Formatted date string or "-" if invalid
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return "-";

  try {
    let date;

    // Firestore Timestamp with seconds property
    if (dateStr && typeof dateStr === "object" && "seconds" in dateStr) {
      date = new Date(dateStr.seconds * 1000);
    }
    // Firestore Timestamp with _seconds property
    else if (dateStr && typeof dateStr === "object" && "_seconds" in dateStr) {
      date = new Date(dateStr._seconds * 1000);
    }
    // ISO string
    else if (typeof dateStr === "string") {
      date = new Date(dateStr);
    }
    // Date object
    else if (dateStr instanceof Date) {
      date = dateStr;
    }
    // Unknown format
    else {
      return "-";
    }

    // Validate date
    if (isNaN(date.getTime())) {
      return "-";
    }

    // Format as dd/MM/yyyy
    return date.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch (err) {
    console.error("Error formatting date:", err);
    return "-";
  }
};

/**
 * Formats a date to include time (dd/MM/yyyy HH:mm)
 * @param {*} dateStr - Date in various formats
 * @returns {string} Formatted date and time string or "-" if invalid
 */
export const formatDateTime = (dateStr) => {
  if (!dateStr) return "-";

  try {
    let date;

    if (dateStr && typeof dateStr === "object" && "seconds" in dateStr) {
      date = new Date(dateStr.seconds * 1000);
    } else if (
      dateStr &&
      typeof dateStr === "object" &&
      "_seconds" in dateStr
    ) {
      date = new Date(dateStr._seconds * 1000);
    } else if (typeof dateStr === "string") {
      date = new Date(dateStr);
    } else if (dateStr instanceof Date) {
      date = dateStr;
    } else {
      return "-";
    }

    if (isNaN(date.getTime())) {
      return "-";
    }

    return date.toLocaleString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch (err) {
    console.error("Error formatting date time:", err);
    return "-";
  }
};
