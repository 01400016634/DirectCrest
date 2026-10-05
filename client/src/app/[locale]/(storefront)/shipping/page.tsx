import React from 'react';

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-8 sm:p-12">
        <h1 className="text-4xl font-extrabold text-[#0f172a] tracking-tight mb-8">Shipping Policy</h1>
        
        <div className="space-y-8 text-slate-600 leading-relaxed">
          <p className="text-sm text-slate-500">Last Updated: October 2026</p>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">Order Processing Time</h2>
            <p>
              All orders are processed within 1 to 3 business days (excluding weekends and holidays) after receiving your order confirmation email. For custom manufacturing or sourcing orders, processing times may vary and will be communicated directly by your account manager. You will receive another notification when your order has shipped.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">Shipping Rates and Estimates</h2>
            <p>
              Shipping charges for your order will be calculated and displayed at checkout. We offer multiple shipping tiers:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong className="text-slate-800">Standard Shipping:</strong> Typically 10-15 business days for international orders.</li>
              <li><strong className="text-slate-800">Express Air Freight:</strong> 3-7 business days via DHL, FedEx, or UPS.</li>
              <li><strong className="text-slate-800">Ocean Freight (B2B Bulk):</strong> 20-40 days depending on the destination port.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">International Shipping & Customs</h2>
            <p>
              We ship globally. Your order may be subject to import duties and taxes (including VAT), which are incurred once a shipment reaches your destination country. DirectCrest is not responsible for these charges if they are applied and are your responsibility as the customer. For specific B2B sourcing contracts, DDP (Delivered Duty Paid) options may be available.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">How Do I Check the Status of My Order?</h2>
            <p>
              When your order has shipped, you will receive an email notification from us which will include a tracking number you can use to check its status. Please allow 48 hours for the tracking information to become available. You can also view real-time tracking via your account dashboard.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">Refunds, Returns, and Exchanges</h2>
            <p>
              We accept returns up to 30 days after delivery, if the item is unused and in its original condition, and we will refund the full order amount minus the shipping costs for the return. In the event that your order arrives damaged in any way, please email us as soon as possible at support@directcrest.com with your order number and a photo of the item's condition.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
