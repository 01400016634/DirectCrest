'use client';

import { useOptimistic, useTransition, useState } from 'react';
import { Heart } from 'lucide-react';
import { toggleWishlistAction } from '@/app/actions/wishlist';

interface WishlistToggleProps {
  productId: string;
  initialIsWishlisted: boolean;
  className?: string;
  iconClassName?: string;
}

export default function WishlistToggle({ 
  productId, 
  initialIsWishlisted, 
  className = "p-2 bg-white rounded-full shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors z-10",
  iconClassName = "w-5 h-5"
}: WishlistToggleProps) {
  const [isPending, startTransition] = useTransition();
  const [isWishlisted, setIsWishlisted] = useState(initialIsWishlisted);
  const [optimisticWishlisted, addOptimisticWishlisted] = useOptimistic(
    isWishlisted,
    (state, newState: boolean) => newState
  );

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    startTransition(async () => {
      addOptimisticWishlisted(!optimisticWishlisted);
      try {
        const result = await toggleWishlistAction(productId);
        setIsWishlisted(result.added);
      } catch {
        // Handle error implicitly by reverting optimistic state on next render
      }
    });
  };

  return (
    <button 
      onClick={handleToggle}
      className={className}
      disabled={isPending}
      aria-label={optimisticWishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart 
        className={`${iconClassName} transition-colors ${optimisticWishlisted ? 'fill-red-500 text-red-500' : 'text-slate-400 hover:text-red-500'}`} 
      />
    </button>
  );
}
