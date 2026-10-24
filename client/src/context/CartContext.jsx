import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('technova_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [coupon, setCoupon] = useState(() => {
    const saved = localStorage.getItem('technova_coupon');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  // Show transient feedback message (e.g. "Added to cart!")
  const notify = (msg) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  // Sync cart from server if user is logged in
  const syncServerCart = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await api.get('/cart');
      if (res.data.success && res.data.items) {
        setItems(res.data.items);
        localStorage.setItem('technova_cart', JSON.stringify(res.data.items));
      }
    } catch (err) {
      console.error('Failed to sync cart:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      syncServerCart();
    }
  }, [user, syncServerCart]);

  // Persist items to localStorage
  useEffect(() => {
    localStorage.setItem('technova_cart', JSON.stringify(items));
  }, [items]);

  // Calculate Subtotal & Shipping
  const subtotal = items.reduce((acc, item) => {
    const price = item.product?.price || item.price || 0;
    return acc + price * item.quantity;
  }, 0);

  // Free shipping above ₹1,999
  const shipping = subtotal > 1999 || subtotal === 0 ? 0 : 99;

  // Coupon discount
  let discount = 0;
  if (coupon && coupon.discountPercent) {
    const rawDiscount = Math.round((subtotal * coupon.discountPercent) / 100);
    discount = Math.min(rawDiscount, coupon.maxDiscount || rawDiscount);
  }

  const total = Math.max(0, subtotal + shipping - discount);
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  const addToCart = async (product, quantity = 1) => {
    if (product.stock <= 0) {
      notify('This item is currently out of stock.');
      return false;
    }

    if (user) {
      try {
        const res = await api.post('/cart', {
          productId: product._id,
          quantity,
        });
        if (res.data.success) {
          setItems(res.data.items);
          notify(`Added "${product.name}" to your cart`);
          return true;
        }
      } catch (err) {
        notify(err.response?.data?.message || 'Could not add item to cart');
        return false;
      }
    }

    // Guest Cart
    const currentItems = [...items];
    const existingIndex = currentItems.findIndex(
      (item) => (item.product?._id || item.product) === product._id
    );

    if (existingIndex > -1) {
      const newQty = currentItems[existingIndex].quantity + quantity;
      if (newQty > product.stock) {
        notify(`Only ${product.stock} units available in stock`);
        return false;
      }
      currentItems[existingIndex].quantity = newQty;
    } else {
      currentItems.push({
        _id: 'guest_' + Date.now().toString(16),
        product,
        quantity: Math.min(quantity, product.stock),
        price: product.price,
      });
    }

    setItems(currentItems);
    notify(`Added "${product.name}" to your cart`);
    return true;
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      return removeFromCart(productId);
    }

    if (user) {
      try {
        const res = await api.put(`/cart/${productId}`, { quantity });
        if (res.data.success) {
          setItems(res.data.items);
          return true;
        }
      } catch (err) {
        notify(err.response?.data?.message || 'Failed to update quantity');
        return false;
      }
    }

    // Guest Cart
    setItems((prev) =>
      prev.map((item) => {
        if ((item.product?._id || item.product) === productId) {
          const maxStock = item.product?.stock || 999;
          return { ...item, quantity: Math.min(quantity, maxStock) };
        }
        return item;
      })
    );
  };

  const removeFromCart = async (productId) => {
    if (user) {
      try {
        const res = await api.delete(`/cart/${productId}`);
        if (res.data.success) {
          setItems(res.data.items);
          notify('Item removed from cart');
          return true;
        }
      } catch (err) {
        console.error(err);
      }
    }

    setItems((prev) =>
      prev.filter((item) => (item.product?._id || item.product) !== productId)
    );
    notify('Item removed from cart');
  };

  const clearCart = async () => {
    if (user) {
      try {
        await api.delete('/cart');
      } catch (err) {
        console.error(err);
      }
    }
    setItems([]);
    setCoupon(null);
    localStorage.removeItem('technova_cart');
    localStorage.removeItem('technova_coupon');
  };

  const applyCoupon = async (code) => {
    try {
      const res = await api.post('/coupons/validate', {
        code,
        orderAmount: subtotal,
      });
      if (res.data.success && res.data.valid) {
        setCoupon(res.data);
        localStorage.setItem('technova_coupon', JSON.stringify(res.data));
        notify(`Coupon ${res.data.code} applied: Save ₹${res.data.discountAmount}!`);
        return { success: true, message: res.data.message };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid or expired coupon code';
      return { success: false, message: msg };
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    localStorage.removeItem('technova_coupon');
    notify('Coupon removed');
  };

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        subtotal,
        shipping,
        discount,
        total,
        coupon,
        loading,
        feedbackMessage,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
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
