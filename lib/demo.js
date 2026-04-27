export {
  demoScenario,
  farmSites,
  harvestIntakeFeed,
  urgencyStyles
} from "@/data/operations";

/** Legacy: list of farm names/coords for selects that only need coordinates */
export const farmLocations = [
  { name: "Baguio, Benguet", lat: 16.4023, lng: 120.596 },
  { name: "La Trinidad, Benguet", lat: 16.4454, lng: 120.5877 },
  { name: "Santiago, Isabela", lat: 16.6885, lng: 121.5498 },
  { name: "San Fabian, Pangasinan", lat: 16.0747, lng: 120.4429 },
  { name: "Meycauayan, Bulacan", lat: 14.7369, lng: 120.9604 },
  { name: "Angeles City, Pampanga", lat: 15.1449, lng: 120.5887 },
  { name: "Taguig, Metro Manila", lat: 14.5176, lng: 121.0509 },
  { name: "Davao City, Davao del Sur", lat: 7.1907, lng: 125.4553 }
];

export function getFarmByName(name) {
  return farmLocations.find((farm) => farm.name === name) ?? farmLocations[0];
}

export function riskBadge(level) {
  if (level === "LOW") return "border-[#2E5E3E]/20 bg-[#2E5E3E]/10 text-[#2E5E3E]";
  if (level === "MEDIUM") return "border-[#F2C14E]/30 bg-[#F2C14E]/20 text-[#8B5E3C]";
  return "border-red-300 bg-red-50 text-red-700";
}
