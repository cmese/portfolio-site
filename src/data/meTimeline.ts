import { TLNode, BranchSpan, TLDetails } from "./timeline";

/**
 * Branch guide
 * - main  : personal/career headline
 * - school: education (splits from main in 2012, merges back in 2018)
 * - work  : professional experience (splits off school at first role, stays open)
 */

export const nodes: TLNode[] = [
  /* ---------- MAIN (personal/career headline) ---------- */
  {
    id: "birth",
    kind: "milestone",
    branch: "main",
    title: "Born (NY area)",
    dateIndex: 1,
    detailsId: "d_birth",
  },
  {
    id: "first-pc",
    kind: "milestone",
    branch: "main",
    title: "First PC • started tinkering & web dev",
    dateIndex: 2,
    detailsId: "d_firstpc",
  },

  /* ---------- SCHOOL splits from MAIN ---------- */
  {
    id: "start-college",
    kind: "split",
    branch: "main",
    title: "Start College (split → school)",
    dateIndex: 3,
    detailsId: "d_start_college",
  },

  // JHU years
  {
    id: "jhu-years",
    kind: "milestone",
    branch: "school",
    title: "Johns Hopkins (CS & pre-med, transfer)",
    dateIndex: 4,
    detailsId: "d_jhu",
  },

  /* ---------- WORK splits from SCHOOL (first role) ---------- */
  {
    id: "jhu-job",
    kind: "split",
    branch: "school",
    title: "Assistant SysAdmin — JHU Physics & Astro (split → work)",
    dateIndex: 5,
    detailsId: "d_jhu_job",
  },

  // USF years + degree
  {
    id: "usf-years",
    kind: "milestone",
    branch: "school",
    title: "University of South Florida (CS)",
    dateIndex: 6,
    detailsId: "d_usf",
  },
  {
    id: "usf-grad",
    kind: "merge",
    branch: "school",
    title: "B.S. in Computer Science — USF (merge school → main)",
    dateIndex: 7,
    detailsId: "d_usf_grad",
  },

  /* ---------- MAIN continues ---------- */
  {
    id: "postgrad",
    kind: "milestone",
    branch: "main",
    title: "Graduated; focus on engineering career",
    dateIndex: 8,
    detailsId: "d_postgrad",
  },

  /* ---------- WORK milestones (open-ended branch) ---------- */
  {
    id: "gas-coowner",
    kind: "milestone",
    branch: "work",
    title: "Co-owner/Manager — Gas Stations (ops, POS, inventory)",
    dateIndex: 9,
    detailsId: "d_gas",
  },
  {
    id: "micjo",
    kind: "milestone",
    branch: "work",
    title: "MicJo Inc. — Magento B2B, 1k+ SKUs, bulk tooling",
    dateIndex: 10,
    detailsId: "d_micjo",
  },
  {
    id: "policyshopper",
    kind: "milestone",
    branch: "work",
    title: "Policy Shopper — WordPress + Zoho/Jenesis CRM",
    dateIndex: 11,
    detailsId: "d_policy",
  },
  {
    id: "mv-start",
    kind: "milestone",
    branch: "work",
    title: "Mosaic Voice — Founding Engineer (React Native + FastAPI)",
    dateIndex: 12,
    detailsId: "d_mv_start",
  },
  {
    id: "mv-native",
    kind: "milestone",
    branch: "work",
    title: "Custom Swift/Kotlin modules, drag-grid, perf/caching",
    dateIndex: 13,
    detailsId: "d_mv_native",
  },
  {
    id: "mv-ops",
    kind: "milestone",
    branch: "work",
    title: "CI/CD (EAS), Sentry, presigned S3 URLs, image caching",
    dateIndex: 14,
    detailsId: "d_mv_ops",
  },
  {
    id: "mv-llm",
    kind: "milestone",
    branch: "work",
    title: "On-device LLM for AAC (Gemma-3N / Apple FM)",
    dateIndex: 15,
    detailsId: "d_mv_llm",
  },

  /* ---------- MAIN current meta milestones ---------- */
  {
    id: "portfolio-2025",
    kind: "milestone",
    branch: "main",
    title: "Portfolio site revamp (this timeline UI)",
    dateIndex: 16,
    detailsId: "d_portfolio",
  },
  {
    id: "interview-sprint",
    kind: "milestone",
    branch: "main",
    title: "Interview prep sprint (LeetCode, resume, demos)",
    dateIndex: 17,
    detailsId: "d_sprint",
  },
];

/**
 * Spans define branch lifetimes (and connections).
 * - school: from start-college → usf-grad (merges back to main)
 * - work: from jhu-job and remains open (no merge yet)
 */
export const spans: BranchSpan[] = [
  {
    branch: "school",
    parent: "main",
    startsAt: "start-college",
    endsAt: "usf-grad",
  },
  { branch: "work", parent: "school", startsAt: "jhu-job", endsAt: "__END__" },
];

/* Optional: richer right-panel content keyed by detailsId */
export const details: TLDetails = {
  d_birth: {
    title: "Roots",
    summary: "Grew up near NYC; curiosity for making & fixing things early.",
  },
  d_firstpc: {
    title: "First PC",
    bullets: ["Built small sites/scripts", "Learned by breaking then fixing"],
  },

  d_start_college: {
    title: "College Begins",
    summary: "Formal track in CS & sciences.",
  },
  d_jhu: {
    title: "Johns Hopkins (2012–2015)",
    bullets: ["CS & pre-med coursework", "Transfer later to USF"],
  },
  d_jhu_job: {
    title: "Assistant SysAdmin @ JHU (2014–2015)",
    bullets: ["Ubuntu + SLURM HPC support", "Python wiki backups"],
  },

  d_usf: {
    title: "USF (2016–2018)",
    bullets: ["CS core: DS/Algo, Systems, SWE"],
  },
  d_usf_grad: {
    title: "B.S. in Computer Science — USF (2018)",
    summary: "School branch merges back into main.",
  },
  d_postgrad: {
    title: "Post-grad",
    summary: "Shift to hands-on engineering roles & ops.",
  },

  d_gas: {
    title: "Gas Stations (2017–2023)",
    bullets: ["Ops at scale: POS/Inventory upgrades", "Cut stock-outs ~40%"],
  },
  d_micjo: {
    title: "MicJo (2019–2021)",
    bullets: ["Magento B2B", "Bulk import tooling → days → hours"],
  },
  d_policy: {
    title: "Policy Shopper (2021–2022)",
    bullets: [
      "WP site",
      "Zoho + Jenesis CRM integration",
      "Save ~10 hrs/employee/wk",
    ],
  },

  d_mv_start: {
    title: "Mosaic Voice (2022–present)",
    summary: "Founding engineer on AAC mobile app.",
  },
  d_mv_native: {
    title: "Native modules",
    bullets: [
      "RN-bridged Swift/Kotlin grid",
      "Virtualization & smooth scroll @ 5k+ assets",
    ],
  },
  d_mv_ops: {
    title: "Ops & Reliability",
    bullets: ["EAS CI/CD", "Sentry signals", "Presigned S3 URLs + caching"],
  },
  d_mv_llm: {
    title: "On-device LLM",
    bullets: ["Gemma-3N / Apple FM", "Prediction bar & local inference"],
  },

  d_portfolio: {
    title: "Portfolio Revamp",
    summary: "Interactive git-style timeline; spotlight tracking; responsive.",
  },
  d_sprint: {
    title: "Interview Sprint",
    bullets: ["Daily LeetCode tasks", "Resume polish", "Demo-ready commits"],
  },
};
