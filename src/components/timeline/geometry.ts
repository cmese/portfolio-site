import { BranchId, TimelineRow } from "@/data/timeline";
import { branchOrder } from "@/data/branchPalette";

// width of one branch column (px)
export const COL_W = 120;

// height of one timeline row (px)
export const ROW_H = 120;

// stroke thickness (px)
export const LINE_W = 4;

// node radius (8px => 16×16 circle)
export const NODE_R = 8;

// vertical nudge for split/merge children (px)
export const OFFSET = 26;

/* ─────────── helpers ─────────── */
/** X-center of a column */
export const colX = (b: (typeof branchOrder)[number]) =>
  branchOrder.indexOf(b) * COL_W + COL_W / 2;

/** Baseline Y-center of a row */
export const rowY = (idx: number) => idx * ROW_H + ROW_H / 2;

/**
 * If this row has a split or merge for this branch, nudge by OFFSET.
 * Otherwise keep on baseline.
 */
export function nodeY(rowIdx: number, branch: BranchId, row: TimelineRow) {
  const base = rowY(rowIdx);
  if (row.split === branch) return base + OFFSET; // first child node ↓
  if (row.merge === branch) return base - OFFSET; // last child node ↑
  return base; // regular node
}
