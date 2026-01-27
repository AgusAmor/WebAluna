import React from "react";
import { MdEdit } from "react-icons/md";
import { FaTrash, FaKey } from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";
import { useNavigate } from "react-router-dom";
import { showCustomToast } from "../../services/ui/toastService.jsx";
import { ConfirmationModal, AddressForm } from "../../components/common";
import {
  OrderCard,
  OrderDetailsModal,
  OrderHistory,
} from "../../components/ecommerce";
import { IoIosWarning } from "react-icons/io";
import { useProfile } from "../../hooks";
import { formatDate } from "../../utils/dateFormatter";

const Profile = () => {
  const navigate = useNavigate();
  const [showFinalDeleteConfirm, setShowFinalDeleteConfirm] =
    React.useState(false);
  const [selectedOrder, setSelectedOrder] = React.useState(null);
  const [showOrderDetails, setShowOrderDetails] = React.useState(false);
  const [showFullHistory, setShowFullHistory] = React.useState(false);
  const {
    userData,
    userOrders,
    loading,
    loadingOrders,
    isEditingProfile,
    isSaving,
    error,
    success,
    editFormData,
    isResettingPassword,
    isDeletingAccount,
    showResetPasswordConfirm,
    showDeleteAccountConfirm,
    showCancelOrderConfirm,
    orderToCancel,
    isCancellingOrder,
    handleAddressChange,
    handleAddAddress,
    handleRemoveAddress,
    handleSaveProfile,
    handleCancelEdit,
    handleStartEdit,
    handleResetPassword,
    handleDeleteAccount,
    updateEditField,
    handleCancelOrder,
    handleConfirmCancelOrder,
    handleCancelOrderCancel,
    setShowResetPasswordConfirm,
    setShowDeleteAccountConfirm,
  } = useProfile();

  /**
   * Handle account deletion confirmation - shows second modal
   */
  const confirmDeleteAccount = () => {
    setShowDeleteAccountConfirm(false);
    setShowFinalDeleteConfirm(true);
  };

  /**
   * Execute account deletion after final confirmation
   */
  const executeFinalDeleteAccount = async () => {
    const success = await handleDeleteAccount();

    if (success) {
      setShowFinalDeleteConfirm(false);
      showCustomToast.success("Tu cuenta ha sido eliminada exitosamente");
      // Navigate immediately to show toast on home page
      navigate("/", { replace: true });
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

  return (
    <div className="min-h-screen bg-gray-3">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 font-family-comfortaa text-blue-2">
            Mi Perfil
          </h1>
          <p className="text-gray-1">
            Gestiona tu información personal, direcciones y pedidos
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
                  onClick={
                    isEditingProfile ? handleCancelEdit : handleStartEdit
                  }
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
                        updateEditField("displayName", e.target.value)
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
                      onChange={(e) => updateEditField("email", e.target.value)}
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
                          updateEditField("phoneCountry", e.target.value)
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
                          updateEditField("phoneLocal", e.target.value)
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
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                  </div>

                  {/* Account Metadata */}
                  <div className="pt-6 border-t border-gray-2 flex justify-end">
                    <p className="text-xs text-gray-1 whitespace-nowrap">
                      Miembro desde {formatDate(userData?.createdAt)}
                    </p>
                  </div>
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
                          onRemove={() => handleRemoveAddress(idx)}
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
                        onClick={handleAddAddress}
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
                      onClick={handleAddAddress}
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
                              {addr.label || `${addr.street} ${addr.number}`}
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

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-3">
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
                              <p className="text-sm font-medium text-blue-1">
                                {addr.recipientPhone || "-"}
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
            {/* Recent Orders / Activity */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold font-family-comfortaa text-blue-2 mb-1">
                Actividad Reciente
              </h3>

              {loadingOrders ? (
                <div className="flex justify-center items-center py-8">
                  <ImSpinner2 className="animate-spin text-gold" size={30} />
                </div>
              ) : userOrders && userOrders.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-sm text-gray-1 mb-4">
                    Tienes {userOrders.length} pedido
                    {userOrders.length > 1 ? "s" : ""} realizado
                    {userOrders.length > 1 ? "s" : ""}
                  </p>

                  {/* Display first 3 orders */}
                  {userOrders.slice(0, 3).map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onViewDetails={(order) => {
                        setSelectedOrder(order);
                        setShowOrderDetails(true);
                      }}
                      onCancel={handleCancelOrder}
                    />
                  ))}

                  {/* Show "View More" button if there are more than 3 orders */}
                  {userOrders.length > 3 && (
                    <button
                      onClick={() => setShowFullHistory(true)}
                      className="w-full mt-4 bg-blue-2 text-white py-2 px-4 rounded-lg hover:bg-blue-1 transition-colors font-semibold text-sm relative group"
                    >
                      <div className="flex items-center justify-center gap-2">
                        Ver Historial Completo
                        {/* Badge */}
                        <span className="inline-flex items-center justify-center bg-gold text-black text-xs font-bold rounded-full w-6 h-6 border-2 border-white">
                          {userOrders.length}
                        </span>
                      </div>
                    </button>
                  )}
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
                  onClick={() => setShowResetPasswordConfirm(true)}
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
                  onClick={() => setShowDeleteAccountConfirm(true)}
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
        onConfirm={handleResetPassword}
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

      {/* Final Delete Account Confirmation Modal */}
      <ConfirmationModal
        isOpen={showFinalDeleteConfirm}
        title="Última Confirmación"
        message={
          <div className="flex flex-col items-center justify-center gap-3">
            <IoIosWarning size={100} className="text-red-500" />
            <span>
              Esta es tu última oportunidad. <br />
              <span className="text-red-600 font-bold">
                ¿Realmente deseas eliminar tu cuenta?
              </span>
            </span>
          </div>
        }
        description="Una vez eliminada, no hay vuelta atrás. Se borrarán todos tus datos, direcciones y pedidos."
        confirmText="Sí, eliminar definitivamente"
        cancelText="Cancelar"
        isLoading={isDeletingAccount}
        onConfirm={executeFinalDeleteAccount}
        onCancel={() => setShowFinalDeleteConfirm(false)}
        variant="danger"
      />

      {/* Cancel Order Confirmation Modal */}
      <ConfirmationModal
        isOpen={showCancelOrderConfirm}
        title="Cancelar Pedido"
        message={`¿Estás seguro de que deseas cancelar el pedido #${
          orderToCancel?.orderNumber || orderToCancel?.id?.slice(-8)
        }?`}
        description="Esta acción no se puede deshacer. El pedido pasará a estado cancelado."
        confirmText="Cancelar Pedido"
        cancelText="Mantener Pedido"
        isLoading={isCancellingOrder}
        onConfirm={handleConfirmCancelOrder}
        onCancel={handleCancelOrderCancel}
        variant="danger"
      />

      {/* Order Details Modal */}
      <OrderDetailsModal
        isOpen={showOrderDetails}
        order={selectedOrder}
        onClose={() => {
          setShowOrderDetails(false);
          setSelectedOrder(null);
        }}
        onCancel={handleCancelOrder}
      />

      {/* Full Order History Modal */}
      {showFullHistory && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowFullHistory(false);
            }
          }}
        >
          <div
            className="bg-white rounded-xl shadow-lg p-8 w-full max-w-3xl min-w-[350px] relative flex flex-col max-h-[90vh] overflow-y-auto animate-fadeInScale"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-blue-2 hover:text-gold text-2xl"
              onClick={() => setShowFullHistory(false)}
              aria-label="Close"
            >
              ×
            </button>

            {/* Header */}
            <h2 className="text-2xl font-bold text-blue-2 mb-6 font-family-comfortaa pr-8">
              Historial de Pedidos
            </h2>

            {/* Orders List */}
            <div className="flex-1 overflow-y-auto">
              <OrderHistory
                orders={userOrders}
                loading={loadingOrders}
                onViewDetails={(order) => {
                  setSelectedOrder(order);
                  setShowOrderDetails(true);
                  setShowFullHistory(false);
                }}
                onCancel={handleCancelOrder}
              />
            </div>

            {/* Close Button */}
            <div className="flex gap-3 pt-6 border-t border-gray-2 mt-6">
              <button
                onClick={() => setShowFullHistory(false)}
                className="w-full py-2 px-4 bg-blue-2 text-white rounded-lg hover:bg-blue-1 transition-colors font-semibold"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
