import React, { useState } from "react";
import PropTypes from "prop-types";
import { IoIosClose } from "react-icons/io";
import AddressForm from "../forms/AddressForm";
import {
  splitPhoneNumber,
  combinePhoneNumber,
} from "../../../services/users/userFormService";

/**
 * Modal for adding a default address when required for checkout
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {function} props.onClose - Callback when modal closes
 * @param {function} props.onAddressAdded - Callback when address is successfully added
 * @param {boolean} [props.isLoading=false] - Whether action is loading
 */
const AddressRequiredModal = ({
  isOpen,
  onClose,
  onAddressAdded,
  isLoading = false,
}) => {
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

  if (!isOpen) return null;

  const handleAddressChange = (idx, event) => {
    const { name, value, type, checked } = event.target;
    setAddress((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError(null);
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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-family-sora">
      {/* Backdrop */}
      <div
        className="fixed inset-0 backdrop-blur-sm"
        style={{ backgroundColor: "rgba(38,78,96,0.45)" }}
        onClick={handleClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-fadeInScale"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-2">
            <h2 className="text-2xl font-bold font-family-comfortaa text-blue-1">
              Agregar Dirección
            </h2>
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="cursor-pointer text-blue-2 hover:text-gold hover:scale-150 transition-all z-10 disabled:opacity-50"
              aria-label="Cerrar modal"
            >
              <IoIosClose size={26} />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto p-6 max-h-[calc(90vh-200px)]">
            {/* Message */}
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-blue-2 text-sm">
                Necesitas tener al menos una dirección cargada como favorita
                para poder realizar la compra. Por favor completa los siguientes
                datos:
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Address Form */}
            <AddressForm
              addr={address}
              idx={0}
              onChange={handleAddressChange}
              onRemove={() => {}}
              canRemove={false}
            />
          </div>

          {/* Footer */}
          <div className="border-t border-gray-2 p-6 flex justify-end gap-3">
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="px-6 py-2 bg-white text-blue-2 border-2 border-blue-2 rounded-lg font-family-sora hover:bg-blue-2 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              onClick={handleAddAddress}
              disabled={isLoading}
              className="px-6 py-2 bg-blue-2 text-white rounded-lg font-family-sora hover:bg-gold hover:text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? "Agregando..." : "Agregar Dirección"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

AddressRequiredModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAddressAdded: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default AddressRequiredModal;
