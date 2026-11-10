'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Framemaat, Kleur } from '../types/ebike';
import { PRODUCTS } from '../data/ebikes';

interface ShopContextType {
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (
    product: Product,
    selectedFramemaat: Framemaat,
    selectedKleur: Kleur,
    assemblyOption?: '100% Rijklaar thuisbezorgd' | 'In fabrieksdoos (90% gemonteerd)'
  ) => void;
  quickAddToCart: (product: Product) => void;
  updateQuantity: (index: number, quantity: number) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  
  // Compare state
  comparedProducts: Product[];
  toggleCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isCompared: (productId: string) => boolean;

  // Drawer toggles
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initial cart with 1 demo item
  const [cart, setCart] = useState<CartItem[]>(() => {
    return [
      {
        product: PRODUCTS[0],
        quantity: 1,
        selectedFramemaat: '53 cm',
        selectedKleur: 'Blauw',
        assemblyOption: '100% Rijklaar thuisbezorgd'
      }
    ];
  });

  const [comparedProducts, setComparedProducts] = useState<Product[]>([]);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const addToCart = (
    product: Product,
    selectedFramemaat: Framemaat,
    selectedKleur: Kleur,
    assemblyOption: '100% Rijklaar thuisbezorgd' | 'In fabrieksdoos (90% gemonteerd)' = '100% Rijklaar thuisbezorgd'
  ) => {
    setCart((prev) => {
      const existing = prev.find(
        (i) =>
          i.product.id === product.id &&
          i.selectedFramemaat === selectedFramemaat &&
          i.selectedKleur === selectedKleur
      );
      if (existing) {
        return prev.map((item) =>
          item === existing ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          product,
          quantity: 1,
          selectedFramemaat,
          selectedKleur,
          assemblyOption
        }
      ];
    });
    setIsCartDrawerOpen(true);
  };

  const quickAddToCart = (product: Product) => {
    addToCart(
      product,
      product.framematen[0] || '50 cm',
      product.kleuren[0] || 'Zwart',
      '100% Rijklaar thuisbezorgd'
    );
  };

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(index);
    } else {
      setCart((prev) =>
        prev.map((item, i) => (i === index ? { ...item, quantity } : item))
      );
    }
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleCompare = (product: Product) => {
    setComparedProducts((prev) => {
      if (prev.some((p) => p.id === product.id)) {
        return prev.filter((p) => p.id !== product.id);
      }
      if (prev.length >= 4) {
        return [...prev.slice(1), product];
      }
      return [...prev, product];
    });
  };

  const removeFromCompare = (productId: string) => {
    setComparedProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const clearCompare = () => {
    setComparedProducts([]);
  };

  const isCompared = (productId: string) => {
    return comparedProducts.some((p) => p.id === productId);
  };

  return (
    <ShopContext.Provider
      value={{
        cart,
        cartCount,
        cartTotal,
        addToCart,
        quickAddToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        comparedProducts,
        toggleCompare,
        removeFromCompare,
        clearCompare,
        isCompared,
        isCartDrawerOpen,
        setIsCartDrawerOpen
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
