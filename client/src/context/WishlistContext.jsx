import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('technova_wishlist');
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);

  const syncServerWishlist = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await api.get('/wishlist');
      if (res.data.success) {
        setWishlist(res.data.wishlist || []);
        localStorage.setItem('technova_wishlist', JSON.stringify(res.data.wishlist || []));
      }
    } catch (err) {
      console.error('Failed to sync wishlist:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      syncServerWishlist();
    }
  }, [user, syncServerWishlist]);

  useEffect(() => {
    localStorage.setItem('technova_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const isInWishlist = (productId) => {
    return wishlist.some((p) => (p._id || p).toString() === productId?.toString());
  };

  const toggleWishlist = async (product) => {
    const productId = product._id || product;

    if (user) {
      try {
        const res = await api.post('/wishlist/toggle', { productId });
        if (res.data.success) {
          setWishlist(res.data.wishlist);
          return res.data.isWishlisted;
        }
      } catch (err) {
        console.error(err);
      }
    }

    // Guest fallback
    let updated;
    const exists = wishlist.some((p) => (p._id || p).toString() === productId.toString());
    if (exists) {
      updated = wishlist.filter((p) => (p._id || p).toString() !== productId.toString());
    } else {
      updated = [...wishlist, product];
    }
    setWishlist(updated);
    return !exists;
  };

  const moveWishlistToCart = async (product) => {
    await toggleWishlist(product);
    await addToCart(product, 1);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        isInWishlist,
        toggleWishlist,
        moveWishlistToCart,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
