import React, { createContext, useState, useContext } from 'react';
const CartContext = createContext();
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const addToCart = (product) => {
    const incomingQty = Number(product.quantity) || 1;
    setCartItems((prevItems) => {
      const isExist = prevItems.find(
        (item) => 
          item.id === product.id && 
          item.selectedSize === product.selectedSize && 
          item.selectedColor === product.selectedColor
      );
      if (isExist) {
        return prevItems.map((item) =>
          item.id === product.id && 
          item.selectedSize === product.selectedSize && 
          item.selectedColor === product.selectedColor
            ? { ...item, quantity: item.quantity + incomingQty }
            : item
        );
      }
      return [...prevItems, { 
        ...product, 
        quantity: incomingQty,
        img: product.image || product.img 
      }];
    });
  };

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