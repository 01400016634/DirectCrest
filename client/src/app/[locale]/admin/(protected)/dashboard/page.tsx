import React from 'react';
import { getDashboardAnalytics } from '@/actions/analytics';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';

export const metadata = {
  title: 'Analytics Dashboard | Admin',
};

export default async function AdminDashboardPage() {
  const result = await getDashboardAnalytics();

  if (!result.success || !result.data) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Analytics Dashboard</h1>
        <div className="bg-red-50 text-red-700 p-4 rounded border border-red-200">
          Failed to load analytics: {result.error || 'Unknown error'}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
        <p className="text-gray-400 mt-1">Overview of your store&apos;s performance over the last 30 days.</p>
      </div>
      
      <AnalyticsDashboard data={result.data} />
    </div>
  );
}
