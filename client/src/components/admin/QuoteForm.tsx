'use client';

import React, { useState } from 'react';
import { issueQuote } from '@/lib/actions/admin-sourcing';
import { Send, AlertCircle, CheckCircle2 } from 'lucide-react';

interface QuoteFormProps {
  requestId: string;
}

export default function QuoteForm({ requestId }: QuoteFormProps) {
  const [finalPrice, setFinalPrice] = useState<string>('');
  const [shippingCost, setShippingCost] = useState<string>('');
  const [internalCost, setInternalCost] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    const fp = Number(finalPrice);
    const sc = Number(shippingCost);
    const ic = Number(internalCost);

    if (isNaN(fp) || isNaN(sc) || isNaN(ic) || fp <= 0 || sc < 0 || ic <= 0) {
      setErrorMsg('Please enter valid positive numbers for all costs.');
      setIsSubmitting(false);
      return;
    }

    const result = await issueQuote(requestId, fp, sc, ic, notes);
    
    setIsSubmitting(false);
    if (result.success) {
      setSuccess(true);
    } else {
      setErrorMsg(result.error || 'Failed to issue quote.');
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl flex items-center gap-3">
        <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
        <p className="text-sm font-medium">Quote issued successfully.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
      <h4 className="font-semibold text-slate-800">Issue a Quote</h4>
      
      {errorMsg && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Final Price (Customer)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            required
            value={finalPrice}
            onChange={(e) => setFinalPrice(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="0.00"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Est. Shipping (Customer)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            required
            value={shippingCost}
            onChange={(e) => setShippingCost(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="0.00"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-red-600 mb-1">Internal Supplier Cost</label>
          <input
            type="number"
            step="0.01"
            min="0"
            required
            value={internalCost}
            onChange={(e) => setInternalCost(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-red-200 bg-red-50/50 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
            placeholder="0.00 (Private)"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1">Notes (Customer visible)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
          rows={2}
          placeholder="Optional notes for the customer..."
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#1e3a8a] text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-blue-800 transition-colors disabled:opacity-70"
      >
        {isSubmitting ? 'Submitting...' : <><Send className="w-4 h-4" /> Issue Quote</>}
      </button>
    </form>
  );
}
