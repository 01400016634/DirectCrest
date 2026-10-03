'use client';

import { Link, usePathname, useRouter } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import { ShoppingCart, Search, User, Menu } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { useCartStore } from '@/store/cartStore';
import { useCurrencyStore, CurrencyCode, CURRENCY_SYMBOLS } from '@/store/currencyStore';
import { useEffect, useState } from 'react';
import CartDrawer from '@/components/storefront/CartDrawer';
import { AnimatePresence, motion } from 'framer-motion';

export default function Header({ settings }: { settings?: any }) {
  const t = useTranslations('Header');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.replace(pathname, { locale: e.target.value });
  };

  const { items, toggleCart } = useCartStore();
  const { currency, setCurrency } = useCurrencyStore();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
    });
    return () => unsubscribe();
  }, []);

  const totalItems = items.reduce((count, item) => count + item.quantity, 0);

  const getHref = (label: string) => {
    const lower = label.toLowerCase();
    if (lower.includes('shop') || lower.includes('product') || lower.includes('categor')) return '/products';
    if (lower.includes('track')) return '/track-order';
    if (lower.includes('about')) return '/#about';
    if (lower.includes('contact')) return '/#contact';
    return `/#${lower.replace(/\s+/g, '-')}`;
  };

  const navLinks = settings?.navbarLinks 
    ? settings.navbarLinks.split(',').map((label: string) => ({
        label: label.trim(),
        href: getHref(label.trim())
      }))
    : [
        { label: 'Shop', href: '/products' },
        { label: 'Trending Products', href: '/#trending' },
        { label: 'Categories', href: '/products' },
        { label: 'Track Order', href: '/track-order' },
        { label: 'About Us', href: '/#about' },
      ];

  return (
    <div className="w-full flex flex-col z-50">
      {/* Utility Promo Banner */}
      <div className="w-full bg-gradient-to-r from-blue-900 via-blue-800 to-[#ff3fa4]/80 text-white text-xs sm:text-sm font-semibold py-2 px-4 text-center tracking-wide flex justify-center items-center gap-2 border-b border-blue-400/20">
        <span className="animate-pulse">🎁</span>
        <span>FIRST ORDER PROMO: Get 10% off your entire cart (up to ৳5,000). Sign up today!</span>
      </div>

      <header className="sticky top-0 w-full bg-[#04060f]/80 backdrop-blur-md border-b border-blue-900/40 shadow-sm z-[100]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-blue-100 hover:text-white p-2 transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl leading-none">D</span>
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight drop-shadow-md">
                DirectCrest
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-8">
            {navLinks.map((link: any, idx: number) => (
              <Link key={idx} href={link.href} className="text-sm font-semibold text-blue-100 hover:text-white transition-colors">
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3 sm:space-x-6">
            <select
              value={locale}
              onChange={handleLanguageChange}
              className="bg-transparent text-sm font-semibold text-blue-100 hover:text-white focus:outline-none cursor-pointer hidden sm:block"
            >
              <option value="en" className="bg-[#04060f] text-white">EN</option>
              <option value="bn" className="bg-[#04060f] text-white">BN</option>
              <option value="zh" className="bg-[#04060f] text-white">ZH (中文)</option>
              <option value="ja" className="bg-[#04060f] text-white">JA</option>
            </select>
            {mounted && (
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                className="bg-transparent text-sm font-semibold text-blue-100 hover:text-white focus:outline-none cursor-pointer hidden sm:block"
              >
                {Object.keys(CURRENCY_SYMBOLS).map((c) => (
                  <option key={c} value={c} className="bg-[#04060f] text-white">{c}</option>
                ))}
              </select>
            )}
            <button className="text-blue-100 hover:text-white transition-colors">
              <Search className="h-5 w-5" />
            </button>
            <div className="hidden sm:flex items-center gap-4 text-sm font-semibold relative">
              {mounted && firebaseUser ? (
                <div className="relative">
                  <button 
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="text-blue-100 hover:text-white transition-colors flex items-center gap-2 bg-blue-900/30 px-3 py-1.5 rounded-md border border-blue-500/20"
                  >
                    {firebaseUser.photoURL ? (
                      <img src={firebaseUser.photoURL} alt="Profile" className="w-5 h-5 rounded-full object-cover" />
                    ) : (
                      <User className="h-4 w-4" /> 
                    )}
                    <span className="truncate max-w-[120px]">
                      {firebaseUser.displayName || firebaseUser.email?.split('@')[0]}
                    </span>
                  </button>
                  
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-[#0a0f1a] border border-blue-900/40 rounded-xl shadow-2xl py-2 z-[9999]">
                      <button 
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          router.push('/account');
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-blue-100 hover:text-white hover:bg-blue-900/40"
                      >
                        Customer Dashboard
                      </button>
                      <button 
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          router.push('/account#profile');
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-blue-100 hover:text-white hover:bg-blue-900/40"
                      >
                        Profile Details
                      </button>
                      <button 
                        onClick={() => {
                          signOut(auth);
                          setIsProfileDropdownOpen(false);
                          router.push('/');
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link href="/login" className="text-blue-100 hover:text-white transition-colors flex items-center gap-2">
                    <User className="h-5 w-5" /> Login
                  </Link>
                  <Link href="/login" className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-md transition-colors">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
            <button 
              onClick={toggleCart} 
              className="text-blue-100 hover:text-white transition-colors relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#dc2626] text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#04060f]/95 backdrop-blur-xl border-b border-blue-900/40 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 flex flex-col space-y-4">
              {navLinks.map((link: any, idx: number) => (
                <Link 
                  key={idx} 
                  href={link.href} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-semibold text-blue-100 hover:text-white transition-colors block py-2 border-b border-white/5"
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="flex items-center gap-6 pt-4">
                <select
                  value={locale}
                  onChange={(e) => { handleLanguageChange(e); setIsMobileMenuOpen(false); }}
                  className="bg-[#0f172a] text-sm font-semibold text-white px-3 py-2 rounded-lg border border-blue-900/40 focus:outline-none flex-1"
                >
                  <option value="en">English (EN)</option>
                  <option value="bn">Bengali (BN)</option>
                  <option value="zh">Chinese (中文)</option>
                  <option value="ja">Japanese (JA)</option>
                </select>
                
                {mounted && (
                  <select
                    value={currency}
                    onChange={(e) => { setCurrency(e.target.value as CurrencyCode); setIsMobileMenuOpen(false); }}
                    className="bg-[#0f172a] text-sm font-semibold text-white px-3 py-2 rounded-lg border border-blue-900/40 focus:outline-none flex-1"
                  >
                    {Object.keys(CURRENCY_SYMBOLS).map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </header>
      <CartDrawer />
    </div>
  );
}
