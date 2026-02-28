"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useCart } from '@/store/useCart';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

export default function Navbar() {
    const { theme, setTheme } = useTheme();
    const [systemTime, setSystemTime] = useState<string>('');
    const { items, toggleCart } = useCart();
    const { user, signOut } = useAuth();
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
        <nav className="fixed top-0 left-0 w-full flex items-center justify-between px-6 py-4 text-[10px] md:text-xs uppercase border-b border-[rgb(var(--border-color))] bg-[rgb(var(--card-bg)/80%)] backdrop-blur-md z-[100] transition-all duration-300">
            <div className="flex gap-4 md:gap-6 items-center">
                <Link href="/" className="font-bold tracking-widest text-[rgb(var(--accent))] flex items-center gap-2">
                    <div className="w-2 h-2 bg-[rgb(var(--accent))] animate-pulse" />
                    ELEMENT-01
                </Link>
                <span className="hidden sm:inline-block text-neutral-500 font-medium w-24">
                    {systemTime ? `SYS_TIME: ${systemTime}` : 'SYS_TIME: --:--:--'}
                </span>
            </div>

            <div className="flex gap-4 md:gap-4 tracking-wide font-medium items-center">
                <Link href="/" className="hover:text-[rgb(var(--accent))] transition-colors hidden md:block">
                    INDEX
                </Link>
                <Link href="/quiz" className="hover:text-orange-500 transition-colors uppercase font-black px-2">
                    Scent_Discovery
                </Link>

                {user ? (
                    <div className="flex items-center gap-4 border-l border-[rgb(var(--border-color)/10%)] pl-4">
                        {user.email === '69nainu@gmail.com' && (
                            <Link href="/inventory" className="text-orange-600 hover:text-[rgb(var(--foreground-rgb))] transition-colors font-black text-[9px] border border-orange-600/30 px-2 py-1 bg-orange-50/10 backdrop-blur-sm">
                                INVENTORY_CONTROL
                            </Link>
                        )}
                        <span className="opacity-40 text-[8px] hidden lg:block uppercase font-black">NODE: {user.email?.split('@')[0]}</span>
                        <button
                            onClick={() => signOut()}
                            className="text-red-500 hover:text-[rgb(var(--foreground-rgb))] transition-colors font-black text-[9px]"
                        >
                            [ DISCONNECT ]
                        </button>
                    </div>
                ) : (
                    <Link href="/auth/login" className="hover:text-[rgb(var(--accent))] transition-colors font-black text-[9px]">
                        AUTH_NODE
                    </Link>
                )}

                <div className="flex items-center gap-4 border-l border-[rgb(var(--border-color)/10%)] pl-4">
                    <button
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="p-1 hover:text-[rgb(var(--accent))] transition-colors"
                        aria-label="Toggle Theme"
                    >
                        <AnimatePresence mode="wait">
                            {isMounted && (
                                <motion.div
                                    key={theme}
                                    initial={{ opacity: 0, rotate: -90 }}
                                    animate={{ opacity: 1, rotate: 0 }}
                                    exit={{ opacity: 0, rotate: 90 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </button>

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
            </div>
        </nav>
    );
}
