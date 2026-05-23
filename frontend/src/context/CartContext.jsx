import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalPrice: 0 });
  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState(null); // null or { code: 'CYBER20', discount: 0.2 }
  const [shippingPriority, setShippingPriority] = useState('standard'); // 'standard' | 'express'
  const { user } = useAuth();

  const fetchCart = async () => {
    if (!user) {
      setCart({ items: [], totalPrice: 0 });
      return;
    }
    setLoading(true);
    try {
      const res = await cartAPI.get();
      setCart(res.data || { items: [], totalPrice: 0 });
    } catch (err) {
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
    setCoupon(null);
    setShippingPriority('standard');
  }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    if (!user) return { success: false, error: 'Please login to add items to cart.' };
    setLoading(true);
    try {
      const res = await cartAPI.addItem(productId, quantity);
      setCart(res.data);
      return { success: true };
    } catch (err) {
      console.error('Error adding to cart:', err);
      return { success: false, error: err.response?.data?.message || 'Failed to add item.' };
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (!user) return;
    if (quantity <= 0) {
      return removeFromCart(itemId);
    }
    setLoading(true);
    try {
      const res = await cartAPI.updateItem(itemId, quantity);
      setCart(res.data);
    } catch (err) {
      console.error('Error updating cart quantity:', err);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await cartAPI.removeItem(itemId);
      setCart(res.data);
    } catch (err) {
      console.error('Error removing item from cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await cartAPI.clear();
      setCart({ items: [], totalPrice: 0 });
      setCoupon(null);
      setShippingPriority('standard');
    } catch (err) {
      console.error('Error clearing cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyCoupon = (code) => {
    const uppercaseCode = code.toUpperCase().trim();
    const coupons = {
      'CYBER20': 0.20,
      'WELCOME10': 0.10,
      'HARDWARE5': 0.05,
    };
    if (coupons[uppercaseCode] !== undefined) {
      setCoupon({ code: uppercaseCode, discount: coupons[uppercaseCode] });
      return { success: true, discount: coupons[uppercaseCode] };
    }
    return { success: false, error: 'Invalid coupon code.' };
  };

  const removeCoupon = () => {
    setCoupon(null);
  };

  const getCartCount = () => {
    if (!cart.items) return 0;
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        coupon,
        shippingPriority,
        setShippingPriority,
        applyCoupon,
        removeCoupon,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getCartCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
