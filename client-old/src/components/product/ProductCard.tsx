import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart } from 'lucide-react';

interface ProductProps {
  product: {
    _id: string;
    name: string;
    brandId?: { name: string };
    retailPrice: number;
    wholesaleStartingPrice: number;
    condition: string;
    stock: number;
    images?: { url: string, isPrimary: boolean }[];
    rating?: number;
  }
}

export default function ProductCard({ product }: ProductProps) {
  const primaryImage = product.images?.find(img => img.isPrimary)?.url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800';
  
  return (
    <div className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="relative aspect-square overflow-hidden bg-slate-50">
        <Link to={`/product/${product._id}`}>
          <img 
            src={primaryImage} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.condition !== 'NEW' && (
            <span className="bg-slate-900/80 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-md">
              {product.condition.replace('_', ' ')}
            </span>
          )}
        </div>
        <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-md rounded-full text-slate-400 hover:text-red-500 hover:bg-white transition-colors opacity-0 group-hover:opacity-100 shadow-sm">
          <Heart className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
            {product.brandId?.name || 'Generic'}
          </span>
          <div className="flex items-center space-x-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-medium text-slate-700">{product.rating || '4.5'}</span>
          </div>
        </div>

        <Link to={`/product/${product._id}`}>
          <h3 className="font-semibold text-navy-900 line-clamp-2 hover:text-blue-600 transition-colors h-12">
            {product.name}
          </h3>
        </Link>

        <div className="mt-4 flex flex-col space-y-1">
          <div className="flex items-end space-x-2">
            <span className="text-lg font-bold text-navy-900">${product.retailPrice?.toFixed(2)}</span>
            <span className="text-xs text-slate-500 mb-1">Retail</span>
          </div>
          <div className="flex items-end space-x-2">
            <span className="text-sm font-semibold text-green-600">From ${product.wholesaleStartingPrice?.toFixed(2)}</span>
            <span className="text-xs text-slate-500">Wholesale</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className={`text-xs font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </span>
          
          <button 
            disabled={product.stock <= 0}
            className="flex items-center space-x-1 bg-navy-900 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
