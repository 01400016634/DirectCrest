'use client';

import { useTransition } from 'react';
import { updateUserRole, banUser } from '@/actions/user';

export default function UserActions({ userId, currentRole }: { userId: string, currentRole: string }) {
  const [isPending, startTransition] = useTransition();

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value;
    startTransition(async () => {
      const res = await updateUserRole(userId, newRole);
      if (res.success) {
        alert('Role updated successfully');
      } else {
        alert('Failed to update role: ' + res.error);
      }
    });
  };

  const handleBan = () => {
    if (confirm('Are you sure you want to ban this user?')) {
      startTransition(async () => {
        const res = await banUser(userId);
        if (res.success) {
          alert('User banned');
        } else {
          alert('Failed to ban user: ' + res.error);
        }
      });
    }
  };

  return (
    <div className="flex space-x-4 items-center">
      <select 
        value={currentRole} 
        onChange={handleRoleChange} 
        disabled={isPending}
        className="bg-gray-800 text-white text-xs px-2 py-1 rounded border border-gray-700 disabled:opacity-50"
      >
        <option value="USER">USER</option>
        <option value="WHOLESALE">WHOLESALE</option>
        <option value="ADMIN">ADMIN</option>
        <option value="BANNED">BANNED</option>
      </select>
      <button 
        onClick={handleBan}
        disabled={isPending || currentRole === 'BANNED'}
        className="text-red-500 hover:text-red-400 transition-colors disabled:opacity-50 text-sm font-semibold"
      >
        {currentRole === 'BANNED' ? 'Banned' : 'Ban'}
      </button>
    </div>
  );
}
