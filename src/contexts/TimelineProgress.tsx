// src/context/TimelineProgress.tsx
"use client";

import React, { createContext, useContext, useState, useMemo } from "react";

type Ctx = {
  progress: number; // 0..1
  setProgress: (p: number) => void; // write from Experience
};

const TimelineProgressCtx = createContext<Ctx | null>(null);

export function TimelineProgressProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [progress, setProgress] = useState(0);
  const value = useMemo(() => ({ progress, setProgress }), [progress]);
  return (
    <TimelineProgressCtx.Provider value={value}>
      {children}
    </TimelineProgressCtx.Provider>
  );
}

export function useTimelineProgress() {
  const ctx = useContext(TimelineProgressCtx);
  if (!ctx)
    throw new Error(
      "useTimelineProgress must be used within TimelineProgressProvider"
    );
  return ctx;
}
