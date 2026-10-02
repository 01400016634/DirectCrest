'use server';

import dbConnect from '@/lib/mongoose';
import { Order, User, Product, OrderItem } from '@/lib/models/Schema';
import { revalidatePath } from 'next/cache';

export async function getOrders() {
  try {
    await dbConnect();
    // Fetch orders and populate user
    const orders = await Order.find().populate('userId').sort({ createdAt: -1 }).lean();
    
    // Fetch items for each order
    const enrichedOrders = await Promise.all(orders.map(async (order) => {
      const items = await OrderItem.find({ orderId: order._id })
        .populate('productId', 'name images sku')
        .lean();
      return { ...order, items };
    }));
    
    return { success: true, orders: JSON.parse(JSON.stringify(enrichedOrders)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    await dbConnect();
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { returnDocument: 'after' }
    ).lean();
    revalidatePath('/admin/orders');
    revalidatePath('/[locale]/admin/orders', 'page');
    revalidatePath('/account');
    revalidatePath('/[locale]/account', 'page');
    return { success: true, order: JSON.parse(JSON.stringify(order)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function hideOrderFromHistory(orderId: string) {
  try {
    await dbConnect();
    const result = await Order.findByIdAndUpdate(orderId, { userDeleted: true }, { strict: false });
    console.log("hideOrderFromHistory result:", result);
    revalidatePath('/account');
    revalidatePath('/[locale]/account', 'page');
    return { success: true };
  } catch (error: any) {
    console.error("hideOrderFromHistory error:", error);
    return { success: false, error: error.message };
  }
}

export async function hideAllOrdersFromHistory(userId: string) {
  try {
    await dbConnect();
    const result = await Order.updateMany({ userId }, { userDeleted: true }, { strict: false });
    console.log("hideAllOrdersFromHistory result:", result);
    revalidatePath('/account');
    revalidatePath('/[locale]/account', 'page');
    return { success: true };
  } catch (error: any) {
    console.error("hideAllOrdersFromHistory error:", error);
    return { success: false, error: error.message };
  }
}

