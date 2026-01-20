import React, { useEffect } from "react";
import { FaTrash, FaCheck } from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";
import { MdWarning } from "react-icons/md";
import { useAddressValidation } from "../../../hooks/forms/useAddressValidation";

/**
 * AddressForm component for editing a single address in the user form.
 * Includes Mapbox Geocoding validation to ensure addresses are real.
 * Receives address data, index, and change/remove handlers as props.
 */
const AddressForm = ({ addr, idx, onChange, onRemove, canRemove }) => {
  const {
    validating,
    validationErrors,
    validationSuccess,
    validateAddressObject,
    clearValidation,
  } = useAddressValidation();
  const fieldId = `address-${idx}`;

  // Handle number field validation - restrict to max 4 digits (9999)
  const handleNumberChange = (e) => {
    const value = e.target.value;

    // If the value is empty or a valid number within range, allow it
    if (
      value === "" ||
      (value && parseInt(value) >= 1 && parseInt(value) <= 9999)
    ) {
      onChange(idx, e);
    } else if (value && parseInt(value) > 9999) {
      // If value exceeds max, create a new event with the truncated value
      const newEvent = {
        ...e,
        target: {
          ...e.target,
          value: "9999",
          name: "number",
        },
      };
      onChange(idx, newEvent);
    }
  };

  // Auto-validate when address fields change (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      // Only validate if ALL required fields are filled and not empty strings
      // Ensure fields are strings before calling .trim()
      const hasAllFields =
        typeof addr.street === "string" &&
        addr.street.trim() &&
        addr.number &&
        typeof addr.city === "string" &&
        addr.city.trim() &&
        typeof addr.region === "string" &&
        addr.region.trim() &&
        typeof addr.postalCode === "string" &&
        addr.postalCode.trim();

      if (hasAllFields) {
        validateAddressObject(addr, fieldId);
      } else {
        clearValidation(fieldId);
      }
    }, 1500); // 1500ms debounce for stricter validation

    return () => clearTimeout(timer);
  }, [
    addr.street,
    addr.number,
    addr.city,
    addr.region,
    addr.postalCode,
    fieldId,
    validateAddressObject,
    clearValidation,
  ]);

  return (
    <div className="rounded-2xl shadow-md border border-gray-2 p-5 mb-4 bg-white/80">
      <div className="flex flex-col md:flex-row gap-4 mb-2">
        <div className="w-full flex flex-col">
          <label className="text-sm font-bold text-blue-2 mb-2 block h-5">
            Calle
          </label>
          <input
            name="street"
            type="text"
            placeholder="Calle"
            value={addr.street || ""}
            onChange={(e) => onChange(idx, e)}
            className="w-full px-4 py-2 border border-gray-2 rounded-lg focus:border-gold focus:outline-none bg-white"
            minLength={2}
            maxLength={100}
            required
          />
        </div>
        <div className="w-full flex flex-col">
          <label className="text-sm font-bold text-blue-2 mb-2 block h-5">
            Número
          </label>
          <input
            name="number"
            type="number"
            placeholder="Número"
            value={addr.number || ""}
            onChange={handleNumberChange}
            className="w-full px-4 py-2 border border-gray-2 rounded-lg focus:border-gold focus:outline-none bg-white"
            min={1}
            max={9999}
            required
          />
        </div>
        <div className="w-full flex flex-col">
          <label className="text-sm font-bold text-blue-2 mb-2 block h-5">
            Depto (opcional)
          </label>
          <input
            name="apartment"
            type="text"
            placeholder="Depto (opcional)"
            value={addr.apartment || ""}
            onChange={(e) => onChange(idx, e)}
            className="w-full px-4 py-2 border border-gray-2 rounded-lg focus:border-gold focus:outline-none bg-white"
            maxLength={20}
          />
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4 mb-2">
        <div className="w-full flex flex-col">
          <label className="text-sm font-bold text-blue-2 mb-2 block h-5">
            Ciudad
          </label>
          <input
            name="city"
            type="text"
            placeholder="Ciudad"
            value={addr.city || ""}
            onChange={(e) => onChange(idx, e)}
            className="w-full px-4 py-2 border border-gray-2 rounded-lg focus:border-gold focus:outline-none bg-white"
            minLength={2}
            maxLength={50}
            required
          />
        </div>
        <div className="w-full flex flex-col">
          <label className="text-sm font-bold text-blue-2 mb-2 block h-5">
            Barrio
          </label>
          <input
            name="region"
            type="text"
            placeholder="Barrio"
            value={addr.region || ""}
            onChange={(e) => onChange(idx, e)}
            className="w-full px-4 py-2 border border-gray-2 rounded-lg focus:border-gold focus:outline-none bg-white"
            minLength={2}
            maxLength={50}
            required
          />
        </div>
        <div className="w-full flex flex-col">
          <label className="text-sm font-bold text-blue-2 mb-2 block h-5">
            Código Postal
          </label>
          <input
            name="postalCode"
            type="text"
            placeholder="Código Postal"
            value={addr.postalCode || ""}
            onChange={(e) => onChange(idx, e)}
            className="w-full px-4 py-2 border border-gray-2 rounded-lg focus:border-gold focus:outline-none bg-white"
            maxLength={8}
          />
        </div>
      </div>

      {/* Address Validation Status - Only show when all fields are complete */}
      {typeof addr.street === "string" &&
        addr.street.trim() &&
        addr.number &&
        typeof addr.city === "string" &&
        addr.city.trim() &&
        typeof addr.region === "string" &&
        addr.region.trim() &&
        typeof addr.postalCode === "string" &&
        addr.postalCode.trim() &&
        (validating ||
          validationErrors[fieldId] ||
          validationSuccess[fieldId]) && (
          <div className="mb-3 p-3 rounded-lg">
            {validating && (
              <div className="flex items-center gap-2 text-blue-2">
                <ImSpinner2 className="animate-spin w-4 h-4" />
                <span className="text-sm">Validando dirección...</span>
              </div>
            )}
            {validationErrors[fieldId] && !validating && (
              <div className="flex items-center gap-2 text-red-500 bg-red-50">
                <MdWarning className="w-4 h-4 shrink-0" />
                <span className="text-sm">{validationErrors[fieldId]}</span>
              </div>
            )}
            {validationSuccess[fieldId] && !validating && (
              <div className="flex items-center gap-2 text-green-600 bg-green-50">
                <FaCheck className="w-4 h-4 shrink-0" />
                <span className="text-sm">{validationSuccess[fieldId]}</span>
              </div>
            )}
          </div>
        )}

      {/* Recipient Data Section */}
      <div className="mb-2">
        <label className="text-m font-bold text-blue-1 mb-2 mt-4 block">
          Datos del destinatario
        </label>
        <div className="flex flex-col md:flex-row gap-2">
          <div className="w-full md:w-1/2 flex flex-col">
            <label className="text-sm font-bold text-blue-2 mb-2 block h-5">
              Nombre
            </label>
            <input
              name="recipientName"
              type="text"
              placeholder="Nombre"
              value={addr.recipientName || ""}
              onChange={(e) => onChange(idx, e)}
              className="w-full px-4 py-2 border border-gray-2 rounded-lg focus:border-gold focus:outline-none bg-white"
              minLength={2}
              maxLength={60}
              required
            />
          </div>
          <div className="w-full md:w-1/4 flex flex-col">
            <label className="text-sm font-bold text-blue-2 mb-2 block h-5">
              Código País
            </label>
            <input
              name="recipientPhoneCountry"
              type="text"
              value={addr.recipientPhoneCountry || "+549"}
              onChange={(e) => onChange(idx, e)}
              className="w-full px-4 py-2 border border-gray-2 rounded-lg focus:border-gold focus:outline-none bg-white"
              pattern="^\+\d{1,4}$"
              maxLength={5}
              minLength={2}
              title="Código de país en formato internacional."
              required
            />
          </div>
          <div className="w-full md:w-1/4 flex flex-col">
            <label className="text-sm font-bold text-blue-2 mb-2 block h-5">
              Teléfono
            </label>
            <input
              name="recipientPhoneLocal"
              type="text"
              placeholder="Teléfono"
              value={addr.recipientPhoneLocal || ""}
              onChange={(e) => onChange(idx, e)}
              className="w-full px-4 py-2 border border-gray-2 rounded-lg focus:border-gold focus:outline-none bg-white"
              pattern="^\d{6,12}$"
              maxLength={12}
              minLength={6}
              title="Número local internacional, entre 6 y 12 dígitos, sin código de país."
              required
            />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 mt-2">
        {/* Custom styled checkbox for 'Default Address' */}
        <label className="flex items-center cursor-pointer select-none group relative">
          <input
            type="checkbox"
            name="isDefault"
            checked={!!addr.isDefault}
            onChange={(e) => onChange(idx, e)}
            className="sr-only peer"
          />
          <span className="w-5 h-5 flex items-center justify-center rounded border-2 border-gold bg-white transition-colors peer-checked:bg-gold peer-checked:border-gold group-hover:border-blue-2">
            {/* Check icon appears when checked */}
            {addr.isDefault && <FaCheck className="w-3 h-3 text-white" />}
          </span>
          <span className="ml-2 text-blue-2 text-sm">Dirección favorita</span>
        </label>
        {canRemove && (
          <button
            type="button"
            className="ml-auto p-2 flex items-center justify-center group"
            onClick={() => onRemove(idx)}
            title="Eliminar dirección"
          >
            <FaTrash className="w-4 h-4 text-red-500 transition-transform duration-150 group-hover:scale-125" />
          </button>
        )}
      </div>
    </div>
  );
};

export default AddressForm;
