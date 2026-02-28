export default function Loading() {
    return (
        <main className="min-h-screen bg-[#F2F2F2] font-mono text-black overflow-x-hidden pt-24 px-8 pb-32">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 animate-pulse">

                {/* Main Content (Cols 1-7) Skeleton */}
                <div className="lg:col-span-7 space-y-16">
                    <header className="border-b-4 border-black/10 pb-8">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-black/10 w-24 h-6 px-3 py-1 text-sm rounded-none" />
                            <div className="bg-black/5 w-48 h-4 rounded-none" />
                        </div>
                        <div className="h-48 w-full bg-black/5 mb-6" /> {/* Title Placeholder */}
                        <div className="space-y-4">
                            <div className="h-4 w-full bg-black/10 border-l-2 border-black/10 pl-6" />
                            <div className="h-4 w-3/4 bg-black/10 border-l-2 border-black/10 pl-6" />
                            <div className="h-4 w-1/2 bg-black/10 border-l-2 border-black/10 pl-6" />
                        </div>
                    </header>

                    {/* The Note Pyramid Section Skeleton */}
                    <section>
                        <div className="h-4 w-32 bg-black/10 mb-4" />
                        <div className="h-12 w-96 bg-black/20 mb-10" />
                        <div className="space-y-12 pl-8 border-l border-black/10">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="relative">
                                    <div className="absolute -left-[33px] top-2 w-2.5 h-2.5 bg-black/10 rounded-full" />
                                    <div className="h-4 w-24 bg-black/10 mb-4" />
                                    <div className="flex gap-4">
                                        <div className="h-8 w-24 bg-black/5" />
                                        <div className="h-8 w-32 bg-black/5" />
                                        <div className="h-8 w-20 bg-black/5" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Sidebar (Cols 8-12) Skeleton */}
                <aside className="lg:col-span-5 space-y-12 bg-white/50 border border-black/10 p-10 relative overflow-hidden">
                    <header className="mb-12 border-b-2 border-dashed border-black/10 pb-6">
                        <div className="h-6 w-48 bg-black/10 mb-2" />
                        <div className="h-2 w-32 bg-black/5" />
                    </header>

                    <dl className="space-y-10">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="flex flex-col gap-4">
                                <div className="flex justify-between items-baseline">
                                    <div className="h-2 w-16 bg-black/10" />
                                    <div className="h-6 w-24 bg-black/10" />
                                </div>
                                <div className="h-4 w-full bg-black/5" />
                            </div>
                        ))}
                    </dl>

                    <div className="hidden lg:block pt-12">
                        <div className="w-full py-12 bg-black/20" />
                    </div>
                </aside>
            </div>
        </main>
    );
}
