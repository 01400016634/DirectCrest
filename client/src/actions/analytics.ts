'use server';

import dbConnect from '../lib/mongoose';
import { Order } from '../lib/models/Schema';

// Need to check auth for admin access
const checkAdmin = async () => {
  return true;
};

export async function getDashboardAnalytics() {
  try {
    await checkAdmin();
    await dbConnect();

    // 1. Core Metrics (Total Revenue, Total Orders, AOV)
    const metricsPipeline = await Order.aggregate([
      {
        $match: {
          status: { $in: ['PAID', 'Processing', 'Shipped', 'Delivered'] } // Only count paid/valid orders
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$total' },
          totalOrders: { $sum: 1 },
        }
      },
      {
        $project: {
          _id: 0,
          totalRevenue: 1,
          totalOrders: 1,
          averageOrderValue: { 
            $cond: [ { $eq: ['$totalOrders', 0] }, 0, { $divide: ['$totalRevenue', '$totalOrders'] } ] 
          }
        }
      }
    ]);

    const metrics = metricsPipeline[0] || { totalRevenue: 0, totalOrders: 0, averageOrderValue: 0 };

    // 2. Daily Revenue (Line Chart)
    const dailyRevenuePipeline = await Order.aggregate([
      {
        $match: {
          status: { $in: ['PAID', 'Processing', 'Shipped', 'Delivered'] }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          revenue: { $sum: '$total' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      },
      {
        $project: {
          _id: 0,
          date: {
            $concat: [
              { $toString: '$_id.year' }, '-',
              { $cond: [{ $lt: ['$_id.month', 10] }, { $concat: ['0', { $toString: '$_id.month' }] }, { $toString: '$_id.month' }] }, '-',
              { $cond: [{ $lt: ['$_id.day', 10] }, { $concat: ['0', { $toString: '$_id.day' }] }, { $toString: '$_id.day' }] }
            ]
          },
          revenue: 1
        }
      }
    ]);

    // Fill in missing dates from the first order to today
    const dailyRevenueMap = new Map(dailyRevenuePipeline.map(item => [item.date, item.revenue]));
    const dailyRevenue = [];
    
    if (dailyRevenuePipeline.length > 0) {
      const firstDate = new Date(dailyRevenuePipeline[0].date);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - firstDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      for (let i = diffDays; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        dailyRevenue.push({
          date: dateStr,
          revenue: dailyRevenueMap.get(dateStr) || 0
        });
      }
    } else {
      // If no orders, just show today
      const dateStr = new Date().toISOString().split('T')[0];
      dailyRevenue.push({ date: dateStr, revenue: 0 });
    }

    // 3. Sales by Category (Pie Chart)
    const salesByCategoryPipeline = await Order.aggregate([
      {
        $match: {
          status: { $in: ['PAID', 'Processing', 'Shipped', 'Delivered'] }
        }
      },
      {
        $lookup: {
          from: 'orderitems',
          localField: '_id',
          foreignField: 'orderId',
          as: 'items'
        }
      },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.productId',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $lookup: {
          from: 'categories',
          localField: 'product.categoryId',
          foreignField: '_id',
          as: 'category'
        }
      },
      { $unwind: '$category' },
      {
        $group: {
          _id: '$category.name',
          sales: { $sum: { $multiply: ['$items.quantity', '$items.priceSnapshot'] } }
        }
      },
      {
        $project: {
          _id: 0,
          name: '$_id',
          value: '$sales'
        }
      }
    ]);

    // 4. Most Selling Products
    const topProductsPipeline = await Order.aggregate([
      {
        $match: {
          status: { $in: ['PAID', 'Processing', 'Shipped', 'Delivered'] }
        }
      },
      {
        $lookup: {
          from: 'orderitems',
          localField: '_id',
          foreignField: 'orderId',
          as: 'items'
        }
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId',
          totalSold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.priceSnapshot'] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $project: {
          _id: 0,
          name: '$product.name',
          totalSold: 1,
          totalRevenue: 1
        }
      }
    ]);

    return {
      success: true,
      data: {
        metrics,
        dailyRevenue,
        salesByCategory: salesByCategoryPipeline,
        topProducts: topProductsPipeline
      }
    };
  } catch (error) {
    console.error('Analytics Error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown Error' };
  }
}
