import ScentDiscovery from "@/components/quiz/ScentDiscovery";
import * as motion from "framer-motion/client";

export default function QuizPage() {
    return (
        <main className="min-h-screen bg-[rgb(var(--background-rgb))] font-mono text-[rgb(var(--foreground-rgb))] overflow-x-hidden pt-32 px-8 pb-32 transition-colors duration-500">
            <div className="max-w-7xl mx-auto space-y-16">
                <header className="border-b-4 border-[rgb(var(--border-color))] pb-8 flex flex-col items-start gap-4">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-[rgb(var(--foreground-rgb))] text-[rgb(var(--background-rgb))] px-4 py-1 text-[10px] font-black uppercase tracking-[0.5em] transition-colors duration-500"
                    >
                        DIAGNOSTIC_PROTOCOL_V4.2
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8]"
                    >
                        Scent_Discovery
                    </motion.h1>
                    <p className="max-w-xl text-lg opacity-60 font-bold uppercase tracking-tight leading-relaxed">
                        Execute olfactory correlation algorithms to match your biological environment with our molecular library.
                    </p>
                </header>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <ScentDiscovery />
                </motion.div>

                <footer className="pt-16 border-t border-[rgb(var(--border-color)/10%)] grid grid-cols-1 md:grid-cols-3 gap-12 text-[10px] uppercase font-black tracking-widest leading-relaxed transition-colors duration-500">
                    <div className="space-y-4">
                        <p className="opacity-40">[ PARAMETER_01 ]</p>
                        <p>Environmental compatibility analysis across synthetic and organic libraries.</p>
                    </div>
                    <div className="space-y-4">
                        <p className="opacity-40">[ PARAMETER_02 ]</p>
                        <p>Volatility indexing based on sillage rank and molecular weight constraints.</p>
                    </div>
                    <div className="space-y-4">
                        <p className="opacity-40">[ PARAMETER_03 ]</p>
                        <p>Persistence algorithms matching longevity period to metabolic rate.</p>
                    </div>
                </footer>
            </div>
        </main>
    );
}
