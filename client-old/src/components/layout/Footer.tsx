import { Mail, Phone, MapPin, Globe, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand & Intro */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white tracking-tight">Direct<span className="text-blue-500">Crest</span></h3>
            <p className="text-sm leading-relaxed">
              Premium international imports directly to your business. We specialize in high-demand products with seamless global logistics.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-slate-400 hover:text-white transition-colors"><Globe className="w-5 h-5" /></a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors"><MessageCircle className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Shop All Products</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Wholesale Sourcing</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Track Your Order</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Return Policy</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">About Us</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold mb-4">Top Categories</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Office Furniture</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Industrial Equipment</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Commercial Electronics</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Retail Displays</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-blue-500 shrink-0" />
                <span>123 Global Trade Center, Suite 500<br />New York, NY 10001</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-blue-500 shrink-0" />
                <span>+1 (800) 555-0199</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-blue-500 shrink-0" />
                <span>support@directcrest.com</span>
              </li>
            </ul>
          </div>

        </div>
        
        <div className="mt-16 pt-8 border-t border-navy-700 flex flex-col md:flex-row justify-between items-center text-sm text-slate-400">
          <p>&copy; {new Date().getFullYear()} DirectCrest Inc. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
