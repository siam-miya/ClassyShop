
import { Link } from 'react-router';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from 'react-icons/hi';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-gray-300 pt-16 pb-8">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Company Info */}
          <div className="space-y-6">
            <Link to="/" className="text-2xl font-bold text-blue-400 tracking-tight">
              Classy<span className="text-white">Shop</span>
            </Link>
            <p className="text-gray-400 leading-relaxed">
              Premium footwear designed for comfort and style. We bring you the latest trends from top global brands.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-all">
                <FaFacebookF />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-all">
                <FaTwitter />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-all">
                <FaInstagram />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-all">
                <FaLinkedinIn />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link to="/" className="hover:text-blue-400 transition">Home</Link></li>
              <li><Link to="/products" className="hover:text-blue-400 transition">Our Products</Link></li>
              <li><Link to="/cart" className="hover:text-blue-400 transition">Your Cart</Link></li>
              <li><Link to="/contact" className="hover:text-blue-400 transition">Contact Us</Link></li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h4 className="text-white text-lg font-bold mb-6">Support</h4>
            <ul className="space-y-4">
              <li><a href="#" className="hover:text-blue-400 transition">Shipping Policy</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Returns & Refunds</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">FAQs</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white text-lg font-bold mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <HiOutlineLocationMarker size={22} className="text-blue-400 flex-shrink-0" />
                <span>House-32, Road-6, Mirpur-1, Dhaka-1216, Bangladesh</span>
              </li>
              <li className="flex items-center gap-3">
                <HiOutlinePhone size={22} className="text-blue-400 flex-shrink-0" />
                <span>01925909902</span>
              </li>
              <li className="flex items-center gap-3">
                <HiOutlineMail size={22} className="text-blue-400 flex-shrink-0" />
                <span>support@classyshop.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 pt-8 mt-8 text-center text-sm text-gray-500">
          <div>© {new Date().getFullYear()} ClassyShop. All rights reserved.
              <h6>Crated by</h6>
             <a target="_blank" rel="noopener noreferrer" className='text-white' href="https://www.facebook.com/profile.php?id=61578355676474">Website Creator</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
