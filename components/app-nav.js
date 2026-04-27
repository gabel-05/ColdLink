"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Command Center" },
  { href: "/network-map", label: "Supply Network Map" },
  { href: "/simulation-lab", label: "Simulation Lab" }
];

export default function AppNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-2">
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
              active
                ? "border-[#2E5E3E] bg-[#2E5E3E] text-white"
                : "border-[#2E5E3E]/25 bg-white text-[#2E5E3E] hover:border-[#2E5E3E]"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
