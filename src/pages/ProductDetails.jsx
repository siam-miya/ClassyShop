import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useCart } from '../context/CartContext';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase.config";
import { motion } from 'framer-motion';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const rawData = docSnap.data();
          const data = { 
            id: docSnap.id, 
            ...rawData,
            stock: Number(rawData.stock) || 0,
            price: Number(rawData.price) || 0
          };
          
          setProduct(data);
          if(data?.sizes?.length > 0) setSelectedSize(data.sizes[0]);
          if(data?.colors?.length > 0) setSelectedColor(data.colors[0]);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const incrementQty = () => {
    setQuantity((prev) => (prev < product.stock ? prev + 1 : prev));
  };

  const decrementQty = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) return alert("Out of stock!");
    
    const productToAdd = {
      ...product,
      quantity: quantity, 
      selectedSize,
      selectedColor
    };
    
    addToCart(productToAdd);
    return true; // Success indicate korar jonno
  };

  // --- Order Now Function ---
  const handleOrderNow = () => {
    const success = handleAddToCart();
    if (success) {
      navigate('/checkout'); // Cart-e add hoye sorasori checkout page-e niye jabe
    }
  };

  if (loading) return <div className="min-h-screen flex justify-center items-center font-bold text-blue-600">Loading details...</div>;
  if (!product) return <div className="text-center py-20 text-red-500 font-bold">Product not found!</div>;

  return (
    <div className='bg-slate-50 min-h-screen'>
      <div className="container mx-auto px-6 py-16 lg:py-24">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          
          <div className="w-full lg:w-1/2  top-24">
            <motion.img 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              src={product.image || product.img} 
              alt={product.name} 
              className="w-full rounded-[40px] shadow-2xl object-cover aspect-square" 
            />
          </div>

          <div className="w-full lg:w-1/2 space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-4">{product.name}</h1>
              <div className="flex items-center gap-4">
                <span className="text-3xl font-black text-blue-600">৳{product.price}</span>
                <span className={`px-4 py-1 rounded-full text-sm font-bold ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-slate-800">Quantity:</h3>
              <div className="flex items-center gap-6 bg-white w-fit p-2 rounded-2xl shadow-sm border border-gray-100">
                <button 
                  type="button"
                  onClick={decrementQty}
                  className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-xl font-bold hover:bg-blue-600 hover:text-white transition-all active:scale-90"
                > - </button>
                <span className="text-xl font-black w-8 text-center select-none">{quantity}</span>
                <button 
                  type="button"
                  onClick={incrementQty}
                  className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-xl font-bold hover:bg-blue-600 hover:text-white transition-all active:scale-90"
                > + </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                disabled={product.stock <= 0}
                onClick={() => {
                   handleAddToCart();
                   alert("Added to cart!");
                }}
                className="flex-1 border-2 border-slate-900 text-slate-900 py-5 rounded-3xl font-bold hover:bg-slate-900 hover:text-white transition-all disabled:border-gray-300 disabled:text-gray-400"
              >
                Add to Cart
              </button>
              <button 
                disabled={product.stock <= 0}
                onClick={handleOrderNow}
                className="flex-1 bg-blue-600 text-white py-5 rounded-3xl font-bold hover:bg-slate-900 transition-all shadow-xl shadow-blue-100 disabled:bg-gray-300"
              >
                Order Now
              </button>
            </div>
            
            <p className="text-slate-500 text-sm italic font-medium">
              * Fast delivery available all over Bangladesh.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;