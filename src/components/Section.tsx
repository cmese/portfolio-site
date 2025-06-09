/* src/components/Section.tsx */
"use client";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface Props {
  id: string;
  className?: string;
  children: ReactNode;
  /** If false, skip min-h-screen + justify-center */
  full?: boolean;
}

export default function Section({
  id,
  className = "",
  children,
  full = true,
}: Props) {
  return (
    <motion.section
      id={id}
      className={`
        ${full ? "min-h-screen flex flex-col justify-center" : ""}
        px-6 md:px-12
        ${className}
      `}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.3 }}
    >
      {children}
    </motion.section>
  );
}
