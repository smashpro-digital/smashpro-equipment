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
    ],
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
    slug: "sp-mzigo-26", publicPath: "/sp-mzigo-26.html", fleetId: "SP-MZIGO-26", name: "Mzigo", category: "Remote-Controlled Electric Material Carrier",
    meaning: "“Mzigo” means load, cargo, or freight in Swahili.", slogan: "Move the earth. Move the load.",
    overview: "A remote-controlled electric material carrier developed to transport material across compact, difficult, or labor-intensive project areas with reduced ground disturbance.",
    capabilityStatement: "Controlled material transport for compact, difficult, and labor-intensive work areas.", heroImage: image("mzigobanner.png"), status: "fleet-build", statusLabel: "Fleet build — availability not announced",
    specifications: [
      { label: "Fleet ID", value: "SP-MZIGO-26", confirmed: true }, { label: "Machine type", value: "Remote-controlled electric material carrier", confirmed: true },
      { label: "Payload", value: "500 kg (1,102 lb)", confirmed: true }, { label: "Drive system", value: "4WD electric", confirmed: true },
      { label: "Dump bed", value: "Hydraulic", confirmed: true }, { label: "Operation", value: "Remote control", confirmed: true },
      { label: "Edition", value: "SmashPro custom green", confirmed: true },
    ],
    capabilities: ["Material transport", "Compact-access hauling", "Loading support", "Remote operation", "Reduced-disturbance movement"],
    idealUses: ["Landscape materials", "Property cleanup", "Construction support", "Brush handling", "Material staging"],
    includedAttachments: ["Hydraulic dump bed"], plannedAttachments: ["Recovery and towing accessories"],
    restrictions: ["Rental availability has not been announced.", "Published payload comes from the preserved approved detail page; operating limits must be confirmed before use."],
    gallery: [{ src: image("mzigobanner.png"), alt: "SP-MZIGO-26 remote-controlled electric material carrier", caption: "SmashPro Fleet build" }],
    requirements: [{ title: "Eligibility", detail: "Contractor approval and account eligibility may be required." }, { title: "Inspection", detail: "Checkout and return inspections will apply when rental access launches." }],
  },
];

export const equipmentByPath = new Map(equipment.map((item) => [item.publicPath, item]));
