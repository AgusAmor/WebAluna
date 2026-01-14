import React from "react";
import { ImSpinner2 } from "react-icons/im";
import { MdDelete } from "react-icons/md";
import { Hero } from "../../../components/common";
import { formatDateTime } from "../../../utils/dateFormatter";
import { useAuth } from "../../../context/AuthContext";
import {
  getAllOrders,
  deleteOrder,
  updateOrderStatus,
} from "../../../services/firebase/firebaseOrderService";
import { showCustomToast } from "../../../services/ui/toastService";
import { formatDefaultAddress } from "../../../services/users/userManagementService";
import { ORDER_STATUS } from "../../../constants";

// OrderManagement component: handles order viewing and management for admins.
const OrderManagement = () => {
  const { user } = useAuth();
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [selectedOrder, setSelectedOrder] = React.useState(null);
  const [showModal, setShowModal] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState(null);
  const [updatingId, setUpdatingId] = React.useState(null);
  const [selectedStatus, setSelectedStatus] = React.useState(null);
  // Filter states
  const [filterUser, setFilterUser] = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState("");
  const [filterDateFrom, setFilterDateFrom] = React.useState("");
  const [filterDateTo, setFilterDateTo] = React.useState("");

  // Initialize: Load orders from backend
  React.useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);

        // Get Firebase token
        const token = await user.getIdToken();

        // Fetch all orders
        const response = await getAllOrders(token);

        if (response && response.orders) {
          // Map orders to ensure all required fields are present
          // Structure from Firebase:
          // {
          //   id, orderNumber, userId, customerInfo: {name, email, phone},
          //   status, items: [{productId, productName, family, size, quantity, unitPrice}],
          //   summary: {subtotal, shipping, total},
          //   delivery: {method: "shipping"|"pickup", shippingAddress: {...}},
          //   statusHistory, createdAt
          // }
          const mappedOrders = response.orders.map((order) => {
            // Convert shippingAddress to array format for formatDefaultAddress
            const addressArray = order.delivery?.shippingAddress
              ? [{ ...order.delivery.shippingAddress, isDefault: true }]
              : [];

            return {
              id: order.id,
              orderNumber: order.orderNumber,
              userId: order.userId,
              // Customer info
              userName: order.customerInfo?.name || "Usuario desconocido",
              userEmail: order.customerInfo?.email || "",
              userPhone: order.customerInfo?.phone || "",
              // Status and dates
              status: order.status || "pending",
              createdAt: order.createdAt,
              // Items
              items: (order.items || []).map((item) => ({
                productId: item.productId,
                productName: item.productName,
                family: item.family,
                size: item.size,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
              })),
              // Summary
              totalAmount: order.summary?.total || 0,
              subtotal: order.summary?.subtotal || 0,
              shipping: order.summary?.shipping || 0,
              // Delivery
              deliveryType:
                order.delivery?.method === "shipping" ? "delivery" : "pickup",
              deliveryAddress: formatDefaultAddress(addressArray),
              // Keep original data for reference
              ...order,
            };
          });
          setOrders(mappedOrders);
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(err.message || "No se pudieron cargar los pedidos");
        showCustomToast(err.message || "Error al cargar los pedidos", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setSelectedStatus(order.status);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
    setSelectedStatus(null);
  };

  const handleStatusChange = async (newStatus) => {
    if (newStatus === selectedOrder.status) {
      return;
    }

    try {
      setUpdatingId(selectedOrder.id);
      const token = await user.getIdToken();

      await updateOrderStatus(
        {
          orderId: selectedOrder.id,
          newStatus: newStatus,
          note: `Estado actualizado a ${newStatus}`,
          updatedBy: user.uid,
        },
        token
      );

      // Update local state
      setOrders(
        orders.map((order) =>
          order.id === selectedOrder.id
            ? { ...order, status: newStatus }
            : order
        )
      );
      setSelectedOrder({ ...selectedOrder, status: newStatus });
      setSelectedStatus(newStatus);
      showCustomToast("Estado actualizado exitosamente", "success");
    } catch (error) {
      console.error("Error updating order status:", error);
      showCustomToast(
        error.message || "Error al actualizar el estado",
        "error"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este pedido?")) {
      try {
        setDeletingId(orderId);
        const token = await user.getIdToken();

        await deleteOrder(orderId, token);

        // Remove from local state
        setOrders(orders.filter((order) => order.id !== orderId));
        showCustomToast("Pedido eliminado exitosamente", "success");
      } catch (error) {
        console.error("Error deleting order:", error);
        showCustomToast(
          error.message || "Error al eliminar el pedido",
          "error"
        );
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleUpdateStatus = async (orderId, currentStatus) => {
    // Define status flow: pendiente -> procesando -> completado
    const statusFlow = {
      pendiente: "procesando",
      procesando: "completado",
      completado: "completado", // Already at final status
    };

    const nextStatus = statusFlow[currentStatus] || "procesando";

    if (nextStatus === currentStatus) {
      showCustomToast("Este pedido ya está en estado final", "info");
      return;
    }

    try {
      setUpdatingId(orderId);
      const token = await user.getIdToken();

      await updateOrderStatus(
        {
          orderId,
          newStatus: nextStatus,
          note: `Estado actualizado por administrador`,
          updatedBy: user.uid,
        },
        token
      );

      // Update local state
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: nextStatus } : order
        )
      );
      showCustomToast("Estado actualizado exitosamente", "success");
    } catch (error) {
      console.error("Error updating order status:", error);
      showCustomToast(
        error.message || "Error al actualizar el estado",
        "error"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // Helper function to convert createdAt to Date object
  const getOrderDate = (createdAt) => {
    if (!createdAt) return new Date(0);

    // Handle ISO string (most common after backend fix)
    if (typeof createdAt === "string") {
      return new Date(createdAt);
    }

    // Handle Firestore Timestamp object
    if (createdAt.toDate && typeof createdAt.toDate === "function") {
      return createdAt.toDate();
    }

    // Handle object with seconds property
    if (createdAt.seconds) {
      return new Date(createdAt.seconds * 1000);
    }

    // Handle Date object
    if (createdAt instanceof Date) {
      return createdAt;
    }

    // Handle number (timestamp in milliseconds)
    if (typeof createdAt === "number") {
      return new Date(createdAt);
    }

    return new Date(0);
  };

  // Helper to get date only (YYYY-MM-DD) in local time
  const getLocalDateString = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Filter function
  const getFilteredOrders = () => {
    let filtered = orders.filter((order) => {
      // Filter by user
      if (
        filterUser &&
        !order.userName.toLowerCase().includes(filterUser.toLowerCase())
      ) {
        return false;
      }

      // Filter by status
      if (filterStatus && order.status !== filterStatus) {
        return false;
      }

      // Filter by date range
      if (filterDateFrom || filterDateTo) {
        const orderDate = getOrderDate(order.createdAt);
        const orderDateString = getLocalDateString(orderDate);

        // If filterDateFrom is set, compare date strings
        if (filterDateFrom && orderDateString < filterDateFrom) {
          return false;
        }

        // If filterDateTo is set, compare date strings
        if (filterDateTo && orderDateString > filterDateTo) {
          return false;
        }
      }

      return true;
    });

    // Sort by date (newest first by default)
    filtered.sort((a, b) => {
      const dateA = getOrderDate(a.createdAt).getTime();
      const dateB = getOrderDate(b.createdAt).getTime();
      return dateB - dateA;
    });

    return filtered;
  };

  const filteredOrders = getFilteredOrders();

  return (
    <div className="min-h-screen bg-gray-3 px-4 py-2 pb-20">
      <Hero
        title="Gestión de Pedidos"
        subtitle="Administra y revisa todos los pedidos realizados."
      />
      <div className="max-w-6xl mx-auto">
        {/* Error message */}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Filters Section */}
        {!loading && orders.length > 0 && (
          <div className="bg-gray-3 rounded-xl shadow-md p-6 mb-6 border border-gold/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-blue-1 font-family-sora flex items-center gap-2">
                <span className="w-1 h-6 bg-gold rounded-full"></span>
                Filtros de Búsqueda
              </h3>
              {(filterUser ||
                filterStatus ||
                filterDateFrom ||
                filterDateTo) && (
                <button
                  onClick={() => {
                    setFilterUser("");
                    setFilterStatus("");
                    setFilterDateFrom("");
                    setFilterDateTo("");
                  }}
                  className="text-xs px-3 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors font-family-sora font-bold"
                >
                  Limpiar Todos
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Filter by User */}
              <div className="flex flex-col">
                <label className="font-bold text-blue-1 font-family-sora text-xs uppercase tracking-wide mb-2">
                  Usuario
                </label>
                <input
                  type="text"
                  value={filterUser}
                  onChange={(e) => setFilterUser(e.target.value)}
                  placeholder="Nombre..."
                  className="px-3 py-2.5 rounded-lg border-2 border-gray-1 bg-white focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all font-family-sora text-sm"
                />
              </div>

              {/* Filter by Status */}
              <div className="flex flex-col">
                <label className="font-bold text-blue-1 font-family-sora text-xs uppercase tracking-wide mb-2">
                  Estado
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2.5 rounded-lg border-2 border-gray-1 bg-white focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all font-family-sora text-sm cursor-pointer"
                >
                  <option value="">Todos</option>
                  <option value={ORDER_STATUS.PENDING}>Pendiente</option>
                  <option value={ORDER_STATUS.PROCESSING}>Procesando</option>
                  <option value={ORDER_STATUS.SHIPPED}>Enviado</option>
                  <option value={ORDER_STATUS.DELIVERED}>Entregado</option>
                  <option value={ORDER_STATUS.CANCELLED}>Cancelado</option>
                </select>
              </div>

              {/* Filter by Date From */}
              <div className="flex flex-col">
                <label className="font-bold text-blue-1 font-family-sora text-xs uppercase tracking-wide mb-2">
                  Desde
                </label>
                <input
                  type="date"
                  value={filterDateFrom}
                  onChange={(e) => setFilterDateFrom(e.target.value)}
                  className="px-3 py-2.5 rounded-lg border-2 border-gray-1 bg-white focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all font-family-sora text-sm"
                />
              </div>

              {/* Filter by Date To */}
              <div className="flex flex-col">
                <label className="font-bold text-blue-1 font-family-sora text-xs uppercase tracking-wide mb-2">
                  Hasta
                </label>
                <input
                  type="date"
                  value={filterDateTo}
                  onChange={(e) => setFilterDateTo(e.target.value)}
                  className="px-3 py-2.5 rounded-lg border-2 border-gray-1 bg-white focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all font-family-sora text-sm"
                />
              </div>
            </div>

            {/* Active Filters Display */}
            {(filterUser || filterStatus || filterDateFrom || filterDateTo) && (
              <div className="mt-4 pt-4 border-t border-gold/20 flex flex-wrap gap-2">
                {filterUser && (
                  <span className="inline-flex items-center gap-2 bg-blue-1 text-white px-3 py-1 rounded-full text-xs font-bold font-family-sora">
                    👤 {filterUser}
                    <button
                      onClick={() => setFilterUser("")}
                      className="hover:opacity-70"
                    >
                      ✕
                    </button>
                  </span>
                )}
                {filterStatus && (
                  <span className="inline-flex items-center gap-2 bg-gold text-gray-0 px-3 py-1 rounded-full text-xs font-bold font-family-sora">
                    📊 {filterStatus}
                    <button
                      onClick={() => setFilterStatus("")}
                      className="hover:opacity-70"
                    >
                      ✕
                    </button>
                  </span>
                )}
                {filterDateFrom && (
                  <span className="inline-flex items-center gap-2 bg-blue-1/70 text-white px-3 py-1 rounded-full text-xs font-bold font-family-sora">
                    📅 Desde {filterDateFrom}
                    <button
                      onClick={() => setFilterDateFrom("")}
                      className="hover:opacity-70"
                    >
                      ✕
                    </button>
                  </span>
                )}
                {filterDateTo && (
                  <span className="inline-flex items-center gap-2 bg-blue-1/70 text-white px-3 py-1 rounded-full text-xs font-bold font-family-sora">
                    📅 Hasta {filterDateTo}
                    <button
                      onClick={() => setFilterDateTo("")}
                      className="hover:opacity-70"
                    >
                      ✕
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Loading state */}
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <ImSpinner2 className="animate-spin text-gold" size={40} />
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-blue-1 text-lg font-family-sora">
              No hay pedidos registrados aún.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md mt-2 overflow-x-auto">
            <table className="min-w-full font-family-sora text-xs md:text-sm">
              <thead>
                <tr className="bg-gold text-white">
                  <th className="py-2 px-1 font-bold text-center whitespace-nowrap">
                    Usuario
                  </th>
                  <th className="py-2 px-1 font-bold text-center whitespace-nowrap">
                    Fecha
                  </th>
                  <th className="py-2 px-1 font-bold text-center whitespace-nowrap">
                    Entrega
                  </th>
                  <th className="py-2 px-1 font-bold text-center whitespace-nowrap">
                    Productos
                  </th>
                  <th className="py-2 px-1 font-bold text-center whitespace-nowrap">
                    Total
                  </th>
                  <th className="py-2 px-1 font-bold text-center whitespace-nowrap">
                    Estado
                  </th>
                  <th className="py-2 px-1 font-bold text-center whitespace-nowrap">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-4 text-center text-gray-0">
                      No hay pedidos que coincidan con los filtros aplicados.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const itemCount = order.items ? order.items.length : 0;
                    const deliveryInfo =
                      order.deliveryType === "pickup"
                        ? "Pickup"
                        : order.deliveryAddress || "N/A";

                    return (
                      <tr
                        key={order.id}
                        className="border-b border-gray-2 hover:bg-gray-3/40"
                      >
                        <td className="py-2 px-2 font-bold text-blue-1 text-center">
                          {order.userName}
                        </td>
                        <td className="py-2 px-2 text-center">
                          {formatDateTime(order.createdAt) || "-"}
                        </td>
                        <td className="py-2 px-2 text-center text-sm">
                          {deliveryInfo}
                        </td>
                        <td className="py-2 px-2 text-center">{itemCount}</td>
                        <td className="py-2 px-2 text-gold font-bold text-center">
                          ${order.totalAmount || "0"}
                        </td>
                        <td className="py-2 px-2 text-center">
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                              order.status === "completado"
                                ? "bg-green-100 text-green-700"
                                : order.status === "procesando"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-2 px-2 text-center">
                          <div className="flex flex-col items-center gap-2">
                            {/* View button */}
                            <button
                              className="bg-blue-2 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-gold transition-colors w-24"
                              onClick={() => handleViewOrder(order)}
                            >
                              Ver
                            </button>
                            {/* Update Status button */}
                            <button
                              className={`text-white px-3 py-1 rounded-lg text-xs font-bold transition-colors w-24 flex items-center justify-center ${
                                updatingId === order.id
                                  ? "bg-gray-400 cursor-not-allowed opacity-60"
                                  : order.status === "completado"
                                  ? "bg-gray-400 cursor-not-allowed"
                                  : "bg-green-600 hover:bg-green-700"
                              }`}
                              disabled={
                                updatingId === order.id ||
                                order.status === "completado"
                              }
                              onClick={() =>
                                handleUpdateStatus(order.id, order.status)
                              }
                            >
                              {updatingId === order.id ? (
                                <span className="flex items-center justify-center w-full h-full">
                                  <ImSpinner2 className="animate-spin h-4 w-4" />
                                </span>
                              ) : (
                                "Avanzar"
                              )}
                            </button>
                            {/* Delete button */}
                            <button
                              className={`bg-red-500 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-red-700 transition-colors w-24 flex items-center justify-center ${
                                deletingId === order.id
                                  ? "opacity-60 cursor-not-allowed"
                                  : ""
                              }`}
                              disabled={deletingId === order.id}
                              onClick={() => handleDeleteOrder(order.id)}
                            >
                              {deletingId === order.id ? (
                                <span className="flex items-center justify-center w-full h-full">
                                  <ImSpinner2 className="animate-spin h-5 w-5 mx-auto text-white" />
                                </span>
                              ) : (
                                "Eliminar"
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Order Details Modal */}
        {showModal && selectedOrder && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                handleCloseModal();
              }
            }}
          >
            <div
              className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl min-w-[350px] relative flex flex-col animate-fadeInScale max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-3 right-3 text-blue-2 hover:text-gold text-xl font-bold"
                onClick={handleCloseModal}
                aria-label="Close"
              >
                ✕
              </button>

              <h2 className="text-2xl font-bold text-blue-1 font-family-comfortaa mb-4">
                Detalles del Pedido
              </h2>

              {/* Order Details */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-black font-family-sora text-sm">
                      Número de Pedido
                    </label>
                    <p className="text-blue-1 font-bold">
                      {selectedOrder.orderNumber || selectedOrder.id}
                    </p>
                  </div>
                  <div>
                    <label className="font-bold text-black font-family-sora text-sm">
                      Estado
                    </label>
                    <p className="text-blue-1 font-bold">
                      {selectedOrder.status}
                    </p>
                  </div>
                  <div>
                    <label className="font-bold text-black font-family-sora text-sm">
                      Usuario
                    </label>
                    <p className="text-blue-1 font-bold">
                      {selectedOrder.userName}
                    </p>
                  </div>
                  <div>
                    <label className="font-bold text-black font-family-sora text-sm">
                      Email
                    </label>
                    <p className="text-blue-1 text-xs">
                      {selectedOrder.userEmail || "-"}
                    </p>
                  </div>
                  <div>
                    <label className="font-bold text-black font-family-sora text-sm">
                      Teléfono
                    </label>
                    <p className="text-blue-1">
                      {selectedOrder.userPhone || "-"}
                    </p>
                  </div>
                  <div>
                    <label className="font-bold text-black font-family-sora text-sm">
                      Fecha
                    </label>
                    <p className="text-blue-1">
                      {selectedOrder.createdAt
                        ? formatDateTime(selectedOrder.createdAt)
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="font-bold text-black font-family-sora text-sm">
                      Tipo de Entrega
                    </label>
                    <p className="text-blue-1">
                      {selectedOrder.deliveryType === "pickup"
                        ? "Recoger"
                        : "A Domicilio"}
                    </p>
                  </div>
                  <div>
                    <label className="font-bold text-black font-family-sora text-sm">
                      Subtotal
                    </label>
                    <p className="text-blue-1 font-bold">
                      ${selectedOrder.subtotal || "0"}
                    </p>
                  </div>
                </div>

                {/* Delivery Address */}
                {selectedOrder.deliveryType !== "pickup" &&
                  selectedOrder.deliveryAddress && (
                    <div>
                      <label className="font-bold text-black font-family-sora text-sm">
                        Dirección de Entrega
                      </label>
                      <p className="text-blue-1">
                        {selectedOrder.deliveryAddress}
                      </p>
                    </div>
                  )}

                {/* Shipping Cost */}
                {selectedOrder.shipping > 0 && (
                  <div>
                    <label className="font-bold text-black font-family-sora text-sm">
                      Costo de Envío
                    </label>
                    <p className="text-blue-1 font-bold">
                      ${selectedOrder.shipping}
                    </p>
                  </div>
                )}

                {/* Order Items */}
                <div className="mt-6">
                  <label className="font-bold text-black font-family-sora text-sm block mb-2">
                    Productos ({selectedOrder.items?.length || 0})
                  </label>
                  <div className="bg-gray-50 rounded p-4">
                    {selectedOrder.items && selectedOrder.items.length > 0 ? (
                      <div className="space-y-3">
                        {selectedOrder.items.map((item, index) => {
                          const unitPrice = item.unitPrice || 0;
                          const quantity = item.quantity || 1;
                          const subtotal = unitPrice * quantity;

                          return (
                            <div
                              key={index}
                              className="flex justify-between items-center text-sm pb-2 border-b border-gray-300 last:border-b-0"
                            >
                              <div className="flex-1">
                                <p className="font-bold text-blue-1">
                                  {item.productName}
                                </p>
                                <p className="text-xs text-gray-1">
                                  {item.family && `${item.family} - `}
                                  Tamaño: {item.size || "normal"}
                                </p>
                                <p className="text-xs text-gray-1">
                                  ${unitPrice.toFixed(2)} x {quantity}
                                </p>
                              </div>
                              <span className="font-bold text-gold ml-4">
                                ${subtotal.toFixed(2)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-gray-1 text-sm">
                        No hay productos en este pedido
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <label className="font-bold text-black font-family-sora text-sm">
                  Total
                </label>
                <p className="text-2xl font-bold text-gold">
                  ${selectedOrder.totalAmount}
                </p>
              </div>

              {/* Status Selection */}
              <div className="border-t pt-4 mt-6">
                <label className="font-bold text-blue-1 font-family-sora text-sm block mb-2">
                  Cambiar Estado
                </label>
                <select
                  value={selectedStatus || ""}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  disabled={updatingId === selectedOrder.id}
                  className={`w-full px-3 py-2 rounded-lg border border-gray-2 focus:outline-none focus:border-gold transition-colors font-family-sora ${
                    updatingId === selectedOrder.id
                      ? "bg-gray-100 cursor-not-allowed opacity-60"
                      : "bg-white hover:border-gold"
                  }`}
                >
                  <option value="">-- Seleccionar estado --</option>
                  <option value={ORDER_STATUS.PENDING}>Pendiente</option>
                  <option value={ORDER_STATUS.PROCESSING}>Procesando</option>
                  <option value={ORDER_STATUS.SHIPPED}>Enviado</option>
                  <option value={ORDER_STATUS.DELIVERED}>Entregado</option>
                  <option value={ORDER_STATUS.CANCELLED}>Cancelado</option>
                </select>
              </div>

              {/* Modal Actions */}
              <div className="flex gap-4 mt-6 pt-4 border-t">
                <button
                  onClick={handleCloseModal}
                  className="flex-1 bg-gray-2 text-gray-1 font-bold px-4 py-2 rounded-lg hover:bg-gray-1 hover:text-white transition-colors font-family-sora"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
