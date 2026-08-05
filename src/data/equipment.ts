import type { Equipment } from "../types/equipment";

const image = (name: string) => `/equipment/images/${name}`;

export const equipment: Equipment[] = [
  {
    slug: "sp-ardhi-26", publicPath: "/sp-ardhi-26.html", fleetId: "SP-ARDHI-26", name: "Ardhi", category: "Compact Tracked Loader / Mini Skid Steer",
    pronunciation: "AHR-dhee", meaning: "“Ardhi” means earth in Swahili.", slogan: "Power. Precision. Purpose.",
    overview: "The flagship compact loader of the SmashPro Fleet, positioned for landscaping, grading, loading, excavation, pallet handling, and residential access.",
    capabilityStatement: "Compact earthmoving, lifting, landscaping, material handling, and attachment-powered work.", heroImage: image("ardhibanner.png"), status: "fleet-build", statusLabel: "Fleet build — availability not announced",
    specifications: [
      { label: "Fleet ID", value: "SP-ARDHI-26", confirmed: true }, { label: "Model reference", value: "YF380", confirmed: true },
      { label: "Machine type", value: "Compact mini skid loader", confirmed: true }, { label: "Drive", value: "Tracked", confirmed: true },
      { label: "Hydraulics", value: "Auxiliary quick attach", confirmed: true }, { label: "Edition", value: "SmashPro custom green", confirmed: true },
      { label: "Factory finish", value: "Green High Gloss / RAL 6018", confirmed: true }, { label: "Factory cure", value: "195°C × 15 min", confirmed: true },
    ],
    factoryFinish: {
      paintColor: "Green High Gloss",
      colorStandard: "RAL 6018",
      coatingProcess: "Industrial powder-coated finish",
      factoryCure: "195°C (383°F) for 15 minutes",
      summary: "Finished in a high-gloss RAL 6018 industrial coating and factory-cured for long-term durability and professional appearance.",
    },
    capabilities: ["Earthmoving and grading", "Loading and unloading", "Pallet handling", "Tight-access work", "Attachment-powered work"],
    idealUses: ["Landscape installation", "Property cleanup", "Residential access", "Material staging", "Site preparation"],
    includedAttachments: ["General-purpose bucket", "Pallet forks"], plannedAttachments: ["Brush cutter", "Grapple", "Landscape rake"],
    restrictions: ["Rental availability has not been announced.", "Operator eligibility, transport, site access, and attachment approval must be confirmed before use."],
    gallery: [
      { src: image("Alibaba8CB04EF34984AFF4D67CA841BE05F4F6_original.png"), alt: "SP-ARDHI-26 factory side profile", caption: "Factory side profile" },
      { src: image("sideProfile.png"), alt: "SP-ARDHI-26 front branding", caption: "Front branding" },
      { src: image("AlibabaEEC8AE1C3990982EDC0DD061D4AE73BB_original.png"), alt: "SP-ARDHI-26 bucket branding", caption: "Bucket branding" },
      { src: image("4234850804202.PNM.jpg"), alt: "SP-ARDHI-26 charging port", caption: "Charging port" },
      { src: image("4226184114972.PNM.jpg"), alt: "SP-ARDHI-26 on the assembly floor", caption: "Assembly floor" },
      { src: image("4226178255974.PNM.jpg"), alt: "SP-ARDHI-26 powertrain installation", caption: "Powertrain installation" },
      { src: image("4237421509220.PNM.jpg"), alt: "SP-ARDHI-26 hydraulic system", caption: "Hydraulic system" },
      { src: image("4231418373820.PNM.mp4"), alt: "SP-ARDHI-26 factory testing video", caption: "Factory testing", kind: "video" },
      { src: image("4242703936515.mp4"), alt: "SP-ARDHI-26 factory build video", caption: "Factory build", kind: "video" },
    ],
    requirements: [{ title: "Eligibility", detail: "Contractor approval and account eligibility may be required." }, { title: "Documentation", detail: "Insurance, certification, and rental terms may apply." }],
  },
  {
    slug: "sp-mzigo-26", publicPath: "/sp-mzigo-26.html", fleetId: "SP-MZIGO-26E", name: "Mzigo", category: "Electric Remote-Controlled Material Carrier",
    meaning: "“Mzigo” means load, cargo, or freight in Swahili.", slogan: "Move the Earth. Move the Load.",
    overview: "SmashPro Fleet’s zero-emission intelligent material carrier, built for modern contractors who need quieter operation, remote-controlled precision, lower maintenance, and professional performance around homes and active job sites.",
    capabilityStatement: "Electric material transport with zero tailpipe emissions, quiet operation, and remote-controlled precision.", heroImage: image("mzigobanner.png"), status: "fleet-build", statusLabel: "Electric fleet build — availability not announced",
    specifications: [
      { label: "Fleet ID", value: "SP-MZIGO-26E", confirmed: true }, { label: "Machine type", value: "Electric remote-controlled material carrier", confirmed: true },
      { label: "Payload", value: "500 kg (1,102 lb)", confirmed: true }, { label: "Power source", value: "Electric", confirmed: true },
      { label: "Electric drive system", value: "4WD electric", confirmed: true },
      { label: "Dump bed", value: "Hydraulic", confirmed: true }, { label: "Operation", value: "Remote control", confirmed: true },
      { label: "Edition", value: "SmashPro custom green", confirmed: true },
    ],
    capabilities: ["Fully Electric", "Zero Tailpipe Emissions", "Quiet Operation", "Remote Controlled", "Built for Job Sites", "Ideal Around Homes"],
    idealUses: ["Landscape materials", "Property cleanup", "Construction support", "Residential-friendly hauling", "Material staging", "Indoor-capable work where site rules permit"],
    includedAttachments: ["Hydraulic dump bed"], plannedAttachments: ["Recovery and towing accessories"],
    restrictions: ["Rental availability has not been announced.", "Published payload comes from the preserved approved detail page; operating limits must be confirmed before use.", "Indoor operation requires site-specific approval and compliance with all applicable safety, access, and ventilation requirements."],
    gallery: [{ src: image("mzigobanner.png"), alt: "SP-MZIGO-26E electric remote-controlled material carrier", caption: "SmashPro electric fleet build" }],
    requirements: [{ title: "Eligibility", detail: "Contractor approval and account eligibility may be required." }, { title: "Inspection", detail: "Checkout and return inspections will apply when rental access launches." }],
  },
];

export const equipmentByPath = new Map(equipment.map((item) => [item.publicPath, item]));
