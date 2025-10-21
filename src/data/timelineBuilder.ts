import {
  TLNode,
  BranchSpan,
  BranchId,
  TimelineRow,
  BuiltTimeline,
  Segment,
} from "./timeline";
import { NODE_R, nodeY } from "@/components/timeline/geometry";

function invariant(cond: any, msg: string): asserts cond {
  if (!cond) throw new Error(`[timeline] ${msg}`);
}

function validate(nodes: TLNode[], spans: BranchSpan[]) {
  const ids = new Set(nodes.map((n) => n.id));
  const branches = new Set<BranchId>(nodes.map((n) => n.branch));

  for (const s of spans) {
    invariant(
      ids.has(s.startsAt),
      `span ${s.branch} startsAt not found: ${s.startsAt}`
    );
    if (s.endsAt && s.endsAt !== "__END__") {
      invariant(
        ids.has(s.endsAt),
        `span ${s.branch} endsAt not found: ${s.endsAt}`
      );
    }
    invariant(
      branches.has(s.branch),
      `span branch not present in nodes: ${s.branch}`
    );
    invariant(
      branches.has(s.parent),
      `span parent not present in nodes: ${s.parent}`
    );
  }

  const seen = new Set<string>();
  for (const s of spans) {
    const key = String(s.branch);
    invariant(
      !seen.has(key),
      `branch ${s.branch} defined more than once in spans`
    );
    seen.add(key);
  }
}

export function buildTimeline(
  nodes: TLNode[],
  spans: BranchSpan[]
): BuiltTimeline {
  validate(nodes, spans);

  const ordered = [...nodes].sort((a, b) => {
    const ai = a.dateIndex ?? Number.MAX_SAFE_INTEGER;
    const bi = b.dateIndex ?? Number.MAX_SAFE_INTEGER;
    return ai - bi;
  });

  const idxById = new Map<string, number>(ordered.map((n, i) => [n.id, i]));

  const rows: TimelineRow[] = ordered.map((n) => ({
    id: n.id,
    node: n.branch as BranchId,
    message: n.title,
  }));

  for (const span of spans) {
    const sRow = idxById.get(span.startsAt);
    let eRow =
      span.endsAt && span.endsAt !== "__END__"
        ? idxById.get(span.endsAt)
        : undefined;

    invariant(
      sRow !== undefined,
      `startsAt not found in idx map: ${span.startsAt}`
    );
    if (eRow !== undefined) {
      invariant(
        eRow! > sRow!,
        `merge must appear after split for ${span.branch}`
      );
    } else {
      // open span → choose the last relevant row for this branch
      for (let i = rows.length - 1; i >= 0; i--) {
        const r = rows[i];
        if (
          r.node === span.branch ||
          r.split === span.branch ||
          r.merge === span.branch
        ) {
          eRow = i;
          break;
        }
      }
      if (eRow === undefined) eRow = rows.length - 1;
    }

    rows[sRow!].split = span.branch;
    rows[sRow!].parent = span.parent;

    // Only mark a merge if the span actually ends at a node (not open)
    if (span.endsAt && span.endsAt !== "__END__") {
      rows[eRow!].merge = span.branch;
      rows[eRow!].parent = span.parent;
    }
  }

  // Precompute vertical segments (moved out of component)
  const started: Record<string, number | null> = {};
  const segments: Segment[] = [];

  ordered.forEach((_, i) => {
    const r = rows[i];
    if (r.split) started[r.split] = i;
    if (
      r.merge &&
      started[r.merge] !== null &&
      started[r.merge] !== undefined
    ) {
      const sIdx = started[r.merge] as number;
      const startY = nodeY(sIdx, r.merge, rows[sIdx]);
      const endY = nodeY(i, r.merge, r);

      segments.push({
        branch: r.merge,
        top: startY + NODE_R,
        height: endY - NODE_R - (startY + NODE_R),
      });
      started[r.merge] = null;
    } else {
      // Handle open-ended spans: if a branch was started but never merged,
      // extend the segment to the last chosen end row for that branch.
      // This works because we already wrote split flags above; we just need to flush at the final row.
      // We detect "final row" by checking i === rows.length - 1 and any started branches.
      if (i === rows.length - 1) {
        for (const branch in started) {
          const sIdx = started[branch];
          if (sIdx !== null && sIdx !== undefined) {
            const startY = nodeY(sIdx, branch as BranchId, rows[sIdx]);
            const endY = nodeY(i, branch as BranchId, rows[i]);
            segments.push({
              branch: branch as BranchId,
              top: startY + NODE_R,
              height: endY - NODE_R - (startY + NODE_R),
            });
            started[branch] = null;
          }
        }
      }
    }
  });

  return { rows, segments, idxById };
}
