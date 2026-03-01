import React, { useEffect, useState } from 'react'; // useEffect, useState যোগ করা হয়েছে
import { useParams, useNavigate } from 'react-router';
import { useCart } from '../context/CartContext';
import { doc, getDoc } from "firebase/firestore"; // Firebase Firestore এর মেথড
import { db } from "../firebase/firebase.config"; // Firebase config

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  // প্রোডাক্ট ডাটা রাখার জন্য স্টেট
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // ফায়ারবেসের 'products' কালেকশন থেকে ঐ ID-র ডাটা আনা
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log("No such product!");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div className="text-center py-20 font-bold">Loading product...</div>;
  if (!product) return <div className="text-center py-20 font-bold text-red-500">Product not found!</div>;

  return (
    <div className='bg-blue-50 min-h-screen'> {/* কালার একটু হালকা (blue-50) করা হয়েছে টেক্সট পড়ার সুবিধার্থে */}
      <div className="container mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          {/* Image Section */}
          <div className="w-full md:w-1/2">
            {/* ফায়ারবেস থেকে আসা ইমেজ সোর্স */}
            <img 
              src={product.image || product.img} 
              alt={product.name} 
              className="w-full rounded-3xl shadow-2xl object-cover h-[400px] md:h-[500px]" 
            />
          </div>

          {/* Content Section */}
          <div className="w-full md:w-1/2">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-4">{product.name}</h1>
            <p className="text-xs font-bold text-blue-600 bg-blue-100 inline-block px-3 py-1 rounded-full mb-4 uppercase tracking-widest">
              {product.category || "General"}
            </p>
            <p className="text-3xl text-slate-900 font-black mb-6">${product.price}</p>
            <p className="text-gray-600 mb-8 leading-relaxed text-lg">
              {product.description || "No description available for this product."}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => addToCart(product)}
                className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-lg active:scale-95"
              >
                Add to Cart
              </button>
              <button 
                onClick={() => { addToCart(product); navigate('/checkout'); }}
                className="flex-1 border-2 border-slate-900 py-4 rounded-2xl font-bold hover:bg-slate-900 hover:text-white transition-all active:scale-95"
              >
                Order Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;