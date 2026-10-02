import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ProductCard from '../components/product/ProductCard';
import { ArrowRight, Search, Mic, MicOff } from 'lucide-react';

// Speech Recognition Abstraction
const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
const isSpeechSupported = !!SpeechRecognitionAPI;

const SUPPORTED_LANGUAGES = [
  { code: 'en-US', name: 'English' },
  { code: 'bn-BD', name: 'Bangla' },
  { code: 'hi-IN', name: 'Hindi' },
  { code: 'ur-PK', name: 'Urdu' },
  { code: 'zh-CN', name: 'Chinese' },
  { code: 'ja-JP', name: 'Japanese' }
];

const ProductSection = ({ title, products, emptyMsg, linkUrl, loading }: { title: string, products: any[], emptyMsg: string, linkUrl?: string, loading: boolean }) => {
  if (loading) {
    return (
      <div className="py-12">
        <div className="h-8 bg-slate-200 rounded w-48 mb-8 animate-pulse"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="h-80 bg-slate-100 rounded-2xl animate-pulse"></div>)}
        </div>
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <div className="py-12 border-t border-slate-100">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-navy-900">{title}</h2>
        {linkUrl && (
          <Link to={linkUrl} className="flex items-center space-x-1 text-sm font-semibold text-blue-600 hover:text-blue-700">
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [speechLang, setSpeechLang] = useState('en-US');
  
  const [featured, setFeatured] = useState<any[]>([]);
  const [trending, setTrending] = useState<any[]>([]);
  const [newArrivals, setNewArrivals] = useState<any[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
        
        const fetchSection = async (query: string) => {
          const res = await fetch(`${apiUrl}/api/products?status=PUBLISHED&limit=4&${query}`);
          if (res.ok) {
            const data = await res.json();
            return data.products || [];
          }
          return [];
        };

        const promises = [
          fetchSection('isFeatured=true'),
          fetchSection('isTrending=true'),
          fetchSection('isNewArrival=true')
        ];

        let recentIds = [];
        try {
          recentIds = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
        } catch (e) {}

        if (recentIds.length > 0) {
          promises.push(fetchSection(`ids=${recentIds.join(',')}&limit=4`));
        } else {
          promises.push(Promise.resolve([]));
        }

        const [feat, trend, newArr, recent] = await Promise.all(promises);
        
        setFeatured(feat);
        setTrending(trend);
        setNewArrivals(newArr);
        setRecentlyViewed(recent);

      } catch (err) {
        console.error('Failed to fetch homepage data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const handleSearch = async (e?: React.FormEvent, transcript?: string) => {
    if (e) e.preventDefault();
    const query = transcript || searchQuery;
    if (!query.trim()) return;

    setIsParsing(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
      const res = await fetch(`${apiUrl}/api/products/parse-query?q=${encodeURIComponent(query)}`);
      
      if (res.ok) {
        const parsed = await res.json();
        
        // Construct query params
        const params = new URLSearchParams();
        if (parsed.search) params.append('search', parsed.search);
        if (parsed.brandId) params.append('brandId', parsed.brandId);
        if (parsed.countryId) params.append('countryId', parsed.countryId);
        if (parsed.minPrice) params.append('minPrice', parsed.minPrice.toString());
        if (parsed.maxPrice) params.append('maxPrice', parsed.maxPrice.toString());
        if (parsed.condition) params.append('condition', parsed.condition);
        if (parsed.wholesale) params.append('hasWholesale', 'true');
        
        navigate(`/shop?${params.toString()}`);
      } else {
        // Fallback
        navigate(`/shop?search=${encodeURIComponent(query)}`);
      }
    } catch (err) {
      navigate(`/shop?search=${encodeURIComponent(query)}`);
    } finally {
      setIsParsing(false);
    }
  };

  const startVoiceSearch = () => {
    if (!isSpeechSupported || isListening) return;
    
    const recognition = new SpeechRecognitionAPI();
    recognition.lang = speechLang;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      // Execute search immediately after speech using parser
      handleSearch(undefined, transcript);
    };
    
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };
    
    try {
      recognition.start();
    } catch (e) {
      console.error('Failed to start speech recognition', e);
      setIsListening(false);
    }
  };



  return (
    <div className="bg-white min-h-screen">
      
      {/* Hero Section */}
      <div className="bg-navy-900 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-900/20 mix-blend-multiply pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            {t('home.hero_title')} <span className="text-blue-400">{t('home.hero_subtitle')}</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10">
            {t('home.hero_desc')}
          </p>
          
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto relative flex flex-col md:flex-row items-center space-y-4 md:space-y-0">
            <div className="relative flex-1 w-full flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('home.search_placeholder')} 
                className="w-full pl-12 pr-32 md:pr-48 py-4 rounded-full text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xl"
              />
              
              {isSpeechSupported && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center bg-slate-50 rounded-full border border-slate-200">
                  <select 
                    value={speechLang}
                    onChange={(e) => setSpeechLang(e.target.value)}
                    className="bg-transparent py-2 pl-3 pr-1 text-xs text-slate-600 focus:outline-none font-medium cursor-pointer"
                  >
                    {SUPPORTED_LANGUAGES.map(lang => (
                      <option key={lang.code} value={lang.code}>{lang.name}</option>
                    ))}
                  </select>
                  <button 
                    type="button" 
                    onClick={startVoiceSearch}
                    className={`p-2 rounded-full transition-colors ${isListening ? 'text-red-500 bg-red-100 animate-pulse' : 'text-slate-500 hover:bg-slate-200 hover:text-navy-900'}`}
                    title="Search by voice"
                  >
                    {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                  </button>
                </div>
              )}
            </div>
            
            <button type="submit" disabled={isParsing} className="md:absolute right-2 md:right-4 md:top-1/2 md:-translate-y-1/2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-8 py-2.5 rounded-full font-bold transition-colors w-full md:w-auto mt-4 md:mt-0 z-10 md:-mr-2 shadow-md">
              {isParsing ? 'Parsing...' : 'Search'}
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ProductSection title={t('home.recently_viewed')} products={recentlyViewed} emptyMsg="No history yet." loading={loading} />
        <ProductSection title={t('home.featured')} products={featured} emptyMsg="Check back soon." linkUrl="/shop?isFeatured=true" loading={loading} />
        <ProductSection title={t('home.trending')} products={trending} emptyMsg="Check back soon." linkUrl="/shop?isTrending=true" loading={loading} />
        <ProductSection title={t('home.new_arrivals')} products={newArrivals} emptyMsg="Check back soon." linkUrl="/shop?isNewArrival=true" loading={loading} />
      </div>

    </div>
  );
}
