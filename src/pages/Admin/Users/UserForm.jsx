import React from "react";
import { FiPlus } from "react-icons/fi";
import { AddressForm } from "../../../components/common";
import { useUserForm } from "../../../hooks";
import { sanitizeInput } from "../../../services/validationService";

/**
 * UserForm component for creating and editing users.
 * Displays current user data or empty fields if not present.
 * Allows editing of all user fields except metadata and statistics.
 */
const UserForm = ({
  initialUser = null,
  saving = false,
  error = null,
  onCancel,
  onSubmit,
  buttonLabel = "Guardar",
}) => {
  const {
    form,
    handleChange,
    handleAddressChange,
    handleAddAddress,
    handleRemoveAddress,
    getFormData,
  } = useUserForm(initialUser);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizeInput(value);
    const newEvent = {
      ...e,
      target: { ...e.target, value: sanitizedValue, name },
    };
    handleChange(newEvent);
  };

  const handlePhoneChange = (e) => {
    const { name, value } = e.target;
    const cleanValue =
      name === "phoneCountry"
        ? value.replace(/[^0-9+]/g, "")
        : value.replace(/[^0-9]/g, "");
    const newEvent = {
      ...e,
      target: { ...e.target, value: cleanValue, name },
    };
    handleChange(newEvent);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = getFormData();
    onSubmit(formData);
  };

  return (
    <form
      className="space-y-4 flex-1 flex flex-col overflow-hidden"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col flex-1 overflow-y-auto pr-2">
        <div className="mb-3">
          <label className="font-bold text-blue-2 mb-1.5 block">
            Nombre <span className="text-gold">*</span>
          </label>
          <input
            name="displayName"
            type="text"
            placeholder="Nombre"
            value={form.displayName}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-2 rounded-lg focus:border-gold focus:outline-none"
            minLength={2}
            maxLength={60}
            required
          />
        </div>
        <div className="flex flex-col md:flex-row gap-4 mb-3">
          <div className="flex-1">
            <label className="font-bold text-blue-2 mb-1.5">
              Correo electrónico <span className="text-gold">*</span>
            </label>
            <input
              name="email"
              type="email"
              placeholder="Correo electrónico"
              value={form.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-2 rounded-lg focus:border-gold focus:outline-none mb-2 md:mb-0"
              required
              pattern="^[^@\s]+@[^@\s]+\.[^@\s]+$"
            />
          </div>
          <div className="flex-1">
            <label className="font-bold text-blue-2 mb-1">Teléfono</label>
            <div className="flex gap-2">
              <input
                name="phoneCountry"
                type="text"
                value={form.phoneCountry}
                onChange={handlePhoneChange}
                className="w-24 px-3 py-2 border border-gray-2 rounded-lg focus:border-gold focus:outline-none mb-2 md:mb-0"
                pattern="^\+\d{1,4}$"
                maxLength={5}
                minLength={2}
                placeholder="+549"
                title="Código de país en formato internacional."
                required={false}
              />
              <input
                name="phoneLocal"
                type="text"
                value={form.phoneLocal}
                onChange={handlePhoneChange}
                className="flex-1 px-3 py-2 border border-gray-2 rounded-lg focus:border-gold focus:outline-none mb-2 md:mb-0"
                pattern="^\d{6,12}$"
                maxLength={12}
                minLength={6}
                placeholder="Ej: 1123456789"
                title="Número local internacional, entre 6 y 12 dígitos, sin código de país."
                required={false}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 mb-3">
          <div className="flex-1">
            <label className="font-bold text-blue-2 mb-1">Estado</label>
            <select
              name="accountStatus"
              value={form.accountStatus}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-2 rounded-lg focus:border-gold focus:outline-none mb-2 md:mb-0"
            >
              <option value="active">Activo</option>
              <option value="suspended">Suspendido</option>
            </select>
          </div>
        </div>

        <div className="mb-3 mt-2">
          <label className="font-bold text-blue-2 mb-1.5 block">
            Direcciones de envío
          </label>
          {/* Only show address forms if there are addresses being edited */}
          {form.addresses.length > 0 && (
            <>
              {form.addresses.map((addr, idx) => (
                <AddressForm
                  key={idx}
                  addr={addr}
                  idx={idx}
                  onChange={handleAddressChange}
                  onRemove={handleRemoveAddress}
                  canRemove={form.addresses.length > 1}
                />
              ))}
            </>
          )}
          <div className="flex justify-center">
            <button
              type="button"
              className="flex items-center gap-2 px-3 py-2 rounded-full bg-blue-2 text-white text-xs font-bold shadow-md hover:bg-gold transition-colors mt-0 mb-2 w-fit"
              onClick={handleAddAddress}
            >
              <FiPlus className="h-5 w-5" />
              Agregar dirección
            </button>
          </div>
        </div>
        {error && (
          <div className="text-red-500 font-bold text-center mt-2">{error}</div>
        )}
      </div>
      <div className="flex justify-end gap-2 mt-4 shrink-0 pt-2 border-t border-gray-2">
        <button
          type="button"
          className="px-4 py-2 rounded-lg bg-gray-2 text-blue-2 font-bold hover:bg-blue-2 hover:text-white cursor-pointer transition-colors"
          onClick={onCancel}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className={`px-4 py-2 rounded-lg font-bold transition-colors ${
            saving
              ? "bg-gray-2 text-gray-3 cursor-not-allowed"
              : "bg-blue-2 text-white hover:bg-gold cursor-pointer"
          }`}
          disabled={saving}
        >
          {saving ? "Guardando..." : buttonLabel}
        </button>
      </div>
    </form>
  );
};

export default UserForm;
