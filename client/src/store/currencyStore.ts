import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'AUD' | 'BDT';

interface CurrencyState {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set) => ({
      currency: 'USD',
      setCurrency: (currency) => set({ currency }),
    }),
    {
      name: 'directcrest-currency',
    }
  )
);

// Static exchange rates (base USD)
export const EXCHANGE_RATES: Record<CurrencyCode, number> = {
  USD: 1,
  EUR: 0.93,
  GBP: 0.79,
  JPY: 151.20,
  CAD: 1.36,
  AUD: 1.52,
  BDT: 110.00,
};

export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CAD: 'C$',
  AUD: 'A$',
  BDT: '৳',
};

export const formatPrice = (priceInUSD: number, currency: CurrencyCode = 'USD') => {
  const rate = EXCHANGE_RATES[currency] || 1;
  const symbol = CURRENCY_SYMBOLS[currency] || '$';
  const converted = priceInUSD * rate;
  
  if (currency === 'JPY') {
    return `${symbol}${Math.round(converted)}`;
  }
  return `${symbol}${converted.toFixed(2)}`;
};
