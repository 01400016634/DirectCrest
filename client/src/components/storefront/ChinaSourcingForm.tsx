'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { submitSourcingRequest } from '@/lib/actions/sourcing';
import { sourcingFormSchema, SourcingFormValues } from '@/lib/actions/sourcing.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { PackageSearch, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ChinaSourcingForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SourcingFormValues>({
    resolver: zodResolver(sourcingFormSchema),
    defaultValues: {
      productTitle: '',
      description: '',
      targetPrice: '',
      quantity: '1',
      imageLink: '',
    },
  });

  const onSubmit = async (data: SourcingFormValues) => {
    setIsSubmitting(true);
    setErrorMsg('');
    
    // Zod transforms empty inputs to undefined for optional numbers, but let's make sure
    const processedData = {
      ...data,
      targetPrice: data.targetPrice === '' ? undefined : data.targetPrice,
    } as SourcingFormValues;

    const result = await submitSourcingRequest(processedData);
    
    setIsSubmitting(false);

    if (result.success) {
      setIsSuccess(true);
      reset();
    } else {
      setErrorMsg(result.error || 'Failed to submit request');
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 max-w-2xl mx-auto text-center animate-in fade-in zoom-in duration-300">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
          <CheckCircle2 size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Request Submitted</h2>
        <p className="text-slate-600 mb-6">
          Our sourcing experts in China are reviewing your request. We will get back to you with a quote shortly!
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="bg-[#1e3a8a] text-white px-6 py-3 rounded-full font-medium hover:bg-blue-800 transition-colors"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 max-w-2xl mx-auto relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
      
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
          <PackageSearch size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">China Sourcing Request</h2>
          <p className="text-slate-500 text-sm">Let us find the exact product you need</p>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-3 text-sm">
          <AlertCircle size={16} />
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Product Title *</label>
          <input
            {...register('productTitle')}
            type="text"
            className={`w-full px-4 py-3 rounded-xl border ${errors.productTitle ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:border-blue-500'} focus:ring-1 focus:ring-blue-500 outline-none transition-colors`}
            placeholder="e.g., Wireless Bluetooth Headphones"
          />
          {errors.productTitle && <p className="text-red-500 text-xs mt-1">{errors.productTitle.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Detailed Description *</label>
          <textarea
            {...register('description')}
            rows={4}
            className={`w-full px-4 py-3 rounded-xl border ${errors.description ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:border-blue-500'} focus:ring-1 focus:ring-blue-500 outline-none transition-colors resize-none`}
            placeholder="Material, size, colors, features, packaging requirements..."
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Target Price (USD) <span className="text-slate-400 font-normal">(Optional)</span></label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
              <input
                {...register('targetPrice')}
                type="number"
                step="0.01"
                min="0"
                className={`w-full pl-8 pr-4 py-3 rounded-xl border ${errors.targetPrice ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:border-blue-500'} focus:ring-1 focus:ring-blue-500 outline-none transition-colors`}
                placeholder="0.00"
              />
            </div>
            {errors.targetPrice && <p className="text-red-500 text-xs mt-1">{errors.targetPrice.message as string}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Target Quantity *</label>
            <input
              {...register('quantity')}
              type="number"
              min="1"
              className={`w-full px-4 py-3 rounded-xl border ${errors.quantity ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:border-blue-500'} focus:ring-1 focus:ring-blue-500 outline-none transition-colors`}
              placeholder="100"
            />
            {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity.message as string}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Reference Image URL <span className="text-slate-400 font-normal">(Optional)</span></label>
          <input
            {...register('imageLink')}
            type="url"
            className={`w-full px-4 py-3 rounded-xl border ${errors.imageLink ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:border-blue-500'} focus:ring-1 focus:ring-blue-500 outline-none transition-colors`}
            placeholder="https://example.com/image.jpg"
          />
          {errors.imageLink && <p className="text-red-500 text-xs mt-1">{errors.imageLink.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#1e3a8a] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-800 transition-colors disabled:opacity-70"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              Submit Request <Send size={18} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
