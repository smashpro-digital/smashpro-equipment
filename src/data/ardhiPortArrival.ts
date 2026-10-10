import type { GalleryImage } from "../types/equipment";

// Manufacturer confirmation relayed by the owner, recorded October 9, 2026.
// This reviewed public record is distinct from the older HQ vessel feed.
// Neither the receipt date nor a vessel observation is the cargo-arrival date.
export const ardhiPortArrival = {
  assetId: "SP-ARDHI-26",
  factoryModel: "YF380",
  status: "Arrived at U.S. Port",
  mission: "Port Processing",
  currentStage: "Awaiting Customs Clearance",
  location: "U.S. destination port",
  oceanVoyage: "Complete",
  confidence: "Verified",
  source: "Manufacturer confirmation",
  recordedAt: "2026-10-09",
  occurredAt: null,
  summary: "SP-ARDHI-26 has completed its international ocean voyage. The machine has arrived at the U.S. port and is awaiting customs clearance before transfer to the overseas warehouse and final delivery scheduling.",
  nextMilestones: ["Released from Customs", "Transferred to Warehouse", "Delivery Scheduled"],
  package: { dimensions: "2090 × 1100 × 1300 mm", weight: "950 kg (2,095 lb)", verification: "Verified by Manufacturer" },
} as const;

export const ardhiJourneyStages = [
  { id: "planning", label: "Planning", state: "complete" },
  { id: "procurement", label: "Procurement", state: "complete" },
  { id: "production", label: "Production", state: "complete" },
  { id: "export", label: "Export", state: "complete" },
  { id: "ocean", label: "Ocean Voyage", state: "complete" },
  { id: "port", label: "Port Processing", state: "current" },
  { id: "customs", label: "Customs", state: "pending" },
  { id: "warehouse", label: "Warehouse", state: "pending" },
  { id: "delivery", label: "Delivery", state: "pending" },
  { id: "commissioning", label: "Commissioning", state: "pending" },
  { id: "first-job", label: "First Job", state: "pending" },
] as const;
export const ardhiJourneyProgressText = "Port Processing · stage 6 of 11";

export const ardhiPortArrivalPhoto: GalleryImage = {
  id: "ardhi-us-port-arrival",
  src: "/equipment/images/sp-ardhi-26-savannah-port-arrival.png",
  alt: "Wooden freight crates on a trailer in the owner-supplied U.S. port-arrival photograph; the machine is enclosed",
  caption: "Port-arrival photograph supplied with the manufacturer-confirmed arrival of SP-ARDHI-26. The photograph shows crated freight; the machine is enclosed. Capture date not supplied.",
  width: 1279, height: 1706, group: "arrival",
};
