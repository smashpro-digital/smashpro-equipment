import type { FleetLifecycleStage } from "../components/FleetLifecycleProgress";

export const mzigoObservedSpecLabels = new Set(["Platform", "Manufacturer serial number", "Manufacturer plate rated load", "Vehicle weight", "Production year", "Fleet ID", "Manufacturer", "Machine type", "Drive configuration", "Operation", "Dump bed", "Factory finish"]);

export const mzigoRequests = [
  { title: "Bolt-on fenders and mud guards", status: "Future wishlist", detail: "No fender or mud-guard installation is documented on the Founders Edition." },
  { title: "Tow hitch and rated recovery hooks", status: "Future engineering", detail: "Installed tie-down anchors are not represented as rated recovery points. Hitch and recovery hardware require a controlled design and rating." },
  { title: "Lighting and underglow packages", status: "Future wishlist", detail: "Existing work lights are documented; expanded lighting packages remain future options." },
  { title: "Wheel, tire and accessory packages", status: "Future catalog", detail: "Wider tires and repeatable accessory packages remain unbuilt roadmap items." },
];

// Public-safe projection of the canonical procurement record; no invoice or card data.
export const mzigoFinalPayment = {
  status: "complete" as const,
  completedAt: "2026-10-01",
  evidenceId: "mzigo-final-payment-20261001",
  summary: "Final payment completed on October 1, 2026. The remaining machine balance is paid in full.",
};

export const mzigoLifecycle: FleetLifecycleStage[] = [
  { id: "build-approved", label: "Build Approved", status: "complete", progress: 100, href: "#history-mzigo-build-approved" },
  { id: "final-payment", label: "Final Payment", status: mzigoFinalPayment.status, progress: 100, href: "#history-mzigo-final-payment" },
  { id: "shipping-preparation", label: "Packing Preparation", status: "complete", progress: 100, href: "#mzigo-archive-export-journey" },
  { id: "wooden-crate", label: "Wooden Crate", status: "complete", progress: 100, href: "#history-mzigo-packing" },
  { id: "port-arrival", label: "Qingdao Export Staging", status: "current", progress: 0, href: "#history-mzigo-qingdao-staging" },
  { id: "freight-booking", label: "Freight Booked", status: "pending", progress: 0, href: "#shipping-evidence" },
  { id: "export-inspection", label: "Export Inspection", status: "pending", progress: 0, href: "#documents" },
  { id: "factory-departure", label: "Factory Handoff Record", status: "pending", progress: 0, href: "#shipping-evidence" },
  { id: "container-loading", label: "Container Loading", status: "pending", progress: 0, href: "#mzigo-archive-export-journey" },
  { id: "vessel-assignment", label: "Vessel Assignment", status: "pending", progress: 0, href: "#shipping-evidence" },
  { id: "ocean-departure", label: "Ocean Departure", status: "pending", progress: 0, href: "#mzigo-archive-export-journey" },
  { id: "ocean-tracking", label: "Ocean Transit", status: "pending", progress: 0, href: "#mzigo-archive-export-journey" },
  { id: "us-arrival", label: "U.S. Arrival", status: "pending", progress: 0, href: "#mzigo-archive-delivery" },
  { id: "customs", label: "Customs", status: "pending", progress: 0, href: "#mzigo-archive-delivery" },
  { id: "delivery", label: "Delivery", status: "pending", progress: 0, href: "#mzigo-archive-delivery" },
  { id: "commissioning", label: "Commissioning", status: "pending", progress: 0, href: "#service" },
  { id: "field-validation", label: "Field Validation", status: "pending", progress: 0, href: "#service" },
];

const currentIndex = mzigoLifecycle.findIndex(stage => stage.status === "current");
export const mzigoCurrentStage = mzigoLifecycle[currentIndex].label;
export const mzigoNextStage = mzigoLifecycle[currentIndex + 1].label;
export const mzigoStatusLabel = `Paid in full · ${mzigoCurrentStage.toLowerCase()}`;
export const mzigoStatusDetail = "Paid in full. October 6 photographs document accessories, export-skid preparation and a completed wooden crate. On October 7 the supplier reported the machine at a warehouse at Qingdao Port. Awaiting freight booking / sailing evidence; no container, B/L, vessel, departure date or ETA is confirmed. It has not been verified as shipped by sea, received or commissioned. Rental availability has not been announced.";
