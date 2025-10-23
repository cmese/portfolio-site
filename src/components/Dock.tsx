"use client";

import { useState, useRef, useEffect } from "react";
import { scrollToId } from "@/utils/scrollToId";
import useActiveSection from "@/hooks/useActiveSection";
import * as Tooltip from "@radix-ui/react-tooltip";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiHome,
  FiFolder,
  FiCpu,
  FiBriefcase,
  FiMail,
  FiMenu,
  FiX,
} from "react-icons/fi";

type Link = { id: string; icon: React.ElementType; label: string };

const links: Link[] = [
  { id: "hero", icon: FiHome, label: "Home" },
  { id: "experience", icon: FiBriefcase, label: "Experience" },
  { id: "projects", icon: FiFolder, label: "Projects" },
  { id: "skills", icon: FiCpu, label: "Skills" },
  { id: "contact", icon: FiMail, label: "Contact" },
];

export default function Dock() {
  /* which section is on screen? */
  const activeId = useActiveSection(links.map((l) => l.id));

  /* mobile toggle */
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  /* close panel if user taps outside */
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) =>
      !panelRef.current?.contains(e.target as Node) && setOpen(false);
    window.addEventListener("mousedown", close);
    return () => window.removeEventListener("mousedown", close);
  }, [open]);

  const handleNav = (id: string) => {
    scrollToId(id);
    setOpen(false);
  };

  /* base button style */
  const baseBtn =
    "flex items-center justify-center rounded-full transition hover:scale-110";

  return (
    <Tooltip.Provider delayDuration={200}>
      {/* ---------- DESKTOP / TABLET (md+) ---------- */}
      <nav className="fixed top-6 right-6 z-50 hidden flex-col gap-3 md:flex">
        {links.map(({ id, icon: Icon, label }) => {
          const active = id === activeId;
          return (
            <Tooltip.Root key={id}>
              <Tooltip.Trigger asChild>
                <button
                  onClick={() => handleNav(id)}
                  aria-label={label}
                  /* glassmorphic style + active tint */
                  className={`${baseBtn} p-3 shadow-md backdrop-blur-sm
                    ${
                      active
                        ? "bg-blue-600 text-white"
                        : "bg-white/30 dark:bg-gray-700/30 text-gray-800 dark:text-gray-200"
                    }`}
                >
                  <Icon size={22} />
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  side="left"
                  className="select-none rounded-md bg-gray-900 px-2 py-1 text-sm text-white shadow-lg"
                >
                  {label}
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          );
        })}
      </nav>

      {/* ---------- MOBILE (< md) ---------- */}
      <div className="fixed top-6 right-6 z-50 flex flex-col md:hidden">
        {/* FAB */}
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu"
          className="self-end rounded-full bg-blue-600 p-4 text-white shadow-lg"
        >
          {open ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        {/* animated panel */}
        <AnimatePresence>
          {open && (
            <motion.div
              ref={panelRef}
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="mt-3 flex flex-col gap-2 self-end rounded-xl bg-white/70
                         p-3 shadow-xl backdrop-blur-md dark:bg-gray-800/70"
            >
              {links.map(({ id, icon: Icon, label }) => {
                const active = id === activeId;
                return (
                  <button
                    key={id}
                    onClick={() => handleNav(id)}
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm
                      ${
                        active
                          ? "bg-blue-600 text-white"
                          : "text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                      }`}
                  >
                    <Icon size={18} />
                    {label}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Tooltip.Provider>
  );
}
