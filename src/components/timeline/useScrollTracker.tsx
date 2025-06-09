"use client";

import { useState, useRef, useLayoutEffect } from "react";
import { BranchId } from "@/data/timeline";

// DEBUG: toggle all logs on/off in one place
const DEBUG = false;
const log = (...args: any[]) => DEBUG && console.log("[Timeline]", ...args);

/** Scroll tracker for timeline spotlight
 */
export function useScrollTracker(
  containerRef: React.RefObject<HTMLDivElement | null>,
  firstNodeRef: React.RefObject<HTMLDivElement | null>,
  lastNodeRef: React.RefObject<HTMLDivElement | null>
) {
  // Will hold {id, branch, rowIndex, x, y} for each node
  const nodePositions = useRef<
    Array<{
      id: string;
      branch: BranchId;
      rowIndex: number;
      x: number;
      y: number;
    }>
  >([]);

  //which node is under the circle?
  const [centerId, setCenterId] = useState<string | null>(null);
  const [spotlightX, setSpotlightX] = useState<number>(0);
  const [spotlightY, setSpotlightY] = useState<number>(0);

  const [scrollPhase, setScrollPhase] = useState<"phase1" | "phase2">("phase1");

  // Breakpoints
  const [scrollAtFirst20, setScrollAtFirst20] = useState<number | null>(null);
  const [scrollAtLast80, setScrollAtLast80] = useState<number | null>(null);
  const [ready, setReady] = useState(false);

  /* ───────── measure break-points once ───────── */
  useLayoutEffect(() => {
    if (!containerRef.current || !firstNodeRef.current || !lastNodeRef.current)
      return;

    const fRect = firstNodeRef.current.getBoundingClientRect();
    const fCenterY = window.scrollY + fRect.top + fRect.height / 2;
    const desired20 = window.innerHeight * 0.2;
    setScrollAtFirst20(fCenterY - desired20);
    log("scrollAtFirst20 =", fCenterY - desired20);

    const lRect = lastNodeRef.current.getBoundingClientRect();
    const lCenterY = window.scrollY + lRect.top + lRect.height / 2;
    const desired50 = window.innerHeight * 0.5;
    const desired80 = window.innerHeight * 0.8;

    setScrollAtLast80(lCenterY - desired80);
    log("scrollAtLast80  =", lCenterY - desired80);

    setReady(true);
  }, [containerRef.current, firstNodeRef.current, lastNodeRef.current]);

  /* ───────── main scroll handler ───────── */
  useLayoutEffect(() => {
    if (!ready || scrollAtFirst20 === null || scrollAtLast80 === null) return;

    let rafHandle: number | null = null;
    let prevPhase = scrollPhase;

    const onScroll = () => {
      if (rafHandle) return;
      rafHandle = requestAnimationFrame(() => {
        rafHandle = null;
        const y = window.scrollY;

        // Decide phase
        let phase: typeof scrollPhase;
        if (y < scrollAtFirst20) phase = "phase1";
        else phase = "phase2";

        if (phase !== prevPhase) {
          log(`→ phase change ${prevPhase} → ${phase}  (scrollY=${y})`);
          prevPhase = phase;
        }

        const nodes = nodePositions.current;
        if (!nodes.length) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];

        let transform = 0; //TODO
        let chosenId: string | null = null;
        let outX = 0,
          outY = 0;

        if (phase === "phase1") {
          transform = 0; //TODO
          chosenId = first.id;
          outX = first.x;
          outY = first.y;
        } else {
          transform = 0;

          /* 1. clamp scroll progress to [0‥1] */
          const t = (y - scrollAtFirst20) / (scrollAtLast80 - scrollAtFirst20);
          const f = Math.max(0, Math.min(1, t));

          /* 2. floating-point index along node list */
          const floatIdx = f * (nodes.length - 1);
          const i0 = Math.floor(floatIdx);
          const i1 = Math.min(i0 + 1, nodes.length - 1);

          /* 3. linear interpolation between the two nodes */
          const frac = floatIdx - i0; // 0 → 1
          const a = nodes[i0];
          const b = nodes[i1];

          /*    spotlight position = lerp(a, b)                    */
          outX = a.x + (b.x - a.x) * frac;
          outY = a.y + (b.y - a.y) * frac;

          /* 4. active (bright-color) node = the next LOWER node   */
          /*    ceil guarantees no backwards jumps.     */
          const chosenIdx = Math.ceil(floatIdx);
          chosenId = nodes[chosenIdx].id;
        }

        // DEBUG: log every 100 px to avoid spam
        if (y % 100 < 1) {
          log(
            `y=${y} phase=${phase} transform=${transform} center=${chosenId}`
          );
        }

        setScrollPhase(phase);
        setCenterId(chosenId);
        setSpotlightX(outX);
        setSpotlightY(outY);
        setContainerTransform(transform);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafHandle) cancelAnimationFrame(rafHandle);
    };
  }, [ready, scrollAtFirst20, scrollAtLast80]);

  /* ───────── record node positions ───────── */
  const registerNode = (
    id: string,
    branch: BranchId,
    rowIndex: number,
    el: HTMLDivElement | null
  ) => {
    if (!el || !containerRef.current) return;
    const cRect = containerRef.current.getBoundingClientRect();
    const eRect = el.getBoundingClientRect();
    const node = {
      id,
      branch,
      rowIndex,
      x: eRect.left - cRect.left + eRect.width / 2,
      y: eRect.top - cRect.top + eRect.height / 2,
    };

    const idx = nodePositions.current.findIndex((n) => n.id === id);
    if (idx >= 0) nodePositions.current[idx] = node;
    else nodePositions.current.push(node);

    nodePositions.current.sort((a, b) => a.y - b.y); // keeps true top-to-bottom order

    // DEBUG: log once per node registration
    log("register node", node);
  };

  const [containerTransform, setContainerTransform] = useState<number>(0);

  return {
    centerId,
    spotlightX,
    spotlightY,
    scrollPhase,
    ready,
    registerNode,
    containerTransform,
  };
}
