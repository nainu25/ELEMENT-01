export default function Loading() {
    return (
        <main className="p-8 pt-24 font-mono bg-[#F2F2F2] min-h-screen text-black overflow-x-hidden">
            <header className="mb-12 border-b border-black pb-4 flex justify-between items-baseline animate-pulse">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase whitespace-pre-wrap">INITIALIZING_SYSTEM...</h1>
                    <div className="h-1 bg-black/10 mt-2 w-48" />
                </div>
                <div className="text-[10px] opacity-20 uppercase font-black tracking-tighter">
                    [ SYSTEM_STATUS: BOOTING ]
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 items-start">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="relative border border-black p-8 bg-white space-y-8 flex flex-col justify-between h-full min-h-[420px] overflow-hidden grayscale">
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/[0.03] to-transparent -translate-x-full animate-shimmer" />

                        <div className="space-y-6">
                            <div className="flex justify-between items-start">
                                <div className="h-8 w-24 bg-black/5" />
                                <div className="h-4 w-16 bg-black/5" />
                            </div>
                            <div className="h-10 w-full bg-black/10" />
                            <div className="space-y-3 pt-4">
                                <div className="h-2 w-full bg-black/5" />
                                <div className="h-2 w-3/4 bg-black/5" />
                            </div>
                        </div>

                        <div className="border-t border-black/5 pt-4 flex justify-between items-end">
                            <div className="space-y-2">
                                <div className="h-2 w-16 bg-black/5" />
                                <div className="h-4 w-24 bg-black/5" />
                            </div>
                            <div className="h-8 w-18 bg-black/5" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="fixed bottom-0 left-0 w-full h-1 bg-neutral-200 overflow-hidden z-[200]">
                <div className="h-full bg-orange-500 w-1/4 animate-loading-bar" />
            </div>
        </main>
    );
}
