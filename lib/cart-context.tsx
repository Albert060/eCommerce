"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";

// ---- Tipos ----

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ProductImage {
  id_imagen: number;
  id_producto: number;
  url: string;
  orden: number;
}

export interface Product {
  id_producto: string;
  nombre: string;
  descripcion: string;
  sku: string;
  id_categoria: string;
  precio_base: string;
  peso: string;
  volumen: string;
  activo: boolean;
  imagenes: ProductImage[];
}

interface CartState {
  items: CartItem[];
}

type CartAction =
    | { type: "ADD_ITEM"; payload: { product: Product; quantity?: number } }
    | { type: "REMOVE_ITEM"; payload: { productId: string } }
    | { type: "UPDATE_QUANTITY"; payload: { productId: string; quantity: number } }
    | { type: "CLEAR_CART" };

// ---- Constantes para localStorage ----

const CART_KEY = "cart";

const initialCartState: CartState = {
  items: [],
};

// Función para inicializar el estado desde localStorage
const initCart = (): CartState => {
  if (typeof window === "undefined") return initialCartState;

  const saved = localStorage.getItem(CART_KEY);
  if (!saved) return initialCartState;

  try {
    return JSON.parse(saved) as CartState;
  } catch {
    return initialCartState;
  }
};

// ---- Contexto ----

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
} | undefined>(undefined);

// ---- Reducer ----

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product, quantity = 1 } = action.payload;
      const existingItemIndex = state.items.findIndex(
          (item) => item.product.id_producto === product.id_producto
      );

      if (existingItemIndex >= 0) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity,
        };
        return { ...state, items: updatedItems };
      } else {
        return {
          ...state,
          items: [...state.items, { product, quantity }],
        };
      }
    }
    case "REMOVE_ITEM": {
      const updatedItems = state.items.filter(
          (item) => item.product.id_producto !== action.payload.productId
      );
      return { ...state, items: updatedItems };
    }
    case "UPDATE_QUANTITY": {
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(
              (item) => item.product.id_producto !== action.payload.productId
          ),
        };
      }

      const updatedItems = state.items.map((item) => {
        if (item.product.id_producto === action.payload.productId) {
          return { ...item, quantity: action.payload.quantity };
        }
        return item;
      });

      return { ...state, items: updatedItems };
    }
    case "CLEAR_CART":
      return { ...state, items: [] };
    default:
      return state;
  }
};

// ---- Provider ----

export function CartProvider({ children }: { children: ReactNode }) {
  // useReducer con initCart para leer de localStorage al inicio
  const [state, dispatch] = useReducer(
      cartReducer,
      initialCartState,
      initCart
  );

  // Sincronizar el estado del carrito con localStorage cada vez que cambie
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(CART_KEY, JSON.stringify(state));
  }, [state]);

  const addToCart = (product: Product, quantity: number = 1) => {
    dispatch({ type: "ADD_ITEM", payload: { product, quantity } });
  };

  const removeFromCart = (productId: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { productId } });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return state.items.reduce((total, item) => {
      const price = parseFloat(item.product.precio_base) || 0;
      return total + price * item.quantity;
    }, 0);
  };

  const value = {
    state,
    dispatch,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// ---- Hook personalizado ----

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
