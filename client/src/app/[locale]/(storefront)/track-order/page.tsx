'use client';

import { useState } from 'react';
import { trackOrderAction } from '@/actions/trackOrder';
import { Package, Search, Mail, Phone, Truck, CheckCircle, Clock, Info, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TrackOrderPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderData, setOrderData] = useState<any>(null);
  const [isManifestOpen, setIsManifestOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOrderData(null);

    const formData = new FormData(e.currentTarget);
    
    try {
      const response = await trackOrderAction(formData);
      if (response.success) {
        setOrderData(response);
      } else {
        setError(response.error || "An error occurred");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getTimelineSteps = (status: string) => {
    const defaultSteps = [
      { label: 'Order Placed', active: false, done: false },
      { label: 'Payment Confirmed', active: false, done: false },
      { label: 'Packed at Guangzhou Hub', active: false, done: false },
      { label: 'Export Customs Clearance', active: false, done: false },
      { label: 'In Transit to Destination', active: false, done: false },
      { label: 'Out for Delivery', active: false, done: false },
      { label: 'Delivered', active: false, done: false },
    ];

    const currentIdx = {
      'Pending': 0,
      'PAID': 1,
      'Processing': 2,
      'Shipped': 4,
      'Delivered': 6
    }[status] ?? 0;

    return defaultSteps.map((step, idx) => ({
      ...step,
      done: idx < currentIdx || (status === 'Delivered'),
      active: idx === currentIdx
    }));
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Search State */}
        {!orderData && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
            
            <div className="relative z-10 text-center mb-10">
              <div className="w-20 h-20 bg-blue-900/40 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                <Truck className="h-10 w-10 text-blue-400" />
              </div>
              <h1 className="text-4xl font-black text-white tracking-tight uppercase mb-4">Track Your Shipment</h1>
              <p className="text-gray-400 text-lg">Enter your order ID and verification detail to locate your package.</p>
            </div>

            <form onSubmit={handleSubmit} className="relative z-10 max-w-xl mx-auto space-y-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl flex items-start gap-3">
                  <Info className="h-5 w-5 shrink-0 mt-0.5" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-300 uppercase tracking-wider">Order ID</label>
                <div className="relative">
                  <Package className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <input 
                    name="orderId"
                    type="text" 
                    required
                    placeholder="e.g. 64b91a... (Your MongoDB Order ID)" 
                    className="w-full bg-black/40 border border-white/10 text-white rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-300 uppercase tracking-wider">Verification (Email or Phone)</label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <input 
                    name="contact"
                    type="text" 
                    required
                    placeholder="Billing Email or Shipping Phone" 
                    className="w-full bg-black/40 border border-white/10 text-white rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black text-lg py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Locating Order...
                  </>
                ) : (
                  'Locate Order'
                )}
              </button>
            </form>
          </motion.div>
        )}

        {/* Result State */}
        {orderData && orderData.order && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            {/* Header & Status */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 md:p-8 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
              <div>
                <button onClick={() => setOrderData(null)} className="text-sm font-semibold text-blue-400 hover:text-blue-300 mb-4 flex items-center gap-1">&larr; Track Another Order</button>
                <h2 className="text-3xl font-black text-white tracking-tight">Order #{orderData.order._id.substring(orderData.order._id.length - 8).toUpperCase()}</h2>
                <p className="text-gray-400 font-medium mt-1">Purchased on {new Date(orderData.order.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="px-5 py-2.5 rounded-full bg-blue-900/40 border border-blue-500/50 text-blue-400 font-bold uppercase tracking-wider text-sm flex items-center gap-2 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                {orderData.order.status === 'Delivered' ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5 animate-pulse" />}
                {orderData.order.status}
              </div>
            </div>

            {/* Visual Timeline */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 md:p-10 rounded-3xl shadow-xl overflow-x-auto">
              <div className="min-w-[700px]">
                <div className="flex justify-between relative">
                  <div className="absolute top-5 left-8 right-8 h-1 bg-white/10 -z-10 rounded-full"></div>
                  
                  {getTimelineSteps(orderData.order.status).map((step, idx) => (
                    <div key={idx} className={`flex flex-col items-center gap-3 w-32 ${step.active ? 'opacity-100' : step.done ? 'opacity-100' : 'opacity-40 grayscale'}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 z-10 ${step.active ? 'bg-blue-600 border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.6)]' : step.done ? 'bg-green-600 border-green-400' : 'bg-gray-800 border-gray-600'}`}>
                        {step.done ? <CheckCircle className="w-5 h-5 text-white" /> : <div className={`w-3 h-3 rounded-full ${step.active ? 'bg-white animate-pulse' : 'bg-gray-500'}`} />}
                      </div>
                      <div className="text-center">
                        <p className={`text-xs font-bold leading-tight ${step.active ? 'text-blue-400' : step.done ? 'text-green-400' : 'text-gray-500'}`}>
                          {step.label}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Carrier Details */}
              <div className="md:col-span-1 bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl shadow-xl flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2"><Truck className="w-5 h-5 text-gray-400" /> Carrier Info</h3>
                  {orderData.shipment ? (
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-gray-500 font-bold uppercase mb-1">Carrier</p>
                        <p className="text-white font-medium">{orderData.shipment.carrier || 'Standard Shipping'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-bold uppercase mb-1">Tracking Number</p>
                        <p className="text-blue-400 font-bold tracking-widest bg-blue-950/30 p-2 rounded-lg border border-blue-900/50 flex items-center justify-between">
                          {orderData.shipment.trackingNumber || 'Pending...'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm">Carrier assignment pending. We will update tracking details once the order leaves our hub.</p>
                  )}
                </div>
                
                <div className="mt-8">
                  <a href={`/contact?order=${orderData.order._id}`} className="w-full block text-center py-3 px-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-colors border border-white/10 flex items-center justify-center gap-2">
                    <Mail className="w-4 h-4" /> Contact Support
                  </a>
                </div>
              </div>

              {/* Itemized Manifest */}
              <div className="md:col-span-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl shadow-xl overflow-hidden flex flex-col">
                <button 
                  onClick={() => setIsManifestOpen(!isManifestOpen)}
                  className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-colors text-left"
                >
                  <div>
                    <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2"><Package className="w-5 h-5 text-gray-400" /> Order Manifest</h3>
                    <p className="text-sm text-gray-400 mt-1">{orderData.items?.length || 0} items &bull; Total: <span className="text-white font-bold">${orderData.order.total?.toFixed(2) || '0.00'}</span></p>
                  </div>
                  <div className="p-2 bg-white/10 rounded-full">
                    {isManifestOpen ? <ChevronUp className="w-5 h-5 text-white" /> : <ChevronDown className="w-5 h-5 text-white" />}
                  </div>
                </button>
                
                <AnimatePresence>
                  {isManifestOpen && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-white/10 overflow-hidden"
                    >
                      <div className="p-6 space-y-4">
                        {orderData.items?.map((item: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-4 bg-black/40 p-3 rounded-2xl border border-white/5">
                            <div className="w-16 h-16 bg-white/5 rounded-xl flex items-center justify-center overflow-hidden shrink-0">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={item.productId?.imageUrl || '/images/placeholder.png'} alt="Product" className="w-full h-full object-contain" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-white truncate">{item.productId?.name || 'Unknown Product'}</p>
                              <p className="text-xs text-gray-400 mt-1">Qty: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-white">${((item.priceSnapshot || 0) * (item.quantity || 1)).toFixed(2)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
