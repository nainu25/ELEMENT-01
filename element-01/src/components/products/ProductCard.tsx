"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import type { Product, ProductNoteJoin } from "@/types/databse";

export default function ProductCard({ product }: { product: Product }) {
    const [isHovered, setIsHovered] = useState(false);

    const [isOpen, setIsOpen] = useState(false);

    // Group notes for display
    const topNotes = (product.product_notes as ProductNoteJoin[])?.filter(n => n.note_type === 'top').map(n => n.notes.name).join(', ');
    const heartNotes = (product.product_notes as ProductNoteJoin[])?.filter(n => n.note_type === 'heart').map(n => n.notes.name).join(', ');
    const baseNotes = (product.product_notes as ProductNoteJoin[])?.filter(n => n.note_type === 'base').map(n => n.notes.name).join(', ');

    return (
        <div
            className={`relative border border-black p-8 bg-[rgb(var(--background-rgb))] hover:bg-neutral-100 transition-all duration-500 overflow-hidden group cursor-pointer flex flex-col justify-between ${isOpen ? 'h-auto shadow-2xl z-50 ring-1 ring-black' : 'h-full min-h-[420px]'}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => setIsOpen(!isOpen)}
        >
            {/* Scanner Scanner Animation Line */}
            <motion.div
                initial={{ top: "-10px", opacity: 0 }}
                animate={
                    isHovered
                        ? { top: "100%", opacity: [0, 1, 1, 0] }
                        : { top: "-10px", opacity: 0 }
                }
                transition={{
                    duration: 1.5,
                    ease: "linear",
                    repeat: isHovered ? Infinity : 0,
                }}
                className="absolute left-0 w-full h-[1px] bg-[rgb(var(--accent))] z-10 pointer-events-none"
                style={{
                    boxShadow: "0 0 8px 1px rgb(var(--accent))",
                }}
            />

            {/* Card Content Top */}
            <div className="relative z-20 mb-8">
                <div className="flex justify-between items-start mb-6 w-full">
                    {/* Prominent Formula Code Badge */}
                    <span className="text-sm sm:text-lg font-bold border border-black bg-black text-white px-3 py-1 tracking-widest leading-none">
                        {product.formula_code}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">
                        MW: {product.molecular_weight || "N/A"}
                    </span>
                </div>

                <Link
                    href={`/perfume/${product.slug}`}
                    className="block group/link"
                    onClick={(e) => e.stopPropagation()}
                >
                    <h2 className="text-2xl sm:text-4xl font-black mb-4 uppercase tracking-tighter leading-[0.9] whitespace-pre-wrap group-hover/link:underline decoration-1 underline-offset-8">
                        {product.name}
                    </h2>
                </Link>

                {/* Scent Pyramid Display - Collapsible on mobile, shows on hover or open */}
                <div className={`mt-4 text-[10px] font-medium tracking-widest text-neutral-500 flex flex-col gap-1 transition-all duration-300 ${isOpen ? 'opacity-100 block' : 'hidden sm:flex'}`}>
                    {topNotes && <p><span className="text-black/40 mr-2 uppercase">Primary Volatiles:</span>{topNotes}</p>}
                    {heartNotes && <p><span className="text-black/40 mr-2 uppercase">Heart:</span>{heartNotes}</p>}
                    {baseNotes && <p><span className="text-black/40 mr-2 uppercase">Base:</span>{baseNotes}</p>}
                </div>

                <div className={`transition-all duration-300 ${isOpen ? 'opacity-100 block mt-4 pt-4 border-t border-black/10' : 'hidden sm:block'}`}>
                    <p className="text-xs sm:text-sm opacity-70 leading-relaxed">
                        {product.description}
                    </p>

                    {isOpen && (
                        <div className="mt-4 grid grid-cols-2 gap-4 text-[10px] uppercase font-bold tracking-widest text-neutral-500">
                            <div>
                                <p className="opacity-40 mb-1">Concentration</p>
                                <p className="text-black">{product.concentration}</p>
                            </div>
                            <div>
                                <p className="opacity-40 mb-1">Longevity</p>
                                <p className="text-black">{product.longevity_hours}H</p>
                            </div>
                            <div>
                                <p className="opacity-40 mb-1">Sillage</p>
                                <p className="text-black">RANK {product.sillage_rank}</p>
                            </div>
                        </div>
                    )}
                </div>

                {!isOpen && (
                    <div className="sm:hidden mt-2 text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                        [ Tap to view specs ]
                    </div>
                )}
            </div>

            {/* Card Content Bottom */}
            <div className="flex justify-between items-end border-t border-black pt-4 relative z-20 mt-auto">
                <div className={isOpen ? 'hidden' : 'block'}>
                    <p className="text-[9px] uppercase font-bold tracking-widest text-neutral-500 mb-1">
                        Concentration
                    </p>
                    <p className="text-xs sm:text-sm font-bold">{product.concentration}</p>
                </div>
                <p className="text-lg sm:text-xl font-bold tracking-tighter">
                    ${product.price}
                </p>
            </div>
        </div>
    );
}
