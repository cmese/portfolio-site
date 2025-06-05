"use client";

import { useState } from "react";
import { motion, useIsomorphicLayoutEffect } from "framer-motion";
import Timeline from "@/components/Timeline";
import { timelineRows } from "@/data/timeline";
import { COL_W } from "@/components/Timeline"; // export COL_W there
// (or hard-code 120 again)

// ── numeric offset from grid origin (0) to centre of first column
const centerOffsetNum = COL_W / 2; // 60 px
// ── CSS string used to push grid visually to the middle
const centerOffsetCss = `calc(50vw - ${centerOffsetNum}px)`;

export default function Experience() {
  /* Y-anchor for the spotlight (¼ viewport) */
  const [stickyOffset, setStickyOffset] = useState<number | null>(null);
  useIsomorphicLayoutEffect(() => {
    setStickyOffset(window.innerHeight * 0.25);
  }, []);

  if (stickyOffset === null) return null; // avoid SSR flash

  return (
    <motion.section
      id="experience"
      className="min-h-screen flex flex-col justify-center -mt-[60vh] py-20 relative z-10"
      initial={false}
    >
      {/* wrapper centres the grid; no transforms (so BCRs stay right) */}
      <div className="overflow-x-auto" style={{ paddingLeft: centerOffsetCss }}>
        <Timeline rows={timelineRows} stickyOffset={stickyOffset} />
      </div>
    </motion.section>
  );
}
