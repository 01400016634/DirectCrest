import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Star, ShieldCheck, Truck, Package, MessageSquare, Plus, Minus, ShoppingCart } from 'lucide-react';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/products/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
          const primaryImage = data.images?.find((img: any) => img.isPrimary)?.url;
          setActiveImage(primaryImage || (data.images?.[0]?.url) || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800');

          // Save to recently viewed
          try {
            const recent = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
            const updated = [id, ...recent.filter((rId: string) => rId !== id)].slice(0, 10);
            localStorage.setItem('recentlyViewed', JSON.stringify(updated));
          } catch (e) {
            console.error('Failed to save recently viewed', e);
          }
        }
      } catch (err) {
        console.error('Failed to fetch product details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-900"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <h2 className="text-2xl font-bold text-slate-800">Product not found</h2>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* Left: Image Gallery */}
            <div className="p-8 lg:border-r border-slate-100">
              <div className="aspect-square rounded-2xl overflow-hidden bg-slate-50 mb-4">
                <img src={activeImage} alt={product.name} className="w-full h-full object-cover" />
              </div>
              
              <div className="flex gap-4 overflow-x-auto pb-2">
                {product.images?.map((img: any, idx: number) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(img.url)}
                    className={`w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${activeImage === img.url ? 'border-blue-600' : 'border-transparent'}`}
                  >
                    <img src={img.url} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Product Info */}
            <div className="p-8 lg:p-12">
              <div className="mb-2 text-sm font-semibold text-blue-600 uppercase tracking-wide">
                {product.brandId?.name || 'Generic'}
              </div>
              <h1 className="text-3xl font-bold text-navy-900 mb-4">{product.name}</h1>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-1 bg-amber-50 px-2 py-1 rounded-md">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-bold text-amber-900">4.8</span>
                </div>
                <span className="text-sm text-slate-500 underline cursor-pointer">124 Reviews</span>
                <span className="text-slate-300">|</span>
                <span className="text-sm font-medium text-slate-600">SKU: {product.sku}</span>
              </div>

              <div className="flex flex-col space-y-2 mb-8 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <div className="flex items-end space-x-3">
                  <span className="text-4xl font-extrabold text-navy-900">${product.retailPrice?.toFixed(2)}</span>
                  <span className="text-sm font-medium text-slate-500 mb-1">Retail Price</span>
                </div>
                <div className="flex items-center space-x-2 text-green-600 mt-2">
                  <span className="text-lg font-bold">From ${product.wholesaleStartingPrice?.toFixed(2)}</span>
                  <span className="text-sm font-medium">Wholesale (Min 10 units)</span>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-sm font-medium text-slate-900 mb-3">Quantity</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-slate-200 rounded-lg bg-white">
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-3 text-slate-500 hover:text-navy-900 transition-colors">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-medium text-navy-900">{quantity}</span>
                    <button onClick={() => setQuantity(q => q + 1)} className="p-3 text-slate-500 hover:text-navy-900 transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-sm text-slate-500">
                    {product.stock > 0 ? `${product.stock} units available` : 'Out of stock'}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button className="flex-1 bg-navy-900 text-white py-4 rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-blue-600 transition-colors shadow-lg shadow-navy-900/20">
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </button>
                <button className="flex-1 bg-white border-2 border-navy-900 text-navy-900 py-4 rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-slate-50 transition-colors">
                  <Package className="w-5 h-5" />
                  <span>Request Bulk Quote</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-8">
                <div className="flex items-center space-x-3 text-slate-600">
                  <ShieldCheck className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium">Verified Supplier</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-600">
                  <Truck className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-medium">Global Shipping</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12 bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
          <h2 className="text-xl font-bold text-navy-900 mb-6">Product Information</h2>
          <div className="prose max-w-none text-slate-600">
            {product.description || 'No description available for this product.'}
          </div>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-navy-900 mb-4">Specifications</h3>
              <dl className="space-y-4">
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <dt className="text-slate-500">Condition</dt>
                  <dd className="font-medium text-slate-900">{product.condition?.replace('_', ' ')}</dd>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <dt className="text-slate-500">Weight</dt>
                  <dd className="font-medium text-slate-900">{product.weight ? `${product.weight} kg` : 'N/A'}</dd>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <dt className="text-slate-500">Source Country</dt>
                  <dd className="font-medium text-slate-900">{product.sourceCountryId?.name || 'China'}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
