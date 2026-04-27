"use client";

import { useMemo, useState } from "react";
import { demoScenario, getFarmByName, riskBadge } from "@/lib/demo";
import { computeSpoilageRisk, recommendationMessage } from "@/lib/utils";

function ComparisonCard({ title, risk, tone }) {
  const cardTone =
    tone === "positive"
      ? "border-[#2E5E3E]/25 bg-[#2E5E3E]/10"
      : "border-[#8B5E3C]/25 bg-[#F2C14E]/20";

  return (
    <article className={`rounded-xl border p-4 ${cardTone}`}>
      <p className="text-xs uppercase tracking-[0.14em] text-[#8B5E3C]">{title}</p>
      <div className="mt-2 flex items-center gap-3">
        <span
          className={`rounded-full border px-3 py-1 text-xs font-semibold ${riskBadge(risk.level)}`}
        >
          {risk.level}
        </span>
        <span className="text-xl font-semibold text-[#2E5E3E]">{risk.score}/100</span>
      </div>
    </article>
  );
}

export default function SimulationLabPage() {
  const [delayHours, setDelayHours] = useState(3);

  const baseRisk = useMemo(
    () =>
      computeSpoilageRisk({
        cropType: demoScenario.crop_type,
        volumeKg: demoScenario.volume_kg,
        hoursSinceHarvest: demoScenario.hours_since_harvest,
        distanceKm: 35
      }),
    []
  );

  const delayedRisk = useMemo(
    () =>
      computeSpoilageRisk({
        cropType: demoScenario.crop_type,
        volumeKg: demoScenario.volume_kg,
        hoursSinceHarvest: demoScenario.hours_since_harvest + delayHours,
        distanceKm: 170
      }),
    [delayHours]
  );

  const beforeSystemRisk = useMemo(
    () =>
      computeSpoilageRisk({
        cropType: demoScenario.crop_type,
        volumeKg: demoScenario.volume_kg,
        hoursSinceHarvest: demoScenario.hours_since_harvest + delayHours,
        distanceKm: 65
      }),
    [delayHours]
  );

  const afterSystemRisk = delayedRisk;
  const farm = getFarmByName(demoScenario.location);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="rounded-2xl border border-[#2E5E3E]/12 bg-white p-6 shadow-[0_8px_28px_rgba(46,94,62,0.07)]">
        <h1 className="text-2xl font-semibold text-[#2E5E3E]">Simulation Lab</h1>
        <p className="mt-2 text-sm text-[#5E6B60]">
          Scenario testing: adjust delay hours (0–6) to recalculate spoilage exposure. Compare
          baseline logistics vs ColdLink-guided routing.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-12">
        <article className="rounded-2xl border border-[#2E5E3E]/12 bg-white p-5 shadow-[0_8px_28px_rgba(46,94,62,0.07)] lg:col-span-4">
          <p className="text-xs uppercase tracking-[0.14em] text-[#8B5E3C]">Scenario</p>
          <h2 className="mt-2 text-lg font-semibold text-[#2E5E3E]">Control tower reference load</h2>
          <p className="mt-2 text-sm text-[#5E6B60]">
            {demoScenario.volume_kg.toLocaleString()} kg {demoScenario.crop_type},{" "}
            {demoScenario.hours_since_harvest}h since harvest, origin {farm.name}.
          </p>

          <label className="mt-6 block">
            <span className="mb-2 block text-sm font-medium text-[#2E5E3E]">
              Delay simulation: {delayHours} hours
            </span>
            <input
              type="range"
              min={0}
              max={6}
              step={1}
              value={delayHours}
              onChange={(e) => setDelayHours(Number(e.target.value))}
              className="w-full accent-[#2E5E3E]"
            />
            <div className="mt-2 flex justify-between text-[11px] text-[#8B5E3C]">
              <span>Immediate</span>
              <span>+6h delay</span>
            </div>
          </label>
        </article>

        <div className="space-y-6 lg:col-span-8">
          <article className="rounded-2xl border border-[#2E5E3E]/12 bg-white p-5 shadow-[0_8px_28px_rgba(46,94,62,0.07)]">
            <h3 className="text-lg font-semibold text-[#2E5E3E]">Dynamic risk comparison</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <ComparisonCard title="Immediate transport" risk={baseRisk} tone="positive" />
              <ComparisonCard title={`Delayed transport (+${delayHours}h)`} risk={delayedRisk} tone="negative" />
            </div>
          </article>

          <article className="rounded-2xl border border-[#2E5E3E]/12 bg-white p-5 shadow-[0_8px_28px_rgba(46,94,62,0.07)]">
            <h3 className="text-lg font-semibold text-[#2E5E3E]">Before vs after ColdLink</h3>
            <p className="mt-1 text-sm text-[#5E6B60]">
              “Before” assumes longer unplanned haul; “after” applies the same delay but with
              nearest-storage routing (distance factor in the risk model).
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <ComparisonCard title="Before ColdLink routing" risk={beforeSystemRisk} tone="negative" />
              <ComparisonCard title="After ColdLink routing" risk={afterSystemRisk} tone="positive" />
            </div>
            <p className="mt-4 rounded-xl border border-[#2E5E3E]/12 bg-[#F7F5EF] p-3 text-sm text-[#2E5E3E]">
              {recommendationMessage(afterSystemRisk.level)}
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}
