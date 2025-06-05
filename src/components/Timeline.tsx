"use client";

import React, { useRef, useState, useLayoutEffect } from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { timelineRows, BranchId, TimelineRow } from "@/data/timeline";
import { branchOrder, branchColor } from "@/data/branchPalette";

export const COL_W = 120; // width of one branch column
const ROW_H = 120; // height of one timeline row
const LINE_W = 4; // stroke / bar thickness
const NODE_R = 8; // node radius (16×16 circle)
const OFFSET = 26; // vertical nudge for first / last child nodes

/* ─────────── helpers ─────────── */
/* x-centre of any column (document-relative) */
const colX = (b: (typeof branchOrder)[number]) =>
  branchOrder.indexOf(b) * COL_W + COL_W / 2;

/* baseline y-centre of a row (document-relative) */
const rowY = (idx: number) => idx * ROW_H + ROW_H / 2;

/* special y-centre with offset logic */
function nodeY(rowIdx: number, branch: BranchId, row: TimelineRow) {
  const base = rowY(rowIdx);
  if (row.split === branch) return base + OFFSET; // first child node ↓
  if (row.merge === branch) return base - OFFSET; // last child node ↑
  return base; // regular node
}

/* hex → rgba(r, g, b, a) helper */
const withAlpha = (hex: string, a: number) => {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

/* lookup tables */
const idleColor = Object.fromEntries(
  Object.entries(branchColor).map(([k, v]) => [k, withAlpha(v, 0.2)])
) as Record<BranchId, string>; // dim 20% opacity

const brightColor = branchColor; // full tint for active branch

/* ═════════════ tracker hook ═════════════ */
/**
 * - Accepts `stickyLinePx` (Y in viewport) and a ref to the timeline container.
 * - Registers each node's center in viewport coords, then calculates:
 *     triX_container = node_centerX_in_viewport  – container_left_in_viewport
 *     triY_container = node_centerY_in_viewport  – container_top_in_viewport
 *
 * - Picks whichever node is closest to the sticky line (in viewport space).
 * - Returns (x, y) **relative to the container** so that the glow can be `position: absolute` inside it.
 */
function useTriangleTracker(
  stickyLinePx: number,
  containerRef: React.RefObject<HTMLDivElement | null>
) {
  const nodeMap = useRef<Record<string, { centerX: number; centerY: number }>>(
    {}
  );
  const [centerId, setCenterId] = useState<string | null>(null);
  const [x, setX] = useState(0); // container-relative X for the glow center
  const [y, setY] = useState(0); // container-relative Y for the glow center
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    let frame = 0;

    const recalc = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (!containerRef.current) return;

        // Measure container's viewport position
        const containerRect = containerRef.current.getBoundingClientRect();
        const containerLeft = containerRect.left;
        const containerTop = containerRect.top;

        // Find which node is closest (in viewport-space) to the sticky line:
        let bestId: string | null = null;
        let bestDist = Infinity;
        Object.entries(nodeMap.current).forEach(([id, pos]) => {
          const dist = Math.abs(pos.centerY - stickyLinePx);
          if (dist < bestDist) {
            bestDist = dist;
            bestId = id;
          }
        });
        if (!bestId) return;

        // Grab that node's viewport center:
        const chosen = nodeMap.current[bestId];
        // Convert to container-relative coordinates:
        const x_in_container = chosen.centerX - containerLeft;
        const y_in_container = chosen.centerY - containerTop;

        // Update center ID if changed; always update X/Y so it's never stale
        if (bestId !== centerId) {
          setCenterId(bestId);
        }
        setX(x_in_container);
        setY(y_in_container);

        if (!ready) {
          setReady(true);
        }
      });
    };

    window.addEventListener("scroll", recalc, { passive: true });
    window.addEventListener("resize", recalc);
    recalc(); // initial measurement
    return () => {
      window.removeEventListener("scroll", recalc);
      window.removeEventListener("resize", recalc);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [centerId, stickyLinePx, ready, containerRef]);

  /**
   * When a node's <div> mounts, register its viewport center.
   * We store `centerX` and `centerY` here; on each recalc, re-measure them.
   */
  const register = (id: string, el: HTMLDivElement | null) => {
    if (!el) return;
    const rect = () => el.getBoundingClientRect();
    // We store the current viewport center of this node:
    nodeMap.current[id] = {
      centerX: rect().left + rect().width / 2,
      centerY: rect().top + rect().height / 2,
    };
  };

  return { x, y, centerId, register, ready };
}

/* ─────────── component ─────────── */
interface TimelineProps {
  rows: typeof timelineRows;
  headerRef?: React.RefObject<HTMLElement>;
  stickyOffset?: number;
}

