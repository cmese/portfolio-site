export type BranchId = "main" | "school" | "work" | "edu";

export interface TimelineRow {
  id: string; // unique key
  node: BranchId; // branch that gets a circle on this row
  message: string; // tooltip
  split?: BranchId; // child branch that starts here
  parent?: BranchId; // required if split is present (who it splits from)
  merge?: BranchId; // child branch that ends (merges) here
}

/* ---- demo rows ---- */
// timeline.ts   — append / edit rows only
export const timelineRows: TimelineRow[] = [
  { id: "r1", node: "main", message: "Birth of Chris" },
  { id: "r2", node: "main", message: "First PC" },

  /* school branch born off main */
  {
    id: "r3",
    node: "main",
    message: "Start School",
    split: "school",
    parent: "main",
  },

  /* extra main nodes while school is alive */
  {
    id: "r4",
    node: "main",
    message: "Built first website",
    split: "work",
    parent: "main",
  },
  {
    id: "r5",
    node: "main",
    message: "Joined chess club",
    merge: "work",
    parent: "main",
  },

  /* -------------     SCHOOL branch nodes     ------------- */
  { id: "r6", node: "school", message: "HS Coding Club" },

  /* >>> third-to-last school node — edu splits here <<< */
  {
    id: "r7",
    node: "school",
    message: "Boot-camp Enrol",
    split: "edu",
    parent: "school",
  },

  /* edu branch content */
  { id: "r8", node: "edu", message: "Boot-camp Homework" },

  /* >>> second-to-last school node — edu merges back <<< */
  {
    id: "r9",
    node: "school",
    message: "Boot-camp Done",
    merge: "edu",
    parent: "school",
  },

  { id: "r10", node: "school", message: "CS Degree" }, // last school node

  /* school merges back into main */
  {
    id: "r11",
    node: "main",
    message: "Graduated",
    merge: "school",
    parent: "main",
  },

  { id: "r12", node: "main", message: "First Dev Job" },
];
