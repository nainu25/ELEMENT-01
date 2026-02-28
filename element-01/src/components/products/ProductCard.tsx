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
            className={`relative border border-[rgb(var(--border-color))] p-8 bg-[rgb(var(--card-bg))] hover:bg-[rgb(var(--foreground-rgb)/5%)] transition-all duration-500 overflow-hidden group cursor-pointer flex flex-col justify-between ${isOpen ? 'h-auto shadow-2xl z-50 ring-1 ring-[rgb(var(--border-color))]' : 'h-full min-h-[380px]'}`}
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

            <div className="relative z-20 mb-8">
                <div className="flex justify-between items-start mb-6 w-full">
                    {/* Prominent Formula Code Badge */}
                    <span className="text-sm sm:text-lg font-bold border border-[rgb(var(--border-color))] bg-[rgb(var(--foreground-rgb))] text-[rgb(var(--background-rgb))] px-3 py-1 tracking-widest leading-none">
                        {product.formula_code}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-[rgb(var(--foreground-rgb)/40%)] tracking-wider group-hover:text-[rgb(var(--foreground-rgb)/100%)] transition-colors duration-500">
                        MW: {product.molecular_weight || "N/A"}
                    </span>
                </div>

                <Link
                    href={`/perfume/${product.slug}`}
                    className="block group/link"
                    onClick={(e) => e.stopPropagation()}
                >
                    <h2 className="text-2xl sm:text-4xl font-black mb-4 uppercase tracking-tighter leading-[0.9] whitespace-pre-wrap group-hover/link:underline decoration-1 underline-offset-8 text-[rgb(var(--foreground-rgb))]">
                        {product.name}
                    </h2>
                </Link>

                {/* Scent Pyramid Display - Collapsible on mobile, shows on hover or open */}
                <div className={`mt-4 text-[10px] font-medium tracking-widest text-[rgb(var(--foreground-rgb)/40%)] flex flex-col gap-1 transition-all duration-300 ${isOpen ? 'opacity-100 block' : 'hidden sm:flex'}`}>
                    {topNotes && <p><span className="text-[rgb(var(--foreground-rgb)/40%)] mr-2 uppercase">Primary Volatiles:</span>{topNotes}</p>}
                    {heartNotes && <p><span className="text-[rgb(var(--foreground-rgb)/40%)] mr-2 uppercase">Heart:</span>{heartNotes}</p>}
                    {baseNotes && <p><span className="text-[rgb(var(--foreground-rgb)/40%)] mr-2 uppercase">Base:</span>{baseNotes}</p>}
                </div>

                <div className={`transition-all duration-300 ${isOpen ? 'opacity-100 block mt-4 pt-4 border-t border-[rgb(var(--border-color)/10%)]' : 'hidden sm:block'}`}>
                    <p className="text-xs sm:text-sm opacity-70 leading-relaxed">
                        {product.description}
                    </p>

                    {isOpen && (
                        <div className="mt-4 grid grid-cols-2 gap-4 text-[10px] uppercase font-bold tracking-widest text-[rgb(var(--foreground-rgb)/40%)]">
                            <div>
                                <p className="opacity-40 mb-1">Concentration</p>
                                <p className="text-[rgb(var(--foreground-rgb))]">{product.concentration}</p>
                            </div>
                            <div>
                                <p className="opacity-40 mb-1">Longevity</p>
                                <p className="text-[rgb(var(--foreground-rgb))]">{product.longevity_hours}H</p>
                            </div>
                            <div>
                                <p className="opacity-40 mb-1">Sillage</p>
                                <p className="text-[rgb(var(--foreground-rgb))]">RANK {product.sillage_rank}</p>
                            </div>
                            <div>
                                <p className="opacity-40 mb-1">Stock</p>
                                <p className={product.stock_quantity < 10 ? "text-red-500 font-bold" : "text-[rgb(var(--foreground-rgb))]"}>
                                    {product.stock_quantity} UNITS
                                </p>
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
            <div className="flex justify-between items-end border-t border-[rgb(var(--border-color))] pt-4 relative z-20 mt-auto">
                <div className={isOpen ? 'hidden' : 'block'}>
                    <p className="text-[9px] uppercase font-bold tracking-widest text-[rgb(var(--foreground-rgb)/40%)] mb-1 transition-colors duration-500">
                        Concentration
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-[rgb(var(--foreground-rgb))]">{product.concentration}</p>
                </div>
                <p className="text-lg sm:text-xl font-bold tracking-tighter text-[rgb(var(--foreground-rgb))]">
                    ${product.price}
                </p>
            </div>
        </div>
    );
}
