// src/sections/Hero.tsx
import Section from "@/components/Section";
export default function Hero() {
  return (
    <Section id="hero" className="text-center gap-6">
      <h1 className="text-5xl md:text-7xl font-bold leading-tight">
        Hi, I’m Chris
      </h1>
      <p className="text-xl md:text-2xl max-w-prose mx-auto">
        Front-End Developer | React & Expo
      </p>
    </Section>
  );
}
