"use client";

import { useRef } from "react";
import Section from "@/components/Section";
import Timeline from "@/components/Timeline";
import { timelineRows } from "@/data/timeline";

export default function Experience() {
  const headerRef = useRef<HTMLElement>(null);

  return (
    <Section id="experience" className="py-20 relative">
      {/* ───── sticky header ───── */}
      <header ref={headerRef} className="sticky top-0 z-20 pointer-events-none">
        <h2 className="mb-10 text-center text-3xl font-bold pointer-events-auto">
          Experience
        </h2>
      </header>

      {/* timeline continues to scroll behind the fixed header */}
      <Timeline rows={timelineRows} headerRef={headerRef} />
    </Section>
  );
}
