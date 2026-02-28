"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useCart } from "@/store/useCart";
import type { Product } from "@/types/databse";

interface AddToBagProps {
    product: Product;
}

export default function AddToBag({ product }: AddToBagProps) {
    const { addItem } = useCart();
    const [status, setStatus] = useState<"idle" | "adding" | "success">("idle");
    const [showDot, setShowDot] = useState(false);

    const handleAdd = () => {
        setStatus("adding");

        // Optimistic update
        addItem(product);

        setTimeout(() => {
            setStatus("success");
            setShowDot(true);
            setTimeout(() => {
                setStatus("idle");
                setShowDot(false);
            }, 2000);
        }, 800);
    };

    return (
        <div className="relative font-mono">
            {/* Flying Orange Dot - Optimistic Animation */}
            <AnimatePresence>
                {showDot && (
                    <motion.div
                        initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                        animate={{
                            x: [0, 100, 300],
                            y: [0, -200, -800],
                            scale: 0.2,
                            opacity: 0
                        }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                        className="fixed w-4 h-4 bg-orange-500 rounded-full z-[9999] pointer-events-none"
                        style={{ left: "50%", top: "50%" }}
                    />
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.02, backgroundColor: "#000", color: "#fff" }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAdd}
                disabled={status !== "idle"}
                className={`w-full py-6 border-2 border-black font-black uppercase tracking-widest text-lg transition-all duration-300 group relative overflow-hidden ${status === "success" ? "bg-orange-500 border-orange-500 text-white" : "bg-white text-black"
                    }`}
            >
                <span className="relative z-10">
                    {status === "idle" && `INITIATE_PURCHASE // $${product.price}`}
                    {status === "adding" && "PROCESSING_SEQUENCES..."}
                    {status === "success" && "SYSTEM_UPDATED_V1.0"}
                </span>

                {/* Processing background animation */}
                {status === "adding" && (
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 bg-neutral-200 pointer-events-none"
                    />
                )}

                {status === "success" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 0.2, repeat: 3 }}
                        className="absolute inset-0 bg-white/20 pointer-events-none"
                    />
                )}
            </motion.button>

            <div className="mt-2 text-[10px] text-neutral-400 uppercase tracking-tighter flex justify-between px-1">
                <span>[ ID: {product.id.slice(0, 8)} ]</span>
                <span className="animate-pulse">AVAILABLE_STOCK: 50 UNITS</span>
            </div>
        </div>
    );
}
