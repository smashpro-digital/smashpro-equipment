import type { EvidenceCategory, GalleryImage, MediaPublicationChannel } from "../types/equipment";

export const mzigoEvidenceCategories: Array<{ id: EvidenceCategory; label: string }> = [
  { id: "exterior", label: "Exterior" },
  { id: "interior", label: "Interior" },
  { id: "hydraulics", label: "Hydraulics" },
  { id: "electrical", label: "Electrical" },
  { id: "controls", label: "Controls" },
  { id: "branding", label: "Branding" },
  { id: "factory-progress", label: "Factory Progress" },
  { id: "qc", label: "QC" },
  { id: "shipping", label: "Shipping" },
];

export const mzigoEngineeringCallouts = [
  { title: "Battery boxes", status: "Photographed", detail: "Two black service-access enclosures are documented beneath the raised dump body.", mediaId: "sp-mzigo-26e-black-battery-boxes-hydraulic-power-unit-2026-09-14" },
  { title: "Dual drive motors", status: "Photographed", detail: "Electric drive hardware is visible at the wheel and axle assemblies. Published motor ratings remain manufacturer-stated.", mediaId: "sp-mzigo-26e-black-wheel-drive-motor-2026-09-14" },
  { title: "Motor controllers", status: "Photographed", detail: "Finned controller modules and their chassis placement are preserved in the factory archive.", mediaId: "sp-mzigo-26e-motor-controller-detail-2026-09-09" },
  { title: "Hydraulic dump cylinder", status: "Function documented", detail: "The central lift cylinder is shown supporting the raised cargo body in two dated evidence sets.", mediaId: "sp-mzigo-26e-raised-bed-engineering-overview-2026-09-14" },
  { title: "Hydraulic power unit", status: "Photographed", detail: "The reservoir, pump assembly and adjacent electrical connections are visible below the bed.", mediaId: "sp-mzigo-26e-black-battery-boxes-hydraulic-power-unit-2026-09-14" },
  { title: "Remote controller", status: "Supplied item photographed", detail: "The handheld controller is recorded in the September 9 factory evidence. Range remains pending manufacturer documentation.", mediaId: "sp-mzigo-26e-remote-controller-2026-09-09" },
  { title: "Electrical wiring", status: "Photographed", detail: "High-current cabling and component routing are visible; the images do not establish circuit ratings or final electrical certification.", mediaId: "sp-mzigo-26e-hydraulic-cylinder-electrical-2026-09-09" },
  { title: "Drive axles", status: "Photographed", detail: "Wheel hubs, axle hardware and drive-unit placement are visible in the exposed chassis views.", mediaId: "sp-mzigo-26e-black-wheel-drive-motor-2026-09-14" },
  { title: "Frame construction", status: "Photographed", detail: "The welded steel chassis, body hinge and component supports are documented before and after body completion.", mediaId: "mzigo-chassis-side-20260831" },
  { title: "Tie-down anchors", status: "Installed", detail: "A close factory detail and the completed side profile record the added anchor hardware.", mediaId: "sp-mzigo-26e-tie-down-anchor-detail-2026-09-14" },
  { title: "Recovery points", status: "Future engineering", detail: "No rated recovery point is documented. Future tow hooks must remain separate from the installed tie-down anchors.", mediaId: undefined },
  { title: "Maintenance access", status: "Documented", detail: "Raising the bed exposes the battery enclosures, hydraulic power unit, controller modules and service connections.", mediaId: "sp-mzigo-26e-raised-bed-engineering-overview-2026-09-14" },
];

export const mzigoConfirmedProduction = [
  "Black wheels installed",
  "Black battery boxes installed",
  "Custom SmashPro branding and decals installed",
  "Equipment Passport QR panel installed",
  "Tie-down anchors installed",
  "Quality inspection passed",
  "Build approved by SmashPro",
];

export const mzigoFinalConfiguration = [
  { label: "Fleet identity", value: "SP-MZIGO-26E", evidence: "Permanent Equipment Passport identity" },
  { label: "OEM platform", value: "K600", evidence: "Recorded platform; manufacturer specification sheet pending" },
  { label: "Machine type", value: "Electric remote-controlled material carrier", evidence: "Passport and factory record" },
  { label: "Payload", value: "1,100 lb stated payload", evidence: "Supplier-stated; manufacturer engineering confirmation pending" },
  { label: "Body", value: "SmashPro green cargo body", evidence: "Photographed" },
  { label: "Chassis", value: "Black chassis", evidence: "Photographed" },
  { label: "Wheels", value: "Black wheels and rims", evidence: "Photographed September 14–15" },
  { label: "Battery enclosures", value: "Black battery boxes", evidence: "Photographed September 14" },
  { label: "Material handling", value: "Hydraulic dump body", evidence: "Function photographed and filmed" },
  { label: "Controls", value: "Remote control", evidence: "Supplied controller photographed" },
  { label: "Lighting", value: "Factory work lighting", evidence: "Powered lights photographed" },
  { label: "Identity graphics", value: "SmashPro graphics and Passport QR panel", evidence: "Photographed September 15" },
  { label: "Securement hardware", value: "Bilateral tie-down / rope anchors", evidence: "Factory-installed transport hardware; no recovery rating claimed" },
];

