'use server';

import connectDB from '@/lib/mongoose';
import { User } from '@/lib/models/Schema';
import { revalidatePath } from 'next/cache';

// Mock user ID for now
const MOCK_USER_ID = '000000000000000000000000';

export async function toggleWishlistAction(productId: string) {
  await connectDB();
  
  const user = await User.findById(MOCK_USER_ID);
  
  if (!user) {
    // If mock user doesn't exist, create it for development
    const newUser = new User({
      _id: MOCK_USER_ID,
      email: 'mockuser@example.com',
      firstName: 'Mock',
      lastName: 'User',
      wishlist: [productId]
    });
    await newUser.save();
    revalidatePath('/');
    return { success: true, added: true };
  }

  const wishlist = user.wishlist || [];
  const index = wishlist.findIndex((id: { toString: () => string }) => id.toString() === productId);
  
  let added = false;
  if (index === -1) {
    user.wishlist.push(productId);
    added = true;
  } else {
    user.wishlist.splice(index, 1);
  }
  
  await user.save();
  revalidatePath('/');
  revalidatePath('/wishlist');
  revalidatePath('/search');
  revalidatePath('/category/[slug]');
  revalidatePath('/product/[slug]');
  
  return { success: true, added };
}

export async function getWishlistAction() {
  await connectDB();
  const user = await User.findById(MOCK_USER_ID).lean();
  return user?.wishlist?.map((id: { toString: () => string }) => id.toString()) || [];
}
