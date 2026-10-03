import type { FleetLifecycleStage } from "../components/FleetLifecycleProgress";
import type { Equipment } from "../types/equipment";

export type LiftMateEvidenceState = "proposed" | "factory-review" | "approved" | "installed" | "validated";
export interface LiftMateConfigurationItem { id: string; title: string; detail: string; state: LiftMateEvidenceState; }

export const liftmateCaseStudyUrl = "https://smashpro.app/pairon-tools-factory-to-field/";

export const liftmateConfiguration: LiftMateConfigurationItem[] = [
  { id: "finish", title: "Green / black visual treatment", detail: "SmashPro color direction for partner and factory review.", state: "proposed" },
  { id: "badging", title: "SP-LIFTMATE-27 badging", detail: "Fleet identity, SmashPro graphics and equipment decals.", state: "proposed" },
  { id: "task-lighting", title: "White task lighting", detail: "Front and rear work-light concept for controlled visibility testing.", state: "proposed" },
  { id: "visibility", title: "Green visibility lighting", detail: "Accent / underglow concept plus outer-edge visibility markers.", state: "proposed" },
  { id: "wiring", title: "Accessory-ready wiring", detail: "Factory-prepared harness, waterproof connectors and an AUX switch location requested for engineering review.", state: "factory-review" },
  { id: "power", title: "Accessory power provision", detail: "Potential fused 48V supply and 48V-to-12V DC-DC provision; electrical design remains unapproved.", state: "factory-review" },
  { id: "mounting", title: "Mounting and future connections", detail: "Potential mounting points and spare connection for a camera, beacon or telemetry device.", state: "factory-review" },
  { id: "transport", title: "Transport and tie-down review", detail: "Securement points and transport procedure require physical fitment and load review.", state: "factory-review" },
];

export const liftmateLifecycle: FleetLifecycleStage[] = [
  { id: "concept", label: "Concept / partner discussion", status: "complete", progress: 100, href: "#history-liftmate-proposal" },
  { id: "planning", label: "Configuration planning", status: "current", progress: 32, href: "#smashpro-edition" },
  { id: "proof", label: "Factory proof", status: "pending", progress: 0, href: "#media" },
  { id: "authorization", label: "Deposit / build authorization", status: "pending", progress: 0 },
  { id: "production", label: "Production", status: "pending", progress: 0 },
  { id: "finish", label: "Frame / paint / branding", status: "pending", progress: 0 },
  { id: "assembly", label: "Final assembly", status: "pending", progress: 0 },
  { id: "qc", label: "Quality control", status: "pending", progress: 0 },
  { id: "packing", label: "Packing", status: "pending", progress: 0 },
  { id: "shipping", label: "International shipping", status: "pending", progress: 0 },
  { id: "arrival", label: "Arrival", status: "pending", progress: 0 },
  { id: "commissioning", label: "Commissioning", status: "pending", progress: 0 },
  { id: "validation", label: "Field validation", status: "pending", progress: 0, href: "#field-tests" },
  { id: "long-term", label: "Long-term use", status: "pending", progress: 0 },
];

export const liftmateFieldTests = [
  { id: "why", title: "Why this tool", state: "Planned test", detail: "Document the problem, platform selection and evidence boundaries before any acquisition claim." },
  { id: "delivery", title: "Delivery and setup", state: "Planned test", detail: "Record delivery condition, documentation, setup and commissioning checks if the project advances." },
  { id: "rebirth", title: "Project Rebirth workflow", state: "Planned test", detail: "Evaluate supported loading tasks around the F-150 project after commissioning and load-specific review." },
  { id: "mobile", title: "SUV landscape-supply independence", state: "Planned test · Vehicle fitment not yet validated", detail: "Evaluate transport, retailer deployment, reasonable bagged-material loading, securement, return transport, unloading and staging as one evidence-led workflow." },
  { id: "results", title: "Partnership case study / results", state: "Planned test", detail: "Publish verified observations, limitations and long-term follow-up only after the preceding work occurs." },
];

