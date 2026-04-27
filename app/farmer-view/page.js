"use client";

import { useState } from "react";
import { demoScenario, getFarmByName } from "@/lib/demo";

export default function FarmerViewPage() {
  const [submitted, setSubmitted] = useState(false);
  const [facilityName, setFacilityName] = useState("");
  const farm = getFarmByName(demoScenario.location);

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await fetch("/api/match", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        crop_type: demoScenario.crop_type,
        volume_kg: demoScenario.volume_kg,
        location: demoScenario.location,
        hours_since_harvest: demoScenario.hours_since_harvest,
        lat: farm.lat,
        lng: farm.lng
      })
    });
    const data = await res.json();
    if (res.ok) setFacilityName(data.selectedFacility?.company ?? "");
    setSubmitted(true);
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6">
      <div className="rounded-2xl border border-[#2E5E3E]/12 bg-white p-5 shadow-[0_8px_28px_rgba(46,94,62,0.07)]">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8B5E3C]">
          Farmer preview
        </p>
        <h1 className="mt-2 text-xl font-semibold text-[#2E5E3E]">Field intake (mobile)</h1>
        <p className="mt-2 text-sm text-[#5E6B60]">
          Simulated cooperative member flow — submit harvest for pickup coordination.
        </p>
      </div>

      <div className="rounded-[2rem] border border-[#2E5E3E]/15 bg-[#2E5E3E] p-2 shadow-xl">
        <div className="overflow-hidden rounded-[1.75rem] bg-[#F7F5EF]">
          <div className="border-b border-[#2E5E3E]/10 bg-white px-5 py-4">
            <p className="text-xs text-[#8B5E3C]">Signed in as</p>
            <p className="font-semibold text-[#2E5E3E]">Bulacan Growers Co-op (sim)</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 px-5 py-6">
            <label className="block text-sm">
              <span className="text-[#2E5E3E]">Crop</span>
              <input
                readOnly
                className="mt-1 w-full rounded-xl border border-[#2E5E3E]/20 bg-white px-3 py-2.5 text-[#2E5E3E]"
                value={demoScenario.crop_type}
              />
            </label>
            <label className="block text-sm">
              <span className="text-[#2E5E3E]">Volume (kg)</span>
              <input
                readOnly
                type="number"
                className="mt-1 w-full rounded-xl border border-[#2E5E3E]/20 bg-white px-3 py-2.5 text-[#2E5E3E]"
                value={demoScenario.volume_kg}
              />
            </label>
            <label className="block text-sm">
              <span className="text-[#2E5E3E]">Pickup location</span>
              <input
                readOnly
                className="mt-1 w-full rounded-xl border border-[#2E5E3E]/20 bg-white px-3 py-2.5 text-[#5E6B60]"
                value={farm.name}
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-xl bg-[#2E5E3E] py-3 text-sm font-semibold text-white shadow-md transition hover:brightness-110"
            >
              Submit harvest (demo)
            </button>
          </form>

          {submitted ? (
            <div className="space-y-3 border-t border-[#2E5E3E]/10 bg-white px-5 py-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#8B5E3C]">Status</p>
              <ul className="space-y-3 text-sm text-[#2E5E3E]">
                <li className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2E5E3E]/15 text-xs font-bold text-[#2E5E3E]">
                    ✓
                  </span>
                  Pickup scheduled — window 14:00–16:00 (simulated)
                </li>
                <li className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F2C14E]/40 text-xs font-bold text-[#8B5E3C]">
                    ✓
                  </span>
                  Assigned to cold storage — {facilityName || "Pending confirmation"}
                </li>
              </ul>
            </div>
          ) : (
            <p className="border-t border-[#2E5E3E]/10 px-5 py-4 text-center text-xs text-[#5E6B60]">
              Tap submit to simulate coordinator confirmation.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
