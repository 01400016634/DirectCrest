import dbConnect from '@/lib/mongoose';
import { Product, Category } from '@/lib/models/Schema';
import ProductCard from '@/components/storefront/ProductCard';
import Link from 'next/link';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function ProductsPage({
  searchParams,
}: {
  // @ts-ignore
  searchParams: Promise<{ q?: string; category?: string; page?: string; sort?: string }>;
}) {
  const sp = await searchParams;
  const query = sp?.q || '';
  const selectedCategory = sp?.category || '';
  const sortOption = sp?.sort || 'newest';
  const page = parseInt(sp?.page || '1');
  const limit = 12;
  const skip = (page - 1) * limit;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let products: any[] = [];
  let totalProducts = 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let categories: any[] = [];
  let activeCategoryId = selectedCategory;

  try {
    await dbConnect();
    
    // Fetch all categories for the sidebar
    const catsRaw = await Category.find().sort({ name: 1 }).lean();
    categories = JSON.parse(JSON.stringify(catsRaw));

    // Normalize category query (it might be a name from the homepage or an ID from the sidebar)
    if (selectedCategory) {
      const matchedCat = categories.find((c: any) => c._id.toString() === selectedCategory || c.name === selectedCategory);
      if (matchedCat) {
        activeCategoryId = matchedCat._id.toString();
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = { status: 'PUBLISHED' };
    if (query) {
      filter.name = { $regex: query, $options: 'i' };
    }
    if (activeCategoryId) {
      filter.category = activeCategoryId;
    }

    // Determine sorting
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let sortQuery: any = { createdAt: -1 };
    if (sortOption === 'price_asc') sortQuery = { retailPrice: 1 };
    if (sortOption === 'price_desc') sortQuery = { retailPrice: -1 };

    const productsRaw = await Product.find(filter)
      .select('-cost') 
      .sort(sortQuery)
      .skip(skip)
      .limit(limit)
      .lean();
    
    products = JSON.parse(JSON.stringify(productsRaw));
    totalProducts = await Product.countDocuments(filter);
    
  } catch (error) {
    console.error('Failed to fetch catalog data:', error);
  }

  const totalPages = Math.ceil(totalProducts / limit);

  return (
    <div className="min-h-screen bg-transparent text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-6 tracking-tight text-white uppercase border-b border-gray-800 pb-2">Categories</h2>
            <ul className="space-y-3">
              <li>
                <Link 
                  href={`/products?${new URLSearchParams({ ...(query ? {q: query} : {}), ...(sortOption ? {sort: sortOption} : {}) }).toString()}`}
                  className={`block transition-colors font-medium ${!activeCategoryId ? 'text-red-500' : 'text-gray-400 hover:text-white'}`}
                >
                  All Products
                </Link>
              </li>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {categories.map((cat: any) => (
                <li key={cat._id}>
                  <Link 
                    href={`/products?${new URLSearchParams({ category: cat._id, ...(query ? {q: query} : {}), ...(sortOption ? {sort: sortOption} : {}) }).toString()}`}
                    className={`block transition-colors font-medium ${activeCategoryId === cat._id ? 'text-red-500' : 'text-gray-400 hover:text-white'}`}
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-center bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl">
            <form className="flex items-center gap-2 w-full max-w-md" action="/products">
              {activeCategoryId && <input type="hidden" name="category" value={activeCategoryId} />}
              {sortOption && <input type="hidden" name="sort" value={sortOption} />}
              <input 
                type="text" 
                name="q" 
                defaultValue={query} 
                placeholder="Search products..." 
                className="px-4 py-2 bg-black/40 border border-white/10 rounded-lg focus:outline-none focus:border-red-500 w-full text-white placeholder-gray-500"
              />
              <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-500 transition-colors">
                Search
              </button>
            </form>
            
            <form className="flex items-center gap-2" action="/products">
              {query && <input type="hidden" name="q" value={query} />}
              {activeCategoryId && <input type="hidden" name="category" value={activeCategoryId} />}
              <span className="text-gray-400 text-sm font-medium">Sort by:</span>
              <select 
                name="sort" 
                defaultValue={sortOption}
                className="bg-black/40 border border-white/10 text-white text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block p-2 outline-none appearance-none cursor-pointer"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
              <button type="submit" className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg text-sm font-bold transition-colors">
                Apply
              </button>
            </form>
          </div>
          
          {products.length === 0 ? (
            <div className="text-center py-32 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
              <h2 className="text-2xl font-bold text-gray-300 mb-2">No products found</h2>
              <p className="text-gray-500">Try adjusting your search or category filters.</p>
              {(query || activeCategoryId) && (
                <Link href="/products" className="inline-block mt-6 text-red-500 hover:text-red-400 font-bold tracking-wide">
                  Clear All Filters
                </Link>
              )}
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {products.map((product: any) => (
                  <ProductCard key={product._id} product={product} isWishlisted={false} />
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <Link 
                      key={i}
                      href={`/products?${new URLSearchParams({ page: (i + 1).toString(), ...(query ? {q: query} : {}), ...(activeCategoryId ? {category: activeCategoryId} : {}), ...(sortOption ? {sort: sortOption} : {}) }).toString()}`}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold transition-colors ${page === i + 1 ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]' : 'bg-white/5 backdrop-blur-md border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'}`}
                    >
                      {i + 1}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
