import React from 'react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-8 sm:p-12">
        <h1 className="text-4xl font-extrabold text-[#0f172a] tracking-tight mb-8">Terms of Service</h1>
        
        <div className="space-y-8 text-slate-600 leading-relaxed">
          <p className="text-sm text-slate-500">Last Updated: October 2026</p>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing and using DirectCrest (the "Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services. We reserve the right to modify these terms at any time, and such modifications shall be effective immediately upon posting.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">2. Description of Services</h2>
            <p>
              DirectCrest acts as a marketplace and sourcing facilitator connecting buyers with suppliers and manufacturers. We provide infrastructure for purchasing, sourcing, and logistics coordination. While we strive to ensure the quality of suppliers, DirectCrest is not the direct manufacturer of the third-party goods sold unless explicitly stated.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">3. Account Registration and Security</h2>
            <p>
              To access certain features, you must register for an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">4. Pricing and Payments</h2>
            <p>
              All prices are subject to change without notice. Wholesale tiers and volume discounts are applied automatically at checkout based on the quantities specified. Payment must be completed prior to the processing and shipping of goods. We reserve the right to cancel orders if pricing errors occur.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">5. Limitation of Liability</h2>
            <p>
              DirectCrest shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">6. Governing Law</h2>
            <p>
              These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which DirectCrest operates, without regard to its conflict of law provisions.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
