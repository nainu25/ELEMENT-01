"use client";

import type { ProductNoteJoin } from "@/types/databse";
import { motion } from "framer-motion";

interface NotePyramidProps {
    notes: ProductNoteJoin[];
}

export default function NotePyramid({ notes }: NotePyramidProps) {
    const top = notes.filter(n => n.note_type === 'top');
    const heart = notes.filter(n => n.note_type === 'heart');
    const base = notes.filter(n => n.note_type === 'base');

    return (
        <div className="relative font-mono border-l border-[rgb(var(--border-color))] pl-8 py-4 space-y-12 transition-colors duration-500">
            {/* Top Notes */}
            <section className="relative group">
                <div className="absolute -left-[33px] top-2 w-2.5 h-2.5 bg-[rgb(var(--foreground-rgb))] rounded-full border border-[rgb(var(--background-rgb))] transition-colors duration-500" />
                <header className="mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-[rgb(var(--foreground-rgb))] text-[rgb(var(--background-rgb))] px-2 py-0.5 transition-colors duration-500">
                        Primary Volatiles
                    </span>
                    <span className="text-[10px] opacity-40 ml-2 uppercase tracking-tighter">[ TOP_LAYER ]</span>
                </header>
                <div className="flex flex-wrap gap-2">
                    {top.map((n, i) => (
                        <motion.span
                            key={n.notes.id}
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="text-sm font-medium border-b border-[rgb(var(--border-color)/10%)] hover:border-[rgb(var(--foreground-rgb))] transition-colors py-1"
                        >
                            {n.notes.name}
                        </motion.span>
                    ))}
                    {top.length === 0 && <span className="text-[10px] opacity-20 italic">[ NO DATA ]</span>}
                </div>
            </section>

            {/* Heart Notes */}
            <section className="relative group">
                <div className="absolute -left-[33px] top-2 w-2.5 h-2.5 bg-[rgb(var(--foreground-rgb)/40%)] rounded-full border border-[rgb(var(--background-rgb))] transition-colors duration-500" />
                <header className="mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-[rgb(var(--foreground-rgb)/10%)] text-[rgb(var(--foreground-rgb))] px-2 py-0.5 transition-colors duration-500">
                        Core Structure
                    </span>
                    <span className="text-[10px] opacity-40 ml-2 uppercase tracking-tighter">[ HEART_LAYER ]</span>
                </header>
                <div className="flex flex-wrap gap-2">
                    {heart.map((n, i) => (
                        <motion.span
                            key={n.notes.id}
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: (top.length + i) * 0.1 }}
                            className="text-sm font-medium border-b border-[rgb(var(--border-color)/10%)] hover:border-[rgb(var(--foreground-rgb))] transition-colors py-1"
                        >
                            {n.notes.name}
                        </motion.span>
                    ))}
                    {heart.length === 0 && <span className="text-[10px] opacity-20 italic">[ NO DATA ]</span>}
                </div>
            </section>

            {/* Base Notes */}
            <section className="relative group">
                <div className="absolute -left-[33px] top-2 w-2.5 h-2.5 bg-[rgb(var(--foreground-rgb)/10%)] rounded-full border border-[rgb(var(--background-rgb))] transition-colors duration-500" />
                <header className="mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest border border-[rgb(var(--border-color))] text-[rgb(var(--foreground-rgb))] px-2 py-0.5 transition-colors duration-500">
                        Residual Molecules
                    </span>
                    <span className="text-[10px] opacity-40 ml-2 uppercase tracking-tighter">[ BASE_LAYER ]</span>
                </header>
                <div className="flex flex-wrap gap-4">
                    {base.map((n, i) => (
                        <motion.span
                            key={n.notes.id}
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: (top.length + heart.length + i) * 0.1 }}
                            className="text-base font-black border-b border-[rgb(var(--border-color))] hover:bg-[rgb(var(--foreground-rgb))] hover:text-[rgb(var(--background-rgb))] transition-all px-1"
                        >
                            {n.notes.name}
                        </motion.span>
                    ))}
                    {base.length === 0 && <span className="text-[10px] opacity-20 italic">[ NO DATA ]</span>}
                </div>
            </section>

            {/* Structural Hierarchy Line Decoration */}
            <div className="absolute left-0 bottom-0 h-4 border-l border-[rgb(var(--border-color))]" />
        </div>
    );
}
