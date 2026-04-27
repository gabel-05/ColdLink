"use client";

import Sidebar from "@/components/sidebar";
import SystemStatusBar from "@/components/system-status-bar";

export default function ControlTowerShell({ children }) {
  return (
    <div className="flex min-h-screen bg-[#F7F5EF]">
      <Sidebar />
      {/* Spacer so main content clears fixed sidebar on large screens */}
      <div className="hidden shrink-0 lg:block lg:w-64" aria-hidden />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <SystemStatusBar />
        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
