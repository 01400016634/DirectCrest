'use server';

import dbConnect from '@/lib/mongoose';
import { Order, OrderItem, Product, Shipment, TrackingEvent } from '@/lib/models/Schema';
import { z } from 'zod';
import mongoose from 'mongoose';

const trackOrderSchema = z.object({
  orderId: z.string().trim(),
  contact: z.string().trim().toLowerCase().transform(val => val.replace(/[-\s()]/g, '')),
});

export async function trackOrderAction(formData: FormData) {
  try {
    await dbConnect();
    
    const validatedData = trackOrderSchema.parse({
      orderId: formData.get('orderId'),
      contact: formData.get('contact'),
    });

    const { orderId, contact } = validatedData;
    
    // Check if orderId is a valid ObjectId, if not it might be a custom string format
    let query: any = {};
    if (mongoose.Types.ObjectId.isValid(orderId)) {
      query._id = orderId;
    } else {
      query.trackingNumber = orderId;
    }

    const order = await Order.findOne({
      ...query,
      $or: [
        { 'shippingAddress.email': contact },
        { 'shippingAddress.phone': contact }
      ]
    }).lean();

    if (!order) {
      return { success: false, error: "We couldn't find an order matching those details. Please check your Order ID and try again." };
    }

    // Fetch items for the manifest
    const items = await OrderItem.find({ orderId: order._id }).populate({ path: 'productId', model: Product }).lean();

    // Fetch shipment and tracking events
    const shipment = await Shipment.findOne({ orderId: order._id }).lean();
    let trackingEvents = [];
    if (shipment) {
      trackingEvents = await TrackingEvent.find({ shipmentId: shipment._id }).sort({ createdAt: 1 }).lean();
    }

    return { 
      success: true, 
      order: JSON.parse(JSON.stringify(order)),
      items: JSON.parse(JSON.stringify(items)),
      shipment: shipment ? JSON.parse(JSON.stringify(shipment)) : null,
      trackingEvents: JSON.parse(JSON.stringify(trackingEvents))
    };
  } catch (error) {
    console.error('Track order error:', error);
    return { success: false, error: 'An unexpected error occurred. Please try again.' };
  }
}
