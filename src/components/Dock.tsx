// src/components/Dock.tsx
"use client";
import { scrollToId } from "@/utils/scrollToId";
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { FiHome, FiFolder, FiCpu, FiBriefcase, FiMail } from "react-icons/fi";

const links = [
  { id: "hero", icon: FiHome, label: "Home" },
  { id: "projects", icon: FiFolder, label: "Projects" },
  { id: "skills", icon: FiCpu, label: "Skills" },
  { id: "experience", icon: FiBriefcase, label: "Experience" },
  { id: "contact", icon: FiMail, label: "Contact" },
];

export default function Dock() {
  return (
    <TooltipProvider delayDuration={200}>
      <nav className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {links.map(({ id, icon: Icon, label }) => (
          <Tooltip key={id}>
            <TooltipTrigger
              className="p-3 bg-gray-200 dark:bg-gray-800 rounded-full shadow-md
                         hover:scale-110 transition-transform"
              onClick={() => scrollToId(id)}
            >
              <Icon size={22} />
            </TooltipTrigger>
            <TooltipContent side="left">{label}</TooltipContent>
          </Tooltip>
        ))}
      </nav>
    </TooltipProvider>
  );
}
