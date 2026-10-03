'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { formatPrice } from '@/store/currencyStore'; // Assuming default currency is USD for admin

import { motion } from 'framer-motion';

interface Metrics {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
}

interface DailyRevenue {
  date: string;
  revenue: number;
}

interface SalesByCategory {
  name: string;
  value: number;
}

interface TopProduct {
  name: string;
  totalSold: number;
  totalRevenue: number;
}

interface AnalyticsDashboardProps {
  data: {
    metrics: Metrics;
    dailyRevenue: DailyRevenue[];
    salesByCategory: SalesByCategory[];
    topProducts: TopProduct[];
  };
}

const COLORS = ['#ef4444', '#dc2626', '#b91c1c', '#991b1b', '#7f1d1d', '#f87171'];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
};

export default function AnalyticsDashboard({ data }: AnalyticsDashboardProps) {
  const { metrics, dailyRevenue, salesByCategory, topProducts } = data;

  const formatYAxis = (value: number) => {
    return `$${(value / 1000).toFixed(1)}k`;
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  };

  return (
    <motion.div 
      className="space-y-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          variants={item}
          whileHover={{ scale: 1.05, rotateX: 5, rotateY: -5, zIndex: 10 }}
          style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
          className="bg-[#18181b] rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.4)] p-6 border border-gray-800 border-l-4 border-l-red-600 transition-shadow hover:shadow-[0_20px_50px_rgba(220,38,38,0.3)] cursor-pointer"
        >
          <div style={{ transform: 'translateZ(30px)' }}>
            <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2">Total Revenue (All Time)</h3>
            <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400">{formatPrice(metrics.totalRevenue, 'USD')}</p>
          </div>
        </motion.div>
        
        <motion.div 
          variants={item}
          whileHover={{ scale: 1.05, rotateX: 5, rotateY: 0, zIndex: 10 }}
          style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
          className="bg-[#18181b] rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.4)] p-6 border border-gray-800 border-l-4 border-l-red-700 transition-shadow hover:shadow-[0_20px_50px_rgba(220,38,38,0.3)] cursor-pointer"
        >
          <div style={{ transform: 'translateZ(30px)' }}>
            <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2">Total Orders (All Time)</h3>
            <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400">{metrics.totalOrders}</p>
          </div>
        </motion.div>

        <motion.div 
          variants={item}
          whileHover={{ scale: 1.05, rotateX: 5, rotateY: 5, zIndex: 10 }}
          style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
          className="bg-[#18181b] rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.4)] p-6 border border-gray-800 border-l-4 border-l-red-800 transition-shadow hover:shadow-[0_20px_50px_rgba(220,38,38,0.3)] cursor-pointer"
        >
          <div style={{ transform: 'translateZ(30px)' }}>
            <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2">Avg Order Value</h3>
            <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400">{formatPrice(metrics.averageOrderValue, 'USD')}</p>
          </div>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart */}
        <motion.div 
          variants={item}
          whileHover={{ scale: 1.02, zIndex: 10 }}
          className="lg:col-span-2 bg-[#18181b] rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-gray-800 p-6 transition-shadow hover:shadow-[0_20px_50px_rgba(220,38,38,0.2)]"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Daily Revenue (All Time)</h3>
            <div className="h-2 w-2 rounded-full bg-red-600 animate-pulse"></div>
          </div>
          <div className="h-80 w-full relative">
            <div className="absolute inset-0 bg-gradient-to-b from-red-600/5 to-transparent pointer-events-none rounded-xl" />
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyRevenue} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatDate}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#71717a', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  tickFormatter={formatYAxis} 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#71717a', fontSize: 12 }}
                  dx={-10}
                />
                <Tooltip 
                  formatter={(value: unknown) => [formatPrice(Number(value) || 0, 'USD'), 'Revenue']}
                  labelFormatter={(label: unknown) => new Date(label as string | number).toLocaleDateString()}
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: '1px solid #3f3f46', 
                    backgroundColor: 'rgba(9, 9, 11, 0.9)', 
                    backdropFilter: 'blur(8px)',
                    color: '#fff', 
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 15px rgba(220, 38, 38, 0.2)' 
                  }}
                  itemStyle={{ color: '#ef4444', fontWeight: 'bold' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#ef4444" 
                  strokeWidth={4}
                  dot={{ r: 0 }}
                  activeDot={{ r: 8, fill: '#ef4444', stroke: '#18181b', strokeWidth: 3 }}
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Pie Chart */}
        <motion.div 
          variants={item}
          whileHover={{ scale: 1.02, zIndex: 10 }}
          className="bg-[#18181b] rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-gray-800 p-6 transition-shadow hover:shadow-[0_20px_50px_rgba(220,38,38,0.2)]"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Sales by Category</h3>
          </div>
          <div className="h-80 w-full relative">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-32 h-32 bg-red-600/10 rounded-full blur-2xl"></div>
            </div>
            {salesByCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={salesByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="#18181b"
                    strokeWidth={3}
                    animationDuration={1500}
                  >
                    {salesByCategory.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                        style={{ filter: `drop-shadow(0px 0px 4px ${COLORS[index % COLORS.length]}80)` }}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: unknown) => formatPrice(Number(value) || 0, 'USD')}
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: '1px solid #3f3f46', 
                      backgroundColor: 'rgba(9, 9, 11, 0.9)', 
                      backdropFilter: 'blur(8px)',
                      color: '#fff', 
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)' 
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle" 
                    wrapperStyle={{ color: '#a1a1aa', fontSize: '12px' }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                No category data available
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Top Products Row */}
      <motion.div 
        variants={item}
        whileHover={{ scale: 1.01, zIndex: 10 }}
        className="bg-[#18181b] rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-gray-800 p-6 transition-shadow hover:shadow-[0_20px_50px_rgba(220,38,38,0.2)]"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">Most Selling Products</h3>
        </div>
        
        {topProducts && topProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="text-xs text-gray-500 uppercase bg-[#18181b] border-b border-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 font-semibold text-white">Product Name</th>
                  <th scope="col" className="px-6 py-3 font-semibold text-white">Total Sold</th>
                  <th scope="col" className="px-6 py-3 font-semibold text-white">Total Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product, index) => (
                  <tr key={index} className="border-b border-gray-800/50 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{product.name}</td>
                    <td className="px-6 py-4">{product.totalSold} units</td>
                    <td className="px-6 py-4 text-emerald-400 font-semibold">{formatPrice(product.totalRevenue, 'USD')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500">
            No sales data available yet
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
