import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

// Only export CartProvider and useCart to comply with Fast Refresh
const CartContext = createContext();

const CartProvider = ({ children }) => {
  // Defensive: handle case where useAuth() returns undefined
  let user = null;
  try {
    // useAuth() may throw if used outside AuthProvider
    const auth = useAuth();
    user = auth?.user || null;
  } catch {
    user = null;
  }

  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);

  const addToCart = async (product, quantity = 1) => {
    if (!user) {
      toast.error('Please log in to add items to your cart.');
      return;
    }
    // Local update for instant feedback
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id || item._id === product._id);
      if (existingItem) {
        return prevItems.map(item =>
          (item.id === product.id || item._id === product._id)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { ...product, quantity }];
    });
    // Sync with backend
    try {
      // eslint-disable-next-line no-undef
      const backendUrl = process.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_CLIENT_URL;
      await fetch(`${backendUrl}/api/cart/${user._id || user.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product._id || product.id,
          quantity
        })
      });
    } catch {
      toast.error('Could not sync cart with server.');
    }
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  useEffect(() => {
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setCartTotal(total);
  }, [cartItems]);

  return (
    <CartContext.Provider value={{
      cartItems,
      cartTotal,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export { CartProvider, useCart };