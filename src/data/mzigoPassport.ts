import type { FleetLifecycleStage } from "../components/FleetLifecycleProgress";

export const mzigoObservedSpecLabels = new Set(["Fleet ID", "Manufacturer", "Machine type", "Drive configuration", "Operation", "Dump bed", "Factory finish"]);

export const mzigoRequests = [
  { title: "Bolt-on fenders and mud guards", status: "Future wishlist", detail: "No fender or mud-guard installation is documented on the Founders Edition." },
  { title: "Tow hitch and rated recovery hooks", status: "Future engineering", detail: "Installed tie-down anchors are not represented as rated recovery points. Hitch and recovery hardware require a controlled design and rating." },
  { title: "Lighting and underglow packages", status: "Future wishlist", detail: "Existing work lights are documented; expanded lighting packages remain future options." },
  { title: "Wheel, tire and accessory packages", status: "Future catalog", detail: "Wider tires and repeatable accessory packages remain unbuilt roadmap items." },
];

export const mzigoLifecycle: FleetLifecycleStage[] = [
  { id: "build-approved", label: "Build Approved", status: "complete", progress: 100, href: "#history-mzigo-build-approved" },
  { id: "final-payment", label: "Final Payment", status: "current", progress: 0, href: "#history-mzigo-current" },
  { id: "wooden-crate", label: "Wooden Crate", status: "pending", progress: 0, href: "#mzigo-archive-export-journey" },
  { id: "export-inspection", label: "Export Inspection", status: "pending", progress: 0, href: "#documents" },
  { id: "container-loading", label: "Container Loading", status: "pending", progress: 0, href: "#mzigo-archive-export-journey" },
  { id: "port-arrival", label: "Port Arrival", status: "pending", progress: 0, href: "#mzigo-archive-export-journey" },
  { id: "ocean-departure", label: "Ocean Departure", status: "pending", progress: 0, href: "#mzigo-archive-export-journey" },
  { id: "ocean-tracking", label: "Ocean Tracking", status: "pending", progress: 0, href: "#mzigo-archive-export-journey" },
  { id: "us-arrival", label: "U.S. Arrival", status: "pending", progress: 0, href: "#mzigo-archive-delivery" },
  { id: "customs", label: "Customs", status: "pending", progress: 0, href: "#mzigo-archive-delivery" },
  { id: "delivery", label: "Delivery", status: "pending", progress: 0, href: "#mzigo-archive-delivery" },
  { id: "commissioning", label: "Commissioning", status: "pending", progress: 0, href: "#service" },
];
