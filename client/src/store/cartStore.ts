import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type WholesaleTier = {
  minQuantity: number;
  price: number;
};

export type CartItem = {
  productId: string;
  product?: any;
  variantId?: string;
  weight?: number;
  name: string;
  price: number;
  wholesaleTiers?: WholesaleTier[];
  color?: string;
  imageUrl?: string;
  quantity: number;
};

export function getEffectivePrice(item: CartItem) {
  let effectivePrice = item.price;
  if (item.wholesaleTiers && item.wholesaleTiers.length > 0) {
    const sortedTiers = [...item.wholesaleTiers].sort((a, b) => b.minQuantity - a.minQuantity);
    const applicableTier = sortedTiers.find(tier => item.quantity >= tier.minQuantity);
    if (applicableTier) {
      effectivePrice = applicableTier.price;
    }
  }
  return effectivePrice || 0;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, variantId: string | undefined, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set({ isOpen: !get().isOpen }),
      addItem: (item) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(
          i => i.productId === item.productId && i.variantId === item.variantId
        );
        
        if (existingItem) {
          set({
            items: currentItems.map(i => 
              (i.productId === item.productId && i.variantId === item.variantId)
                ? { ...i, quantity: i.quantity + (item.quantity || 1) }
                : i
            ),
            isOpen: true
          });
        } else {
          set({ 
            items: [...currentItems, { ...item, quantity: item.quantity || 1 } as CartItem],
            isOpen: true
          });
        }
      },
      removeItem: (productId, variantId) => set({
        items: get().items.filter(i => !(i.productId === productId && i.variantId === variantId))
      }),
      updateQuantity: (productId, variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantId);
          return;
        }
        set({
          items: get().items.map(i => 
            (i.productId === productId && i.variantId === variantId) ? { ...i, quantity } : i
          )
        });
      },
      clearCart: () => set({ items: [] }),
      get total() {
        return get().items.reduce((total, item) => total + (getEffectivePrice(item) * item.quantity), 0);
      }
    }),
    {
      name: 'directcrest-cart',
    }
  )
);
