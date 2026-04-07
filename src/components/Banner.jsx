import React, { useState } from 'react';
import { Link } from 'react-router';
import { ChevronLeft, ChevronRight } from 'lucide-react'; 
import slider_1 from "../assets/slider-1.jpg"
import slider_2 from "../assets/slider_2.jpg"
import slider_3 from "../assets/slider-3.jpg"
const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      image: slider_1,
      title: "Step Up Your Style",
      subtitle: "Upgrade your daily living with our premium gadgets.Experience ultimate comfort and modern sophistication in every step.",
      tag: "New Arrival 2026"
    },
    {
      image: slider_2,
      title: "Walk with Confidence",
      subtitle: "Experience ultimate comfort with our ergonomic designs and materials.",
      tag: "Limited Edition"
    },
    {
      image: slider_3,
      title: "Super Fan",
      subtitle: "Bold designs for the modern generation. Grab your pair today.",
      tag: "Street Style"
    }
    
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <section className="relative h-[600px] md:h-[700px] w-full overflow-hidden bg-gray-100 group">
      
      {/* --- Slider Container (Moving Track) --- */}
      <div 
        className="flex h-full transition-transform duration-700 ease-in-out" 
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className="min-w-full h-full relative flex items-center"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.95), rgba(255,255,255,0.1)), url(${slide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {/* Content per Slide */}
            <div className="container mx-auto px-6 lg:px-12 relative z-10">
              <div className="max-w-2xl">
                <span className="inline-block px-4 py-1 rounded-full bg-blue-600 text-white font-bold tracking-widest uppercase text-xs mb-4">
                  {slide.tag}
                </span>
                
                <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-tight mb-6">
                  {slide.title.split(" ").slice(0, -2).join(" ")} <br />
                  <span className="text-blue-600">
                    {slide.title.split(" ").slice(-2).join(" ")}
                  </span>
                </h1>
                
                <p className="text-black text-lg mb-8 max-w-lg leading-relaxed font-semibold">
                  {slide.subtitle}
                </p>
                
                <div className="flex gap-4">
                  <Link 
                    to="/products" 
                    className="px-10 py-4 bg-slate-900 text-white font-bold rounded-md hover:bg-blue-600 transition-all shadow-xl block"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button 
        onClick={prevSlide}
        className="absolute cursor-pointer left-5 top-1/2 -translate-y-1/2 z-30 bg-white/80 p-3 rounded-full shadow-lg hover:bg-blue-600 hover:text-white transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronLeft size={30} />
      </button>

      <button 
        onClick={nextSlide}
        className="absolute cursor-pointer right-5 top-1/2 -translate-y-1/2 z-30 bg-white/80 p-3 rounded-full shadow-lg hover:bg-blue-600 hover:text-white transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronRight size={30} />
      </button>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 transition-all duration-300 rounded-full ${
              index === currentSlide ? "w-10 bg-blue-600" : "w-2 bg-gray-400"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default Banner;