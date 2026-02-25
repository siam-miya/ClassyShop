import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
const CountUp = ({ target, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);

  return <span>{count.toLocaleString()}</span>;
};
const Banner = () => {
  const stats = [
    { label: 'Brands', value: 50, suffix: '+' },
    { label: 'Customers', value: 10000, suffix: '+' },
    { label: 'Original', value: 100, suffix: '%' },
    { label: 'Shipping', value: 'Free', isText: true },
  ];
  return (
    <section className="relative bg-white py-16 lg:py-24 overflow-hidden border-b border-gray-100">
      <div className="container mx-auto px-6 lg:px-12 flex flex-col-reverse lg:flex-row items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="w-full lg:w-1/2 mt-10 lg:mt-0 text-center lg:text-left"
        >
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-1 rounded-full bg-blue-50 text-blue-600 font-bold tracking-widest uppercase text-xs mb-4"
          >
            New Arrival 2026
          </motion.span>
          
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-tight mb-6">
            Step Up Your <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
              Style & Comfort
            </span>
          </h1>
          
          <p className="text-gray-500 text-lg mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
         Premium quality footwear at your fingertips. Discover our latest collection today for stylish designs and ultimate comfort.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                to="/products" 
                className="px-10 py-4 bg-slate-900 text-white font-bold rounded-full hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 block"
              >
                Shop Now
              </Link>
            </motion.div>
          </div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
          whileInView={{ opacity: 1, scale: 1, rotate: -15 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
          className="relative w-full lg:w-1/2 flex justify-center items-center"
        >
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2]
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute w-72 h-72 md:w-[450px] md:h-[450px] bg-blue-400 rounded-full mix-blend-multiply filter blur-[80px]"
          ></motion.div>
          
          <motion.img 
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop" 
            alt="Shoe" 
            className="relative z-10 w-full max-w-md drop-shadow-[0_35px_35px_rgba(0,0,0,0.3)] cursor-pointer"
            whileHover={{ rotate: 0, scale: 1.05 }}
          />
        </motion.div>
      </div>
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        viewport={{ once: true }}
        className="container mx-auto px-6 mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center border-t border-gray-100 pt-12"
      >
        {stats.map((stat, index) => (
          <div key={index} className="group">
            <h3 className="text-3xl md:text-4xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">
              {stat.isText ? (
                <span className="text-blue-600">{stat.label === 'Shipping' ? 'Free' : stat.suffix}</span>
              ) : (
                <>
                  <CountUp target={stat.value} />
                  <span className="text-blue-600">{stat.suffix}</span>
                </>
              )}
            </h3>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mt-2">{stat.label}</p>
          </div>
        ))}
      </motion.div>
    </section>
  );
};

export default Banner;