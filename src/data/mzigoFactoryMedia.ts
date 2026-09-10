import type { FactoryUpdate, GalleryImage } from "../types/equipment";

// Original September 9 factory files; names and bytes are preserved in images/.
const photo = (filename: string, alt: string, caption: string, width = 1536, height = 1152): GalleryImage => ({
  id: filename.replace(/\.jpg$/, ""), src: `/equipment/images/${filename}`, alt, caption, capturedAt: "2026-09-09", width, height,
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
  bedInterior: photo("sp-mzigo-26e-cargo-bed-interior-2026-09-09.jpg", "SP-MZIGO-26E empty green cargo bed viewed from above at the factory", "Inside the finished cargo bed, before the machine enters service.", 960, 1280),
  raisedLeft: photo("sp-mzigo-26e-raised-bed-left-profile-2026-09-09.jpg", "SP-MZIGO-26E left-side factory view with the dump body raised above the chassis", "Raised-bed side view connecting the body, lift cylinder and four-wheel chassis.", 1280, 960),
  raisedRight: photo("sp-mzigo-26e-raised-bed-right-profile-2026-09-09.jpg", "SP-MZIGO-26E opposite-side factory view of the raised dump body and exposed lift system", "The opposite raised-bed profile shows the lift geometry and chassis packaging.", 1280, 960),
  batteries: photo("sp-mzigo-26e-battery-enclosures-2026-09-09.jpg", "SP-MZIGO-26E blue battery enclosures and hydraulic reservoir inside the completed chassis", "Battery enclosures and hydraulic hardware packaged beneath the dump body.", 960, 1280),
  remote: photo("sp-mzigo-26e-remote-controller-2026-09-09.jpg", "Handheld remote controller supplied with SP-MZIGO-26E, showing joysticks, switches and display", "The supplied remote controller: joysticks, switches and display photographed at the factory.", 960, 1280),
} satisfies Record<string, GalleryImage>;

export const mzigoFactoryWalkaround: GalleryImage = {
  id: "sp-mzigo-26e-factory-complete-walkaround-2026-09-09",
  kind: "video", src: "/equipment/images/sp-mzigo-26e-factory-complete-walkaround-2026-09-09.mp4",
  poster: mzigoFactoryPhotos.complete.src, capturedAt: "2026-09-09", width: 640, height: 360,
  alt: "September 9 factory walkaround of the completed SP-MZIGO-26E with the hydraulic dump body raising and lowering",
  caption: "Factory walkaround and hydraulic dump cycle · September 9, 2026. The body raises and lowers in the second half; final inspection and shipment remain upcoming.",
};

// One canonical gallery entry for each reviewed photograph or video.
export const mzigoFactoryGallery: GalleryImage[] = [
  ...[mzigoFactoryPhotos.drive, mzigoFactoryPhotos.batteries].map(media => ({ ...media, group: "assembly" as const })),
  ...[mzigoFactoryPhotos.raised, mzigoFactoryPhotos.pump, mzigoFactoryPhotos.cylinder, mzigoFactoryPhotos.raisedLeft, mzigoFactoryPhotos.raisedRight].map(media => ({ ...media, group: "hydraulics" as const })),
  ...[mzigoFactoryPhotos.identity, mzigoFactoryPhotos.controls, mzigoFactoryPhotos.rear].map(media => ({ ...media, group: "branding" as const })),
  ...[mzigoFactoryPhotos.complete, mzigoFactoryPhotos.right, mzigoFactoryPhotos.bedInterior, mzigoFactoryPhotos.remote, mzigoFactoryWalkaround].map(media => ({ ...media, group: "completed-machine" as const })),
];

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
    narrative: "The completed profile records the machine's installed fleet graphics and green bodywork.", verified: ["SP-MZIGO-26E graphics installed.", "Green dump body and QR graphics visible."],
    scene: "Meet SP-MZIGO-26E", takeaway: "One K600 factory platform, now carrying its permanent SmashPro fleet identity.",
    copy: "The K600 platform takes on its SmashPro fleet identity through the finished green body, SP-MZIGO-26E graphics and QR treatment. The side view records those details on the actual factory build." },
  { number: "02", title: "SmashPro Branding", image: mzigoFactoryPhotos.controls, supporting: [mzigoFactoryPhotos.rear],
    narrative: "Control-panel and rear views connect the operator interface to the machine's identity.", verified: ["Factory plate and switches visible on the control panel.", "SmashPro graphics visible on the rear structure."],
    scene: "Move closer to the controls", takeaway: "The fleet identity continues from the operator controls to the rear of the machine.",
    copy: "The identity continues across the control face, dump body and rear structure. The factory plate, switches and branded surfaces document a coordinated machine finish rather than a single decal." },
  { number: "03", title: "Electric Drive Architecture", image: mzigoFactoryPhotos.drive, supporting: [],
    narrative: "A close-up records the drive hardware and cabling within the chassis.", verified: ["Motor/controller hardware visible.", "Electrical connections and chassis cabling photographed."],
    scene: "Look beneath the body", takeaway: "The controller and cabling reveal the hardware behind the electric drive.",
    copy: "The exposed chassis shows electric drive hardware, controller modules, high-current cabling and battery enclosures. These close-ups document component placement and wiring around the frame without deriving electrical ratings from appearance." },
  { number: "04", title: "Hydraulic Dump System", image: mzigoFactoryPhotos.raised, supporting: [mzigoFactoryPhotos.pump, mzigoFactoryPhotos.cylinder],
    narrative: "The raised-bed view is paired with close-ups of the lift system's components.", verified: ["Hydraulic dump body photographed in raised position.", "Front work lights photographed powered.", "Central lift cylinder and pump/reservoir assembly visible."],
    scene: "Follow the lift system", takeaway: "The raised body connects the full-machine view to the pump, reservoir and cylinder details.",
    copy: "A central hydraulic lift cylinder supports the raised dump body. The supporting views record its mounting, the pump and reservoir, and nearby electrical hardware. Illuminated work lights are visible in the raised-bed photograph." },
  { number: "05", title: "Factory-Complete Machine", image: mzigoFactoryPhotos.complete, supporting: [mzigoFactoryPhotos.right], video: mzigoFactoryWalkaround,
    narrative: "Completed-machine views and the factory walkaround close the September 9 build record.", verified: ["Finished bodywork, four-wheel stance and installed graphics photographed.", "Factory walkaround supplied with the September 9 media."],
    scene: "Step back. See it together.", takeaway: "The factory build is complete. Inspection and transport remain the next stages.",
    copy: "The completed machine brings together a compact four-wheel stance, jobsite tires, electric propulsion hardware, hydraulic dumping and finished SmashPro bodywork. The factory walkaround closes this assembly chapter; pre-shipment verification remains the current stage." },
];
