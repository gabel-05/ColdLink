export function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

export function haversineDistanceKm(origin, destination) {
  const earthRadiusKm = 6371;
  const deltaLat = toRadians(destination.lat - origin.lat);
  const deltaLng = toRadians(destination.lng - origin.lng);
  const lat1 = toRadians(origin.lat);
  const lat2 = toRadians(destination.lat);

  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

export function estimateEtaHours(distanceKm) {
  const avgTruckSpeedKmPerHour = 35;
  const handlingBufferHours = 0.5;
  return distanceKm / avgTruckSpeedKmPerHour + handlingBufferHours;
}

export function computeSpoilageRisk({ cropType, volumeKg, hoursSinceHarvest, distanceKm }) {
  const cropSensitivity = {
    strawberry: 1.25,
    lettuce: 1.2,
    tomato: 1.0,
    mango: 0.85,
    banana: 0.75
  };

  const sensitivity = cropSensitivity[cropType?.toLowerCase()] ?? 1;
  const timeFactor = hoursSinceHarvest / 10;
  const loadFactor = Math.min(volumeKg / 4000, 1.4);
  const travelFactor = distanceKm / 150;

  const rawRisk = (timeFactor + loadFactor + travelFactor) * sensitivity * 35;
  const score = Math.max(5, Math.min(98, Math.round(rawRisk)));

  let level = "LOW";
  if (score >= 70) level = "HIGH";
  else if (score >= 40) level = "MEDIUM";

  return { score, level };
}

export function recommendationMessage(riskLevel) {
  if (riskLevel === "LOW") {
    return "Dispatch immediately to lock in quality and avoid early temperature drift.";
  }
  if (riskLevel === "MEDIUM") {
    return "Prioritize loading within the hour and monitor handling exposure closely.";
  }
  return "Critical: move now with chilled transport and fast intake at destination.";
}
