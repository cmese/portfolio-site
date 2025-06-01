export const branchOrder = ["main", "school", "work", "edu"] as const;

export const branchColor: Record<(typeof branchOrder)[number], string> = {
  main: "#3b82f6", // blue
  school: "#ef4444", // red
  work: "#eab308", // yellow
  edu: "#22c55e", // green
};
