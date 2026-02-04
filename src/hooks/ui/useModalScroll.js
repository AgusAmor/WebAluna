import { useEffect } from "react";

/**
 * Custom hook to prevent body scroll when modals are open
 * Supports multiple modals by tracking count
 * @param {boolean} isOpen - Whether the modal is open
 */
export const useModalScroll = (isOpen) => {
  useEffect(() => {
    if (isOpen) {
      // Increment open modals counter
      const currentCount = parseInt(
        document.body.getAttribute("data-modal-count") || "0",
      );
      document.body.setAttribute("data-modal-count", currentCount + 1);

      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";

      return () => {
        // Decrement open modals counter
        const newCount = Math.max(
          0,
          parseInt(document.body.getAttribute("data-modal-count") || "1") - 1,
        );
        document.body.setAttribute("data-modal-count", newCount);

        // Restore body scroll only if no modals are open
        if (newCount === 0) {
          document.body.style.overflow = "unset";
        }
      };
    }
  }, [isOpen]);
};
