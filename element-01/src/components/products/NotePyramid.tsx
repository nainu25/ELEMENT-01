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
        <div className="relative font-mono border-l border-black pl-8 py-4 space-y-12">
            {/* Top Notes */}
            <section className="relative group">
                <div className="absolute -left-[33px] top-2 w-2.5 h-2.5 bg-black rounded-full border border-white" />
                <header className="mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-black text-white px-2 py-0.5">
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
                            className="text-sm font-medium border-b border-black/10 hover:border-black transition-colors py-1"
                        >
                            {n.notes.name}
                        </motion.span>
                    ))}
                    {top.length === 0 && <span className="text-[10px] opacity-20 italic">[ NO DATA ]</span>}
                </div>
            </section>

            {/* Heart Notes */}
            <section className="relative group">
                <div className="absolute -left-[33px] top-2 w-2.5 h-2.5 bg-neutral-400 rounded-full border border-white" />
                <header className="mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-neutral-200 text-black px-2 py-0.5">
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
                            className="text-sm font-medium border-b border-black/10 hover:border-black transition-colors py-1"
                        >
                            {n.notes.name}
                        </motion.span>
                    ))}
                    {heart.length === 0 && <span className="text-[10px] opacity-20 italic">[ NO DATA ]</span>}
                </div>
            </section>

            {/* Base Notes */}
            <section className="relative group">
                <div className="absolute -left-[33px] top-2 w-2.5 h-2.5 bg-neutral-200 rounded-full border border-white" />
                <header className="mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest border border-black text-black px-2 py-0.5">
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
                            className="text-base font-black border-b border-black hover:bg-black hover:text-white transition-all px-1"
                        >
                            {n.notes.name}
                        </motion.span>
                    ))}
                    {base.length === 0 && <span className="text-[10px] opacity-20 italic">[ NO DATA ]</span>}
                </div>
            </section>

            {/* Structural Hierarchy Line Decoration */}
            <div className="absolute left-0 bottom-0 h-4 border-l border-black" />
        </div>
    );
}
