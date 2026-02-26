import React, { useState } from "react"; // useState যোগ করা হয়েছে
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebase.config";

const CheckOut = () => {
  const { cartItems } = useCart();
  const navigate = useNavigate();

  // ১. ইনপুট ডেটা ধরার জন্য স্টেট
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    phone: "",
  });

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const shipping = cartItems.length > 0 ? 10 : 0;
  const total = subtotal + shipping;

  // ২. ইনপুট চেঞ্জ হ্যান্ডেলার
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ৩. অর্ডার প্লেস করার মূল ফাংশন
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert("আপনার কার্ট খালি!");
      return;
    }

    try {
      // Firebase-এ ডেটা পাঠানো হচ্ছে
      await addDoc(collection(db, "orders"), {
        customerName: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phoneNumber: formData.phone,
        address: `${formData.address}, ${formData.city}`,
        products: cartItems, 
        totalAmount: total,
        orderDate: serverTimestamp(), 
        status: "pending", 
      });

      alert("Thank you! Your order has been placed successfully.");
      navigate("/");
    } catch (error) {
      console.error("Error submitting order: ", error);
      alert("অর্ডার দিতে সমস্যা হয়েছে, আবার চেষ্টা করুন।");
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 min-h-screen bg-gray-50">
      <h2 className="text-3xl font-bold mb-8 text-slate-900 text-center lg:text-left">
        Checkout
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-semibold mb-6">Shipping Information</h3>
          {/* onSubmit ব্যবহার করা হয়েছে */}
          <form onSubmit={handlePlaceOrder} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  required
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Your First Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  required
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Your Last Name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                required
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="name@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
              <input
                required
                name="address"
                value={formData.address}
                onChange={handleChange}
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="House #12, Road #05..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  required
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Dhaka"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  required
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  type="tel"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="017XXXXXXXX"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-6 bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all transform hover:scale-[1.01] cursor-pointer"
            >
              Place Order (${total.toFixed(2)})
            </button>
          </form>
        </div>

        {/* আপনার অরিজিনাল সামারি পার্ট সম্পূর্ণ এখানে আছে */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-fit">
          <h3 className="text-xl font-semibold mb-6">Order Summary</h3>
          <div className="max-h-[400px] overflow-y-auto mb-6 pr-2">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between mb-4 border-b pb-4 last:border-0"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg border"
                    />
                    <div>
                      <h4 className="font-bold text-slate-800">{item.name}</h4>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold text-slate-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No items in cart</p>
            )}
          </div>

          <div className="space-y-3 border-t pt-6">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-slate-900 pt-3 border-t">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;