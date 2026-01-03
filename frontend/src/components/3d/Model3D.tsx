"use client";

import { useEffect, useRef } from "react";

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'model-viewer': any;
        }
    }
}

interface Model3DProps {
    src: string;
    alt: string;
    className?: string;
    autoRotate?: boolean;
    cameraControls?: boolean;
}

export function Model3D({ 
    src, 
    alt, 
    className = "", 
    autoRotate = true,
    cameraControls = true 
}: Model3DProps) {
    const modelRef = useRef<any>(null);

    useEffect(() => {
        // Model-viewer is already loaded in layout.tsx
        // Just ensure it's available
        if (typeof window !== 'undefined' && !(window as any).customElements?.get('model-viewer')) {
            // Fallback: load if not available
            const script = document.createElement('script');
            script.type = 'module';
            script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js';
            document.body.appendChild(script);
        }
    }, []);

    return (
        <model-viewer
            ref={modelRef}
            src={src}
            alt={alt}
            className={className}
            auto-rotate={autoRotate ? "true" : "false"}
            camera-controls={cameraControls ? "true" : "false"}
            interaction-policy="allow-when-focused"
            shadow-intensity="1"
            environment-image="neutral"
            exposure="1"
            style={{
                width: '100%',
                height: '100%',
                backgroundColor: 'transparent',
            }}
        />
    );
}

