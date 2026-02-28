"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useCart } from '@/store/useCart';
import { motion } from 'framer-motion';

export default function Navbar() {
    const [systemTime, setSystemTime] = useState<string>('');
    const { items, toggleCart } = useCart();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        setSystemTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
        const timer = setInterval(() => {
            setSystemTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <nav className="fixed top-0 left-0 w-full flex items-center justify-between px-6 py-4 text-[10px] md:text-xs uppercase border-b border-black bg-white/80 backdrop-blur-md z-[100] transition-all duration-300">
            <div className="flex gap-4 md:gap-6 items-center">
                <Link href="/" className="font-bold tracking-widest text-[rgb(var(--accent))] flex items-center gap-2">
                    <div className="w-2 h-2 bg-[rgb(var(--accent))] animate-pulse" />
                    ELEMENT-01
                </Link>
                <span className="hidden sm:inline-block text-neutral-500 font-medium w-24">
                    {systemTime ? `SYS_TIME: ${systemTime}` : 'SYS_TIME: --:--:--'}
                </span>
            </div>

            <div className="flex gap-4 md:gap-6 tracking-wide font-medium">
                <Link href="/" className="hover:text-[rgb(var(--accent))] transition-colors">
                    INDEX
                </Link>
                <Link href="/quiz" className="hover:text-orange-500 transition-colors uppercase font-black">
                    Scent_Discovery
                </Link>
                <button
                    onClick={() => toggleCart(true)}
                    className="hover:text-[rgb(var(--accent))] transition-colors flex items-center gap-1 group"
                >
                    BAG [{isMounted ? itemCount : 0}]
                    {isMounted && itemCount > 0 && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-1.5 h-1.5 bg-orange-500 rounded-full"
                        />
                    )}
                </button>
            </div>
        </nav>
    );
}
