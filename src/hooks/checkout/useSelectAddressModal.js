import { useState, useEffect } from "react";
import { combinePhoneNumber } from "../../utils/phoneUtils.js";
import { validatePhoneMinDigits } from "../../services/validationService";
import { validateAddressStrict } from "../../services/mapbox/geocodingService";

/**
 * Custom hook to manage the SelectAddressModal logic
 * @param {Object} params
 * @param {Function} params.onClose - Function to close the modal
 * @param {Function} params.onAddressSelected - Function to call when address is selected
 * @param {Object} params.currentAddress - Currently selected address
 * @param {boolean} params.isOpen - Whether the modal is open
 */
export const useSelectAddressModal = ({
  onClose,
  onAddressSelected,
  currentAddress,
  isOpen,
}) => {
  const [selectedAddressId, setSelectedAddressId] = useState(
    currentAddress?.id || null,
  );
  const [showForm, setShowForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street: "",
    number: "",
    apartment: "",
    city: "",
    region: "",
    postalCode: "",
    recipientName: "",
    recipientPhoneCountry: "+549",
    recipientPhoneLocal: "",
    isDefault: false,
  });
  const [error, setError] = useState(null);

  // Update selectedAddressId when currentAddress changes
  useEffect(() => {
    if (isOpen) {
      setSelectedAddressId(currentAddress?.id || null);
    }
  }, [currentAddress, isOpen]);

  const handleSelectAddress = (address) => {
    setSelectedAddressId(address.id);
    onAddressSelected(address);
    handleClose();
  };

  const handleClose = () => {
    // Reset form state on close
    setShowForm(false);
    setNewAddress({
      street: "",
      number: "",
      apartment: "",
      city: "",
      region: "",
      postalCode: "",
      recipientName: "",
      recipientPhoneCountry: "+549",
      recipientPhoneLocal: "",
      isDefault: false,
    });
    setError(null);
    onClose();
  };

  const handleAddressFormChange = (idx, event) => {
    const { name, value, type, checked } = event.target;
    setNewAddress((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError(null);
  };

  const handleAddNewAddress = async () => {
    // Validate required fields
    if (
      !newAddress.street ||
      !newAddress.number ||
      !newAddress.city ||
      !newAddress.region ||
      !newAddress.recipientName ||
      !newAddress.recipientPhoneCountry ||
      !newAddress.recipientPhoneLocal
    ) {
      setError("Por favor completa todos los campos requeridos");
      return;
    }

    if (!validatePhoneMinDigits(newAddress.recipientPhoneLocal, 6)) {
      setError("El teléfono debe tener al menos 6 dígitos");
      return;
    }

    try {
      // Validate address with Mapbox
      const addressValidation = await validateAddressStrict(newAddress);
      if (!addressValidation.isValid) {
        setError(addressValidation.reason);
        return;
      }

      // Combine phone number
      const recipientPhone = combinePhoneNumber(
        newAddress.recipientPhoneCountry,
        newAddress.recipientPhoneLocal,
      );

      // Prepare address object for submission
      const addressToSubmit = {
        street: newAddress.street,
        number: newAddress.number,
        apartment: newAddress.apartment,
        city: newAddress.city,
        region: newAddress.region,
        postalCode: newAddress.postalCode,
        recipientName: newAddress.recipientName,
        recipientPhone: recipientPhone,
        isDefault: false,
      };

      // Call the callback with the address
      await onAddressSelected(addressToSubmit);
      handleClose();
    } catch (err) {
      setError(err.message || "Error al agregar dirección");
    }
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    setError(null);
  };

  return {
    selectedAddressId,
    showForm,
    newAddress,
    error,
    handleSelectAddress,
    handleAddressFormChange,
    handleAddNewAddress,
    handleClose,
    toggleForm,
  };
};
