/**
 * emailService.js
 * Service for sending emails using Gmail via Nodemailer
 * Handles order status notification emails with professional branding
 */

const nodemailer = require("nodemailer");
const { defineString } = require("firebase-functions/params");
const { onDocumentWritten } = require("firebase-functions/v2/firestore");

const REGION = "southamerica-east1";

// Order status messages constants
const ORDER_STATUS_MESSAGES = {
  confirmed: {
    title: "¡Tu pedido ha sido confirmado!",
    message: "ha sido confirmado.",
    footer:
      "Ya confirmamos tu pago y estamos preparando todo para comenzar a imprimir. Te mantendremos al tanto del avance de tu pedido.",
  },
  printing: {
    title: "¡Ya estamos imprimiendo tu pedido!",
    message: "está siendo elaborado.",
    footer:
      "Este proceso se realiza con dedicación y precisión. ¡Tu pedido pronto estará listo!",
  },
  dispatched: {
    // Varies by delivery method (shipping or pickup)
    shipping: {
      title: "Tu pedido está listo para el envío",
      message: "está listo y lo enviaremos a la brevedad.",
      footer:
        "Nos pondremos en contacto con el destinatario cuando tu pedido esté en camino.",
    },
    pickup: {
      title: "Tu pedido está esperando ser retirado",
      message: "está listo y esperando ser retirado.",
      footer:
        "Puedes pasar a recogerlo cualquier día de 14hs a 20hs por la dirección indicada en los detalles de tu pedido.",
    },
  },
  delivered: {
    title: "Tu pedido ha sido entregado",
    message: "ha sido entregado.",
    footer:
      "Esperamos que disfrutes tu nueva lámpara Aluna. Gracias por elegirnos para ambientar tu espacio.",
  },
  withdrawn: {
    title: "Tu pedido ha sido retirado",
    message: "ha sido retirado exitosamente.",
    footer:
      "Esperamos que disfrutes tu nueva lámpara Aluna. Gracias por elegirnos para ambientar tu espacio.",
  },
  cancelled: {
    title: "Tu pedido ha sido cancelado",
    message: "ha sido cancelado.",
    footer:
      "Si tienes dudas, no dudes en contactarnos. Estamos aquí para ayudarte.",
  },
};

// Delivery method constants
const DELIVERY_METHODS = {
  SHIPPING: "shipping",
  PICKUP: "pickup",
};

// Define email configuration parameters
const emailUser = defineString("EMAIL_USER");
const emailPassword = defineString("EMAIL_PASSWORD");

// Color palette from brand
const COLORS = {
  blue1: "#264e60",
  blue2: "#427385",
  blue3: "#81a5ae",
  gray1: "#a9b2b9",
  gray2: "#c3c9ce",
  gray3: "#d9dce0",
  gold: "#b6a269",
  black: "#2b2b2b",
  white: "#f4f4f4",
};

/**
 * Returns CSS styles for email templates
 */
