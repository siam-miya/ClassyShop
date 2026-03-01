import React, { useState } from 'react';
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from 'react-icons/hi';
import { FaPaperPlane } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { db } from "../firebase/firebase.config"; 
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// React Hot Toast ইমপোর্ট করুন
import toast from 'react-hot-toast';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // লোডিং টোস্ট শুরু
    const loadingToast = toast.loading('Sending your message...');
    setIsSending(true);

    try {
      // Firebase-এ ডাটা সেভ করা হচ্ছে
      await addDoc(collection(db, "messages"), {
        ...formData,
        createdAt: serverTimestamp(),
        status: 'unread'
      });

      // সাকসেস মেসেজ (আগের লোডিং টোস্টটি রিপ্লেস করবে)
      toast.success('Thank you! Your message has been sent successfully.', {
        id: loadingToast,
        duration: 4000,
      });

      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error("Error:", error);
      // এরর মেসেজ
      toast.error('Failed to send message. Please try again.', {
        id: loadingToast,
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Framer Motion ভ্যারিয়েন্টগুলো আগের মতোই আছে...
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-16 overflow-hidden">
      <div className="container mx-auto px-6 lg:px-20">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block px-6 py-2 bg-blue-600 text-white font-bold rounded-full mb-6 shadow-lg shadow-blue-200">
            Contact Us
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Get In <span className="text-blue-600">Touch</span></h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
            Have questions about our footwear or an existing order? Our team is here to help you 24/7.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {[
              { icon: <HiOutlineLocationMarker size={24} />, title: "Our Location", text: "123 Shoe Street, Sector 7, Uttara, Dhaka", color: "bg-blue-100 text-blue-600" },
              { icon: <HiOutlinePhone size={24} />, title: "Phone Number", text: "+880 1234 567890", color: "bg-green-100 text-green-600" },
              { icon: <HiOutlineMail size={24} />, title: "Email Address", text: "support@mystore.com", color: "bg-purple-100 text-purple-600" }
            ].map((item, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.03, x: 10 }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-6 transition-shadow hover:shadow-md"
              >
                <div className={`w-12 h-12 ${item.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900">{item.title}</h4>
                  <p className="text-gray-500 mt-1">{item.text}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl shadow-gray-200 border border-gray-50">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Your Name</label>
                    <input 
                      required name="name" value={formData.name} onChange={handleChange} type="text" 
                      className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                      placeholder="Enter your name" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                    <input 
                      required name="email" value={formData.email} onChange={handleChange} type="email" 
                      className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                      placeholder="name@gmail.com" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Subject</label>
                  <input 
                    required name="subject" value={formData.subject} onChange={handleChange} type="text" 
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                    placeholder="How can we help you?" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Message</label>
                  <textarea 
                    required name="message" value={formData.message} onChange={handleChange} rows="4" 
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none" 
                    placeholder="Write your message here..."
                  ></textarea>
                </div>

                <motion.button 
                  disabled={isSending}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit" 
                  className={`w-full py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-xl cursor-pointer ${isSending ? 'bg-gray-400 cursor-not-allowed' : 'bg-slate-900 hover:bg-blue-600 text-white'}`}
                >
                  <FaPaperPlane className="text-sm" /> {isSending ? "Sending..." : "Send Message"}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;