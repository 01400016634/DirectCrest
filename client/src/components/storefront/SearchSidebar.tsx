'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function SearchSidebar({ categories }: { categories: any[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [condition, setCondition] = useState(searchParams.get('condition') || '');

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (sort) params.set('sort', sort);
    if (selectedCategory) params.set('category', selectedCategory);
    if (condition) params.set('condition', condition);
    
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="w-full md:w-72 flex-shrink-0 space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <form onSubmit={handleSearch} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-2">Search</label>
          <input 
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Keywords..."
            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] outline-none bg-slate-50"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-900 mb-2">Category</label>
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] outline-none bg-slate-50"
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-900 mb-2">Condition</label>
          <select 
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] outline-none bg-slate-50"
          >
            <option value="">All Conditions</option>
            <option value="NEW">New</option>
            <option value="USED">Used</option>
            <option value="REFURBISHED">Refurbished</option>
            <option value="OPEN_BOX">Open Box</option>
            <option value="PRE_ORDER">Pre-Order</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-900 mb-2">Price Range ($)</label>
          <div className="flex items-center gap-2">
            <input 
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="Min"
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] outline-none bg-slate-50"
            />
            <span className="text-slate-500 font-bold">-</span>
            <input 
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Max"
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] outline-none bg-slate-50"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-900 mb-2">Sort By</label>
          <select 
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] outline-none bg-slate-50"
          >
            <option value="">Newest Arrivals</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>

        <button 
          type="submit"
          className="w-full bg-[#1e3a8a] hover:bg-[#172554] text-white font-bold py-3 rounded-lg shadow-md transition-colors"
        >
          Apply Filters
        </button>
      </form>
    </div>
  );
}
