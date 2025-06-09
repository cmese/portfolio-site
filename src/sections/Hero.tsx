// src/app/[...]/Hero.tsx
"use client";

import Section from "@/components/Section";

export default function Hero() {
  return (
    <Section
      id="hero"
      full={false} // removes forced min-h-screen for hero only
      className="relative bg-transparent text-center gap-6 justify-start pt-[12vh]"
    >
      <h1 className="text-5xl md:text-7xl font-bold leading-tight">
        Hi, I'm Chris
      </h1>
      <p className="text-xl md:text-2xl max-w-prose mx-auto">
        Front-End Developer&nbsp;| React&nbsp;&amp;&nbsp;Expo
      </p>
    </Section>
  );
}
