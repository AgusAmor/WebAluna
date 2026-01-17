/**
 * firebaseEmailService.js
 * Frontend service for email validation operations
 * Handles email verification and domain validation
 * All operations performed on the frontend client
 */

const BASE_URL = import.meta.env.VITE_FIREBASE_FUNCTIONS_BASE_URL;

/**
 * Checks if an email exists in Firebase Authentication by calling backend Cloud Function
 * @param {string} email - Email to verify
 * @returns {Promise<boolean>} True if email exists
 * @throws {Error} If verification fails
 */
export async function verifyEmailExists(email) {
  try {
    const response = await fetch(`${BASE_URL}/verifyUserEmail`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    if (response.ok && typeof data.exists === "boolean") {
      return data.exists;
    }

    throw new Error(data.error || "No se pudo verificar el email");
  } catch (error) {
    console.error("Error verifying email:", error);
    throw error;
  }
}

/**
 * Validates email domain by checking MX records
 * Calls backend Cloud Function for DNS validation
 * @param {string} email - Email to validate
 * @returns {Promise<boolean>} True if domain is valid
 * @throws {Error} If domain is invalid or validation fails
 */
export async function validateEmailDomain(email) {
  const domain = email.split("@")[1];
  if (!domain) {
    throw new Error("La dirección de correo no es válida");
  }

  try {
    const response = await fetch(`${BASE_URL}/validateEmailDomain`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "La dirección de correo no existe o no es válida",
      );
    }

    return true;
  } catch (error) {
    console.error("Error validating email domain:", error);
    throw new Error("La dirección de correo no existe o no es válida");
  }
}
