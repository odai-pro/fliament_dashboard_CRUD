export function ProductSkeleton() {
    return (
        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--glass-bg)] overflow-hidden backdrop-blur-md h-full">
            {/* Image Skeleton */}
            <div className="relative h-64 bg-gray-200 dark:bg-gray-800 animate-pulse" />

            {/* Content Skeleton */}
            <div className="p-6 space-y-4">
                {/* Title */}
                <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-3/4 animate-pulse" />
                
                {/* Description */}
                <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full animate-pulse" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3 animate-pulse" />
                </div>

                {/* Details */}
                <div className="flex items-center justify-between pt-4 border-t border-[var(--border-color)]">
                    <div className="space-y-2">
                        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-12 animate-pulse" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-16 animate-pulse" />
                    </div>
                    <div className="h-8 w-px bg-[var(--border-color)]" />
                    <div className="space-y-2">
                        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-12 animate-pulse" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-16 animate-pulse" />
                    </div>
                </div>

                {/* Button */}
                <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-lg w-full animate-pulse" />
            </div>
        </div>
    );
}


