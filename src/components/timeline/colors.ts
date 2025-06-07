import { BranchId } from "@/data/timeline";
import { branchColor } from "@/data/branchPalette";

/** Hex → rgba with alpha */
export const withAlpha = (hex: string, a: number) => {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

/** When branch is not active, dim to 20% opacity */
export const idleColor = Object.fromEntries(
  Object.entries(branchColor).map(([k, v]) => [k, withAlpha(v, 0.2)])
) as Record<BranchId, string>;

/** Full tint for active branch */
export const brightColor = branchColor;
