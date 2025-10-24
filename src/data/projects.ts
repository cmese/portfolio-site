// src/data/projects.ts
export type Project = {
  id: string;
  title: string;
  description: string;
  tags: string[]; // e.g. ["React", "TypeScript", "Tailwind"]
  image: string; // poster/thumbnail
  video?: string;
  gif?: string;
  hrefDemo?: string;
  hrefRepo?: string;

  // NEW
  company?: string;
  location?: string;
  dates?: string; // human readable
  highlights?: string[]; // bullet points
};

export const projects: Project[] = [
  {
    id: "mv-aac",
    title: "Mosaic Voice — AAC",
    company: "MosaicVoiceAAC",
    location: "Remote",
    dates: "Jun 2022 – Present",
    description:
      "Production AAC mobile app. Led the React Native front-end and built 20+ FastAPI endpoints; native Swift/Kotlin grid for smooth scrolling across 5k+ assets; CI/CD with EAS + GitHub Actions; observability with Sentry.",
    tags: [
      "React Native",
      "Expo",
      "FastAPI",
      "Auth0",
      "AWS (S3)",
      "Swift",
      "Kotlin",
      "GitHub Actions",
      "Sentry",
    ],
    image: "/projects/mv/poster.webp",
    video: "/projects/mv/preview.webm",
    hrefDemo: "https://mosaicvoiceaac.com",
    highlights: [
      "Architected RN app (navigation, gestures, accessibility, performance).",
      "Implemented 20+ REST endpoints (Auth0/JWT, CRUD, pagination, presigned S3 uploads).",
      "Custom native grid (Swift/Kotlin) bridged to RN for 5k+ assets; ~75% fewer cold-start API calls.",
      "CI/CD with Expo EAS & GitHub Actions; release checklist to reduce deployment risks.",
      "Instrumented Sentry crash/perf monitoring; improved MTTR across client/network/backend.",
    ],
  },
  {
    id: "policy-shopper",
    title: "Policy Shopper — Broker Workflow Automation",
    company: "Policy Shopper",
    location: "East Brunswick, NJ",
    dates: "Dec 2021 – Dec 2022",
    description:
      "Automated an insurance broker workflow and shipped a responsive WordPress site; integrated Zoho CRM and Jenesis Client Portal for lead capture and self-service.",
    tags: ["WordPress", "Zoho CRM", "Jenesis", "Automation"],
    image: "/projects/policy-shopper/poster.webp",
    gif: "/projects/policy-shopper/preview.gif",
    hrefDemo: "https://policy-shopper.com",
    highlights: [
      "Integrated Zoho CRM (lead capture, contact mgmt, comms workflows).",
      "Integrated Jenesis Client Portal for claims, signatures, and policy mgmt.",
      "Reduced manual workload (~10 hrs/week per employee).",
    ],
  },
  {
    id: "micjo",
    title: "MicJo B2B — Wholesale E-commerce",
    company: "MicJo Inc.",
    location: "Oldsmar, FL",
    dates: "Mar 2019 – Jun 2021",
    description:
      "Launched a Magento B2B storefront with real-time inventory/pricing and bulk catalog tooling.",
    tags: ["Magento", "PHP", "MySQL", "Redis", "ERP Integration"],
    image: "/projects/micjo/poster.webp",
    gif: "/projects/micjo/preview.gif",
    hrefDemo: "https://micjoinc.com/",
    highlights: [
      "1k+ SKUs with attribute mgmt + bulk import pipeline (days → hours).",
      "Real-time pricing & inventory via ERP integration/APIs.",
      "Reworked admin UX to streamline catalog ops.",
    ],
  },
];
