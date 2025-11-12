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
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png"],
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

export default {
  APP_CONFIG,
  DB_CONFIG,
};
