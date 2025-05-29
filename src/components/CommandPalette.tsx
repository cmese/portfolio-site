/* ----------------------------------------------------------------
   Global command palette (cmdk + Radix).
   - Opens with ⌘K (Mac) or Ctrl+K (Windows/Linux)
   - Contains actions for scrolling, theme toggle, résumé download.
----------------------------------------------------------------- */
"use client";

import * as React from "react";
import { Command } from "cmdk";
import * as Dialog from "@radix-ui/react-dialog"; // <— NEW
import { scrollToId } from "@/utils/scrollToId";
import { FiArrowUpRight, FiFileText, FiMoon, FiX } from "react-icons/fi";

type Action = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  handler: () => void;
};

export default function CommandPalette() {
  /* -------- state -------- */
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  /* -------- ⌘K / Ctrl-K shortcut -------- */
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const platform =
        (navigator as any).userAgentData?.platform ?? navigator.platform ?? "";
      const macLike = /Mac|iPhone|iPad|iPod/i.test(platform);

      if ((macLike ? e.metaKey : e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* -------- actions -------- */
  const actions: Action[] = [
    { id: "hero", label: "Go to Home", handler: () => scrollToId("hero") },
    {
      id: "projects",
      label: "Go to Projects",
      handler: () => scrollToId("projects"),
    },
    {
      id: "skills",
      label: "Go to Skills",
      handler: () => scrollToId("skills"),
    },
    {
      id: "experience",
      label: "Go to Experience",
      handler: () => scrollToId("experience"),
    },
    {
      id: "contact",
      label: "Go to Contact",
      handler: () => scrollToId("contact"),
    },
    {
      id: "resume",
      label: "Download Résumé",
      icon: <FiFileText />,
      handler: () => window.open("/resume.pdf", "_blank"),
    },
    {
      id: "theme",
      label: "Toggle Dark / Light",
      icon: <FiMoon />,
      handler: () => document.documentElement.classList.toggle("dark"),
    },
  ];

  const filtered = actions.filter((a) =>
    a.label.toLowerCase().includes(query.toLowerCase())
  );

  /* -------- render -------- */
  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Global command palette"
      className="fixed left-1/2 top-1/4 z-[100] w-[90vw] max-w-lg -translate-x-1/2
                 rounded-xl border bg-white shadow-xl
                 dark:border-gray-800 dark:bg-gray-900"
    >
      {/* >>> The required (but visually hidden) dialog title <<< */}
      <Dialog.Title className="sr-only">Command Palette</Dialog.Title>

      {/* input row */}
      <div className="flex items-center border-b border-gray-200 dark:border-gray-800">
        <Command.Input
          autoFocus
          value={query}
          onValueChange={setQuery}
          placeholder="Type a command…"
          className="w-full bg-transparent px-4 py-3 outline-none
                     placeholder-gray-400 dark:text-white"
        />
        <button
          aria-label="Close command palette"
          className="px-4 text-gray-500 transition hover:text-red-500"
          onClick={() => setOpen(false)}
        >
          <FiX />
        </button>
      </div>

      {/* results */}
      <Command.List className="max-h-[50vh] overflow-y-auto py-2">
        {filtered.length ? (
          filtered.map(({ id, label, handler, icon }) => (
            <Command.Item
              key={id}
              onSelect={() => {
                handler();
                setOpen(false);
                setQuery("");
              }}
              className={`flex cursor-pointer items-center gap-3 px-4 py-2
                          aria-selected:bg-gray-100 dark:aria-selected:bg-gray-800`}
            >
              {icon ?? <FiArrowUpRight />}
              <span>{label}</span>
            </Command.Item>
          ))
        ) : (
          <div className="px-4 py-3 text-sm text-gray-500">No results.</div>
        )}
      </Command.List>
    </Command.Dialog>
  );
}
