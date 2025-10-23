"use client";
import { useMemo } from "react";

export type TagFilterProps = {
  allTags: string[];
  selected: Set<string>;
  onToggle: (tag: string) => void;
  onClear: () => void;
};

export default function TagFilter({
  allTags,
  selected,
  onToggle,
  ontemphasis,
  onClear,
}: any) {
  // small helper to show “All” active if none selected
  const noneSelected = selected.size === 0;

  return (
    <div
      className="sticky top-0 z-[70] -mx-6 md:-mx-12
             /* make the backdrop mostly opaque to block the global gradient */
             bg-neutral-900/95 dark:bg-neutral-900/95
             backdrop-blur-md
             px-6 md:px-12 py-3
             border-b border-black/5 dark:border-white/10"
    >
      <div className="flex items-center justify-between gap-3 mb-2">
        <h2 className="text-2xl font-semibold">Projects</h2>
        <button
          onClick={onClear}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-40"
          disabled={noneSelected}
        >
          Clear filters
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
        <button
          onClick={() => onClear()}
          className={`px-3 py-1 rounded-full border text-sm whitespace-nowrap ${
            noneSelected
              ? "bg-blue-600 text-white border-transparent"
              : "bg-transparent border-gray-400/40 dark:border-gray-600 hover:bg-gray-100/40 dark:hover:bg-white/5"
          }`}
        >
          All
        </button>

        {allTags.map((tag) => {
          const active = selected.has(tag);
          return (
            <button
              key={tag}
              onClick={() => onToggle(tag)}
              className={`px-3 py-1 rounded-full text-sm whitespace-nowrap border transition
                ${
                  active
                    ? "bg-emerald-600 text-white border-transparent"
                    : "bg-transparent border-gray-400/40 dark:border-gray-600 hover:bg-gray-100/40 dark:hover:bg-white/5"
                }`}
            >
              {tag}
            </button>
          );
        })}
      </div>
    </div>
  );
}