const getEmailStyles = () => `
  @import url('https://fonts.googleapis.com/css2?family=Comfortaa:wght@400;700&family=Sora:wght@400;500;600;700&display=swap');
  
  body {
    font-family: 'Sora', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background-color: ${COLORS.gray3};
    margin: 0;
    padding: 20px;
  }
  .container {
    max-width: 600px;
    margin: 0 auto;
    background-color: ${COLORS.white};
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(38, 78, 96, 0.1);
    overflow: hidden;
  }
  .header {
    background: linear-gradient(135deg, ${COLORS.blue2} 0%, ${COLORS.blue1} 100%);
    color: white;
    padding: 30px 20px;
    text-align: center;
  }
  .logo { margin-bottom: 10px; }
  .logo img { max-width: 220px; height: auto; }
  .title {
    font-family: 'Comfortaa', sans-serif;
    font-size: 28px;
    font-weight: bold;
    margin: 10px 0 0 0;
    color: white;
  }
  .content { padding: 30px 20px; color: ${COLORS.black}; }
  .greeting { font-size: 16px; margin-bottom: 20px; color: ${COLORS.black}; }
  .message { font-size: 15px; line-height: 1.6; color: ${COLORS.gray1}; margin-bottom: 20px; }
  .highlight { color: ${COLORS.blue2}; font-weight: bold; }
  .products-list {
    background-color: ${COLORS.gray3};
    padding: 15px;
    border-left: 4px solid ${COLORS.gold};
    margin: 5px 0;
    border-radius: 4px;
    color: ${COLORS.blue2};
  }
  .product-name { font-weight: 500; color: ${COLORS.blue2}; }
  .product-price { font-weight: bold; color: ${COLORS.blue2}; float: right; }
  .info-section {
    background-color: ${COLORS.gray3};
    padding: 15px;
    border-left: 4px solid ${COLORS.gold};
    margin: 15px 0;
    border-radius: 4px;
  }
  .info-label { color: ${COLORS.gray1}; font-size: 12px; text-transform: uppercase; font-weight: 600; margin-bottom: 5px; }
  .info-value { color: ${COLORS.blue2}; font-size: 14px; font-weight: 600; }
  .alert-box {
    background-color: #fff3cd;
    border-left: 4px solid ${COLORS.gold};
    padding: 15px;
    margin-bottom: 20px;
    border-radius: 4px;
    color: #856404;
    font-weight: 500;
  }
  .totals {
    background-color: ${COLORS.gray3};
    padding: 15px;
    border-left: 4px solid ${COLORS.gold};
    margin: 15px 0;
    border-radius: 4px;
  }
  .total-row {
    display: flex;
    justify-content: space-between;
    padding: 5px 0;
    color: ${COLORS.blue2};
  }
  .total-amount { font-weight: bold; font-size: 16px; color: ${COLORS.gold}; }
  .footer {
    background-color: ${COLORS.gray3};
    padding: 20px;
    text-align: center;
    font-size: 12px;
    color: ${COLORS.gray1};
    border-top: 1px solid ${COLORS.gray2};
  }
  .divider { height: 1px; background-color: ${COLORS.gray2}; margin: 20px 0; }
`;

/**
 * Generates products HTML
 */
const generateProductsHTML = (items) => {
  if (!items || items.length === 0) return "";

  return items
    .map(
      (product) => `
      <div class="products-list">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="text-align: left; padding-right: 10px; width: 85%;">
              <div class="product-name">${product.productName || product.name || "Producto"}${product.size ? " · " + product.size : ""} · x${product.quantity || 1}</div>
            </td>
            <td style="text-align: right; width: 15%; white-space: nowrap;">
              <div class="product-price">$${(product.price || product.unitPrice || 0).toFixed(2)}</div>
            </td>
          </tr>
        </table>
      </div>
    `,
    )
    .join("");
};

/**
 * Base email template
 */
const getBaseTemplate = (logoUrl, title, content, footer) => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>${getEmailStyles()}</style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <div class="logo">
          <img src="${logoUrl}" alt="Aluna Logo" />
        </div>
        <div class="title">${title}</div>
      </div>
      <div class="content">
        ${content}
      </div>
      <div class="footer">
        ${footer}
      </div>
    </div>
  </body>
  </html>
`;

/**
 * Email templates for different order statuses
 */
const getEmailTemplate = (
  orderNumber,
  status,
  customerName,
  items = [],
  deliveryMethod = DELIVERY_METHODS.SHIPPING,
) => {
  let messageData;
  if (status === "dispatched") {
    const method = deliveryMethod || "shipping";
    messageData =
      ORDER_STATUS_MESSAGES.dispatched[method] ||
      ORDER_STATUS_MESSAGES.dispatched.shipping ||
      ORDER_STATUS_MESSAGES.pending;
  } else {
    messageData =
      ORDER_STATUS_MESSAGES[status] || ORDER_STATUS_MESSAGES.pending;
  }

  const statusLabels = {
    pending: "En proceso",
    confirmed: "Confirmado",
    printing: "Imprimiendo",
    dispatched: "Despachado",
    withdrawn: "Retirado",
    delivered: "Entregado",
    cancelled: "Cancelado",
  };

  const logoUrl =
    "https://firebasestorage.googleapis.com/v0/b/aluna-1af1f.firebasestorage.app/o/brand%2Flogotipo.png?alt=media";
  const content = `
    <div class="greeting">Hola <span class="highlight">${customerName}</span>,</div>
    <div class="message">Tu pedido <span class="highlight">#${orderNumber}</span> ${messageData.message}</div>
    ${generateProductsHTML(items)}
    <div class="divider"></div>
    <div class="message" style="text-align: center; font-size: 13px;">${messageData.footer}</div>
  `;

  const footer = `
    <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
    <p>© 2026 Aluna - Lámparas con impresión 3D</p>
  `;

  return {
    subject: `Pedido #${orderNumber} - ${statusLabels[status] || "Actualización"}`,
    html: getBaseTemplate(logoUrl, messageData.title, content, footer),
  };
};

