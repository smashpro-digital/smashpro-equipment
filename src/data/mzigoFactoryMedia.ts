import type { FactoryUpdate, GalleryImage } from "../types/equipment";

// Original September 9 factory files; names and bytes are preserved in images/.
const photo = (filename: string, alt: string, caption: string, width = 1536, height = 1152): GalleryImage => ({
  src: `/equipment/images/${filename}`, alt, caption, capturedAt: "2026-09-09", width, height,
});

export const mzigoFactoryPhotos = {
  identity: photo("sp-mzigo-26e-factory-complete-left-profile-2026-09-09.jpg", "SP-MZIGO-26E completed factory build in SmashPro green, left-side identity and QR graphics", "Fleet identity and QR treatment across the finished green body."),
  controls: photo("sp-mzigo-26e-control-panel-2026-09-09.jpg", "SP-MZIGO-26E control panel with factory plate, switches and SmashPro branding", "Factory plate, controls and branded panel between the work lights."),
  rear: photo("sp-mzigo-26e-rear-branding-2026-09-09.jpg", "SP-MZIGO-26E rear chassis with SmashPro branding beneath the green dump body", "Rear branding continues the machine’s fleet identity."),
  drive: photo("sp-mzigo-26e-motor-controller-detail-2026-09-09.jpg", "SP-MZIGO-26E electric motor controller and high-current cabling detail", "Electric drive hardware, controller module and chassis cabling.", 1152, 1536),
  raised: photo("sp-mzigo-26e-hydraulic-dump-raised-lights-2026-09-09.jpg", "SP-MZIGO-26E hydraulic dump body raised, exposing the central lift cylinder and chassis hardware with work lights illuminated", "Raised dump body, central lift cylinder and powered work lights.", 1152, 1536),
  cylinder: photo("sp-mzigo-26e-hydraulic-cylinder-electrical-2026-09-09.jpg", "SP-MZIGO-26E central hydraulic cylinder mounting surrounded by electrical controllers and chassis wiring", "Cylinder mounting and adjacent electrical packaging.", 1152, 1536),
  pump: photo("sp-mzigo-26e-hydraulic-pump-reservoir-2026-09-09.jpg", "SP-MZIGO-26E hydraulic pump and black reservoir with electrical connections inside the chassis", "Pump, reservoir and electrical connections beneath the dump body.", 1152, 1536),
  complete: photo("sp-mzigo-26e-factory-complete-three-quarter-2026-09-09.jpg", "Completed SP-MZIGO-26E in SmashPro green showing the dump body, four-wheel stance and fleet graphics", "Factory-complete machine awaiting pre-shipment verification.", 1536, 864),
  right: photo("sp-mzigo-26e-factory-complete-right-profile-2026-09-09.jpg", "SP-MZIGO-26E right-side profile showing finished fleet graphics, jobsite tires and electric drive hardware", "Finished side profile with electric drive hardware visible below the body."),
} satisfies Record<string, GalleryImage>;

export const mzigoFactoryWalkaround: GalleryImage = {
  kind: "video", src: "/equipment/images/sp-mzigo-26e-factory-complete-walkaround-2026-09-09.mp4",
  poster: mzigoFactoryPhotos.complete.src, capturedAt: "2026-09-09", width: 640, height: 360,
  alt: "September 9 factory walkaround of the completed SP-MZIGO-26E",
  caption: "Factory walkaround · September 9, 2026. Final inspection and shipment remain upcoming.",
};

export const mzigoFactoryUpdate: FactoryUpdate = {
  date: "2026-09-09", heading: "Factory build complete",
  description: [
    "The September 9 factory photos and walkaround show SP-MZIGO-26E assembled in SmashPro Custom Green with fleet graphics, branded controls and work lights.",
    "The raised dump body exposes the central hydraulic cylinder, electric drive hardware and chassis packaging. Pre-shipment verification is current; final inspection, ocean freight and U.S. delivery remain upcoming.",
  ],
  images: [mzigoFactoryPhotos.complete, mzigoFactoryPhotos.controls], video: mzigoFactoryWalkaround,
  timeline: [
    { label: "Deposit Paid", status: "completed" }, { label: "Production Started", status: "completed" },
    { label: "Chassis Assembly", status: "completed" }, { label: "Body Assembly", status: "completed" },
    { label: "SmashPro Green Finish", status: "completed" }, { label: "Custom Branding", status: "completed" },
    { label: "Hydraulic Bed Verification", status: "completed" }, { label: "Lighting Verification", status: "completed" },
    { label: "Pre-Shipment Verification", status: "current" }, { label: "Final Inspection", status: "upcoming" },
    { label: "Ocean Freight", status: "upcoming" }, { label: "U.S. Delivery", status: "upcoming" },
  ],
};

export const mzigoBuildChapters = [
  { number: "01", title: "Factory Identity", image: mzigoFactoryPhotos.identity, supporting: [],
    copy: "The K600 platform takes on its SmashPro fleet identity through the finished green body, SP-MZIGO-26E graphics and QR treatment. The side view records those details on the actual factory build." },
  { number: "02", title: "SmashPro Branding", image: mzigoFactoryPhotos.controls, supporting: [mzigoFactoryPhotos.rear],
    copy: "The identity continues across the control face, dump body and rear structure. The factory plate, switches and branded surfaces document a coordinated machine finish rather than a single decal." },
  { number: "03", title: "Electric Drive Architecture", image: mzigoFactoryPhotos.drive, supporting: [],
    copy: "The exposed chassis shows electric drive hardware, controller modules, high-current cabling and battery enclosures. These close-ups document component placement and wiring around the frame without deriving electrical ratings from appearance." },
  { number: "04", title: "Hydraulic Dump System", image: mzigoFactoryPhotos.raised, supporting: [mzigoFactoryPhotos.pump, mzigoFactoryPhotos.cylinder],
    copy: "A central hydraulic lift cylinder supports the raised dump body. The supporting views record its mounting, the pump and reservoir, and nearby electrical hardware. Illuminated work lights are visible in the raised-bed photograph." },
  { number: "05", title: "Factory-Complete Machine", image: mzigoFactoryPhotos.complete, supporting: [mzigoFactoryPhotos.right], video: mzigoFactoryWalkaround,
    copy: "The completed machine brings together a compact four-wheel stance, jobsite tires, electric propulsion hardware, hydraulic dumping and finished SmashPro bodywork. The factory walkaround closes this assembly chapter; pre-shipment verification remains the current stage." },
];
