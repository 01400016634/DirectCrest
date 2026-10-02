import React from 'react';
import connectDB from '@/lib/mongoose';
import { ProductRequest } from '@/lib/models/Schema';
import QuoteForm from '@/components/admin/QuoteForm';
import { PackageSearch, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin - Sourcing Requests',
};

// Mock auth check until NextAuth is fully implemented
const isAdmin = async () => {
  return true; // Assume admin for now
};

export const revalidate = 0; // Don't cache admin pages

interface ProductRequestType {
  _id: string;
  userId: {
    email: string;
    firstName?: string;
    lastName?: string;
  };
  productTitle: string;
  description: string;
  targetPrice?: number;
  quantity: number;
  imageLink?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default async function AdminSourcingPage() {
  if (!(await isAdmin())) {
    return <div className="p-8 text-red-500">Unauthorized</div>;
  }

  await connectDB();

  // Fetch pending requests
  const pendingRequests = await ProductRequest.find({ status: 'Pending' })
    .populate('userId', 'email firstName lastName')
    .sort({ createdAt: -1 })
    .lean() as unknown as ProductRequestType[];

  // Fetch recently quoted requests
  const quotedRequests = await ProductRequest.find({ status: 'Quoted' })
    .populate('userId', 'email firstName lastName')
    .sort({ updatedAt: -1 })
    .limit(10)
    .lean() as unknown as ProductRequestType[];

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-screen">
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-200">
        <div className="w-12 h-12 bg-[#1e3a8a] text-white rounded-xl flex items-center justify-center">
          <PackageSearch size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Sourcing Requests</h1>
          <p className="text-slate-500 mt-1">Review customer product requests and issue quotes.</p>
        </div>
      </div>

      <div className="space-y-12">
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            Pending Requests ({pendingRequests.length})
          </h2>
          
          {pendingRequests.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
              <p className="text-slate-500">No pending requests.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {pendingRequests.map((req) => (
                <div key={req._id.toString()} className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 overflow-hidden">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="flex-1 space-y-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-xs font-bold px-2 py-1 bg-amber-100 text-amber-800 rounded uppercase tracking-wider">
                            {req.status}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">
                            ID: {req._id.toString().slice(-8)}
                          </span>
                          <span className="text-xs text-slate-400">
                            {new Date(req.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">{req.productTitle}</h3>
                        <p className="text-sm text-slate-600 mt-2">{req.description}</p>
                      </div>

                      <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
                        <div>
                          <span className="text-slate-500 block text-xs">Customer</span>
                          <span className="font-medium text-slate-900">
                            {req.userId?.firstName} {req.userId?.lastName} ({req.userId?.email})
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-xs">Target Qty</span>
                          <span className="font-medium text-slate-900">{req.quantity} units</span>
                        </div>
                        {req.targetPrice && (
                          <div>
                            <span className="text-slate-500 block text-xs">Target Price</span>
                            <span className="font-medium text-slate-900">${req.targetPrice.toFixed(2)}</span>
                          </div>
                        )}
                        {req.imageLink && (
                          <div>
                            <span className="text-slate-500 block text-xs">Reference Image</span>
                            <Link href={req.imageLink} target="_blank" className="font-medium text-blue-600 flex items-center gap-1 hover:underline">
                              View Image <ExternalLink size={14} />
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="w-full md:w-80 flex-shrink-0">
                      <QuoteForm requestId={req._id.toString()} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            Recently Quoted
          </h2>
          
          {quotedRequests.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
              <p className="text-slate-500">No quoted requests yet.</p>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Product</th>
                    <th className="px-6 py-4 font-semibold">Customer</th>
                    <th className="px-6 py-4 font-semibold">Qty</th>
                    <th className="px-6 py-4 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {quotedRequests.map((req) => (
                    <tr key={req._id.toString()} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{req.productTitle}</div>
                        <div className="text-xs text-slate-500 font-mono">ID: {req._id.toString().slice(-8)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-900">{req.userId?.email}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{req.quantity}</td>
                      <td className="px-6 py-4 text-slate-500">
                        {new Date(req.updatedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
