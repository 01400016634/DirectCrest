'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { reviewSchema, ReviewFormValues } from '@/lib/actions/reviews.schema';
import { submitReview } from '@/lib/actions/reviews';

interface Review {
  _id: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ProductReviewsProps {
  productId: string;
  initialReviews: Review[];
}

export default function ProductReviews({ productId, initialReviews }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      productId,
      rating: 5,
      comment: '',
    },
  });

  const onSubmit = async (data: ReviewFormValues) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await submitReview(data);
      if (res.success) {
        // Optimistically add the review
        setReviews([
          {
            _id: `optimistic-${reviews.length}`,
            rating: data.rating,
            comment: data.comment,
            createdAt: new Date().toISOString(),
          },
          ...reviews,
        ]);
        reset({ productId, rating: 5, comment: '' });
      } else {
        setError(res.error || 'Failed to submit review');
      }
    } catch {
      setError('An error occurred while submitting the review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-slate-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-[#0f172a] mb-6">Customer Reviews</h2>

      <div className="mb-10">
        <h3 className="text-lg font-semibold text-[#1e3a8a] mb-4">Write a Review</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-2xl">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Rating</label>
            <select
              {...register('rating', { valueAsNumber: true })}
              className="w-full md:w-1/3 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-[#1e3a8a]"
            >
              <option value={5}>5 - Excellent</option>
              <option value={4}>4 - Good</option>
              <option value={3}>3 - Average</option>
              <option value={2}>2 - Poor</option>
              <option value={1}>1 - Terrible</option>
            </select>
            {errors.rating && <p className="text-red-500 text-sm mt-1">{errors.rating.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Review Comment</label>
            <textarea
              {...register('comment')}
              rows={4}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-[#1e3a8a]"
              placeholder="What did you like or dislike about this product?"
            />
            {errors.comment && <p className="text-red-500 text-sm mt-1">{errors.comment.message}</p>}
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-[#1e3a8a] hover:bg-[#172554] text-white font-semibold rounded-lg shadow-md transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-[#1e3a8a] mb-4">
          Reviews ({reviews.length})
        </h3>
        {reviews.length === 0 ? (
          <p className="text-slate-500">No reviews yet. Be the first to review this product!</p>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review._id} className="pb-6 border-b border-slate-100 last:border-0">
                <div className="flex items-center mb-2">
                  <div className="flex">{renderStars(review.rating)}</div>
                  <span className="ml-3 text-sm text-slate-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-slate-700">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
