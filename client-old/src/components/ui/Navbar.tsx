import { useTranslation } from 'react-i18next';

export default function Navbar() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'zh' : 'en');
  };

  return (
    <nav className="bg-navy-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <span className="text-2xl font-bold tracking-wider">DIRECTCREST</span>
          </div>
          <div className="flex items-center space-x-6">
            <button className="hover:text-blue-300 transition-colors font-medium">Shop</button>
            <button className="hover:text-blue-300 transition-colors font-medium">Categories</button>
            <button onClick={toggleLanguage} className="bg-navy-700 px-3 py-1 rounded border border-navy-700 hover:border-white transition-all text-sm font-semibold">
              {i18n.language === 'en' ? '中文' : 'EN'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
