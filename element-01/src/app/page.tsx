import { getProductsWithNotes } from '@/lib/queries';
import ProductCard from '@/components/products/ProductCard';
import * as motion from "framer-motion/client";

export default async function Home() {
  try {
    const products = await getProductsWithNotes();

    if (!products || products.length === 0) {
      return (
        <main className="p-8 pt-24 font-mono bg-[#F2F2F2] min-h-screen text-black">
          <header className="mb-12 border-b border-black pb-4 flex justify-between items-baseline">
            <div>
              <h1 className="text-4xl font-bold tracking-tighter">ELEMENT 01 // NO_DATA</h1>
              <p className="text-[10px] uppercase opacity-60 mt-1 tracking-widest font-bold">Molecular Fragrance Index // V1.0</p>
            </div>
            <div className="text-[10px] opacity-40 uppercase font-black tracking-tighter">
              [ SEARCHING_COMPLETE ]
            </div>
          </header>
          <div className="border border-dashed border-black/30 p-24 text-center">
            <p className="opacity-50 text-xs tracking-widest uppercase">
              [ 0_MOLECULES_DETECTED_IN_LOCAL_RESERVOIR ]
            </p>
          </div>
        </main>
      );
    }

    return (
      <main className="p-8 pt-24 font-mono bg-[#F2F2F2] min-h-screen text-black overflow-x-hidden">
        <header className="mb-12 border-b border-black pb-4 flex justify-between items-baseline">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl font-bold tracking-tighter">ELEMENT 01 // SYSTEM_READY</h1>
            <p className="text-[10px] uppercase opacity-60 mt-1 tracking-widest font-bold">Molecular Fragrance Index // V1.0</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-[10px] opacity-40 uppercase font-black tracking-tighter"
          >
            [ DATABASE_SYNC_SUCCESS ]
          </motion.div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 items-start">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1,
                delay: index * 0.15,
                ease: [0.19, 1, 0.22, 1]
              }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </main>
    );
  } catch (error: any) {
    console.error("Database Fetch Error:", error);
    return (
      <main className="p-8 pt-24 font-mono bg-[#F2F2F2] min-h-screen text-black">
        <header className="mb-12 border-b border-black pb-4">
          <h1 className="text-4xl font-bold tracking-tighter">ELEMENT 01 // CRITICAL_FAILURE</h1>
          <p className="text-[10px] uppercase opacity-60 mt-1 tracking-widest font-bold">Molecular Fragrance Index // V1.0</p>
        </header>
        <div className="bg-white border border-black p-12 text-black text-xs relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 bg-black text-white px-3 font-black uppercase text-[8px] animate-pulse">Error</div>
          <p className="font-bold mb-4 border-b border-black pb-2 opacity-100">DIAGNOSTIC_REPORT:</p>
          <p className="font-mono text-xs opacity-70 mb-8 break-all leading-relaxed max-w-2xl">{error?.message || "Internal database connection failure."}</p>
          <p className="uppercase text-[9px] font-black tracking-widest underline cursor-pointer hover:opacity-50">Retry connection sequence</p>
        </div>
      </main>
    );
  }
}