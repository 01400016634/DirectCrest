import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard';
import { Filter, Search, X } from 'lucide-react';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Filter States
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [condition, setCondition] = useState(searchParams.get('condition') || '');
  const [minRating, setMinRating] = useState(searchParams.get('minRating') || '');
  const [inStock, setInStock] = useState(searchParams.get('inStock') === 'true');
  const [hasWholesale, setHasWholesale] = useState(searchParams.get('hasWholesale') === 'true');
  const [sort, setSort] = useState(searchParams.get('sort') || (searchParams.get('search') ? 'relevance' : 'newest'));

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams(searchParams.toString());
        query.set('status', 'PUBLISHED');
        query.set('page', page.toString());
        if (!query.has('sort')) query.set('sort', sort);
        
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/products?${query.toString()}`);
        const data = await response.json();
        if (response.ok) {
          setProducts(data.products || []);
          setTotalPages(data.totalPages || 1);
        }
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams, page, sort]);

  const applyFilters = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const newParams = new URLSearchParams();
    if (search) newParams.set('search', search);
    if (minPrice) newParams.set('minPrice', minPrice);
    if (maxPrice) newParams.set('maxPrice', maxPrice);
    if (condition) newParams.set('condition', condition);
    if (minRating) newParams.set('minRating', minRating);
    if (inStock) newParams.set('inStock', 'true');
    if (hasWholesale) newParams.set('hasWholesale', 'true');
    newParams.set('sort', sort);
    
    setPage(1);
    setSearchParams(newParams);
    setShowFilters(false);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) setPage(newPage);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-navy-900 tracking-tight">
              {searchParams.get('search') ? `Search Results` : 'Shop All'}
            </h1>
            <p className="mt-2 text-slate-500">Discover premium goods sourced directly for you.</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex md:hidden items-center space-x-2 border px-4 py-2 rounded-lg text-sm font-medium transition-colors ${showFilters ? 'bg-navy-900 text-white border-navy-900' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
            
            <select 
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                const p = new URLSearchParams(searchParams);
                p.set('sort', e.target.value);
                setSearchParams(p);
                setPage(1);
              }}
              className="bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {searchParams.get('search') && <option value="relevance">Relevance</option>}
              <option value="newest">Newest</option>
              <option value="popular">Popular</option>
              <option value="rating_desc">Top Rated</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <div className={`md:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <form onSubmit={applyFilters} className="bg-white p-6 rounded-2xl border border-slate-100 sticky top-24">
              <div className="flex justify-between items-center mb-6 md:hidden">
                <h3 className="font-bold text-navy-900">Filters</h3>
                <button type="button" onClick={() => setShowFilters(false)}><X className="w-5 h-5 text-slate-400" /></button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Keywords..."
                      className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Price Range</label>
                  <div className="flex items-center space-x-2">
                    <input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
                    <span className="text-slate-400">-</span>
                    <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Condition</label>
                  <select value={condition} onChange={(e) => setCondition(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500">
                    <option value="">Any Condition</option>
                    <option value="NEW">New</option>
                    <option value="USED">Used</option>
                    <option value="REFURBISHED">Refurbished</option>
                    <option value="OPEN_BOX">Open Box</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Minimum Rating</label>
                  <select value={minRating} onChange={(e) => setMinRating(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500">
                    <option value="">Any Rating</option>
                    <option value="4">4+ Stars</option>
                    <option value="3">3+ Stars</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500" />
                    <span className="text-sm text-slate-700">In Stock Only</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input type="checkbox" checked={hasWholesale} onChange={(e) => setHasWholesale(e.target.checked)} className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500" />
                    <span className="text-sm text-slate-700">Wholesale Available</span>
                  </label>
                </div>

                <button type="submit" className="w-full bg-navy-900 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors">
                  Apply Filters
                </button>
              </div>
            </form>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-900"></div>
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map(product => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center items-center space-x-2">
                    <button 
                      onClick={() => handlePageChange(page - 1)} 
                      disabled={page === 1}
                      className="px-4 py-2 border border-slate-200 rounded-lg bg-white text-sm font-medium hover:bg-slate-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <span className="text-sm font-medium text-slate-700">
                      Page {page} of {totalPages}
                    </span>
                    <button 
                      onClick={() => handlePageChange(page + 1)} 
                      disabled={page === totalPages}
                      className="px-4 py-2 border border-slate-200 rounded-lg bg-white text-sm font-medium hover:bg-slate-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-24 bg-white rounded-2xl border border-slate-100">
                <h3 className="text-lg font-medium text-navy-900">No products found</h3>
                <p className="mt-1 text-slate-500">Try adjusting your search or filters.</p>
                <button onClick={() => {
                  setSearch(''); setMinPrice(''); setMaxPrice(''); setCondition(''); setMinRating(''); setInStock(false); setHasWholesale(false); setSort('newest');
                  setSearchParams(new URLSearchParams());
                }} className="mt-4 text-blue-600 text-sm font-medium hover:underline">
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
