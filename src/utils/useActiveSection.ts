/* --------------------------------------------------------------
   Hook: useActiveSection
   ----------------------
   • Observes every section element on the page (ids in `targets`).
   • When 50 % or more of a section is visible, it becomes "active".
   • Returns the current `activeId`.
   • Designed once; you can reuse it for other navs or progress bars.
----------------------------------------------------------------- */
import { useEffect, useState } from "react";

export default function useActiveSection(targetIds: string[]) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const sections = targetIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0px 0px -50% 0px", threshold: 0.5 } // 50 % visible
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [targetIds]);

  return activeId;
}
