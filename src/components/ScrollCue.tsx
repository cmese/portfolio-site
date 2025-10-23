// src/components/ScrollCue.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useTimelineProgress } from "@/contexts/TimelineProgress";

type Pos = { top: number; left: number };

export default function ScrollCue({
  targetId = "experience",
  anchorSelector = "#projects-btn",
  dx = 24, // shift right from anchor center
  dy = 40, // gap below anchor
  fadeStart = 0.55, // begin fading once timeline is ~55% slid-in
  fadeEnd = 0.75, // fully invisible by ~75%
}: {
  targetId?: string;
  anchorSelector?: string;
  dx?: number;
  dy?: number;
  fadeStart?: number;
  fadeEnd?: number;
}) {
  const { progress } = useTimelineProgress();
  const [opacity, setOpacity] = useState(1);
  const [pos, setPos] = useState<Pos | null>(null);
  const raf = useRef<number | null>(null);

  // compute fixed coordinates from the anchor’s viewport rect
  const computeAnchorPos = () => {
    const el = document.querySelector<HTMLElement>(anchorSelector);
    if (!el) return null;
    const r = el.getBoundingClientRect(); // viewport coords
    return {
      top: Math.round(r.bottom + dy),
      left: Math.round(r.left + r.width / 2 + dx),
    };
  };

  // position updater (runs on load/resize/scroll)
  useEffect(() => {
    const update = () => {
      if (raf.current) return;
      raf.current = requestAnimationFrame(() => {
        raf.current = null;
        const p = computeAnchorPos();
        if (p) setPos(p);
      });
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [anchorSelector, dx, dy]);

  // Drive opacity from shared timeline progress (no IntersectionObserver guessing)
  useEffect(() => {
    const start = Math.min(fadeStart, fadeEnd);
    const end = Math.max(fadeStart, fadeEnd);
    const t = (progress - start) / (end - start);
    const a = 1 - Math.max(0, Math.min(1, t)); // 1 → 0 across the window
    setOpacity(a);
  }, [progress, fadeStart, fadeEnd]);

  // fade logic versus target section
  // useEffect(() => {
  //   const target = document.getElementById(targetId);
  //   if (!target) return;

  //   const onScroll = () => {
  //     if (raf.current) return;
  //     raf.current = requestAnimationFrame(() => {
  //       raf.current = null;
  //       const { top } = target.getBoundingClientRect();
  //       const vh = window.innerHeight;
  //       const a = startFadeAt * vh;
  //       const b = endFadeAt * vh;
  //       let t = 1;
  //       if (top <= a) t = top <= b ? 0 : (top - b) / (a - b);
  //       setOpacity(Math.max(0, Math.min(1, t)));
  //     });
  //   };
  //   onScroll();
  //   window.addEventListener("scroll", onScroll, { passive: true });
  //   window.addEventListener("resize", onScroll);
  //   return () => {
  //     window.removeEventListener("scroll", onScroll);
  //     window.removeEventListener("resize", onScroll);
  //     if (raf.current) cancelAnimationFrame(raf.current);
  //   };
  // }, [targetId, startFadeAt, endFadeAt]);

  // fallback spot if anchor not found yet
  const styleTop = pos ? `${pos.top}px` : "clamp(220px, 28vh, 360px)";
  const styleLeft = pos ? `${pos.left}px` : "56vw";

  return (
    <div
      aria-hidden
      className="fixed z-[60] pointer-events-none select-none"
      style={{
        top: styleTop,
        left: styleLeft,
        opacity,
        transition: "opacity 220ms ease-out",
        transform: "translate(-50%, 0)", // center horizontally on anchor + dx
      }}
    >
      <div className="relative inline-flex flex-col items-center gap-2">
        <div
          className="rounded-full px-4 py-2 text-base md:text-lg font-semibold
                     bg-white/10 dark:bg-white/10 border border-white/20
                     backdrop-blur-md text-white"
          style={{
            filter:
              "drop-shadow(0 0 10px rgba(59,130,246,0.45)) drop-shadow(0 0 30px rgba(59,130,246,0.35))",
          }}
        >
          About&nbsp;me
        </div>
        <div
          className="animate-bounce"
          style={{
            filter:
              "drop-shadow(0 0 8px rgba(59,130,246,0.5)) drop-shadow(0 0 18px rgba(59,130,246,0.35))",
          }}
        >
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            className="text-white/90"
            fill="none"
          >
            <path
              d="M12 4v14m0 0l-5-5m5 5l5-5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
