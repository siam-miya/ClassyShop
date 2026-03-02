import React, { useEffect, useState } from 'react'; // useEffect, useState যোগ করা হয়েছে
import { useNavigate } from 'react-router';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';
import { collection, getDocs } from "firebase/firestore"; // Firestore মেথড
import { db } from "../firebase/firebase.config"; // Firebase config

const Products = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // ডাটা রাখার জন্য স্টেট
  const [shoes, setShoes] = useState([]);
  const [loading, setLoading] = useState(true);

  // ফায়ারবেস থেকে ডাটা নিয়ে আসার ফাংশন
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
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    },
  };

  if (loading) return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-black text-center text-slate-900 mb-12 tracking-tight"
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
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
          >
            {shoes.map((shoe) => (
              <motion.div 
                key={shoe.id} 
                variants={cardVariants}
                whileHover={{ y: -10 }} 
                className="group border border-slate-100 p-4 rounded-2xl shadow-sm bg-white hover:shadow-2xl transition-all duration-500 relative overflow-hidden"
              >
                <div 
                  onClick={() => navigate(`/product/${shoe.id}`)} 
                  className="cursor-pointer overflow-hidden rounded-xl bg-gray-50 relative"
                >
                  <img 
                    src={shoe.image || shoe.img} 
                    alt={shoe.name} 
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-300" />
                </div>

                <div className="mt-5 space-y-1">
                  <h2 
                    onClick={() => navigate(`/product/${shoe.id}`)} 
                    className="font-bold text-xl cursor-pointer hover:text-blue-600 transition-colors line-clamp-1"
                  >
                    {shoe.name}
                  </h2>
                  <div className="flex justify-between items-center">
                    <p className="text-blue-600 font-black text-2xl">${shoe.price}</p>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      {shoe.category || "Premium"}
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    onClick={() => addToCart(shoe)}
                    className="w-full cursor-pointer bg-slate-900 text-white py-3 font-bold hover:bg-blue-600 transition-all duration-300 shadow-lg rounded-bl-2xl rounded-tr-2xl flex items-center justify-center gap-2"
                  >
                    Add to Cart
                  </motion.button>
                  
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      addToCart(shoe); 
                      navigate('/checkout'); 
                    }}
                    className="w-full cursor-pointer border-2 border-slate-900 text-slate-900 py-3 font-bold hover:bg-slate-900 hover:text-white transition-all duration-300 rounded-tl-2xl rounded-br-2xl"
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