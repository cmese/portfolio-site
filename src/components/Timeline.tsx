"use client";

import React, { useRef } from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { BranchId, TimelineRow, Segment } from "@/data/timeline";
import { branchOrder, branchColor } from "@/data/branchPalette";

import { COL_W, ROW_H, LINE_W, NODE_R, nodeY, colX } from "./timeline/geometry";
import { idleColor, brightColor } from "./timeline/colors";
import { useScrollTracker } from "../hooks/useScrollTracker";

interface TimelineProps {
  rows: TimelineRow[];
  segments: Segment[];
  containerRef: React.RefObject<HTMLDivElement | null>;
  firstNodeRef: React.RefObject<HTMLDivElement | null>;
  lastNodeRef: React.RefObject<HTMLDivElement | null>;
  registerNode: ReturnType<typeof useScrollTracker>["registerNode"];
  ready: boolean;
  spotlightX: number;
  spotlightY: number;
  scrollPhase: "phase1" | "phase2" | "phase3";
  centerId: string | null;
  containerTransform: number;
}

export default function Timeline({
  rows,
  segments,
  containerRef,
  firstNodeRef,
  lastNodeRef,
  registerNode,
  ready,
  spotlightX,
  spotlightY,
  scrollPhase,
  centerId,
  containerTransform,
}: TimelineProps) {
  // Which branch is active? (e.g. "main", "featureX", etc.)
  const activeBranch = centerId?.split("-").pop() as BranchId | undefined;

  /* Split & merge curve builders */
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
    const dy = yC - yP;
    const rad = dy / 2;
    const flat = dx - 2 * rad;
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
            transition: "all 0.3s ease-out",
          }}
        />
      </svg>
    );
  };

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
            transition: "all 0.3s ease-out",
          }}
        />
      </svg>
    );
  };

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{
        display: "grid",
        width: "max-content",
        gridTemplateColumns: `repeat(${branchOrder.length}, ${COL_W}px)`,
        gridTemplateRows: `repeat(${rows.length}, ${ROW_H}px)`,
        transform: `translateY(${containerTransform}px)`,
        transition: "transform 0.1s linear",
      }}
    >
      {/* Spotlight circle */}
      <div
        className="pointer-events-none transition-all duration-300 ease-out"
        style={{
          position: "absolute",
          left: spotlightX - 60,
          top: spotlightY - 60,
          width: 120,
          height: 120,
          borderRadius: "50%",
          background:
            scrollPhase === "phase2"
              ? "radial-gradient(circle at center, rgba(255,255,255,1) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 80%)"
              : "radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.1) 60%, rgba(255,255,255,0) 80%)",
          mixBlendMode: "screen",
          filter: scrollPhase === "phase2" ? "blur(6px)" : "blur(10px)",
          transform: scrollPhase === "phase2" ? "scale(1.3)" : "scale(1)",
          opacity: ready ? 1 : 0,
          zIndex: 35,
        }}
      />

      {/* Debug box 
      <div className="sticky top-4 left-100 bg-black/70 text-white px-3 py-2 rounded text-sm z-50 font-mono">
        <div>Phase: {scrollPhase}</div>
        <div>Active: {centerId || "none"}</div>
      </div>*/}

      {/* Main branch node & vertical line */}
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

      {/* Child-branch vertical segments */}
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
            transition: "all 0.3s ease-out",
          }}
        />
      ))}

      {/* Rows: connectors + nodes */}
      {rows.map((row, i) => {
        const connectors: React.ReactNode[] = [];

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

        /* Collect all nodes on this row: (row.node, row.split, row.merge) */
        const nodeList: { branch: BranchId; id: string }[] = [
          { branch: row.node, id: `row-${i}-${row.node}` },
        ];
        if (row.split && row.split !== row.node)
          nodeList.push({ branch: row.split, id: `row-${i}-${row.split}` });
        if (row.merge && row.merge !== row.node)
          nodeList.push({ branch: row.merge, id: `row-${i}-${row.merge}` });

        const nodes = nodeList.map(({ branch, id }) => {
          // Determine if this is the very first or very last node,
          // so we can attach special refs for measurement:
          const isFirst = i === 0 && branch === rows[0].node;
          const isLast =
            i === rows.length - 1 && branch === rows[rows.length - 1].node;

          return (
            <Tooltip.Provider key={id} delayDuration={60}>
              <Tooltip.Root open={centerId === id}>
                <Tooltip.Trigger asChild>
                  <div
                    // 1) If it’s the first-row, main-branch node, assign firstNodeRef
                    // 2) If it’s the last-row, main-branch node, assign lastNodeRef
                    ref={(el) => {
                      if (isFirst) firstNodeRef.current = el;
                      if (isLast) lastNodeRef.current = el;
                      registerNode(id, branch, i, el);
                    }}
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
                          ? `0 0 12px 4px ${brightColor[branch]}`
                          : "0 0 4px rgba(0,0,0,.25)",
                      transition: "all 0.3s ease-out",
                      transform: centerId === id ? "scale(1.1)" : "scale(1)",
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
          );
        });

        return [...connectors, ...nodes];
      })}
    </div>
  );
}
