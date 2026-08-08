import type { Equipment, EquipmentSpecification } from "../types/equipment";
import { standardPackageRules } from "./packageRules";

const image = (name: string) => `/equipment/images/${name}`;
const specs = (values: Array<[string, string, string?]>): EquipmentSpecification[] => values.map(([label, value, group], sortOrder) => ({ label, value, group: group ?? "General", confirmed: true, sortOrder }));

export const equipment: Equipment[] = [
  {
    slug: "sp-ardhi-26", publicPath: "/sp-ardhi-26.html", fleetId: "SP-ARDHI-26", name: "Ardhi", category: "Compact Tracked Loader / Mini Skid Steer",
    pronunciation: "AHR-dhee", meaning: "“Ardhi” means earth in Swahili.", slogan: "Power. Precision. Purpose.",
    overview: "The flagship compact loader of the SmashPro Fleet, positioned for landscaping, grading, loading, excavation, pallet handling, and residential access.",
    capabilityStatement: "Compact earthmoving, lifting, landscaping, material handling, and attachment-powered work.", heroImage: image("ardhibanner.png"), status: "fleet-build", statusLabel: "Fleet build — availability not announced",
    identity: { passportId: "SPP-2026-0001", model: "SP-ARDHI-26", edition: "Founder's Edition", finish: "SmashPro Green (RAL 6018)", assetClass: "Compact tracked loader", powertrain: "Internal combustion", modelYear: 2026 },
    specifications: specs([
      ["Fleet ID", "SP-ARDHI-26", "Identity"], ["Manufacturer model reference", "YF380", "Identity"], ["Machine type", "Compact mini skid loader", "Configuration"],
      ["Drive", "Tracked", "Undercarriage"], ["Hydraulics", "Auxiliary quick attach", "Hydraulic system"], ["Factory finish", "Green High Gloss / RAL 6018", "Finish"], ["Factory cure", "195°C × 15 min", "Finish"],
    ]),
    factoryFinish: { paintColor: "Green High Gloss", colorStandard: "RAL 6018", coatingProcess: "Industrial powder-coated finish", factoryCure: "195°C (383°F) for 15 minutes", summary: "Finished in a high-gloss RAL 6018 industrial coating and factory-cured for long-term durability and professional appearance." },
    factoryOptions: [], upgrades: [
      { id: "ardhi-gps", name: "GPS Tracking", category: "Command", description: "Planned location and fleet-security system.", imageUrls: [], status: "planned", tags: ["gps"] },
      { id: "ardhi-solar", name: "Solar Charging", category: "Command", description: "Planned auxiliary solar charging system.", imageUrls: [], status: "planned", tags: ["solar"] },
      { id: "ardhi-rock-lights", name: "Rock Lights", category: "Lighting", description: "Planned equipment lighting upgrade.", imageUrls: [], status: "planned", tags: ["rock lights"] },
      { id: "ardhi-winch", name: "Winch", category: "Recovery", description: "Planned recovery upgrade.", imageUrls: [], status: "planned", tags: ["winch"] },
      { id: "ardhi-camera", name: "Rear Camera", category: "Visibility", description: "Planned rear visibility upgrade.", imageUrls: [], status: "planned", tags: ["rear camera"] },
    ], packageRules: standardPackageRules,
    attachments: [
      { id: "ardhi-bucket", name: "General-purpose bucket", category: "Earthmoving", status: "installed", description: "Documented initial equipment configuration." },
      { id: "ardhi-forks", name: "Pallet forks", category: "Material handling", status: "available", description: "Documented with the initial fleet record." },
      { id: "ardhi-brush-cutter", name: "Brush cutter", category: "Land management", status: "planned" },
      { id: "ardhi-grapple", name: "Grapple", category: "Material handling", status: "planned" },
      { id: "ardhi-rake", name: "Landscape rake", category: "Site finishing", status: "planned" },
    ],
    documents: [], serviceHistory: [],
    timeline: [
      { id: "ardhi-factory-build", kind: "factory-build", title: "Factory build documented", detail: "Assembly, powertrain, hydraulic, and factory test media recorded.", publicDisplay: true },
      { id: "ardhi-current", kind: "status", title: "Current status", detail: "Fleet build — availability not announced.", publicDisplay: true },
    ],
    media: [
      { id: "ardhi-pallet-fork-test", title: "Pallet fork testing", kind: "video", url: image("4235928499026.PNM.mp4"), description: "Production testing with the pallet fork attachment." },
      { id: "ardhi-test", title: "Factory testing", kind: "video", url: image("4231418373820.PNM.mp4") },
      { id: "ardhi-build", title: "Factory build", kind: "video", url: image("4242703936515.mp4") },
    ], scores: { documentation: 0, maintenance: 0 }, valuation: { currency: "USD", status: "pending" },
    capabilities: ["Earthmoving and grading", "Loading and unloading", "Pallet handling", "Tight-access work", "Attachment-powered work"],
    capabilityIds: ["compact_access", "material_handling", "grading", "lifting", "landscape", "cleanup", "pallet_handling"], attachmentIds: ["bucket", "pallet_forks"],
    idealUses: ["Landscape installation", "Property cleanup", "Residential access", "Material staging", "Site preparation"],
    restrictions: ["Rental availability has not been announced.", "Operator eligibility, transport, site access, and attachment approval must be confirmed before use."],
    gallery: [
      { src: image("Alibaba8CB04EF34984AFF4D67CA841BE05F4F6_original.png"), alt: "SP-ARDHI-26 factory side profile", caption: "Factory side profile" },
      { src: image("sideProfile.png"), alt: "SP-ARDHI-26 front branding", caption: "Front branding" },
      { src: image("AlibabaEEC8AE1C3990982EDC0DD061D4AE73BB_original.png"), alt: "SP-ARDHI-26 bucket branding", caption: "Bucket branding" },
      { src: image("4234850804202.PNM.jpg"), alt: "SP-ARDHI-26 charging port", caption: "Charging port" },
      { src: image("4226184114972.PNM.jpg"), alt: "SP-ARDHI-26 on the assembly floor", caption: "Assembly floor" },
      { src: image("4226178255974.PNM.jpg"), alt: "SP-ARDHI-26 powertrain installation", caption: "Powertrain installation" },
      { src: image("4237421509220.PNM.jpg"), alt: "SP-ARDHI-26 hydraulic system", caption: "Hydraulic system" },
      { src: image("4235928499026.PNM.mp4?v=h264-20260807"), alt: "SP-ARDHI-26 testing the pallet fork attachment", caption: "Pallet fork testing", kind: "video" },
      { src: image("4231418373820.PNM.mp4"), alt: "SP-ARDHI-26 factory testing video", caption: "Factory testing", kind: "video" },
      { src: image("4242703936515.mp4"), alt: "SP-ARDHI-26 factory build video", caption: "Factory build", kind: "video" },
    ], requirements: [{ title: "Eligibility", detail: "Contractor approval and account eligibility may be required." }, { title: "Documentation", detail: "Insurance, certification, and rental terms may apply." }],
  },
  {
    slug: "sp-mzigo-26", publicPath: "/sp-mzigo-26.html", fleetId: "SP-MZIGO-26E", name: "Mzigo", category: "Electric Remote-Controlled Material Carrier",
    meaning: "“Mzigo” means load, cargo, or freight in Swahili.", slogan: "Move the Earth. Move the Load.", overview: "SmashPro Fleet’s zero-emission intelligent material carrier, built for modern contractors who need quieter operation, remote-controlled precision, lower maintenance, and professional performance around homes and active job sites.",
    capabilityStatement: "Electric material transport with zero tailpipe emissions, quiet operation, and remote-controlled precision.", heroImage: image("mzigobanner.png"), status: "fleet-build", statusLabel: "Electric fleet build — availability not announced",
    identity: { passportId: "SPP-2026-0002", model: "SP-MZIGO-26E", edition: "Fleet Edition", finish: "SmashPro Green", assetClass: "Remote-controlled material carrier", powertrain: "Electric 4WD", modelYear: 2026 },
    specifications: specs([["Fleet ID", "SP-MZIGO-26E", "Identity"], ["Machine type", "Electric remote-controlled material carrier", "Configuration"], ["Payload", "500 kg (1,102 lb)", "Capacity"], ["Power source", "Electric", "Powertrain"], ["Electric drive system", "4WD electric", "Powertrain"], ["Dump bed", "Hydraulic", "Hydraulics"], ["Operation", "Remote control", "Controls"]]),
    factoryOptions: [], upgrades: [], packageRules: standardPackageRules,
    attachments: [{ id: "mzigo-bed", name: "Hydraulic dump bed", category: "Material handling", status: "installed" }, { id: "mzigo-recovery", name: "Recovery and towing accessories", category: "Fleet support", status: "planned" }],
    documents: [], serviceHistory: [], timeline: [{ id: "mzigo-current", kind: "status", title: "Current status", detail: "Electric fleet build — availability not announced.", publicDisplay: true }], media: [],
    scores: { documentation: 0, maintenance: 0 }, valuation: { currency: "USD", status: "pending" },
    capabilities: ["Fully Electric", "Zero Tailpipe Emissions", "Quiet Operation", "Remote Controlled", "Built for Job Sites", "Ideal Around Homes"], idealUses: ["Landscape materials", "Property cleanup", "Construction support", "Residential-friendly hauling", "Material staging", "Indoor-capable work where site rules permit"],
    capabilityIds: ["material_handling", "landscape", "cleanup"], attachmentIds: ["dump_bed"],
    restrictions: ["Rental availability has not been announced.", "Published payload comes from the preserved approved detail page; operating limits must be confirmed before use.", "Indoor operation requires site-specific approval and compliance with all applicable safety, access, and ventilation requirements."],
    gallery: [{ src: image("mzigobanner.png"), alt: "SP-MZIGO-26E electric remote-controlled material carrier", caption: "SmashPro electric fleet build" }], requirements: [{ title: "Eligibility", detail: "Contractor approval and account eligibility may be required." }, { title: "Inspection", detail: "Checkout and return inspections will apply when rental access launches." }],
  },
];

export const equipmentByPath = new Map(equipment.map((item) => [item.publicPath, item]));
