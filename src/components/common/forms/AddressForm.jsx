import React from "react";
import { FaTrash, FaCheck } from "react-icons/fa";

/**
 * AddressForm component for editing a single address in the user form.
 * Receives address data, index, and change/remove handlers as props.
 */
const AddressForm = ({ addr, idx, onChange, onRemove, canRemove }) => (
  <div className="rounded-2xl shadow-md border border-gray-2 p-5 mb-4 bg-white/80">
    <div className="flex flex-col md:flex-row gap-4 mb-2">
      <input
        name="street"
        type="text"
        placeholder="Calle"
        value={addr.street}
        onChange={(e) => onChange(idx, e)}
        className="w-full px-4 py-2 border border-gray-2 rounded-lg focus:border-gold focus:outline-none bg-white"
        minLength={2}
        maxLength={80}
        required
      />
      <input
        name="number"
        type="number"
        placeholder="Número"
        value={addr.number || ""}
        onChange={(e) => onChange(idx, e)}
        className="w-full px-4 py-2 border border-gray-2 rounded-lg focus:border-gold focus:outline-none bg-white"
        min={1}
        max={99999}
        required
      />
      <input
        name="apartment"
        type="text"
        placeholder="Depto (opcional)"
        value={addr.apartment}
        onChange={(e) => onChange(idx, e)}
        className="w-full px-4 py-2 border border-gray-2 rounded-lg focus:border-gold focus:outline-none bg-white"
        maxLength={40}
      />
    </div>
    <div className="flex flex-col md:flex-row gap-4 mb-2">
      <input
        name="city"
        type="text"
        placeholder="Ciudad"
        value={addr.city}
        onChange={(e) => onChange(idx, e)}
        className="w-full px-4 py-2 border border-gray-2 rounded-lg focus:border-gold focus:outline-none bg-white"
        minLength={2}
        maxLength={60}
        required
      />
      <input
        name="region"
        type="text"
        placeholder="Barrio"
        value={addr.region}
        onChange={(e) => onChange(idx, e)}
        className="w-full px-4 py-2 border border-gray-2 rounded-lg focus:border-gold focus:outline-none bg-white"
        minLength={2}
        maxLength={60}
        required
      />
      <input
        name="postalCode"
        type="text"
        placeholder="Código Postal"
        value={addr.postalCode}
        onChange={(e) => onChange(idx, e)}
        className="w-full px-4 py-2 border border-gray-2 rounded-lg focus:border-gold focus:outline-none bg-white"
        maxLength={20}
      />
    </div>
    {/* country field removed as per new structure */}
    <div className="mb-2">
      <label className="text-sm font-bold text-blue-2 mb-2 block">
        Datos del destinatario
      </label>
      <div className="flex flex-col md:flex-row gap-2">
        <input
          name="recipientName"
          type="text"
          placeholder="Nombre"
          value={addr.recipientName}
          onChange={(e) => onChange(idx, e)}
          className="w-full md:w-3/5 px-4 py-2 border border-gray-2 rounded-lg focus:border-gold focus:outline-none bg-white"
          minLength={2}
          maxLength={60}
          required
        />
        <input
          name="recipientPhoneCountry"
          type="text"
          value={addr.recipientPhoneCountry || "+549"}
          onChange={(e) => onChange(idx, e)}
          className="w-full md:w-1/10 px-3 py-2 border border-gray-2 rounded-lg focus:border-gold focus:outline-none bg-white text-sm"
          pattern="^\+\d{1,4}$"
          maxLength={5}
          minLength={2}
          title="Código de país en formato internacional."
          required
        />
        <input
          name="recipientPhoneLocal"
          type="text"
          placeholder="Teléfono"
          value={addr.recipientPhoneLocal || ""}
          onChange={(e) => onChange(idx, e)}
          className="w-full md:w-3/10 px-3 py-2 border border-gray-2 rounded-lg focus:border-gold focus:outline-none bg-white text-sm"
          pattern="^\d{6,12}$"
          maxLength={12}
          minLength={6}
          title="Número local internacional, entre 6 y 12 dígitos, sin código de país."
          required
        />
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

export default AddressForm;
