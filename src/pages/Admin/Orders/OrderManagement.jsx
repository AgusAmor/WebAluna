import React from "react";
import { ImSpinner2 } from "react-icons/im";
import { Hero, ConfirmationModal } from "../../../components/common";
import Pagination from "../../../components/common/Pagination";
import { formatDateTime } from "../../../utils/dateFormatter";
import { useAuth } from "../../../context/AuthContext";
import {
  getAllOrders,
  updateOrderStatus,
} from "../../../services/firebase/firebaseOrderService";
import { showCustomToast } from "../../../services/ui/toastService";
import { notifyOrders } from "../../../services/ui/notificationService";
import { formatDefaultAddress } from "../../../services/users/userManagementService";
import { ORDER_STATUS } from "../../../constants";
import { loadProducts } from "../../../services/products/productsService";

// Modular components and hooks
import OrderFilters from "./OrderFilters";
import OrderDetailsModal from "./OrderDetailsModal";
import OrdersTable from "./OrdersTable";
import useOrderManagement from "../../../hooks/admin/useOrderManagement";
import useOrderFiltering from "../../../hooks/admin/useOrderFiltering";
import usePagination from "../../../hooks/admin/usePagination";

/**
 * OrderManagement Component
 * Main orchestrator for order management page
 * Handles data fetching, state coordination, and modal management
 */
const OrderManagement = () => {
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [selectedOrder, setSelectedOrder] = React.useState(null);
  const [showModal, setShowModal] = React.useState(false);
  const [selectedStatus, setSelectedStatus] = React.useState(null);

  // Filter states
  const [filterUser, setFilterUser] = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState("");
  const [filterProduct, setFilterProduct] = React.useState("");
  const [filterDelivery, setFilterDelivery] = React.useState("");
  const [hideFinished, setHideFinished] = React.useState(true);
  const [productsList, setProductsList] = React.useState([]);

  // Order management hook
  const {
    orders,
    setOrders,
    updatingId,
    isCancellingOrder,
    orderToCancel,
    showCancelConfirm,
    setShowCancelConfirm,
    handleUpdateStatus,
    handleCancelOrder,
    handleConfirmCancelOrder,
    handleCancelOrderCancel,
  } = useOrderManagement(user);

  // Filtering hook
  const { getFilteredOrders } = useOrderFiltering();

  // Load products list for filter
  React.useEffect(() => {
    loadProducts()
      .then((prods) => setProductsList(prods))
      .catch(() => setProductsList([]));
  }, []);

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
        notifyOrders.loadError(err.message);
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
      const token = await user.getIdToken();

      await updateOrderStatus(
        {
          orderId: selectedOrder.id,
          newStatus: newStatus,
          note: `Estado actualizado a ${newStatus}`,
          updatedBy: user.uid,
        },
        token,
      );

      // Update local state
      setOrders(
        orders.map((order) =>
          order.id === selectedOrder.id
            ? { ...order, status: newStatus }
            : order,
        ),
      );
      setSelectedOrder({ ...selectedOrder, status: newStatus });
      setSelectedStatus(newStatus);
      notifyOrders.statusUpdated();
    } catch (error) {
      console.error("Error updating order status:", error);
      notifyOrders.updateError(error.message);
    }
  };

  const filteredOrders = getFilteredOrders(
    orders,
    filterUser,
    filterStatus,
    filterProduct,
    filterDelivery,
    hideFinished,
  );

  // Paginación
  const {
    paginatedItems: paginatedOrders,
    currentPage,
    setCurrentPage,
    totalItems: totalOrders,
  } = usePagination(filteredOrders, 20, [
    filterUser,
    filterStatus,
    filterProduct,
    filterDelivery,
    hideFinished,
  ]);

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
          <OrderFilters
            orders={orders}
            products={productsList}
            filterUser={filterUser}
            setFilterUser={setFilterUser}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            filterProduct={filterProduct}
            setFilterProduct={setFilterProduct}
            filterDelivery={filterDelivery}
            setFilterDelivery={setFilterDelivery}
            hideFinished={hideFinished}
            setHideFinished={setHideFinished}
          />
        )}

        {/* Loading state */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-md mt-2 overflow-x-auto">
            <div className="flex flex-col items-center justify-center gap-4 py-16">
              <ImSpinner2 className="animate-spin h-12 w-12 text-gold" />
              <span className="text-blue-2 font-bold text-lg">
                Cargando pedidos...
              </span>
            </div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-blue-1 text-lg font-family-sora">
              No hay pedidos registrados aún.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md mt-2 overflow-x-auto">
            <OrdersTable
              filteredOrders={paginatedOrders}
              updatingId={updatingId}
              isCancellingOrder={isCancellingOrder}
              orderToCancel={orderToCancel}
              onViewOrder={handleViewOrder}
              onUpdateStatus={handleUpdateStatus}
              onDeleteOrder={handleCancelOrder}
            />
            <Pagination
              totalItems={totalOrders}
              itemsPerPage={20}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>
        )}

        {/* Order Details Modal */}
        <OrderDetailsModal
          isOpen={showModal}
          selectedOrder={selectedOrder}
          selectedStatus={selectedStatus}
          updatingId={updatingId}
          onClose={handleCloseModal}
          onStatusChange={handleStatusChange}
        />

        {/* Cancel Order Confirmation Modal */}
        <ConfirmationModal
          isOpen={showCancelConfirm}
          title="Cancelar Pedido"
          message={`¿Estás seguro de que deseas cancelar el pedido #${
            orderToCancel?.orderNumber || orderToCancel?.id?.slice(-8)
          }?`}
          description="El pedido pasará a estado cancelado y se registrará en el historial del mismo."
          confirmText="Cancelar Pedido"
          cancelText="Mantener Pedido"
          isLoading={isCancellingOrder}
          onConfirm={handleConfirmCancelOrder}
          onCancel={handleCancelOrderCancel}
          variant="danger"
        />
      </div>
    </div>
  );
};

export default OrderManagement;
