"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, QrCode, Printer } from "lucide-react";
import { useCart } from "@/store/useCart";

export default function SuccessPage() {
    const [orderId, setOrderId] = useState<string>('');

    const { clearCart } = useCart();

    useEffect(() => {
        setOrderId(Math.random().toString(36).substring(2, 10).toUpperCase());
        clearCart();
    }, [clearCart]);

    const receiptLines = [
        "AUTHENTICATION_PROTOCOL_V4.2 [SUCCESS]",
        `TXID: E01-REC-${orderId}`,
        "TIMESTAMP: " + new Date().toISOString(),
        "STATUS: MOLECULAR_ALLOCATION_CONFIRMED",
        "------------------------------------",
        "PACKAGING_QUEUE: [003]",
        "LOGISTICS_STATUS: PRE-ORDER_READY",
        "SYSTEM_MESSAGE: PLEASE_AWAIT_DISPATCH.",
        "------------------------------------"
    ];

    return (
        <main className="min-h-screen bg-[rgb(var(--background-rgb))] font-mono text-[rgb(var(--foreground-rgb))] pt-32 px-8 pb-16 flex flex-col items-center transition-colors duration-500 print:bg-white print:pt-0">
            <div className="max-w-xl w-full border border-[rgb(var(--border-color))] bg-[rgb(var(--card-bg))] p-10 shadow-2xl relative overflow-hidden transition-colors duration-500 print:shadow-none print:border-none print:bg-white">
                {/* Decoration */}
                <div className="absolute top-0 right-0 p-6 opacity-10 print:opacity-5">
                    <QrCode className="w-20 h-20" />
                </div>

                <header className="mb-8 border-b-2 border-dashed border-[rgb(var(--border-color))] pb-6">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="bg-green-500 text-white w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors duration-500 print:bg-black"
                    >
                        <CheckCircle2 className="w-10 h-10" />
                    </motion.div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter mb-1">RECEIPT_GENERATED</h1>
                    <p className="text-[9px] uppercase font-black tracking-widest opacity-40">Payment Transmission Confirmed // System Verified</p>
                </header>

                {/* Dot-matrix style printout */}
                <div className="bg-[rgb(var(--foreground-rgb)/3%)] border border-[rgb(var(--border-color))] p-6 space-y-3 shadow-inner relative transition-colors duration-500 print:bg-white print:shadow-none">
                    <div className="absolute top-4 right-4 animate-pulse print:hidden">
                        <Printer className="w-4 h-4 opacity-20" />
                    </div>
                    {receiptLines.map((line, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + (i * 0.1), ease: "easeOut" }}
                            className="text-[10px] font-black uppercase tracking-tighter border-l-2 border-orange-500 pl-3 py-0.5 print:border-black"
                        >
                            {line}
                        </motion.div>
                    ))}

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2 }}
                        className="pt-6 border-t border-dashed border-[rgb(var(--border-color)/20%)] text-[8px] opacity-40 uppercase tracking-widest leading-relaxed transition-colors duration-500 print:opacity-100"
                    >
                        Disclaimer: This document is a digital representation of molecular system allocation. Actual specimen delivery is subject to laboratory processing times and regional atmospheric constraints.
                    </motion.div>
                </div>

                <footer className="mt-8 flex flex-col sm:flex-row gap-4 print:hidden">
                    <Link
                        href="/"
                        className="flex-1 text-center py-3 border-2 border-[rgb(var(--border-color))] font-black uppercase tracking-widest text-[10px] hover:bg-[rgb(var(--foreground-rgb))] hover:text-[rgb(var(--background-rgb))] transition-all transition-colors duration-500"
                    >
                        [ Return_to_Lab_Index ]
                    </Link>
                    <button
                        onClick={() => window.print()}
                        className="flex-1 text-center py-3 bg-orange-500 text-black font-black uppercase tracking-widest text-[10px] hover:bg-[rgb(var(--foreground-rgb))] hover:text-[rgb(var(--background-rgb))] transition-all transition-colors duration-500"
                    >
                        [ ARCHIVE_DOCUMENT ]
                    </button>
                </footer>
            </div>

            <div className="mt-8 text-[9px] opacity-40 flex gap-10 font-black uppercase tracking-widest print:opacity-100">
                <span>ELEMENT-01 / V4.2</span>
                <span>LOGISTICS_NODE_NYC_HUB</span>
                <span>EST_ARRIVAL: 3-5 DAYS</span>
            </div>
        </main >
    );
}
