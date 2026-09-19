"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type ShopProduct = {
  id: string;
  name: string;
  price: number;
  image: string;
};

export type CartItem = ShopProduct & { quantity: number };

export type Order = {
  id: string;
  createdAt: string;
  status: string;
  total: number;
  items: CartItem[];
  customer: {
    name: string;
    phone: string;
    email: string;
    comment: string;
    delivery: string;
    pickupPoint: string;
  };
};

type ShopContextValue = {
  cart: CartItem[];
  favorites: ShopProduct[];
  orders: Order[];
  cartCount: number;
  cartTotal: number;
  addToCart: (product: ShopProduct, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  toggleFavorite: (product: ShopProduct) => void;
  isFavorite: (id: string) => boolean;
  createOrder: (customer: Order["customer"]) => Order;
};

const ShopContext = createContext<ShopContextValue | null>(null);

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) as T : fallback;
  } catch {
    return fallback;
  }
}

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<ShopProduct[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setCart(readStorage("mary-jute-cart", []));
      setFavorites(readStorage("mary-jute-favorites", []));
      setOrders(readStorage("mary-jute-orders", []));
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (ready) window.localStorage.setItem("mary-jute-cart", JSON.stringify(cart));
  }, [cart, ready]);
  useEffect(() => {
    if (ready) window.localStorage.setItem("mary-jute-favorites", JSON.stringify(favorites));
  }, [favorites, ready]);
  useEffect(() => {
    if (ready) window.localStorage.setItem("mary-jute-orders", JSON.stringify(orders));
  }, [orders, ready]);

  const value = useMemo<ShopContextValue>(() => ({
    cart,
    favorites,
    orders,
    cartCount: cart.reduce((sum, item) => sum + item.quantity, 0),
    cartTotal: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    addToCart(product, quantity = 1) {
      setCart(current => {
        const existing = current.find(item => item.id === product.id);
        return existing
          ? current.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item)
          : [...current, { ...product, quantity }];
      });
    },
    removeFromCart(id) {
      setCart(current => current.filter(item => item.id !== id));
    },
    updateQuantity(id, quantity) {
      setCart(current => current.map(item => item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item));
    },
    toggleFavorite(product) {
      setFavorites(current => current.some(item => item.id === product.id)
        ? current.filter(item => item.id !== product.id)
        : [...current, product]);
    },
    isFavorite(id) {
      return favorites.some(item => item.id === id);
    },
    createOrder(customer) {
      const order: Order = {
        id: `MJ-${Date.now().toString().slice(-8)}`,
        createdAt: new Date().toISOString(),
        status: "Заказ оформлен",
        total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        items: cart,
        customer,
      };
      setOrders(current => [order, ...current]);
      setCart([]);
      return order;
    },
  }), [cart, favorites, orders]);

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) throw new Error("useShop must be used inside ShopProvider");
  return context;
}
