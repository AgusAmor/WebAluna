/**
 * orders.js
 * Cloud Functions for order management
 * Handles order creation, retrieval, and status updates
 */

const admin = require("./config/firebaseAdmin.js");
const { verifyToken } = require("./utils/authUtils.js");
const { requireAdmin } = require("./middlewares/authMiddleware.js");
const {
  parseBody,
  validateId,
  validateRequiredFields,
} = require("./utils/validation.js");
const {
  sendSuccess,
  handleError,
  sendError,
} = require("./utils/responseHandler.js");
// Removed sendOrderStatusEmail import as trigger moved to emailService

/**
 * Creates a new order in Firestore
 * POST /createOrder
 * Body: { orderNumber, userId, customerInfo, status, items, summary, delivery, statusHistory }
 * Requires: Valid user authentication
 */
exports.createOrder = async (req, res) => {
  try {
    const body = parseBody(req.body);
    const decoded = await verifyToken(req.headers.authorization);

    // Validate that user is creating their own order
    if (decoded.uid !== body.userId) {
      return sendError(res, 403, "Cannot create order for another user");
    }

    // Validate required fields
    validateRequiredFields(body, [
      "orderNumber",
      "userId",
      "customerInfo",
      "items",
      "summary",
      "delivery",
    ]);

    const ordersRef = admin.firestore().collection("orders");

    // Create order document
    const docRef = await ordersRef.add({
      orderNumber: body.orderNumber,
      userId: body.userId,
      customerInfo: body.customerInfo,
      status: body.status || "pending",
      items: body.items,
      summary: body.summary,
      delivery: body.delivery,
      statusHistory: body.statusHistory || [
        {
          status: "pending",
          timestamp: admin.firestore.Timestamp.now(),
          note: "Pedido creado",
          updatedBy: "system",
        },
      ],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const createdOrder = await docRef.get();
    const orderData = createdOrder.data();

    sendSuccess(
      res,
      {
        id: docRef.id,
        ...orderData,
      },
      201,
    );
  } catch (error) {
    handleError(res, error, {
      status: 400,
      defaultMessage: "Error creating order",
    });
  }
};

/**
 * Retrieves a single order by ID
 * GET /getOrder?orderId=...
 * Requires: User authentication (can only view own orders unless admin)
 */
exports.getOrder = async (req, res) => {
  try {
    const orderId = req.query.orderId;
    const decoded = await verifyToken(req.headers.authorization);

    validateId(orderId);

    const orderDoc = await admin
      .firestore()
      .collection("orders")
      .doc(orderId)
      .get();

    if (!orderDoc.exists()) {
      return sendError(res, 404, "Order not found");
    }

    const orderData = orderDoc.data();

    // Check authorization: user can view own orders, admins can view all
    if (!decoded.admin && decoded.uid !== orderData.userId) {
      return sendError(res, 403, "Cannot view this order");
    }

    sendSuccess(res, {
      id: orderDoc.id,
      ...orderData,
      // Convert Firestore Timestamp to ISO string for frontend compatibility
      createdAt: orderData.createdAt?.toDate
        ? orderData.createdAt.toDate().toISOString()
        : orderData.createdAt,
    });
  } catch (error) {
    handleError(res, error, {
      status: 400,
      defaultMessage: "Error retrieving order",
    });
  }
};

/**
 * Retrieves all orders for the authenticated user
 * GET /getUserOrders
 * Requires: User authentication
 */
exports.getUserOrders = async (req, res) => {
  try {
    const decoded = await verifyToken(req.headers.authorization);

    const ordersSnapshot = await admin
      .firestore()
      .collection("orders")
      .where("userId", "==", decoded.uid)
      .get();

    const orders = [];
    ordersSnapshot.forEach((doc) => {
      const orderData = doc.data();
      orders.push({
        id: doc.id,
        ...orderData,
        // Convert Firestore Timestamp to ISO string for frontend compatibility
        createdAt: orderData.createdAt?.toDate
          ? orderData.createdAt.toDate().toISOString()
          : orderData.createdAt,
      });
    });

    sendSuccess(res, { orders, count: orders.length });
  } catch (error) {
    handleError(res, error, {
      status: 400,
      defaultMessage: "Error retrieving user orders",
    });
  }
};

/**
 * Retrieves all orders (admin only)
 * GET /getAllOrders
 * Requires: Admin authentication
 */
exports.getAllOrders = async (req, res) => {
  try {
    await requireAdmin(req);

    const ordersSnapshot = await admin
      .firestore()
      .collection("orders")
      .orderBy("createdAt", "desc")
      .get();

    const orders = [];
    ordersSnapshot.forEach((doc) => {
      const orderData = doc.data();
      orders.push({
        id: doc.id,
        ...orderData,
        // Convert Firestore Timestamp to ISO string for frontend compatibility
        createdAt: orderData.createdAt?.toDate
          ? orderData.createdAt.toDate().toISOString()
          : orderData.createdAt,
      });
    });

    sendSuccess(res, { orders, count: orders.length });
  } catch (error) {
    handleError(res, error, {
      status: 400,
      defaultMessage: "Error retrieving orders",
    });
  }
};

/**
 * Updates order status and adds to status history
 * POST /updateOrderStatus
 * Body: { orderId, newStatus, note, updatedBy }
 * Requires: Authentication (admin token preferred)
 */
exports.updateOrderStatus = async (req, res) => {
  try {
    const body = parseBody(req.body);

    // Verify token (will throw if invalid)
    const decoded = await verifyToken(req.headers.authorization);

    validateRequiredFields(body, ["orderId", "newStatus"]);

    const orderRef = admin.firestore().collection("orders").doc(body.orderId);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      return sendError(res, 404, "Order not found");
    }

    const orderData = orderDoc.data();

    // Validate status transitions
    const currentStatus = orderData.status;
    const deliveryMethod = orderData.delivery?.method || "shipping";

    // Cannot change status if order is already cancelled or delivered
    if (currentStatus === "cancelled" || currentStatus === "delivered") {
      return sendError(
        res,
        400,
        `Cannot change status of a ${currentStatus} order`,
      );
    }

    // For admin cancellation, only allow from pending, confirmed, printing, dispatched
    if (
      body.newStatus === "cancelled" &&
      decoded.uid !== orderData.userId &&
      !["pending", "confirmed", "printing", "dispatched"].includes(
        currentStatus,
      )
    ) {
      return sendError(
        res,
        400,
        "Order can only be cancelled from pending, confirmed, printing, or dispatched status",
      );
    }

    // Cannot set to withdrawn (retirado) if delivery method is shipping
    if (body.newStatus === "withdrawn" && deliveryMethod === "shipping") {
      return sendError(
        res,
        400,
        "Cannot mark as withdrawn for shipping delivery method",
      );
    }

    // Create status history entry with proper structure
    const statusHistoryEntry = {
      status: body.newStatus,
      timestamp: admin.firestore.Timestamp.now(),
      note: body.note || `Estado actualizado a ${body.newStatus}`,
      updatedBy: body.updatedBy || decoded.uid,
    };

    // Update order with new status and add to history
    // Email will be sent automatically by onOrderStatusChanged Firestore trigger
    await orderRef.update({
      status: body.newStatus,
      statusHistory: admin.firestore.FieldValue.arrayUnion(statusHistoryEntry),
    });

    const updatedOrder = await orderRef.get();
    const updatedOrderData = updatedOrder.data();

    // Convert timestamps to ISO strings for consistent frontend handling
    sendSuccess(res, {
      id: orderRef.id,
      ...updatedOrderData,
      createdAt: updatedOrderData.createdAt?.toDate
        ? updatedOrderData.createdAt.toDate().toISOString()
        : updatedOrderData.createdAt,
      statusHistory: (updatedOrderData.statusHistory || []).map((entry) => ({
        ...entry,
        timestamp: entry.timestamp?.toDate
          ? entry.timestamp.toDate().toISOString()
          : entry.timestamp,
      })),
    });
  } catch (error) {
    console.error("Error in updateOrderStatus:", error);
    handleError(res, error, {
      status: 400,
      defaultMessage: "Error updating order status",
    });
  }
};

/**
 * Deletes an order (admin only)
 * POST /deleteOrder
 * Body: { orderId }
 * Requires: Admin authentication
 */
exports.deleteOrder = async (req, res) => {
  try {
    const body = parseBody(req.body);
    await requireAdmin(req);

    validateId(body.orderId);

    const orderRef = admin.firestore().collection("orders").doc(body.orderId);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists()) {
      return sendError(res, 404, "Order not found");
    }

    await orderRef.delete();

    sendSuccess(res, { message: "Order deleted successfully" });
  } catch (error) {
    handleError(res, error, {
      status: 400,
      defaultMessage: "Error deleting order",
    });
  }
};
