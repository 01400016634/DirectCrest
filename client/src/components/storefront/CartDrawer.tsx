'use client';

import { useCartStore, getEffectivePrice } from '@/store/cartStore';
import { useCurrencyStore, formatPrice } from '@/store/currencyStore';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useEffect, useState } from 'react';

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem } = useCartStore();
  const { currency } = useCurrencyStore();
  const t = useTranslations('Cart');
  const tHeader = useTranslations('Header');
  const [isMounted, setIsMounted] = useState(false);

  // Prevents hydration mismatch since items are loaded from localStorage
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const subtotal = items.reduce((total, item) => total + getEffectivePrice(item) * item.quantity, 0);
  const totalItems = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] transition-opacity"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-[#0f172a] text-white">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5" />
            <h2 className="text-lg font-bold tracking-tight">{tHeader('shoppingCart')}</h2>
            <span className="bg-[#1e3a8a] text-xs py-0.5 px-2 rounded-full font-semibold ml-2">
              {totalItems}
            </span>
          </div>
          <button
            onClick={closeCart}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-full hover:bg-slate-800"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <p className="text-slate-500 font-medium">{t('empty')}</p>
              <button
                onClick={closeCart}
                className="mt-4 px-6 py-2 bg-[#1e3a8a] text-white rounded-lg font-semibold hover:bg-[#172554] transition-colors"
              >
                {t('continueShopping')}
              </button>
            </div>
          ) : (
            <ul className="space-y-6">
              {items.map((item) => (
                <li key={`${item.productId}-${item.variantId || 'base'}`} className="flex gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                  {/* Item Image / Color Block */}
                  <div
                    className="w-20 h-20 rounded-lg flex-shrink-0 border border-slate-200 overflow-hidden flex items-center justify-center bg-slate-50"
                  >
                    {item.color ? (
                      <div className="w-full h-full" style={{ backgroundColor: item.color }} />
                    ) : item.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <ShoppingBag className="w-8 h-8 text-slate-300" />
                    )}
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-sm font-bold text-slate-900 leading-tight">{item.name}</h3>
                        <button
                          onClick={() => removeItem(item.productId, item.variantId)}
                          className="text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-[#1e3a8a] font-bold mt-1">
                        {formatPrice(getEffectivePrice(item), currency)}
                        {item.wholesaleTiers && item.wholesaleTiers.length > 0 && getEffectivePrice(item) < item.price && (
                          <span className="text-xs text-slate-400 line-through ml-2">
                            {formatPrice(item.price, currency)}
                          </span>
                        )}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center mt-3">
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                        <button
                          onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer / Subtotal */}
        {items.length > 0 && (
          <div className="p-6 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-center mb-4">
              <span className="text-slate-600 font-medium">{t('subtotal')}</span>
              <span className="text-xl font-extrabold text-[#0f172a]">{formatPrice(subtotal, currency)}</span>
            </div>
            <p className="text-xs text-slate-500 mb-6">{t('shippingAndTaxes')}</p>

            <Link
              href="/checkout"
              onClick={closeCart}
              className="block w-full py-4 px-4 bg-[#1e3a8a] hover:bg-[#172554] text-white text-center font-bold rounded-xl shadow-md transition-colors"
            >
              {t('checkout')}
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
