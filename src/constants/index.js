// User Roles
export const USER_ROLES = {
  ADMIN: "admin",
  CLIENT: "client",
};

// Order Status
export const ORDER_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
};

// Product Categories
export const PRODUCT_CATEGORIES = {
  TABLE_LAMPS: "table_lamps",
  PENDANT_LAMPS: "pendant_lamps",
  FLOOR_LAMPS: "floor_lamps",
  WALL_LAMPS: "wall_lamps",
  CEILING_LAMPS: "ceiling_lamps",
};

// Cart Actions
export const CART_ACTIONS = {
  ADD_ITEM: "ADD_ITEM",
  UPDATE_QUANTITY: "UPDATE_QUANTITY",
  REMOVE_ITEM: "REMOVE_ITEM",
  CLEAR_CART: "CLEAR_CART",
  LOAD_CART: "LOAD_CART",
};

// UI Constants
export const UI_CONSTANTS = {
  BREAKPOINTS: {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
  },
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 12,
    MAX_PAGE_SIZE: 48,
  },
  TOAST_DURATION: 3000,
};

// Navigation Routes
export const ROUTES = {
  HOME: "/",
  PRODUCTS: "/productos",
  PRODUCT_DETAIL: "/productos/:id",
  CART: "/carrito",
  AUTH: "/auth",
  PROFILE: "/perfil",
  ADMIN: "/admin",
  ADMIN_PRODUCTS: "/admin/productos",
  ADMIN_ORDERS: "/admin/pedidos",
  ADMIN_USERS: "/admin/usuarios",
};

// Form Validation
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
  PHONE_REGEX: /^[\+]?[1-9][\d]{0,15}$/,
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "aluna_auth_token",
  USER_DATA: "aluna_user_data",
  CART_DATA: "aluna_cart_data",
  THEME: "aluna_theme",
  LANGUAGE: "aluna_language",
};

export default {
  USER_ROLES,
  ORDER_STATUS,
  PRODUCT_CATEGORIES,
  CART_ACTIONS,
  UI_CONSTANTS,
  ROUTES,
  VALIDATION,
  STORAGE_KEYS,
};
