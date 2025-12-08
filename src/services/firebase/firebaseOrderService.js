/**
 * firebaseOrderService.js
 * Firebase Cloud Functions integration for orders.
 * All order operations go through Cloud Functions for security and validation.
 */

import { apiPostAuth } from "./apiClient";

const BASE_URL = import.meta.env.VITE_FIREBASE_FUNCTIONS_BASE_URL;

/**
 * Creates a new order via Cloud Function
 * @param {Object} orderData - Complete order object
 * @param {string} token - Firebase Auth token
 * @returns {Promise<Object>} - Created order with ID
 * @throws {Error} - If creation fails
 */
export async function createOrder(orderData, token) {
  try {
    const response = await fetch(`${BASE_URL}/createOrder`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "No se pudo crear el pedido");
    }

    return response.json();
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
}

/**
 * Retrieves a single order by ID
 * @param {string} orderId - Order document ID
 * @param {string} token - Firebase Auth token
 * @returns {Promise<Object>} - Order data
 * @throws {Error} - If retrieval fails
 */
export async function getOrder(orderId, token) {
  try {
    const response = await fetch(`${BASE_URL}/getOrder?orderId=${orderId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Pedido no encontrado");
    }

    return response.json();
  } catch (error) {
    console.error("Error retrieving order:", error);
    throw error;
  }
}

/**
 * Retrieves all orders for the authenticated user
 * @param {string} token - Firebase Auth token
 * @returns {Promise<Object>} - {orders: Array, count: number}
 * @throws {Error} - If retrieval fails
 */
export async function getUserOrders(token) {
  try {
    const response = await fetch(`${BASE_URL}/getUserOrders`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "No se pudieron obtener los pedidos");
    }

    return response.json();
  } catch (error) {
    console.error("Error retrieving user orders:", error);
    throw error;
  }
}

/**
 * Retrieves all orders (admin only)
 * @param {string} token - Firebase Auth token
 * @returns {Promise<Object>} - {orders: Array, count: number}
 * @throws {Error} - If retrieval fails or not admin
 */
export async function getAllOrders(token) {
  try {
    const response = await fetch(`${BASE_URL}/getAllOrders`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "No se pudieron obtener los pedidos");
    }

    return response.json();
  } catch (error) {
    console.error("Error retrieving all orders:", error);
    throw error;
  }
}

/**
 * Updates order status and adds to status history
 * @param {Object} updateData - {orderId, newStatus, note, updatedBy}
 * @param {string} token - Firebase Auth token
 * @returns {Promise<Object>} - Updated order
 * @throws {Error} - If update fails or not admin
 */
export async function updateOrderStatus(updateData, token) {
  try {
    const response = await fetch(`${BASE_URL}/updateOrderStatus`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || "No se pudo actualizar el estado del pedido"
      );
    }

    return response.json();
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
}

/**
 * Retrieves orders filtered by status (admin only)
 * @param {string} status - Order status to filter by
 * @param {string} token - Firebase Auth token
 * @returns {Promise<Object>} - {orders: Array, count: number}
 * @throws {Error} - If retrieval fails or not admin
 */
export async function getOrdersByStatus(status, token) {
  try {
    const response = await fetch(
      `${BASE_URL}/getOrdersByStatus?status=${status}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "No se pudieron obtener los pedidos");
    }

    return response.json();
  } catch (error) {
    console.error("Error retrieving orders by status:", error);
    throw error;
  }
}

/**
 * Deletes an order (admin only)
 * @param {string} orderId - Order document ID
 * @param {string} token - Firebase Auth token
 * @returns {Promise<Object>} - Deletion confirmation
 * @throws {Error} - If deletion fails or not admin
 */
export async function deleteOrder(orderId, token) {
  try {
    const response = await fetch(`${BASE_URL}/deleteOrder`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ orderId }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "No se pudo eliminar el pedido");
    }

    return response.json();
  } catch (error) {
    console.error("Error deleting order:", error);
    throw error;
  }
}
