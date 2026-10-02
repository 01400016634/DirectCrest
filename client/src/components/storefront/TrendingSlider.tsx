"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductViewer from './ProductViewer';

export default function TrendingSlider({ products }: { products: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (products.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [products]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  if (!products || products.length === 0) {
    return null;
  }

  const currentProduct = products[currentIndex];

  return (
    <div className="relative w-full max-w-4xl mx-auto bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-6 sm:p-10 shadow-2xl overflow-hidden">
      
      <div className="absolute top-1/2 left-4 -translate-y-1/2 z-20">
        <button onClick={prevSlide} className="p-2 rounded-full bg-black/50 hover:bg-red-600 border border-white/20 text-white transition-all">
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>

      <div className="absolute top-1/2 right-4 -translate-y-1/2 z-20">
        <button onClick={nextSlide} className="p-2 rounded-full bg-black/50 hover:bg-red-600 border border-white/20 text-white transition-all">
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      <Link href={`/products/${currentProduct._id}`} className="block group w-full h-full">
        <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
          <div className="w-full md:w-1/2 aspect-square max-h-[400px] relative flex items-center justify-center">
            {currentProduct.threeDModelUrl || currentProduct.glbModelPath ? (
              <ProductViewer 
                modelUrl={currentProduct.threeDModelUrl || currentProduct.glbModelPath} 
                interactive={false} 
                showBadge={true}
                className="w-full h-full bg-transparent border-none rounded-none shadow-none pointer-events-none"
              />
            ) : (
              <img 
                src={currentProduct.imageUrl || '/images/placeholder.png'} 
                alt={currentProduct.name} 
                className="w-full h-full object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-500" 
              />
            )}
          </div>
          
          <div className="w-full md:w-1/2 text-center md:text-left flex flex-col justify-center">
            <h3 className="text-3xl font-black text-white mb-4 leading-tight">{currentProduct.name}</h3>
            <p className="text-gray-400 mb-6 line-clamp-3 text-lg">{currentProduct.description || 'High-quality trending product globally sourced.'}</p>
            <div className="flex flex-col sm:flex-row items-center gap-4 md:items-start md:justify-start justify-center">
              <span className="text-4xl font-black text-red-500">৳{currentProduct.price?.toLocaleString() || currentProduct.retailPrice?.toLocaleString() || '0'}</span>
              <span className="px-4 py-2 bg-red-950/50 text-red-400 font-bold rounded-xl border border-red-900">Trending Now</span>
            </div>
          </div>
        </div>
      </Link>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {products.map((_, idx) => (
          <button 
            key={idx} 
            onClick={() => setCurrentIndex(idx)}
            className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-red-500 w-6' : 'bg-white/30'}`}
          />
        ))}
      </div>
    </div>
  );
}
