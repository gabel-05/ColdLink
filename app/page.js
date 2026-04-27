"use client";

import { useEffect, useMemo, useState } from "react";
import {
  harvestIntakeFeed,
  urgencyStyles
} from "@/data/operations";
import { riskBadge } from "@/lib/demo";

function Panel({ title, subtitle, children, className = "" }) {
  return (
    <section
      className={`rounded-2xl border border-[#2E5E3E]/12 bg-white p-5 shadow-[0_8px_28px_rgba(46,94,62,0.07)] ${className}`}
    >
      <h2 className="text-base font-semibold text-[#2E5E3E]">{title}</h2>
      {subtitle ? <p className="mt-1 text-sm text-[#5E6B60]">{subtitle}</p> : null}
      <div className="mt-4">{children}</div>
    </section>
  );
}

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

export default function CommandCenterPage() {
  const [selectedId, setSelectedId] = useState(harvestIntakeFeed[0].id);
  const [matches, setMatches] = useState({});
  const [loadingBoard, setLoadingBoard] = useState(true);
  const [error, setError] = useState("");

  const selectedRow = useMemo(
    () => harvestIntakeFeed.find((r) => r.id === selectedId) ?? harvestIntakeFeed[0],
    [selectedId]
  );

  const selectedMatch = matches[selectedId];

  useEffect(() => {
    let cancelled = false;
    async function loadAll() {
      setLoadingBoard(true);
      setError("");
      try {
        const results = await Promise.all(harvestIntakeFeed.map((row) => fetchMatch(row)));
        if (cancelled) return;
        const map = {};
        results.forEach((r) => {
          map[r.harvestId] = r;
        });
        setMatches(map);
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoadingBoard(false);
      }
    }
    loadAll();
    return () => {
      cancelled = true;
    };
  }, []);

  function formatTime(iso) {
    try {
      return new Date(iso).toLocaleString("en-PH", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Manila"
      });
    } catch {
      return iso;
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="rounded-2xl border border-[#2E5E3E]/15 bg-gradient-to-r from-[#2E5E3E] to-[#3d7250] p-6 text-white shadow-[0_12px_32px_rgba(46,94,62,0.22)]">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F2C14E]">
          System status
        </p>
        <h1 className="mt-2 text-2xl font-semibold md:text-3xl">LGU / Co-op Control Tower</h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/90 md:text-base">
          ColdLink is actively optimizing cold chain allocation across the region.
        </p>
      </section>

      <div className="grid gap-6 xl:grid-cols-12">
        <div className="space-y-6 xl:col-span-5">
          <Panel
            title="Harvest Intake Feed"
            subtitle="Incoming registrations from cooperatives and field agents (simulated)."
          >
            {loadingBoard ? (
              <p className="text-sm text-[#5E6B60]">Syncing intake records…</p>
            ) : (
              <ul className="max-h-[520px] space-y-2 overflow-y-auto pr-1">
                {harvestIntakeFeed.map((row) => {
                  const m = matches[row.id];
                  const active = row.id === selectedId;
                  return (
                    <li key={row.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedId(row.id)}
                        className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                          active
                            ? "border-[#2E5E3E] bg-[#2E5E3E]/8 shadow-sm"
                            : "border-[#2E5E3E]/10 bg-[#F7F5EF] hover:border-[#2E5E3E]/25"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold capitalize text-[#2E5E3E]">
                              {row.crop_type} · {row.volume_kg.toLocaleString()} kg
                            </p>
                            <p className="mt-0.5 text-xs text-[#5E6B60]">{row.location}</p>
                            <p className="mt-1 text-[11px] text-[#8B5E3C]">{formatTime(row.reportedAt)}</p>
                          </div>
                          <span
                            className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${urgencyStyles[row.urgency]}`}
                          >
                            {row.urgency}
                          </span>
                        </div>
                        {m ? (
                          <p className="mt-2 text-[11px] text-[#5E6B60]">
                            Risk:{" "}
                            <span className="font-medium text-[#2E5E3E]">{m.spoilageRisk.level}</span>{" "}
                            ({m.spoilageRisk.score}) · {m.selectedFacility.company.slice(0, 36)}…
                          </p>
                        ) : null}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </Panel>
        </div>

        <div className="space-y-6 xl:col-span-7">
          <Panel
            title="Allocation Engine"
            subtitle="Nearest accredited cold storage, ETA, and operational recommendation for the selected intake."
          >
            {error ? (
              <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>
            ) : null}
            {!selectedMatch ? (
              <p className="text-sm text-[#5E6B60]">Select an intake record.</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-[#2E5E3E]/12 bg-[#F7F5EF] p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[#8B5E3C]">
                    Selected harvest
                  </p>
                  <p className="mt-2 text-sm font-semibold capitalize text-[#2E5E3E]">
                    {selectedRow.crop_type} · {selectedRow.volume_kg.toLocaleString()} kg
                  </p>
                  <p className="text-sm text-[#5E6B60]">{selectedRow.location}</p>
                  <p className="mt-2 text-xs text-[#5E6B60]">
                    {selectedRow.id} · {selectedRow.cooperative}
                  </p>
                </div>
                <div className="rounded-xl border border-[#2E5E3E]/12 bg-[#F7F5EF] p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[#8B5E3C]">
                    Assigned cold storage
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[#2E5E3E]">
                    {selectedMatch.selectedFacility.company}
                  </p>
                  <p className="mt-1 text-xs text-[#5E6B60]">{selectedMatch.selectedFacility.address}</p>
                  <p className="mt-3 text-sm text-[#2E5E3E]">
                    <strong>{selectedMatch.estimatedDistanceKm} km</strong>
                    <span className="mx-2 text-[#8B5E3C]">·</span>
                    ETA <strong>{selectedMatch.etaHours} hrs</strong>
                  </p>
                </div>
                <div className="rounded-xl border border-[#F2C14E]/35 bg-white p-4 md:col-span-2">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[#8B5E3C]">
                    Recommendation
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-[#2E5E3E]">
                    {selectedMatch.recommendation}
                  </p>
                </div>
              </div>
            )}
          </Panel>

          <Panel title="Risk Monitoring Board" subtitle="Exposure index across active intake items.">
            {loadingBoard ? (
              <p className="text-sm text-[#5E6B60]">Building risk snapshot…</p>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-[#2E5E3E]/10">
                <table className="w-full min-w-[560px] text-left text-sm">
                  <thead className="border-b border-[#2E5E3E]/10 bg-[#F7F5EF] text-[11px] uppercase tracking-wide text-[#8B5E3C]">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Intake</th>
                      <th className="px-4 py-3 font-semibold">Crop</th>
                      <th className="px-4 py-3 font-semibold">Origin</th>
                      <th className="px-4 py-3 font-semibold">Risk</th>
                      <th className="px-4 py-3 font-semibold">Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2E5E3E]/8">
                    {harvestIntakeFeed.map((row) => {
                      const m = matches[row.id];
                      if (!m) return null;
                      const low = m.spoilageRisk.level === "LOW";
                      const med = m.spoilageRisk.level === "MEDIUM";
                      const rowBg = low
                        ? "bg-[#2E5E3E]/06"
                        : med
                          ? "bg-[#F2C14E]/15"
                          : "bg-red-50";
                      return (
                        <tr key={row.id} className={rowBg}>
                          <td className="px-4 py-3 font-mono text-xs text-[#5E6B60]">{row.id}</td>
                          <td className="px-4 py-3 capitalize text-[#2E5E3E]">{row.crop_type}</td>
                          <td className="px-4 py-3 text-[#5E6B60]">{row.location}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${riskBadge(m.spoilageRisk.level)}`}
                            >
                              {m.spoilageRisk.level}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-medium text-[#2E5E3E]">{m.spoilageRisk.score}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}
