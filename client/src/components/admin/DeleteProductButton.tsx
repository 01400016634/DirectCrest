'use client';

import { useTransition, useState } from 'react';
import { deleteProduct } from '@/actions/product';

export default function DeleteProductButton({ productId }: { productId: string }) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this product?')) {
      startTransition(async () => {
        try {
          const res = await deleteProduct(productId);
          if (res.success) {
            setStatus('success');
            setTimeout(() => setStatus('idle'), 3000);
          } else {
            setStatus('error');
            setTimeout(() => setStatus('idle'), 3000);
            alert('Failed to delete: ' + res.error);
          }
        } catch (error) {
          setStatus('error');
          setTimeout(() => setStatus('idle'), 3000);
          alert('Failed to delete product.');
        }
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button 
        onClick={handleDelete}
        disabled={isPending}
        className="text-red-500 hover:text-red-400 transition-colors disabled:opacity-50"
      >
        {isPending ? 'Deleting...' : 'Delete'}
      </button>
      {status === 'success' && (
        <span className="text-xs text-green-400 font-bold">Deleted!</span>
      )}
    </div>
  );
}
