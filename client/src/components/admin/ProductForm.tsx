'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createProduct } from '@/actions/product';

export default function ProductForm() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale || 'en';
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      sku: formData.get('sku'),
      brand: formData.get('brand'),
      category: formData.get('category'),
      description: formData.get('description'),
      retailPrice: Number(formData.get('retailPrice')),
      wholesalePrice: Number(formData.get('wholesalePrice')),
      cost: Number(formData.get('cost')),
      stock: Number(formData.get('stock')),
      condition: formData.get('condition'),
      status: formData.get('status'),
      threeDModelUrl: '' as string | undefined,
    };

    if (file) {
      const uploadData = new FormData();
      uploadData.append('file', file);
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: uploadData,
        });
        if (!res.ok) throw new Error('Failed to upload 3D model');
        const uploadResult = await res.json();
        data.threeDModelUrl = uploadResult.url;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown upload error');
        setLoading(false);
        return;
      }
    } else {
      data.threeDModelUrl = undefined;
    }

    const result = await createProduct(data);
    
    if (result.success) {
      router.push(`/${locale}/admin/products`);
    } else {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#18181b] p-8 rounded-2xl shadow-lg shadow-red-900/10 max-w-4xl border border-red-950">
      {error && <div className="bg-red-950/50 text-red-400 p-4 mb-6 rounded-xl border border-red-900">{error}</div>}
      
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">Name</label>
          <input name="name" required className="w-full bg-[#0a0a0c] border border-gray-800 text-gray-100 p-3 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all" placeholder="e.g. iPhone 15 Pro Max" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">SKU</label>
          <input name="sku" required className="w-full bg-[#0a0a0c] border border-gray-800 text-gray-100 p-3 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all" placeholder="e.g. APPL-IP15PM-256" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">Brand</label>
          <input name="brand" required className="w-full bg-[#0a0a0c] border border-gray-800 text-gray-100 p-3 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all" placeholder="e.g. Apple" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">Category</label>
          <select name="category" required className="w-full bg-[#0a0a0c] border border-gray-800 text-gray-100 p-3 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all">
            <option value="">Select a Category</option>
            <option value="Electronics & Gadgets">Electronics & Gadgets</option>
            <option value="Automotive & Bike Accessories">Automotive & Bike Accessories</option>
            <option value="Fashion & Clothing">Fashion & Clothing</option>
            <option value="Health & Beauty">Health & Beauty</option>
            <option value="production mechine">production mechine</option>
            <option value="Home & Kitchen (Problem-Solving Gadgets)">Home & Kitchen (Problem-Solving Gadgets)</option>
            <option value="Baby & Kids Products">Baby & Kids Products</option>
          </select>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-300 mb-2">Description</label>
        <textarea name="description" required rows={4} className="w-full bg-[#0a0a0c] border border-gray-800 text-gray-100 p-3 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all" placeholder="Detailed product description..."></textarea>
      </div>

      <div className="mb-8 p-6 border-2 border-dashed border-red-900/50 rounded-xl bg-red-950/10">
        <label className="block text-sm font-bold text-red-400 mb-2">📦 3D Model Upload (.glb or .gltf)</label>
        <input 
          type="file" 
          accept=".glb,.gltf" 
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-950 file:text-red-400 hover:file:bg-red-900 transition-all cursor-pointer" 
        />
        <p className="text-xs text-gray-500 mt-2">Upload a 3D model file to enable the interactive 3D viewer for customers.</p>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">Retail Price ($)</label>
          <input name="retailPrice" type="number" step="0.01" required className="w-full bg-[#0a0a0c] border border-gray-800 text-gray-100 p-3 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">Wholesale Price ($)</label>
          <input name="wholesalePrice" type="number" step="0.01" required className="w-full bg-[#0a0a0c] border border-gray-800 text-gray-100 p-3 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all" />
        </div>
        <div className="bg-red-950/30 p-3 rounded-xl border border-red-900/50">
          <label className="block text-sm font-bold mb-2 text-red-500">Supplier Cost ($) - PRIVATE</label>
          <input name="cost" type="number" step="0.01" required className="w-full bg-[#0a0a0c] border border-red-900 text-red-100 p-2 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">Stock</label>
          <input name="stock" type="number" required className="w-full bg-[#0a0a0c] border border-gray-800 text-gray-100 p-3 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">Condition</label>
          <select name="condition" className="w-full bg-[#0a0a0c] border border-gray-800 text-gray-100 p-3 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all">
            <option value="NEW">New</option>
            <option value="USED">Used</option>
            <option value="REFURBISHED">Refurbished</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">Status</label>
          <select name="status" className="w-full bg-[#0a0a0c] border border-gray-800 text-gray-100 p-3 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all">
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4 border-t border-gray-800">
        <button type="button" onClick={() => router.back()} className="px-6 py-3 border border-gray-700 text-gray-300 rounded-xl hover:bg-gray-800 transition-all font-medium">Cancel</button>
        <button type="submit" disabled={loading} className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg shadow-red-900/50 transition-all font-bold">
          {loading ? 'Uploading & Saving...' : 'Save Product'}
        </button>
      </div>
    </form>
  );
}
