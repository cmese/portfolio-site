// src/hooks/useMedia.ts
import { useEffect, useState } from "react";

export function useMedia(query: string) {
  const [matches, set] = useState(false);
  useEffect(() => {
    const m = window.matchMedia(query);
    const on = () => set(m.matches);
    on();
    m.addEventListener?.("change", on);
    return () => m.removeEventListener?.("change", on);
  }, [query]);
  return matches;
}
