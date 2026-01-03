'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function LoadingScreen() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading time or wait for window load
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2500); // 2.5 seconds for the "premium feel"

        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    key="loading-screen"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-zinc-950"
                >
                    <div className="relative flex flex-col items-center justify-center">
                        {/* Diamond Container */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{
                                scale: [0.8, 1, 0.8],
                                opacity: 1,
                                rotate: [0, 45, 90, 45, 0]
                            }}
                            transition={{
                                duration: 4,
                                ease: "easeInOut",
                                repeat: Infinity,
                                times: [0, 0.5, 1]
                            }}
                            className="relative w-24 h-24 sm:w-32 sm:h-32"
                        >
                            {/* Central Diamond */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[#C8A46D] to-[#AD8646] rotate-45 transform shadow-[0_0_30px_rgba(200,164,109,0.4)]" />

                            {/* Inner Diamond Border */}
                            <div className="absolute inset-2 border-2 border-white/20 rotate-45 transform" />

                            {/* Shine Effect */}
                            <motion.div
                                animate={{
                                    opacity: [0, 0.5, 0],
                                    x: ["-100%", "100%"]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rotate-45 transform"
                            />
                        </motion.div>

                        {/* Brand Text */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="mt-12 text-center"
                        >
                            <h1 className="text-3xl font-serif text-[#C8A46D] tracking-[0.2em]">AUVÉA</h1>
                            <p className="text-white/40 text-xs tracking-[0.3em] mt-2 uppercase">Fine Jewelry</p>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
