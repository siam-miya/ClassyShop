import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // ১. প্রোডাক্ট অ্যাড করা বা কোয়ান্টিটি বাড়ানো
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const isExist = prevItems.find((item) => item.id === product.id);
      if (isExist) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      // অ্যাড করার সময় image এবং img দুটিই নিশ্চিত করা হচ্ছে
      return [...prevItems, { 
        ...product, 
        quantity: 1, 
        img: product.image || product.img // ইমেজ হ্যান্ডলিং ফিক্স
      }];
    });
  };

  // ২. কোয়ান্টিটি আপডেট করা (+ অথবা -)
  const updateQuantity = (id, type) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          if (type === 'inc') {
            return { ...item, quantity: item.quantity + 1 };
          } else if (type === 'dec' && item.quantity > 1) {
            return { ...item, quantity: item.quantity - 1 };
          }
        }
        return item;
      })
    );
  };
  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };
  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);