export const liftmateEquipment: Equipment = {
  showroomGroup: "field-fleet", showroomOrder: 4, slug: "sp-liftmate-27", publicPath: "/sp-liftmate-27.html", fleetId: "SP-LIFTMATE-27", name: "LiftMate",
  category: "Pairon Tools Glide200 · Mobile Powered Lifting Platform", manufacturer: "Pairon Tools", meaning: "", slogan: "Same Tough Jobs. Bigger Possibilities.",
  overview: "SP-LIFTMATE-27 is the permanent technical and lifecycle record for a proposed Pairon Tools Glide200 SmashPro Edition. It separates the OEM platform, planned configuration and future validation from completed physical evidence.",
  capabilityStatement: "Proposed mobile powered lifting and truck-bed loading support for controlled SmashPro field evaluation.", heroImage: "/equipment/images/sp-liftmate-27-hero.png",
  status: "planned", statusLabel: "Custom build planning", statusDetail: "Proposal and configuration planning are documented. Partnership activation, deposit, production, acquisition, modification, commissioning and field validation are not complete.",
  identity: { passportId: "SPP-2027-0001", model: "SP-LIFTMATE-27", factoryModel: "Glide200", edition: "Proposed SmashPro Edition", assetClass: "Mobile powered lifting platform", powertrain: "48V LiFePO4 electric", modelYear: 2027 },
  specifications: [
    { label: "Fleet ID", value: "SP-LIFTMATE-27", confirmed: true, group: "Identity", source: "Reserved SmashPro fleet identity", sortOrder: 1 },
    { label: "OEM Model", value: "Glide200", confirmed: true, group: "Identity", source: "Pairon-published product information", sortOrder: 2 },
    { label: "Manufacturer", value: "Pairon Tools", confirmed: true, group: "Identity", source: "Pairon-published product information", sortOrder: 3 },
    { label: "Model Year", value: "2027", confirmed: true, group: "Identity", source: "Reserved SmashPro fleet identity", sortOrder: 4 },
    { label: "Power", value: "48V LiFePO4", confirmed: true, group: "Power", source: "Pairon-published product information" },
    { label: "Approx. full-load cycles", value: "140+ under stated OEM conditions", confirmed: true, group: "Power", source: "Pairon-published product information" },
    { label: "Rated Capacity", value: "440.9 lb published lift capacity", confirmed: true, group: "Capacity", source: "Pairon-published product information" },
    { label: "Machine weight", value: "172.6 lb", confirmed: true, group: "Capacity", source: "Pairon-published product information" },
    { label: "Maximum platform height", value: "50 in", confirmed: true, group: "Dimensions", source: "Pairon-published product information" },
    { label: "Maximum slide length", value: "47.2 in", confirmed: true, group: "Dimensions", source: "Pairon-published product information" },
    { label: "Machine type", value: "Mobile powered lifting platform", confirmed: true, group: "Mobility", source: "SmashPro proposed use classification" },
    { label: "SmashPro configuration", value: "Proposed · factory review pending", confirmed: false, group: "SmashPro Configuration", source: "SmashPro concept and partnership proposal" },
  ],
  factoryOptions: [], upgrades: [{ id: "liftmate-lighting", name: "SmashPro visibility lighting package", category: "Lighting", description: "Proposed green chassis visibility lighting, white task lighting and corner markers for controlled field evaluation.", imageUrls: [], status: "planned", tags: ["lighting", "visibility"] }],
  packageRules: [], attachments: [], includedItems: [], documents: [], serviceHistory: [],
  timeline: [
    { id: "liftmate-proposal", occurredAt: "2026-10-02", kind: "status", title: "Partner build concept documented", detail: "The proposed five-video Pairon Glide200 field partnership and its public/private evidence boundaries were documented. Partnership activation remains pending.", publicDisplay: true },
    { id: "liftmate-passport", occurredAt: "2026-10-02", kind: "status", title: "SP-LIFTMATE-27 passport identity established", detail: "The canonical 2027 SmashPro identity and permanent Passport ID were reserved. No physical machine or installed configuration is represented.", publicDisplay: true },
  ],
  media: [], scores: { documentation: 0, maintenance: 0 }, valuation: { currency: "USD", status: "pending" },
  capabilities: ["Mobile lifting", "Truck-bed loading support", "Material staging", "Field workflow evaluation"], idealUses: ["Loading and unloading approved materials", "Project Rebirth workflow testing", "Controlled visibility evaluation"],
  restrictions: ["Follow current Pairon Tools operating instructions and load-specific guidance.", "Published lift capacity is not a universal operating rating; geometry, center of gravity, lifting points and surface conditions remain part of each use review.", "SmashPro lighting, branding and accessory preparation shown in concept artwork are proposed until approved, installed and validated.", "Vehicle transport and fitment remain unvalidated."],
  gallery: [], requirements: [{ title: "Commissioning", detail: "Physical receipt, OEM documentation review, inspection and field validation are required before operational status." }],
};
