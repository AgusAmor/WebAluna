import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";
import ShippingInfoModal from "./ShippingInfoModal";

/**
 * Shipping Info Banner Component
 * Displays shipping information modal when user navigates to checkout
 * Handles showing/hiding the modal
 */
const ShippingInfoBanner = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

  // Show modal when user navigates to checkout page,
  // but NOT when returning from MercadoPago (mp_return param present)
  useEffect(() => {
    if (location.pathname === "/checkout") {
      const params = new URLSearchParams(location.search);
      const isMPReturn =
        params.has("mp_return") ||
        params.has("collection_status") ||
        params.has("preference_id");
      if (!isMPReturn) {
        setIsOpen(true);
      }
    }
  }, [location.pathname, location.search, setIsOpen]);

  return <ShippingInfoModal isOpen={isOpen} onClose={() => setIsOpen(false)} />;
};

ShippingInfoBanner.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
};

export default ShippingInfoBanner;
