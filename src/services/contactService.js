/**
 * contactService.js
 * Service to handle contact form operations
 */

const BASE_URL = import.meta.env.VITE_FIREBASE_FUNCTIONS_BASE_URL;

/**
 * Sends a contact message via the backend API
 * @param {Object} data - Contact form data { name, email, phone, subject, message }
 * @returns {Promise<Object>} Response data
 */
export const sendContactMessage = async (data) => {
  try {
    const response = await fetch(`${BASE_URL}/sendContactMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Error al enviar el mensaje");
    }

    return result;
  } catch (error) {
    console.error("Error in contact service:", error);
    throw error;
  }
};