export default function Timeline({
  rows,
  headerRef,
  stickyOffset = 80,
}: TimelineProps) {
  // ref to the root <div> for computing container coordinates
  const containerRef = useRef<HTMLDivElement>(null);

  /* sticky-line position = header bottom (viewport-space) */
  const [stickyY, setStickyY] = useState(stickyOffset);
  useLayoutEffect(() => {
    if (!headerRef?.current) {
      setStickyY(stickyOffset);
      return;
    }
    const measure = () =>
      setStickyY(headerRef.current!.getBoundingClientRect().bottom);

    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [headerRef, stickyOffset]);

  /* build vertical bars for child branches */
  type Segment = { branch: BranchId; top: number; height: number };
  const segments: Segment[] = [];
  const started: Record<string, number | null> = {};

  timelineRows.forEach((row, i) => {
    if (row.split) started[row.split] = i;

    if (row.merge && started[row.merge] !== null) {
      const sIdx = started[row.merge] as number;
      const startY = nodeY(sIdx, row.merge, timelineRows[sIdx]);
      const endY = nodeY(i, row.merge, row);
      segments.push({
        branch: row.merge,
        top: startY + NODE_R,
        height: endY - NODE_R - (startY + NODE_R),
      });
      started[row.merge] = null;
    }
  });

  //tracker for the glowing radial light source
  const {
    x: triX,
    y: triY,
    centerId,
    register,
    ready,
  } = useTriangleTracker(stickyY, containerRef);
  const activeBranch = centerId?.split("-").pop() as BranchId | undefined;

  /* ─────────── render ─────────── */
  return (
    <div
      ref={containerRef}
      className="relative"
      style={{
        display: "grid",
        marginTop: 100,
        marginBottom: 100,
        gridTemplateColumns: `repeat(${branchOrder.length}, ${COL_W}px)`,
        gridTemplateRows: `repeat(${timelineRows.length}, ${ROW_H}px)`,
      }}
    >
      {/* 
        glowing radial light source 
        • Changed from `position: fixed` → `position: absolute` 
        • Now `top` and `left` are in container-relative pixels (triX, triY are already container-relative). 
        • We still clamp: follow node until it reaches stickyY (viewport-space), 
          then “pin” at stickyY—but converted to container space by subtracting container top.
      */}
      <div
        className="pointer-events-none transition-opacity duration-200"
        style={{
          position: "absolute", // ← was "fixed"
          // Convert stickyY (viewport) to container space: stickyY - container.top
          // But triY is already in container space, so:
          top:
            Math.max(
              stickyY -
                (containerRef.current?.getBoundingClientRect().top ?? 0),
              triY
            ) - 60,
          left: triX - 60, // triX is container-relative, so no further subtraction
          opacity: ready ? 1 : 0,
          width: 120,
          height: 120,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)",
          mixBlendMode: "screen",
          filter: "blur(12px)",
          transitionProperty: "transform, opacity, top",
          transitionTimingFunction: "cubic-bezier(.25,1,.5,1)",
          transitionDuration: "400ms",
          zIndex: 35,
        }}
      />

      {/* main branch square + vertical */}
      <div
        style={{
          position: "absolute",
          left: colX("main") - NODE_R,
          top: 0,
          width: NODE_R * 2,
          height: NODE_R * 2,
          background: branchColor.main,
          boxShadow: "0 0 4px rgba(0,0,0,.25)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: colX("main") - LINE_W / 2,
          top: NODE_R * 2,
          width: LINE_W,
          height: `calc(100% - ${NODE_R * 2}px)`,
          background: branchColor.main,
        }}
      />

      {/* child vertical bars */}
      {segments.map((seg) => (
        <div
          key={`v-${seg.branch}-${seg.top}`}
          style={{
            position: "absolute",
            left: colX(seg.branch) - LINE_W / 2,
            top: seg.top,
            width: LINE_W,
            height: seg.height,
            background:
              activeBranch === seg.branch
                ? brightColor[seg.branch]
                : idleColor[seg.branch],
            boxShadow:
              activeBranch === seg.branch
                ? `0 0 6px 2px ${brightColor[seg.branch]}`
                : undefined,
          }}
        />
      ))}

      {/* rows ⇒ connectors + nodes */}
      {timelineRows.map((row, i) => {
        const connectors: React.ReactNode[] = [];

        /* curved split: parent ➜ child */
        const makeSplitCurve = (
          parent: BranchId,
          child: BranchId,
          rowIdx: number,
          r: TimelineRow,
          key: string
        ) => {
          const xP = colX(parent);
          const yP = nodeY(rowIdx, parent, r);
          const xC = colX(child);
          const yC = nodeY(rowIdx, child, r);

          const dx = Math.abs(xC - xP);
          const dy = yC - yP; // child lower ⇒ dy > 0
          const rad = dy / 2; // quarter-arc radius
          const flat = dx - 2 * rad; // straight part
          const color =
            activeBranch === child ? brightColor[child] : idleColor[child];

          const d = `M0 0
             Q 0 ${rad}  ${rad} ${rad}
             H ${rad + flat}
             Q ${dx} ${rad}  ${dx} ${dy}`;

          return (
            <svg
              key={key}
              width={dx}
              height={dy}
              style={{
                position: "absolute",
                left: Math.min(xP, xC) + NODE_R - LINE_W / 2 - 5,
                top: yP,
                overflow: "visible",
              }}
            >
              <path
                d={d}
                fill="none"
                stroke={color}
                strokeWidth={LINE_W}
                strokeLinecap="round"
                style={{
                  filter:
                    activeBranch === child
                      ? `drop-shadow(0 0 4px ${brightColor[child]})`
                      : "none",
                }}
              />
            </svg>
          );
        };

        /* curved merge: child ➜ parent */
        const makeMergeCurve = (
          child: BranchId,
          parent: BranchId,
          rowIdx: number,
          r: TimelineRow,
          key: string
        ) => {
          const xP = colX(parent);
          const yP = nodeY(rowIdx, parent, r);
          const xC = colX(child);
          const yC = nodeY(rowIdx, child, r);

          const dx = Math.abs(xC - xP);
          const dy = yC - yP;
          const rad = Math.abs(dy) / 2;
          const flat = dx - 2 * rad;
          const color =
            activeBranch === child ? brightColor[child] : idleColor[child];

          const d = `M0 0
             Q 0 ${-rad}  ${rad} ${-rad}
             H ${rad + flat}
             Q ${dx} ${-rad}  ${dx} ${dy}`;

          return (
            <svg
              key={key}
              width={dx}
              height={Math.abs(dy)}
              style={{
                position: "absolute",
                left: Math.min(xP, xC) + NODE_R - LINE_W / 2 - 5,
                top: yP,
                overflow: "visible",
              }}
            >
              <path
                d={d}
                fill="none"
                stroke={color}
                strokeWidth={LINE_W}
                strokeLinecap="round"
                style={{
                  filter:
                    activeBranch === child
                      ? `drop-shadow(0 0 4px ${brightColor[child]})`
                      : "none",
                }}
              />
            </svg>
          );
        };

        if (row.split) {
          connectors.push(
            makeSplitCurve(
              row.parent! as BranchId,
              row.split as BranchId,
              i,
              row,
              `sp-${row.id}`
            )
          );
        }
        if (row.merge) {
          connectors.push(
            makeMergeCurve(
              row.merge as BranchId,
              (row.parent ?? "main") as BranchId,
              i,
              row,
              `mg-${row.id}`
            )
          );
        }

        /* nodes on this row */
        const nodeList: { branch: BranchId; id: string }[] = [
          { branch: row.node, id: `${row.id}-${row.node}` },
        ];
        if (row.split && row.split !== row.node)
          nodeList.push({ branch: row.split, id: `${row.id}-${row.split}` });
        if (row.merge && row.merge !== row.node)
          nodeList.push({ branch: row.merge, id: `${row.id}-${row.merge}` });

        const nodes = nodeList.map(({ branch, id }) => (
          <Tooltip.Provider key={id} delayDuration={60}>
            <Tooltip.Root open={centerId === id}>
              <Tooltip.Trigger asChild>
                <div
                  ref={(el) => register(id, el)} // we still register viewport positions
                  style={{
                    position: "absolute",
                    left: colX(branch) - NODE_R,
                    top: nodeY(i, branch, row) - NODE_R,
                    width: NODE_R * 2,
                    height: NODE_R * 2,
                    borderRadius: "50%",
                    background:
                      activeBranch === branch
                        ? brightColor[branch]
                        : idleColor[branch],
                    boxShadow:
                      activeBranch === branch
                        ? `0 0 8px 3px ${brightColor[branch]}`
                        : "0 0 4px rgba(0,0,0,.25)",
                  }}
                />
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  side="right"
                  collisionPadding={8}
                  className="select-none rounded-md bg-gray-900 px-2 py-1 text-sm text-white shadow"
                >
                  {row.message}
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        ));

        return [...connectors, ...nodes];
      })}
    </div>
  );
}
