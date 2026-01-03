"use client";

import { useTheme } from "@/components/ThemeProvider";

export function Logo({ className = "" }: { className?: string }) {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
        <svg
            viewBox="0 0 120 120"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Circle */}
            <circle
                cx="60"
                cy="60"
                r="55"
                fill="none"
                stroke={isDark ? "#C8A46D" : "#AD8646"}
                strokeWidth="2"
                opacity="0.8"
            />

            {/* Letter A with V integrated */}
            <text
                x="60"
                y="75"
                fontSize="52"
                fontFamily="serif"
                textAnchor="middle"
                fill={isDark ? "#C8A46D" : "#1C1917"}
                fontWeight="300"
                letterSpacing="2"
            >
                AV
            </text>

            {/* Diamond Icon */}
            <g transform="translate(85, 20)">
                <path
                    d="M 0,-8 L 4,0 L 0,12 L -4,0 Z M -4,0 L -6,4 L 0,12 M 4,0 L 6,4 L 0,12 M -2,-4 L 2,-4 L 4,0 L -4,0 Z"
                    fill="none"
                    stroke={isDark ? "#D8B878" : "#C8A46D"}
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M -2,-4 L 0,0 M 2,-4 L 0,0 M -4,0 L 0,4 M 4,0 L 0,4"
                    stroke={isDark ? "#D8B878" : "#C8A46D"}
                    strokeWidth="0.5"
                    opacity="0.6"
                />
            </g>

            {/* Subtitle Text */}
            <text
                x="60"
                y="95"
                fontSize="8"
                fontFamily="cursive, serif"
                textAnchor="middle"
                fill={isDark ? "#C8A46D" : "#57534E"}
                opacity="0.7"
                fontStyle="italic"
                letterSpacing="1.5"
            >
                Jewelry Designs
            </text>
        </svg>
    );
}
