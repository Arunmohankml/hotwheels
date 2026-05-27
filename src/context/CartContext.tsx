"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
  stock: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  cartTotal: number;
  itemCount: number;
  notification: string | null;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  refreshStock: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [notification, setNotification] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('hw_cart_v2');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('hw_cart_v2', JSON.stringify(cart));
    }
  }, [cart, isInitialized]);

  const refreshStock = async () => {
    if (cart.length === 0) return;
    
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, stock')
        .in('id', cart.map(item => item.id));

      if (error) throw error;

      if (data) {
        setCart(prev => prev.map(item => {
          const fresh = data.find((d: any) => d.id === item.id);
          return fresh ? { ...item, stock: fresh.stock } : item;
        }));
      }
    } catch (e) {
      console.error("Failed to refresh stock", e);
    }
  };

  useEffect(() => {
    if (isCartOpen) {
      refreshStock();
    }
  }, [isCartOpen]);

  const addToCart = (product: any) => {
    // If stock is missing, we'll treat it as available (for older data)
    const availableStock = product.stock !== undefined && product.stock !== null ? product.stock : 999;

    if (availableStock <= 0) {
      setNotification(`Sorry, ${product.name} is out of stock!`);
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.quantity >= availableStock) {
          setNotification(`Maximum stock reached for ${product.name}!`);
          return prev;
        }
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { 
        id: product.id, 
        name: product.name, 
        price: product.price, 
        image_url: product.image_url, 
        quantity: 1, 
        stock: availableStock 
      }];
    });
    setNotification(`${product.name} added to cart!`);
    setIsCartOpen(true);
    setTimeout(() => setNotification(null), 3000);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        if (newQty > item.stock) {
          setNotification(`Only ${item.stock} units available!`);
          return item;
        }
        return { ...item, quantity: Math.max(0, newQty) };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cart, addToCart, removeFromCart, updateQuantity, clearCart, 
      cartTotal, itemCount, notification, isCartOpen, setIsCartOpen, refreshStock
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
