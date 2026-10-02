'use server';

import connectDB from '@/lib/mongoose';
import { Review, Product } from '@/lib/models/Schema';
import { ReviewFormValues } from './reviews.schema';

export async function submitReview(data: ReviewFormValues, userId?: string) {
  try {
    await connectDB();
    
    // Mock user ID if not provided, assuming NextAuth is WIP
    const authorId = userId || '000000000000000000000000';
    
    // Check if user actually purchased the item
    // In a real app we'd look for a completed OrderItem for this user/product
    // We will bypass a strict error for the demo but theoretically it works like this:
    // const orders = await Order.find({ userId: authorId });
    // const orderIds = orders.map(o => o._id);
    // const purchase = await OrderItem.findOne({ orderId: { $in: orderIds }, productId: data.productId });
    // if (!purchase) throw new Error("You must purchase this product to review it.");

    // Create review
    const newReview = new Review({
      productId: data.productId,
      userId: authorId,
      rating: data.rating,
      comment: data.comment,
    });

    await newReview.save();

    // Recalculate average rating
    const allReviews = await Review.find({ productId: data.productId });
    const numReviews = allReviews.length;
    const avgRating = allReviews.reduce((acc, rev) => acc + rev.rating, 0) / numReviews;

    // Update Product
    await Product.findByIdAndUpdate(data.productId, {
      rating: avgRating,
      numReviews: numReviews,
    });

    return { success: true };
  } catch (error: unknown) {
    console.error('Error submitting review:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to submit review';
    return { success: false, error: errorMessage };
  }
}

export async function getProductReviews(productId: string) {
  try {
    await connectDB();
    const reviews = await Review.find({ productId }).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(reviews)); // Serialize for client
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
}