export const mzigoShippingEvidenceSlots = [
  { id: "final-payment", title: "Final payment evidence", status: "Pending", evidence: "Payment receipt or reconciled commercial record", advance: "Closes Final Payment only after evidence is recorded." },
  { id: "commercial-invoice", title: "Final commercial invoice", status: "Pending", evidence: "Final supplier invoice suitable for the private procurement record", advance: "Supports export documentation without publishing confidential terms." },
  { id: "packing-crating", title: "Packing and wooden crate", status: "Pending", evidence: "Packing list plus dated crate photographs", advance: "Advances Wooden Crate only when the unit is identifiable." },
  { id: "factory-departure", title: "Factory departure", status: "Pending", evidence: "Dated handoff or transport record", advance: "Records physical departure from the factory." },
  { id: "freight-booking", title: "Freight booking", status: "Pending", evidence: "Forwarder or carrier booking record", advance: "Records booking without implying loading or departure." },
  { id: "carrier-container", title: "Carrier and container identifiers", status: "Pending", evidence: "Public-safe carrier, booking, container or bill-of-lading references", advance: "Identifiers remain empty until verified and approved for display." },
  { id: "port-milestones", title: "Port milestones", status: "Pending", evidence: "Cargo-specific terminal or port records", advance: "Advances only the milestone supported by the record." },
  { id: "vessel-ocean", title: "Vessel and ocean transit", status: "Pending", evidence: "Cargo-linked vessel/voyage evidence and documented departure", advance: "Vessel context alone does not prove cargo loading or departure." },
  { id: "customs-delivery", title: "Customs and delivery", status: "Pending", evidence: "Import release, inland handoff and signed delivery evidence", advance: "Keeps customs and delivery as separate evidence gates." },
  { id: "commissioning", title: "Commissioning and field validation", status: "Pending", evidence: "Arrival inspection, commissioning checklist and later field records", advance: "No operational readiness or field performance is claimed before completion." },
];

export const mzigoOptionGroups = [
  { title: "Exterior", options: ["Paint", "Wheel color", "Battery box", "Lighting", "Reflective decals", "Branding"] },
  { title: "Recovery", options: ["Tow hooks", "Tow hitch", "Tie-down packages"] },
  { title: "Protection", options: ["Fenders", "Mud guards", "Lighting upgrades"] },
  { title: "Wheels and tires", options: ["Wheel packages", "Wider tire packages"] },
  { title: "Electrical", options: ["Battery upgrades", "Controller upgrades", "Accessory power"] },
  { title: "Fleet technology", options: ["GPS", "Fleet telematics", "NFC"] },
];

export const mzigoMarketSegments = ["Standard", "Commercial", "Fleet", "Government", "Municipal", "Dealer", "Rental", "Prototype"];

export const mzigoRoadmap = [
  { title: "SP-MZIGO-26E · Founders Edition", status: "Production proof-of-concept", detail: "Current fleet asset and as-built evidence source for the platform program." },
  { title: "Commissioning and field validation", status: "Pending", detail: "Arrival inspection, safe operating guidance and real jobsite learning must precede a production release." },
  { title: "SP-MZIGO-27E", status: "Roadmap", detail: "Potential successor informed by the Founders Edition; no build, specification or availability is claimed." },
  { title: "Option packages", status: "Roadmap", detail: "Tow hooks, integrated hitch, factory fenders, lighting, accessories and commercial, dealer and government packages remain future work." },
];

export const mzigoCollaboration = {
  partner: "Shandong Kylin Heavy Industry Machinery Co., Ltd.",
  summary: "The Founders Edition records a responsive factory collaboration around paint, branding, wheels and practical hardware changes.",
  lessons: ["Renderings make requested changes easier to review.", "Production photographs support both acceptance and launch preparation.", "Visual mockups make engineering discussions more precise.", "Repeat builds should move toward controlled option packages."],
  capabilities: ["Custom branding", "Custom paint", "Wheel changes", "Future engineering collaboration", "Future catalog-option development"],
};

export const mzigoSystemLinks = [
  { system: "Equipment Passport", status: "Active", detail: "Public identity, approved evidence and lifecycle record." },
  { system: "SmashPro Product Catalog", status: "Active foundation", detail: "SP-MTC-001 defines the product platform separately from this fleet asset." },
  { system: "Digital HQ", status: "Contract boundary", detail: "Future operational synchronization must use the canonical fleet and catalog IDs." },
  { system: "Equipment Registry / Fleet Registry", status: "Canonical identity", detail: "SPP-2026-0002 and SP-MZIGO-26E remain the permanent unit references." },
  { system: "SPGo", status: "Future consumer", detail: "Maintenance, inspection and availability data remain pending supported integration." },
  { system: "GPS / NFC", status: "Future", detail: "No telemetry or NFC record is published for this unit." },
];

export const mzigoPublicationChannels: Array<{ id: MediaPublicationChannel; label: string }> = [
  { id: "passport", label: "Equipment Passport" },
  { id: "equipment-gallery", label: "Equipment Gallery" },
  { id: "marketing-library", label: "Marketing Library" },
  { id: "product-brochure", label: "Product Brochure" },
  { id: "social-media", label: "Social Media Assets" },
  { id: "launch-timeline", label: "Launch Timeline" },
  { id: "qr-pages", label: "QR Pages" },
];

export function approvedMzigoMedia(gallery: GalleryImage[], channel: MediaPublicationChannel) {
  return gallery.filter(media => media.approvedChannels?.includes(channel));
}
