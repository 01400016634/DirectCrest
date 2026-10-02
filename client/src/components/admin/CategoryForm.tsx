/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createCategory } from '@/actions/category';

export default function CategoryForm({ categories = [] }: { categories?: any[] }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      parentId: formData.get('parentId') || undefined,
    };

    const result = await createCategory(data);
    
    if (result.success) {
      router.refresh(); // Refresh to see the new category in the list
      (e.target as HTMLFormElement).reset(); // Clear form
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#18181b] p-8 rounded-2xl shadow-lg shadow-red-900/10 max-w-4xl border border-red-950 mb-8">
      <h2 className="text-xl font-extrabold text-white mb-6">Add New Category</h2>
      {error && <div className="bg-red-950/50 text-red-400 p-4 mb-6 rounded-xl border border-red-900">{error}</div>}
      
      <div className="flex gap-6 mb-6">
        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-300 mb-2">Name</label>
          <input name="name" required className="w-full bg-[#0a0a0c] border border-gray-800 text-gray-100 p-3 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all" placeholder="Category Name" />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-300 mb-2">Parent Category (Optional)</label>
          <select name="parentId" className="w-full bg-[#0a0a0c] border border-gray-800 text-gray-100 p-3 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all">
            <option value="">-- None (Top Level) --</option>
            {categories.map((c: any) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <button type="submit" disabled={loading} className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg shadow-red-900/50 transition-all font-bold">
        {loading ? 'Saving...' : 'Add Category'}
      </button>
    </form>
  );
}
