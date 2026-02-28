"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import ProductCard from '@/components/products/ProductCard';
import { motion, AnimatePresence } from "framer-motion";
import { Package, Loader2 } from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
                    *,
                    product_notes (
                        note_type,
                        notes (id, name)
                    )
                `)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err: any) {
      console.error("Database Fetch Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }


  if (loading) {
    return (
      <main className="min-h-screen bg-[rgb(var(--background-rgb))] font-mono text-[rgb(var(--foreground-rgb))] pt-32 px-8 flex items-center justify-center transition-colors duration-500">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
          <div className="animate-pulse text-[10px] font-black uppercase tracking-[0.5em]">Syncing_Molecular_Index...</div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-8 pt-32 font-mono bg-[rgb(var(--background-rgb))] min-h-screen text-[rgb(var(--foreground-rgb))] transition-colors duration-500">
        <header className="mb-12 border-b border-[rgb(var(--border-color))] pb-4 flex justify-between items-baseline">
          <h1 className="text-4xl font-bold tracking-tighter">ELEMENT 01 // CRITICAL_FAILURE</h1>
          <div className="text-[10px] opacity-40 uppercase font-black tracking-tighter">[ ERROR_DETECTED ]</div>
        </header>
        <div className="bg-[rgb(var(--card-bg))] border border-[rgb(var(--border-color))] p-12 text-[rgb(var(--foreground-rgb))] text-xs relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 bg-[rgb(var(--foreground-rgb))] text-[rgb(var(--background-rgb))] px-3 font-black uppercase text-[8px] animate-pulse">Error</div>
          <p className="font-bold mb-4 border-b border-[rgb(var(--border-color))] pb-2 opacity-100">DIAGNOSTIC_REPORT:</p>
          <p className="font-mono text-xs opacity-70 mb-8 break-all leading-relaxed max-w-2xl">{error}</p>
          <button onClick={() => window.location.reload()} className="uppercase text-[9px] font-black tracking-widest underline cursor-pointer hover:opacity-50 appearance-none bg-transparent">Retry connection sequence</button>
        </div>
      </main>
    );
  }

  if (products.length === 0) {
    return (
      <main className="p-8 pt-32 font-mono bg-[rgb(var(--background-rgb))] min-h-screen text-[rgb(var(--foreground-rgb))] transition-colors duration-500">
        <header className="mb-12 border-b border-[rgb(var(--border-color))] pb-4 flex justify-between items-baseline">
          <h1 className="text-4xl font-bold tracking-tighter">ELEMENT 01 // NO_DATA</h1>
          <div className="text-[10px] opacity-40 uppercase font-black tracking-tighter">[ SCAN_COMPLETE ]</div>
        </header>
        <div className="border border-dashed border-[rgb(var(--border-color)/30%)] p-24 text-center">
          <Package className="w-12 h-12 mx-auto mb-6 opacity-10" />
          <p className="opacity-50 text-xs tracking-widest uppercase">
            [ 0_MOLECULES_DETECTED_IN_LOCAL_RESERVOIR ]
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="p-8 pt-20 font-mono bg-[rgb(var(--background-rgb))] min-h-screen text-[rgb(var(--foreground-rgb))] overflow-x-hidden transition-colors duration-500">
      <header className="mb-12 border-b-2 border-[rgb(var(--border-color))] pb-6 flex justify-between items-end">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-2 mb-2 opacity-40">
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">System_Live_Connection</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter uppercase">Registry_Index</h1>
        </motion.div>

        <div className="flex flex-col items-end gap-2">
          <div className="text-[10px] opacity-40 uppercase font-black tracking-[0.2em]">
            Total Specimens: {products.length}
          </div>
        </div>
      </header>

      {/* Main Registry Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16 items-start">
        <AnimatePresence mode="popLayout" initial={false}>
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{
                duration: 0.6,
                delay: index * 0.05,
                ease: [0.19, 1, 0.22, 1]
              }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <footer className="mt-12 pt-8 border-t border-[rgb(var(--border-color)/10%)] flex justify-between items-center opacity-40 text-[9px] font-black uppercase tracking-[0.3em]">
        <span>Registry Analysis: Complete</span>
        <span className="animate-pulse text-orange-600">SYSTEM_STABILITY: OPTIMAL</span>
      </footer>
    </main>
  );
}