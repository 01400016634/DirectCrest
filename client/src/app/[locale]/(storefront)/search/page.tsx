import dbConnect from '@/lib/mongoose';
import { Product, Category, User } from '@/lib/models/Schema';
import ProductCard from '@/components/storefront/ProductCard';
import SearchSidebar from '@/components/storefront/SearchSidebar';

export const revalidate = 0; // Dynamic page

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  await dbConnect();

  const q = typeof resolvedParams.q === 'string' ? resolvedParams.q : '';
  const category = typeof resolvedParams.category === 'string' ? resolvedParams.category : '';
  const minPrice = typeof resolvedParams.minPrice === 'string' ? Number(resolvedParams.minPrice) : null;
  const maxPrice = typeof resolvedParams.maxPrice === 'string' ? Number(resolvedParams.maxPrice) : null;
  const sort = typeof resolvedParams.sort === 'string' ? resolvedParams.sort : '';
  const condition = typeof resolvedParams.condition === 'string' ? resolvedParams.condition : '';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const query: any = { status: 'PUBLISHED' };

  if (q) {
    query.$text = { $search: q };
  }
  
  if (category) {
    query.categoryId = category;
  }
  
  if (condition) {
    query.condition = condition;
  }

  if (minPrice !== null || maxPrice !== null) {
    query.retailPrice = {};
    if (minPrice !== null && !isNaN(minPrice)) query.retailPrice.$gte = minPrice;
    if (maxPrice !== null && !isNaN(maxPrice)) query.retailPrice.$lte = maxPrice;
    if (Object.keys(query.retailPrice).length === 0) {
      delete query.retailPrice;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sortOptions: any = {};
  if (sort === 'price_asc') {
    sortOptions.retailPrice = 1;
  } else if (sort === 'price_desc') {
    sortOptions.retailPrice = -1;
  } else if (q) {
    // If text search, sort by text score relevance
    sortOptions.score = { $meta: 'textScore' };
  } else {
    // Default sort by newest
    sortOptions.createdAt = -1;
  }

  let dbQuery = Product.find(query).select('-cost');
  
  if (q) {
    dbQuery = dbQuery.select({ score: { $meta: 'textScore' } });
  }

  const productsRaw = await dbQuery.sort(sortOptions).lean();
  
  const userRaw = await User.findById('000000000000000000000000').select('wishlist').lean();
  const wishlist = userRaw ? JSON.parse(JSON.stringify(userRaw.wishlist)) : [];

  const serializedProducts = JSON.parse(JSON.stringify(productsRaw));

  const categoriesRaw = await Category.find().lean();
  const serializedCategories = JSON.parse(JSON.stringify(categoriesRaw));

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-[#0f172a] mb-8 tracking-tight">
          Search Results {q && `for "${q}"`}
        </h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <SearchSidebar categories={serializedCategories} />
          
          {/* Results */}
          <div className="flex-1">
            {serializedProducts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold text-slate-700">No products found.</h2>
                <p className="text-slate-500 mt-2">Try adjusting your search or filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {serializedProducts.map((product: any) => (
                  <ProductCard 
                    key={product._id} 
                    product={product} 
                    isWishlisted={wishlist.some((id: { toString: () => string }) => id.toString() === product._id.toString())}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
