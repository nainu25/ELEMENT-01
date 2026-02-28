import { getProductBySlug, getProductsWithNotes } from "@/lib/queries";
import { notFound } from "next/navigation";
import NotePyramid from "@/components/products/NotePyramid";
import AddToBag from "@/components/products/AddToBag";
import * as motion from "framer-motion/client";

interface PageProps {
    params: Promise<{ slug: string }>;
}

/**
 * Task 2: Dynamic Route Setup
 * generateStaticParams for build-time pre-rendering.
 */
export async function generateStaticParams() {
    const products = await getProductsWithNotes();
    return products.map((product) => ({
        slug: product.slug,
    }));
}

export default async function PerfumePage({ params }: PageProps) {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-[rgb(var(--background-rgb))] font-mono text-[rgb(var(--foreground-rgb))] overflow-x-hidden pt-24 px-8 pb-32 transition-colors duration-500">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">

                {/* Main Content (Cols 1-7) */}
                <div className="lg:col-span-7 space-y-16">
                    <motion.header
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="border-b-4 border-[rgb(var(--border-color))] pb-8"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <span className="bg-[rgb(var(--foreground-rgb))] text-[rgb(var(--background-rgb))] px-3 py-1 text-sm font-black uppercase tracking-widest transition-colors duration-500">
                                {product.formula_code}
                            </span>
                            <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                                Origin: ELEMENT_01_LAB
                            </span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-6">
                            {product.name}
                        </h1>
                        <p className="max-w-xl text-lg leading-relaxed opacity-80 border-l-2 border-[rgb(var(--border-color)/10%)] pl-6">
                            {product.description}
                        </p>
                    </motion.header>

                    {/* The Note Pyramid Section */}
                    <motion.section
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3, duration: 1 }}
                    >
                        <header className="mb-10 flex flex-col items-start">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 opacity-40">Molecular Analysis</h3>
                            <h2 className="text-2xl font-black uppercase tracking-widest bg-[rgb(var(--foreground-rgb))] text-[rgb(var(--background-rgb))] px-4 py-2 transition-colors duration-500">
                                Scent Profile Structure
                            </h2>
                        </header>
                        <NotePyramid notes={product.product_notes || []} />
                    </motion.section>

                    {/* Checkout Section for Desktop Mobile View */}
                    <div className="lg:hidden">
                        <AddToBag product={product} />
                    </div>
                </div>

                {/* Task 2: Technical Specifications Sidebar (Cols 8-12) */}
                <aside className="lg:col-span-5 space-y-12 bg-[rgb(var(--card-bg))] border border-[rgb(var(--border-color))] p-10 relative overflow-hidden transition-colors duration-500">
                    {/* Laboratory Decoration Elements */}
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <svg width="100" height="100" viewBox="0 0 100 100" className="animate-spin-slow">
                            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeDasharray="10 5" strokeWidth="2" className="text-[rgb(var(--foreground-rgb))]" />
                        </svg>
                    </div>

                    <header className="mb-12 border-b-2 border-dashed border-black pb-6">
                        <h2 className="text-xl font-black uppercase tracking-[0.2em] mb-1">Technical Specs</h2>
                        <p className="text-[10px] opacity-40 uppercase font-bold tracking-widest">Product Batch // E01-2026</p>
                    </header>

                    <dl className="space-y-10">
                        {/* Formula Code */}
                        <div className="flex justify-between items-baseline group">
                            <dt className="text-[10px] uppercase font-black tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">Formula ID</dt>
                            <dd className="text-2xl font-black tracking-tighter uppercase">{product.formula_code}</dd>
                        </div>

                        {/* Longevity Progress Bar */}
                        <div className="space-y-3 group">
                            <div className="flex justify-between text-[10px] uppercase font-black tracking-widest opacity-40">
                                <dt>Longevity Period</dt>
                                <dd className="text-[rgb(var(--foreground-rgb))] transition-colors duration-500">{product.longevity_hours} HOURS</dd>
                            </div>
                            <div className="h-4 bg-[rgb(var(--foreground-rgb)/5%)] border border-[rgb(var(--border-color))] overflow-hidden relative transition-colors duration-500">
                                <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${(product.longevity_hours || 0) * 10}%` }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1.5, ease: "circOut" }}
                                    className="h-full bg-[rgb(var(--foreground-rgb))] relative transition-colors duration-500"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgb(var(--background-rgb)/20%)] to-transparent" />
                                </motion.div>
                            </div>
                        </div>

                        {/* Sillage Scale */}
                        <div className="space-y-4 group">
                            <div className="flex justify-between text-[10px] uppercase font-black tracking-widest opacity-40">
                                <dt>Sillage Intensity</dt>
                                <dd className="text-[rgb(var(--foreground-rgb))] transition-colors duration-500">RANK {product.sillage_rank}/5</dd>
                            </div>
                            <div className="flex gap-2 h-8">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div
                                        key={i}
                                        className={`flex-1 border border-[rgb(var(--border-color))] ${(product.sillage_rank || 0) >= i ? "bg-[rgb(var(--foreground-rgb))]" : "bg-transparent opacity-10"
                                            } transition-all duration-300`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Molecular Weight */}
                        <div className="flex justify-between items-baseline group pt-6 border-t border-dashed border-[rgb(var(--border-color)/20%)]">
                            <dt className="text-[10px] uppercase font-black tracking-widest opacity-40">Molecular Mass</dt>
                            <dd className="text-xl font-black tracking-tighter uppercase">{product.molecular_weight}</dd>
                        </div>
                    </dl>

                    {/* Desktop Add to Bag */}
                    <div className="hidden lg:block pt-12">
                        <AddToBag product={product} />
                    </div>

                    {/* Laboratory Disclaimer */}
                    <footer className="mt-12 text-[8px] opacity-30 text-center leading-tight uppercase font-bold px-4">
                        Disclaimer: Molecular performance may vary based on user-environment parameters. ELEMENT_01 is for external application only within localized atmospheric conditions.
                    </footer>
                </aside>
            </div>
        </main>
    )
}
