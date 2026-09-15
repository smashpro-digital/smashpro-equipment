import type { EvidenceCategory, FactoryUpdate, GalleryImage, MediaPublicationChannel } from "../types/equipment";

const archiveChannels: MediaPublicationChannel[] = ["passport", "equipment-gallery"];
const launchChannels: MediaPublicationChannel[] = ["passport", "equipment-gallery", "marketing-library", "product-brochure", "social-media", "launch-timeline", "qr-pages"];

const photo = (filename: string, alt: string, caption: string, category: EvidenceCategory, width = 1536, height = 1152, capturedAt = "2026-09-09", approvedChannels = archiveChannels): GalleryImage => ({
  id: filename.replace(/\.jpg$/, ""), src: `/equipment/images/${filename}`, alt, caption, capturedAt, width, height, evidenceCategory: category, approvedChannels,
});

export const mzigoFactoryPhotos = {
  identity: photo("sp-mzigo-26e-factory-complete-left-profile-2026-09-09.jpg", "SP-MZIGO-26E completed factory build in SmashPro green, left-side identity and QR graphics", "Fleet identity and QR treatment across the finished green body.", "branding"),
  controls: photo("sp-mzigo-26e-control-panel-2026-09-09.jpg", "SP-MZIGO-26E control panel with factory plate, switches and SmashPro branding", "Factory plate, controls and branded panel between the work lights.", "controls"),
  rear: photo("sp-mzigo-26e-rear-branding-2026-09-09.jpg", "SP-MZIGO-26E rear chassis with SmashPro branding beneath the green dump body", "Rear branding continues the machine's fleet identity.", "branding"),
  drive: photo("sp-mzigo-26e-motor-controller-detail-2026-09-09.jpg", "SP-MZIGO-26E electric motor controller and high-current cabling detail", "Electric drive hardware, controller module and chassis cabling.", "electrical", 1152, 1536),
  raised: photo("sp-mzigo-26e-hydraulic-dump-raised-lights-2026-09-09.jpg", "SP-MZIGO-26E hydraulic dump body raised, exposing the central lift cylinder and chassis hardware with work lights illuminated", "Raised dump body, central lift cylinder and powered work lights.", "hydraulics", 1152, 1536),
  cylinder: photo("sp-mzigo-26e-hydraulic-cylinder-electrical-2026-09-09.jpg", "SP-MZIGO-26E central hydraulic cylinder mounting surrounded by electrical controllers and chassis wiring", "Cylinder mounting and adjacent electrical packaging.", "hydraulics", 1152, 1536),
  pump: photo("sp-mzigo-26e-hydraulic-pump-reservoir-2026-09-09.jpg", "SP-MZIGO-26E hydraulic pump and black reservoir with electrical connections inside the chassis", "Pump, reservoir and electrical connections beneath the dump body.", "hydraulics", 1152, 1536),
  complete: photo("sp-mzigo-26e-factory-complete-three-quarter-2026-09-09.jpg", "Completed SP-MZIGO-26E in SmashPro green showing the dump body, four-wheel stance and fleet graphics", "Factory-complete machine awaiting pre-shipment verification.", "exterior", 1536, 864),
  right: photo("sp-mzigo-26e-factory-complete-right-profile-2026-09-09.jpg", "SP-MZIGO-26E right-side profile showing finished fleet graphics, jobsite tires and electric drive hardware", "Finished side profile with electric drive hardware visible below the body.", "exterior"),
  bedInterior: photo("sp-mzigo-26e-cargo-bed-interior-2026-09-09.jpg", "SP-MZIGO-26E empty green cargo bed viewed from above at the factory", "Inside the finished cargo bed, before the machine enters service.", "interior", 960, 1280),
  raisedLeft: photo("sp-mzigo-26e-raised-bed-left-profile-2026-09-09.jpg", "SP-MZIGO-26E left-side factory view with the dump body raised above the chassis", "Raised-bed side view connecting the body, lift cylinder and four-wheel chassis.", "hydraulics", 1280, 960),
  raisedRight: photo("sp-mzigo-26e-raised-bed-right-profile-2026-09-09.jpg", "SP-MZIGO-26E opposite-side factory view of the raised dump body and exposed lift system", "The opposite raised-bed profile shows the lift geometry and chassis packaging.", "hydraulics", 1280, 960),
  batteries: photo("sp-mzigo-26e-battery-enclosures-2026-09-09.jpg", "SP-MZIGO-26E earlier blue battery enclosures and hydraulic reservoir inside the completed chassis", "Earlier battery-enclosure finish preserved before the later black-box revision.", "electrical", 960, 1280),
  remote: photo("sp-mzigo-26e-remote-controller-2026-09-09.jpg", "Handheld remote controller supplied with SP-MZIGO-26E, showing joysticks, switches and display", "The supplied remote controller: joysticks, switches and display photographed at the factory.", "controls", 960, 1280),
  approvedRaised: photo("sp-mzigo-26e-raised-bed-engineering-overview-2026-09-14.jpg", "SP-MZIGO-26E with the green dump body raised above the black chassis, battery boxes, hydraulic cylinder and electric drive hardware", "Post-revision raised-bed overview documenting maintenance access and installed black components.", "hydraulics", 1280, 960, "2026-09-14", launchChannels),
  tieDown: photo("sp-mzigo-26e-tie-down-anchor-detail-2026-09-14.jpg", "Close factory view of the added green tie-down anchor beneath the SP-MZIGO-26E cargo body", "Installed tie-down anchor detail. No recovery-load rating is inferred.", "exterior", 211, 105, "2026-09-14", archiveChannels),
  blackBoxes: photo("sp-mzigo-26e-black-battery-boxes-hydraulic-power-unit-2026-09-14.jpg", "Two black battery boxes above the SP-MZIGO-26E hydraulic power unit and adjacent electrical hardware", "Black battery-box revision and service-access arrangement beneath the raised body.", "electrical", 960, 1280, "2026-09-14", launchChannels),
  blackWheelDrive: photo("sp-mzigo-26e-black-wheel-drive-motor-2026-09-14.jpg", "Black wheel and tire beside the SP-MZIGO-26E electric drive motor and axle hardware", "Black wheel upgrade with adjacent electric drive hardware and axle assembly.", "electrical", 1280, 960, "2026-09-14", launchChannels),
  approvedProfile: photo("sp-mzigo-26e-build-approved-left-profile-2026-09-15.jpg", "Build-approved SP-MZIGO-26E left profile with black wheels, green dump body, SmashPro logo, fleet decal and QR panel", "Build-approved Founders Edition profile after the black wheel, battery-box and tie-down revisions.", "qc", 1280, 960, "2026-09-15", launchChannels),
} satisfies Record<string, GalleryImage>;

