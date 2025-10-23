"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

export type Skill = {
  name: string;
  category: string;
  level: number; // 0..100
};

type Props = { skills: Skill[] };

/**
 * Constellation with honest encoding:
 * - Level -> radial distance (higher = closer to center)
 * - Size + glow reinforce level
 * - Concentric rings (100/75/50/25) as guides
 * - Categories divided into wedges around the circle
 */
export default function SkillConstellation({ skills }: Props) {
  // layout constants
  const WIDTH = 960; //720;
  const HEIGHT = 620; // 460;
  const MARGIN = 36; // extra canvas around edges so labels don't clip
  const cx = WIDTH / 2;
  const cy = HEIGHT / 2;

  // inner/outer radii for 100%..0%
  const R_OUTER = 280; // 0%
  const R_INNER = 80; // 100%
  const R_FOR = (level: number) =>
    R_OUTER - ((R_OUTER - R_INNER) * Math.max(0, Math.min(level, 100))) / 100;

  const { categories, placed } = useMemo(() => {
    const cats = Array.from(new Set(skills.map((s) => s.category)));
    const byCat = Object.fromEntries(
      cats.map((c) => [c, skills.filter((s) => s.category === c)])
    );

    // each category gets a wedge (arc) around the center
    const wedgePadding = 0.14; // radians trimmed at wedge edges
    const placed = cats.flatMap((cat, catIdx) => {
      const start = (catIdx / cats.length) * Math.PI * 2 - Math.PI / 2;
      const end = ((catIdx + 1) / cats.length) * Math.PI * 2 - Math.PI / 2;
      const span = end - start;
      const usableStart = start + wedgePadding;
      const usableEnd = end - wedgePadding;

      const group = byCat[cat].slice().sort((a, b) => b.level - a.level); // strongest first
      // spread skills evenly across the wedge angles
      return group.map((s, i) => {
        const t = group.length === 1 ? 0.5 : i / (group.length - 1);
        const a = usableStart + (usableEnd - usableStart) * t;
        const r = R_FOR(s.level);

        // slight anti-collision: nudge neighbors with same radius
        const rNudge = i % 2 === 0 ? 0 : 6;
        const rr = r + rNudge;

        const x = cx + Math.cos(a) * rr;
        const y = cy + Math.sin(a) * rr;
        const dot = 5 + (s.level / 100) * 7; // size by level
        return { ...s, x, y, a, r: rr, dot, cat, catIdx };
      });
    });

    return { categories: cats, placed };
  }, [skills]);

  // helper for ring label positions
  const ringLabel = (pct: number) => {
    const r = R_FOR(pct);
    return { x: cx, y: cy - r };
  };

  return (
    <div className="relative mx-auto w-full max-w-6xl p-2 md:p-4 overflow-visibile">
      <svg
        //viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        viewBox={`-${MARGIN} -${MARGIN} ${WIDTH + MARGIN * 2} ${
          HEIGHT + MARGIN * 2
        }`}
        className="mx-auto block w-full overflow-visible"
        role="img"
        aria-label="Skills by proficiency: closer to center means higher proficiency."
      >
        {/* defs */}
        <defs>
          <filter id="nodeGlow">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="panelGlow" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="rgba(59,130,246,0.10)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        {/* soft panel glow */}
        <rect width={WIDTH} height={HEIGHT} fill="url(#panelGlow)" rx="14" />

        {/* guide rings for 100/75/50/25 */}
        {[100, 75, 50, 25].map((pct, i) => {
          const r = R_FOR(pct);
          return (
            <g key={pct} opacity={0.18}>
              <circle
                cx={cx}
                cy={cy}
                r={r}
                stroke="rgba(255,255,255,0.6)"
                strokeDasharray="4 6"
                strokeWidth="1"
                fill="none"
              />
              <text
                x={ringLabel(pct).x}
                y={ringLabel(pct).y - 6}
                textAnchor="middle"
                className="fill-white"
                style={{ fontSize: 11, opacity: 0.8 }}
              >
                {pct}%
              </text>
            </g>
          );
        })}

        {/* faint wedge dividers */}
        {categories.map((c, i) => {
          const a = (i / categories.length) * Math.PI * 2 - Math.PI / 2;
          const x2 = cx + Math.cos(a) * (R_OUTER + 10);
          const y2 = cy + Math.sin(a) * (R_OUTER + 10);
          return (
            <line
              key={`div-${c}`}
              x1={cx}
              y1={cy}
              x2={x2}
              y2={y2}
              stroke="rgba(148,163,184,0.18)"
              strokeWidth="1"
            />
          );
        })}

        {/* category labels at outer radius */}
        {categories.map((c, i) => {
          const a = ((i + 0.5) / categories.length) * Math.PI * 2 - Math.PI / 2;
          const x = cx + Math.cos(a) * (R_OUTER + 34);
          const y = cy + Math.sin(a) * (R_OUTER + 34);
          return (
            <text
              key={`cat-${c}`}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-white"
              style={{
                fontSize: 14,
                opacity: 0.9,
                filter: "drop-shadow(0 0 6px rgba(59,130,246,0.35))",
              }}
            >
              {c}
            </text>
          );
        })}

        {/* nodes */}
        {placed.map((n, i) => (
          <g key={`${n.name}-${i}`} filter="url(#nodeGlow)">
            {/* halo strength scales with level */}
            <motion.circle
              cx={n.x}
              cy={n.y}
              r={n.dot * 1.8}
              fill="rgba(59,130,246,0.22)"
              initial={{ opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: i * 0.015, ease: "easeOut" }}
            />
            {/* core */}
            <motion.circle
              cx={n.x}
              cy={n.y}
              r={n.dot}
              fill="rgba(255,255,255,0.95)"
              stroke="rgba(59,130,246,0.55)"
              strokeWidth="1"
              initial={{ opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.4,
                delay: 0.06 + i * 0.015,
                ease: "easeOut",
              }}
            >
              <title>{`${n.name} • ${n.level}% (${n.category})`}</title>
            </motion.circle>

            {/* label (subtle) */}
            <text
              x={n.x + 10}
              y={n.y - 8}
              className="fill-white"
              style={{ fontSize: 11, opacity: 0.85 }}
            >
              {n.name}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
