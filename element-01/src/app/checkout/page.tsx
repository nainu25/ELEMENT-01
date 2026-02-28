"use client";

import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useCart } from "@/store/useCart";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import * as motion from "framer-motion/client";
import { Lock, ArrowLeft } from "lucide-react";
import Link from "next/link";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_51P...");

export default function CheckoutPage() {
    const { items, getSubtotal } = useCart();
    const [clientSecret, setClientSecret] = useState("");
    const [hasMounted, setHasMounted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setHasMounted(true);
        if (items.length === 0) return;

        fetch("/api/create-payment-intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items }),
        })
            .then((res) => {
                if (!res.ok) throw new Error("LAB_NETWORK_ERROR: Failed to initialize payment tunnel.");
                return res.json();
            })
            .then((data) => setClientSecret(data.clientSecret))
            .catch((err) => {
                console.error(err);
                setError(err.message);
            });
    }, [items]);

    const appearance = {
        theme: 'night' as any,
        variables: {
            colorPrimary: '#ff5f00',
            colorBackground: '#0a0a0a',
            colorText: '#ffffff',
            fontFamily: 'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            borderRadius: '0px',
            spacingUnit: '4px',
        },
        rules: {
            '.Label': {
                textTransform: 'uppercase',
                fontSize: '10px',
                fontWeight: '900',
                letterSpacing: '0.1em',
                marginBottom: '8px'
            },
            '.Input': {
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '12px'
            }
        }
    };

    if (!hasMounted) {
        return (
            <main className="min-h-screen bg-[#F2F2F2] font-mono text-black pt-32 px-8 flex items-center justify-center">
                <div className="animate-pulse text-[10px] font-black uppercase tracking-[0.5em]">Initializing_Secure_Node...</div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#F2F2F2] font-mono text-black pt-32 px-8 pb-32">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

                {/* Back Link */}
                <div className="lg:col-span-12">
                    <Link href="/" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity">
                        <ArrowLeft className="w-4 h-4" />
                        Return_to_Inventory
                    </Link>
                </div>

                {/* Checkout Column */}
                <div className="lg:col-span-7 bg-white border border-black p-12 shadow-xl relative overflow-hidden">
                    <header className="mb-12 border-b-2 border-black pb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 bg-black text-white flex items-center justify-center">
                                <Lock className="w-4 h-4" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">SECURE_NODE_01</span>
                        </div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter">Allocation_Finalization</h1>
                    </header>

                    {error ? (
                        <div className="p-8 border border-red-500/50 bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest text-center space-y-4">
                            <p>[ SYSTEM_ERROR: {error} ]</p>
                            <div className="pt-4 border-t border-red-500/20">
                                <p className="opacity-60 mb-2 whitespace-pre-wrap">CHECK_LABORATORY_CONFIG: STRIPE_SECRET_KEY MISSING</p>
                                <button onClick={() => window.location.reload()} className="bg-red-500 text-white px-4 py-1 text-[8px] hover:bg-black transition-colors uppercase font-black">Reboot_Protocol</button>
                            </div>
                        </div>
                    ) : clientSecret ? (
                        <Elements options={{ clientSecret, appearance }} stripe={stripePromise}>
                            <CheckoutForm />
                        </Elements>
                    ) : (
                        <div className="space-y-8 animate-pulse">
                            <div className="h-10 w-full bg-neutral-100" />
                            <div className="h-40 w-full bg-neutral-100" />
                            <div className="h-12 w-full bg-black/10" />
                        </div>
                    )}
                </div>

                {/* Summary Column */}
                <aside className="lg:col-span-5 space-y-8">
                    <div className="bg-black text-white p-10 border border-black space-y-8">
                        <h2 className="text-xs font-black uppercase tracking-[0.3em] border-b border-white/20 pb-4">Order_Summary</h2>

                        <div className="space-y-6 max-h-[300px] overflow-y-auto custom-scrollbar pr-4">
                            {items.map(item => (
                                <div key={item.id} className="flex justify-between items-start">
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-tight">{item.name}</p>
                                        <p className="text-[8px] opacity-40">Code: {item.formula_code}</p>
                                    </div>
                                    <p className="text-xs font-black">${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>

                        <div className="pt-8 border-t border-white/20 space-y-4">
                            <div className="flex justify-between items-baseline opacity-40">
                                <span className="text-[10px] uppercase font-black">Transport_Fee</span>
                                <span className="text-xs font-black">$0.00 [LAB_CREDIT]</span>
                            </div>
                            <div className="flex justify-between items-baseline">
                                <span className="text-[10px] uppercase font-black text-orange-500">Total_Mass</span>
                                <span className="text-3xl font-black tracking-tighter">${getSubtotal().toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 border border-black/10 text-[9px] uppercase font-black opacity-30 leading-relaxed text-center">
                        Allocation is final once payment protocol is successfully terminated. E01-LABS maintains strict chain-of-custody for all molecular specimens.
                    </div>
                </aside>
            </div>
        </main>
    );
}
