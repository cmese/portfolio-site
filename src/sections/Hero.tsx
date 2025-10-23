// src/app/[...]/Hero.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { FiGithub, FiLinkedin, FiFileText, FiFolder } from "react-icons/fi";
import Section from "@/components/Section";
import ScrollCue from "@/components/ScrollCue";

const IMAGES = ["/hero/one.jpg", "/hero/two.jpg", "/hero/three.jpg"]; // in /public

export default function Hero() {
  const [idx, setIdx] = useState(0);
  const hoverRef = useRef(false);

  // 4s per slide, pauses on hover, respects reduced motion
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  useEffect(() => {
    if (prefersReducedMotion) return;
    const id = setInterval(() => {
      if (!hoverRef.current) {
        setIdx((i) => (i + 1) % IMAGES.length);
      }
    }, 4000);
    return () => clearInterval(id);
  }, [prefersReducedMotion]);

  // cross-fade stack so switching is smooth
  const stack = useMemo(
    () =>
      IMAGES.map((src, i) => ({
        src,
        z: i === idx ? 30 : 20 - ((idx - i + IMAGES.length) % IMAGES.length),
        visible: i === idx,
      })),
    [idx]
  );

  return (
    <Section
      id="hero"
      full={false}
      className="relative bg-transparent text-center gap-6 justify-start pt-[12vh]"
    >
      <h1 className="text-5xl md:text-7xl font-bold leading-tight">
        Hi, I&apos;m Chris
      </h1>

      <p className="text-xl md:text-2xl max-w-prose mx-auto opacity-90">
        <span className="font-semibold">Software Engineer</span>{" "}
        <span className="opacity-80">• full-stack (React / Node / Python)</span>
      </p>

      {/* Circular carousel */}
      <div
        className="mx-auto mt-4 h-[160px] w-[160px] md:h-[220px] md:w-[220px]
                   relative rounded-full ring-4 ring-white/70 dark:ring-white/10
                   shadow-lg overflow-hidden select-none"
        onMouseEnter={() => (hoverRef.current = true)}
        onMouseLeave={() => (hoverRef.current = false)}
        aria-label="Photo carousel"
        role="img"
      >
        {stack.map(({ src, z, visible }, i) => (
          <Image
            key={src + i}
            src={src}
            alt=""
            fill
            sizes="220px"
            priority={i === 0}
            className={`object-cover transition-opacity duration-500 ease-out ${
              visible ? "opacity-100" : "opacity-0"
            }`}
            style={{ zIndex: z }}
          />
        ))}

        {/* tiny dot indicators */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
          {IMAGES.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-1.5 rounded-full transition ${
                i === idx
                  ? "bg-white/90 dark:bg-white"
                  : "bg-white/40 dark:bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Socials / actions */}
      <div className="mt-4 flex items-center justify-center gap-3 md:gap-4">
        <IconButton
          href="https://www.linkedin.com/in/your-handle"
          label="LinkedIn"
        >
          <FiLinkedin size={18} />
        </IconButton>

        <IconButton href="https://github.com/your-handle" label="GitHub">
          <FiGithub size={18} />
        </IconButton>

        <IconButton href="/resume.pdf" label="Resume" download>
          <FiFileText size={18} />
        </IconButton>

        <IconButton id="projects-btn" href="#projects" label="Projects">
          <FiFolder size={18} />
        </IconButton>
      </div>

      <ScrollCue targetId="experience" startFadeAt={0.55} endFadeAt={0.35} />
    </Section>
  );
}

function IconButton({
  id,
  href,
  label,
  children,
  download,
}: {
  id?: string;
  href: string;
  label: string;
  children: React.ReactNode;
  download?: boolean;
}) {
  return (
    <a
      id={id}
      href={href}
      {...(download ? { download: "" } : {})}
      className="inline-flex items-center justify-center gap-2
                 rounded-full px-4 py-2 text-sm font-medium
                 bg-white/70 dark:bg-white/10 border border-black/10 dark:border-white/10
                 hover:bg-white/90 dark:hover:bg-white/20 active:scale-[0.98]
                 transition"
      aria-label={label}
      title={label}
    >
      {children}
      <span className="hidden sm:inline">{label}</span>
    </a>
  );
}
