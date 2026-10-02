'use client';

import { useState, useTransition } from 'react';
import { updateOrderStatus } from '@/actions/order';
import { useRouter } from 'next/navigation';

export default function OrderStatusSelect({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    startTransition(async () => {
      await updateOrderStatus(orderId, newStatus);
      router.refresh();
    });
  };

  return (
    <select 
      value={status}
      onChange={handleChange}
      disabled={isPending}
      className={`px-3 py-1.5 rounded-xl text-xs font-bold outline-none cursor-pointer border transition-colors
        ${status === 'Delivered' ? 'bg-green-900/30 text-green-400 border-green-800/50' : 
          status === 'Shipped' ? 'bg-blue-900/30 text-blue-400 border-blue-800/50' : 
          status === 'Processing' ? 'bg-yellow-900/30 text-yellow-500 border-yellow-800/50' : 
          'bg-gray-800 text-gray-400 border-gray-700'}`}
    >
      <option value="Pending" className="bg-[#0a0a0c] text-gray-400">PENDING</option>
      <option value="Processing" className="bg-[#0a0a0c] text-yellow-500">PROCESSING</option>
      <option value="Shipped" className="bg-[#0a0a0c] text-blue-400">SHIPPED</option>
      <option value="Delivered" className="bg-[#0a0a0c] text-green-400">DELIVERED</option>
    </select>
  );
}
