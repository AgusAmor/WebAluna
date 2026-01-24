/**
 * emailService.js
 * Service for sending emails using Gmail via Nodemailer
 * Handles order status notification emails with professional branding
 */

const nodemailer = require("nodemailer");
const { defineString } = require("firebase-functions/params");

// Order status messages constants
export const ORDER_STATUS_MESSAGES = {
  pending: {
    title: "Estamos procesando tu pedido",
    message: "ha sido recibido y está siendo procesado.",
    footer: "Te notificaremos cuando tu pedido sea confirmado.",
  },
  confirmed: {
    title: "¡Tu pedido ha sido confirmado!",
    message: "ha sido confirmado.",
    footer:
      "Estamos preparando todo para comenzar a imprimir. Te mantendremos al tanto del avance de tu pedido.",
  },
  printing: {
    title: "Estamos imprimiendo tu pedido",
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
        "Puedes pasar a recogerlo cualquier dia de 14hs a 20hs por nuestra sucursal.",
    },
  },
  delivered: {
    title: "Tu pedido ha sido entregado",
    message: "ha sido entregado.",
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
  // Color palette from brand
  const colors = {
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

  const baseTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Comfortaa:wght@400;700&family=Sora:wght@400;500;600;700&display=swap');
        
        body {
          font-family: 'Sora', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background-color: ${colors.gray3};
          margin: 0;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: ${colors.white};
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(38, 78, 96, 0.1);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, ${colors.blue2} 0%, ${colors.blue1} 100%);
          color: white;
          padding: 30px 20px;
          text-align: center;
        }
        .logo {
          margin-bottom: 10px;
        }
        .logo img {
          max-width: 220px;
          height: auto;
        }
        .title {
          font-family: 'Comfortaa', sans-serif;
          font-size: 28px;
          font-weight: bold;
          margin: 10px 0 0 0;
          color: white;
        }
        .content {
          padding: 30px 20px;
          color: ${colors.black};
        }
        .greeting {
          font-family: 'Sora', sans-serif;
          font-size: 16px;
          margin-bottom: 20px;
          color: ${colors.black};
        }
        .message {
          font-family: 'Sora', sans-serif;
          font-size: 15px;
          line-height: 1.6;
          color: ${colors.gray1};
          margin-bottom: 20px;
        }
        .highlight {
          color: ${colors.blue2};
          font-weight: bold;
        }
        * {
          font-family: 'Sora', sans-serif !important;
        }
        .products-list {
          background-color: ${colors.gray3};
          padding: 15px;
          border-left: 4px solid ${colors.gold};
          margin: 5px 0;
          border-radius: 4px;
          color: ${colors.blue2};
        }
        .product-item {
          font-family: 'Sora', sans-serif;
          font-size: 14px;
          width: 100%;
        }
        .product-name {
          font-weight: 500;
          color: ${colors.blue2};
          display: inline-block;
          vertical-align: middle;
        }
        .product-qty {
          color: ${colors.gray1};
          display: inline-block;
          margin: 0 10px;
          vertical-align: middle;
        }
        .product-price {
          font-weight: bold;
          color: ${colors.blue2};
          display: inline-block;
          float: right;
          vertical-align: middle;
        }
        .order-number {
          background-color: ${colors.gray3};
          padding: 15px;
          border-left: 4px solid ${colors.gold};
          margin: 20px 0;
          border-radius: 4px;
          font-family: monospace;
          color: ${colors.blue2};
        }
        .footer {
          background-color: ${colors.gray3};
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: ${colors.gray1};
          border-top: 1px solid ${colors.gray2};
          font-family: 'Sora', sans-serif;
        }
        .divider {
          height: 1px;
          background-color: ${colors.gray2};
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">
            <img src="{LOGO_URL}" alt="Aluna Logo" />
          </div>
          <div class="title">{TITLE}</div>
        </div>
        <div class="content">
          <div class="greeting">Hola <span class="highlight">${customerName}</span>,</div>
          <div class="message">
            {MESSAGE}
          </div>
          {PRODUCTS}
          <div class="divider"></div>
          <div class="message" style="text-align: center; font-size: 13px;">
            {FOOTER_MESSAGE}
          </div>
        </div>
        <div class="footer">
          <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
          <p>© 2026 Aluna - Lámparas con impresión 3D</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Get message based on status and delivery method
  let messageData;
  if (status === "dispatched") {
    // For dispatched status, use delivery method to select variant
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
    delivered: "Entregado",
    cancelled: "Cancelado",
  };

  // Build products HTML
  let productsHTML = "";
  if (items && items.length > 0) {
    const productItems = items
      .map(
        (product) => `
      <div class="products-list">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="text-align: left; padding-right: 10px; width: 85%;">
              <div class="product-name">${product.name || "Producto"}${product.size ? " · " + product.size : ""} · x${product.quantity || 1}</div>
            </td>
            <td style="text-align: right; width: 15%; white-space: nowrap;">
              <div class="product-price">$${(product.price || 0).toFixed(2)}</div>
            </td>
          </tr>
        </table>
      </div>
    `,
      )
      .join("");

    productsHTML = productItems;
  }

  return {
    subject: `Pedido #${orderNumber} - ${statusLabels[status] || "Actualización"}`,
    html: baseTemplate
      .replace(
        "{LOGO_URL}",
        "https://firebasestorage.googleapis.com/v0/b/aluna-1af1f.firebasestorage.app/o/brand%2Flogotipo.png?alt=media",
      )
      .replace("{TITLE}", messageData.title)
      .replace(
        "{MESSAGE}",
        `Tu pedido <span class="highlight">#${orderNumber}</span> ${messageData.message}`,
      )
      .replace("{PRODUCTS}", productsHTML)
      .replace("{FOOTER_MESSAGE}", messageData.footer),
  };
};

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

    console.log("sendOrderStatusEmail received:", {
      customerEmail,
      customerName,
      orderNumber,
      status,
      deliveryMethod,
      itemsCount: items.length,
      items: items,
    });

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
