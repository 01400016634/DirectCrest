import React from 'react';
import ChinaSourcingForm from '@/components/storefront/ChinaSourcingForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'China Sourcing - DirectCrest',
  description: 'Request a custom product to be sourced directly from China by our experts.',
};

export default function SourcingPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Source Directly from China</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Can&apos;t find what you&apos;re looking for? Tell us what you need, and our experts on the ground will source it for you at the best possible price.
          </p>
        </div>
        
        <ChinaSourcingForm />
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-center">
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
            <h3 className="font-bold text-slate-900 mb-2">Submit Request</h3>
            <p className="text-sm text-slate-600">Provide details about the product you need, including target price and quantity.</p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
            <h3 className="font-bold text-slate-900 mb-2">We Source It</h3>
            <p className="text-sm text-slate-600">Our team contacts verified manufacturers to find the best match and negotiate prices.</p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
            <h3 className="font-bold text-slate-900 mb-2">Get a Quote</h3>
            <p className="text-sm text-slate-600">We send you a comprehensive quote including shipping. You approve, we deliver.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
