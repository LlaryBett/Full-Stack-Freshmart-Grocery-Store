import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const CartContext = createContext();

const CartProvider = ({ children }) => {
  let user = null;
  try {
    const auth = useAuth();
    user = auth?.user || null;
  } catch {
    user = null;
  }

  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const backendUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_CLIENT_URL;

  // Always fetch cart from backend on mount and when user changes
  const fetchCart = async () => {
    if (!user) return;
    try {
      const res = await fetch(`${backendUrl}/api/cart/${user._id || user.id}`);
      const data = await res.json();
      if (Array.isArray(data.items)) {
        // Ensure each item has product, price, name, image, etc. for rendering
        setCartItems(
          data.items.map(item => ({
            ...item,
            price: item.product?.price ?? item.price ?? 0,
            name: item.product?.name ?? item.name ?? '',
            image: item.product?.image ?? item.image ?? '',
            stock: item.product?.stock ?? item.stock ?? 99,
            unit: item.product?.unit ?? item.unit ?? '',
            category: item.product?.category ?? item.category ?? '',
            product: item.product // keep original product ref for safety
          }))
        );
      } else {
        setCartItems([]);
      }
    } catch {
      setCartItems([]);
    }
  };

  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line
  }, [user]);

  const addToCart = async (product, quantity = 1) => {
    if (!user) {
      toast.error('Please log in to add items to your cart.');
      return;
    }
    try {
      await fetch(`${backendUrl}/api/cart/${user._id || user.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product._id || product.id,
          quantity
        })
      });
      fetchCart();
    } catch {
      toast.error('Could not sync cart with server.');
    }
  };

  const removeFromCart = async (productId) => {
    if (!user) return;
    try {
      await fetch(`${backendUrl}/api/cart/${user._id || user.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      });
      fetchCart();
    } catch {
      toast.error('Could not sync cart with server.');
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (!user) return;
    // Defensive: get the correct productId from the cart item if undefined
    if (!productId) {
      toast.error('Invalid product ID for cart update.');
      return;
    }
    try {
      await fetch(`${backendUrl}/api/cart/${user._id || user.id}/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity })
      });
      fetchCart();
    } catch {
      toast.error('Could not sync cart with server.');
    }
  };

  const clearCart = async () => {
    if (!user) return;
    try {
      await fetch(`${backendUrl}/api/cart/${user._id || user.id}/clear`, {
        method: 'DELETE'
      });
      fetchCart();
    } catch {
      toast.error('Could not sync cart with server.');
    }
  };

  useEffect(() => {
    const total = cartItems.reduce(
      (sum, item) => sum + ((item.price || (item.product?.price ?? 0)) * item.quantity),
      0
    );
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