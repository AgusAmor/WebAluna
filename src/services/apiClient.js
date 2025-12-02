/**
 * Firebase API Client Utility
 * Centralizes common API call patterns with authentication, error handling,
 * and response parsing
 */

const BASE_URL = import.meta.env.VITE_FIREBASE_FUNCTIONS_BASE_URL;

/**
 * Makes an authenticated API request to Firebase Functions
 * @param {string} endpoint - API endpoint (e.g., '/getUsers', '/deleteProduct')
 * @param {object} options - Fetch options { method, body, token, query }
 * @returns {Promise<any>} Parsed JSON response
 * @throws {Error} With descriptive error message
 */
export async function apiCall(endpoint, options = {}) {
  const { method = "GET", body = null, token = null, query = null } = options;

  // Build URL with query params if provided
  let url = `${BASE_URL}${endpoint}`;
  if (query) {
    const params = new URLSearchParams(query);
    url += `?${params.toString()}`;
  }

  // Build headers
  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Make request
  const response = await fetch(url, {
    method,
    headers,
    ...(body && { body: JSON.stringify(body) }),
  });

  // Parse response
  const data = await response.json().catch(() => ({}));

  // Handle errors
  if (!response.ok) {
    throw new Error(data.error || `API error: ${response.status}`);
  }

  return data;
}

/**
 * Makes a GET request to Firebase Functions
 * @param {string} endpoint - API endpoint
 * @param {object} options - Options { token, query }
 * @returns {Promise<any>} Parsed response
 */
export function apiGet(endpoint, options = {}) {
  return apiCall(endpoint, { method: "GET", ...options });
}

/**
 * Makes a POST request to Firebase Functions
 * @param {string} endpoint - API endpoint
 * @param {any} body - Request body
 * @param {string} token - Firebase Auth token (optional)
 * @returns {Promise<any>} Parsed response
 */
export function apiPost(endpoint, body, token = null) {
  return apiCall(endpoint, { method: "POST", body, token });
}

/**
 * Makes an authenticated POST request
 * @param {string} endpoint - API endpoint
 * @param {any} body - Request body
 * @param {string} token - Firebase Auth token (required)
 * @returns {Promise<any>} Parsed response
 */
export function apiPostAuth(endpoint, body, token) {
  if (!token) {
    throw new Error("Authentication token is required");
  }
  return apiPost(endpoint, body, token);
}
