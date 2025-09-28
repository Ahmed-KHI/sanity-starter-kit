import React, { createContext, useContext, useReducer, ReactNode } from "react";

interface CartLine {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  lines: CartLine[];
}

const CartContext = createContext<{
  state: CartState;
  addItem: (line: Omit<CartLine, "quantity"> & { quantity?: number }) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  subtotal: number;
}>({
  state: { lines: [] },
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clear: () => {},
  subtotal: 0,
});

function reducer(state: CartState, action: any): CartState {
  switch (action.type) {
    case "ADD": {
      const existing = state.lines.find(
        (l) => l.productId === action.payload.productId
      );
      if (existing) {
        return {
          lines: state.lines.map((l) =>
            l.productId === existing.productId
              ? { ...l, quantity: l.quantity + (action.payload.quantity || 1) }
              : l
          ),
        };
      }
      return {
        lines: [
          ...state.lines,
          { ...action.payload, quantity: action.payload.quantity || 1 },
        ],
      };
    }
    case "REMOVE":
      return {
        lines: state.lines.filter((l) => l.productId !== action.payload),
      };
    case "UPDATE_QTY":
      return {
        lines: state.lines.map((l) =>
          l.productId === action.payload.productId
            ? { ...l, quantity: action.payload.quantity }
            : l
        ),
      };
    case "CLEAR":
      return { lines: [] };
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { lines: [] });
  const subtotal = state.lines.reduce(
    (sum, l) => sum + l.price * l.quantity,
    0
  );
  return (
    <CartContext.Provider
      value={{
        state,
        addItem: (line) => dispatch({ type: "ADD", payload: line }),
        removeItem: (productId) =>
          dispatch({ type: "REMOVE", payload: productId }),
        updateQuantity: (productId, quantity) =>
          dispatch({ type: "UPDATE_QTY", payload: { productId, quantity } }),
        clear: () => dispatch({ type: "CLEAR" }),
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
