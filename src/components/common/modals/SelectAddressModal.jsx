import React from "react";
import PropTypes from "prop-types";
import { IoIosClose } from "react-icons/io";
import AddressForm from "../forms/AddressForm";
import { useSelectAddressModal } from "../../../hooks/checkout/useSelectAddressModal";

/**
 * Modal for selecting or editing a delivery address in checkout
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {function} props.onClose - Callback when modal closes
 * @param {function} props.onAddressSelected - Callback when address is selected (receives address object)
 * @param {Array} props.addresses - Array of available addresses
 * @param {Object} props.currentAddress - Currently selected address
 * @param {boolean} [props.isLoading=false] - Whether action is loading
 */
const SelectAddressModal = ({
  isOpen,
  onClose,
  onAddressSelected,
  addresses = [],
  currentAddress = null,
  isLoading = false,
}) => {
  const {
    selectedAddressId,
    showForm,
    newAddress,
    error,
    handleSelectAddress,
    handleAddressFormChange,
    handleAddNewAddress,
    handleClose,
    toggleForm,
  } = useSelectAddressModal({
    onClose,
    onAddressSelected,
    currentAddress,
    isOpen,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-family-sora">
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
              {showForm ? "Agregar Nueva Dirección" : "Seleccionar Dirección"}
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
          <div className="overflow-y-auto p-6 max-h-[calc(90vh-150px)]">
            {!showForm ? (
              <>
                {/* Existing Addresses List */}
                {addresses && addresses.length > 0 && (
                  <div className="mb-6 space-y-3">
                    <p className="text-sm font-semibold text-blue-1 mb-3">
                      Mis Direcciones:
                    </p>
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        onClick={() => handleSelectAddress(addr)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedAddressId === addr.id
                            ? "border-blue-1 bg-blue-50"
                            : "border-gray-2 hover:border-blue-2"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="address"
                            checked={selectedAddressId === addr.id}
                            onChange={() => {}}
                            className="mt-1 w-4 h-4"
                            disabled={isLoading}
                          />
                          <div className="flex-1">
                            <p className="font-bold text-blue-1">
                              {addr.street} {addr.number}
                              {addr.apartment && ` - ${addr.apartment}`}
                            </p>
                            <p className="text-sm text-blue-2">
                              {addr.city}, {addr.region}
                            </p>
                            <p className="text-sm text-blue-2">
                              CP: {addr.postalCode}
                            </p>
                            <p className="text-xs text-gray-600 mt-2">
                              {addr.recipientName}
                            </p>
                            <p className="text-xs text-gray-600">
                              Tel: {addr.recipientPhone}
                            </p>
                            {addr.isDefault && (
                              <span className="inline-block mt-2 px-2 py-1 bg-gold text-black text-xs rounded font-semibold">
                                Por defecto
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add New Address Button */}
                <button
                  onClick={toggleForm}
                  disabled={isLoading}
                  className="w-full mt-4 py-2 px-4 bg-blue-2 text-white rounded-lg font-family-sora hover:bg-blue-1 transition-colors disabled:opacity-50"
                >
                  + Agregar Nueva Dirección
                </button>

                {error && (
                  <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Add Address Form */}
                <div className="mb-6 p-4 bg-blue-50 border border-blue-2 rounded-lg">
                  <p className="text-blue-2 text-sm">
                    Completa los datos de la nueva dirección de entrega:
                  </p>
                </div>

                <AddressForm
                  addr={newAddress}
                  idx={0}
                  onChange={handleAddressFormChange}
                  onRemove={() => {}}
                  canRemove={false}
                />

                {error && (
                  <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={toggleForm}
                    disabled={isLoading}
                    className="flex-1 py-2 px-4 border-2 border-gray-2 text-blue-1 rounded-lg font-family-sora hover:border-blue-2 transition-colors disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleAddNewAddress}
                    disabled={isLoading}
                    className="flex-1 py-2 px-4 bg-gold text-black rounded-lg font-family-sora hover:bg-blue-2 hover:text-white transition-colors disabled:opacity-50"
                  >
                    {isLoading ? "Guardando..." : "Guardar Dirección"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

SelectAddressModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAddressSelected: PropTypes.func.isRequired,
  addresses: PropTypes.array,
  currentAddress: PropTypes.object,
  isLoading: PropTypes.bool,
};

export default SelectAddressModal;
