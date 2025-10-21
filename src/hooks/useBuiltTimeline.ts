import { useMemo } from "react";
import { buildTimeline } from "@/data/timelineBuilder";
import { nodes, spans } from "@/data/meTimeline";

export function useBuiltTimeline() {
  return useMemo(() => buildTimeline(nodes, spans), []);
}
