export const farmLocations = [
  { name: "Baguio, Benguet", lat: 16.4023, lng: 120.596 },
  { name: "Santiago, Isabela", lat: 16.6885, lng: 121.5498 },
  { name: "Meycauayan, Bulacan", lat: 14.7369, lng: 120.9604 },
  { name: "Taguig, Metro Manila", lat: 14.5176, lng: 121.0509 },
  { name: "Davao City, Davao del Sur", lat: 7.1907, lng: 125.4553 }
];

export const demoScenario = {
  crop_type: "tomato",
  volume_kg: 1400,
  location: "Meycauayan, Bulacan",
  hours_since_harvest: 3
};

export function getFarmByName(name) {
  return farmLocations.find((farm) => farm.name === name) ?? farmLocations[0];
}

export function riskBadge(level) {
  if (level === "LOW") return "border-[#2E5E3E]/20 bg-[#2E5E3E]/10 text-[#2E5E3E]";
  if (level === "MEDIUM") return "border-[#F2C14E]/30 bg-[#F2C14E]/20 text-[#8B5E3C]";
  return "border-red-300 bg-red-50 text-red-700";
}
