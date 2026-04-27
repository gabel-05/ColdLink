"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Optional Google Maps JS: set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY.
 * Fallback message when key is missing (embed still works on Network Map page).
 */
export default function RegionGoogleMap({
  farms = [],
  storages = [],
  routeFrom = null,
  routeTo = null,
  height = 420
}) {
  const ref = useRef(null);
  const [ready, setReady] = useState(false);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (!apiKey || !ref.current || typeof window === "undefined") return;

    const existing = document.querySelector('script[data-coldlink-maps="1"]');
    const initMap = () => {
      if (!window.google?.maps || !ref.current) return;
      const center = { lat: 14.6, lng: 121.0 };
      const map = new window.google.maps.Map(ref.current, {
        zoom: 6,
        center,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        styles: [
          { featureType: "poi", stylers: [{ visibility: "off" }] },
          { featureType: "transit", stylers: [{ visibility: "off" }] }
        ]
      });

      farms.forEach((f) => {
        new window.google.maps.Marker({
          position: { lat: f.lat, lng: f.lng },
          map,
          title: f.name ?? "Farm",
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: "#F2C14E",
            fillOpacity: 1,
            strokeColor: "#8B5E3C",
            strokeWeight: 2
          }
        });
      });

      storages.forEach((s) => {
        new window.google.maps.Marker({
          position: { lat: s.lat, lng: s.lng },
          map,
          title: s.company ?? "Cold storage",
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: "#2E5E3E",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2
          }
        });
      });

      if (
        routeFrom &&
        routeTo &&
        typeof routeFrom.lat === "number" &&
        typeof routeTo.lat === "number"
      ) {
        const path = [
          { lat: routeFrom.lat, lng: routeFrom.lng },
          { lat: routeTo.lat, lng: routeTo.lng }
        ];
        new window.google.maps.Polyline({
          path,
          geodesic: true,
          strokeColor: "#8B5E3C",
          strokeOpacity: 0.95,
          strokeWeight: 3,
          map
        });
        const bounds = new window.google.maps.LatLngBounds();
        path.forEach((p) => bounds.extend(p));
        map.fitBounds(bounds, 48);
      }

      setReady(true);
    };

    if (window.google?.maps) {
      initMap();
      return;
    }

    if (existing) {
      existing.addEventListener("load", initMap);
      return () => existing.removeEventListener("load", initMap);
    }

    const script = document.createElement("script");
    script.dataset.coldlinkMaps = "1";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry`;
    script.async = true;
    script.defer = true;
    script.onload = initMap;
    document.head.appendChild(script);

    return () => {
      script.onload = null;
    };
  }, [apiKey, farms, storages, routeFrom, routeTo]);

  if (!apiKey) {
    return (
      <div
        className="flex items-center justify-center rounded-xl border border-dashed border-[#2E5E3E]/25 bg-[#F7F5EF] text-center text-sm text-[#5E6B60]"
        style={{ minHeight: height }}
      >
        <p className="max-w-md px-4">
          Add <code className="rounded bg-white px-1 py-0.5 text-[#2E5E3E]">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code>{" "}
          for interactive markers and route lines. The embed below still works without a key.
        </p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-xl border border-[#2E5E3E]/20 shadow-inner">
      <div ref={ref} style={{ height }} className="w-full bg-[#e8e4dc]" />
      {!ready ? (
        <div className="absolute inset-0 flex items-center justify-center bg-[#F7F5EF]/80 text-sm text-[#5E6B60]">
          Loading map…
        </div>
      ) : null}
    </div>
  );
}
