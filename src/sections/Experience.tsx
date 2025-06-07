// src/sections/Experience.tsx
"use client";

import Timeline from "@/components/Timeline";
import { timelineRows } from "@/data/timeline";

export default function Experience() {
  return (
    <section id="experience" className="relative z-10">
      <div className="px-[calc(50vw - 60px)]">
        <Timeline rows={timelineRows} />
      </div>
    </section>
  );
}
