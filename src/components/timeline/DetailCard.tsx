// src/components/DetailCard.tsx
import React, { useMemo } from "react";
import type { TLDetails, TLNode, TimelineRow } from "@/data/timeline";

// Small helper: "row-12-work" -> { index: 12, branch: "work" }
function parseUiNodeId(id: string | null) {
  if (!id) return null;
  const m = /^row-(\d+)-(.+)$/.exec(id);
  if (!m) return null;
  return { index: Number(m[1]), branch: m[2] };
}

export default function DetailCard({
  centerId, // e.g. "row-2-main"
  rows, // TimelineRow[] (from buildTimeline)
  nodes, // TLNode[] (your authoring nodes)
  detailsMap, // TLDetails (your details object)
}: {
  centerId: string | null;
  rows: TimelineRow[];
  nodes: TLNode[];
  detailsMap: TLDetails;
}) {
  // Resolve the authoring node id for the currently centered UI node
  const resolved = useMemo(() => {
    const parsed = parseUiNodeId(centerId);
    if (!parsed)
      return {
        uiId: centerId,
        nodeId: centerId,
        node: undefined,
        det: undefined,
      };

    const row = rows[parsed.index];
    if (!row)
      return {
        uiId: centerId,
        nodeId: centerId,
        node: undefined,
        det: undefined,
      };

    // This is the authoring TLNode id for the event on that row
    const nodeId = row.id;
    const node = nodes.find((n) => n.id === nodeId);
    const det = node?.detailsId ? detailsMap[node.detailsId] : undefined;

    return { uiId: centerId, nodeId, node, det };
  }, [centerId, rows, nodes, detailsMap]);

  const title =
    resolved.det?.title ?? resolved.node?.title ?? resolved.nodeId ?? "—";
  const summary = resolved.det?.summary;
  const bullets = resolved.det?.bullets ?? [];
  const links = resolved.det?.links ?? [];
  const media = resolved.det?.media ?? [];

  return (
    <aside className="sticky top-10 space-y-4">
      <div className="opacity-60 text-xs uppercase tracking-wide">
        Now viewing
      </div>
      <h2 className="text-2xl font-semibold leading-snug">{title}</h2>

      {summary && (
        <p className="text-sm leading-relaxed opacity-90">{summary}</p>
      )}

      {bullets.length > 0 && (
        <ul className="list-disc pl-5 space-y-1 text-sm">
          {bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      )}

      {links.length > 0 && (
        <div className="space-y-1">
          {links.map((l, i) => (
            <a
              key={i}
              href={l.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center text-sm underline underline-offset-2 hover:opacity-80"
            >
              {l.label}
            </a>
          ))}
        </div>
      )}

      {media.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {media.map((m, i) => (
            <figure
              key={i}
              className="overflow-hidden rounded-md border border-black/10"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={m.src}
                alt={m.alt}
                className="w-full h-auto object-cover"
              />
              {m.alt && (
                <figcaption className="p-2 text-xs opacity-70">
                  {m.alt}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      )}
    </aside>
  );
}
