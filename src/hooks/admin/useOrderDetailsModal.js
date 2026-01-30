import { useState } from "react";

/**
 * Custom hook to manage order details modal state and logic
 */
export const useOrderDetailsModal = () => {
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const openHistoryModal = () => setShowHistoryModal(true);
  const closeHistoryModal = () => setShowHistoryModal(false);

  return {
    showHistoryModal,
    openHistoryModal,
    closeHistoryModal,
  };
};
