// src/sections/Experience.tsx
"use client";

import { useRef } from "react";
import Timeline from "@/components/Timeline";
import { useBuiltTimeline } from "@/hooks/useBuiltTimeline";
import { useScrollTracker } from "@/components/timeline/useScrollTracker";

// details for each node (super-simple placeholder)
import DetailCard from "@/components/timeline/DetailCard";
import { RxRowSpacing } from "react-icons/rx";

export default function Experience() {
  /* ── 1. refs that Timeline needs ─────────────────────────────── */
  const containerRef = useRef<HTMLDivElement | null>(null);
  const firstNodeRef = useRef<HTMLDivElement | null>(null);
  const lastNodeRef = useRef<HTMLDivElement | null>(null);

  /* ── 2. call the scroll-tracker here so we get hProgress ─────── */
  const {
    centerId,
    hProgress, // 0 → 1 before phase1
    registerNode,
    ready,
    // the rest of the values Timeline still needs:
    spotlightX,
    spotlightY,
    scrollPhase,
    containerTransform,
  } = useScrollTracker(containerRef, firstNodeRef, lastNodeRef);

  const built = useBuiltTimeline(); // { rows, segments, idxById }

  /* ── 3. map horizontal progress to a 2-column grid layout ────── */
  const tlWidth = `calc(${100 - hProgress * 50}% )`; // 100 → 50 %
  const rtWidth = `calc(${hProgress * 50}% )`; //   0 → 50 %
  const rtOpacity = hProgress; //   0 → 1

  return (
    <section id="experience" className="relative">
      <div
        id="timeline-wrapper"
        className="will-change-transform"
        style={{
          transform: "translateY(48px)" /* 48 px gap at top */,
        }}
      >
        <div
          className="
          grid
          transition-[grid-template-columns]
          duration-300 ease-[cubic-bezier(.4,0,.2,1)]
        "
          style={{ gridTemplateColumns: `${tlWidth} ${rtWidth}` }}
        >
          {/* ──  left column : Timeline  ─────────────────────────── */}
          <div
            className="
    overflow-visible
    transition-[padding-left,padding-right]
    duration-300 ease-[cubic-bezier(.4,0,.2,1)]
  "
            style={{
              /* at hProgress 0  → full centre padding
       at hProgress 1  → 0   (flush left)       */
              paddingLeft: `calc((50vw - 60px) * ${1 - hProgress})`,
              paddingRight: `calc((50vw - 60px) * ${1 - hProgress})`,
            }}
          >
            <Timeline
              rows={built.rows}
              segments={built.segments}
              containerRef={containerRef}
              firstNodeRef={firstNodeRef}
              lastNodeRef={lastNodeRef}
              ready={ready}
              registerNode={registerNode}
              spotlightX={spotlightX}
              spotlightY={spotlightY}
              scrollPhase={scrollPhase}
              centerId={centerId}
              containerTransform={containerTransform}
            />
          </div>

          {/* ──  right column : Details  ──────────────────────────── */}
          <aside
            className="px-6 md:px-12"
            style={{ opacity: rtOpacity, transition: "opacity 0.3s ease" }}
          >
            {centerId && <DetailCard nodeId={centerId} />}
          </aside>
        </div>

        {/* footer spacer under timeline */}
        <div
          className="pointer-events-none"
          style={{
            /* 96 px visual space after timeline */ position: "absolute",
            left: 0,
            right: 0,
            bottom: -96,
            height: 96,
          }}
        />
      </div>
    </section>
  );
}
