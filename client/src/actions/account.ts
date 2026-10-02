'use server';

import connectDB from '@/lib/mongoose';
import { Order, Address, OrderItem, ProductRequest, Quote, User } from '@/lib/models/Schema';

export async function getAccountDataByEmail(email: string) {
  try {
    await connectDB();
    
    let user = await User.findOne({ email }).lean();
    if (!user) {
      // If user hasn't placed an order yet, create them in Mongo
      user = await User.create({ email, firstName: 'User', lastName: '' });
    }

    // Fetch orders for this user
    const orders = await Order.find({ userId: user._id, userDeleted: { $ne: true } })
      .setOptions({ strictQuery: false })
      .sort({ createdAt: -1 })
      .lean();

    // Populate order items manually
    const enrichedOrders = await Promise.all(orders.map(async (order) => {
      const items = await OrderItem.find({ orderId: order._id })
        .populate('productId', 'name images sku')
        .lean();
      return { ...order, items };
    }));

    // Fetch addresses
    const addresses = await Address.find({ userId: user._id }).lean();

    // Fetch Sourcing Requests
    const requests = await ProductRequest.find({ userId: user._id }).sort({ createdAt: -1 }).lean();
    
    const enrichedRequests = await Promise.all(requests.map(async (req: any) => {
      let quote = null;
      if (req.status === 'Quoted') {
        quote = await Quote.findOne({ requestId: req._id }).lean();
      }
      return { ...req, quote };
    }));

    return { 
      success: true, 
      data: JSON.parse(JSON.stringify({ 
        user, 
        orders: enrichedOrders, 
        addresses, 
        requests: enrichedRequests 
      })) 
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
