'use client';

import { useState } from 'react';
import { addressSchema, AddressFormData } from '@/lib/validations/address';
import { CheckCircle2, ChevronRight, MapPin, CreditCard, ShoppingBag, ShieldCheck, Package } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ZodIssue } from 'zod';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import StripePaymentForm from '@/components/storefront/StripePaymentForm';

type CheckoutStep = 'SHIPPING' | 'BILLING' | 'REVIEW';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_mock');

interface QuoteDetails {
  _id: string;
  requestId: string;
  finalPrice: number;
  shippingCost: number;
  productTitle: string;
  quantity: number;
  imageLink?: string;
}

export default function QuoteCheckoutClient({ quote }: { quote: QuoteDetails }) {
  const router = useRouter();
  const [step, setStep] = useState<CheckoutStep>('SHIPPING');
  
  // State for forms
  const [shippingAddress, setShippingAddress] = useState<Partial<AddressFormData>>({});
  const [billingAddress, setBillingAddress] = useState<Partial<AddressFormData>>({});
  const [useShippingForBilling, setUseShippingForBilling] = useState(true);
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Stripe state
  const [clientSecret, setClientSecret] = useState<string>('');

  const subtotal = quote.finalPrice * quote.quantity;
  const shippingCost = quote.shippingCost;
  const total = subtotal + shippingCost;

  const handleNextStep = (currentStep: CheckoutStep) => {
    setErrors({});
    
    if (currentStep === 'SHIPPING') {
      const result = addressSchema.safeParse(shippingAddress);
      if (!result.success) {
        const newErrors: Record<string, string> = {};
        result.error.issues.forEach((e: ZodIssue) => {
          if (e.path[0]) newErrors[e.path[0].toString()] = e.message;
        });
        setErrors(newErrors);
        return;
      }
      if (useShippingForBilling) {
        setBillingAddress(shippingAddress);
      }
      setStep('BILLING');
    } else if (currentStep === 'BILLING') {
      const result = addressSchema.safeParse(billingAddress);
      if (!result.success) {
        const newErrors: Record<string, string> = {};
        result.error.issues.forEach((e: ZodIssue) => {
          if (e.path[0]) newErrors[e.path[0].toString()] = e.message;
        });
        setErrors(newErrors);
        return;
      }
      
      // Fetch PaymentIntent before showing Review step
      fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          quoteId: quote._id,
          shippingAddress,
          billingAddress
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.clientSecret) {
            setClientSecret(data.clientSecret);
            setStep('REVIEW');
          } else {
            alert('Failed to initialize payment: ' + (data.error || 'Unknown error'));
          }
        })
        .catch((err) => alert('Error initializing payment: ' + err.message));
    }
  };

  const handlePaymentSuccess = () => {
    router.push('/checkout/success');
  };

  const renderAddressForm = (
    address: Partial<AddressFormData>,
    setAddress: React.Dispatch<React.SetStateAction<Partial<AddressFormData>>>
  ) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">First Name</label>
        <input 
          type="text" 
          value={address.firstName || ''}
          onChange={e => setAddress({...address, firstName: e.target.value})}
          className={`w-full p-3 border ${errors.firstName ? 'border-red-500' : 'border-slate-200'} rounded-lg focus:ring-2 focus:ring-[#1e3a8a] outline-none transition-all`}
        />
        {errors.firstName && <span className="text-xs text-red-500">{errors.firstName}</span>}
      </div>
      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Email</label>
        <input 
          type="email" 
          value={address.email || ''}
          onChange={e => setAddress({...address, email: e.target.value})}
          className={`w-full p-3 border ${errors.email ? 'border-red-500' : 'border-slate-200'} rounded-lg focus:ring-2 focus:ring-[#1e3a8a] outline-none transition-all`}
        />
        {errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
      </div>
      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Last Name</label>
        <input 
          type="text" 
          value={address.lastName || ''}
          onChange={e => setAddress({...address, lastName: e.target.value})}
          className={`w-full p-3 border ${errors.lastName ? 'border-red-500' : 'border-slate-200'} rounded-lg focus:ring-2 focus:ring-[#1e3a8a] outline-none transition-all`}
        />
        {errors.lastName && <span className="text-xs text-red-500">{errors.lastName}</span>}
      </div>
      
      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Phone</label>
        <input 
          type="tel" 
          value={address.phone || ''}
          onChange={e => setAddress({...address, phone: e.target.value})}
          className={`w-full p-3 border ${errors.phone ? 'border-red-500' : 'border-slate-200'} rounded-lg focus:ring-2 focus:ring-[#1e3a8a] outline-none transition-all`}
        />
        {errors.phone && <span className="text-xs text-red-500">{errors.phone}</span>}
      </div>
      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Country</label>
        <select 
          value={address.country || ''}
          onChange={e => setAddress({...address, country: e.target.value})}
          className={`w-full p-3 border ${errors.country ? 'border-red-500' : 'border-slate-200'} rounded-lg focus:ring-2 focus:ring-[#1e3a8a] outline-none transition-all bg-white`}
        >
          <option value="">Select Country...</option>
          <option value="BD">Bangladesh</option>
          <option value="IN">India</option>
          <option value="PK">Pakistan</option>
          <option value="US">United States</option>
          <option value="UK">United Kingdom</option>
        </select>
        {errors.country && <span className="text-xs text-red-500">{errors.country}</span>}
      </div>

      <div className="space-y-1 md:col-span-2">
        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Street Address</label>
        <input 
          type="text" 
          value={address.street || ''}
          onChange={e => setAddress({...address, street: e.target.value})}
          className={`w-full p-3 border ${errors.street ? 'border-red-500' : 'border-slate-200'} rounded-lg focus:ring-2 focus:ring-[#1e3a8a] outline-none transition-all`}
          placeholder="House number and street name"
        />
        {errors.street && <span className="text-xs text-red-500">{errors.street}</span>}
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">State / Division / Province</label>
        <input 
          type="text" 
          value={address.level1 || ''}
          onChange={e => setAddress({...address, level1: e.target.value})}
          className={`w-full p-3 border ${errors.level1 ? 'border-red-500' : 'border-slate-200'} rounded-lg focus:ring-2 focus:ring-[#1e3a8a] outline-none transition-all`}
        />
        {errors.level1 && <span className="text-xs text-red-500">{errors.level1}</span>}
      </div>
      
      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">City / District</label>
        <input 
          type="text" 
          value={address.level2 || ''}
          onChange={e => setAddress({...address, level2: e.target.value})}
          className={`w-full p-3 border ${errors.level2 ? 'border-red-500' : 'border-slate-200'} rounded-lg focus:ring-2 focus:ring-[#1e3a8a] outline-none transition-all`}
        />
        {errors.level2 && <span className="text-xs text-red-500">{errors.level2}</span>}
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Postal Code</label>
        <input 
          type="text" 
          value={address.postalCode || ''}
          onChange={e => setAddress({...address, postalCode: e.target.value})}
          className={`w-full p-3 border ${errors.postalCode ? 'border-red-500' : 'border-slate-200'} rounded-lg focus:ring-2 focus:ring-[#1e3a8a] outline-none transition-all`}
        />
        {errors.postalCode && <span className="text-xs text-red-500">{errors.postalCode}</span>}
      </div>
      
      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Upazila / Block (Optional)</label>
        <input 
          type="text" 
          value={address.level3 || ''}
          onChange={e => setAddress({...address, level3: e.target.value})}
          className={`w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] outline-none transition-all`}
        />
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      
      {/* Left Column: Form Flow */}
      <div className="lg:col-span-8 space-y-8">
        
        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-8">
          <div className={`flex flex-col items-center flex-1 ${step === 'SHIPPING' || step === 'BILLING' || step === 'REVIEW' ? 'text-[#1e3a8a]' : 'text-slate-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 transition-colors ${step === 'SHIPPING' ? 'bg-[#1e3a8a] text-white shadow-lg' : 'bg-slate-100'}`}>
              {step !== 'SHIPPING' ? <CheckCircle2 className="w-6 h-6" /> : '1'}
            </div>
            <span className="text-sm font-semibold">Shipping</span>
          </div>
          <div className="w-16 h-1 bg-slate-200 rounded-full mx-2"><div className={`h-full bg-[#1e3a8a] rounded-full transition-all ${step !== 'SHIPPING' ? 'w-full' : 'w-0'}`} /></div>
          
          <div className={`flex flex-col items-center flex-1 ${step === 'BILLING' || step === 'REVIEW' ? 'text-[#1e3a8a]' : 'text-slate-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 transition-colors ${step === 'BILLING' ? 'bg-[#1e3a8a] text-white shadow-lg' : step === 'REVIEW' ? 'bg-slate-100' : 'bg-slate-100 text-slate-400'}`}>
              {step === 'REVIEW' ? <CheckCircle2 className="w-6 h-6" /> : '2'}
            </div>
            <span className="text-sm font-semibold">Billing</span>
          </div>
          <div className="w-16 h-1 bg-slate-200 rounded-full mx-2"><div className={`h-full bg-[#1e3a8a] rounded-full transition-all ${step === 'REVIEW' ? 'w-full' : 'w-0'}`} /></div>
          
          <div className={`flex flex-col items-center flex-1 ${step === 'REVIEW' ? 'text-[#1e3a8a]' : 'text-slate-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 transition-colors ${step === 'REVIEW' ? 'bg-[#1e3a8a] text-white shadow-lg' : 'bg-slate-100'}`}>
              3
            </div>
            <span className="text-sm font-semibold">Review</span>
          </div>
        </div>

        {/* Steps Content */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          
          {step === 'SHIPPING' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-50 text-[#1e3a8a] rounded-lg">
                  <MapPin className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Shipping Address</h2>
              </div>
              
              {renderAddressForm(shippingAddress, setShippingAddress)}
              
              <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                <button 
                  onClick={() => handleNextStep('SHIPPING')}
                  className="flex items-center gap-2 px-8 py-3 bg-[#1e3a8a] hover:bg-[#172554] text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-900/20"
                >
                  Continue to Billing <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {step === 'BILLING' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-50 text-[#1e3a8a] rounded-lg">
                  <CreditCard className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Billing Address</h2>
              </div>

              <div className="mb-6 pb-6 border-b border-slate-100">
                <label className="flex items-center space-x-3 cursor-pointer p-4 border border-slate-200 rounded-xl hover:border-[#1e3a8a] transition-colors">
                  <input 
                    type="checkbox" 
                    checked={useShippingForBilling}
                    onChange={(e) => {
                      setUseShippingForBilling(e.target.checked);
                      if (e.target.checked) setBillingAddress(shippingAddress);
                    }}
                    className="w-5 h-5 text-[#1e3a8a] rounded border-slate-300 focus:ring-[#1e3a8a]"
                  />
                  <div>
                    <span className="block font-semibold text-slate-900">Same as shipping address</span>
                    <span className="block text-sm text-slate-500">Use the shipping address provided in the previous step.</span>
                  </div>
                </label>
              </div>

              {!useShippingForBilling && renderAddressForm(billingAddress, setBillingAddress)}
              
              <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between">
                <button 
                  onClick={() => setStep('SHIPPING')}
                  className="px-6 py-3 text-slate-600 hover:text-slate-900 font-semibold transition-colors"
                >
                  Back
                </button>
                <button 
                  onClick={() => handleNextStep('BILLING')}
                  className="flex items-center gap-2 px-8 py-3 bg-[#1e3a8a] hover:bg-[#172554] text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-900/20"
                >
                  Continue to Review <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {step === 'REVIEW' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-50 text-[#1e3a8a] rounded-lg">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Review & Payment</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-slate-900">Shipping</h3>
                    <button onClick={() => setStep('SHIPPING')} className="text-sm text-[#1e3a8a] hover:underline font-semibold">Edit</button>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {shippingAddress.firstName} {shippingAddress.lastName}<br/>
                    {shippingAddress.street}<br/>
                    {shippingAddress.level2}, {shippingAddress.level1} {shippingAddress.postalCode}<br/>
                    {shippingAddress.country}<br/>
                    {shippingAddress.phone}
                  </p>
                </div>
                <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-slate-900">Billing</h3>
                    <button onClick={() => setStep('BILLING')} className="text-sm text-[#1e3a8a] hover:underline font-semibold">Edit</button>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {billingAddress.firstName} {billingAddress.lastName}<br/>
                    {billingAddress.street}<br/>
                    {billingAddress.level2}, {billingAddress.level1} {billingAddress.postalCode}<br/>
                    {billingAddress.country}<br/>
                    {billingAddress.phone}
                  </p>
                </div>
              </div>

              <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100 mb-8">
                <h3 className="font-bold text-[#1e3a8a] mb-6 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" /> Secure Payment
                </h3>
                
                {clientSecret ? (
                  <Elements options={{ clientSecret, appearance: { theme: 'stripe' } }} stripe={stripePromise}>
                    <StripePaymentForm onSuccess={handlePaymentSuccess} />
                  </Elements>
                ) : (
                  <div className="flex items-center justify-center p-10">
                    <div className="w-8 h-8 border-4 border-[#1e3a8a] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between">
                <button 
                  onClick={() => setStep('BILLING')}
                  className="px-6 py-3 text-slate-600 hover:text-slate-900 font-semibold transition-colors"
                >
                  Back
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Right Column: Order Summary */}
      <div className="lg:col-span-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-24">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#1e3a8a]" /> Quote Summary
          </h3>
          
          <ul className="space-y-4 mb-6">
            <li className="flex gap-4">
              <div className="w-16 h-16 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                {quote.imageLink ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={quote.imageLink} alt={quote.productTitle} className="w-full h-full object-cover" />
                ) : (
                  <Package className="w-6 h-6 text-slate-300" />
                )}
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-slate-900 line-clamp-2">{quote.productTitle}</h4>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-slate-500">Qty: {quote.quantity}</span>
                  <span className="font-semibold text-[#1e3a8a]">${(quote.finalPrice * quote.quantity).toFixed(2)}</span>
                </div>
              </div>
            </li>
          </ul>

          <div className="space-y-3 pt-6 border-t border-slate-100 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal ({quote.finalPrice.toFixed(2)} / item)</span>
              <span className="font-semibold text-slate-900">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Shipping</span>
              <span className="font-semibold text-slate-900">${shippingCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Taxes</span>
              <span className="text-xs italic">Calculated at checkout</span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <div className="flex justify-between items-center">
              <span className="text-base font-bold text-slate-900">Total</span>
              <span className="text-2xl font-extrabold text-[#1e3a8a]">${total.toFixed(2)}</span>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
