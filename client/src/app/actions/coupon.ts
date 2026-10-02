'use server';

import dbConnect from '@/lib/mongoose';
import { Coupon } from '@/lib/models/Schema';

export async function validateCouponAction(code: string, subtotal: number) {
  try {
    await dbConnect();
    const coupon = await Coupon.findOne({ code: code.toUpperCase() }).lean();
    
    if (!coupon) {
      return { success: false, message: 'Invalid coupon code.' };
    }

    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      return { success: false, message: 'This coupon has expired.' };
    }

    if (coupon.usageLimit && (coupon.usageCount || 0) >= coupon.usageLimit) {
      return { success: false, message: 'This coupon has reached its usage limit.' };
    }

    let discountAmount = 0;
    if (coupon.discountType === 'PERCENTAGE') {
      discountAmount = (subtotal * (coupon.value || 0)) / 100;
    } else {
      discountAmount = coupon.value || 0;
    }

    // Ensure we don't discount more than the subtotal
    discountAmount = Math.min(discountAmount, subtotal);

    return { success: true, discountAmount, code: coupon.code };
  } catch (error) {
    console.error('Error validating coupon:', error);
    return { success: false, message: 'An error occurred while validating the coupon.' };
  }
}
