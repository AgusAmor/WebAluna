import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useRef,
} from "react";
import { CART_ACTIONS } from "../constants";
import { cartStorageService } from "../services/cart/cartStorageService";
import {
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
  prepareCartState,
} from "../services/cart/cartService";

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
      const updatedItems = addItemToCart(state.items, action.payload);
      return { ...state, ...prepareCartState(updatedItems) };
    }

    case CART_ACTIONS.UPDATE_QUANTITY: {
      const updatedItems = updateItemQuantity(
        state.items,
        action.payload.id,
        action.payload.quantity
      );
      return { ...state, ...prepareCartState(updatedItems) };
    }

    case CART_ACTIONS.REMOVE_ITEM: {
      const updatedItems = removeItemFromCart(state.items, action.payload.id);
      return { ...state, ...prepareCartState(updatedItems) };
    }

    case CART_ACTIONS.CLEAR_CART:
      return { ...state, ...prepareCartState([]) };

    default:
      return state;
  }
};

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const cartLoadedRef = useRef(false);

  // Load cart from sessionStorage on mount
  useEffect(() => {
    const savedCart = cartStorageService.loadCart();
    if (savedCart) {
      dispatch({ type: CART_ACTIONS.LOAD_CART, payload: savedCart });
    }
    cartLoadedRef.current = true;
  }, []);

  // Save cart to sessionStorage whenever it changes (but skip initial load)
  useEffect(() => {
    if (cartLoadedRef.current) {
      cartStorageService.saveCart(state);
    }
  }, [state.items, state.total, state.itemCount]);

  // Listen for 'cartCleared' event (dispatched when user logs out)
  useEffect(() => {
    const handleCartCleared = () => {
      dispatch({ type: CART_ACTIONS.CLEAR_CART });
      cartLoadedRef.current = false;
    };

    window.addEventListener("cartCleared", handleCartCleared);
    return () => window.removeEventListener("cartCleared", handleCartCleared);
  }, []);

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
