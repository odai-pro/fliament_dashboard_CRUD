"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

export interface ToastMessage {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
}

interface ToastProps {
    message: ToastMessage;
    onClose: (id: string) => void;
}

function Toast({ message, onClose }: ToastProps) {
    useEffect(() => {
        const duration = message.duration || 4000;
        const timer = setTimeout(() => {
            onClose(message.id);
        }, duration);

        return () => clearTimeout(timer);
    }, [message.id, message.duration, onClose]);

    const bgColor = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500',
        warning: 'bg-yellow-500',
    }[message.type];

    const icon = {
        success: '✓',
        error: '✕',
        info: 'ℹ',
        warning: '⚠',
    }[message.type];

    return (
        <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`${bgColor} text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 min-w-[300px] max-w-[500px]`}
        >
            <span className="text-xl font-bold">{icon}</span>
            <p className="flex-1 text-sm font-medium">{message.message}</p>
            <button
                onClick={() => onClose(message.id)}
                className="text-white/80 hover:text-white transition-colors"
            >
                ✕
            </button>
        </motion.div>
    );
}

interface ToastContainerProps {
    toasts: ToastMessage[];
    onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return createPortal(
        <div className="fixed top-4 right-4 z-[10000] flex flex-col gap-2 pointer-events-none">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <div key={toast.id} className="pointer-events-auto">
                        <Toast message={toast} onClose={onClose} />
                    </div>
                ))}
            </AnimatePresence>
        </div>,
        document.body
    );
}

// Hook for using toast
let toastIdCounter = 0;

export function useToast() {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const showToast = (
        message: string,
        type: 'success' | 'error' | 'info' | 'warning' = 'info',
        duration?: number
    ) => {
        const id = `toast-${++toastIdCounter}`;
        const newToast: ToastMessage = { id, message, type, duration };
        setToasts((prev) => [...prev, newToast]);
    };

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    return {
        toasts,
        showToast,
        removeToast,
        success: (message: string, duration?: number) => showToast(message, 'success', duration),
        error: (message: string, duration?: number) => showToast(message, 'error', duration),
        info: (message: string, duration?: number) => showToast(message, 'info', duration),
        warning: (message: string, duration?: number) => showToast(message, 'warning', duration),
    };
}

