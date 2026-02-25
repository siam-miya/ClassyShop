
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { HiOutlineArrowLeft, HiOutlineEmojiSad } from 'react-icons/hi';

const ErrorPage = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="text-center max-w-2xl">
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: [-20, 0, -20] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative inline-block"
        >
          <h1 className="text-[120px] md:text-[200px] font-black text-slate-100 leading-none select-none">
            404
          </h1>
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600"
          >
            <HiOutlineEmojiSad size={80} className="md:size-32" />
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-gray-500 text-lg mb-10 max-w-md mx-auto">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 cursor-pointer bg-slate-900 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-600 transition-all shadow-xl shadow-blue-100"
            >
              <HiOutlineArrowLeft /> Back to Home
            </Link>
          </motion.div>
        </motion.div>
        <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-blue-100 rounded-full blur-xl opacity-60 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-16 h-16 bg-blue-50 rounded-full blur-xl opacity-60 animate-pulse delay-700"></div>
      </div>
    </div>
  );
};

export default ErrorPage;