/**
 */

/**
 * Creates a nodemailer transporter using Gmail
 * Uses Firebase Config for credentials
 * @returns {Object} Nodemailer transporter
 */
const createTransporter = () => {
  try {
    const email = emailUser.value();
    const password = emailPassword.value();

    if (!email || !password) {
      console.error(
        "Email credentials not configured. Run: firebase functions:config:set EMAIL_USER='...' EMAIL_PASSWORD='...'",
      );
      throw new Error("Email credentials not configured");
    }

    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: email,
        pass: password,
      },
    });
  } catch (error) {
    console.error("Error creating transporter:", error);
    throw error;
  }
};

/**
 * Sends an order status notification email
 * @param {string} customerEmail - Customer email address
 * @param {string} customerName - Customer name
 * @param {string} orderNumber - Order number
 * @param {string} status - New order status
 * @param {Array} items - Order items with name, quantity, price
 * @param {string} deliveryMethod - Delivery method for dispatched status (ship or pickup)
 * @returns {Promise<Object>} Email send result
 */
exports.sendOrderStatusEmail = async (
  customerEmail,
  customerName,
  orderNumber,
  status,
  items = [],
  deliveryMethod = DELIVERY_METHODS.SHIPPING,
) => {
  try {
    if (!customerEmail) {
      throw new Error("Customer email is required");
    }

    // console.log("sendOrderStatusEmail received:", {
    //   customerEmail,
    //   customerName,
    //   orderNumber,
    //   status,
    //   deliveryMethod,
    //   itemsCount: items.length,
    //   items: items,
    // });

    // Get email template based on status and delivery method
    const template = getEmailTemplate(
      orderNumber,
      status,
      customerName,
      items,
      deliveryMethod,
    );

    // Create transporter
    const transporter = createTransporter();

    // Send email
    const mailOptions = {
      from: `Aluna <${emailUser.value() || "noreply@aluna.com"}>`,
      to: customerEmail,
      subject: template.subject,
      html: template.html,
    };

    const result = await transporter.sendMail(mailOptions);

    console.log("Email sent successfully:", result.messageId);
    return {
      success: true,
      messageId: result.messageId,
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Sends a generic email
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - HTML content
 * @returns {Promise<Object>} Email send result
 */
exports.sendEmail = async (to, subject, html) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `Aluna <${emailUser.value() || "noreply@aluna.com"}>`,
      to,
      subject,
      html,
    };

    const result = await transporter.sendMail(mailOptions);

    // console.log("Email sent successfully:", result.messageId);
    return {
      success: true,
      messageId: result.messageId,
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Sends notification to admins about order cancellation
 * @param {Object} orderData - Order information
 * @param {string} customerEmail - Customer email
 * @param {string} customerName - Customer name
 * @returns {Promise<Object>} Email send result
 */
exports.sendAdminCancellationNotification = async (
  orderData,
  customerEmail,
  customerName,
) => {
  try {
    const adminEmail = emailUser.value() || "admin@aluna.com";
    const logoUrl =
      "https://firebasestorage.googleapis.com/v0/b/aluna-1af1f.firebasestorage.app/o/brand%2Flogotipo.png?alt=media";

    const content = `
      <div class="alert-box">Un cliente ha cancelado su pedido</div>
      <div class="info-section">
        <div class="info-label">Cliente</div>
        <div class="info-value">${customerName}</div>
        <div class="info-label" style="margin-top: 10px;">Email</div>
        <div class="info-value">${customerEmail}</div>
        <div class="info-label" style="margin-top: 10px;">Orden</div>
        <div class="info-value">#${orderData.orderNumber || "N/A"}</div>
      </div>
      <div class="divider"></div>
      <div style="font-weight: 600; color: ${COLORS.blue2}; margin: 15px 0;">Productos Cancelados</div>
      ${generateProductsHTML(
        (orderData.items || []).map((item) => ({
          name: item.productName || item.name || "Producto",
          quantity: item.quantity || 1,
          price: item.unitPrice || item.price || 0,
          size: item.size,
        })),
      )}
      <div class="totals">
        <div class="total-row">
          <span>Subtotal:</span>
          <span>$${(orderData.summary?.subtotal || 0).toLocaleString("es-AR")}</span>
        </div>
        <div class="total-row">
          <span>Envío:</span>
          <span>$${(orderData.summary?.shipping || 0).toLocaleString("es-AR")}</span>
        </div>
        <div class="total-row total-amount">
          <span>Total Cancelado:</span>
          <span>$${(orderData.totalAmount || orderData.summary?.total || 0).toLocaleString("es-AR")}</span>
        </div>
      </div>
    `;

    const footer = `
      <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
      <p>© 2026 Aluna - Lámparas impresas en 3D, hechas con intención.</p>
    `;

    const transporter = createTransporter();
    const mailOptions = {
      from: `Aluna <${emailUser.value() || "noreply@aluna.com"}>`,
      to: adminEmail,
      subject: `Cancelación de Pedido - Orden #${orderData.orderNumber || "N/A"}`,
      html: getBaseTemplate(
        logoUrl,
        "Notificación de Cancelación",
        content,
        footer,
      ),
    };

    const result = await transporter.sendMail(mailOptions);

    console.log("Admin cancellation notification sent:", result.messageId);
    return {
      success: true,
      messageId: result.messageId,
    };
  } catch (error) {
    console.error("Error sending admin cancellation notification:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Sends a contact form email
 * @param {Object} data - { name, email, phone, message, subject }
 * @returns {Promise<Object>} Email send result
 */
exports.sendContactEmail = async (data) => {
  const { name, email, phone, message, subject } = data;
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `${name} | ${email} <${emailUser.value()}>`,
      to: "aluna.3d.design@gmail.com",
      replyTo: email,
      subject: subject
        ? `Contacto Web: ${subject}`
        : `Nuevo mensaje de contacto Web: ${name}`,
      html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #264e60;">Nuevo mensaje de contacto</h2>
                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px;">
                    <p><strong>De:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Teléfono:</strong> ${phone || "No indicado"}</p>
                    ${subject ? `<p><strong>Asunto:</strong> ${subject}</p>` : ""}
                </div>
                <div style="margin-top: 20px;">
                    <h3 style="color: #264e60;">Mensaje:</h3>
                    <p style="white-space: pre-line; background-color: #fff; padding: 15px; border: 1px solid #eee; border-radius: 5px;">${message}</p>
                </div>
            </div>
        `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Contact email sent:", result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Error sending contact email:", error);
    return { success: false, error: error.message };
  }
};

// Export constants
exports.ORDER_STATUS_MESSAGES = ORDER_STATUS_MESSAGES;

/**
 * Firestore trigger: Send email when order is created or status changes
 * Now handles both creation (as confirmed) and status updates
 */
exports.onOrderStatusChanged = onDocumentWritten(
  { document: "orders/{orderId}", region: REGION },
  async (event) => {
    // If document was deleted, do nothing
    if (!event.data.after.exists) return;

    const newData = event.data.after.data();
    const oldData = event.data.before.exists ? event.data.before.data() : null;
    const orderId = event.params.orderId;

    // console.log(`[onOrderStatusChanged] Order ${orderId} processed`);
    // console.log("Old status:", oldData?.status);
    // console.log("New status:", newData?.status);

    const oldStatus = oldData?.status;
    const newStatus = newData?.status;

    // Check if status changed
    const statusChanged = oldStatus !== newStatus;

    // Process if status changed
    if (statusChanged) {
      // console.log(
      //   `[onOrderStatusChanged] Processing email for order ${orderId} with status ${newStatus}`,
      // );

      try {
        const customerEmail = newData.customerInfo?.email;
        const customerName = newData.customerInfo?.name;
        const orderNumber = newData.orderNumber;
        const items = newData.items || [];
        const deliveryMethod = newData.delivery?.method || "shipping";

        if (!customerEmail) {
          console.warn(
            `[onOrderStatusChanged] No customer email found for order ${orderId}`,
          );
          return;
        }

        // console.log(
        //   `[onOrderStatusChanged] Sending confirmation email to ${customerEmail}`,
        // );

        // Send status update email
        const result = await exports.sendOrderStatusEmail(
          customerEmail,
          customerName,
          orderNumber,
          newStatus,
          items,
          deliveryMethod,
        );

        if (result.success) {
          // console.log(
          //   `[onOrderStatusChanged] ✓ Email sent successfully: ${result.messageId}`,
          // );
        } else {
          console.error(
            `[onOrderStatusChanged] ✗ Failed to send email: ${result.error}`,
          );
        }
      } catch (error) {
        console.error(
          `[onOrderStatusChanged] Error processing order status change:`,
          error,
        );
      }
    }
  },
);
