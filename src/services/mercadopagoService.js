/**
 * mercadopagoService.js
 * Frontend service for Mercado Pago integration
 * Handles preference creation and payment processing
 */

/**
 * Initialize Mercado Pago SDK on the client side
 * @param {string} publicKey - MP Public Key
 */
export async function initializeMercadoPago(publicKey) {
  try {
    // Load MP SDK from CDN if not already loaded
    if (window.MercadoPago) {
      new window.MercadoPago(publicKey);
      // console.log("Mercado Pago SDK initialized successfully");
      return true;
    }

    // Fallback: Load SDK dynamically
    const script = document.querySelector('script[src*="sdk.mercadopago.com"]');
    if (!script) {
      const sdkScript = document.createElement("script");
      sdkScript.src = "https://sdk.mercadopago.com/js/v2";
      sdkScript.async = true;
      sdkScript.onload = () => {
        if (window.MercadoPago) {
          new window.MercadoPago(publicKey);
          // console.log("Mercado Pago SDK loaded and initialized");
        }
      };
      document.head.appendChild(sdkScript);
    }

    return true;
  } catch (error) {
    console.error("Error initializing Mercado Pago:", error);
    // Don't throw - allow app to continue even if MP fails to initialize
    return false;
  }
}

/**
 * Create a payment preference and redirect to Mercado Pago
 * @param {Object} orderData - Order data for the preference
 * @param {string} token - Firebase auth token
 * @returns {Promise<string>} - Init point URL to redirect to
 */
export async function redirectToMercadoPago(orderData, token) {
  try {
    // console.log("=== START redirectToMercadoPago ===");
    // console.log("Order data received:", JSON.stringify(orderData, null, 2));

    // Get Cloud Functions URL with fallback
    const functionsUrl =
      import.meta.env.VITE_FIREBASE_FUNCTIONS_BASE_URL ||
      "https://southamerica-east1-aluna-1af1f.cloudfunctions.net";

    // console.log("[MP Service] Using functions URL:", functionsUrl);
    // console.log(
    //   "[MP Service] VITE_FIREBASE_FUNCTIONS_BASE_URL =",
    //   import.meta.env.VITE_FIREBASE_FUNCTIONS_BASE_URL,
    // );

    // Prepare return URLs - redirect back to HOME
    const baseURL = window.location.origin;
    const returnUrls = {
      success: `${baseURL}/`, // Redirects to Home component
      failure: `${baseURL}/checkout`,
      pending: `${baseURL}/checkout`,
    };
    // console.log("[MP Service] Return URLs:", returnUrls);

    // Build request body
    const preferenceData = {
      orderId: orderData.id,
      orderNumber: orderData.orderNumber,
      items: orderData.items,
      total: orderData.summary.total,
      subtotal: orderData.summary.subtotal || 0,
      shippingCost: orderData.delivery?.cost || 0,
      deliveryMethod: orderData.delivery?.method || "pickup",
      customerInfo: orderData.customerInfo,
      returnUrls,
    };

    // console.log(
    //   "[MP Service] Full preference data to send:",
    //   JSON.stringify(preferenceData, null, 2),
    // );
    // console.log(
    //   "[MP Service] Calling createMPPreference at:",
    //   `${functionsUrl}/createMPPreference`,
    // );

    // Call Cloud Function to create preference
    const response = await fetch(`${functionsUrl}/createMPPreference`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(preferenceData),
    });

    // console.log("[MP Service] ✓ Fetch completed");
    // console.log("[MP Service] Response status:", response.status);
    // console.log("[MP Service] Response status text:", response.statusText);
    // console.log(
    //   "[MP Service] CORS header:",
    //   response.headers.get("access-control-allow-origin"),
    // );

    if (!response.ok) {
      let errorData = { error: response.statusText };
      try {
        const text = await response.text();
        console.error("[MP Service] ❌ Error response body:", text);
        errorData = JSON.parse(text);
      } catch (e) {
        console.warn(
          "[MP Service] Could not parse error response as JSON:",
          e.message,
        );
      }
      const errorMsg =
        errorData.error || `Error creating preference: ${response.statusText}`;
      console.error("[MP Service] ❌ Final error message:", errorMsg);
      throw new Error(errorMsg);
    }

    const responseData = await response.json();
    // console.log(
    //   "[MP Service] ✓ Success response:",
    //   JSON.stringify(responseData, null, 2),
    // );

    const { initPoint, sandboxInitPoint } = responseData;
    // console.log("[MP Service] Init Point:", initPoint);
    // console.log("[MP Service] Sandbox Init Point:", sandboxInitPoint);

    // Return the appropriate init point
    const mpEnv = import.meta.env.VITE_MP_ENVIRONMENT;
    // console.log("[MP Service] Environment:", mpEnv);

    const urlToRedirect =
      mpEnv === "production" ? initPoint : sandboxInitPoint || initPoint;

    if (!urlToRedirect) {
      throw new Error("No payment URL received from Mercado Pago");
    }

    // console.log("[MP Service] ✓ Redirecting to:", urlToRedirect);
    // console.log("=== END redirectToMercadoPago ===");

    return urlToRedirect;
  } catch (error) {
    console.error("❌ Error creating Mercado Pago preference:");
    console.error("Error message:", error.message);
    console.error("Full error:", error);
    // console.log("=== END redirectToMercadoPago (WITH ERROR) ===");
    throw error;
  }
}

/**
 * Get payment status for an order
 * @param {string} orderId - Order ID in Firestore
 * @param {string} token - Firebase auth token
 * @returns {Promise<Object>} - Payment status info
 */
export async function getPaymentStatus(orderId, token) {
  try {
    const functionsUrl =
      import.meta.env.VITE_FIREBASE_FUNCTIONS_BASE_URL ||
      "https://southamerica-east1-aluna-1af1f.cloudfunctions.net";

    const response = await fetch(
      `${functionsUrl}/getMPPaymentStatus?orderId=${orderId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error fetching payment status");
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting payment status:", error);
    throw error;
  }
}

/**
 * Check if there's a payment return from MP in URL params
 * MP redirects with: ?collection_id=xxx&collection_status=approved&preference_id=xxx
 */
export function checkMPPaymentReturn(searchParams) {
  const collectionStatus = searchParams.get("collection_status");
  const collectionId = searchParams.get("collection_id");

  if (collectionStatus) {
    return {
      isSuccess: collectionStatus === "approved",
      status: collectionStatus,
      paymentId: collectionId,
    };
  }

  return null;
}
