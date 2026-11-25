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

export const mzigoPublicLocation = {
  label: "Panama arrived · Canal transit next",
  verification: "Supplier shipment evidence plus public vessel-route context; not cargo-specific live tracking",
  observedAt: "2026-11-25",
  evidenceHref: "#shipping-evidence",
};

export const mzigoLifecycle: FleetLifecycleStage[] = [
  { id: "build-approved", label: "Build Approved", status: "complete", progress: 100, href: "#history-mzigo-build-approved" },
  { id: "final-payment", label: "Final Payment", status: mzigoFinalPayment.status, progress: 100, href: "#history-mzigo-final-payment" },
  { id: "shipping-preparation", label: "Packing Preparation", status: "complete", progress: 100, href: "#mzigo-archive-export-journey" },
  { id: "wooden-crate", label: "Wooden Crate", status: "complete", progress: 100, href: "#history-mzigo-packing" },
  { id: "port-arrival", label: "Qingdao Export Staging", status: "complete", progress: 100, href: "#history-mzigo-qingdao-staging" },
  { id: "freight-booking", label: "Freight Booked", status: "complete", progress: 100, href: "#shipping-evidence" },
  { id: "export-inspection", label: "Export Inspection", status: "pending", progress: 0, href: "#documents" },
  { id: "factory-departure", label: "Factory Handoff Record", status: "complete", progress: 100, href: "#shipping-evidence" },
  { id: "container-loading", label: "Container Loading", status: "pending", progress: 0, href: "#mzigo-archive-export-journey" },
  { id: "vessel-assignment", label: "Vessel Assignment", status: "complete", progress: 100, href: "#shipping-evidence" },
  { id: "ocean-departure", label: "Ocean Departure", status: "complete", progress: 100, href: "#mzigo-archive-export-journey" },
  { id: "ocean-tracking", label: "Ocean Transit", status: "current", progress: 82, href: "#mzigo-archive-export-journey" },
  { id: "us-arrival", label: "U.S. Arrival", status: "pending", progress: 0, href: "#mzigo-archive-delivery" },
  { id: "customs", label: "Customs", status: "pending", progress: 0, href: "#mzigo-archive-delivery" },
  { id: "delivery", label: "Delivery", status: "pending", progress: 0, href: "#mzigo-archive-delivery" },
  { id: "commissioning", label: "Commissioning", status: "pending", progress: 0, href: "#service" },
  { id: "field-validation", label: "Field Validation", status: "pending", progress: 0, href: "#service" },
];

const currentIndex = mzigoLifecycle.findIndex(stage => stage.status === "current");
export const mzigoCurrentStage = mzigoLifecycle[currentIndex].label;
export const mzigoNextStage = mzigoLifecycle[currentIndex + 1].label;
export const mzigoStatusLabel = `Shipped · ${mzigoCurrentStage.toLowerCase()}`;
export const mzigoStatusDetail = "Supplier-confirmed shipment QDOH26100023 remains in ocean transit on the supplier-provided NUE TALOS 1289-045E voyage context. Public vessel observations on November 25 place TALOS at/near Balboa on the Pacific side of the Panama Canal, advancing the route context to Panama arrived with canal transit next. The original supplier ETA of November 28 is retained in history; current vessel schedules support a Savannah window around December 1–2, but Savannah is not cargo-confirmed. Container loading remains pending because port-loading evidence was unavailable. Export inspection, container/B/L, U.S. arrival, customs, delivery, commissioning and field validation remain pending until shipment-specific evidence is received.";
