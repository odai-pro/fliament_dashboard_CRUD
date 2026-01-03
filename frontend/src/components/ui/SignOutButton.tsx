"use client";

import { motion } from "framer-motion";

interface SignOutButtonProps {
    onClick: () => void;
    title: string;
}

export function SignOutButton({ onClick, title }: SignOutButtonProps) {
    return (
        <button
            onClick={onClick}
            className="group relative flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-color)] bg-[var(--glass-bg)] backdrop-blur-md transition-all hover:border-red-500/50 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)] hover:bg-red-500/5"
            title={title}
            aria-label={title}
        >
            <div className="relative h-5 w-5 text-[var(--text-secondary)] group-hover:text-red-500 transition-colors duration-300">
                {/* Door Frame */}
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="absolute inset-0 h-full w-full"
                >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <motion.polyline 
                        points="16 17 21 12 16 7" 
                        initial={{ x: 0 }}
                        whileHover={{ x: 3 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    />
                    <motion.line 
                        x1="21" y1="12" x2="9" y2="12" 
                        initial={{ x: 0 }}
                        whileHover={{ x: 3 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    />
                </svg>
            </div>
        </button>
    );
}
