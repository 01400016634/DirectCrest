import React from 'react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-8 sm:p-12">
        <h1 className="text-4xl font-extrabold text-[#0f172a] tracking-tight mb-8">Contact Us</h1>
        
        <div className="text-lg text-slate-600 leading-relaxed mb-10">
          <p>
            Have questions about our products, sourcing services, or your recent order? Our team is here to help. Reach out to us through any of the channels below, or fill out the contact form.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">Get in Touch</h2>
            
            <div>
              <h3 className="font-semibold text-slate-800">Email</h3>
              <p className="text-slate-600">support@directcrest.com</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-slate-800">Phone</h3>
              <p className="text-slate-600">+880 1700 000000</p>
              <p className="text-slate-500 text-sm">Mon-Fri, 9am-6pm (BST)</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-slate-800">Headquarters</h3>
              <p className="text-slate-600">123 Commerce Avenue<br/>Dhaka, Bangladesh</p>
            </div>
          </div>

          {/* Contact Form */}
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700">Name</label>
              <input type="text" id="name" className="mt-1 block w-full rounded-md border border-slate-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Your name" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email</label>
              <input type="email" id="email" className="mt-1 block w-full rounded-md border border-slate-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="your@email.com" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-slate-700">Message</label>
              <textarea id="message" rows={4} className="mt-1 block w-full rounded-md border border-slate-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="How can we help?"></textarea>
            </div>
            <button type="submit" className="w-full bg-[#1e3a8a] hover:bg-[#172554] text-white font-bold py-3 px-4 rounded-xl shadow-md transition-colors">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
