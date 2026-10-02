'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createVariant } from '@/actions/variant';

export default function VariantForm({ productId }: { productId: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      productId,
      name: formData.get('name'),
      price: Number(formData.get('price')),
      sku: formData.get('sku'),
    };

    const result = await createVariant(data);
    
    if (result.success) {
      router.refresh();
      (e.target as HTMLFormElement).reset();
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-8">
      <h2 className="text-xl font-bold mb-4">Add Variant</h2>
      {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>}
      
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Variant Name</label>
          <input name="name" required className="w-full border p-2 rounded" placeholder="e.g. Red / Large" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">SKU</label>
          <input name="sku" required className="w-full border p-2 rounded" placeholder="SKU-RED-L" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Variant Price ($)</label>
          <input name="price" type="number" step="0.01" required className="w-full border p-2 rounded" />
        </div>
      </div>

      <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
        {loading ? 'Saving...' : 'Add Variant'}
      </button>
    </form>
  );
}
