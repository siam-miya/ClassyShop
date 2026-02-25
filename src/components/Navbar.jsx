import { useState } from 'react';
import { Link } from 'react-router'; 
import { HiOutlineShoppingCart, HiOutlineMenu, HiX } from 'react-icons/hi'; 
import { useCart } from '../context/CartContext'; 

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { cartItems } = useCart(); 

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20"> 
          
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <img 
                src="main-logo.png" 
                alt="ClassyShop" 
                className="h-12 w-auto object-contain transition-transform group-hover:scale-105 rounded-full" 
              />
              <span className="hidden sm:block text-2xl font-black tracking-tighter text-white">
                Classy<span className="text-blue-400">Shop</span>
              </span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className="text-sm font-bold hover:text-blue-400 transition-all duration-200 uppercase tracking-widest"
              >
                {item.name}
              </Link>
            ))}
            <Link to="/cart" className="relative p-2 text-gray-200 hover:text-blue-400 transition-all">
              <HiOutlineShoppingCart size={28} />
              {cartItems.length > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full shadow-lg">
                  {cartItems.length}
                </span>
              )}
            </Link>
          </div>
          <div className="md:hidden flex items-center space-x-4">
            <Link to="/cart" className="relative p-2 text-gray-200">
              <HiOutlineShoppingCart size={26} />
              {cartItems.length > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold bg-red-600 rounded-full">
                  {cartItems.length}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-white focus:outline-none transition-colors"
            >
              {isOpen ? <HiX size={30} /> : <HiOutlineMenu size={30} />}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-slate-800 border-t border-slate-700 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="px-4 pt-4 pb-8 space-y-2 text-center">
            {navLinks.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-4 rounded-xl text-lg font-bold hover:bg-blue-600 transition-all uppercase"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;