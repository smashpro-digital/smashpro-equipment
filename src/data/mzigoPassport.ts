import type { FleetLifecycleStage } from "../components/FleetLifecycleProgress";

export const mzigoObservedSpecLabels = new Set(["Fleet ID", "Manufacturer", "Machine type", "Drive configuration", "Operation", "Dump bed", "Factory finish"]);

export const mzigoCustomizations = [
  { title: "Electric configuration", status: "Documented", detail: "Electric drive hardware and the supplied remote are recorded in the factory photographs and passport.", anchor: "#media-sp-mzigo-26e-motor-controller-detail-2026-09-09" },
  { title: "SmashPro green finish", status: "Photographed", detail: "The green cargo body and control face are visible in the September 9 factory evidence. A coating process or exact color standard is not inferred.", anchor: "#media-sp-mzigo-26e-factory-complete-three-quarter-2026-09-09" },
  { title: "Supplied logos and fleet name", status: "Photographed", detail: "SmashPro graphics and SP-MZIGO-26E identify the actual machine. Brand artwork is design input, not proof of installed options.", anchor: "#media-sp-mzigo-26e-factory-complete-left-profile-2026-09-09" },
];

export const mzigoRequests = [
  { title: "QR removal", status: "Awaiting revised evidence", detail: "Removal is a buyer-directed change. QR graphics remain visible in the September 9 photographs; no later factory confirmation is on file." },
  { title: "Red component / plate to green", status: "Change recorded; verification open", detail: "The buyer records a red-to-green change. The exact component and completed revision still need matching factory evidence." },
  { title: "Black battery box", status: "Requested", detail: "A black box was requested. The available factory views show blue battery enclosures; the final color is unconfirmed." },
  { title: "Fenders", status: "Explored / requested", detail: "Fender options were discussed. Installation is not confirmed by the available factory record." },
  { title: "Wider tires and hitch", status: "Future configuration ideas", detail: "Options were explored for a possible future configuration. Neither is recorded as installed; rendered underglow is also not production evidence." },
];

export const mzigoLifecycle: FleetLifecycleStage[] = [
  { id: "build", label: "Factory build", status: "complete", progress: 100, href: "#history-mzigo-factory-complete" },
  { id: "verification", label: "Pre-shipment verification", status: "current", progress: 0, href: "#verification" },
  { id: "inspection", label: "Final inspection", status: "pending", progress: 0, href: "#documents" },
  { id: "shipping", label: "Ocean freight", status: "pending", progress: 0, href: "#mzigo-archive-export-journey" },
  { id: "delivery", label: "U.S. delivery", status: "pending", progress: 0, href: "#mzigo-archive-delivery" },
  { id: "commissioning", label: "Commissioning", status: "pending", progress: 0, href: "#service" },
];
