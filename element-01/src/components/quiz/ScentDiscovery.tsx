"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getProductsWithNotes } from "@/lib/queries";
import type { Product } from "@/types/databse";
import ProductCard from "@/components/products/ProductCard";
import { ChevronRight, RefreshCcw, Thermometer, Wind, Droplets } from "lucide-react";

type Step = 1 | 2 | 3;

interface QuizState {
    environment: "Laboratory/Clean" | "Forest/Woody" | "Oceanic/Mineral" | null;
    intensity: "Skin Scent" | "Room Filler" | null;
}

export default function ScentDiscovery() {
    const [step, setStep] = useState<Step>(1);
    const [state, setState] = useState<QuizState>({ environment: null, intensity: null });
    const [products, setProducts] = useState<Product[]>([]);
    const [results, setResults] = useState<(Product & { score: number })[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    useEffect(() => {
        getProductsWithNotes().then(setProducts);
    }, []);

    const handleEnvironment = (env: QuizState["environment"]) => {
        setState(prev => ({ ...prev, environment: env }));
        setStep(2);
    };

    const handleIntensity = (intensity: QuizState["intensity"]) => {
        setState(prev => ({ ...prev, intensity }));
        setIsAnalyzing(true);

        setTimeout(() => {
            calculateResults(state.environment, intensity);
            setStep(3);
            setIsAnalyzing(false);
        }, 1500);
    };

    const calculateResults = (env: QuizState["environment"], intensity: QuizState["intensity"]) => {
        const mappedResults = products.map(product => {
            let score = 0;

            // Match Environment/Category
            const categories = product.product_notes?.map(n => n.notes.category?.toLowerCase()) || [];
            if (env === "Forest/Woody" && categories.some(c => c?.includes("wood"))) score += 50;
            if (env === "Laboratory/Clean" && categories.some(c => c?.includes("synthetic") || c?.includes("musk"))) score += 50;
            if (env === "Oceanic/Mineral" && categories.some(c => c?.includes("water") || c?.includes("mineral"))) score += 50;

            // Match Intensity/Sillage
            if (intensity === "Skin Scent" && (product.sillage_rank || 0) <= 2) score += 50;
            if (intensity === "Room Filler" && (product.sillage_rank || 0) >= 4) score += 50;
            if (intensity === "Room Filler" && (product.sillage_rank || 0) === 3) score += 25;

            // Base score for quality
            score += Math.random() * 10; // Add slight variation for "molecular unique" feel

            return { ...product, score: Math.round(Math.min(99, score)) };
        });

        setResults(mappedResults.sort((a, b) => b.score - a.score).slice(0, 1));
    };

    const reset = () => {
        setStep(1);
        setState({ environment: null, intensity: null });
        setResults([]);
    };

    return (
        <div className="min-h-[600px] flex flex-col items-center justify-center p-8 bg-white border border-black relative overflow-hidden font-mono">
            {/* Background Decoration */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,black_1px,transparent_1px)] bg-[size:40px_40px]" />
            </div>

            <AnimatePresence mode="wait">
                {isAnalyzing ? (
                    <motion.div
                        key="analyzing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center space-y-8"
                    >
                        <div className="w-32 h-32 border-4 border-black border-t-orange-500 rounded-full animate-spin mx-auto flex items-center justify-center">
                            <div className="w-20 h-20 border-2 border-dashed border-black rounded-full animate-spin-reverse" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-black uppercase tracking-widest">Processing_Data</h2>
                            <p className="text-[10px] opacity-40 uppercase font-bold tracking-widest animate-pulse">Running Correlation Algorithm v4.2 // Cross-referencing molecule library</p>
                        </div>
                    </motion.div>
                ) : step === 1 ? (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="w-full max-w-2xl space-y-12"
                    >
                        <header className="space-y-2">
                            <span className="text-[10px] font-black bg-black text-white px-3 py-1 uppercase tracking-widest">Phase_01</span>
                            <h2 className="text-4xl font-black uppercase tracking-tighter">Define Your Primary Atmosphere</h2>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { id: "Laboratory/Clean", icon: Thermometer, label: "CLEAN_MINIMAL" },
                                { id: "Forest/Woody", icon: Wind, label: "WOODS_ORGANIC" },
                                { id: "Oceanic/Mineral", icon: Droplets, label: "MINERAL_WATER" }
                            ].map((opt) => (
                                <button
                                    key={opt.id}
                                    onClick={() => handleEnvironment(opt.id as any)}
                                    className="group p-8 border border-black hover:bg-black hover:text-white transition-all duration-300 text-left space-y-6"
                                >
                                    <opt.icon className="w-8 h-8 group-hover:stroke-orange-500 transition-colors" />
                                    <div>
                                        <p className="text-[10px] opacity-40 uppercase font-black tracking-widest group-hover:opacity-100">{opt.label}</p>
                                        <h3 className="text-lg font-black uppercase leading-tight">{opt.id.split('/')[0]}</h3>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                ) : step === 2 ? (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="w-full max-w-2xl space-y-12"
                    >
                        <header className="space-y-2">
                            <span className="text-[10px] font-black bg-black text-white px-3 py-1 uppercase tracking-widest">Phase_02</span>
                            <h2 className="text-4xl font-black uppercase tracking-tighter">Determine Molecular Stability</h2>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { id: "Skin Scent", label: "LOW_SILLAGE", desc: "A personal invisible layer, detectable only at close range." },
                                { id: "Room Filler", label: "HIGH_SILLAGE", desc: "Expansive molecular projection that commands atmospheric attention." }
                            ].map((opt) => (
                                <button
                                    key={opt.id}
                                    onClick={() => handleIntensity(opt.id as any)}
                                    className="group p-10 border border-black hover:bg-black hover:text-white transition-all duration-300 text-left space-y-6"
                                >
                                    <h3 className="text-3xl font-black uppercase tracking-tighter">{opt.id}</h3>
                                    <div className="space-y-4">
                                        <p className="text-[10px] opacity-40 uppercase font-black tracking-widest group-hover:opacity-100">{opt.label}</p>
                                        <p className="text-xs leading-relaxed opacity-60 group-hover:opacity-100">{opt.desc}</p>
                                    </div>
                                    <div className="pt-4">
                                        <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform opacity-0 group-hover:opacity-100" />
                                    </div>
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setStep(1)}
                            className="text-[10px] uppercase font-black tracking-[0.2em] opacity-30 hover:opacity-100 flex items-center gap-2"
                        >
                            [ Return to Phase_01 ]
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full max-w-4xl space-y-12"
                    >
                        <header className="flex justify-between items-end border-b-2 border-black pb-8">
                            <div>
                                <span className="text-[10px] font-black bg-orange-500 text-black px-3 py-1 uppercase tracking-widest">Result_v4.2</span>
                                <h2 className="text-5xl font-black uppercase tracking-tighter mt-4">Optimal Molecular Match</h2>
                            </div>
                            <button
                                onClick={reset}
                                className="flex items-center gap-2 text-[10px] font-black border border-black px-4 py-2 hover:bg-black hover:text-white transition-all"
                            >
                                <RefreshCcw className="w-3 h-3" />
                                REBOOT_ALGORITHM
                            </button>
                        </header>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                            <div className="lg:col-span-7">
                                {results.length > 0 && (
                                    <div className="relative group">
                                        <ProductCard product={results[0]} />
                                        <div className="absolute top-0 right-0 bg-black text-white p-6 -mr-4 -mt-4 z-[60] border border-orange-500 shadow-2xl">
                                            <p className="text-[10px] uppercase font-black tracking-widest opacity-60 mb-1">Compatibility</p>
                                            <p className="text-5xl font-black italic tracking-tighter">{results[0].score}%</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="lg:col-span-5 space-y-8 bg-neutral-50 border border-dashed border-black/20 p-8">
                                <h3 className="text-xs font-black uppercase tracking-[0.3em] border-b border-black pb-4">Algorithm_Notes</h3>
                                <ul className="space-y-6 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                                    <li className="flex gap-4">
                                        <span className="text-orange-500">[01]</span>
                                        <span>Atmosphere correlation identified consistent {state.environment} markers.</span>
                                    </li>
                                    <li className="flex gap-4">
                                        <span className="text-orange-500">[02]</span>
                                        <span>Volatility index filtered for {state.intensity} parameters.</span>
                                    </li>
                                    <li className="flex gap-4">
                                        <span className="text-orange-500">[03]</span>
                                        <span>Optimal olfactory longevity matched to user metabolic preference.</span>
                                    </li>
                                </ul>
                                <div className="pt-4 text-[8px] opacity-40 text-center uppercase">
                                    Molecular Discovery Protocol // Version 4.2.0 // ELEMENT_01_LABS
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
