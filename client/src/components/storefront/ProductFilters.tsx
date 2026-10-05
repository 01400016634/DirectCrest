"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";

const FILTER_CONFIG = {
  brands: {
    title: "Brand",
    options: [
      { label: "Apple", value: "Apple" },
      { label: "Samsung", value: "Samsung" },
      { label: "HP", value: "HP" },
      { label: "JBL", value: "JBL" },
      { label: "Nike", value: "Nike" },
      { label: "Porsche", value: "Porsche" },
      { label: "BMW", value: "BMW" },
    ]
  },
  price: {
    title: "Price Range (BDT)",
    options: [
      { label: "Under ৳1,000", value: "0-1000" },
      { label: "৳1,000 - ৳5,000", value: "1000-5000" },
      { label: "৳5,000 - ৳25,000", value: "5000-25000" },
      { label: "৳25,000 - ৳75,000", value: "25000-75000" },
      { label: "৳75,000 - ৳150,000", value: "75000-150000" },
      { label: "Above ৳150,000", value: "150000-9999999" },
    ]
  },
  condition: {
    title: "Condition",
    options: [
      { label: "New (Single Unit)", value: "NEW" },
      { label: "Used / Refurbished", value: "USED" },
    ]
  },
  tags: {
    title: "Popularity & Features",
    options: [
      { label: "🔥 Top Trending", value: "trending" },
      { label: "⭐ Best Sellers", value: "bestseller" },
      { label: "📦 In-Stock 3D Models", value: "has3d" },
    ]
  }
};

export default function ProductFilters({ categories, activeCategoryId }: { categories: any[], activeCategoryId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    categories: true,
    brands: true,
    price: true,
    condition: true,
    tags: true,
  });

  const toggleExpand = (section: string) => {
    setExpanded(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      params.delete('page'); // Reset pagination on filter change
      return params.toString();
    },
    [searchParams]
  );

  const handleFilterChange = (key: string, value: string) => {
    // For single select filters like category/price, we replace.
    // For multiple, we could toggle. But let's stick to single select for simplicity unless specified.
    // If clicking the same value, deselect it.
    const currentValue = searchParams.get(key);
    const newValue = currentValue === value ? "" : value;
    router.push(`/products?${createQueryString(key, newValue)}`);
  };

  return (
    <div className="space-y-6">
      {/* Categories */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4">
        <div className="flex justify-between items-center cursor-pointer mb-2" onClick={() => toggleExpand('categories')}>
          <h3 className="font-bold text-white uppercase tracking-wider text-sm">Categories</h3>
          {expanded.categories ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
        
        {expanded.categories && (
          <ul className="space-y-2 mt-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
            <li>
              <button 
                onClick={() => handleFilterChange('category', '')}
                className={`text-left w-full transition-colors text-sm font-medium ${!activeCategoryId ? 'text-red-500' : 'text-gray-400 hover:text-white'}`}
              >
                All Products
              </button>
            </li>
            {categories.map((cat: any) => (
              <li key={cat._id}>
                <button 
                  onClick={() => handleFilterChange('category', cat._id)}
                  className={`text-left w-full transition-colors text-sm font-medium ${activeCategoryId === cat._id ? 'text-red-500' : 'text-gray-400 hover:text-white'}`}
                >
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Dynamic Filters */}
      {Object.entries(FILTER_CONFIG).map(([key, config]) => {
        const currentParam = searchParams.get(key);
        return (
          <div key={key} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4">
            <div className="flex justify-between items-center cursor-pointer mb-2" onClick={() => toggleExpand(key)}>
              <h3 className="font-bold text-white uppercase tracking-wider text-sm">{config.title}</h3>
              {expanded[key] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            
            {expanded[key] && (
              <ul className="space-y-2 mt-4">
                {config.options.map(option => {
                  // For tags, we might have multiple tags in the URL separated by comma.
                  // For simplicity, let's treat it as a single select for now or implement comma split.
                  let isSelected = false;
                  if (key === 'tags') {
                    const tags = currentParam?.split(',') || [];
                    isSelected = tags.includes(option.value);
                  } else {
                    isSelected = currentParam === option.value;
                  }

                  return (
                    <li key={option.value}>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-red-500 border-red-500' : 'border-gray-500 group-hover:border-white bg-transparent'}`}>
                          {isSelected && <X size={12} className="text-white" />}
                        </div>
                        <span className={`text-sm font-medium transition-colors ${isSelected ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
                          {option.label}
                        </span>
                        <input 
                          type="checkbox" 
                          className="hidden" 
                          checked={isSelected}
                          onChange={() => {
                            if (['brands', 'price', 'condition', 'tags'].includes(key)) {
                              const values = currentParam ? currentParam.split(',') : [];
                              if (isSelected) {
                                handleFilterChange(key, values.filter(v => v !== option.value).join(','));
                              } else {
                                handleFilterChange(key, [...values, option.value].join(','));
                              }
                            } else {
                              handleFilterChange(key, option.value);
                            }
                          }}
                        />
                      </label>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
