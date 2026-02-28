import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/types/databse';

export interface CartItem extends Product {
    quantity: number;
}

const SAMPLE_ID = 'discovery-molecule-2ml';

const SAMPLE_PRODUCT: Product = {
    id: SAMPLE_ID,
    name: '2ml Discovery Molecule',
    price: 0.0,
    formula_code: 'COMP_SPECIMEN',
    slug: 'discovery-molecule-sample',
    brand: 'ELEMENT 01',
    description: 'System threshold bonus discovery specimen.',
    stock_quantity: 999,
    created_at: new Date().toISOString(),
    concentration: 'Sample',
    molecular_weight: 'N/A',
    longevity_hours: 4,
    sillage_rank: 1,
    image_url: null,
};

interface CartStore {
    items: CartItem[];
    isOpen: boolean;
    addItem: (product: Product) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    toggleCart: (open?: boolean) => void;
    clearCart: () => void;
    getSubtotal: () => number;
    isSampleEligible: () => boolean;
}

const syncSample = (items: CartItem[]): CartItem[] => {
    // Calculate subtotal EXCLUDING the sample itself
    const subtotal = items
        .filter(i => i.id !== SAMPLE_ID)
        .reduce((acc, item) => acc + item.price * item.quantity, 0);

    const hasSample = items.some(i => i.id === SAMPLE_ID);

    if (subtotal > 100 && !hasSample) {
        return [...items, { ...SAMPLE_PRODUCT, quantity: 1 }];
    } else if (subtotal <= 100 && hasSample) {
        return items.filter(i => i.id !== SAMPLE_ID);
    }

    return items;
};

export const useCart = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,
            addItem: (product) =>
                set((state) => {
                    const existingItem = state.items.find((item) => item.id === product.id);
                    let newItems;
                    if (existingItem) {
                        newItems = state.items.map((item) =>
                            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                        );
                    } else {
                        newItems = [...state.items, { ...product, quantity: 1 }];
                    }

                    return {
                        items: syncSample(newItems),
                        isOpen: state.items.length === 0 ? true : state.isOpen
                    };
                }),
            removeItem: (productId) =>
                set((state) => ({
                    items: syncSample(state.items.filter((item) => item.id !== productId)),
                })),
            updateQuantity: (productId, quantity) =>
                set((state) => ({
                    items: syncSample(state.items.map((item) =>
                        item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
                    )),
                })),
            toggleCart: (open) =>
                set((state) => ({
                    isOpen: open !== undefined ? open : !state.isOpen
                })),
            clearCart: () => set({ items: [] }),
            getSubtotal: () => get().items.reduce((acc, item) => acc + item.price * item.quantity, 0),
            isSampleEligible: () => get().getSubtotal() >= 100,
        }),
        {
            name: 'element-01-cart',
        }
    )
);
