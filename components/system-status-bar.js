"use client";

import { useEffect, useState } from "react";

export default function SystemStatusBar({ activeAllocations = 12, queueDepth = 8 }) {
  const [now, setNow] = useState(null);

  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const timeStr =
    now?.toLocaleString("en-PH", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Manila"
    }) ?? "—";

  return (
    <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4 border-b border-[#2E5E3E]/10 bg-[#F7F5EF]/95 px-4 py-3 shadow-sm backdrop-blur lg:px-8">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 rounded-full border border-[#2E5E3E]/20 bg-white px-3 py-1.5 text-xs shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2E5E3E] opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#2E5E3E]" />
          </span>
          <span className="font-semibold text-[#2E5E3E]">Operations live</span>
        </div>
        <span className="hidden text-xs text-[#5E6B60] sm:inline">{timeStr} · PH Standard Time</span>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-xs">
        <span className="rounded-lg border border-[#2E5E3E]/15 bg-white px-3 py-1.5 text-[#2E5E3E] shadow-sm">
          Active allocations: <strong>{activeAllocations}</strong>
        </span>
        <span className="rounded-lg border border-[#8B5E3C]/20 bg-white px-3 py-1.5 text-[#8B5E3C] shadow-sm">
          Intake queue: <strong>{queueDepth}</strong>
        </span>
      </div>
    </header>
  );
}
