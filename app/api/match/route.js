import { NextResponse } from "next/server";
import { coldStorages } from "@/data/storage";
import {
  computeSpoilageRisk,
  estimateEtaHours,
  haversineDistanceKm,
  recommendationMessage
} from "@/lib/utils";

function nearestStorage(origin) {
  return coldStorages
    .map((facility) => ({
      ...facility,
      distanceKm: haversineDistanceKm(origin, { lat: facility.lat, lng: facility.lng })
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm)[0];
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      crop_type,
      volume_kg,
      location,
      hours_since_harvest,
      lat,
      lng
    } = body;

    if (
      !crop_type ||
      !volume_kg ||
      !location ||
      hours_since_harvest === undefined ||
      lat === undefined ||
      lng === undefined
    ) {
      return NextResponse.json(
        { error: "Missing required fields for matching." },
        { status: 400 }
      );
    }

    const supplyPoint = { lat: Number(lat), lng: Number(lng) };
    const best = nearestStorage(supplyPoint);
    const distanceKm = Number(best.distanceKm.toFixed(1));
    const etaHours = Number(estimateEtaHours(distanceKm).toFixed(1));

    const currentRisk = computeSpoilageRisk({
      cropType: crop_type,
      volumeKg: Number(volume_kg),
      hoursSinceHarvest: Number(hours_since_harvest),
      distanceKm
    });

    const delayedRisk = computeSpoilageRisk({
      cropType: crop_type,
      volumeKg: Number(volume_kg),
      hoursSinceHarvest: Number(hours_since_harvest) + 3,
      distanceKm
    });

    return NextResponse.json({
      supply: {
        crop_type,
        volume_kg: Number(volume_kg),
        location,
        hours_since_harvest: Number(hours_since_harvest),
        lat: Number(lat),
        lng: Number(lng)
      },
      selectedFacility: {
        id: best.id,
        company: best.company,
        region: best.region,
        address: best.address
      },
      estimatedDistanceKm: distanceKm,
      etaHours,
      spoilageRisk: currentRisk,
      delayedRisk,
      recommendation: recommendationMessage(currentRisk.level)
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to process matching request.", details: error.message },
      { status: 500 }
    );
  }
}
