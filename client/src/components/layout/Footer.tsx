import Link from 'next/link';

export default function Footer({ settings }: { settings?: any }) {
  return (
    <footer className="bg-[#0f172a] border-t border-slate-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl leading-none">D</span>
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                DirectCrest
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              {settings?.aboutUsText || "Your gateway to direct China sourcing. High-quality products, wholesale prices, delivered anywhere."}
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 tracking-wider text-sm uppercase">Shop</h3>
            <ul className="space-y-3">
              <li><Link href="/products" className="text-slate-400 hover:text-white transition-colors text-sm">All Products</Link></li>

              <li><Link href="/featured" className="text-slate-400 hover:text-white transition-colors text-sm">Featured</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 tracking-wider text-sm uppercase">Company</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-slate-400 hover:text-white transition-colors text-sm">About Us</Link></li>
              <li><Link href="/sourcing" className="text-slate-400 hover:text-white transition-colors text-sm">China Sourcing</Link></li>
              <li><Link href="/contact" className="text-slate-400 hover:text-white transition-colors text-sm">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 tracking-wider text-sm uppercase">Legal</h3>
            <ul className="space-y-3">
              <li><Link href="/terms" className="text-slate-400 hover:text-white transition-colors text-sm">Terms of Service</Link></li>
              <li><Link href="/privacy" className="text-slate-400 hover:text-white transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link href="/shipping" className="text-slate-400 hover:text-white transition-colors text-sm">Shipping Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} DirectCrest. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
