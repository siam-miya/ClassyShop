import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebase.config";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const CheckOut = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    fullAddress: "",
    location: "inside", 
  });

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const shippingCharge = formData.location === "inside" ? 60 : 150;
  const total = subtotal + shippingCharge;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast.error("আপনার কার্টটি খালি! কিছু পণ্য যোগ করুন।");
      return;
    }

    const orderToast = toast.loading("অর্ডারটি প্রসেস করা হচ্ছে...");
    setIsProcessing(true);

    try {
      await addDoc(collection(db, "orders"), {
        customerName: formData.fullName,
        phoneNumber: formData.phone,
        address: formData.fullAddress,
        deliveryLocation: formData.location === "inside" ? "Inside Dhaka" : "Outside Dhaka",
        shippingCharge: shippingCharge,
        products: cartItems,
        totalAmount: total,
        orderDate: serverTimestamp(),
        status: "pending",
      });

      toast.success("ধন্যবাদ! আপনার অর্ডারটি সফলভাবে সম্পন্ন হয়েছে।", {
        id: orderToast,
        duration: 5000,
      });

      clearCart();
      setTimeout(() => navigate("/"), 2000); // ২ সেকেন্ড পর হোম পেজে নিয়ে যাবে
    } catch (error) {
      console.error("Error submitting order: ", error);
      toast.error("অর্ডার দিতে সমস্যা হয়েছে, আবার চেষ্টা করুন।", {
        id: orderToast,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 min-h-screen bg-gray-50">
      {/* Processing Overlay */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="font-bold text-slate-800">অর্ডার প্রসেসিং হচ্ছে...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <h2 className="text-3xl font-black mb-8 text-slate-900 text-center lg:text-left tracking-tight">
        Checkout
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Shipping Form */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100"
        >
          <h3 className="text-xl font-bold mb-6 text-slate-800">Shipping Information</h3>
          <form onSubmit={handlePlaceOrder} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
              <input required name="fullName" value={formData.fullName} onChange={handleChange} type="text" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium" placeholder="আপনার পুরো নাম লিখুন" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
              <input required name="phone" value={formData.phone} onChange={handleChange} type="tel" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium" placeholder="017XXXXXXXX" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Full Address</label>
              <textarea required name="fullAddress" value={formData.fullAddress} onChange={handleChange} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium h-28" placeholder="বাসা নং, রোড নং, এলাকা এবং জেলা..." />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Delivery Area</label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${formData.location === 'inside' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-100 bg-gray-50 text-gray-500'}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="location" value="inside" checked={formData.location === "inside"} onChange={handleChange} className="w-4 h-4 accent-blue-600" />
                    <span className="font-bold">Inside Dhaka</span>
                  </div>
                  <span className="text-sm font-black">৳60</span>
                </label>

                <label className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${formData.location === 'outside' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-100 bg-gray-50 text-gray-500'}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="location" value="outside" checked={formData.location === "outside"} onChange={handleChange} className="w-4 h-4 accent-blue-600" />
                    <span className="font-bold">Outside Dhaka</span>
                  </div>
                  <span className="text-sm font-black">৳150</span>
                </label>
              </div>
            </div>

            <button 
              disabled={isProcessing}
              type="submit" 
              className={`w-full mt-4 py-5 rounded-[2rem] font-black text-xl transition-all shadow-xl active:scale-95 cursor-pointer flex justify-center items-center gap-2 ${isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-slate-900 text-white shadow-blue-100'}`}
            >
              {isProcessing ? "Processing..." : `Place Order (৳${total.toFixed(0)})`}
            </button>
          </form>
        </motion.div>

        {/* Order Summary */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 h-fit sticky top-10"
        >
          <h3 className="text-xl font-bold mb-6 text-slate-800">Order Summary</h3>
          <div className="max-h-[350px] overflow-y-auto mb-6 pr-2 custom-scrollbar">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between mb-4 bg-gray-50/50 p-3 rounded-2xl border border-gray-50">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image || item.img}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-xl border border-white shadow-sm"
                    />
                    <div>
                      <h4 className="font-black text-slate-800 leading-tight">{item.name}</h4>
                      <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">Qty: <span className="text-blue-600">{item.quantity}</span></p>
                    </div>
                  </div>
                  <p className="font-black text-slate-900">৳{(item.price * item.quantity).toFixed(0)}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 font-medium text-center py-10">No items in cart</p>
            )}
          </div>
          
          <div className="space-y-3 border-t border-dashed pt-6">
            <div className="flex justify-between text-gray-500 font-bold"><span>Product Price</span><span>৳{subtotal.toFixed(0)}</span></div>
            <div className="flex justify-between text-gray-500 font-bold"><span>Delivery Charge</span><span>৳{shippingCharge.toFixed(0)}</span></div>
            <div className="flex justify-between text-2xl font-black text-slate-900 pt-4 border-t border-gray-100">
              <span>Total</span>
              <span className="text-blue-600">৳{total.toFixed(0)}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CheckOut;