import { supabase } from '@/lib/supabase';

export default async function Home() {
  // 1. Fetch data from Supabase
  const { data: products, error } = await supabase
    .from('products')
    .select('*');

  if (error) return <div>Error loading laboratory data.</div>;

  return (
    <main className="p-8 font-mono bg-[#F2F2F2] min-h-screen text-black">
      <header className="mb-12 border-b border-black pb-4">
        <h1 className="text-4xl font-bold tracking-tighter">ELEMENT 01 // SYSTEM_READY</h1>
        <p className="text-sm uppercase opacity-60">Molecular Fragrance Index</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products?.map((product) => (
          <div key={product.id} className="border border-black p-6 bg-white hover:bg-black hover:text-white transition-colors duration-300">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold border border-current px-2 py-1">
                {product.formula_code}
              </span>
              <span className="text-xs">{product.molecular_weight || 'N/A'}</span>
            </div>

            <h2 className="text-2xl font-bold mb-2 uppercase">{product.name}</h2>
            <p className="text-sm mb-6 opacity-80 line-clamp-2">{product.description}</p>

            <div className="flex justify-between items-end border-t border-current pt-4">
              <div>
                <p className="text-[10px] uppercase opacity-60">Concentration</p>
                <p className="text-sm">{product.concentration}</p>
              </div>
              <p className="text-xl font-bold">${product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}