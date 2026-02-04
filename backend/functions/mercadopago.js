/**
 * mercadopago.js
 * Cloud Functions for Mercado Pago payment processing
 * Handles preference creation and webhook notifications
 */

const admin = require("./config/firebaseAdmin.js");
const {
  getMPClient,
  Preference,
  MP_CONFIG,
} = require("./config/mercadoPagoConfig.js");
const { verifyToken } = require("./utils/authUtils.js");
const { parseBody, validateRequiredFields } = require("./utils/validation.js");
const {
  sendSuccess,
  handleError,
  sendError,
} = require("./utils/responseHandler.js");

/**
 * Create a Mercado Pago preference for payment
 * POST /createMPPreference
 * Body: {
 *   orderId: string (Firestore order document ID),
 *   orderNumber: string,
 *   items: Array<{name, quantity, unitPrice}>,
 *   total: number,
 *   customerInfo: {name, email, phone},
 *   returnUrls: {success, failure}
 * }
 * Requires: Valid user authentication
 */
exports.createMPPreference = async (req, res) => {
  try {
    // console.log("=== STARTING createMPPreference ===");
    // console.log("Request method:", req.method);
    // console.log("Request headers:", req.headers);
    // console.log("Raw request body type:", typeof req.body);
    // console.log("Raw request body:", req.body);

    const body = parseBody(req.body);
    // console.log("Parsed body:", JSON.stringify(body, null, 2));

    const decoded = await verifyToken(req.headers.authorization);
    // console.log("Auth decoded UID:", decoded.uid);

    // Validate required fields
    validateRequiredFields(body, [
      "orderId",
      "orderNumber",
      "items",
      "total",
      "customerInfo",
      "returnUrls",
    ]);
    // console.log("✓ All required fields present");

    // Get Mercado Pago client
    const client = getMPClient();
    // console.log("✓ MP client created");

    // Validate items before building
    if (!body.items || body.items.length === 0) {
      throw { status: 400, message: "No items provided" };
    }
    // console.log("Items count:", body.items.length);

    body.items.forEach((item, idx) => {
      // console.log(`Item ${idx + 1}:`, {
      //   name: item.productName || item.name,
      //   price: item.unitPrice,
      //   quantity: item.quantity,
      //   size: item.size,
      // });
      if (!item.unitPrice || parseFloat(item.unitPrice) <= 0) {
        throw {
          status: 400,
          message: `Item ${idx + 1} has invalid price: ${item.unitPrice}`,
        };
      }
      if (!item.quantity || parseInt(item.quantity) <= 0) {
        throw {
          status: 400,
          message: `Item ${idx + 1} has invalid quantity: ${item.quantity}`,
        };
      }
    });
    // console.log("✓ All items valid");

    // Build items array for MP - only include fields that have values
    const mpItems = body.items.map((item, idx) => {
      const mpItem = {
        title: item.productName || item.name || "Producto",
        quantity: parseInt(item.quantity),
        unit_price: parseFloat(item.unitPrice),
      };

      // Only add optional fields if they have values
      if (item.size) {
        mpItem.description = `Tamaño: ${item.size}`;
      }
      if (item.image) {
        mpItem.picture_url = item.image;
      }

      // console.log(`MP Item ${idx + 1} built:`, JSON.stringify(mpItem, null, 2));
      return mpItem;
    });

    // Add shipping cost as a separate item if applicable
    const shippingCost = parseFloat(body.shippingCost) || 0;
    // console.log("Shipping cost from body:", shippingCost);
    // console.log("Delivery method from body:", body.deliveryMethod);

    if (body.deliveryMethod === "shipping" && shippingCost > 0) {
      const shippingItem = {
        title: "Envío",
        description: "Costo de envío",
        quantity: 1,
        unit_price: shippingCost,
      };
      mpItems.push(shippingItem);
      // console.log(
      //   "✓ Added shipping item:",
      //   JSON.stringify(shippingItem, null, 2),
      // );
    } else {
      // console.log(
      //   "Shipping not added - method:",
      //   body.deliveryMethod,
      //   "cost:",
      //   shippingCost,
      // );
    }

    // console.log("Final MP items array:", JSON.stringify(mpItems, null, 2));

    // Calculate total from items
    const calculatedTotal = mpItems.reduce((sum, item) => {
      const itemTotal = item.unit_price * item.quantity;
      // console.log(
      //   `Item: ${item.title} - $${item.unit_price} x ${item.quantity} = $${itemTotal}`,
      // );
      return sum + itemTotal;
    }, 0);
    // console.log("Total calculated from items:", calculatedTotal);
    // console.log("Total from body:", body.total);

    // Build payer info - only include fields with values
    // console.log(
    //   "Customer info from body:",
    //   JSON.stringify(body.customerInfo, null, 2),
    // );

    const payer = {
      name: body.customerInfo.name || "Cliente",
      email: body.customerInfo.email,
    };

    // console.log("Payer built:", JSON.stringify(payer, null, 2));

    // Validate payer
    if (!payer.email) {
      throw { status: 400, message: "Customer email is required" };
    }
    if (!payer.name) {
      throw { status: 400, message: "Customer name is required" };
    }
    // console.log("✓ Payer validated");

    // Only add phone if provided
    if (body.customerInfo.phone) {
      payer.phone = {
        area_code: "54", // Argentina code
        number: body.customerInfo.phone.replace(/\D/g, ""),
      };
    }

    // Validate return URLs
    if (!body.returnUrls.success || !body.returnUrls.failure) {
      throw { status: 400, message: "Valid return URLs required" };
    }
    // console.log("Return URLs:", JSON.stringify(body.returnUrls, null, 2));

    // Build preference object for MP
    // Check if we're using localhost (development)
    const isLocalhost = body.returnUrls.success.includes("localhost");

    // Add collection_status query param to success URL
    // MP will include additional params but we ensure success has the base param
    const successUrlWithStatus = `${body.returnUrls.success}${body.returnUrls.success.includes("?") ? "&" : "?"}collection_status=approved`;

    const preferenceData = {
      items: mpItems,
      payer: payer,
      binary_mode: true, // Only approved/rejected, no pending
      statement_descriptor: "ALUNA LAMPS",
      external_reference: body.orderId,
      back_urls: {
        success: successUrlWithStatus,
        failure: body.returnUrls.failure,
        pending: body.returnUrls.failure,
      },
    };

    // Only add auto_return for production URLs (not localhost)
    if (!isLocalhost) {
      preferenceData.auto_return = "approved";
      // console.log("✓ auto_return added (production URL)");
    } else {
      // console.log("⊘ auto_return skipped (localhost detected)");
    }

    // console.log(
    //   "Back URLs:",
    //   JSON.stringify(preferenceData.back_urls, null, 2),
    // );

    // Only add notification_url if it's not localhost
    const notificationUrl = `${
      process.env.CLOUD_FUNCTION_BASE_URL ||
      "https://southamerica-east1-aluna-1af1f.cloudfunctions.net"
    }/mercadopagoWebhook`;

    if (!notificationUrl.includes("localhost")) {
      preferenceData.notification_url = notificationUrl;
      // console.log("✓ Notification URL added:", notificationUrl);
    } else {
      // console.log("⊘ Notification URL skipped (localhost)");
    }

    // console.log("=== FINAL PREFERENCE DATA ===");
    // console.log(JSON.stringify(preferenceData, null, 2));
    // console.log("=============================");

    // Create preference in Mercado Pago
    // console.log("Sending preference to MP SDK...");
    const preference = new Preference(client);
    const createdPreference = await preference.create({
      body: preferenceData,
    });

    // console.log("✓ Preference created successfully!");
    // console.log("Full response from MP:", createdPreference);
    // console.log("Response keys:", Object.keys(createdPreference));
    // console.log("Preference ID:", createdPreference.id);
    // console.log("Init Point:", createdPreference.init_point);
    // console.log("Sandbox Init Point:", createdPreference.sandbox_init_point);
    // console.log("Init Point type:", typeof createdPreference.init_point);
    // console.log(
    //   "Sandbox Init Point type:",
    //   typeof createdPreference.sandbox_init_point,
    // );

    // Check if there are any error fields
    if (createdPreference.error) {
      console.error("MP Error response:", createdPreference.error);
    }

    // Store preference ID in Firestore for tracking
    if (body.orderId) {
      try {
        await admin.firestore().collection("orders").doc(body.orderId).update({
          mercadopagoPreferenceId: createdPreference.id,
          preferenceCreatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      } catch (err) {
        console.warn("Could not update order with preference ID:", err.message);
        // Don't fail - the preference was created, we just couldn't store the ID
      }
    }

    const responseToClient = {
      preferenceId: createdPreference.id,
      initPoint: createdPreference.init_point,
      sandboxInitPoint: createdPreference.sandbox_init_point,
    };

    // console.log(
    //   "Response to client:",
    //   JSON.stringify(responseToClient, null, 2),
    // );

    sendSuccess(res, responseToClient, 200);
    // console.log("=== SUCCESS: Preference returned to client ===");
  } catch (error) {
    console.error("❌ ERROR creating MP preference:");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error status:", error.status);
    console.error("Full error:", JSON.stringify(error, null, 2));
    handleError(res, error, {
      status: 400,
      defaultMessage: "Error creating payment preference",
    });
  }
};

/**
 * Webhook endpoint for Mercado Pago payment notifications
 * POST /mercadopagoWebhook
 * Mercado Pago will POST to this endpoint when payment status changes
 *
 * Query params: ?type=payment&data.id=PAYMENT_ID
 */
exports.mercadopagoWebhook = async (req, res) => {
  // Set CORS headers for webhook (MP sends server-to-server requests)
  res.set("Access-Control-Allow-Origin", "*");
  res.set(
    "Access-Control-Allow-Methods",
    "GET, HEAD, POST, PUT, DELETE, OPTIONS",
  );
  res.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With, Accept",
  );

  // Handle preflight OPTIONS (though MP won't send these)
  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  try {
    // MP sends notification type and data ID as query parameters
    const notificationType = req.query.type;
    const dataId = req.query["data.id"];

    // Only process payment notifications
    if (notificationType !== MP_CONFIG.NOTIFICATION_TYPES.PAYMENT) {
      console.log(`Ignoring notification type: ${notificationType}`);
      return sendSuccess(res, { acknowledged: true }, 200);
    }

    if (!dataId) {
      return sendError(res, 400, "Missing payment ID");
    }

    console.log(`Processing MP payment notification: ${dataId}`);

    // Get Mercado Pago client to retrieve payment details
    const client = getMPClient();
    const { Payment } = require("mercadopago");
    const payment = new Payment(client);

    // Fetch full payment details from MP
    const paymentData = await payment.get({ id: dataId });
    const paymentInfo = paymentData;

    console.log(`Payment status: ${paymentInfo.status}`);
    console.log(
      `External reference (order ID): ${paymentInfo.external_reference}`,
    );

    // Get order from Firestore using external_reference (orderId)
    const orderId = paymentInfo.external_reference;
    if (!orderId) {
      console.warn("Payment has no external_reference (order ID)");
      return sendSuccess(res, { acknowledged: true }, 200);
    }

    const orderRef = admin.firestore().collection("orders").doc(orderId);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      console.warn(`Order not found: ${orderId}`);
      return sendSuccess(res, { acknowledged: true }, 200);
    }

    const orderData = orderDoc.data();

    // Log order data structure for debugging
    console.log("Order data retrieved:", {
      id: orderId,
      hasCustomerInfo: !!orderData.customerInfo,
      email: orderData.customerInfo?.email,
      customerInfoKeys: Object.keys(orderData.customerInfo || {}),
    });

    // Handle different payment statuses
    if (MP_CONFIG.SUCCESS_STATUSES.includes(paymentInfo.status)) {
      // Payment approved - update order status to confirmed
      const timestamp = new Date().toISOString();
      await orderRef.update({
        status: "confirmed",
        paymentStatus: "approved",
        mercadopagoPaymentId: paymentInfo.id,
        paymentMethod: paymentInfo.payment_method_id || "credit_card",
        paymentDate: admin.firestore.FieldValue.serverTimestamp(),
        statusHistory: admin.firestore.FieldValue.arrayUnion({
          status: "confirmed",
          timestamp: timestamp,
          note: `Pago confirmado por Mercado Pago (ID: ${paymentInfo.id})`,
          updatedBy: "system",
        }),
      });

      // Email will be sent by emailService.js via Firestore trigger
      console.log(`Order confirmed: ${orderId}`);
    } else if (MP_CONFIG.FAILURE_STATUSES.includes(paymentInfo.status)) {
      // Payment rejected/cancelled - update order status to cancelled
      const timestamp = new Date().toISOString();
      await orderRef.update({
        status: "cancelled",
        paymentStatus: paymentInfo.status,
        mercadopagoPaymentId: paymentInfo.id,
        cancelledAt: admin.firestore.FieldValue.serverTimestamp(),
        statusHistory: admin.firestore.FieldValue.arrayUnion({
          status: "cancelled",
          timestamp: timestamp,
          note: `Pago ${paymentInfo.status} por Mercado Pago`,
          updatedBy: "system",
        }),
      });

      console.log(`Order cancelled: ${orderId}`);
    } else if (MP_CONFIG.PENDING_STATUSES.includes(paymentInfo.status)) {
      // Payment pending - just log, don't update (order stays in pending)
      console.log(`Payment pending: ${orderId}`);
    }

    // Always return 200 to acknowledge receipt
    sendSuccess(res, { acknowledged: true }, 200);
  } catch (error) {
    console.error("Error processing webhook:", error);
    // Still return 200 so MP doesn't keep retrying
    sendSuccess(res, { acknowledged: true, error: error.message }, 200);
  }
};

/**
 * Retrieve payment status from Mercado Pago
 * GET /getMPPaymentStatus?orderId=ORDER_ID
 * Requires: Valid user authentication
 */
exports.getMPPaymentStatus = async (req, res) => {
  try {
    const decoded = await verifyToken(req.headers.authorization);
    const { orderId } = req.query;

    if (!orderId) {
      return sendError(res, 400, "Missing orderId parameter");
    }

    // Get order from Firestore
    const orderDoc = await admin
      .firestore()
      .collection("orders")
      .doc(orderId)
      .get();

    if (!orderDoc.exists) {
      return sendError(res, 404, "Order not found");
    }

    const orderData = orderDoc.data();

    // Verify user owns this order
    if (orderData.userId !== decoded.uid) {
      return sendError(res, 403, "Unauthorized");
    }

    sendSuccess(
      res,
      {
        status: orderData.status,
        paymentStatus: orderData.paymentStatus || "pending",
        mercadopagoPaymentId: orderData.mercadopagoPaymentId || null,
      },
      200,
    );
  } catch (error) {
    console.error("Error getting payment status:", error);
    handleError(res, error, {
      status: 400,
      defaultMessage: "Error retrieving payment status",
    });
  }
};
