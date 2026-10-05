import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-8 sm:p-12">
        <h1 className="text-4xl font-extrabold text-[#0f172a] tracking-tight mb-8">Privacy Policy</h1>
        
        <div className="space-y-8 text-slate-600 leading-relaxed">
          <p className="text-sm text-slate-500">Last Updated: October 2026</p>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include your name, email address, phone number, postal address, payment method, and other personal or business information you choose to provide.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">2. How We Use Your Information</h2>
            <p>
              We may use the information we collect to provide, maintain, and improve our services, including to process transactions and send related information such as confirmations and invoices. We also use this information to send you technical notices, updates, security alerts, and support messages, as well as to communicate with you about products, services, offers, and events offered by DirectCrest.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">3. Sharing of Information</h2>
            <p>
              We may share your information with vendors, consultants, manufacturers, and other service providers who need access to such information to carry out work on our behalf (such as shipping partners). We do not sell your personal data to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">4. Security</h2>
            <p>
              DirectCrest takes reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction. We utilize industry-standard encryption protocols during the transmission and storage of sensitive data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">5. Cookies</h2>
            <p>
              We use cookies and similar tracking technologies to track activity on our platform and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent, though some parts of our service may not function properly without them.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">6. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at support@directcrest.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
