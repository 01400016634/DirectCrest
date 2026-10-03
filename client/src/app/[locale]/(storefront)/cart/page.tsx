'use client';

import { useCartStore } from '@/store/cartStore';
import Link from 'next/link';
import { Trash2, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const { items, removeItem, updateQuantity } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const subtotal = items.reduce((sum, item) => sum + (item.product.retailPrice * item.quantity), 0);
  const shipping = subtotal > 0 ? 15.00 : 0;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-[#09090b] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-black uppercase tracking-tight mb-10 text-white">Your Cart</h1>
        
        {items.length === 0 ? (
          <div className="text-center py-20 bg-[#18181b] rounded-3xl border border-gray-800 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-400">Your cart is empty.</h2>
            <Link href="/products" className="mt-6 inline-block bg-red-600 text-white font-bold py-3 px-8 rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:bg-red-500 transition-colors uppercase tracking-wider">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-6">
              {items.map((item) => (
                <div key={item.product._id} className="flex items-center p-6 bg-[#18181b] rounded-2xl border border-gray-800 shadow-xl relative group">
                  <div className="w-24 h-24 bg-[#09090b] rounded-xl flex-shrink-0 border border-gray-700 mr-6 flex items-center justify-center">
                    <span className="text-xs text-gray-600">Image</span>
                  </div>
                  
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold text-gray-100">{item.product.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{item.product.category || 'Gadget'}</p>
                    <div className="text-lg font-black text-red-500 mt-2">${item.product.retailPrice?.toFixed(2)}</div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center bg-[#09090b] border border-gray-700 rounded-lg overflow-hidden">
                      <button 
                        onClick={() => updateQuantity(item.product._id, undefined, Math.max(1, item.quantity - 1))}
                        className="px-3 py-1 text-gray-400 hover:text-white hover:bg-gray-800"
                      >-</button>
                      <span className="px-4 text-sm font-bold">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.product._id, undefined, item.quantity + 1)}
                        className="px-3 py-1 text-gray-400 hover:text-white hover:bg-gray-800"
                      >+</button>
                    </div>
                    
                    <button 
                      onClick={() => removeItem(item.product._id)}
                      className="text-gray-500 hover:text-red-500 transition-colors p-2"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-[#18181b] rounded-3xl p-8 border border-gray-800 shadow-2xl sticky top-8">
                <h3 className="text-2xl font-black text-white mb-6 uppercase tracking-tight">Summary</h3>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span className="font-bold text-white">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Estimated Shipping</span>
                    <span className="font-bold text-white">${shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400 pt-4 border-t border-gray-800">
                    <span className="font-bold text-white text-xl">Total</span>
                    <span className="font-black text-red-500 text-2xl">${total.toFixed(2)}</span>
                  </div>
                </div>

                <Link href="/checkout" className="w-full flex items-center justify-center bg-red-600 text-white font-black py-4 rounded-xl shadow-[0_0_30px_rgba(220,38,38,0.3)] hover:shadow-[0_0_40px_rgba(220,38,38,0.5)] hover:-translate-y-1 transition-all uppercase tracking-widest text-sm">
                  Proceed to Checkout <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <div className="mt-4 text-center">
                  <span className="text-xs text-gray-500 font-medium tracking-wider">SECURE 256-BIT ENCRYPTED CHECKOUT</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
