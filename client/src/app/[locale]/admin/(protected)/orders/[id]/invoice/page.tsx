import dbConnect from '@/lib/mongoose';
import { Order, OrderItem, User } from '@/lib/models/Schema';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default async function InvoicePage({ params }: { params: Promise<{ id: string, locale: string }> }) {
  const resolvedParams = await params;
  await dbConnect();
  const order = await Order.findById(resolvedParams.id).populate('userId').lean();
  
  if (!order) {
    return <div className="p-8 text-white">Order not found</div>;
  }

  const items = await OrderItem.find({ orderId: order._id }).populate('productId').lean();
  const customerName = order.userId ? `${order.userId.firstName} ${order.userId.lastName}` : (order.shippingAddress?.name || 'Guest');
  const customerEmail = order.userId?.email || order.shippingAddress?.email || 'N/A';
  const customerPhone = order.shippingAddress?.phone || 'N/A';
  const address = `${order.shippingAddress?.address || ''}, ${order.shippingAddress?.city || ''}`;

  return (
    <div className="min-h-screen bg-white text-black p-8 sm:p-12 lg:p-20 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-end mb-12 border-b-2 border-gray-200 pb-8">
          <div>
            <h1 className="text-4xl font-black text-red-600 mb-2">DirectCrest</h1>
            <p className="text-gray-500 text-sm">123 Commerce Avenue, Dhaka, Bangladesh</p>
            <p className="text-gray-500 text-sm">support@directcrest.com | +880 1700 000000</p>
          </div>
          <div className="text-right">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">INVOICE</h2>
            <p className="text-gray-600 font-mono font-medium">#{order.trackingNumber || order._id.toString().slice(-6)}</p>
            <p className="text-gray-500 mt-1">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-12">
          <div>
            <h3 className="text-gray-400 font-bold text-xs uppercase tracking-wider mb-3">Bill To</h3>
            <p className="font-bold text-gray-800 text-lg">{customerName}</p>
            <p className="text-gray-600">{customerEmail}</p>
            <p className="text-gray-600">{customerPhone}</p>
          </div>
          <div className="text-right">
            <h3 className="text-gray-400 font-bold text-xs uppercase tracking-wider mb-3">Ship To</h3>
            <p className="text-gray-600">{customerName}</p>
            <p className="text-gray-600 max-w-xs ml-auto leading-relaxed">{address}</p>
          </div>
        </div>

        <table className="w-full mb-12">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-3 px-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider rounded-l-lg">Item</th>
              <th className="py-3 px-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Qty</th>
              <th className="py-3 px-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
              <th className="py-3 px-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider rounded-r-lg">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((item: any, i) => (
              <tr key={i}>
                <td className="py-4 px-4">
                  <p className="font-bold text-gray-800">{item.productId?.name || 'Unknown Product'}</p>
                  {item.variantId && <p className="text-xs text-gray-500 mt-1">Variant: {item.variantId}</p>}
                </td>
                <td className="py-4 px-4 text-center text-gray-600 font-medium">{item.quantity}</td>
                <td className="py-4 px-4 text-right text-gray-600 font-medium">৳{item.priceSnapshot?.toFixed(2)}</td>
                <td className="py-4 px-4 text-right text-gray-800 font-bold">৳{(item.priceSnapshot * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="w-1/2 ml-auto mb-16">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600 font-medium">Subtotal</span>
            <span className="text-gray-800 font-bold">৳{order.total?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-4">
            <span className="text-xl font-bold text-gray-800">Total</span>
            <span className="text-2xl font-black text-red-600">৳{order.total?.toFixed(2)}</span>
          </div>
        </div>

        <div className="border-t-2 border-gray-100 pt-8 mt-16 text-center text-gray-400 text-sm">
          <p>Thank you for shopping with DirectCrest!</p>
          <p className="mt-1">Returns are accepted within 7 days of delivery with original packaging.</p>
        </div>
      </div>
    </div>
  );
}
