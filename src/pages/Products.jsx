import { useNavigate } from 'react-router';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion'; // Framer Motion ইমপোর্ট করুন

import img_1 from "../assets/p-1.jpg";
import img_2 from "../assets/p-2.jpg";
import img_3 from "../assets/p-3.jpg";
import img_4 from "../assets/p-4.jpg";
import img_5 from "../assets/p-5.jpg";
import img_6 from "../assets/p-6.jpg";
import img_7 from "../assets/p-7.jpg";
import img_8 from "../assets/p-8.jpg";
import img_9 from "../assets/p-9.jpg";
import img_10 from "../assets/p-10.jpg";
import img_11 from "../assets/p-11.jpg";

const Products = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const shoes = [
    { id: 1, name: "Nike Speed", price: 120, img: img_1 },
    { id: 2, name: "Adidas Neo", price: 85, img: img_2 },
    { id: 3, name: "Puma Sport", price: 110, img: img_3 },
    { id: 4, name: "Jordan Retro", price: 180, img: img_4 },
    { id: 5, name: "Reebok Classic", price: 75, img: img_5 },
    { id: 6, name: "New Balance 574", price: 95, img: img_6 },
    { id: 7, name: "Vans Old Skool", price: 60, img: img_7 },
    { id: 8, name: "Converse Chuck", price: 55, img: img_8 },
    { id: 9, name: "Under Armour", price: 130, img: img_9 },
    { id: 10, name: "Asics Gel", price: 140, img: img_10 },
    { id: 11, name: "Skechers Walk", price: 70, img: img_11 },
  ];
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
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
                  src={shoe.img} 
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
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Premium</span>
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
      </div>
    </div>
  );
};

export default Products;