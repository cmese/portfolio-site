// src/components/GlowingTitle.tsx
"use client";

import React from "react";

type Props = {
  text: string;
  size?: "sm" | "md" | "lg";
  glow?: "blue" | "pink" | "green" | "amber" | "white";
  className?: string; // for positioning (center, margins, etc.)
};

const glowMap = {
  blue: "drop-shadow(0 0 10px rgba(59,130,246,0.6)) drop-shadow(0 0 30px rgba(59,130,246,0.35))",
  pink: "drop-shadow(0 0 10px rgba(236,72,153,0.6)) drop-shadow(0 0 30px rgba(236,72,153,0.35))",
  green:
    "drop-shadow(0 0 10px rgba(34,197,94,0.6)) drop-shadow(0 0 30px rgba(34,197,94,0.35))",
  amber:
    "drop-shadow(0 0 10px rgba(245,158,11,0.6)) drop-shadow(0 0 30px rgba(245,158,11,0.35))",
  white:
    "drop-shadow(0 0 10px rgba(255,255,255,0.6)) drop-shadow(0 0 30px rgba(255,255,255,0.35))",
};

const sizeMap = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-2xl",
};

export default function GlowingTitle({
  text,
  size = "md",
  glow = "blue",
  className = "",
}: Props) {
  return (
    <div
      className={`inline-flex items-center justify-center rounded-full border border-white/20 
                  bg-white/10 dark:bg-white/10 px-4 py-2 font-semibold text-white
                  ${sizeMap[size]} ${className}`}
      style={{ filter: glowMap[glow] }}
      role="heading"
      aria-level={2}
    >
      {text}
    </div>
  );
}
