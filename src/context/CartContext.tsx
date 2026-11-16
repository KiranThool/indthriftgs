'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { CartItem, Product, Coupon } from '@/types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, size?: string) => boolean;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, delta: number) => boolean;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  totalAmount: number;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  isCartDrawerOpen: boolean;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  toggleCartDrawer: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const AVAILABLE_COUPONS: Coupon[] = [
  {
    code: 'FIRSTDROP',
    discount_percentage: 15,
    min_order_value: 1500,
    description: '15% off on your first vintage drop order (Min ₹1,500)',
  },
  {
    code: 'SECONDSTORY10',
    discount_percentage: 10,
    min_order_value: 999,
    description: '10% off on all pre-loved fits (Min ₹999)',
  },
  {
    code: 'VINTAGEVIP',
    discount_percentage: 20,
    min_order_value: 4000,
    description: '20% off on orders above ₹4,000',
  },
];

const CART_STORAGE_KEY = 'second_story_cart_v1';
const COUPON_STORAGE_KEY = 'second_story_coupon_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
      const savedCoupon = localStorage.getItem(COUPON_STORAGE_KEY);
      if (savedCoupon) {
        setAppliedCoupon(JSON.parse(savedCoupon));
      }
    } catch (e) {
      console.error('Failed to parse cart from storage:', e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      } catch (e) {
        console.error('Failed to save cart to storage:', e);
      }
    }
  }, [cart, isInitialized]);

  // Save coupon to localStorage
  useEffect(() => {
    if (isInitialized) {
      if (appliedCoupon) {
        localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem(COUPON_STORAGE_KEY);
      }
    }
  }, [appliedCoupon, isInitialized]);

  const addToCart = (product: Product, size?: string): boolean => {
    const selectedSize = size || product.size;
    const cartItemId = `${product.id}-${selectedSize}`;

    // Find existing item
    const existingIndex = cart.findIndex((item) => item.id === cartItemId);

    if (existingIndex > -1) {
      const existing = cart[existingIndex];
      // Check inventory limit
      if (existing.quantity >= product.stock_quantity) {
        return false; // Cannot add more than available inventory
      }

      const updated = [...cart];
      updated[existingIndex] = {
        ...existing,
        quantity: existing.quantity + 1,
      };
      setCart(updated);
      setIsCartDrawerOpen(true);
      return true;
    } else {
      if (product.stock_quantity < 1) {
        return false;
      }
      const newItem: CartItem = {
        id: cartItemId,
        product,
        quantity: 1,
        selectedSize,
      };
      setCart((prev) => [...prev, newItem]);
      setIsCartDrawerOpen(true);
      return true;
    }
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, delta: number): boolean => {
    const item = cart.find((i) => i.id === cartItemId);
    if (!item) return false;

    const newQty = item.quantity + delta;
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return true;
    }

    if (newQty > item.product.stock_quantity) {
      return false; // inventory exceeded
    }

    setCart((prev) =>
      prev.map((i) => (i.id === cartItemId ? { ...i, quantity: newQty } : i))
    );
    return true;
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [cart]
  );

  // Free shipping over ₹1,999, else ₹99 flat fee
  const shippingFee = useMemo(() => {
    if (subtotal === 0) return 0;
    return subtotal >= 1999 ? 0 : 99;
  }, [subtotal]);

  const discountAmount = useMemo(() => {
    if (!appliedCoupon || subtotal < appliedCoupon.min_order_value) return 0;
    return Math.round((subtotal * appliedCoupon.discount_percentage) / 100);
  }, [appliedCoupon, subtotal]);

  const totalAmount = useMemo(() => {
    return Math.max(0, subtotal - discountAmount + shippingFee);
  }, [subtotal, discountAmount, shippingFee]);

  const applyCoupon = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    const found = AVAILABLE_COUPONS.find((c) => c.code === trimmed);

    if (!found) {
      return { success: false, message: 'Invalid promo code. Try "FIRSTDROP" or "SECONDSTORY10"' };
    }

    if (subtotal < found.min_order_value) {
      return {
        success: false,
        message: `Code requires minimum order value of ₹${found.min_order_value}`,
      };
    }

    setAppliedCoupon(found);
    return {
      success: true,
      message: `Promo code ${found.code} applied! Saved ${found.discount_percentage}%`,
    };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        shippingFee,
        discountAmount,
        totalAmount,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        isCartDrawerOpen,
        openCartDrawer: () => setIsCartDrawerOpen(true),
        closeCartDrawer: () => setIsCartDrawerOpen(false),
        toggleCartDrawer: () => setIsCartDrawerOpen((prev) => !prev),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
