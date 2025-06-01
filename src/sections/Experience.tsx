"use client";

import Section from "@/components/Section";
import Timeline from "@/components/Timeline";
import { timelineRows } from "@/data/timeline";

export default function Experience() {
  return (
    <Section id="experience" className="py-20">
      <h2 className="mb-10 text-center text-3xl font-bold">Experience</h2>
      <Timeline rows={timelineRows} />
    </Section>
  );
}
