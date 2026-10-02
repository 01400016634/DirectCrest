'use client';

import React, { useState } from 'react';
import ProductViewer from '@/components/storefront/ProductViewer';
import { useCartStore } from '@/store/cartStore';
import WishlistToggle from '@/components/storefront/WishlistToggle';
import { useCurrencyStore, formatPrice } from '@/store/currencyStore';

interface Variant {
  _id: string;
  name: string;
  price: number;
  sku: string;
  colorHex?: string; // We'll map variant name to a color for demo, or assume schema supports color
}

interface Product {
  _id: string;
  name: string;
  description: string;
  retailPrice: number;
  modelUrl?: string; // We assume product has a modelUrl
  threeDModelUrl?: string;
  variants: Variant[];
  wholesaleTiers?: { minQuantity: number; price: number }[];
  rating?: number;
  numReviews?: number;
  weight?: number;
}

export default function ProductDetailClient({ product, isWishlisted = false }: { product: Product; isWishlisted?: boolean }) {
  const { addItem } = useCartStore();
  const { currency } = useCurrencyStore();
  const [mounted, setMounted] = React.useState(false);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    product.variants.length > 0 ? product.variants[0] : null
  );

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const price = selectedVariant ? selectedVariant.price : product.retailPrice;

  // Simple heuristic: if variant name has a color in it, we use it for the 3D model
  const getColorFromName = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('red')) return '#dc2626';
    if (n.includes('blue')) return '#2563eb';
    if (n.includes('green')) return '#16a34a';
    if (n.includes('black')) return '#171717';
    if (n.includes('white')) return '#ffffff';
    if (n.includes('gray') || n.includes('grey')) return '#6b7280';
    return undefined;
  };

  const activeColor = selectedVariant ? (selectedVariant.colorHex || getColorFromName(selectedVariant.name)) : undefined;

  const handleAddToCart = () => {
    addItem({
      productId: product._id,
      variantId: selectedVariant?._id,
      name: product.name + (selectedVariant ? ` - ${selectedVariant.name}` : ''),
      price,
      wholesaleTiers: product.wholesaleTiers,
      quantity: 1,
      color: activeColor,
      weight: product.weight,
    });
    alert('Added to cart!');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white rounded-xl shadow-lg p-8">
      {/* Left: 3D Viewer */}
      <div className="aspect-square bg-slate-50 rounded-xl overflow-hidden border border-slate-200">
        <ProductViewer
          modelUrl={product.threeDModelUrl || product.modelUrl}
          interactive={true}
          poster="/images/placeholder.png"
        />
      </div>

      {/* Right: Product Info */}
      <div className="flex flex-col">
        <div className="flex justify-between items-start gap-4 mb-2">
          <h1 className="text-4xl font-extrabold text-[#0f172a] tracking-tight">{product.name}</h1>
          <WishlistToggle 
            productId={product._id} 
            initialIsWishlisted={isWishlisted} 
            className="p-3 bg-white rounded-full shadow-md border border-slate-100 hover:bg-slate-50 transition-all flex-shrink-0" 
            iconClassName="w-6 h-6"
          />
        </div>
        {product.numReviews !== undefined && product.numReviews > 0 && (
          <div className="flex items-center mb-4">
            <div className="flex text-yellow-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  className={`w-5 h-5 ${i < Math.round(product.rating || 0) ? 'text-yellow-400' : 'text-slate-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="ml-2 text-sm text-slate-500">
              {product.rating?.toFixed(1)} ({product.numReviews} review{product.numReviews > 1 ? 's' : ''})
            </span>
          </div>
        )}
        <p className="text-3xl font-bold text-[#1e3a8a] mb-6">
          {mounted ? formatPrice(price, currency) : `$${price.toFixed(2)}`}
        </p>
        
        <p className="text-slate-600 text-lg leading-relaxed mb-8">
          {product.description}
        </p>

        {product.variants.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3">
              Select Option
            </h3>
            <div className="flex flex-wrap gap-3">
              {product.variants.map((v) => (
                <button
                  key={v._id}
                  onClick={() => setSelectedVariant(v)}
                  className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                    selectedVariant?._id === v._id
                      ? 'border-[#1e3a8a] bg-[#eff6ff] text-[#1e3a8a]'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {v.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-auto">
          {product.wholesaleTiers && product.wholesaleTiers.length > 0 && (
            <div className="mb-6 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
              <h4 className="text-sm font-bold text-[#1e3a8a] mb-3">Wholesale Volume Pricing</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-slate-600">1+ units</div>
                <div className="font-semibold text-slate-900">
                  {mounted ? formatPrice(price, currency) : `$${price.toFixed(2)}`} / ea
                </div>
                {[...product.wholesaleTiers]
                  .sort((a, b) => a.minQuantity - b.minQuantity)
                  .map((tier, idx) => (
                    <React.Fragment key={idx}>
                      <div className="text-slate-600">{tier.minQuantity}+ units</div>
                      <div className="font-semibold text-[#1e3a8a]">
                        {mounted ? formatPrice(tier.price, currency) : `$${tier.price.toFixed(2)}`} / ea
                      </div>
                    </React.Fragment>
                ))}
              </div>
            </div>
          )}
          <button
            onClick={handleAddToCart}
            className="w-full bg-[#1e3a8a] hover:bg-[#172554] text-white font-bold py-4 rounded-xl shadow-md transition-colors text-lg"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
