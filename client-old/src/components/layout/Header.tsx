import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, Heart, User, Search, Menu, X, Globe, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
  const { i18n } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const toggleLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setIsMobileMenuOpen(false);
  };
  
  const languages = [
    { code: 'en', name: 'EN' },
    { code: 'bn', name: 'BN' },
    { code: 'zh', name: 'ZH' },
    { code: 'ja', name: 'JA' }
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-bold text-navy-900 tracking-tight">Direct<span className="text-blue-600">Crest</span></span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/shop" className="text-slate-600 hover:text-navy-900 font-medium transition-colors">Products</Link>
            <Link to="/shop?category=all" className="text-slate-600 hover:text-navy-900 font-medium transition-colors">Categories</Link>
            <Link to="/shop?wholesale=true" className="text-slate-600 hover:text-navy-900 font-medium transition-colors">Wholesale</Link>
            <Link to="/about" className="text-slate-600 hover:text-navy-900 font-medium transition-colors">About</Link>
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="relative group cursor-pointer">
              <Search className="w-5 h-5 text-slate-500 hover:text-navy-900 transition-colors" />
            </div>
            
            <div className="relative group">
              <button 
                className="flex items-center space-x-1 text-slate-500 hover:text-navy-900 transition-colors"
                title="Change Language"
              >
                <Globe className="w-5 h-5" />
                <span className="text-sm font-medium uppercase">{i18n.language}</span>
              </button>
              
              <div className="absolute right-0 mt-2 w-24 bg-white rounded-md shadow-lg py-1 z-50 hidden group-hover:block border border-slate-100">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => toggleLanguage(lang.code)}
                    className={`block w-full text-left px-4 py-2 text-sm ${i18n.language === lang.code ? 'bg-slate-100 text-blue-600 font-bold' : 'text-slate-700 hover:bg-slate-50'}`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4 border-l border-slate-200 pl-6">
              {user ? (
                <div className="relative group flex items-center">
                  <Link to="/profile" className="flex items-center space-x-2 text-slate-500 hover:text-navy-900 transition-colors mr-4">
                    <User className="w-5 h-5" />
                    <span className="text-sm font-medium hidden md:block">{user.firstName || user.email.split('@')[0]}</span>
                  </Link>
                  <button onClick={logout} className="text-slate-500 hover:text-red-500 transition-colors" title="Logout">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2 mr-4">
                  <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Sign in</Link>
                  <span className="text-slate-300">|</span>
                  <Link to="/register" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Register</Link>
                </div>
              )}
              
              <Link to="/wishlist" className="text-slate-500 hover:text-red-500 transition-colors">
                <Heart className="w-5 h-5" />
              </Link>
              <Link to="/cart" className="text-slate-500 hover:text-navy-900 transition-colors relative">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  0
                </span>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden space-x-4">
            <button className="text-slate-500 hover:text-navy-900">
              <ShoppingCart className="w-6 h-6" />
            </button>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-500 hover:text-navy-900 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-4">
          <a href="#" className="block text-slate-600 font-medium py-2">Products</a>
          <a href="#" className="block text-slate-600 font-medium py-2">Categories</a>
          <a href="#" className="block text-slate-600 font-medium py-2">Wholesale</a>
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="flex space-x-4">
              <User className="w-6 h-6 text-slate-500" />
              <Heart className="w-6 h-6 text-slate-500" />
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-slate-500" />
              <div className="flex space-x-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => toggleLanguage(lang.code)}
                    className={`px-2 py-1 text-xs rounded ${i18n.language === lang.code ? 'bg-blue-100 text-blue-600 font-bold' : 'text-slate-500 bg-slate-100'}`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
