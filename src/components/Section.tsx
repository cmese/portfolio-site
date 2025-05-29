/* src/components/Section.tsx
   Motion wrapper with viewport fade/slide.
*/
"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface Props {
  id: string;
  className?: string;
  children: ReactNode;
}

export default function Section({ id, className = "", children }: Props) {
  return (
    <motion.section
      id={id}
      className={`min-h-screen flex flex-col justify-center px-6 md:px-12 ${className}`}
      /* Animation */
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.3 }}
    >
      {children}
    </motion.section>
  );
}
