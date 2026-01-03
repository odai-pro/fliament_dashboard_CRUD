export default function Loading() {
    return (
        <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-700">
            {/* Navbar Placeholder */}
            <div className="h-20 border-b border-[var(--border-color)]"></div>

            <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                    {/* Left: Image Placeholder */}
                    <div className="space-y-6">
                        <div className="aspect-square rounded-[2rem] bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
                        <div className="flex gap-4 overflow-hidden">
                            <div className="w-24 h-24 rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
                            <div className="w-24 h-24 rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
                            <div className="w-24 h-24 rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
                        </div>
                    </div>

                    {/* Right: Info Placeholder */}
                    <div className="space-y-8 mt-12 lg:mt-0">
                        <div className="h-12 w-3/4 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
                        <div className="h-4 w-1/4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>

                        <div className="h-16 w-1/3 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse border-b border-[var(--border-color)] pb-8 mb-8"></div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="h-24 rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
                            <div className="h-24 rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
                        </div>

                        <div className="space-y-4">
                            <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                            <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                            <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                        </div>

                        <div className="h-16 w-full bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse"></div>
                    </div>
                </div>
            </main>
        </div>
    );
}
