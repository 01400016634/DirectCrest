import dbConnect from '@/lib/mongoose';
import { Product, Category } from '@/lib/models/Schema';
import ProductCard from '@/components/storefront/ProductCard';
import Link from 'next/link';
import { Suspense } from 'react';
import ProductFilters from '@/components/storefront/ProductFilters';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function ProductsPage({
  searchParams,
}: {
  // @ts-ignore
  searchParams: Promise<{ q?: string; category?: string; page?: string; sort?: string; brands?: string; price?: string; condition?: string; tags?: string; }>;
}) {
  const sp = await searchParams;
  const query = sp?.q || '';
  const selectedCategory = sp?.category || '';
  const sortOption = sp?.sort || 'newest';
  const page = parseInt(sp?.page || '1');
  const brands = sp?.brands || '';
  const price = sp?.price || '';
  const condition = sp?.condition || '';
  const tags = sp?.tags || '';

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
    const catsRaw = await Category.find().lean();
    
    // Sort categories according to the canonical order
    const canonicalOrder = [
      'Smartphones & Tablets',
      'Laptops, Wearables & Audio',
      'Cameras & Power Banks',
      'Toys, RC & Die-Cast Vehicles',
      'Footwear',
      'Apparel & Fashion',
      'Bags & Backpacks',
      'Jewelry & Accessories',
      'Medical & Laboratory Equipment',
      'Home, Office & Cosmetics',
    ];
    
    catsRaw.sort((a, b) => {
      const indexA = canonicalOrder.indexOf(a.name);
      const indexB = canonicalOrder.indexOf(b.name);
      // If not found in canonical order, put at the end
      const posA = indexA === -1 ? 999 : indexA;
      const posB = indexB === -1 ? 999 : indexB;
      return posA - posB;
    });

    categories = JSON.parse(JSON.stringify(catsRaw));

    // Normalize category query (it might be a name from the homepage or an ID from the sidebar)
    if (selectedCategory) {
      const decodedCategory = decodeURIComponent(selectedCategory).replace(/\+/g, ' ');
      console.log('Category Query:', selectedCategory, 'Decoded:', decodedCategory);
      const matchedCat = categories.find((c: any) => 
        c._id.toString() === selectedCategory || 
        c.name === selectedCategory ||
        c.name === decodedCategory ||
        c.name.replace(/\s+/g, '') === decodedCategory.replace(/\s+/g, '')
      );
      if (matchedCat) {
        activeCategoryId = matchedCat._id.toString();
        console.log('Matched category ID:', activeCategoryId);
      } else {
        console.log('Failed to match category:', selectedCategory, 'Available:', categories.map((c: any) => c.name));
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const andConditions: any[] = [{ status: 'PUBLISHED' }];
    
    if (query) {
      andConditions.push({ name: { $regex: query, $options: 'i' } });
    }
    
    if (activeCategoryId) {
      andConditions.push({ categoryId: activeCategoryId });
    }

    if (brands) {
      const brandList = brands.split(',').map(b => b.trim()).filter(Boolean);
      if (brandList.length > 0) {
        andConditions.push({ name: { $regex: brandList.join('|'), $options: 'i' } });
      }
    }

    if (price) {
      const priceList = price.split(',');
      const priceOr = priceList.map(p => {
        const [minStr, maxStr] = p.split('-');
        const min = parseInt(minStr) || 0;
        const max = parseInt(maxStr) || 99999999;
        return { retailPrice: { $gte: min, $lte: max } };
      });
      if (priceOr.length > 0) {
        andConditions.push({ $or: priceOr });
      }
    }

    if (condition) {
      const conditionList = condition.split(',').filter(Boolean);
      if (conditionList.length > 0) {
        andConditions.push({ condition: { $in: conditionList } });
      }
    }

    if (tags) {
      const tagList = tags.split(',');
      if (tagList.includes('trending')) {
        andConditions.push({ isTrending: true });
      }
      if (tagList.includes('has3d')) {
        andConditions.push({ threeDModelUrl: { $exists: true, $ne: '' } });
      }
    }

    const filter = andConditions.length > 1 ? { $and: andConditions } : andConditions[0];

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
          <div className="sticky top-24">
            <Suspense fallback={<div className="animate-pulse bg-white/5 h-96 rounded-2xl"></div>}>
              <ProductFilters categories={categories} activeCategoryId={activeCategoryId} />
            </Suspense>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-center bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl">
            <form className="flex items-center gap-2 w-full max-w-md" action="/products">
              {activeCategoryId && <input type="hidden" name="category" value={activeCategoryId} />}
              {sortOption && <input type="hidden" name="sort" value={sortOption} />}
              {brands && <input type="hidden" name="brands" value={brands} />}
              {price && <input type="hidden" name="price" value={price} />}
              {condition && <input type="hidden" name="condition" value={condition} />}
              {tags && <input type="hidden" name="tags" value={tags} />}
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
              {brands && <input type="hidden" name="brands" value={brands} />}
              {price && <input type="hidden" name="price" value={price} />}
              {condition && <input type="hidden" name="condition" value={condition} />}
              {tags && <input type="hidden" name="tags" value={tags} />}
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
              {(query || activeCategoryId || brands || price || condition || tags) && (
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
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const pageParams = new URLSearchParams({
                      page: (i + 1).toString(),
                      ...(query && { q: query }),
                      ...(activeCategoryId && { category: activeCategoryId }),
                      ...(sortOption && { sort: sortOption }),
                      ...(brands && { brands }),
                      ...(price && { price }),
                      ...(condition && { condition }),
                      ...(tags && { tags })
                    });
                    
                    return (
                      <Link 
                        key={i}
                        href={`/products?${pageParams.toString()}`}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold transition-colors ${page === i + 1 ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]' : 'bg-white/5 backdrop-blur-md border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'}`}
                      >
                        {i + 1}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
