'use client';

import { useState } from 'react';
import { ShoppingCart, Heart, Share2, CreditCard, MessageSquare, Star, Truck, ShieldCheck, Package, X, Check } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useRouter } from 'next/navigation';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProductInteractive({ product }: { product: any }) {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('specs');
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkQuantity, setBulkQuantity] = useState(100);
  const [targetPrice, setTargetPrice] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const router = useRouter();

  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Mock API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setTimeout(() => {
        setShowBulkModal(false);
        setSubmitSuccess(false);
        setBulkQuantity(100);
        setTargetPrice('');
        setNotes('');
      }, 2000);
    }, 1000);
  };
  
  // Dummy data for variants if not present
  const variants = product.variants || [
    { name: 'Standard', price: product.retailPrice },
    { name: 'Pro', price: (product.retailPrice || 0) * 1.5 }
  ];
  const [selectedVariant, setSelectedVariant] = useState(variants[0]);

  const handleAddToCart = () => {
    addItem({
      productId: product._id,
      name: product.name,
      price: selectedVariant?.price || product.retailPrice || 0,
      imageUrl: product.imageUrl || (product.images && product.images[0]),
      quantity,
      variantId: selectedVariant?.name,
      wholesaleTiers: product.wholesaleTiers
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/checkout');
  };

  return (
    <div className="flex flex-col w-full">
      {/* Variants */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-3">Select Variant</h3>
        <div className="flex gap-3 flex-wrap">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {variants.map((v: any, idx: number) => (
            <button 
              key={idx}
              onClick={() => setSelectedVariant(v)}
              className={`px-4 py-2 rounded-xl border font-semibold transition-all ${
                selectedVariant.name === v.name 
                  ? 'border-red-500 bg-red-950/30 text-red-500' 
                  : 'border-white/10 bg-white/5 backdrop-blur-md text-gray-400 hover:border-white/20 hover:text-white'
              }`}
            >
              {v.name}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity */}
      <div className="mb-8 flex items-center gap-4">
        <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Quantity</h3>
        <div className="flex items-center bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden">
          <button 
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-4 py-2 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            -
          </button>
          <input 
            type="number" 
            value={quantity} 
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-16 bg-transparent text-center font-bold text-white outline-none border-x border-white/10 h-full py-2"
          />
          <button 
            onClick={() => setQuantity(quantity + 1)}
            className="px-4 py-2 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            +
          </button>
        </div>
        <span className="text-xs text-gray-500">{product.stock || 100} pieces available</span>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-4 mb-12">
        <div className="flex gap-4">
          <button 
            onClick={handleAddToCart}
            className={`flex-1 font-black text-lg py-4 px-6 rounded-2xl transition-all flex items-center justify-center ${
              addedToCart 
                ? 'bg-green-600 hover:bg-green-500 text-white shadow-[0_0_20px_rgba(22,163,74,0.4)]' 
                : 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_20px_rgba(220,38,38,0.2)] hover:shadow-[0_0_30px_rgba(220,38,38,0.4)] hover:-translate-y-0.5'
            }`}
          >
            {addedToCart ? (
              <><Check className="mr-3 h-5 w-5" /> Added!</>
            ) : (
              <><ShoppingCart className="mr-3 h-5 w-5" /> Add to Cart</>
            )}
          </button>
          <button 
            onClick={handleBuyNow}
            className="flex-1 bg-white hover:bg-gray-100 text-[#09090b] font-black text-lg py-4 px-6 rounded-2xl transition-all flex items-center justify-center hover:-translate-y-0.5"
          >
            <CreditCard className="mr-3 h-5 w-5" /> Buy Now
          </button>
        </div>
        <button 
          onClick={() => setShowBulkModal(true)}
          className="w-full bg-white/5 backdrop-blur-md border border-red-900/50 hover:bg-red-950/20 text-red-400 font-bold text-lg py-4 px-6 rounded-2xl transition-all flex items-center justify-center hover:-translate-y-0.5"
        >
          <MessageSquare className="mr-3 h-5 w-5" /> Request Bulk Quote
        </button>
      </div>

      {/* Bulk Quote Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#04060f] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
            <button 
              onClick={() => setShowBulkModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-white mb-2">Request Bulk Quote</h2>
            <p className="text-gray-400 text-sm mb-6">Get a custom quote for {product.name}</p>
            
            {submitSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Request Sent!</h3>
                <p className="text-gray-400">Our team will get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleBulkSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-1">Target Quantity</label>
                  <input 
                    type="number" 
                    required
                    min="10"
                    value={bulkQuantity}
                    onChange={(e) => setBulkQuantity(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-1">Target Price per Unit ($)</label>
                  <input 
                    type="number"
                    step="0.01"
                    placeholder="Optional"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-1">Additional Notes</label>
                  <textarea 
                    rows={3}
                    placeholder="Specific requirements, shipping preferences, etc."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-500 transition-colors resize-none"
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center disabled:opacity-50 mt-4"
                >
                  {isSubmitting ? 'Sending...' : 'Submit Request'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Trust Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-white/10 pt-8 mb-12">
        <div className="flex flex-col items-start bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10">
          <Truck className="h-6 w-6 text-red-500 mb-2" />
          <span className="text-sm font-bold text-gray-200">Global Shipping</span>
          <span className="text-xs text-gray-500 mt-1">Air Courier available</span>
        </div>
        <div className="flex flex-col items-start bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10">
          <ShieldCheck className="h-6 w-6 text-red-500 mb-2" />
          <span className="text-sm font-bold text-gray-200">Buyer Protection</span>
          <span className="text-xs text-gray-500 mt-1">Secure escrow payments</span>
        </div>
        <div className="flex flex-col items-start bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10">
          <Package className="h-6 w-6 text-red-500 mb-2" />
          <span className="text-sm font-bold text-gray-200">Verified Quality</span>
          <span className="text-xs text-gray-500 mt-1">Direct from factory</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="w-full border border-white/10 rounded-2xl bg-white/5 backdrop-blur-md overflow-hidden">
        <div className="flex border-b border-white/10 overflow-x-auto custom-scrollbar">
          {['specs', 'reviews', 'shipping'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 px-6 font-bold text-sm uppercase tracking-wider transition-colors whitespace-nowrap ${
                activeTab === tab ? 'text-red-500 border-b-2 border-red-500 bg-white/10' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
              }`}
            >
              {tab === 'specs' ? 'Specifications' : tab === 'reviews' ? 'Reviews' : 'Shipping Info'}
            </button>
          ))}
        </div>
        <div className="p-6">
          {activeTab === 'specs' && (
            <div className="text-gray-400 text-sm leading-relaxed space-y-4">
              <p>{product.description}</p>
              <ul className="list-disc pl-5 space-y-2 mt-4 text-gray-300">
                <li><strong>Brand:</strong> {product.brand || 'DirectCrest'}</li>
                <li><strong>Condition:</strong> {product.condition || 'New'}</li>
                <li><strong>SKU:</strong> {product.sku || 'N/A'}</li>
                <li><strong>Weight:</strong> {product.weight || '1.0'} kg</li>
              </ul>
            </div>
          )}
          {activeTab === 'reviews' && (
            <div className="text-gray-400 text-sm space-y-6">
              {product.numReviews > 0 ? (
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <span className="text-3xl font-black text-white">{product.rating?.toFixed(1) || '5.0'}</span>
                    <div className="flex text-yellow-400">
                      {[1,2,3,4,5].map(i => <Star key={i} className={`w-5 h-5 ${i <= (product.rating || 5) ? 'fill-current' : 'text-gray-700'}`} />)}
                    </div>
                    <span className="text-gray-500 ml-2">Based on {product.numReviews} reviews</span>
                  </div>
                  {/* Mock review */}
                  <div className="border-t border-white/10 pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-white">J</div>
                      <span className="font-bold text-white">John Doe</span>
                      <span className="text-xs text-gray-500 ml-auto">2 days ago</span>
                    </div>
                    <div className="flex text-yellow-400 mb-2">
                      {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-current" />)}
                    </div>
                    <p className="text-gray-300">Great quality product, exactly as described. The wholesale pricing is very competitive!</p>
                  </div>
                </div>
              ) : (
                <p>No reviews yet for this product. Be the first to review!</p>
              )}
            </div>
          )}
          {activeTab === 'shipping' && (
            <div className="text-gray-400 text-sm leading-relaxed space-y-4">
              <p><strong>Processing Time:</strong> 1-3 business days.</p>
              <p><strong>Shipping Methods:</strong> Air Express (3-7 days), Sea Freight (15-30 days).</p>
              <p><strong>Shipping Cost:</strong> Calculated at checkout based on weight and destination.</p>
              <p className="text-xs text-gray-500 italic mt-4">* Note: Import duties and taxes are the responsibility of the buyer for wholesale orders.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
