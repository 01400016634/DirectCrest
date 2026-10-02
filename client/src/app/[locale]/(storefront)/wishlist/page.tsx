import dbConnect from '@/lib/mongoose';
import { Product, User } from '@/lib/models/Schema';
import ProductCard from '@/components/storefront/ProductCard';
import { Heart } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 0; // Dynamic page

export default async function WishlistPage() {
  await dbConnect();
  
  const userRaw = await User.findById('000000000000000000000000').select('wishlist').lean();
  const wishlistIds = userRaw ? JSON.parse(JSON.stringify(userRaw.wishlist)) : [];

  const productsRaw = await Product.find({ 
    _id: { $in: wishlistIds },
    status: 'PUBLISHED' 
  }).select('-cost').lean();
  const products = JSON.parse(JSON.stringify(productsRaw));

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-red-50 text-red-500 rounded-xl">
            <Heart className="w-8 h-8 fill-red-500" />
          </div>
          <h1 className="text-4xl font-extrabold text-[#0f172a] tracking-tight">
            Your Wishlist
          </h1>
        </div>
        
        {products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center">
            <Heart className="w-16 h-16 text-slate-200 mb-4" />
            <h2 className="text-2xl font-bold text-slate-700 mb-2">Your wishlist is empty.</h2>
            <p className="text-slate-500 mb-8 max-w-md">Save items you love to your wishlist to easily find them later or purchase when you&apos;re ready.</p>
            <Link href="/products" className="px-8 py-3 bg-[#1e3a8a] text-white font-bold rounded-xl hover:bg-[#172554] transition-colors shadow-md">
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {products.map((product: any) => (
              <ProductCard 
                key={product._id} 
                product={product} 
                isWishlisted={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
