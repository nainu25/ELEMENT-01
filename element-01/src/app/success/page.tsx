"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, QrCode, Printer } from "lucide-react";

export default function SuccessPage() {
    const [orderId, setOrderId] = useState<string>('');

    useEffect(() => {
        setOrderId(Math.random().toString(36).substring(2, 10).toUpperCase());
    }, []);

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
        <main className="min-h-screen bg-[#F2F2F2] font-mono text-black pt-32 px-8 pb-32 flex flex-col items-center">
            <div className="max-w-2xl w-full border border-black bg-white p-12 shadow-2xl relative overflow-hidden">
                {/* Decoration */}
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <QrCode className="w-24 h-24" />
                </div>

                <header className="mb-12 border-b-2 border-dashed border-black pb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="bg-green-500 text-white w-16 h-16 rounded-full flex items-center justify-center mb-6"
                    >
                        <CheckCircle2 className="w-10 h-10" />
                    </motion.div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">RECEIPT_GENERATED</h1>
                    <p className="text-[10px] uppercase font-black tracking-widest opacity-40">Payment Transmission Confirmed // System Verified</p>
                </header>

                {/* Dot-matrix style printout */}
                <div className="bg-neutral-50 border border-black p-8 space-y-4 shadow-inner relative">
                    <div className="absolute top-4 right-4 animate-pulse">
                        <Printer className="w-4 h-4 opacity-20" />
                    </div>
                    {receiptLines.map((line, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + (i * 0.1), ease: "easeOut" }}
                            className="text-xs font-black uppercase tracking-tighter border-l-2 border-orange-500 pl-4 py-1"
                        >
                            {line}
                        </motion.div>
                    ))}

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2 }}
                        className="pt-8 border-t border-dashed border-black/20 text-[8px] opacity-40 uppercase tracking-widest leading-relaxed"
                    >
                        Disclaimer: This document is a digital representation of molecular system allocation. Actual specimen delivery is subject to laboratory processing times and regional atmospheric constraints.
                    </motion.div>
                </div>

                <footer className="mt-12 flex flex-col sm:flex-row gap-6">
                    <Link
                        href="/"
                        className="flex-1 text-center py-4 border-2 border-black font-black uppercase tracking-widest text-xs hover:bg-black hover:text-white transition-all"
                    >
                        [ Return_to_Lab_Index ]
                    </Link>
                    <button
                        onClick={() => window.print()}
                        className="flex-1 text-center py-4 bg-orange-500 text-black font-black uppercase tracking-widest text-xs hover:bg-black hover:text-white transition-all"
                    >
                        [ ARCHIVE_DOCUMENT ]
                    </button>
                </footer>
            </div>

            <div className="mt-12 text-[10px] opacity-40 flex gap-12 font-black uppercase tracking-widest">
                <span>ELEMENT-01 / V4.2</span>
                <span>LOGISTICS_NODE_NYC_HUB</span>
                <span>EST_ARRIVAL: 3-5 DAYS</span>
            </div>
        </main>
    );
}
