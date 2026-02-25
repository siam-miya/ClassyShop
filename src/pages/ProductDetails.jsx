
import { useParams, useNavigate } from 'react-router';
import { useCart } from '../context/CartContext';
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

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

 const shoes = [
  { 
    id: 1, 
    name: "Nike Speed", 
    price: 120, 
    img: img_1, 
    description: "Engineered for maximum velocity, the Nike Speed features a lightweight breathable mesh and high-performance cushioning for your daily runs." 
  },
  { 
    id: 2, 
    name: "Adidas Neo", 
    price: 85, 
    img: img_2, 
    description: "A perfect blend of classic aesthetics and modern comfort. These sneakers are designed for versatile everyday wear with a soft footbed." 
  },
  { 
    id: 3, 
    name: "Puma Sport", 
    price: 110, 
    img: img_3, 
    description: "Take your workout to the next level. Puma Sport offers superior grip and stability, ensuring peak performance during intense training sessions." 
  },
  { 
    id: 4, 
    name: "Jordan Retro", 
    price: 180, 
    img: img_4, 
    description: "An iconic silhouette that never goes out of style. Crafted with premium leather, the Jordan Retro delivers a legendary look and feel." 
  },
  { 
    id: 5, 
    name: "Reebok Classic", 
    price: 75, 
    img: img_5, 
    description: "Timeless design meets unmatched comfort. The Reebok Classic features a supportive upper and a durable outsole for all-day reliability." 
  },
  { 
    id: 6, 
    name: "New Balance 574", 
    price: 95, 
    img: img_6, 
    description: "The most iconic New Balance shoe. Known for its durability and comfort, the 574 is a hybrid road/trail design that fits any lifestyle." 
  },
  { 
    id: 7, 
    name: "Vans Old Skool", 
    price: 60, 
    img: img_7, 
    description: "The classic skate shoe that first bared the iconic sidestripe. Built with durable suede and canvas uppers for long-lasting wear." 
  },
  { 
    id: 8, 
    name: "Converse Chuck", 
    price: 55, 
    img: img_8, 
    description: "A staple in street fashion. These high-top sneakers feature a canvas upper and the unmistakable All-Star ankle patch." 
  },
  { 
    id: 9, 
    name: "Under Armour", 
    price: 130, 
    img: img_9, 
    description: "Designed for athletes who need a balance of flexibility and cushioning. The lightweight material ensures your feet stay cool and fast." 
  },
  { 
    id: 10, 
    name: "Asics Gel", 
    price: 140, 
    img: img_10, 
    description: "Featuring advanced GEL technology, these shoes provide excellent shock absorption and comfort for long-distance running." 
  },
  { 
    id: 11, 
    name: "Skechers Walk", 
    price: 70, 
    img: img_11, 
    description: "Walk with confidence and comfort. Skechers Walk features a highly responsive midsole and a soft knit upper for a sock-like fit." 
  },
];

  const product = shoes.find((s) => s.id === parseInt(id));

  if (!product) return <div className="text-center py-20">Product not found!</div>;

  return (
  <div className='bg-blue-300'>
      <div className="container mx-auto px-6 py-16 ">
      <div className="flex flex-col md:flex-row gap-12 items-center">
        {/* Image Section */}
        <div className="w-full md:w-1/2">
          <img src={product.img} alt={product.name} className="w-full rounded-2xl shadow-xl object-cover " />
        </div>
        {/* Content Section */}
        <div className="w-full md:w-1/2">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">{product.name}</h1>
          <p className="text-2xl text-blue-600 font-bold mb-6">${product.price}</p>
          <p className="text-gray-600 mb-8 leading-relaxed">
            {product.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => addToCart(product)}
              className="flex-1 bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-blue-600 transition cursor-pointer"
            >
              Add to Cart
            </button>
            <button 
              onClick={() => { addToCart(product); navigate('/checkout'); }}
              className="flex-1 border-2 border-slate-900 py-4 rounded-xl font-bold hover:bg-slate-900 hover:text-white transition cursor-pointer"
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