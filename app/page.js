"use client";

import { useMemo, useState } from "react";

const presetLocations = {
  "Baguio, Benguet": { lat: 16.4023, lng: 120.596 },
  "Santiago, Isabela": { lat: 16.6885, lng: 121.5498 },
  "Meycauayan, Bulacan": { lat: 14.7369, lng: 120.9604 },
  "Taguig, Metro Manila": { lat: 14.5176, lng: 121.0509 },
  "Davao City, Davao del Sur": { lat: 7.1907, lng: 125.4553 }
};

const defaultForm = {
  crop_type: "tomato",
  volume_kg: 1200,
  location: "Taguig, Metro Manila",
  hours_since_harvest: 4
};

function riskStyles(level) {
  if (level === "LOW") {
    return "bg-emerald-100 text-emerald-700 border-emerald-200";
  }
  if (level === "MEDIUM") {
    return "bg-amber-100 text-amber-700 border-amber-200";
  }
  return "bg-rose-100 text-rose-700 border-rose-200";
}

export default function Page() {
  const [formData, setFormData] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const locationOptions = useMemo(() => Object.keys(presetLocations), []);

  async function onSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const point = presetLocations[formData.location];

    try {
      const response = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          lat: point.lat,
          lng: point.lng
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Request failed.");
      }
      setResult(data);
    } catch (submitError) {
      setError(submitError.message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  const mapQuery = result
    ? `${result.supply.lat},${result.supply.lng}|${result.selectedFacility.company}`
    : "";

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-6 py-10 md:px-10">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
          ColdLink PH MVP
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">
          Cold Storage Decision Dashboard
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-600 md:text-base">
          Evaluate spoilage risk and assign the most suitable nearby cold storage in one
          decision flow.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-12">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-4">
          <h2 className="text-lg font-semibold text-slate-900">Supply Input</h2>
          <p className="mt-1 text-sm text-slate-500">Enter shipment details to run matching.</p>

          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Crop Type</span>
              <select
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-sky-200 transition focus:ring"
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
              <span className="mb-1 block text-sm font-medium text-slate-700">Volume (kg)</span>
              <input
                type="number"
                min={100}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-sky-200 transition focus:ring"
                value={formData.volume_kg}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, volume_kg: Number(e.target.value) }))
                }
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Location</span>
              <select
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-sky-200 transition focus:ring"
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
              <span className="mb-1 block text-sm font-medium text-slate-700">
                Hours Since Harvest
              </span>
              <input
                type="number"
                min={0}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-sky-200 transition focus:ring"
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
              className="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
            >
              {loading ? "Computing..." : "Run Decision"}
            </button>
          </form>

          {error ? (
            <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
              {error}
            </p>
          ) : null}
        </article>

        <div className="space-y-6 lg:col-span-8">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Decision Panel</h2>
            {!result ? (
              <p className="mt-4 text-sm text-slate-500">
                Submit supply details to see assigned facility, ETA, and spoilage risk.
              </p>
            ) : (
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Supply Details</p>
                  <p className="mt-2 text-sm text-slate-700">
                    <strong>Crop:</strong> {result.supply.crop_type}
                  </p>
                  <p className="text-sm text-slate-700">
                    <strong>Volume:</strong> {result.supply.volume_kg} kg
                  </p>
                  <p className="text-sm text-slate-700">
                    <strong>Location:</strong> {result.supply.location}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Assigned Cold Storage</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    {result.selectedFacility.company}
                  </p>
                  <p className="text-sm text-slate-600">{result.selectedFacility.address}</p>
                  <p className="mt-2 text-sm text-slate-700">
                    <strong>Distance:</strong> {result.estimatedDistanceKm} km
                  </p>
                  <p className="text-sm text-slate-700">
                    <strong>ETA:</strong> {result.etaHours} hrs
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 p-4 md:col-span-2">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Risk Level</p>
                  <div className="mt-2 flex items-center gap-3">
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold ${riskStyles(result.spoilageRisk.level)}`}
                    >
                      {result.spoilageRisk.level}
                    </span>
                    <p className="text-sm text-slate-700">Score: {result.spoilageRisk.score}/100</p>
                  </div>
                  <p className="mt-3 text-sm text-slate-700">{result.recommendation}</p>
                </div>
              </div>
            )}
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Risk Simulation Panel</h2>
            {!result ? (
              <p className="mt-4 text-sm text-slate-500">
                Run a decision to compare immediate transport versus 3-hour delay.
              </p>
            ) : (
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-emerald-700">If transported now</p>
                  <p className="mt-2 text-2xl font-bold text-emerald-700">
                    {result.spoilageRisk.level}
                  </p>
                  <p className="text-sm text-emerald-800">Risk score: {result.spoilageRisk.score}/100</p>
                </div>
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-rose-700">
                    If delayed by +3 hours
                  </p>
                  <p className="mt-2 text-2xl font-bold text-rose-700">{result.delayedRisk.level}</p>
                  <p className="text-sm text-rose-800">Risk score: {result.delayedRisk.score}/100</p>
                </div>
              </div>
            )}
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Map Visualization</h2>
            {!result ? (
              <p className="mt-4 text-sm text-slate-500">
                A simple map route view appears after matching a facility.
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                <iframe
                  title="ColdLink PH route map"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`}
                  className="h-64 w-full rounded-xl border border-slate-200"
                />
                <div className="flex flex-wrap gap-3 text-sm">
                  <a
                    href={`https://www.google.com/maps?q=${result.supply.lat},${result.supply.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-slate-700 hover:bg-slate-50"
                  >
                    Open Farm Location
                  </a>
                  <a
                    href={`https://www.google.com/maps?q=${encodeURIComponent(result.selectedFacility.company)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-slate-700 hover:bg-slate-50"
                  >
                    Open Cold Storage
                  </a>
                </div>
              </div>
            )}
          </article>
        </div>
      </section>
    </main>
  );
}
