'use client';

import { useState, useEffect } from 'react';
import { useCartStore, getEffectivePrice } from '@/store/cartStore';
import { useRouter } from 'next/navigation';
import { CreditCard, Truck, ShieldCheck, MapPin, Phone, User, CheckCircle2, ChevronLeft, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

export default function CheckoutPage() {
  const router = useRouter();
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [authLoaded, setAuthLoaded] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setAuthLoaded(true);
    });
    return () => unsubscribe();
  }, []);
  const { items, clearCart, updateQuantity, removeItem } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const subtotal = items.reduce((sum, item) => sum + (getEffectivePrice(item) * item.quantity), 0);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    deliveryOption: 'ship', // ship, air, express
    paymentMethod: 'cod', // cod, bkash, card
    discountCode: ''
  });
  
  const [discount, setDiscount] = useState(0);
  const [orderStatus, setOrderStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [orderId, setOrderId] = useState('');
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalWeight = items.reduce((sum, item) => sum + (((item as any).product?.weight || 1) * item.quantity), 0);
  
  const deliveryFee = formData.deliveryOption === 'ship' ? totalWeight * 800
                    : formData.deliveryOption === 'air' ? totalWeight * 1500
                    : 0; // express is price on discuss
  const total = subtotal + deliveryFee - discount;

  const handleApplyDiscount = () => {
    if (formData.discountCode.toUpperCase() === 'WELCOME10') {
      setDiscount(subtotal * 0.1);
    } else {
      alert('Invalid discount code');
      setDiscount(0);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    
    if (authLoaded && !firebaseUser) {
      alert('You must be logged in to place an order.');
      router.push('/login'); // Redirect to login page
      return;
    }
    
    setOrderStatus('processing');
    
    // Call API to create order
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          formData,
          total,
          subtotal,
          deliveryFee,
          discount
        })
      });

      const data = await res.json();
      if (data.success) {
        setOrderId(data.trackingNumber);
        setOrderStatus('success');
        clearCart();
      } else {
        alert('Failed to place order');
        setOrderStatus('idle');
      }
    } catch (err) {
      alert('Error placing order');
      setOrderStatus('idle');
    }
  };

  if (orderStatus === 'success') {
    return (
      <div className="min-h-screen bg-transparent py-20 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 text-center shadow-2xl">
          <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Order Confirmed!</h1>
          <p className="text-gray-400 mb-6">Thank you for your purchase.</p>
          
          <div className="bg-black/30 rounded-xl p-4 mb-8">
            <p className="text-sm text-gray-500 mb-1">Order ID</p>
            <p className="text-xl font-mono font-bold text-red-500">{orderId}</p>
          </div>
          
          <p className="text-sm text-gray-400 mb-8 leading-relaxed">
            We have sent an invoice to your phone <strong>{formData.phone}</strong> via SMS and to your registered email. 
            You can track your order using this Order ID.
          </p>
          
          <div className="flex flex-col gap-4">
            <button 
              onClick={async () => {
                const { default: jsPDF } = await import('jspdf');
                const { default: autoTable } = await import('jspdf-autotable');
                const doc = new jsPDF();
                
                doc.setFontSize(22);
                doc.text('DirectCrest', 14, 20);
                doc.setFontSize(10);
                doc.text('123 Commerce Avenue, Dhaka, Bangladesh', 14, 28);
                doc.text('Phone: +880 1700 000000 | Email: support@directcrest.com', 14, 34);
                
                doc.setFontSize(16);
                doc.text('ORDER SUMMARY / INVOICE', 14, 48);
                doc.setFontSize(10);
                doc.text(`Order ID: ${orderId}`, 14, 56);
                doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 62);
                doc.text(`Customer Name: ${formData.name}`, 14, 68);
                doc.text(`Phone: ${formData.phone}`, 14, 74);
                doc.text(`Address: ${formData.address}, ${formData.city}`, 14, 80);
                
                // @ts-ignore
                autoTable(doc, {
                  startY: 88,
                  head: [['Item Name', 'Qty', 'Unit Price', 'Total']],
                  body: items.map(item => [
                    item.name, 
                    item.quantity, 
                    `Tk ${(getEffectivePrice(item)).toFixed(2)}`, 
                    `Tk ${(getEffectivePrice(item) * item.quantity).toFixed(2)}`
                  ]),
                });
                
                let finalY = (doc as any).lastAutoTable.finalY || 88;
                
                doc.text(`Subtotal: Tk ${subtotal.toFixed(2)}`, 140, finalY + 10);
                doc.text(`Delivery Fee: Tk ${deliveryFee.toFixed(2)}`, 140, finalY + 16);
                if (discount > 0) {
                  doc.text(`Discount: -Tk ${discount.toFixed(2)}`, 140, finalY + 22);
                  finalY += 6;
                }
                doc.setFontSize(12);
                doc.text(`Total: Tk ${total.toFixed(2)}`, 140, finalY + 24);
                
                finalY += 40;
                doc.setFontSize(9);
                doc.text('Online PDF Invoice Policy:', 14, finalY);
                doc.text('1. Returns are accepted within 7 days of delivery.', 14, finalY + 6);
                doc.text('2. Please keep this invoice for warranty claims.', 14, finalY + 12);
                doc.text('3. This is a computer generated invoice and requires no physical signature.', 14, finalY + 18);
                
                doc.save(`DirectCrest-Order-${orderId}.pdf`);
              }}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
            >
              Download PDF Invoice
            </button>
            <button 
              onClick={() => router.push('/track-order')}
              className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg"
            >
              Track Order
            </button>
            <button 
              onClick={() => router.push('/')}
              className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl transition-all border border-white/10"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-8">
          <Link href="/products" className="text-gray-400 hover:text-white transition-colors flex items-center mr-4">
            <ChevronLeft className="w-5 h-5 mr-1" /> Back
          </Link>
          <h1 className="text-3xl font-black tracking-tight text-white">Checkout</h1>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl">
            <ShoppingCart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <Link href="/products" className="inline-block bg-red-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-red-500 transition-colors">
              Start Shopping
            </Link>
          </div>
        ) : (
          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Form Details */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Delivery Info */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8">
                <h2 className="text-xl font-bold mb-6 flex items-center"><MapPin className="mr-2 text-red-500" /> Delivery Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm text-gray-400 mb-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input 
                        type="text" required
                        value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-red-500"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm text-gray-400 mb-2">Email Address</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input 
                        type="email" required
                        value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-red-500"
                        placeholder="you@email.com"
                      />
                    </div>
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm text-gray-400 mb-2">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input 
                        type="tel" required
                        value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-red-500"
                        placeholder="+880 1..."
                      />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm text-gray-400 mb-2">Full Address</label>
                    <input 
                      type="text" required
                      value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="w-full bg-black/30 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-red-500"
                      placeholder="House, Road, Area"
                    />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm text-gray-400 mb-2">City</label>
                    <input 
                      type="text" required
                      value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})}
                      className="w-full bg-black/30 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-red-500"
                      placeholder="Dhaka"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Option */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8">
                <h2 className="text-xl font-bold mb-6 flex items-center"><Truck className="mr-2 text-red-500" /> Delivery Method</h2>
                <div className="space-y-4">
                  <label className={`block p-4 border rounded-xl cursor-pointer transition-all ${formData.deliveryOption === 'ship' ? 'border-red-500 bg-red-500/10' : 'border-white/10 bg-black/30 hover:border-white/30'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input type="radio" name="delivery" value="ship" checked={formData.deliveryOption === 'ship'} onChange={(e) => setFormData({...formData, deliveryOption: e.target.value})} className="accent-red-500" />
                        <div>
                          <p className="font-bold text-white">Ship</p>
                          <p className="text-sm text-gray-400">28-30 days</p>
                        </div>
                      </div>
                      <span className="font-bold">৳{totalWeight * 800}</span>
                    </div>
                  </label>
                  <label className={`block p-4 border rounded-xl cursor-pointer transition-all ${formData.deliveryOption === 'air' ? 'border-red-500 bg-red-500/10' : 'border-white/10 bg-black/30 hover:border-white/30'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input type="radio" name="delivery" value="air" checked={formData.deliveryOption === 'air'} onChange={(e) => setFormData({...formData, deliveryOption: e.target.value})} className="accent-red-500" />
                        <div>
                          <p className="font-bold text-white">Air</p>
                          <p className="text-sm text-gray-400">12-15 days</p>
                        </div>
                      </div>
                      <span className="font-bold">৳{totalWeight * 1500}</span>
                    </div>
                  </label>
                  <label className={`block p-4 border rounded-xl cursor-pointer transition-all ${formData.deliveryOption === 'express' ? 'border-red-500 bg-red-500/10' : 'border-white/10 bg-black/30 hover:border-white/30'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input type="radio" name="delivery" value="express" checked={formData.deliveryOption === 'express'} onChange={(e) => setFormData({...formData, deliveryOption: e.target.value})} className="accent-red-500" />
                        <div>
                          <p className="font-bold text-white">Express Service (Air)</p>
                          <p className="text-sm text-gray-400">Within 2/3 days</p>
                        </div>
                      </div>
                      <span className="font-bold text-sm text-gray-300">Price on discuss (as per weight)</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8">
                <h2 className="text-xl font-bold mb-6 flex items-center"><CreditCard className="mr-2 text-red-500" /> Payment Method</h2>
                <div className="space-y-4">
                  <label className={`block p-4 border rounded-xl cursor-pointer transition-all ${formData.paymentMethod === 'cod' ? 'border-red-500 bg-red-500/10' : 'border-white/10 bg-black/30 hover:border-white/30'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="payment" value="cod" checked={formData.paymentMethod === 'cod'} onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})} className="accent-red-500" />
                      <span className="font-bold text-white">Cash on Delivery</span>
                    </div>
                  </label>
                  <div className={`border rounded-xl transition-all overflow-hidden ${formData.paymentMethod === 'bkash' ? 'border-red-500 bg-red-500/10' : 'border-white/10 bg-black/30 hover:border-white/30'}`}>
                    <label className="block p-4 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <input type="radio" name="payment" value="bkash" checked={formData.paymentMethod === 'bkash'} onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})} className="accent-red-500" />
                        <span className="font-bold text-white">bKash Payment</span>
                      </div>
                    </label>
                    {formData.paymentMethod === 'bkash' && (
                      <div className="p-4 pt-0 border-t border-white/10 mt-2 space-y-3">
                        <input type="text" required placeholder="bKash Number" className="w-full bg-black/30 border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-red-500 text-sm" />
                        <input type="text" required placeholder="Transaction ID (TrxID)" className="w-full bg-black/30 border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-red-500 text-sm" />
                      </div>
                    )}
                  </div>
                  <div className={`border rounded-xl transition-all overflow-hidden ${formData.paymentMethod === 'visa' ? 'border-red-500 bg-red-500/10' : 'border-white/10 bg-black/30 hover:border-white/30'}`}>
                    <label className="block p-4 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <input type="radio" name="payment" value="visa" checked={formData.paymentMethod === 'visa'} onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})} className="accent-red-500" />
                        <span className="font-bold text-white">Visa Card</span>
                      </div>
                    </label>
                    {formData.paymentMethod === 'visa' && (
                      <div className="p-4 pt-0 border-t border-white/10 mt-2 space-y-3">
                        <input type="text" required placeholder="Card Number" className="w-full bg-black/30 border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-red-500 text-sm" />
                        <div className="flex gap-3">
                          <input type="text" required placeholder="MM/YY" className="w-1/2 bg-black/30 border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-red-500 text-sm" />
                          <input type="text" required placeholder="CVV" className="w-1/2 bg-black/30 border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-red-500 text-sm" />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className={`border rounded-xl transition-all overflow-hidden ${formData.paymentMethod === 'alipay' ? 'border-red-500 bg-red-500/10' : 'border-white/10 bg-black/30 hover:border-white/30'}`}>
                    <label className="block p-4 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <input type="radio" name="payment" value="alipay" checked={formData.paymentMethod === 'alipay'} onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})} className="accent-red-500" />
                        <span className="font-bold text-white">Alipay</span>
                      </div>
                    </label>
                    {formData.paymentMethod === 'alipay' && (
                      <div className="p-4 pt-0 border-t border-white/10 mt-2 space-y-3">
                        <input type="text" required placeholder="Alipay Account ID" className="w-full bg-black/30 border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-red-500 text-sm" />
                      </div>
                    )}
                  </div>
                  <div className={`border rounded-xl transition-all overflow-hidden ${formData.paymentMethod === 'paypal' ? 'border-red-500 bg-red-500/10' : 'border-white/10 bg-black/30 hover:border-white/30'}`}>
                    <label className="block p-4 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <input type="radio" name="payment" value="paypal" checked={formData.paymentMethod === 'paypal'} onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})} className="accent-red-500" />
                        <span className="font-bold text-white">PayPal</span>
                      </div>
                    </label>
                    {formData.paymentMethod === 'paypal' && (
                      <div className="p-4 pt-0 border-t border-white/10 mt-2 space-y-3">
                        <input type="email" required placeholder="PayPal Email" className="w-full bg-black/30 border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-red-500 text-sm" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-5">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 sticky top-8">
                <h2 className="text-xl font-bold mb-6 flex items-center">Order Summary</h2>
                
                <div className="max-h-64 overflow-y-auto custom-scrollbar pr-2 mb-6 space-y-4">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-center">
                      <div className="w-16 h-16 bg-white/10 rounded-lg overflow-hidden flex-shrink-0 relative">
                        {item.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">Img</div>
                        )}
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">{item.name}</p>
                        {item.variantId && <p className="text-xs text-gray-400">{item.variantId}</p>}
                        <div className="flex items-center mt-2 bg-black/50 rounded-lg w-max border border-white/10">
                          <button 
                            type="button" 
                            onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                          >-</button>
                          <span className="w-8 text-center text-sm text-white">{item.quantity}</span>
                          <button 
                            type="button" 
                            onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                          >+</button>
                        </div>
                      </div>
                      <div className="text-right flex flex-col justify-between h-full">
                        <p className="font-bold text-white">৳{(getEffectivePrice(item) * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mb-6">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Discount code (try WELCOME10)"
                      value={formData.discountCode}
                      onChange={(e) => setFormData({...formData, discountCode: e.target.value})}
                      className="flex-1 bg-black/30 border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-red-500 text-sm"
                    />
                    <button type="button" onClick={handleApplyDiscount} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors">
                      Apply
                    </button>
                  </div>
                </div>

                <div className="space-y-3 mb-6 border-t border-white/10 pt-6">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>৳{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Delivery Fee</span>
                    <span>৳{deliveryFee.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-500 font-bold">
                      <span>Discount</span>
                      <span>-৳{discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xl font-black text-white pt-4 border-t border-white/10">
                    <span>Total</span>
                    <span className="text-red-500">৳{total.toFixed(2)}</span>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={orderStatus === 'processing'}
                  className="w-full bg-red-600 hover:bg-red-500 text-white font-black text-lg py-4 px-6 rounded-2xl shadow-[0_0_20px_rgba(220,38,38,0.2)] hover:shadow-[0_0_30px_rgba(220,38,38,0.4)] transition-all flex items-center justify-center disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  {orderStatus === 'processing' ? 'Processing...' : 'Confirm Order'}
                </button>
                
                <div className="mt-4 flex items-center justify-center text-xs text-gray-500 gap-1">
                  <ShieldCheck className="w-4 h-4" /> SSL Encrypted Checkout
                </div>
              </div>
            </div>
            
          </form>
        )}
      </div>
    </div>
  );
}
