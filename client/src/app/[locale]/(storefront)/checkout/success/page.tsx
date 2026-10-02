'use client';

import { useCartStore } from '@/store/cartStore';
import { useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutSuccessPage() {
  const { clearCart } = useCartStore();

  useEffect(() => {
    // Clear the cart on successful checkout
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-slate-50 py-20">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
          Payment Successful!
        </h1>
        <p className="text-lg text-slate-600 mb-10">
          Thank you for your order. We are processing it and will send a confirmation email shortly.
        </p>

        <Link 
          href="/products"
          className="inline-block px-8 py-4 bg-[#1e3a8a] text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 hover:bg-[#172554] transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
