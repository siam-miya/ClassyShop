import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase.config";

const Products = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [shoes, setShoes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setShoes(productsData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products: ", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    },
  };

  if (loading) return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="bg-gray-50 py-10 md:py-16">
      <div className="container mx-auto px-3 sm:px-6">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-black text-center text-slate-900 mb-8 md:mb-12 tracking-tight"
        >
          Explore Our <span className="text-blue-600">Collection</span>
        </motion.h1>

        {shoes.length === 0 ? (
          <div className="text-center text-gray-500 py-10 font-bold">No Products Available!</div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            // মোবাইল ডিভাইসের জন্য grid-cols-2 এবং গ্যাপ কমানো হয়েছে
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-8"
          >
            {shoes.map((shoe) => (
              <motion.div 
                key={shoe.id} 
                variants={cardVariants}
                whileHover={{ y: -5 }} 
                className="group border border-slate-100 p-2 md:p-4 rounded-xl md:rounded-2xl shadow-sm bg-white hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div 
                    onClick={() => navigate(`/product/${shoe.id}`)} 
                    className="cursor-pointer overflow-hidden rounded-lg md:rounded-xl bg-gray-50 relative aspect-square"
                  >
                    <img 
                      src={shoe.image || shoe.img} 
                      alt={shoe.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-300" />
                  </div>

                  <div className="mt-3 md:mt-5 space-y-1">
                    <h2 
                      onClick={() => navigate(`/product/${shoe.id}`)} 
                      className="font-bold text-sm md:text-xl cursor-pointer hover:text-blue-600 transition-colors line-clamp-1"
                    >
                      {shoe.name}
                    </h2>
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                      <p className="text-blue-600 font-black text-base md:text-2xl">৳{shoe.price}</p>
                      <span className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest truncate">
                        {shoe.category || "Premium"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-2">
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    onClick={() => addToCart(shoe)}
                    className="w-full cursor-pointer bg-slate-900 text-white py-2 md:py-3 text-xs md:text-sm font-bold hover:bg-blue-600 transition-all duration-300 rounded-lg md:rounded-bl-2xl md:rounded-tr-2xl flex items-center justify-center gap-1 md:gap-2"
                  >
                    Add to Cart
                  </motion.button>
                  
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      addToCart(shoe); 
                      navigate('/checkout'); 
                    }}
                    className="w-full cursor-pointer border border-slate-900 text-slate-900 py-2 md:py-3 text-xs md:text-sm font-bold hover:bg-slate-900 hover:text-white transition-all duration-300 rounded-lg md:rounded-tl-2xl md:rounded-br-2xl"
                  >
                    Order Now
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Products;