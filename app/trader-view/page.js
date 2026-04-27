"use client";

import { useEffect, useState } from "react";
import { harvestIntakeFeed } from "@/data/operations";
import { riskBadge } from "@/lib/demo";

async function fetchMatch(row) {
  const res = await fetch("/api/match", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      crop_type: row.crop_type,
      volume_kg: row.volume_kg,
      location: row.location,
      hours_since_harvest: row.hours_since_harvest,
      lat: row.lat,
      lng: row.lng
    })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Match failed");
  return { harvestId: row.id, ...data };
}

export default function TraderViewPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const results = await Promise.all(harvestIntakeFeed.map((r) => fetchMatch(r)));
        if (!cancelled) setRows(results);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="rounded-2xl border border-[#2E5E3E]/12 bg-white p-6 shadow-[0_8px_28px_rgba(46,94,62,0.07)]">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8B5E3C]">
          Trader preview
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-[#2E5E3E]">Incoming supply board</h1>
        <p className="mt-2 max-w-3xl text-sm text-[#5E6B60]">
          Demand-side view of lots clearing through ColdLink — ETA to cold storage and quality risk
          indicator (simulated).
        </p>
      </section>

      <section className="overflow-hidden rounded-2xl border border-[#2E5E3E]/12 bg-white shadow-[0_8px_28px_rgba(46,94,62,0.07)]">
        {loading ? (
          <p className="p-8 text-sm text-[#5E6B60]">Loading supply pipeline…</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-[#2E5E3E]/10 bg-[#F7F5EF] text-[11px] uppercase tracking-wide text-[#8B5E3C]">
                <tr>
                  <th className="px-5 py-3 font-semibold">Lot</th>
                  <th className="px-5 py-3 font-semibold">Crop / kg</th>
                  <th className="px-5 py-3 font-semibold">Source</th>
                  <th className="px-5 py-3 font-semibold">ETA to storage</th>
                  <th className="px-5 py-3 font-semibold">Quality risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2E5E3E]/8">
                {rows.map((m) => (
                  <tr key={m.harvestId} className="hover:bg-[#F7F5EF]/80">
                    <td className="px-5 py-4 font-mono text-xs text-[#5E6B60]">{m.harvestId}</td>
                    <td className="px-5 py-4 capitalize text-[#2E5E3E]">
                      {m.supply.crop_type}
                      <span className="text-[#5E6B60]"> · {m.supply.volume_kg.toLocaleString()} kg</span>
                    </td>
                    <td className="px-5 py-4 text-[#5E6B60]">{m.supply.location}</td>
                    <td className="px-5 py-4 font-medium text-[#2E5E3E]">{m.etaHours} hrs</td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${riskBadge(m.spoilageRisk.level)}`}
                      >
                        {m.spoilageRisk.level} ({m.spoilageRisk.score})
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
