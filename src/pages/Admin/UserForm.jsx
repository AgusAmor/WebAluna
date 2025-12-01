import React, { useState, useEffect } from "react";
import { FiPlus } from "react-icons/fi";
import AddressForm from "../../components/common/AddressForm";

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
  // Template for an empty address object
  const emptyAddress = {
    id: `addr-${Date.now()}`,
    street: "",
    apartment: "",
    city: "",
    region: "",
    postalCode: "",
    isDefault: false,
    recipientName: "",
    recipientPhone: "",
  };

  // Main form state for user fields
  const [form, setForm] = useState({
    displayName: "",
    email: "",
    phone: "",
    phoneCountry: "+549",
    phoneLocal: "",
    accountStatus: "active",
    role: "user",
    admin: false,
    addresses: [emptyAddress],
  });

  // Populate form state with initialUser data or reset to empty if not present
  useEffect(() => {
    if (initialUser) {
      // Split phone number from E.164
      let phoneCountry = "+549";
      let phoneLocal = "";
      if (initialUser.phone && /^\+\d{8,15}$/.test(initialUser.phone)) {
        const match = initialUser.phone.match(/^(\+\d{1,3})(\d{6,12})$/);
        if (match) {
          phoneCountry = match[1];
          phoneLocal = match[2];
        }
      }
      setForm({
        displayName: initialUser.displayName || "",
        email: initialUser.email || "",
        phone: initialUser.phone || "",
        phoneCountry,
        phoneLocal,
        accountStatus: initialUser.accountStatus || "active",
        role: initialUser.role || "user",
        admin: !!initialUser.admin,
        addresses:
          Array.isArray(initialUser.addresses) &&
          initialUser.addresses.length > 0
            ? initialUser.addresses.map((a, i) => ({
                ...emptyAddress,
                ...a,
                id: a.id || `addr-${i + 1}`,
              }))
            : [emptyAddress],
      });
    } else {
      setForm({
        displayName: "",
        email: "",
        phone: "",
        phoneCountry: "+549",
        phoneLocal: "",
        accountStatus: "active",
        role: "user",
        admin: false,
        addresses: [emptyAddress],
      });
    }
    // eslint-disable-next-line
  }, [initialUser]);
  // Handle changes for main user fields
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "role") {
      setForm((prev) => ({
        ...prev,
        role: value,
        admin: value === "admin",
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  // Handle changes for address fields, including setting default address
  const handleAddressChange = (idx, e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => {
      let addresses = prev.addresses.map((addr, i) =>
        i === idx
          ? { ...addr, [name]: type === "checkbox" ? checked : value }
          : addr
      );
      // If isDefault is checked, unset isDefault for all other addresses
      if (name === "isDefault" && checked) {
        addresses = addresses.map((addr, i) => ({
          ...addr,
          isDefault: i === idx,
        }));
      }
      // If after change none is default, and only one address, set it as default
      if (addresses.length === 1 && !addresses[0].isDefault) {
        addresses[0].isDefault = true;
      }
      return { ...prev, addresses };
    });
  };

  // Add a new empty address to the addresses array
  const addAddress = () => {
    setForm((prev) => {
      const isFirst =
        !prev.addresses ||
        prev.addresses.length === 0 ||
        (prev.addresses.length === 1 &&
          Object.values(prev.addresses[0]).every(
            (v) => v === "" || v === false || v === null
          ));
      const newAddress = {
        ...emptyAddress,
        id: `addr-${Date.now()}`,
        isDefault: isFirst,
      };
      let addresses = [];
      if (isFirst) {
        addresses = [newAddress];
      } else {
        addresses = [...prev.addresses, newAddress];
      }
      return {
        ...prev,
        addresses,
      };
    });
  };

  // Remove an address from the addresses array, ensuring at least one remains
  const removeAddress = (idx) => {
    setForm((prev) => {
      const addresses = prev.addresses.filter((_, i) => i !== idx);
      return {
        ...prev,
        addresses: addresses.length ? addresses : [emptyAddress],
      };
    });
  };

  // Handle form submission and pass form data to parent
  const handleSubmit = (e) => {
    e.preventDefault();
    // Join phoneCountry and phoneLocal into E.164 phone
    let phone = "";
    if (form.phoneCountry && form.phoneLocal) {
      phone = `${form.phoneCountry}${form.phoneLocal}`;
    }
    onSubmit({
      ...form,
      phone,
    });
  };

  return (
    <form className="space-y-4 flex-1" onSubmit={handleSubmit}>
      <div className="flex flex-col h-[60vh] overflow-y-auto">
        <div className="mb-3">
          <label className="font-bold text-blue-2 mb-1.5 block">Nombre</label>
          <input
            name="displayName"
            type="text"
            placeholder="Nombre"
            value={form.displayName}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-2 rounded-lg focus:border-gold focus:outline-none"
            minLength={2}
            maxLength={60}
            required
          />
        </div>
        <div className="flex flex-col md:flex-row gap-4 mb-3">
          <div className="flex-1">
            <label className="font-bold text-blue-2 mb-1.5">
              Correo electrónico
            </label>
            <input
              name="email"
              type="email"
              placeholder="Correo electrónico"
              value={form.email}
              onChange={handleChange}
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
                onChange={handleChange}
                className="w-24 px-3 py-2 border border-gray-2 rounded-lg focus:border-gold focus:outline-none mb-2 md:mb-0"
                pattern="^\+\d{1,4}$"
                maxLength={5}
                minLength={2}
                title="Código de país en formato internacional."
                required={false}
              />
              <input
                name="phoneLocal"
                type="text"
                value={form.phoneLocal}
                onChange={handleChange}
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
            <label className="font-bold text-blue-2 mb-1">Rol</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-2 rounded-lg focus:border-gold focus:outline-none mb-2 md:mb-0"
            >
              <option value="user">Usuario</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
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
              <option value="deleted">Eliminado</option>
            </select>
          </div>
        </div>

        <div className="mb-3 mt-2">
          <label className="font-bold text-blue-2 mb-1.5 block">
            Direcciones de envío
          </label>
          {form.addresses.map((addr, idx) => (
            <AddressForm
              key={addr.id}
              addr={addr}
              idx={idx}
              onChange={handleAddressChange}
              onRemove={removeAddress}
              canRemove={form.addresses.length > 1}
            />
          ))}
          <div className="flex justify-center">
            <button
              type="button"
              className="flex items-center gap-2 px-3 py-2 rounded-full bg-blue-2 text-white text-xs font-bold shadow-md hover:bg-gold transition-colors mt-0 mb-2 w-fit"
              onClick={addAddress}
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
      <div className="flex justify-end gap-2 mt-4">
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
