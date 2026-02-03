import { useState } from "react";
import { combinePhoneNumber } from "../../utils/phoneUtils.js";
import { validatePhoneMinDigits } from "../../services/validationService";

/**
 * Custom hook to manage the AddressRequiredModal logic
 * @param {Object} params
 * @param {Function} params.onClose - Function to close the modal
 * @param {Function} params.onAddressAdded - Function to call when address is added
 */
export const useAddressRequiredModal = ({ onClose, onAddressAdded }) => {
  const [address, setAddress] = useState({
    street: "",
    number: "",
    apartment: "",
    city: "",
    region: "",
    postalCode: "",
    recipientName: "",
    recipientPhoneCountry: "+549",
    recipientPhoneLocal: "",
    isDefault: true,
  });

  const [error, setError] = useState(null);

  const handleAddressChange = (idx, event) => {
    const { name, value, type, checked } = event.target;
    setAddress((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError(null);
  };

  const handleClose = () => {
    setAddress({
      street: "",
      number: "",
      apartment: "",
      city: "",
      region: "",
      postalCode: "",
      recipientName: "",
      recipientPhoneCountry: "+549",
      recipientPhoneLocal: "",
      isDefault: true,
    });
    setError(null);
    onClose();
  };

  const handleAddAddress = async () => {
    // Validate required fields
    if (
      !address.street ||
      !address.number ||
      !address.city ||
      !address.region ||
      !address.recipientName ||
      !address.recipientPhoneCountry ||
      !address.recipientPhoneLocal
    ) {
      setError("Por favor completa todos los campos requeridos");
      return;
    }

    if (!validatePhoneMinDigits(address.recipientPhoneLocal, 6)) {
      setError("El teléfono debe tener al menos 6 dígitos");
      return;
    }

    try {
      // Combine phone number fields
      const recipientPhone = combinePhoneNumber(
        address.recipientPhoneCountry,
        address.recipientPhoneLocal,
      );

      // Prepare address object for submission
      const addressToSubmit = {
        street: address.street,
        number: address.number,
        apartment: address.apartment,
        city: address.city,
        region: address.region,
        postalCode: address.postalCode,
        recipientName: address.recipientName,
        recipientPhone: recipientPhone,
        isDefault: address.isDefault,
      };

      // Call the callback with the address
      await onAddressAdded(addressToSubmit);
      handleClose();
    } catch (err) {
      setError(err.message || "Error al agregar dirección");
    }
  };

  return {
    address,
    error,
    handleAddressChange,
    handleAddAddress,
    handleClose,
  };
};
