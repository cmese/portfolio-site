"use client";

import {
  SiNextdotjs,
  SiReact,
  SiTypescript,
  SiTailwindcss,
  SiRadixui,
  SiFramer,
  SiVercel,
  SiResend,
} from "react-icons/si";

const stack = [
  { icon: SiNextdotjs, label: "Next.js" },
  { icon: SiReact, label: "React" },
  { icon: SiTypescript, label: "TypeScript" },
  { icon: SiTailwindcss, label: "Tailwind CSS" },
  { icon: SiRadixui, label: "Radix UI" },
  { icon: SiFramer, label: "Framer Motion" },
  { icon: SiVercel, label: "Vercel" },
  { icon: SiResend, label: "Resend" },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      className="
        relative z-30
        border-t border-black/10 dark:border-white/10
        bg-transparent
        px-6 md:px-12
        pt-8 pb-[max(env(safe-area-inset-bottom),24px)]
      "
    >
      <div className="mx-auto max-w-5xl">
        {/* cheeky line */}
        <p className="text-center text-sm md:text-base opacity-80">
          Built with love, caffeine, and way too many console.logs.
        </p>

        {/* label */}
        <div className="mt-4 text-center">
          <span className="text-xs tracking-wide uppercase opacity-70">
            This site’s tech stack
          </span>
        </div>

        {/* built-with chips + soft blue glow */}
        <div className="relative mt-3 flex flex-wrap items-center justify-center gap-2.5">
          {/* ambient radial glow behind chips */}
          <span
            aria-hidden
            className="
              pointer-events-none absolute inset-0 -z-10 mx-auto
              h-28 w-[min(720px,90%)]
              rounded-full blur-2xl
              opacity-50
              bg-[radial-gradient(closest-side,rgba(59,130,246,0.22),rgba(59,130,246,0.06)_60%,transparent)]
            "
          />
          {stack.map(({ icon: Icon, label }) => (
            <span
              key={label}
              title={label}
              className="
                inline-flex items-center gap-2
                rounded-full border border-white/10
                bg-white/[0.06] dark:bg-white/[0.06]
                px-3 py-1.5 text-xs md:text-sm
                backdrop-blur
                shadow-[0_0_12px_rgba(59,130,246,0.25)]
                hover:shadow-[0_0_16px_rgba(59,130,246,0.35)]
                transition
              "
            >
              <Icon className="opacity-90" size={14} />
              <span className="opacity-90">{label}</span>
            </span>
          ))}
        </div>

        {/* bottom row */}
        <div className="mt-6 text-center text-xs opacity-60">
          © {year} Chris Meseha. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
