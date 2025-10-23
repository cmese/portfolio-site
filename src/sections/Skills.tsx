"use client";

import Section from "@/components/Section";
import SkillConstellation, {
  Skill,
} from "@/components/skills/SkillConstellation";
import SkillBars from "@/components/skills/SkillBars";

const SKILLS: Skill[] = [
  // --- FE ---
  { name: "React", category: "Frontend", level: 92 },
  { name: "Next.js", category: "Frontend", level: 90 },
  { name: "Tailwind", category: "Frontend", level: 88 },
  { name: "Framer Motion", category: "Frontend", level: 82 },
  // --- FS/BE ---
  { name: "Node.js", category: "Backend", level: 86 },
  { name: "Express", category: "Backend", level: 80 },
  { name: "PostgreSQL", category: "Backend", level: 78 },
  { name: "Prisma", category: "Backend", level: 75 },
  // --- Mobile/Native ---
  { name: "Expo", category: "Mobile", level: 84 },
  { name: "React Native", category: "Mobile", level: 83 },
  // --- Cloud/DevOps ---
  { name: "Docker", category: "Cloud", level: 70 },
  { name: "Vercel", category: "Cloud", level: 82 },
  { name: "AWS", category: "Cloud", level: 66 },
  // --- Other ---
  { name: "Python", category: "Other", level: 72 },
  { name: "tRPC", category: "Other", level: 28 },
];

export default function Skills() {
  return (
    <Section id="skills" className="text-center gap-6">
      <h1 className="text-5xl md:text-7xl font-bold">Skills</h1>

      {/* Mobile subtitle only */}
      <p className="text-base sm:text-lg opacity-80 md:hidden">
        Listed by proficiency
      </p>

      {/* Desktop legend pill under the title */}
      <div className="hidden md:block">
        <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs opacity-90">
          Closer to center = higher proficiency • dot size & glow also increase
          with level
        </span>
      </div>

      {/* Mobile: glow bars; Desktop: constellation */}
      <div className="mt-2 md:hidden">
        <SkillBars skills={SKILLS} />
      </div>
      <div className="hidden md:block">
        <SkillConstellation skills={SKILLS} />
      </div>
    </Section>
  );
}
