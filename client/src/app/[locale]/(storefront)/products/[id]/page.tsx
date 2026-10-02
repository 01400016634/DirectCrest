import dbConnect from '@/lib/mongoose';
import { Product } from '@/lib/models/Schema';
import ProductViewer from '@/components/storefront/ProductViewer';
import ProductInteractive from '@/components/storefront/ProductInteractive';
import ProductCard from '@/components/storefront/ProductCard';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Share2, Heart } from 'lucide-react';

export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const { id } = await params;

  let productRaw;
  try {
    productRaw = await Product.findById(id).lean();
  } catch (error) {
    return notFound();
  }

  if (!productRaw) {
    return notFound();
  }

  const product = JSON.parse(JSON.stringify(productRaw));

  // Fetch related products
  const relatedRaw = await Product.find({ 
    _id: { $ne: product._id },
    status: 'PUBLISHED',
    $or: [
      { categoryId: product.categoryId },
      { category: product.category || product.categoryId?.toString() }
    ].filter(c => Object.values(c)[0]) // filter out undefined
  }).limit(4).lean();
  const relatedProducts = JSON.parse(JSON.stringify(relatedRaw));

  return (
    <div className="min-h-screen bg-transparent text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Breadcrumb */}
        <nav className="flex text-sm text-gray-500 mb-8 font-medium">
          <Link href="/" className="hover:text-red-500 transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:text-red-500 transition-colors">Products</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-300 truncate max-w-xs">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left Column: 3D Viewer & Gallery */}
          <div className="flex flex-col gap-4">
            <div className="h-[400px] lg:h-[500px] rounded-3xl p-1 bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl relative group">
              <div className="absolute inset-0 bg-red-600/5 blur-3xl group-hover:bg-red-600/10 transition-colors rounded-3xl"></div>
              <div className="relative w-full h-full rounded-[22px] overflow-hidden flex items-center justify-center">
                {product.threeDModelUrl ? (
                  <ProductViewer modelUrl={product.threeDModelUrl} />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={product.imageUrl || '/images/placeholder.png'} alt={product.name} className="w-full h-full object-contain p-8" />
                )}
              </div>
            </div>
            
            {/* Gallery Thumbnails */}
            {product.images && product.images.length > 0 && (
              <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {product.images.map((img: string, idx: number) => (
                  <div key={idx} className="w-24 h-24 flex-shrink-0 bg-white rounded-xl border-2 border-transparent hover:border-red-500 cursor-pointer overflow-hidden transition-all">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Details & Checkout */}
          <div className="flex flex-col justify-start py-4">
            
            <div className="flex justify-between items-start mb-4">
              <div className="inline-flex items-center space-x-2 bg-red-950/30 border border-red-900/50 rounded-full px-3 py-1 w-fit">
                <span className="text-xs font-bold text-red-500 tracking-wider uppercase">{product.category || 'Featured'}</span>
              </div>
              <div className="flex space-x-2">
                <button className="w-10 h-10 flex items-center justify-center bg-white/5 backdrop-blur-md border border-white/10 rounded-full hover:bg-white/10 hover:text-red-500 transition-colors shadow-lg">
                  <Heart className="h-4 w-4" />
                </button>
                <button className="w-10 h-10 flex items-center justify-center bg-white/5 backdrop-blur-md border border-white/10 rounded-full hover:bg-white/10 hover:text-blue-500 transition-colors shadow-lg">
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-4 leading-tight">
              {product.name}
            </h1>
            
            <div className="flex items-center space-x-4 mb-8 border-b border-gray-800 pb-8">
              <div className="flex items-end">
                <span className="text-4xl font-black text-red-500">${product.retailPrice?.toFixed(2) || '0.00'}</span>
              </div>
              
              <div className="h-8 w-px bg-white/10 mx-4"></div>
              
              <div className="flex flex-col">
                <span className="text-xs text-gray-400 uppercase font-bold">Wholesale (Bulk)</span>
                <span className="text-lg font-bold text-gray-300">from ${product.wholesaleStartingPrice?.toFixed(2) || '0.00'}</span>
              </div>
            </div>

            <ProductInteractive product={product} />

          </div>
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-24">
            <h2 className="text-2xl font-bold text-white mb-8 border-b border-white/10 pb-4">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {relatedProducts.map((rp: any) => (
                <ProductCard key={rp._id.toString()} product={rp} isWishlisted={false} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
