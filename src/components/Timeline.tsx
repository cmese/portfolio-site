/*  Animated Git-style timeline with glow tracker
    ────────────────────────────────────────────────────────────
    • Idle branches render at 20 % opacity (“dim”).
    • The branch under the fixed light source brightens and gains a glow.
    • A radial-gradient overlay (mix-blend-mode: screen) acts as the moving
      light source; its X position is driven by the tracker logic while
      its Y is fixed to the sticky header’s bottom edge.
*/

"use client";

import React, { useRef, useState, useLayoutEffect } from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { timelineRows, BranchId, TimelineRow } from "@/data/timeline";
import { branchOrder, branchColor } from "@/data/branchPalette";

const COL_W = 120; // width of one branch column
const ROW_H = 120; // height of one timeline row
const LINE_W = 4; // stroke / bar thickness
const NODE_R = 8; // node radius (16×16 circle)
const OFFSET = 26; // vertical nudge for first / last child nodes

/* ─────────── helpers ─────────── */
/* x-centre of any column */
const colX = (b: (typeof branchOrder)[number]) =>
  branchOrder.indexOf(b) * COL_W + COL_W / 2;

/* baseline y-centre of a row */
const rowY = (idx: number) => idx * ROW_H + ROW_H / 2;

/* special y-centre with offset logic */
function nodeY(rowIdx: number, branch: BranchId, row: TimelineRow) {
  const base = rowY(rowIdx);
  if (row.split === branch) return base + OFFSET; // first child node ↓
  if (row.merge === branch) return base - OFFSET; // last  child node ↑
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
) as Record<BranchId, string>; // dim 20 % opacity

const brightColor = branchColor; // full tint for active branch

/* ═════════════ tracker hook ═════════════ */
function useTriangleTracker(stickyLinePx: number) {
  const nodeMap = useRef<Record<string, { x: number; getY: () => number }>>({});
  const [centerId, setCenterId] = useState<string | null>(null);
  const [x, setX] = useState(0);

  useLayoutEffect(() => {
    let frame = 0;

    const recalc = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;

        /* nearest node to sticky line */
        let bestId: string | null = null;
        let bestDist = Infinity;
        Object.entries(nodeMap.current).forEach(([id, n]) => {
          const d = Math.abs(n.getY() - stickyLinePx);
          if (d < bestDist) {
            bestDist = d;
            bestId = id;
          }
        });

        if (bestId && bestId !== centerId) {
          setCenterId(bestId);
          setX(nodeMap.current[bestId].x);
        }
      });
    };

    window.addEventListener("scroll", recalc, { passive: true });
    window.addEventListener("resize", recalc);
    recalc(); // initial pass

    return () => {
      window.removeEventListener("scroll", recalc);
      window.removeEventListener("resize", recalc);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [centerId, stickyLinePx]);

  const register = (id: string, el: HTMLDivElement | null) => {
    if (!el) return;
    const rect = () => el.getBoundingClientRect();
    nodeMap.current[id] = {
      x: rect().left + rect().width / 2,
      getY: () => rect().top + rect().height / 2,
    };
  };

  return { x, centerId, register };
}

/* ─────────── component ─────────── */
interface TimelineProps {
  rows: typeof timelineRows;
  headerRef: React.RefObject<HTMLElement>;
}

export default function Timeline({ rows, headerRef }: TimelineProps) {
  /* sticky-line position = header bottom (updates on scroll / resize) */
  const [stickyY, setStickyY] = useState(0);
  useLayoutEffect(() => {
    const measure = () => {
      if (headerRef.current)
        setStickyY(headerRef.current.getBoundingClientRect().bottom);
    };
    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [headerRef]);

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

  /* tracker */
  const { x: triX, centerId, register } = useTriangleTracker(stickyY);
  const activeBranch = centerId?.split("-").pop() as BranchId | undefined;

  /* ─────────── render ─────────── */
  return (
    <div
      className="relative"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${branchOrder.length}, ${COL_W}px)`,
        gridTemplateRows: `repeat(${timelineRows.length}, ${ROW_H}px)`,
      }}
    >
      {/* glowing radial light source */}
      <div
        className="pointer-events-none"
        style={{
          position: "fixed",
          top: stickyY - 60, // centre 120-px circle
          left: 0,
          transform: `translateX(${triX - 60}px)`,
          width: 120,
          height: 120,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)",
          mixBlendMode: "screen",
          filter: "blur(12px)",
          transition: "transform 400ms cubic-bezier(.25,1,.5,1)",
          zIndex: 35,
        }}
      />

      {/* invisible tracker (keeps translateX maths unchanged) */}
      <div
        style={{
          position: "fixed",
          opacity: 0,
          top: stickyY,
          left: 0,
          width: 24,
          height: 24,
          transform: `translateX(${triX - 12}px)`,
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
                  ref={(el) => register(id, el)}
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