export const mzigoFactoryWalkaround: GalleryImage = {
  id: "sp-mzigo-26e-factory-complete-walkaround-2026-09-09", kind: "video", src: "/equipment/images/sp-mzigo-26e-factory-complete-walkaround-2026-09-09.mp4",
  poster: mzigoFactoryPhotos.complete.src, capturedAt: "2026-09-09", width: 640, height: 360, evidenceCategory: "factory-progress", approvedChannels: archiveChannels,
  alt: "September 9 factory walkaround of the completed SP-MZIGO-26E with the hydraulic dump body raising and lowering",
  caption: "Factory walkaround and hydraulic dump cycle · September 9, 2026. The body raises and lowers in the second half; shipment remains upcoming.",
};

export const mzigoFactoryGallery: GalleryImage[] = [
  ...[mzigoFactoryPhotos.drive, mzigoFactoryPhotos.batteries].map(media => ({ ...media, group: "assembly" as const })),
  ...[mzigoFactoryPhotos.raised, mzigoFactoryPhotos.pump, mzigoFactoryPhotos.cylinder, mzigoFactoryPhotos.raisedLeft, mzigoFactoryPhotos.raisedRight].map(media => ({ ...media, group: "hydraulics" as const })),
  ...[mzigoFactoryPhotos.identity, mzigoFactoryPhotos.controls, mzigoFactoryPhotos.rear].map(media => ({ ...media, group: "branding" as const })),
  ...[mzigoFactoryPhotos.complete, mzigoFactoryPhotos.right, mzigoFactoryPhotos.bedInterior, mzigoFactoryPhotos.remote, mzigoFactoryPhotos.approvedRaised, mzigoFactoryPhotos.tieDown, mzigoFactoryPhotos.blackBoxes, mzigoFactoryPhotos.blackWheelDrive, mzigoFactoryPhotos.approvedProfile, mzigoFactoryWalkaround].map(media => ({ ...media, group: "completed-machine" as const })),
];

