"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Lock, User, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) throw authError;

            // Optional: You could store user in a global state here if needed
            router.push('/');
            router.refresh();
        } catch (err: any) {
            setError(err.message || "AUTHENTICATION_FAILED: Check node credentials.");
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[rgb(var(--background-rgb))] font-mono text-[rgb(var(--foreground-rgb))] pt-32 px-8 flex flex-col items-center transition-colors duration-500">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full"
            >
                {/* Status Bar */}
                <div className="flex justify-between items-center mb-4 px-2">
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 ${error ? 'bg-red-500' : 'bg-orange-500'} rounded-full animate-pulse`} />
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-40">
                            System_Status: {error ? 'ERROR' : 'READY'}
                        </span>
                    </div>
                    <span className="text-[8px] opacity-20 uppercase font-black tracking-[0.2em]">NODE_AUTH_V1.0</span>
                </div>

                <div className="bg-[rgb(var(--card-bg))] border border-[rgb(var(--border-color))] p-10 shadow-2xl relative overflow-hidden transition-colors duration-500">
                    {/* Header */}
                    <header className="mb-10 border-b border-[rgb(var(--border-color))] pb-6 space-y-4">
                        <div className="w-10 h-10 bg-[rgb(var(--foreground-rgb))] text-[rgb(var(--background-rgb))] flex items-center justify-center transition-colors duration-500">
                            <Lock className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black uppercase tracking-tighter">Identity_Verification</h1>
                            <p className="text-[9px] uppercase font-black tracking-widest opacity-40 mt-1">Authorized Access Only // Specimen Handler Credentials</p>
                        </div>
                    </header>

                    {/* Error Display */}
                    {error && (
                        <div className="mb-6 p-4 border border-red-500/50 bg-red-500/5 text-red-600 text-[10px] font-black uppercase tracking-widest flex items-start gap-3 animate-shake">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <span>[ SYSTEM_ERROR: {error} ]</span>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 flex items-center gap-2">
                                    <User className="w-3 h-3" /> UID_Identifier
                                </label>
                                <input
                                    required
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="operator@e01-labs.com"
                                    className="w-full bg-[rgb(var(--foreground-rgb)/5%)] border border-[rgb(var(--border-color)/10%)] p-4 text-[11px] focus:border-orange-500 outline-none transition-colors text-[rgb(var(--foreground-rgb))]"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 flex items-center gap-2">
                                    <ShieldCheck className="w-3 h-3" /> Access_Token
                                </label>
                                <input
                                    required
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••••••"
                                    className="w-full bg-[rgb(var(--foreground-rgb)/5%)] border border-[rgb(var(--border-color)/10%)] p-4 text-[11px] focus:border-orange-500 outline-none transition-colors text-[rgb(var(--foreground-rgb))]"
                                />
                            </div>
                        </div>

                        <button
                            disabled={isLoading}
                            className="w-full py-5 bg-[rgb(var(--foreground-rgb))] text-[rgb(var(--background-rgb))] font-black uppercase tracking-[0.3em] text-[10px] hover:bg-orange-500 transition-all relative overflow-hidden group"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {isLoading ? "AUTHENTICATING..." : "EXECUTE_PROTOCOL"}
                                {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                            </span>
                            {isLoading && (
                                <motion.div
                                    initial={{ x: "-100%" }}
                                    animate={{ x: "100%" }}
                                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 bg-white/20"
                                />
                            )}
                        </button>
                    </form>

                    {/* Footer Links */}
                    <div className="mt-10 pt-6 border-t border-[rgb(var(--border-color)/5%)] flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                        <Link href="/auth/signup" className="opacity-40 hover:opacity-100 hover:text-orange-500 transition-all">
                            Register_Node
                        </Link>
                        <a href="#" className="opacity-20 hover:opacity-40 cursor-not-allowed">
                            Forgot_Token?
                        </a>
                    </div>
                </div>

                {/* Cyberpunk details */}
                <div className="mt-8 flex justify-between text-[8px] font-bold opacity-10 uppercase tracking-[0.5em] select-none">
                    <span>SECURE_SHELL_LINK</span>
                    <span>ENCRYPTION_RSA_4096</span>
                </div>
            </motion.div>
        </main>
    );
}
