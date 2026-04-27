"use client";

import { useEffect, useMemo, useState } from "react";
import { coldStorages } from "@/data/storage";
import { demoScenario, farmSites, getFarmByName } from "@/lib/demo";
import RegionGoogleMap from "@/components/region-google-map";

export default function NetworkMapPage() {
  const [selectedFarmName, setSelectedFarmName] = useState(demoScenario.location);
  const [decision, setDecision] = useState(null);

  const selectedFarm = useMemo(() => getFarmByName(selectedFarmName), [selectedFarmName]);

  const farmsForMap = useMemo(
    () => farmSites.map((f) => ({ lat: f.lat, lng: f.lng, name: f.name })),
    []
  );

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

  const routeFrom = decision
    ? { lat: decision.supply.lat, lng: decision.supply.lng }
    : { lat: selectedFarm.lat, lng: selectedFarm.lng };
  const routeTo = decision?.selectedFacility
    ? { lat: decision.selectedFacility.lat, lng: decision.selectedFacility.lng }
    : null;

  const storagesForMap = useMemo(
    () => coldStorages.map((s) => ({ lat: s.lat, lng: s.lng, company: s.company })),
    []
  );

  const directionsEmbedUrl = decision
    ? `https://maps.google.com/maps?saddr=${decision.supply.lat},${decision.supply.lng}&daddr=${decision.selectedFacility.lat},${decision.selectedFacility.lng}&output=embed`
    : `https://www.google.com/maps?q=${selectedFarm.lat},${selectedFarm.lng}&output=embed`;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="rounded-2xl border border-[#2E5E3E]/12 bg-white p-6 shadow-[0_8px_28px_rgba(46,94,62,0.07)]">
        <h1 className="text-2xl font-semibold text-[#2E5E3E]">Supply Network Map</h1>
        <p className="mt-2 max-w-3xl text-sm text-[#5E6B60]">
          Static geographic view of farm origins and accredited cold storage facilities. Route
          polyline uses Google Maps JavaScript when{" "}
          <code className="rounded bg-[#F7F5EF] px-1 text-[#2E5E3E]">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code>{" "}
          is set; directions embed works for all deployments.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-12">
        <article className="space-y-4 rounded-2xl border border-[#2E5E3E]/12 bg-white p-5 shadow-[0_8px_28px_rgba(46,94,62,0.07)] lg:col-span-4">
          <h2 className="text-lg font-semibold text-[#2E5E3E]">Scenario origin</h2>
          <select
            value={selectedFarmName}
            onChange={(e) => setSelectedFarmName(e.target.value)}
            className="w-full rounded-xl border border-[#2E5E3E]/25 bg-[#F7F5EF] px-3 py-2.5 text-sm outline-none ring-[#F2C14E]/40 focus:ring"
          >
            {farmSites.map((farm) => (
              <option key={farm.id} value={farm.name}>
                {farm.name}
              </option>
            ))}
          </select>
          <div className="rounded-xl border border-[#2E5E3E]/12 bg-[#F7F5EF] p-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#8B5E3C]">
              Selected farm
            </p>
            <p className="mt-2 text-sm font-medium text-[#2E5E3E]">{selectedFarm.name}</p>
            <p className="text-xs text-[#5E6B60]">
              {selectedFarm.lat.toFixed(4)}, {selectedFarm.lng.toFixed(4)}
            </p>
          </div>
          <div className="rounded-xl border border-[#2E5E3E]/12 bg-[#F7F5EF] p-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#8B5E3C]">
              Cold storage network
            </p>
            <ul className="mt-3 max-h-48 space-y-2 overflow-y-auto text-sm text-[#2E5E3E]">
              {coldStorages.map((storage) => (
                <li key={storage.id} className="flex justify-between gap-2 border-b border-[#2E5E3E]/10 pb-2 last:border-0">
                  <span className="leading-snug">{storage.company}</span>
                  <a
                    className="shrink-0 text-xs text-[#8B5E3C] underline"
                    target="_blank"
                    rel="noreferrer"
                    href={`https://www.google.com/maps?q=${storage.lat},${storage.lng}`}
                  >
                    Map
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </article>

        <article className="space-y-4 rounded-2xl border border-[#2E5E3E]/12 bg-white p-5 shadow-[0_8px_28px_rgba(46,94,62,0.07)] lg:col-span-8">
          <h2 className="text-lg font-semibold text-[#2E5E3E]">Interactive layer</h2>
          <RegionGoogleMap
            key={`${selectedFarmName}-${decision?.selectedFacility?.id ?? "pending"}`}
            farms={farmsForMap}
            storages={storagesForMap}
            routeFrom={routeFrom}
            routeTo={routeTo}
            height={440}
          />

          <div>
            <h3 className="text-sm font-semibold text-[#2E5E3E]">Route preview (embed)</h3>
            <p className="mt-1 text-xs text-[#5E6B60]">
              Farm → assigned warehouse (static path, no live vehicle tracking).
            </p>
            <iframe
              title="ColdLink route preview"
              src={directionsEmbedUrl}
              className="mt-3 h-[360px] w-full rounded-xl border border-[#2E5E3E]/15"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {decision ? (
            <div className="rounded-xl border border-[#2E5E3E]/12 bg-[#F7F5EF] p-4 text-sm text-[#2E5E3E]">
              <p className="font-semibold">{decision.selectedFacility.company}</p>
              <p className="mt-1 text-[#5E6B60]">{decision.selectedFacility.address}</p>
              <p className="mt-2">
                Distance <strong>{decision.estimatedDistanceKm} km</strong>
                <span className="mx-2 text-[#8B5E3C]">·</span>
                ETA <strong>{decision.etaHours} hrs</strong>
              </p>
            </div>
          ) : null}
        </article>
      </section>
    </div>
  );
}
