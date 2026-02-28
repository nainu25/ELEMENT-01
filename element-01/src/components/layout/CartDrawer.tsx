"use client";

import { useCart } from "@/store/useCart";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CartDrawer() {
    const { items, isOpen, toggleCart, removeItem, updateQuantity, clearCart, getSubtotal } = useCart();
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const router = useRouter();

    const subtotal = getSubtotal();
    const isSampleEligible = items.some(i => i.id === 'discovery-molecule-2ml');

    const handleCheckout = () => {
        setIsCheckingOut(true);
        setTimeout(() => {
            setIsCheckingOut(false);
            toggleCart(false);
            router.push("/checkout");
        }, 800);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => toggleCart(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0A0A0A] text-white z-[201] font-mono flex flex-col border-l border-white/10"
                    >
                        {/* Header */}
                        <header className="p-8 border-b border-white/10 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <ShoppingBag className="w-5 h-5 text-orange-500" />
                                <h2 className="text-xl font-black uppercase tracking-tighter">System_Cart</h2>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] opacity-40 font-black">V1.0.4</span>
                                <button
                                    onClick={() => toggleCart(false)}
                                    className="hover:rotate-90 transition-transform p-2"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </header>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                            {isSampleEligible && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-4 border border-orange-500/30 bg-orange-500/5 text-orange-500 text-[9px] font-black uppercase tracking-widest text-center"
                                >
                                    [ SYSTEM ALERT: THRESHOLD MET. COMPLIMENTARY SPECIMEN ADDED. ]
                                </motion.div>
                            )}

                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center opacity-20 text-center">
                                    <ShoppingBag className="w-16 h-16 mb-4 stroke-1" />
                                    <p className="uppercase text-xs tracking-widest">[ NO_UNITS_ALLOCATED ]</p>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div key={item.id} className="group relative">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="text-sm font-black uppercase tracking-tight group-hover:text-orange-500 transition-colors">
                                                    {item.name}
                                                </h3>
                                                <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">
                                                    Code: {item.formula_code || "E01-MOD"}
                                                </p>
                                            </div>
                                            <p className="font-black text-sm">
                                                {item.price === 0 ? "FREE" : `$${item.price}`}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-white/5 opacity-80 group-hover:opacity-100 transition-opacity">
                                            <div className="flex items-center border border-white/20">
                                                {item.price > 0 ? (
                                                    <>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            className="p-1.5 hover:bg-white/10 transition-colors"
                                                        >
                                                            <Minus className="w-3 h-3" />
                                                        </button>
                                                        <span className="w-8 text-center text-xs font-bold border-x border-white/20">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="p-1.5 hover:bg-white/10 transition-colors"
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <span className="px-4 py-1.5 text-[9px] font-black opacity-40 uppercase">Bonus Unit</span>
                                                )}
                                            </div>
                                            {item.price > 0 && (
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-neutral-500 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <footer className="p-8 bg-black/50 border-t border-orange-500/20 space-y-6">
                                <div className="flex justify-between items-baseline">
                                    <span className="text-[10px] uppercase font-black opacity-40">Subtotal_Molecules</span>
                                    <span className="text-2xl font-black tracking-tighter">${subtotal.toFixed(2)}</span>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    disabled={isCheckingOut}
                                    className="w-full py-5 bg-orange-500 hover:bg-orange-600 text-black font-black uppercase tracking-[0.2em] transition-all relative overflow-hidden group glitch-hover"
                                >
                                    <span className="relative z-10">
                                        {isCheckingOut ? "PROCESSING_PAYLOAD..." : "SIMULATE_ALLOCATION"}
                                    </span>
                                    {isCheckingOut && (
                                        <motion.div
                                            initial={{ x: "-100%" }}
                                            animate={{ x: "100%" }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            className="absolute inset-0 bg-white/20"
                                        />
                                    )}
                                </button>

                                <p className="text-[8px] opacity-30 text-center uppercase tracking-tighter">
                                    Secure laboratory transaction protocol v2.4 // encrypted
                                </p>
                            </footer>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
