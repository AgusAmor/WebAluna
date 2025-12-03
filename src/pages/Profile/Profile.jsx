import React, { useEffect, useState } from "react";
import { MdEdit } from "react-icons/md";
import { FaTrash, FaKey } from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "firebase/auth";
import { useAuth } from "../../context/AuthContext";
import { fetchUserById, updateUser } from "../../services/firebaseUserService";
import {
  deleteCurrentAccount,
  requestPasswordReset as requestPasswordResetService,
} from "../../services/accountService";
import { ConfirmationModal } from "../../components/common";
import { IoIosWarning } from "react-icons/io";
import AddressForm from "../../components/common/AddressForm";

const Profile = () => {
  const { user, logout, updateUserProfile, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editFormData, setEditFormData] = useState(null);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [showResetPasswordConfirm, setShowResetPasswordConfirm] =
    useState(false);
  const [showDeleteAccountConfirm, setShowDeleteAccountConfirm] =
    useState(false);

  /**
   * Fetches user data from Firestore when component mounts or user changes
   */
  useEffect(() => {
    const fetchData = async () => {
      if (user && user.uid) {
        try {
          const data = await fetchUserById(user.uid);
          // Ensure addresses is always an array
          const userData = {
            ...data,
            addresses: data.addresses || [],
          };
          setUserData(userData);

          // Split phone number into country code and local number
          let phoneCountry = "+549";
          let phoneLocal = "";
          if (data.phone && /^\+\d{8,15}$/.test(data.phone)) {
            const match = data.phone.match(/^(\+\d{1,3})(\d{6,12})$/);
            if (match) {
              phoneCountry = match[1];
              phoneLocal = match[2];
            }
          }

          setEditFormData({
            ...userData,
            phoneCountry,
            phoneLocal,
          });
        } catch (e) {
          console.error("Error fetching user profile:", e);
          setUserData(null);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  /**
   * Handles address field changes in edit mode
   */
  const handleAddressChange = (idx, e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData((prev) => {
      const newAddresses = [...(prev.addresses || [])];
      newAddresses[idx] = {
        ...newAddresses[idx],
        [name]: type === "checkbox" ? checked : value,
      };

      if (type === "checkbox" && checked) {
        newAddresses.forEach((addr, i) => {
          if (i !== idx) addr.isDefault = false;
        });
      }

      return { ...prev, addresses: newAddresses };
    });
  };

  /**
   * Saves profile changes to Firestore
   */
  const handleSaveProfile = async () => {
    setError(null);
    setSuccess(null);
    setIsSaving(true);

    try {
      if (!user) throw new Error("Usuario no autenticado");

      const token = await user.getIdToken();
      const updateData = {
        displayName: editFormData.displayName,
        email: editFormData.email,
        phone: `${editFormData.phoneCountry}${editFormData.phoneLocal}`,
        addresses: editFormData.addresses || [],
      };

      await updateUser(user.uid, updateData, token);

      // Update Firebase Auth displayName so subsequent operations don't fail
      await updateProfile(user, {
        displayName: editFormData.displayName,
      });

      // Reload user data from server after successful update
      const updatedData = await fetchUserById(user.uid);
      // Ensure addresses is always an array
      const userDataWithAddresses = {
        ...updatedData,
        addresses: updatedData.addresses || [],
      };
      setUserData(userDataWithAddresses);

      // Split phone number into country code and local number for display
      let phoneCountry = "+549";
      let phoneLocal = "";
      if (updatedData.phone && /^\+\d{8,15}$/.test(updatedData.phone)) {
        const match = updatedData.phone.match(/^(\+\d{1,3})(\d{6,12})$/);
        if (match) {
          phoneCountry = match[1];
          phoneLocal = match[2];
        }
      }

      setEditFormData({
        ...userDataWithAddresses,
        phoneCountry,
        phoneLocal,
      });

      // Update user profile in AuthContext so header and other components reflect changes
      updateUserProfile({
        displayName: updatedData.displayName,
        email: updatedData.email,
        phone: updatedData.phone,
        addresses: updatedData.addresses,
      });

      // Refresh the complete user object to ensure clean state for next edit
      await refreshUser();

      setIsEditingProfile(false);
      setSuccess("✓ Cambios guardados exitosamente");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error saving profile:", err);
      // Show generic error message without specific details
      setError("Error al guardar los cambios. Intenta nuevamente.");
      setTimeout(() => setError(null), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Cancels edit mode and reverts changes
   */
  const handleCancelEdit = () => {
    setEditFormData(userData);
    setIsEditingProfile(false);
    setError(null);
  };

  /**
   * Handles password reset request - opens confirmation modal
   */
  const handleResetPasswordClick = () => {
    setShowResetPasswordConfirm(true);
  };

  /**
   * Confirms password reset after modal confirmation
   */
  const confirmResetPassword = async () => {
    setShowResetPasswordConfirm(false);
    setIsResettingPassword(true);
    try {
      await requestPasswordResetService(userData?.email);
      setSuccess(
        "Email de recuperación enviado. Revisa tu bandeja de entrada (también el correo no deseado o SPAM)."
      );
      setTimeout(() => setSuccess(null), 4000);
    } catch (err) {
      console.error("Error resetting password:", err);
      // Show generic error message without specific details
      setError("Error al enviar el email. Intenta nuevamente.");
      setTimeout(() => setError(null), 4000);
    } finally {
      setIsResettingPassword(false);
    }
  };

  /**
   * Handles account deletion request - opens confirmation modal
   */
  const handleDeleteAccountClick = () => {
    setShowDeleteAccountConfirm(true);
  };

  /**
   * Confirms account deletion after modal confirmation
   */
  const confirmDeleteAccount = async () => {
    setShowDeleteAccountConfirm(false);
    setIsDeletingAccount(true);
    try {
      // Call account service to handle deletion logic
      // This deletes from both Firestore and Firebase Auth, and signs out
      await deleteCurrentAccount(user);

      // Show success message and redirect immediately
      // Don't use setState after redirect since component will unmount
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Error deleting account:", err);
      // Show generic error message without specific details
      setError("Error al eliminar la cuenta. Intenta nuevamente.");
      setIsDeletingAccount(false);
      setTimeout(() => setError(null), 4000);
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-3">
        <div className="flex flex-col items-center gap-4">
          <ImSpinner2 className="animate-spin h-8 w-8 text-blue-2" />
          <span className="text-lg text-gray-1">Cargando perfil...</span>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-3">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-2">
            Error cargando perfil
          </h2>
          <p className="text-gray-1">
            No se pudo cargar tu información. Por favor intenta más tarde.
          </p>
        </div>
      </div>
    );
  }

  /**
   * Formats dates as dd/MM/yyyy HH:mm
   */
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";

    try {
      let date;

      if (dateStr && typeof dateStr === "object" && "seconds" in dateStr) {
        date = new Date(dateStr.seconds * 1000);
      } else if (
        dateStr &&
        typeof dateStr === "object" &&
        "_seconds" in dateStr
      ) {
        date = new Date(dateStr._seconds * 1000);
      } else if (typeof dateStr === "string") {
        date = new Date(dateStr);
      } else if (dateStr instanceof Date) {
        date = dateStr;
      } else {
        return "-";
      }

      if (isNaN(date.getTime())) {
        return "-";
      }

      return date.toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (err) {
      console.error("Error formatting date:", err);
      return "-";
    }
  };

  return (
    <div className="min-h-screen bg-gray-3">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 font-family-comfortaa text-blue-2">
            Mi Perfil
          </h1>
          <p className="text-gray-1">
            Gestiona tu información personal y direcciones
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Profile & Addresses */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold font-family-comfortaa text-blue-2">
                  Información Personal
                </h2>
                <button
                  onClick={() => {
                    if (isEditingProfile) {
                      handleCancelEdit();
                    } else {
                      setIsEditingProfile(true);
                    }
                  }}
                  className="text-blue-2 hover:text-blue-1 font-semibold text-sm transition-colors"
                  title={
                    isEditingProfile ? "Cancelar edición" : "Editar perfil"
                  }
                >
                  {isEditingProfile ? (
                    <p className="font-semibold text-red-400 hover:text-gold cursor-pointer transition-all duration-200">
                      Cancelar
                    </p>
                  ) : (
                    <div className="flex items-center gap-1 cursor-pointer text-gold hover:text-blue-1 transition-all duration-200">
                      <MdEdit className="inline-block text-xl" /> <p>Editar</p>
                    </div>
                  )}
                </button>
              </div>

              {isEditingProfile ? (
                // Edit Mode
                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="text-xs font-semibold text-gray-1 uppercase tracking-wide block mb-2">
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      value={editFormData?.displayName || ""}
                      onChange={(e) =>
                        setEditFormData((prev) => ({
                          ...prev,
                          displayName: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 border border-gray-2 rounded-lg focus:border-gold focus:outline-none"
                      placeholder="Tu nombre completo"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-xs font-semibold text-gray-1 uppercase tracking-wide block mb-2">
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      value={editFormData?.email || ""}
                      onChange={(e) =>
                        setEditFormData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 border border-gray-2 rounded-lg focus:border-gold focus:outline-none"
                      placeholder="tu@email.com"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="text-xs font-semibold text-gray-1 uppercase tracking-wide block mb-2">
                      Teléfono
                    </label>
                    <div className="flex gap-2">
                      {/* Country Code */}
                      <input
                        name="phoneCountry"
                        type="text"
                        value={editFormData?.phoneCountry || "+549"}
                        onChange={(e) =>
                          setEditFormData((prev) => ({
                            ...prev,
                            phoneCountry: e.target.value,
                          }))
                        }
                        className="w-24 px-3 py-3 border border-gray-2 rounded-lg focus:border-gold focus:outline-none text-sm"
                        pattern="^\+\d{1,4}$"
                        maxLength={5}
                        minLength={2}
                        placeholder="+549"
                        title="Código de país en formato internacional."
                      />
                      {/* Local Number */}
                      <input
                        name="phoneLocal"
                        type="text"
                        value={editFormData?.phoneLocal || ""}
                        onChange={(e) =>
                          setEditFormData((prev) => ({
                            ...prev,
                            phoneLocal: e.target.value,
                          }))
                        }
                        className="flex-1 px-4 py-3 border border-gray-2 rounded-lg focus:border-gold focus:outline-none"
                        pattern="^\d{6,12}$"
                        maxLength={12}
                        minLength={6}
                        placeholder="Ej: 1123456789"
                        title="Número local internacional, entre 6 y 12 dígitos, sin código de país."
                      />
                    </div>
                  </div>

                  {/* Status Message */}
                  {error && (
                    <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  {/* Save Button */}
                  <div className="flex gap-3 pt-4 border-t border-gray-2">
                    <button
                      onClick={handleCancelEdit}
                      disabled={isSaving}
                      className="flex-1 py-2 px-4 border border-gray-2 rounded-lg text-gray-1 hover:bg-gray-3 transition-colors font-semibold disabled:opacity-50"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="flex-1 py-2 px-4 bg-blue-2 text-white rounded-lg hover:bg-blue-1 transition-colors font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isSaving ? (
                        <>
                          <ImSpinner2 className="animate-spin h-4 w-4" />
                          Guardando...
                        </>
                      ) : (
                        "Guardar Cambios"
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="text-xs font-semibold text-gray-1 uppercase tracking-wide block mb-2">
                      Nombre Completo
                    </label>
                    <div className="px-4 py-3 border border-gray-2 rounded-lg bg-gray-3/50 font-medium text-blue-1">
                      {userData?.displayName || "No especificado"}
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-xs font-semibold text-gray-1 uppercase tracking-wide block mb-2">
                      Correo Electrónico
                    </label>
                    <div className="px-4 py-3 border border-gray-2 rounded-lg bg-gray-3/50 font-medium text-blue-1">
                      {userData?.email}
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="text-xs font-semibold text-gray-1 uppercase tracking-wide block mb-2">
                      Teléfono
                    </label>
                    <div className="px-4 py-3 border border-gray-2 rounded-lg bg-gray-3/50 font-medium">
                      {userData?.phone || "No especificado"}
                    </div>
                  </div>

                  {/* Account Status */}
                  <div>
                    <label className="text-xs font-semibold text-gray-1 uppercase tracking-wide block mb-2">
                      Estado de Cuenta
                    </label>
                    <div
                      className={`px-4 py-3 border rounded-lg font-medium text-center ${
                        userData?.accountStatus === "active"
                          ? "bg-green-100 text-green-700 border-green-300"
                          : "bg-red-100 text-red-700 border-red-300"
                      }`}
                    >
                      {userData?.accountStatus === "active"
                        ? "Activa"
                        : "Suspendida"}
                    </div>
                  </div>
                </div>
              )}

              {/* Account Metadata */}
              {!isEditingProfile && (
                <div className="mt-6 pt-6 border-t border-gray-2 grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-1 uppercase font-semibold mb-1">
                      Miembro desde
                    </p>
                    <p className="text-sm font-medium text-blue-2">
                      {formatDate(userData?.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-1 uppercase font-semibold mb-1">
                      Último login
                    </p>
                    <p className="text-sm font-medium text-blue-2">
                      {formatDate(userData?.lastLoginAt || userData?.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-1 uppercase font-semibold mb-1">
                      Verificación
                    </p>
                    <p
                      className={`text-sm font-medium ${
                        userData?.emailVerified
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {userData?.emailVerified ? "Verificado" : "Pendiente"}
                    </p>
                  </div>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="mt-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded-lg text-sm">
                  {success}
                </div>
              )}
            </div>

            {/* Shipping Addresses Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold font-family-comfortaa text-blue-2 mb-6">
                Direcciones de Envío
              </h2>

              {isEditingProfile ? (
                // Edit Mode
                <div className="space-y-4">
                  {editFormData?.addresses &&
                  editFormData.addresses.length > 0 ? (
                    <>
                      {editFormData.addresses.map((addr, idx) => (
                        <AddressForm
                          key={idx}
                          addr={addr}
                          idx={idx}
                          onChange={handleAddressChange}
                          onRemove={() => {
                            setEditFormData((prev) => ({
                              ...prev,
                              addresses: prev.addresses.filter(
                                (_, i) => i !== idx
                              ),
                            }));
                          }}
                          canRemove={editFormData.addresses.length > 1}
                        />
                      ))}
                    </>
                  ) : (
                    <div className="text-center py-8 bg-gray-3/30 rounded-lg">
                      <p className="text-gray-1 mb-4">
                        No tienes direcciones de envío registradas
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setEditFormData((prev) => ({
                            ...prev,
                            addresses: [
                              ...(prev.addresses || []),
                              {
                                street: "",
                                number: "",
                                apartment: "",
                                city: "",
                                region: "",
                                postalCode: "",
                                recipientName: "",
                                recipientPhone: "",
                                isDefault: false,
                              },
                            ],
                          }));
                        }}
                        className="text-blue-2 hover:text-blue-1 font-semibold text-sm transition-colors"
                      >
                        + Agregar dirección
                      </button>
                    </div>
                  )}

                  {/* Add Address Button */}
                  {editFormData?.addresses?.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditFormData((prev) => ({
                          ...prev,
                          addresses: [
                            ...(prev.addresses || []),
                            {
                              street: "",
                              number: "",
                              apartment: "",
                              city: "",
                              region: "",
                              postalCode: "",
                              recipientName: "",
                              recipientPhone: "",
                              isDefault: false,
                            },
                          ],
                        }));
                      }}
                      className="w-full py-2 text-blue-2 border border-blue-2 rounded-lg hover:bg-blue-2 hover:text-white transition-colors font-semibold"
                    >
                      + Agregar otra dirección
                    </button>
                  )}

                  {/* Save/Cancel Buttons */}
                  <div className="flex gap-3 pt-4 border-t border-gray-2">
                    <button
                      onClick={handleCancelEdit}
                      disabled={isSaving}
                      className="flex-1 py-2 px-4 border border-gray-2 rounded-lg text-gray-1 hover:bg-gray-3 transition-colors font-semibold disabled:opacity-50"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="flex-1 py-2 px-4 bg-blue-2 text-white rounded-lg hover:bg-blue-1 transition-colors font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isSaving ? (
                        <>
                          <ImSpinner2 className="animate-spin h-4 w-4" />
                          Guardando...
                        </>
                      ) : (
                        "Guardar Cambios"
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <>
                  {userData?.addresses && userData.addresses.length > 0 ? (
                    <div className="space-y-4">
                      {userData.addresses.map((addr, idx) => (
                        <div
                          key={idx}
                          className={`border-2 rounded-lg p-6 ${
                            addr.isDefault
                              ? "border-gold bg-gold/5"
                              : "border-gray-2 bg-gray-3/30"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-2">
                            <h3 className="font-semibold text-blue-2 text-lg">
                              {addr.label || `Dirección ${idx + 1}`}
                            </h3>
                            {addr.isDefault && (
                              <span className="bg-gold text-white text-xs font-bold px-3 py-1 rounded-full">
                                Predeterminada
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs font-semibold text-gray-1 uppercase tracking-wide mb-1">
                                Destinatario
                              </p>
                              <p className="text-sm font-medium text-blue-1">
                                {addr.recipientName || "-"}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs font-semibold text-gray-1 uppercase tracking-wide mb-1">
                                Teléfono
                              </p>
                              <p className="text-sm font-medium text-gold">
                                {addr.recipientPhone || "-"}
                              </p>
                            </div>

                            <div className="md:col-span-2">
                              <p className="text-xs font-semibold text-gray-1 uppercase tracking-wide mb-1">
                                Dirección
                              </p>
                              <p className="text-sm font-medium text-blue-1">
                                {addr.street} {addr.number}
                                {addr.apartment && ` - Apto. ${addr.apartment}`}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs font-semibold text-gray-1 uppercase tracking-wide mb-1">
                                Ciudad
                              </p>
                              <p className="text-sm font-medium text-blue-1">
                                {addr.city || "-"}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs font-semibold text-gray-1 uppercase tracking-wide mb-1">
                                Barrio / Región
                              </p>
                              <p className="text-sm font-medium text-blue-1">
                                {addr.region || "-"}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs font-semibold text-gray-1 uppercase tracking-wide mb-1">
                                Código Postal
                              </p>
                              <p className="text-sm font-medium text-blue-1">
                                {addr.postalCode || "-"}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-3/30 rounded-lg">
                      <p className="text-gray-1 mb-4">
                        No tienes direcciones de envío registradas
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Sidebar - Quick Info & Orders */}
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg shadow-md p-4 text-center">
                <p className="text-2xl font-bold text-blue-2">
                  {userData.totalOrders || 0}
                </p>
                <p className="text-xs text-gray-1 uppercase font-semibold">
                  Pedidos
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4 text-center">
                <p className="text-2xl font-bold text-gold">
                  ${userData.totalSpent || 0}
                </p>
                <p className="text-xs text-gray-1 uppercase font-semibold">
                  Total gastado
                </p>
              </div>
            </div>

            {/* Recent Orders / Activity */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold font-family-comfortaa text-blue-2 mb-4">
                Actividad Reciente
              </h3>

              {userData.totalOrders > 0 ? (
                <div className="space-y-3">
                  <p className="text-sm text-gray-1">
                    Tienes {userData.totalOrders} pedido
                    {userData.totalOrders > 1 ? "s" : ""} realizado
                    {userData.totalOrders > 1 ? "s" : ""}
                  </p>
                  <button className="w-full bg-blue-2 text-white py-2 px-4 rounded-lg hover:bg-blue-1 transition-colors font-semibold text-sm">
                    Ver Historial Completo
                  </button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-1 text-sm mb-3">
                    Aún no has realizado pedidos
                  </p>
                  <button
                    onClick={() => navigate("/productos")}
                    className="w-full bg-gold text-white py-2 px-4 rounded-lg hover:bg-gold/90 transition-colors font-semibold text-sm"
                  >
                    Explorar Productos
                  </button>
                </div>
              )}
            </div>

            {/* Security Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold font-family-comfortaa text-blue-2 mb-4">
                Seguridad
              </h3>
              <div className="space-y-3">
                <button
                  onClick={handleResetPasswordClick}
                  disabled={isResettingPassword}
                  className="w-full flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-3 transition-all text-blue-2 hover:font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isResettingPassword ? (
                    <>
                      <ImSpinner2 className="animate-spin h-4 w-4" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <FaKey className="text-base" />
                      Cambiar contraseña
                    </>
                  )}
                </button>
                <button
                  onClick={handleDeleteAccountClick}
                  disabled={isDeletingAccount}
                  className="w-full flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-red-50 transition-all text-red-500 hover:font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeletingAccount ? (
                    <>
                      <ImSpinner2 className="animate-spin h-4 w-4" />
                      Eliminando...
                    </>
                  ) : (
                    <>
                      <FaTrash className="text-base" />
                      Eliminar cuenta
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Password Confirmation Modal */}
      <ConfirmationModal
        isOpen={showResetPasswordConfirm}
        title="Reestablecer Contraseña"
        message="¿Deseas recibir un email para resetear tu contraseña?"
        description="Te enviaremos un enlace de recuperación a tu correo registrado. No olvides revisar la carpeta de correo no deseado."
        confirmText="Enviar Email"
        cancelText="Cancelar"
        isLoading={isResettingPassword}
        onConfirm={confirmResetPassword}
        onCancel={() => setShowResetPasswordConfirm(false)}
        variant="default"
      />

      {/* Delete Account Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteAccountConfirm}
        title="Eliminar Cuenta"
        message={
          <div className="flex flex-col items-center justify-center gap-3">
            <IoIosWarning size={100} className="" />
            <span>
              ¿Estás seguro? <br />
              <span className="text-red-500">
                Esta acción es permanente y no se puede deshacer.
              </span>
            </span>
          </div>
        }
        description="Tu cuenta será eliminada junto con todos tus datos."
        confirmText="Eliminar mi cuenta"
        cancelText="Cancelar"
        isLoading={isDeletingAccount}
        onConfirm={confirmDeleteAccount}
        onCancel={() => setShowDeleteAccountConfirm(false)}
        variant="danger"
      />
    </div>
  );
};

export default Profile;
