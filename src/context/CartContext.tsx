"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/types/product';

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  variation?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, variation?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('rudraksha_cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart');
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('rudraksha_cart', JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addToCart = (product: Product, quantity = 1, variation?: string) => {
    setItems(currentItems => {
      const cartItemId = `${product.id}-${variation || 'default'}`;
      const existingItem = currentItems.find(item => item.id === cartItemId);
      
      if (existingItem) {
        return currentItems.map(item => 
          item.id === cartItemId 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...currentItems, { id: cartItemId, product, quantity, variation }];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setItems(currentItems => currentItems.filter(item => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setItems(currentItems =>
      currentItems.map(item =>
        item.id === cartItemId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
