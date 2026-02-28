"use client";

import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setIsLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/success`,
            },
        });

        if (error.type === "card_error" || error.type === "validation_error") {
            setMessage(error.message || "An unexpected error occurred.");
        } else {
            setMessage("An unexpected error occurred.");
        }

        setIsLoading(false);
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit} className="space-y-8 font-mono">
            <div className="space-y-4">
                <header className="flex justify-between items-baseline border-b border-white/10 pb-2">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-orange-500">Secure_Payment_Protocol</h3>
                    <span className="text-[8px] opacity-30">TLS 1.3 / ENCRYPTED</span>
                </header>

                <PaymentElement
                    id="payment-element"
                    options={{
                        layout: "tabs"
                    }}
                />
            </div>

            <button
                disabled={isLoading || !stripe || !elements}
                id="submit"
                className="w-full py-5 bg-white text-black font-black uppercase tracking-[0.2em] hover:bg-orange-500 transition-all relative overflow-hidden group"
            >
                <span id="button-text" className="relative z-10">
                    {isLoading ? "DATA_TRANSMISSION..." : "FINALIZE_ALLOCATION"}
                </span>

                {isLoading && (
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 bg-black/10"
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
                Transactions processed via STRIPE_NODE // No sensitive data stored on local servers
            </footer>
        </form>
    );
}
