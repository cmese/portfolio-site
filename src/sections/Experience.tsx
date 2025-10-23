// src/sections/Experience.tsx
"use client";

import { useRef, useEffect } from "react";
import Timeline from "@/components/Timeline";
import { useBuiltTimeline } from "@/hooks/useBuiltTimeline";
import { useScrollTracker } from "@/hooks/useScrollTracker";
import { useTimelineProgress } from "@/contexts/TimelineProgress";

// details for each node (super-simple placeholder)
import { nodes, details } from "@/data/meTimeline"; // ⬅️ add this
import DetailCard from "@/components/timeline/DetailCard";
import { RxRowSpacing } from "react-icons/rx";
import { useMedia } from "@/hooks/useMedia";
import Portal from "@/components/Portal";
import { COL_W } from "@/components/timeline/geometry";
import { branchOrder } from "@/data/branchPalette";
import useActiveSection from "@/utils/useActiveSection";

export default function Experience() {
  /* ── 1. refs that Timeline needs ─────────────────────────────── */
  const containerRef = useRef<HTMLDivElement | null>(null);
  const firstNodeRef = useRef<HTMLDivElement | null>(null);
  const lastNodeRef = useRef<HTMLDivElement | null>(null);

  const activeId = useActiveSection(["experience"]);
  const { setProgress, progress } = useTimelineProgress();

  const TIMELINE_OFFSET_Y = 80; // matches transform in timeline-wrapper

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
  } = useScrollTracker(
    containerRef,
    firstNodeRef,
    lastNodeRef,
    TIMELINE_OFFSET_Y
  );

  // sync local hProgress → global context
  useEffect(() => {
    setProgress(hProgress);
  }, [hProgress, setProgress]);

  const built = useBuiltTimeline(); // { rows, segments, idxById }

  // responsive: overlay details on narrow screens
  const isNarrow = useMedia("(max-width: 900px)");

  // fade window for overlay (tweak these)
  const OVERLAY_START = 0.55; // start showing around 55% of slide-in
  const OVERLAY_END = 0.75; // fully visible by 75%

  const clamped = Math.max(
    0,
    Math.min(1, (progress - OVERLAY_START) / (OVERLAY_END - OVERLAY_START))
  );
  const overlayOpacity = clamped; // 0→1 between start/end
  const showOverlay = isNarrow && !!centerId && overlayOpacity > 0;

  // visual knobs
  const DETAIL_W = "clamp(320px, 38vw, 560px)"; // min, fluid, max
  const GUTTER = "clamp(16px, 4vw, 56px)"; // spacing between timeline and details

  // same center-to-left padding used for timeline:
  const centerPadExpr = `(50vw - 60px) * ${1 - hProgress}`;
  // dynamic gap follows the padding until it reaches just the base gutter:
  const dynamicGapExpr = `calc(${GUTTER} + ${centerPadExpr})`;

  /* ── 3. map horizontal progress to a 2-column grid layout ────── */
  const rtOpacity = hProgress; //   0 → 1

  // timeline pixel width (so we can center→left with a transform, not padding)
  const TL_W = branchOrder.length * COL_W;
  // when hProgress = 0, timeline should be roughly centered in the viewport
  // when hProgress = 1, no horizontal shift (flush-left).
  const centerOffset = `calc(50vw + 53px - ${TL_W / 4}px)`;
  const tlShift = `calc(${centerOffset} * ${1 - hProgress})`;

  // overlay shows only when: mobile layout + we have a node + the Experience section is active
  // const showOverlay = isNarrow && !!centerId && activeId === "experience";
  console.log("Experience: showOverlay =", showOverlay);

  return (
    <section id="experience" className="relative">
      <div
        id="timeline-wrapper"
        className="will-change-transform"
        style={{
          transform: `translateY(${TIMELINE_OFFSET_Y}px)` /* px gap between timeline and hero */,
        }}
      >
        <div
          className="grid transition-[grid-template-columns] duration-300 ease-[cubic-bezier(.4,0,.2,1)]"
          style={{
            // left column fits the timeline’s actual pixel width
            gridTemplateColumns: isNarrow ? "1fr" : `max-content ${DETAIL_W}`,
            columnGap: isNarrow ? 0 : GUTTER,
          }}
        >
          {/* ──  left column : Timeline  ─────────────────────────── */}
          <div
            className="overflow-visible"
            style={{
              width: "max-content",
              transform: `translateX(${tlShift})`,
              transition: "transform 300ms cubic-bezier(.4,0,.2,1)",
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

          {/* right: Details (column on wide, overlay on narrow) */}
          {!isNarrow ? (
            <aside
              className="px-6 md:px-12 sticky top-10"
              style={{
                opacity: rtOpacity,
                transition: "opacity 0.3s ease",
                width: DETAIL_W,
                marginLeft: `calc(-1 * (50vw - 60px) * ${1 - hProgress})`,
              }}
            >
              {centerId && (
                <DetailCard
                  centerId={centerId} // from your scroll tracker
                  rows={built.rows} // from buildTimeline(...)
                  nodes={nodes} // your authoring data
                  detailsMap={details} // your TLDetails
                />
              )}
            </aside>
          ) : null}
        </div>

        {/* overlay version for narrow screens */}
        {showOverlay && (
          <Portal>
            <div
              className="fixed z-40"
              style={{
                /* responsive right / left gutters: min, prefers, max */
                ["--ov-right" as any]: "clamp(40px, 80px, 120px)", // maximum space from the right edge
                ["--ov-left" as any]: "clamp(12px, 4vw, 24px)", // minimum space from the left edge

                /* 2) position */
                top: `calc(80px + env(safe-area-inset-top))`,
                right: `calc(var(--ov-right) + env(safe-area-inset-right))`,

                /* 3) width fits the viewport minus the right gutter + a small left margin */
                width: `min(560px, calc(100vw - var(--ov-right) - var(--ov-left) - env(safe-area-inset-right) - env(safe-area-inset-left)))`,

                maxHeight: "70vh",
                overflow: "auto",
                padding: "16px 20px",
                borderRadius: 12,
                backdropFilter: "blur(8px)",
                background: "rgba(24,24,24,0.72)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
                opacity: overlayOpacity,
                // opacity: showOverlay ? rtOpacity : 0,
                transition: "opacity 0.3s ease, transform 0.3s ease",
                transform: `translateX(${(1 - overlayOpacity) * 24}px)`,
              }}
            >
              <DetailCard
                centerId={centerId}
                rows={built.rows}
                nodes={nodes}
                detailsMap={details}
              />
            </div>
          </Portal>
        )}

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
