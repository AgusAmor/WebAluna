import { createContext, useContext, useReducer, useEffect } from "react";
import { CART_ACTIONS } from "../constants";
import { cartStorageService } from "../services/cartStorageService";

const initialState = {
  items: [],
  total: 0,
  itemCount: 0,
  loading: false,
  error: null,
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.LOAD_CART:
      return {
        ...state,
        items: action.payload.items || [],
        total: action.payload.total || 0,
        itemCount: action.payload.itemCount || 0,
      };

    case CART_ACTIONS.ADD_ITEM: {
      // Use id + selectedType to distinguish items of different sizes
      const itemKey = `${action.payload.id}_${
        action.payload.selectedType || "normal"
      }`;
      const existingItem = state.items.find(
        (item) => `${item.id}_${item.selectedType || "normal"}` === itemKey
      );
      let updatedItems;

      if (existingItem) {
        updatedItems = state.items.map((item) =>
          `${item.id}_${item.selectedType || "normal"}` === itemKey
            ? {
                ...item,
                quantity: item.quantity + (action.payload.quantity || 1),
              }
            : item
        );
      } else {
        updatedItems = [
          ...state.items,
          {
            ...action.payload,
            price: action.payload.selectedPrice, // store selected price
            size: action.payload.selectedSize, // store selected size
            type: action.payload.selectedType, // store selected type
            quantity: action.payload.quantity || 1,
          },
        ];
      }

      const newTotal = updatedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const newItemCount = updatedItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      return {
        ...state,
        items: updatedItems,
        total: newTotal,
        itemCount: newItemCount,
      };
    }

    case CART_ACTIONS.UPDATE_QUANTITY: {
      // Support composite key (id_type) for cart items
      const updatedItems = state.items
        .map((item) => {
          const itemKey = `${item.id}_${item.type || "normal"}`;
          return itemKey === action.payload.id
            ? { ...item, quantity: Math.max(0, action.payload.quantity) }
            : item;
        })
        .filter((item) => item.quantity > 0);

      const newTotal = updatedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const newItemCount = updatedItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      return {
        ...state,
        items: updatedItems,
        total: newTotal,
        itemCount: newItemCount,
      };
    }

    case CART_ACTIONS.REMOVE_ITEM: {
      // Support composite key (id_type) for cart items
      const updatedItems = state.items.filter((item) => {
        const itemKey = `${item.id}_${item.type || "normal"}`;
        return itemKey !== action.payload.id;
      });
      const newTotal = updatedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const newItemCount = updatedItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      return {
        ...state,
        items: updatedItems,
        total: newTotal,
        itemCount: newItemCount,
      };
    }

    case CART_ACTIONS.CLEAR_CART:
      return {
        ...state,
        items: [],
        total: 0,
        itemCount: 0,
      };

    default:
      return state;
  }
};

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    const savedCart = cartStorageService.loadCart();
    if (savedCart) {
      dispatch({ type: CART_ACTIONS.LOAD_CART, payload: savedCart });
    }
  }, []);

  useEffect(() => {
    cartStorageService.saveCart(state);
  }, [state.items, state.total, state.itemCount]);

  const addItem = (product, quantity = 1) => {
    dispatch({
      type: CART_ACTIONS.ADD_ITEM,
      payload: { ...product, quantity },
    });
  };

  const updateQuantity = (id, quantity) => {
    dispatch({
      type: CART_ACTIONS.UPDATE_QUANTITY,
      payload: { id, quantity },
    });
  };

  const removeItem = (id) => {
    dispatch({
      type: CART_ACTIONS.REMOVE_ITEM,
      payload: { id },
    });
  };

  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
    cartStorageService.clearCart();
  };

  const getItemQuantity = (id) => {
    const item = state.items.find((item) => item.id === id);
    return item ? item.quantity : 0;
  };

  const isItemInCart = (id) => {
    return state.items.some((item) => item.id === id);
  };

  const contextValue = {
    ...state,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    getItemQuantity,
    isItemInCart,
  };

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export default CartContext;
