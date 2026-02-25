import React from 'react';
import { useCart } from '../context/CartContext';
import { HiOutlineTrash, HiPlus, HiMinus } from 'react-icons/hi';
import { Link } from 'react-router';

const Cart = () => {
 
const { cartItems, removeFromCart, updateQuantity } = useCart(); 
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="container mx-auto px-4 py-10 min-h-screen bg-gray-50">
      <h2 className="text-3xl font-bold mb-8">Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow">
          <p className="text-gray-500 mb-4">Your cart is empty!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex flex-wrap items-center justify-between border p-4 rounded-xl bg-white shadow-sm">
                <div className="flex items-center gap-4">
                  <img src={item.img} alt="" className="w-20 h-20 object-cover rounded-md" />
                  <div>
                    <h3 className="font-bold">{item.name}</h3>
                    <p className="text-blue-600 font-bold">${item.price}</p>
                  </div>
                </div>

                {/* Quantity Control Buttons */}
                <div className="flex items-center gap-3 border rounded-lg px-2 py-1 bg-gray-50">
                  <button 
                    onClick={() => updateQuantity(item.id, 'dec')}
                    className="p-1 hover:text-blue-600 transition"
                  >
                    <HiMinus size={18} />
                  </button>
                  <span className="font-bold w-6 text-center">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, 'inc')}
                    className="p-1 hover:text-blue-600 transition"
                  >
                    <HiPlus size={18} />
                  </button>
                </div>

                <div className="flex items-center gap-6">
                   <p className="font-bold text-gray-800">${(item.price * item.quantity).toFixed(2)}</p>
                   <button onClick={() => removeFromCart(item.id)} className="text-red-500">
                     <HiOutlineTrash size={22} />
                   </button>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Summary */}
          <div className="bg-white p-6 rounded-xl shadow-md h-fit">
            <h3 className="text-xl font-bold mb-4 border-b pb-2">Order Summary</h3>
            <div className="flex justify-between text-lg font-bold mt-4">
              <span>Total:</span>
              <span className="text-blue-600">${totalPrice.toFixed(2)}</span>
            </div>
           <Link to="/checkout" className="block w-full mt-6 bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-blue-600 transition text-center">
             Order Now
           </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;