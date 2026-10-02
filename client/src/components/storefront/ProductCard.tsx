'use client';

import Link from 'next/link';
import WishlistToggle from '@/components/storefront/WishlistToggle';
import { useCurrencyStore, formatPrice } from '@/store/currencyStore';
import { useEffect, useState, useRef } from 'react';
import ProductViewer from './ProductViewer';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProductCard({ product, isWishlisted = false }: { product: any; isWishlisted?: boolean }) {
  const { currency } = useCurrencyStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <Link href={`/products/${product._id}`} className="group">
      <div className="bg-white/5 backdrop-blur-md rounded-xl shadow-xl border border-white/10 overflow-hidden transition-all hover:shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:border-red-500/50 relative">
        <div className="absolute top-3 right-3 z-10">
          <WishlistToggle productId={product._id.toString()} initialIsWishlisted={isWishlisted} />
        </div>
        <div className="aspect-square bg-black/40 flex items-center justify-center p-4 relative">
          {product.threeDModelUrl ? (
            <>
              <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur px-2 py-1 rounded-md text-[10px] font-bold text-red-400 border border-red-900/50 flex items-center shadow-lg pointer-events-none">
                3D View Available
              </div>

              <div className="absolute inset-0 z-0 pointer-events-none">
                <ProductViewer 
                  modelUrl={product.threeDModelUrl} 
                  interactive={false} 
                  showBadge={false}
                  poster={product.imageUrl || '/images/placeholder.png'}
                  className="w-full h-full"
                />
              </div>
            </>
          ) : (
            <img 
              src={product.imageUrl || '/images/placeholder.png'}  
              alt={product.name}
              className="object-contain max-h-full opacity-80 group-hover:opacity-100 transition-opacity"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%239ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>';
              }}
            />
          )}
        </div>
        <div className="p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{product.brand?.name || product.brand || 'DirectCrest'}</p>
          <h3 className="text-lg font-bold text-white mb-2 truncate group-hover:text-red-400 transition-colors">{product.name}</h3>
          
          {product.numReviews !== undefined && product.numReviews > 0 && (
            <div className="flex items-center mb-2">
              <div className="flex text-yellow-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className={`w-3.5 h-3.5 ${i < Math.round(product.rating || 0) ? 'text-yellow-400' : 'text-gray-700'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="ml-1 text-xs text-gray-400">
                ({product.numReviews})
              </span>
            </div>
          )}

          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-xl font-extrabold text-white">
              {mounted ? formatPrice(product.retailPrice || 0, currency) : `$${(product.retailPrice || 0).toFixed(2)}`}
            </p>
            {product.wholesalePrice && (
              <p className="text-xs text-gray-500 line-through">
                {mounted ? formatPrice(product.wholesalePrice, currency) : `$${product.wholesalePrice.toFixed(2)}`}
              </p>
            )}
          </div>
          {product.wholesaleStartingPrice && (
            <p className="text-xs font-semibold text-green-600 mt-1">
              Wholesale from: {mounted ? formatPrice(product.wholesaleStartingPrice, currency) : `$${product.wholesaleStartingPrice.toFixed(2)}`}
            </p>
          )}

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
            <span className="text-xs font-medium text-gray-300 bg-white/10 px-2 py-1 rounded-md">
              {product.condition || 'New'}
            </span>
            <span className={`text-xs font-bold ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
