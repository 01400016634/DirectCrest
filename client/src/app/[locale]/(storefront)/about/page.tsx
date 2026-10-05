import React from 'react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-8 sm:p-12">
        <h1 className="text-4xl font-extrabold text-[#0f172a] tracking-tight mb-8">About DirectCrest</h1>
        
        <div className="space-y-8 text-lg text-slate-600 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Our Story</h2>
            <p>
              Founded with the vision of breaking down global trade barriers, DirectCrest is a premier platform connecting businesses and individuals with top-tier manufacturing and sourcing from China. We recognized that navigating international supply chains could be complex, opaque, and intimidating. Our goal was simple: to create a seamless, transparent, and direct bridge between high-quality manufacturers and global buyers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">What We Do</h2>
            <p>
              We specialize in B2B sourcing, custom manufacturing, and direct retail. Whether you are a small business looking to source bulk materials, an entrepreneur building a custom product, or a consumer seeking high-quality goods at factory-direct prices, DirectCrest provides the infrastructure, logistics, and quality assurance to make it happen.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Our Values</h2>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong className="text-slate-800">Transparency:</strong> We believe in clear pricing, honest communication, and visible supply chains.</li>
              <li><strong className="text-slate-800">Quality First:</strong> Every product and supplier on our platform undergoes rigorous vetting and quality control.</li>
              <li><strong className="text-slate-800">Efficiency:</strong> Time is money. Our logistics network is optimized for speed and reliability.</li>
              <li><strong className="text-slate-800">Partnership:</strong> We view our clients not just as customers, but as long-term partners in growth.</li>
            </ul>
          </section>

          <section className="bg-[#eff6ff] p-6 rounded-xl border border-blue-100 mt-8">
            <h3 className="text-xl font-bold text-[#1e3a8a] mb-2">Our Mission</h3>
            <p className="text-[#1e3a8a]">
              To empower global commerce by providing a direct, reliable, and frictionless sourcing experience from the world's leading manufacturing hubs to your doorstep.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