export const mzigoFactoryUpdate: FactoryUpdate = {
  date: "2026-09-15", heading: "Build approved · final payment pending",
  description: [
    "The September 14 and 15 factory evidence records the requested black wheels and battery boxes, installed tie-down anchors, retained SmashPro branding and QR identity, and post-revision access to the electric and hydraulic systems.",
    "The supplied production status records quality inspection passed and SmashPro build approval. Final payment, export crating, port delivery, vessel booking and ocean departure remain pending.",
  ],
  images: [mzigoFactoryPhotos.approvedProfile, mzigoFactoryPhotos.approvedRaised], video: mzigoFactoryWalkaround,
  timeline: [
    { label: "Design Approved", status: "completed" }, { label: "Custom Branding Installed", status: "completed" },
    { label: "Quality Inspection Passed", status: "completed" }, { label: "Black Wheel Upgrade", status: "completed" },
    { label: "Black Battery Box", status: "completed" }, { label: "Tie-Down Anchors", status: "completed" },
    { label: "Build Approved by SmashPro", status: "completed" }, { label: "Final Payment", status: "current" },
    { label: "Export Crating", status: "upcoming" }, { label: "Port Delivery", status: "upcoming" },
    { label: "Vessel Booking", status: "upcoming" }, { label: "Ocean Departure", status: "upcoming" },
  ],
};

type MzigoBuildChapter = {
  number: string; date: string; title: string; image: GalleryImage; supporting: GalleryImage[]; video?: GalleryImage;
  narrative: string; verified: string[]; takeaway: string;
};

export const mzigoBuildChapters: MzigoBuildChapter[] = [
  { number: "01", date: "Sep 9, 2026", title: "Factory Identity", image: mzigoFactoryPhotos.identity, supporting: [], narrative: "The completed profile records the machine's installed fleet graphics and green bodywork.", verified: ["SP-MZIGO-26E graphics installed.", "Green dump body and QR graphics visible."], takeaway: "One K600 factory platform carrying its permanent SmashPro fleet identity." },
  { number: "02", date: "Sep 9, 2026", title: "SmashPro Branding", image: mzigoFactoryPhotos.controls, supporting: [mzigoFactoryPhotos.rear], narrative: "Control-panel and rear views connect the operator interface to the machine's identity.", verified: ["Factory plate and switches visible on the control panel.", "SmashPro graphics visible on the rear structure."], takeaway: "The fleet identity continues from the operator controls to the rear of the machine." },
  { number: "03", date: "Sep 9, 2026", title: "Electric Drive Architecture", image: mzigoFactoryPhotos.drive, supporting: [], narrative: "A close-up records the drive hardware and cabling within the chassis.", verified: ["Motor/controller hardware visible.", "Electrical connections and chassis cabling photographed."], takeaway: "The controller and cabling reveal the hardware behind the electric drive." },
  { number: "04", date: "Sep 9 and 14, 2026", title: "Hydraulic Dump System", image: mzigoFactoryPhotos.approvedRaised, supporting: [mzigoFactoryPhotos.pump, mzigoFactoryPhotos.cylinder], narrative: "Raised-bed views connect the lift geometry to the hydraulic power unit and maintenance access.", verified: ["Hydraulic dump body photographed in raised position.", "Central lift cylinder and pump/reservoir assembly visible.", "Post-revision access arrangement documented."], takeaway: "The raised body connects the full-machine view to the pump, reservoir and cylinder details." },
  { number: "05", date: "Sep 14, 2026", title: "Approved Revisions", image: mzigoFactoryPhotos.blackBoxes, supporting: [mzigoFactoryPhotos.blackWheelDrive, mzigoFactoryPhotos.tieDown], narrative: "Close-ups record the black battery boxes, black wheel finish and added tie-down hardware.", verified: ["Black battery boxes installed.", "Black wheel finish installed.", "Tie-down anchor hardware photographed."], takeaway: "The requested finish and securement changes are preserved as as-built evidence." },
  { number: "06", date: "Sep 15, 2026", title: "Build-Approved Machine", image: mzigoFactoryPhotos.approvedProfile, supporting: [], narrative: "The latest profile records the Founders Edition after quality inspection and SmashPro build approval.", verified: ["Completed green body and black wheels photographed.", "SmashPro identity, fleet decal and QR panel remain installed.", "Build approval recorded in the supplied production status."], takeaway: "Factory production is approved; payment and export preparation are the next open stages." },
];
