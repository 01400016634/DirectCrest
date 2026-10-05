import Link from 'next/link';
import { ArrowRight, Package, Globe, ShieldCheck, Box, Search, Truck, Zap, CheckCircle, HelpCircle } from 'lucide-react';
import dbConnect from '@/lib/mongoose';
import { Product } from '@/lib/models/Schema';
import AboutSection from '@/components/storefront/AboutSection';
import TrendingSlider from '@/components/storefront/TrendingSlider';

export const revalidate = 60; // Revalidate every 60s

export default async function HomePage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let featuredProducts: any[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let trendingProducts: any[] = [];

  try {
    await dbConnect();
    
    const featuredRaw = await Product.find({ status: 'PUBLISHED', isFeatured: true })
      .select('-cost')
      .sort({ createdAt: -1 })
      .limit(8)
      .lean();
    featuredProducts = JSON.parse(JSON.stringify(featuredRaw));
    
    const trendingRaw = await Product.find({ status: 'PUBLISHED', isTrending: true })
      .select('-cost')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();
    trendingProducts = JSON.parse(JSON.stringify(trendingRaw));
    
  } catch (error) {
    console.error('Failed to fetch homepage data:', error);
  }

  let categories: { name: string; icon: string; count: string }[] = [];
  try {
    const categoryCounts = await Product.aggregate([
      { $match: { status: 'PUBLISHED' } },
      { $group: { _id: '$categoryId', count: { $sum: 1 } } },
      { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'category' } },
      { $unwind: '$category' }
    ]);

    const iconMap: Record<string, string> = {
      'Smartphones & Tablets': '📱',
      'Laptops, Wearables & Audio': '💻',
      'Cameras & Power Banks': '📷',
      'Toys, RC & Die-Cast Vehicles': '🏎️',
      'Footwear': '👟',
      'Apparel & Fashion': '👕',
      'Bags & Backpacks': '🎒',
      'Jewelry & Accessories': '💎',
      'Medical & Laboratory Equipment': '🔬',
      'Home, Office & Cosmetics': '🏢',
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    categories = categoryCounts.map((c: any) => ({
      name: c.category.name,
      icon: iconMap[c.category.name] || '📦',
      count: `${c.count} product${c.count !== 1 ? 's' : ''}`
    }));

    // Sort to maintain a consistent order
    categories.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Failed to fetch category counts:', error);
  }

  return (
    <div className="text-white w-full">
      {/* 1. Hero & Search */}
      <section className="min-h-[85vh] w-full flex flex-col items-center justify-center relative pt-24 pb-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10 w-full">
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter mb-8 text-white drop-shadow-2xl uppercase leading-none">
              Source From China.<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">Sell Anywhere.</span>
            </h1>
            <p className="mt-4 text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 font-medium leading-relaxed drop-shadow-lg">
              Welcome to DirectCrest. Enterprise B2B Sourcing Engineered for the Future.
            </p>

            <div className="bg-[#18181b]/90 backdrop-blur-xl border border-gray-800 p-2 sm:p-4 rounded-3xl shadow-[0_0_50px_rgba(220,38,38,0.15)] flex flex-col sm:flex-row gap-2 sm:gap-4 max-w-4xl mx-auto">
              <div className="flex-1 relative flex items-center bg-[#09090b] border border-gray-700 rounded-2xl overflow-hidden">
                <Search className="h-6 w-6 text-gray-500 ml-4 absolute" />
                <input 
                  type="text" 
                  placeholder="What are you looking to source?" 
                  className="w-full bg-transparent text-white placeholder-gray-500 py-5 pl-14 pr-4 focus:outline-none text-lg"
                />
              </div>
              <button className="bg-red-600 hover:bg-red-500 text-white font-black text-lg py-5 px-10 rounded-2xl transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)]">
                Search
              </button>
            </div>
          </div>
        </section>

        {/* 2. Categories */}
      <section className="w-full py-16 bg-black/20 backdrop-blur-md border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
          <h2 className="text-sm font-bold text-gray-400 mb-6 tracking-[0.2em] uppercase text-center">Top Sourcing Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat, i) => (
              <Link href={`/products?category=${encodeURIComponent(cat.name)}`} key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:-translate-y-1 hover:border-red-500/50 hover:bg-red-950/20 transition-all group">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{cat.icon}</div>
                <h3 className="font-bold text-gray-200 mb-1 leading-tight">{cat.name}</h3>
                <p className="text-xs text-gray-400 font-medium">{cat.count}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Featured Products */}
      <section className="w-full py-24 bg-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
            <div className="flex justify-between items-end mb-12 border-b border-gray-800 pb-4">
              <h2 className="text-3xl font-black text-white tracking-tight uppercase flex items-center gap-3">
                <Zap className="text-red-500" /> Trending Products
              </h2>
              <Link href="/products" className="text-red-500 font-bold hover:text-red-400 transition-colors uppercase tracking-wider flex items-center">
                View Catalog <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>

          {trendingProducts.length === 0 ? (
            <div className="text-center py-20 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10">
              <Package className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-300">Inventory Syncing...</h2>
            </div>
          ) : (
            <TrendingSlider products={trendingProducts} />
          )}
        </div>
      </section>

      {/* 4. China Sourcing & Wholesale Info */}
      <section className="w-full py-24 bg-gradient-to-b from-black/20 to-black/60 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl sm:text-5xl font-black text-white mb-6 uppercase tracking-tight leading-tight">
                  Direct Factory <span className="text-red-500">Sourcing</span>
                </h2>
                <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                  Bypass trading companies and middlemen. We connect you directly with the manufacturers in Guangdong, Zhejiang, and Yiwu. Get authentic factory prices for true wholesale margins.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-gray-300">
                    <CheckCircle className="text-red-500 h-6 w-6 shrink-0" />
                    <span>Verified Manufacturer Network</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-300">
                    <CheckCircle className="text-red-500 h-6 w-6 shrink-0" />
                    <span>Quality Control & Factory Audits</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-300">
                    <CheckCircle className="text-red-500 h-6 w-6 shrink-0" />
                    <span>OEM & ODM Customization</span>
                  </li>
                </ul>
              </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 text-center shadow-lg">
                <div className="text-4xl font-black text-white mb-2">0%</div>
                <div className="text-sm text-gray-400 uppercase font-bold">Middleman Markup</div>
              </div>
              <div className="bg-red-600/90 backdrop-blur-md p-8 rounded-3xl text-center transform translate-y-8 border border-red-500/50 shadow-[0_20px_40px_rgba(220,38,38,0.3)]">
                <div className="text-4xl font-black text-white mb-2">10k+</div>
                <div className="text-sm text-red-200 uppercase font-bold">Verified Factories</div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* 6. Global Shipping & How It Works */}
      <section className="w-full py-24 relative bg-black/40 backdrop-blur-sm border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-black text-white tracking-tight uppercase mb-4">Seamless Global Logistics</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">From consolidation in China to final mile delivery anywhere in the world. We handle the entire supply chain.</p>
            </div>
            
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-white/10 -z-10 transform -translate-y-1/2"></div>
            
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl text-center relative z-10 shadow-xl">
              <div className="w-16 h-16 bg-red-950/50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/30 shadow-[0_0_30px_rgba(220,38,38,0.2)]">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">1. Find & Source</h3>
              <p className="text-sm text-gray-400">Discover products or submit custom sourcing requests.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl text-center relative z-10 shadow-xl">
              <div className="w-16 h-16 bg-red-950/50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/30 shadow-[0_0_30px_rgba(220,38,38,0.2)]">
                <Box className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">2. Consolidate</h3>
              <p className="text-sm text-gray-400">Items are gathered, inspected, and packed in our China warehouses.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl text-center relative z-10 shadow-xl">
              <div className="w-16 h-16 bg-red-950/50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/30 shadow-[0_0_30px_rgba(220,38,38,0.2)]">
                <Globe className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">3. Customs Clearance</h3>
              <p className="text-sm text-gray-400">We manage all export and import documentation globally.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl text-center relative z-10 shadow-xl">
              <div className="w-16 h-16 bg-red-950/50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/30 shadow-[0_0_30px_rgba(220,38,38,0.2)]">
                <Truck className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">4. Final Delivery</h3>
              <p className="text-sm text-gray-400">Delivered directly to your warehouse or retail location.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Trust & Benefits */}
      <section className="w-full py-24 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="bg-white/5 backdrop-blur-md p-10 rounded-[2rem] border border-white/10 flex flex-col items-center text-center shadow-xl">
               <ShieldCheck className="w-12 h-12 text-red-500 mb-6" />
               <h3 className="text-xl font-bold text-white mb-4 uppercase">Trade Assurance</h3>
               <p className="text-gray-400">Your payments are held in escrow until you receive and verify the goods. Zero risk.</p>
             </div>
             <div className="bg-white/5 backdrop-blur-md p-10 rounded-[2rem] border border-white/10 flex flex-col items-center text-center shadow-xl">
               <Globe className="w-12 h-12 text-red-500 mb-6" />
               <h3 className="text-xl font-bold text-white mb-4 uppercase">Door-to-Door</h3>
               <p className="text-gray-400">DDP (Delivered Duty Paid) shipping options mean you never worry about customs.</p>
             </div>
             <div className="bg-white/5 backdrop-blur-md p-10 rounded-[2rem] border border-white/10 flex flex-col items-center text-center shadow-xl">
               <Package className="w-12 h-12 text-red-500 mb-6" />
               <h3 className="text-xl font-bold text-white mb-4 uppercase">Low MOQ</h3>
               <p className="text-gray-400">Access factory pricing without committing to massive container loads.</p>
             </div>
           </div>
        </div>
      </section>

      {/* 8. About DirectCrest */}
      <AboutSection />

      {/* 9. Product Request CTA */}
      <section className="w-full py-32 bg-black/20 backdrop-blur-md relative overflow-hidden border-t border-white/10">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <HelpCircle className="w-20 h-20 text-red-500 mx-auto mb-8" />
            <h2 className="text-4xl sm:text-6xl font-black text-white mb-6 tracking-tight drop-shadow-lg">
              CAN&apos;T FIND WHAT YOU&apos;RE LOOKING FOR?
            </h2>
            <p className="text-xl text-gray-300 mb-10 font-medium max-w-2xl mx-auto leading-relaxed">
              Ask DirectCrest to source it directly from China. Provide an image or a link, and our agents will negotiate the best factory price for you.
            </p>
            <Link href="/account?tab=requests" className="inline-block bg-red-600 text-white font-black text-xl py-5 px-12 rounded-2xl hover:bg-red-500 hover:scale-105 transition-all shadow-[0_0_30px_rgba(220,38,38,0.3)]">
              Submit Sourcing Request
            </Link>
          </div>
        </section>
      </div>
  );
}
