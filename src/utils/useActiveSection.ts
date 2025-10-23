/* --------------------------------------------------------------
   Hook: useActiveSection
   ----------------------
   • Observes every section element on the page (ids in `targets`).
   • When 50 % or more of a section is visible, it becomes "active".
   • Returns the current `activeId`.
   • Designed once; you can reuse it for other navs or progress bars.
----------------------------------------------------------------- */
import { useEffect, useState } from "react";

type Options = {
  rootMargin?: string;
  threshold?: number | number[];
};

export default function useActiveSection(
  targetIds: string[],
  {
    // defaults tuned for sticky/overlay UIs
    rootMargin = "-12% 0px -12% 0px",
    threshold = [0, 0.25, 0.5, 0.75, 1],
  }: Options = {}
) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const sections = targetIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // pick the *most visible* intersecting section
        const visible = entries.filter((e) => e.isIntersecting);
        if (!visible.length) {
          setActiveId(null); // ← clear when it leaves view
          return;
        }

        visible.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const top = visible[0];
        setActiveId((prev) => (prev === top.target.id ? prev : top.target.id));
      },
      { root: null, rootMargin, threshold }
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [targetIds]);

  return activeId;
}
