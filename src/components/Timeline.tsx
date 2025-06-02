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

/* ─────────────────── helpers ─────────────────── */
/* x-centre of any column */
const colX = (b: (typeof branchOrder)[number]) =>
  branchOrder.indexOf(b) * COL_W + COL_W / 2;

/* baseline y-centre of a row */
const rowY = (idx: number) => idx * ROW_H + ROW_H / 2;

/* special y-centre with offset logic */
function nodeY(rowIdx: number, branch: BranchId, row: TimelineRow) {
  const base = rowY(rowIdx);
  if (row.split === branch) return base + OFFSET; // first child node
  if (row.merge === branch) return base - OFFSET; // last  child node
  return base; // regular node
}

function useTriangleTracker(stickyLinePx: number) {
  const nodeMap = useRef<Record<string, { x: number; getY: () => number }>>({});
  const [centerId, setCenterId] = useState<string | null>(null);
  const [x, setX] = useState(0);

  useLayoutEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;

        /* pick node whose centre-Y is closest to stickyLinePx */
        let bestId: string | null = null;
        let bestDist = Infinity;
        Object.entries(nodeMap.current).forEach(([id, n]) => {
          const dist = Math.abs(n.getY() - stickyLinePx);
          if (dist < bestDist) {
            bestDist = dist;
            bestId = id;
          }
        });

        if (bestId && bestId !== centerId) {
          setCenterId(bestId);
          setX(nodeMap.current[bestId].x);
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // recalc immediately
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [centerId, stickyLinePx]);

  /** node registration */
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

/* props */
interface TimelineProps {
  rows: typeof timelineRows;
  headerRef: React.RefObject<HTMLElement>;
}

/* ═════════════════════ component ═════════════════════ */
export default function Timeline({ rows, headerRef }: TimelineProps) {
  /* get the stickline (bottom edge of header) */
  const [stickyY, setStickyY] = useState(0);
  useLayoutEffect(() => {
    const measure = () => {
      if (!headerRef.current) return;
      setStickyY(headerRef.current.getBoundingClientRect().bottom);
    };

    measure(); // run once
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);

    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [headerRef]);

  /* 1. build vertical segments for every child branch */
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

  //triangle tracker setup – stickyLine = header height + 10 px
  const HEADER_H = 56; // <h2> ≈ 48 px + margin → tweak
  const { x: triX, centerId, register } = useTriangleTracker(stickyY);

  /* grid container */
  return (
    <div
      className="relative"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${branchOrder.length}, ${COL_W}px)`,
        gridTemplateRows: `repeat(${timelineRows.length}, ${ROW_H}px)`,
      }}
    >
      {/* triangle – fixed Y just under sticky header */}
      <div
        className="pointer-events-none"
        style={{
          position: "fixed",
          top: stickyY, // always sits on the sticky line
          left: 0,
          transform: `translateX(${triX - 12}px)`,
          transition: "transform 400ms cubic-bezier(.25,1,.5,1)", // smooth ease
          width: 24,
          height: 24,
          clipPath: "polygon(50% 0,100% 100%,0 100%)",
          background: "#facc15",
          zIndex: 30,
        }}
      />

      {/* main square + vertical */}
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
            background: branchColor[seg.branch],
          }}
        />
      ))}

      {/* rows ⇒ connectors + nodes  */}
      {timelineRows.map((row, i) => {
        const connectors: React.ReactNode[] = [];

        /* curved split  (parent ➜ child)   “L───┐”  down-right + right-down */
        const makeSplitCurve = (
          parent: BranchId,
          child: BranchId,
          rowIdx: number,
          row: TimelineRow,
          key: string
        ) => {
          const xP = colX(parent);
          const yP = nodeY(rowIdx, parent, row);
          const xC = colX(child);
          const yC = nodeY(rowIdx, child, row);

          const dx = Math.abs(xC - xP);
          const dy = yC - yP; // child lower ⇒ dy > 0
          const r = dy / 2; // quarter-arc radius
          const flat = dx - 2 * r; // straight section length
          const color = branchColor[child];

          /* path: down-right ¼-arc → flat → right-down ¼-arc */
          const d = `M0 0
             Q 0 ${r}  ${r} ${r}
             H ${r + flat}
             Q ${dx} ${r}  ${dx} ${dy}`;

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
              />
            </svg>
          );
        };

        const makeMergeCurve = (
          child: BranchId,
          parent: BranchId,
          rowIdx: number,
          row: TimelineRow,
          key: string
        ) => {
          const xP = colX(parent);
          const yP = nodeY(rowIdx, parent, row);
          const xC = colX(child);
          const yC = nodeY(rowIdx, child, row);

          const dx = Math.abs(xC - xP);
          const dy = yC - yP;
          const r = Math.abs(dy) / 2;
          const flat = dx - 2 * r;
          const color = branchColor[child];

          // symmetrical mirror to split curve
          const d = `M0 0
             Q 0 ${-r}  ${r} ${-r}
             H ${r + flat}
             Q ${dx} ${-r}  ${dx} ${dy}`;

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

        /* ---------- node circles ---------- */
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
                    background: branchColor[branch],
                    boxShadow: "0 0 4px rgba(0,0,0,.25)",
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
