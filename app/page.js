"use client";

import { useEffect, useMemo, useState } from "react";
import { demoScenario, farmLocations, getFarmByName, riskBadge } from "@/lib/demo";

function SectionCard({ title, subtitle, children, className = "" }) {
  return (
    <article
      className={`rounded-2xl border border-[#2E5E3E]/15 bg-white p-6 shadow-[0_8px_24px_rgba(46,94,62,0.08)] ${className}`}
    >
      <h2 className="text-lg font-semibold text-[#2E5E3E]">{title}</h2>
      {subtitle ? <p className="mt-1 text-sm text-[#5E6B60]">{subtitle}</p> : null}
      <div className="mt-5">{children}</div>
    </article>
  );
}

export default function Page() {
  const [formData, setFormData] = useState(demoScenario);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const locationOptions = useMemo(() => farmLocations.map((farm) => farm.name), []);

  async function runDecision(payload) {
    setLoading(true);
    setError("");
    const selectedFarm = getFarmByName(payload.location);

    try {
      const response = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          lat: selectedFarm.lat,
          lng: selectedFarm.lng
        })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Unable to run decision.");
      }
      setResult(data);
    } catch (decisionError) {
      setError(decisionError.message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    runDecision(demoScenario);
  }, []);

  async function onSubmit(event) {
    event.preventDefault();
    runDecision(formData);
  }

  return (
    <main className="space-y-6">
      <section className="rounded-2xl border border-[#2E5E3E]/15 bg-gradient-to-r from-[#2E5E3E] to-[#3A6F4C] p-6 text-white shadow-[0_10px_24px_rgba(46,94,62,0.2)]">
        <p className="text-sm tracking-wide text-[#F2C14E]">System Banner</p>
        <h2 className="mt-1 text-2xl font-semibold">ColdLink Command Center</h2>
        <p className="mt-2 text-sm md:text-base">
          ColdLink optimizes harvest routing in real-time to reduce spoilage risk.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-12">
        <SectionCard
          title="Active Harvest Intake"
          subtitle="Pre-filled scenario keeps the decision flow immediate."
          className="lg:col-span-4"
        >
          <form className="space-y-4" onSubmit={onSubmit}>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-[#2E5E3E]">Crop Type</span>
              <select
                className="w-full rounded-xl border border-[#2E5E3E]/25 bg-white px-3 py-2 text-sm outline-none ring-[#F2C14E]/40 transition focus:ring"
                value={formData.crop_type}
                onChange={(e) => setFormData((prev) => ({ ...prev, crop_type: e.target.value }))}
              >
                <option value="tomato">Tomato</option>
                <option value="strawberry">Strawberry</option>
                <option value="lettuce">Lettuce</option>
                <option value="mango">Mango</option>
                <option value="banana">Banana</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-[#2E5E3E]">Volume (kg)</span>
              <input
                type="number"
                min={100}
                className="w-full rounded-xl border border-[#2E5E3E]/25 bg-white px-3 py-2 text-sm outline-none ring-[#F2C14E]/40 transition focus:ring"
                value={formData.volume_kg}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, volume_kg: Number(e.target.value) }))
                }
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-[#2E5E3E]">Location</span>
              <select
                className="w-full rounded-xl border border-[#2E5E3E]/25 bg-white px-3 py-2 text-sm outline-none ring-[#F2C14E]/40 transition focus:ring"
                value={formData.location}
                onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
              >
                {locationOptions.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-[#2E5E3E]">
                Hours Since Harvest
              </span>
              <input
                type="number"
                min={0}
                className="w-full rounded-xl border border-[#2E5E3E]/25 bg-white px-3 py-2 text-sm outline-none ring-[#F2C14E]/40 transition focus:ring"
                value={formData.hours_since_harvest}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    hours_since_harvest: Number(e.target.value)
                  }))
                }
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#2E5E3E] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
            >
              {loading ? "Evaluating..." : "Re-run Decision"}
            </button>
          </form>
        </SectionCard>

        <div className="space-y-6 lg:col-span-8">
          <SectionCard
            title="Decision Output"
            subtitle="Problem -> assignment -> operational narrative."
          >
            {error ? (
              <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </p>
            ) : null}
            {!result ? (
              <p className="text-sm text-[#5E6B60]">Running the default scenario...</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-[#2E5E3E]/15 bg-[#F7F5EF] p-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-[#8B5E3C]">
                    Spoilage Exposure Index
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold ${riskBadge(result.spoilageRisk.level)}`}
                    >
                      {result.spoilageRisk.level}
                    </span>
                    <span className="text-2xl font-semibold text-[#2E5E3E]">
                      {result.spoilageRisk.score}/100
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-[#5E6B60]">
                    Based on crop sensitivity, post-harvest age, load, and travel distance.
                  </p>
                </div>

                <div className="rounded-xl border border-[#2E5E3E]/15 bg-[#F7F5EF] p-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-[#8B5E3C]">
                    Cold Storage Assignment
                  </p>
                  <p className="mt-3 text-sm font-semibold text-[#2E5E3E]">
                    {result.selectedFacility.company}
                  </p>
                  <p className="mt-1 text-sm text-[#5E6B60]">{result.selectedFacility.address}</p>
                  <p className="mt-2 text-sm text-[#2E5E3E]">
                    Distance: {result.estimatedDistanceKm} km | ETA: {result.etaHours} hrs
                  </p>
                </div>

                <div className="rounded-xl border border-[#2E5E3E]/15 bg-white p-4 md:col-span-2">
                  <p className="text-xs uppercase tracking-[0.14em] text-[#8B5E3C]">
                    Recommendation Narrative
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#2E5E3E]">{result.recommendation}</p>
                </div>
              </div>
            )}
          </SectionCard>
        </div>
      </section>
    </main>
  );
}
