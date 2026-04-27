/** Harvest intake feed + farm sites for ColdLink PH Control Tower simulation */

export const harvestIntakeFeed = [
  {
    id: "INT-2026-041",
    crop_type: "tomato",
    volume_kg: 1400,
    location: "Meycauayan, Bulacan",
    lat: 14.7369,
    lng: 120.9604,
    hours_since_harvest: 3,
    reportedAt: "2026-04-28T06:30:00+08:00",
    urgency: "elevated",
    cooperative: "Bulacan Growers Co-op"
  },
  {
    id: "INT-2026-042",
    crop_type: "lettuce",
    volume_kg: 820,
    location: "Baguio, Benguet",
    lat: 16.4023,
    lng: 120.596,
    hours_since_harvest: 5,
    reportedAt: "2026-04-28T07:15:00+08:00",
    urgency: "critical",
    cooperative: "Highland Vegetables Alliance"
  },
  {
    id: "INT-2026-043",
    crop_type: "mango",
    volume_kg: 3200,
    location: "Santiago, Isabela",
    lat: 16.6885,
    lng: 121.5498,
    hours_since_harvest: 2,
    reportedAt: "2026-04-28T07:45:00+08:00",
    urgency: "standard",
    cooperative: "Cagayan Valley Fruits Inc."
  },
  {
    id: "INT-2026-044",
    crop_type: "strawberry",
    volume_kg: 480,
    location: "La Trinidad, Benguet",
    lat: 16.4454,
    lng: 120.5877,
    hours_since_harvest: 4,
    reportedAt: "2026-04-28T08:00:00+08:00",
    urgency: "elevated",
    cooperative: "La Trinidad Berry Co-op"
  },
  {
    id: "INT-2026-045",
    crop_type: "tomato",
    volume_kg: 2100,
    location: "San Fabian, Pangasinan",
    lat: 16.0747,
    lng: 120.4429,
    hours_since_harvest: 6,
    reportedAt: "2026-04-28T08:20:00+08:00",
    urgency: "critical",
    cooperative: "Pangasinan Coastal Farmers"
  },
  {
    id: "INT-2026-046",
    crop_type: "banana",
    volume_kg: 4500,
    location: "Davao City, Davao del Sur",
    lat: 7.1907,
    lng: 125.4553,
    hours_since_harvest: 1,
    reportedAt: "2026-04-28T08:35:00+08:00",
    urgency: "standard",
    cooperative: "Southern Mindanao Traders Guild"
  },
  {
    id: "INT-2026-047",
    crop_type: "tomato",
    volume_kg: 950,
    location: "Taguig, Metro Manila",
    lat: 14.5176,
    lng: 121.0509,
    hours_since_harvest: 2,
    reportedAt: "2026-04-28T09:05:00+08:00",
    urgency: "elevated",
    cooperative: "NCR Metro Produce Hub"
  },
  {
    id: "INT-2026-048",
    crop_type: "lettuce",
    volume_kg: 1100,
    location: "Angeles City, Pampanga",
    lat: 15.1449,
    lng: 120.5887,
    hours_since_harvest: 4,
    reportedAt: "2026-04-28T09:30:00+08:00",
    urgency: "elevated",
    cooperative: "Central Luzon Greens Collective"
  }
];

/** Unique farm markers for map layer */
export const farmSites = harvestIntakeFeed.map((row) => ({
  id: row.id,
  name: row.location,
  lat: row.lat,
  lng: row.lng,
  cooperative: row.cooperative
}));

export const demoScenario = {
  crop_type: harvestIntakeFeed[0].crop_type,
  volume_kg: harvestIntakeFeed[0].volume_kg,
  location: harvestIntakeFeed[0].location,
  hours_since_harvest: harvestIntakeFeed[0].hours_since_harvest
};

export const urgencyStyles = {
  standard: "border-[#2E5E3E]/30 bg-[#2E5E3E]/10 text-[#2E5E3E]",
  elevated: "border-[#F2C14E]/50 bg-[#F2C14E]/25 text-[#8B5E3C]",
  critical: "border-red-300 bg-red-50 text-red-700"
};
