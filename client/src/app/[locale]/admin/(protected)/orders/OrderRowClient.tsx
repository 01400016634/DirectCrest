'use client';

import React, { useState } from 'react';
import { updateOrderStatus } from '@/lib/actions/admin-orders';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function OrderRowClient({ order }: { order: any }) {
  const [status, setStatus] = useState(order.status || 'Pending');
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || '');
  const [carrier, setCarrier] = useState(order.carrier || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpdate = async () => {
    setIsUpdating(true);
    setMessage('');
    
    try {
      const result = await updateOrderStatus(order._id, status, trackingNumber, carrier);
      if (result.success) {
        setMessage('Updated successfully');
      } else {
        setMessage(result.error || 'Failed to update');
      }
    } catch {
      setMessage('An error occurred');
    } finally {
      setIsUpdating(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
      <td className="p-4 align-top">
        <div className="font-mono text-xs text-slate-500 mb-1">{order._id}</div>
        <div className="text-sm font-medium text-slate-900">
          {new Date(order.createdAt).toLocaleDateString()}
        </div>
        <div className="text-sm font-bold text-[#1e3a8a] mt-2">
          ${order.total?.toFixed(2)}
        </div>
      </td>
      
      <td className="p-4 align-top">
        <div className="text-sm text-slate-700">
          <p className="font-semibold">{order.shippingAddress?.street}</p>
          <p>{order.shippingAddress?.level2}, {order.shippingAddress?.level1}</p>
          <p>{order.shippingAddress?.postalCode}</p>
        </div>
      </td>

      <td className="p-4 align-top">
        <ul className="text-sm text-slate-600 space-y-1">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {order.items?.map((item: any, idx: number) => (
            <li key={idx}>
              <span className="font-semibold text-slate-800">{item.quantity}x</span> {item.name || 'Product'}
            </li>
          ))}
        </ul>
      </td>

      <td className="p-4 align-top">
        <div className="flex flex-col space-y-3">
          <select 
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="p-2 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-[#1e3a8a] outline-none"
          >
            <option value="Pending">Pending</option>
            <option value="PAID">Paid</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
          </select>

          {(status === 'Shipped' || status === 'Delivered' || status === 'Processing') && (
            <>
              <input 
                type="text"
                placeholder="Carrier (e.g. FedEx)"
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                className="p-2 border border-slate-300 rounded text-sm outline-none"
              />
              <input 
                type="text"
                placeholder="Tracking Number"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="p-2 border border-slate-300 rounded text-sm outline-none"
              />
            </>
          )}

          <div className="flex items-center gap-3 mt-2">
            <button
              onClick={handleUpdate}
              disabled={isUpdating}
              className="px-3 py-1.5 bg-[#1e3a8a] text-white text-xs font-bold rounded hover:bg-[#172554] transition-colors disabled:opacity-50"
            >
              {isUpdating ? 'Saving...' : 'Update'}
            </button>
            {message && (
              <span className={`text-xs ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                {message}
              </span>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}
