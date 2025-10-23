// src/hooks/useNextSectionFade.ts
"use client";

import { useEffect, useMemo, useState } from "react";

/**
 * Returns a fade multiplier (1 → 0) as `nextId` becomes visible.
 * - `start` = intersectionRatio at which fading starts (e.g. 0.5 = 50% in view)
 * - `end`   = ratio at which it’s fully faded (usually 1.0)
 */
export function useNextSectionFade(
  nextId: string,
  start: number = 0.3,
  end: number = 0.5
) {
  const [ratio, setRatio] = useState(0);

  const thresholds = useMemo(() => {
    // dense thresholds for smooth updates
    const t: number[] = [];
    for (let i = 0; i <= 100; i++) t.push(i / 100);
    return t;
  }, []);

  useEffect(() => {
    const el = document.getElementById(nextId);
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        // intersectionRatio is 0..1 (portion of target visible in viewport)
        setRatio(entry?.intersectionRatio ?? 0);
      },
      { root: null, threshold: thresholds }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [nextId, thresholds]);

  // map ratio → fade [1..0] between start..end
  const t = Math.min(
    1,
    Math.max(0, (ratio - start) / Math.max(0.0001, end - start))
  );
  const fade = 1 - t; // 1 (no fade) → 0 (fully faded)
  return fade;
}
