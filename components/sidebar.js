"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Command Center", badge: "LGU" },
  { href: "/network-map", label: "Network Map", badge: null },
  { href: "/simulation-lab", label: "Simulation Lab", badge: null },
  { href: "/farmer-view", label: "Farmer View", badge: "Preview" },
  { href: "/trader-view", label: "Trader View", badge: "Preview" }
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-[#2E5E3E]/12 bg-[#2E5E3E] text-white lg:fixed lg:inset-y-0 lg:z-40 lg:w-64 lg:border-b-0 lg:border-r">
      <div className="border-b border-white/10 px-5 py-5 lg:py-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#F2C14E]">
          ColdLink PH
        </p>
        <p className="mt-2 text-lg font-semibold leading-tight">Control Tower</p>
        <p className="mt-1 hidden text-xs text-white/70 sm:block">
          Regional cold chain coordination
        </p>
      </div>
      <nav className="flex gap-1 overflow-x-auto p-3 lg:flex-col lg:overflow-visible">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-w-[9.5rem] shrink-0 items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition lg:min-w-0 ${
                active ? "bg-white/15 text-white shadow-inner" : "text-white/85 hover:bg-white/10"
              }`}
            >
              <span>{item.label}</span>
              {item.badge ? (
                <span className="rounded-md bg-[#F2C14E]/25 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#F2C14E]">
                  {item.badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>
      <div className="hidden border-t border-white/10 p-4 lg:block">
        <p className="text-[10px] uppercase tracking-wider text-white/50">Simulation mode</p>
        <p className="mt-1 text-xs text-white/75">Dummy data • No live tracking</p>
      </div>
    </aside>
  );
}
