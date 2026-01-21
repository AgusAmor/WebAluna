export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:3001/api",
  TIMEOUT: 10000,

  ENDPOINTS: {
    AUTH: {
      LOGIN: "/auth/login",
      REGISTER: "/auth/register",
      LOGOUT: "/auth/logout",
      ME: "/auth/me",
    },
    PRODUCTS: {
      LIST: "/products",
      DETAIL: "/products/:id",
      CREATE: "/products",
      UPDATE: "/products/:id",
      DELETE: "/products/:id",
      CATEGORIES: "/products/categories",
      SEARCH: "/products/search",
    },
    ORDERS: {
      CREATE: "/orders",
      LIST: "/orders",
      DETAIL: "/orders/:id",
      UPDATE_STATUS: "/orders/:id/status",
    },
    USERS: {
      PROFILE: "/users/profile",
      UPDATE_PROFILE: "/users/profile",
      LIST: "/users",
    },
  },
};

export const APP_CONFIG = {
  NAME: "Aluna",
  VERSION: "1.0.0",
  DESCRIPTION: "E-commerce de lámparas con impresión 3D",
  DEFAULT_LANGUAGE: "es",
  CURRENCY: "ARS",
  CURRENCY_SYMBOL: "$",

  PRODUCTS_PER_PAGE: 12,
  MAX_PRODUCTS_PER_PAGE: 48,

  MAX_IMAGE_SIZE: 5 * 1024 * 1024,
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp"],
};

export const DB_CONFIG = {
  FIREBASE: {
    COLLECTIONS: {
      USERS: "users",
      PRODUCTS: "products",
      ORDERS: "orders",
    },
  },
};

export const SHIPPING_CONFIG = {
  // Shipping cost calculation
  BASE_COST: 100, // ARS
  COST_PER_KM: 10, // ARS per km
  MAX_SHIPPING_DISTANCE: 100, // km

  // Warehouse location for distance calculation
  WAREHOUSE: {
    latitude: -34.5657935,
    longitude: -58.5007791,
  },
};

export default {
  API_CONFIG,
  APP_CONFIG,
  DB_CONFIG,
  SHIPPING_CONFIG,
};
