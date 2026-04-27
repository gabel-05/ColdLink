"use client";

import { useEffect, useMemo, useState } from "react";
import { coldStorages } from "@/data/storage";
import { demoScenario, farmLocations, getFarmByName } from "@/lib/demo";

export default function NetworkMapPage() {
  const [selectedFarmName, setSelectedFarmName] = useState(demoScenario.location);
  const [decision, setDecision] = useState(null);

  const selectedFarm = useMemo(() => getFarmByName(selectedFarmName), [selectedFarmName]);

  useEffect(() => {
    async function loadDecision() {
      const response = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...demoScenario,
          location: selectedFarm.name,
          lat: selectedFarm.lat,
          lng: selectedFarm.lng
        })
      });
      const data = await response.json();
      if (response.ok) setDecision(data);
    }
    loadDecision();
  }, [selectedFarm]);

  const routeQuery = decision
    ? `${decision.supply.lat},${decision.supply.lng} to ${decision.selectedFacility.lat},${decision.selectedFacility.lng}`
    : `${selectedFarm.lat},${selectedFarm.lng}`;

  return (
    <main className="space-y-6">
      <section className="rounded-2xl border border-[#2E5E3E]/15 bg-white p-6 shadow-[0_8px_24px_rgba(46,94,62,0.08)]">
        <h2 className="text-2xl font-semibold text-[#2E5E3E]">Supply Network Map</h2>
        <p className="mt-2 max-w-3xl text-sm text-[#5E6B60]">
          Geographic view of farm origins and accredited cold storage destinations, with a
          suggested route based on the current scenario.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-12">
        <article className="space-y-4 rounded-2xl border border-[#2E5E3E]/15 bg-white p-5 shadow-[0_8px_24px_rgba(46,94,62,0.08)] lg:col-span-4">
          <h3 className="text-lg font-semibold text-[#2E5E3E]">Farm Locations</h3>
          <select
            value={selectedFarmName}
            onChange={(e) => setSelectedFarmName(e.target.value)}
            className="w-full rounded-xl border border-[#2E5E3E]/25 bg-white px-3 py-2 text-sm outline-none ring-[#F2C14E]/40 focus:ring"
          >
            {farmLocations.map((farm) => (
              <option key={farm.name} value={farm.name}>
                {farm.name}
              </option>
            ))}
          </select>
          <div className="rounded-xl border border-[#2E5E3E]/15 bg-[#F7F5EF] p-3">
            <p className="text-xs uppercase tracking-[0.14em] text-[#8B5E3C]">Selected Farm</p>
            <p className="mt-1 text-sm font-medium text-[#2E5E3E]">{selectedFarm.name}</p>
            <p className="text-xs text-[#5E6B60]">
              {selectedFarm.lat}, {selectedFarm.lng}
            </p>
          </div>
          <div className="rounded-xl border border-[#2E5E3E]/15 bg-[#F7F5EF] p-3">
            <p className="text-xs uppercase tracking-[0.14em] text-[#8B5E3C]">
              Cold Storage Warehouses
            </p>
            <ul className="mt-2 space-y-2 text-sm text-[#2E5E3E]">
              {coldStorages.slice(0, 6).map((storage) => (
                <li key={storage.id}>
                  {storage.company}
                  <a
                    className="ml-2 text-xs text-[#8B5E3C] underline"
                    target="_blank"
                    rel="noreferrer"
                    href={`https://www.google.com/maps?q=${storage.lat},${storage.lng}`}
                  >
                    map
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </article>

        <article className="rounded-2xl border border-[#2E5E3E]/15 bg-white p-5 shadow-[0_8px_24px_rgba(46,94,62,0.08)] lg:col-span-8">
          <h3 className="text-lg font-semibold text-[#2E5E3E]">Route Visualization</h3>
          <p className="mt-1 text-sm text-[#5E6B60]">
            Current route recommendation from farm origin to assigned warehouse.
          </p>
          <iframe
            title="ColdLink supply network map"
            src={`https://www.google.com/maps?q=${encodeURIComponent(routeQuery)}&output=embed`}
            className="mt-4 h-[420px] w-full rounded-xl border border-[#2E5E3E]/20"
          />
          {decision ? (
            <div className="mt-4 rounded-xl border border-[#2E5E3E]/15 bg-[#F7F5EF] p-4 text-sm text-[#2E5E3E]">
              <p className="font-medium">Assigned Warehouse: {decision.selectedFacility.company}</p>
              <p className="mt-1">
                Distance {decision.estimatedDistanceKm} km | ETA {decision.etaHours} hrs
              </p>
            </div>
          ) : null}
        </article>
      </section>
    </main>
  );
}
