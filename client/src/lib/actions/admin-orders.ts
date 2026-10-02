'use server';

import connectDB from '@/lib/mongoose';
import { Order, User } from '@/lib/models/Schema';
import { revalidatePath } from 'next/cache';
import { sendEmail } from '@/lib/email';
import ShippingUpdateEmail from '@/emails/ShippingUpdateEmail';
import * as React from 'react';

// Mock auth check until NextAuth is implemented
const isAdmin = async () => {
  // Hardcoded mock check
  return true;
};

export async function updateOrderStatus(
  orderId: string,
  status: string,
  trackingNumber?: string,
  carrier?: string
) {
  try {
    if (!(await isAdmin())) {
      throw new Error('Unauthorized: Admin access required');
    }

    await connectDB();

    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    const previousStatus = order.status;

    order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (carrier) order.carrier = carrier;

    await order.save();

    // Trigger Shipping Update Email if status changed to Shipped
    if (status === 'Shipped' && previousStatus !== 'Shipped') {
      let emailAddress = 'customer@example.com';
      if (order.userId) {
        const user = await User.findById(order.userId);
        if (user && user.email) {
          emailAddress = user.email;
        }
      }

      // Default tracking URL logic for demo purposes
      let trackingUrl = `https://directcrest.com/tracking/${order.trackingNumber}`;
      if (order.carrier?.toLowerCase() === 'fedex') {
        trackingUrl = `https://www.fedex.com/fedextrack/?trknbr=${order.trackingNumber}`;
      } else if (order.carrier?.toLowerCase() === 'ups') {
        trackingUrl = `https://www.ups.com/track?tracknum=${order.trackingNumber}`;
      } else if (order.carrier?.toLowerCase() === 'usps') {
        trackingUrl = `https://tools.usps.com/go/TrackConfirmAction?tLabels=${order.trackingNumber}`;
      }

      await sendEmail({
        to: emailAddress,
        subject: 'Your Order has Shipped - DirectCrest',
        react: React.createElement(ShippingUpdateEmail, {
          orderId: order._id.toString(),
          trackingNumber: order.trackingNumber || 'N/A',
          trackingUrl,
        }),
      });
    }

    revalidatePath('/admin/orders');
    
    return { success: true };
  } catch (error: unknown) {
    console.error('Error updating order:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update order';
    return { success: false, error: errorMessage };
  }
}
