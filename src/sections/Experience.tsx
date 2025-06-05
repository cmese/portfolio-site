/*  Experience section
    ────────────────────────────────────────────────────────────
    • The section is pulled upward (-mt-[33vh]) so that the
      timeline grid “peeks” beneath the Hero fade on first load.
    • The header is invisible until the user begins to scroll;
      once 30 % of the header enters the viewport it animates in
      and then behaves as a sticky top-0 element.
*/

"use client";

import { motion, useIsomorphicLayoutEffect } from "framer-motion";
import { useRef, useState } from "react";
import Timeline from "@/components/Timeline";
import { timelineRows } from "@/data/timeline";

/* replicate Section.tsx’s padding / centring without importing it */
const baseClass = "min-h-screen flex flex-col justify-center px-6 md:px-12";

export default function Experience() {
  const headerRef = useRef<HTMLElement>(null);

  const [stickyOffset, setStickyOffset] = useState<number | null>(null);
  useIsomorphicLayoutEffect(() => {
    setStickyOffset(window.innerHeight * 0.25);
  }, []);

  return (
    <motion.section
      id="experience"
      className={`${baseClass} -mt-[60vh] py-20 relative z-10`}
      /* visible from the start: no initial fade on the section itself */
      initial={false}
    >
      {/* ───── sticky header (animates on first scroll) ───── */}
      <motion.header
        ref={headerRef}
        //className="sticky top-0 z-20 pointer-events-none"
        className="sticky top-0 h-0 pointer-events-none"
        initial={{ opacity: 0, y: 24 }}
        //whileInView={{ opacity: 1, y: 0 }}
        //transition={{ duration: 0.6, ease: "easeOut" }}
        //viewport={{ once: true, amount: 0.3 }}
      />

      {/* Timeline grid with glow-tracker */}
      {/*<Timeline rows={timelineRows} headerRef={headerRef} />*/}
      <Timeline rows={timelineRows} stickyOffset={stickyOffset} />
    </motion.section>
  );
}
