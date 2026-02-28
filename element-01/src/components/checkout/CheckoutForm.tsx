"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useCart } from '@/store/useCart';
import { supabase } from '@/lib/supabase';

export default function CheckoutForm() {
    const router = useRouter();
    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Payment form state
    const [cardDetails, setCardDetails] = useState({
        number: '',
        expiry: '',
        cvc: ''
    });

    const formatCardNumber = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];

        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }

        if (parts.length) {
            return parts.join(' ');
        } else {
            return v;
        }
    };

    const formatExpiry = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (v.length >= 2) {
            return v.slice(0, 2) + '/' + v.slice(2, 4);
        }
        return v;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        let formattedValue = value;

        if (name === 'number') {
            formattedValue = formatCardNumber(value).slice(0, 19);
        } else if (name === 'expiry') {
            formattedValue = formatExpiry(value).slice(0, 5);
        } else if (name === 'cvc') {
            formattedValue = value.replace(/[^0-9]/gi, '').slice(0, 4);
        }

        setCardDetails(prev => ({ ...prev, [name]: formattedValue }));
    };

    const { items, clearCart } = useCart();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        try {
            // Decrement quantities for each item in the cart
            for (const item of items) {
                // Skip virtual specimens/samples not in the database (non-UUID IDs)
                const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(item.id);

                if (!isUUID) {
                    console.info(`[SYSTEM]: Skipping non-registry ID: ${item.id} (VIRTUAL_SPECIMEN)`);
                    continue;
                }

                // Fetch current stock
                const { data: product, error: fetchError } = await supabase
                    .from('products')
                    .select('stock_quantity')
                    .eq('id', item.id)
                    .maybeSingle();

                if (fetchError) {
                    console.error(`[DATABASE_ERROR] FETCH product ${item.id}:`, fetchError);
                    throw fetchError;
                }

                if (product) {
                    const newQuantity = Math.max(0, product.stock_quantity - item.quantity);
                    const { error: updateError } = await supabase
                        .from('products')
                        .update({ stock_quantity: newQuantity })
                        .eq('id', item.id);

                    if (updateError) {
                        console.error(`[DATABASE_ERROR] UPDATE product ${item.id}:`, updateError);
                        throw updateError;
                    }
                } else {
                    console.warn(`[REGISTRY_MISSING]: ID ${item.id} not found. Allocation skipped.`);
                }
            }

            // Clear the cart after successful transaction
            clearCart();

            // Navigate to success page
            router.push('/success');
        } catch (error: any) {
            console.error("ALLOCATION_TERMINAL_FAILURE:", error);
            setMessage(error.message || JSON.stringify(error) || "An unidentified system error occurred during allocation.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit} className="space-y-8 font-mono">
            <div className="space-y-4">
                <header className="flex justify-between items-baseline border-b border-[rgb(var(--border-color)/10%)] pb-2">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-orange-500">Dummy_Payment_Node</h3>
                    <span className="text-[8px] opacity-30 text-[rgb(var(--foreground-rgb))] transition-colors duration-500">OFFLINE_PROTOCOL / LOCAL_SIMULATION</span>
                </header>

                <div className="space-y-4">
                    <div className="border border-[rgb(var(--border-color)/10%)] p-4 bg-orange-50/20">
                        <p className="text-[9px] font-black uppercase tracking-widest text-orange-600 mb-2">Notice:</p>
                        <p className="text-[8px] opacity-60 uppercase leading-relaxed font-black">
                            STRIPE_NODE is currently offline. Running DUMMY_TRANSACTION protocol for development validation. No financial transmission will be initiated.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest opacity-50">Card_ID</label>
                            <input
                                required
                                type="text"
                                name="number"
                                value={cardDetails.number}
                                onChange={handleInputChange}
                                placeholder="4242 4242 4242 4242"
                                className="w-full bg-[rgb(var(--background-rgb))] border border-[rgb(var(--border-color)/10%)] p-3 text-[10px] focus:border-orange-500 outline-none transition-colors text-[rgb(var(--foreground-rgb))]"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-widest opacity-50">Expiry</label>
                                <input
                                    required
                                    type="text"
                                    name="expiry"
                                    value={cardDetails.expiry}
                                    onChange={handleInputChange}
                                    placeholder="MM/YY"
                                    className="w-full bg-[rgb(var(--background-rgb))] border border-[rgb(var(--border-color)/10%)] p-3 text-[10px] focus:border-orange-500 outline-none transition-colors text-[rgb(var(--foreground-rgb))]"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-widest opacity-50">CVC</label>
                                <input
                                    required
                                    type="text"
                                    name="cvc"
                                    value={cardDetails.cvc}
                                    onChange={handleInputChange}
                                    placeholder="123"
                                    className="w-full bg-[rgb(var(--background-rgb))] border border-[rgb(var(--border-color)/10%)] p-3 text-[10px] focus:border-orange-500 outline-none transition-colors text-[rgb(var(--foreground-rgb))]"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <button
                disabled={isLoading}
                id="submit"
                className="w-full py-5 bg-[rgb(var(--foreground-rgb))] text-[rgb(var(--background-rgb))] border border-[rgb(var(--border-color)/10%)] font-black uppercase tracking-[0.2em] hover:bg-orange-500 transition-all relative overflow-hidden group shadow-md transition-colors duration-500"
            >
                <span id="button-text" className="relative z-10 group-hover:text-[rgb(var(--background-rgb))]">
                    {isLoading ? "TRANSMITTING_DATA..." : "FINALIZE_ALLOCATION"}
                </span>

                {isLoading && (
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 bg-[rgb(var(--foreground-rgb)/10%)]"
                    />
                )}
            </button>

            {/* Error messages */}
            {message && (
                <div id="payment-message" className="p-4 border border-red-500/50 bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest text-center animate-pulse">
                    [ SYSTEM_ERROR: {message} ]
                </div>
            )}

            <footer className="pt-4 text-[8px] opacity-20 text-center uppercase tracking-widest leading-relaxed">
                SIMULATED_TRANSACTION_PROTOCOL // FOR_TESTING_PURPOSES_ONLY
            </footer>
        </form>
    );
}
