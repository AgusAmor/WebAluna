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
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
          note: "Pedido creado",
          updatedBy: "system",
        },
      ],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const createdOrder = await docRef.get();

    sendSuccess(
      res,
      {
        id: docRef.id,
        ...createdOrder.data(),
      },
      201
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
      .orderBy("createdAt", "desc")
      .get();

    const orders = [];
    ordersSnapshot.forEach((doc) => {
      orders.push({
        id: doc.id,
        ...doc.data(),
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
      orders.push({
        id: doc.id,
        ...doc.data(),
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
 * Body: { orderId, newStatus, note }
 * Requires: Admin authentication
 */
exports.updateOrderStatus = async (req, res) => {
  try {
    const body = parseBody(req.body);
    await requireAdmin(req);

    validateRequiredFields(body, ["orderId", "newStatus"]);

    const orderRef = admin.firestore().collection("orders").doc(body.orderId);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists()) {
      return sendError(res, 404, "Order not found");
    }

    const currentStatusHistory = orderDoc.data().statusHistory || [];

    await orderRef.update({
      status: body.newStatus,
      statusHistory: admin.firestore.FieldValue.arrayUnion({
        status: body.newStatus,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        note: body.note || "",
        updatedBy: body.updatedBy || "admin",
      }),
    });

    const updatedOrder = await orderRef.get();

    sendSuccess(res, {
      id: orderRef.id,
      ...updatedOrder.data(),
    });
  } catch (error) {
    handleError(res, error, {
      status: 400,
      defaultMessage: "Error updating order status",
    });
  }
};

/**
 * Retrieves orders by status (admin only)
 * GET /getOrdersByStatus?status=...
 * Requires: Admin authentication
 */
exports.getOrdersByStatus = async (req, res) => {
  try {
    const status = req.query.status;
    await requireAdmin(req);

    if (!status) {
      return sendError(res, 400, "Status parameter is required");
    }

    const ordersSnapshot = await admin
      .firestore()
      .collection("orders")
      .where("status", "==", status)
      .orderBy("createdAt", "desc")
      .get();

    const orders = [];
    ordersSnapshot.forEach((doc) => {
      orders.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    sendSuccess(res, { orders, count: orders.length });
  } catch (error) {
    handleError(res, error, {
      status: 400,
      defaultMessage: "Error retrieving orders by status",
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
