"use client";

import { useMemo, useState } from "react";
import { projects as ALL } from "@/data/projects";
import TagFilter from "@/components/projects/TagFilter";
import ProjectCard from "@/components/projects/ProjectCard";
import ProjectSheet from "@/components/projects/ProjectSheet";

export default function Projects() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new HashSet());

  const allTags = useMemo(() => {
    const s = new Set<string>();
    ALL.forEach((p) => p.tags.forEach((t) => s.add(t)));
    return Array.from(s).sort();
  }, []);

  const toggleTag = (t: string) => {
    const copy = new Set(selected);
    if (copy.has(t)) copy.delete(t);
    else copy.add(t);
    setSelected(copy);
  };
  const clearTags = () => setSelected(new Set());

  const filtered = useMemo(() => {
    if (selected.size === 0) return ALL;
    return ALL.filter((p) =>
      Array.from(selected).some((tag) => p.tags.includes(tag))
    );
  }, [selected]);

  const active = useMemo(
    () => ALL.find((p) => p.id === openId) || null,
    [openId]
  );

  return (
    <section
      id="projects"
      className="
     relative isolate
     min-h-screen
     px-6 md:px-12
     pt-2
     pb-24
     z-[40]
   "
    >
      <TagFilter
        allTags={allTags}
        selected={selected}
        onToggle={toggleTag}
        onClear={clearTags}
      />
      <div className="mt-6 grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((p) => (
          <ProjectCard key={p.id} project={p} onOpen={setOpenId} />
        ))}
      </div>
      {active && (
        <ProjectSheet
          open={!!active}
          onOpenChange={(o) => !o && setOpenId(null)}
          project={active}
        />
      )}
    </section>
  );
}

// tiny helper
function HashSet<T>(arr: T[] = []) {
  const s = new Set<T>();
  arr.forEach((v) => s.add(v));
  return s;
}
