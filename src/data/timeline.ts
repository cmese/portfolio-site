export type BranchId = "main" | "school" | "work" | "edu" | (string & {});

// Derived row shape renderer already understands
export interface TimelineRow {
  id: string;
  node: BranchId;
  message: string;
  split?: BranchId;
  parent?: BranchId;
  merge?: BranchId;
}

// Authoring types (layout-agnostic)
export type NodeKind = "milestone" | "split" | "merge";
export interface TLNode {
  id: string;
  kind: NodeKind;
  branch: BranchId;
  title: string;
  /** Optional ordering index if not using dates */
  dateIndex?: number;
  /** Key for right-panel content */
  detailsId?: string;
}
export interface BranchSpan {
  branch: BranchId; // child branch
  parent: BranchId; // parent branch
  startsAt: string; // node id where child splits
  /** node id where child megerges. When omitted or set to "__END__", the branch stays open to the last relevant row */
  endsAt?: string | "__END__";
}

// Precomputed vertical child-branch segments for rendering
export type Segment = { branch: BranchId; top: number; height: number };

export interface BuiltTimeline {
  rows: TimelineRow[];
  segments: Segment[];
  idxById: Map<string, number>;
}

// Optional richer right-panel content map
export interface TLDetails {
  [detailsId: string]: {
    title: string;
    summary?: string;
    bullets?: string[];
    links?: { label: string; href: string }[];
    media?: { src: string; alt: string }[];
  };
}

// (moved demo data to src/data/meTimeline.ts)
