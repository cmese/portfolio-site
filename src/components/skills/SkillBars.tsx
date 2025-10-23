"use client";

import { motion } from "framer-motion";
import type { Skill } from "./SkillConstellation";

export default function SkillBars({ skills }: { skills: Skill[] }) {
  return (
    <div className="mx-auto w-full max-w-2xl space-y-3">
      {skills.map((s, i) => (
        <motion.div
          key={s.name}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: i * 0.03, ease: "easeOut" }}
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-3"
        >
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="font-medium">{s.name}</span>
            <span className="opacity-70">{s.level}%</span>
          </div>
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, rgba(59,130,246,0.6), rgba(59,130,246,0.9))",
                boxShadow:
                  "0 0 12px rgba(59,130,246,0.55), 0 0 32px rgba(59,130,246,0.35)",
              }}
              initial={{ width: 0 }}
              whileInView={{ width: `${s.level}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          <div className="mt-1 text-xs opacity-60">{s.category}</div>
        </motion.div>
      ))}
    </div>
  );
}
