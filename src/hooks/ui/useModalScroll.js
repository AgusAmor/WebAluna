import { useEffect } from "react";

/**
 * Custom hook to prevent body scroll when modals are open
 * @param {boolean} isOpen - Whether the modal is open
 */
export const useModalScroll = (isOpen) => {
  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
      return () => {
        // Restore body scroll when modal closes
        document.body.style.overflow = "unset";
      };
    }
  }, [isOpen]);
};
