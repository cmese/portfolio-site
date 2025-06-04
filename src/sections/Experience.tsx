/*  Experience section
    ────────────────────────────────────────────────────────────
    • The section is pulled upward (-mt-[33vh]) so that the
      timeline grid “peeks” beneath the Hero fade on first load.
    • The header is invisible until the user begins to scroll;
      once 30 % of the header enters the viewport it animates in
      and then behaves as a sticky top-0 element.
*/

"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import Timeline from "@/components/Timeline";
import { timelineRows } from "@/data/timeline";

/* replicate Section.tsx’s padding / centring without importing it */
const baseClass = "min-h-screen flex flex-col justify-center px-6 md:px-12";

export default function Experience() {
  const headerRef = useRef<HTMLElement>(null);

  return (
    <motion.section
      id="experience"
      className={`${baseClass} -mt-[33vh] py-20 relative z-10`}
      /* visible from the start: no initial fade on the section itself */
      initial={false}
    >
      {/* ───── sticky header (animates on first scroll) ───── */}
      <motion.header
        ref={headerRef}
        className="sticky top-0 z-20 pointer-events-none"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <h2 className="mb-10 text-center text-3xl font-bold pointer-events-auto">
          Experience
        </h2>
      </motion.header>

      {/* Timeline grid with glow-tracker */}
      <Timeline rows={timelineRows} headerRef={headerRef} />
    </motion.section>
  );
}
