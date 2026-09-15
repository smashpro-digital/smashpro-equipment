import type { FleetLifecycleStage } from "../components/FleetLifecycleProgress";

export const mzigoObservedSpecLabels = new Set(["Fleet ID", "Manufacturer", "Machine type", "Drive configuration", "Operation", "Dump bed", "Factory finish"]);

export const mzigoCustomizations = [
  { title: "Electric configuration", status: "Documented", detail: "Electric drive hardware and the supplied remote are recorded in the factory photographs and passport.", anchor: "#media-sp-mzigo-26e-motor-controller-detail-2026-09-09" },
  { title: "SmashPro green finish and identity", status: "Installed", detail: "The green cargo body, SmashPro graphics, SP-MZIGO-26E fleet decal and QR panel remain installed in the September 15 build-approved profile.", anchor: "#media-sp-mzigo-26e-build-approved-left-profile-2026-09-15" },
  { title: "Black wheels and battery boxes", status: "Installed", detail: "The September 14 evidence records both requested black finishes on the completed machine.", anchor: "#media-sp-mzigo-26e-black-battery-boxes-hydraulic-power-unit-2026-09-14" },
  { title: "Tie-down anchors", status: "Installed", detail: "Added anchor hardware is recorded in a dedicated factory close-up. No recovery-load rating is inferred.", anchor: "#media-sp-mzigo-26e-tie-down-anchor-detail-2026-09-14" },
];

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
