"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { CartItem } from "@/lib/types";

const KEY = "apex-cart-v1";

type CartContextValue = {
  items: CartItem[];
  add: (productId: string, quantity?: number) => void;
  addMany: (productIds: string[]) => void;
  setQty: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  count: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    queueMicrotask(() => {
      if (raw) {
        try {
          setItems(JSON.parse(raw));
        } catch {
          setItems([]);
        }
      }
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(KEY, JSON.stringify(items));
  }, [items, ready]);

  const add = useCallback((productId: string, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        return prev.map((item) => (item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item));
      }
      return [...prev, { productId, quantity }];
    });
  }, []);

  const addMany = useCallback((productIds: string[]) => {
    productIds.forEach((id) => add(id, 1));
  }, [add]);

  const setQty = useCallback((productId: string, quantity: number) => {
    setItems((prev) => prev.map((item) => (item.productId === productId ? { ...item, quantity } : item)).filter((item) => item.quantity > 0));
  }, []);

  const remove = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  }, []);

  const clear = useCallback(() => setItems([]), []);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  const value = useMemo(() => ({ items, add, addMany, setQty, remove, clear, count }), [items, add, addMany, setQty, remove, clear, count]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
