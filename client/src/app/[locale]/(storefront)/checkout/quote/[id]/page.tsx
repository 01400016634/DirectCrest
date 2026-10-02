import connectDB from '@/lib/mongoose';
import { Quote, ProductRequest } from '@/lib/models/Schema';
import QuoteCheckoutClient from './QuoteCheckoutClient';
import { notFound } from 'next/navigation';

export const metadata = {
  title: 'Checkout Quote - DirectCrest',
};

export default async function QuoteCheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const quoteId = resolvedParams.id;
  
  await connectDB();
  
  const quote = await Quote.findById(quoteId).lean();
  if (!quote) {
    return notFound();
  }

  const productRequest = await ProductRequest.findById(quote.requestId).lean();
  if (!productRequest) {
    return notFound();
  }

  // Ensure it's still Quoted and not already Paid
  if (productRequest.status !== 'Quoted') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Quote No Longer Available</h2>
          <p className="text-slate-600">This quote has either been accepted already or was rejected.</p>
        </div>
      </div>
    );
  }

  const quoteDetails = {
    _id: quote._id.toString(),
    requestId: quote.requestId.toString(),
    finalPrice: quote.finalPrice,
    shippingCost: quote.shippingCost,
    productTitle: productRequest.productTitle,
    quantity: productRequest.quantity,
    imageLink: productRequest.imageLink,
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Secure Checkout</h1>
          <p className="mt-2 text-slate-500">Complete the checkout for your custom sourcing quote.</p>
        </div>
        
        <QuoteCheckoutClient quote={quoteDetails} />
      </div>
    </div>
  );
}
