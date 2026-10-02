import { getOrders } from '@/actions/order';
import OrderStatusSelect from './OrderStatusSelect';
import { Link } from '@/i18n/routing';

export default async function AdminOrdersPage() {
  const result = await getOrders();
  const orders = result.success ? result.orders : [];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white">Orders CMS</h1>
        <p className="text-gray-400 mt-2">Track shipments, manage statuses, and view invoices.</p>
      </div>

      <div className="bg-[#18181b] rounded-2xl shadow-lg shadow-black overflow-x-auto border border-red-950">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-800 bg-red-950/20">
              <th className="p-4 font-semibold text-gray-300">Order ID</th>
              <th className="p-4 font-semibold text-gray-300">Customer</th>
              <th className="p-4 font-semibold text-gray-300">Date</th>
              <th className="p-4 font-semibold text-gray-300">Total</th>
              <th className="p-4 font-semibold text-gray-300">Status</th>
              <th className="p-4 font-semibold text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-400">
            {orders.map((ord: any) => (
              <tr key={ord._id} className="border-b border-gray-800 hover:bg-gray-900 transition-colors">
                <td className="p-4 font-mono text-gray-100">{ord._id.slice(-6)}</td>
                <td className="p-4 font-medium">
                  {ord.userId?.firstName || ord.shippingAddress?.name || 'Guest'} 
                  <br/>
                  <span className="text-sm text-gray-400">{ord.userId?.email || ord.shippingAddress?.email || 'N/A'}</span>
                </td>
                <td className="p-4">{new Date(ord.createdAt).toLocaleString()}</td>
                <td className="p-4 font-bold text-red-500">৳{ord.total?.toFixed(2)}</td>
                <td className="p-4">
                  <OrderStatusSelect orderId={ord._id} currentStatus={ord.status} />
                </td>
                <td className="p-4 flex space-x-4">
                  <button className="text-gray-400 hover:text-white transition-colors">View Details</button>
                  <Link href={`/admin/orders/${ord._id}/invoice` as any} target="_blank" className="text-red-500 hover:text-red-400 transition-colors">Invoice</Link>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">No orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
