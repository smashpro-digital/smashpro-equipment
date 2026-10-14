import type { GalleryImage } from "../types/equipment";
import { equipmentImage as image } from "../lib/equipmentAssets";

/** Evidence received date, not an inferred camera capture date. Originals are byte-preserved. */
const provenance = {
  equipmentId: "SP-NYASI-26", source: "Hailey Li / Supplier", evidenceDate: "2026-10-14",
  lifecycle: "Factory Build Complete", classification: "Supplier Factory Evidence",
  public: true, group: "completed-machine" as const, approvedChannels: ["passport"] as const,
};
export type FactoryEvidenceMedia = GalleryImage & {
  title: string; originalSrc: string; srcSet?: string; equipmentId: string; source: string;
  evidenceDate: string; lifecycle: string; classification: string; public: boolean;
};
const photos = [
  { slug: "front-blade", title: "Front blade and RATO engine", alt: "Green tracked LM500 viewed from above the black front blade, with RATO RV225-XPro engine, lift actuator, light housings and remote controller", caption: "Front blade, lift hardware, tracked chassis and RATO engine are visible. This photograph does not establish functional acceptance." },
  { slug: "rear-controls", title: "Rear controls and remote controller", alt: "Oblique overhead view of the green LM500 showing rear control panel, emergency switch, handheld controller, engine and rubber track", caption: "Rear control panel and supplied controller are visible. Tow hitch installation and machine serial identification are not clearly documented." },
  { slug: "overhead-tracks-engine", title: "Overhead chassis and blade assembly", alt: "Opposite overhead angle of the green tracked mower showing engine, black front blade, actuators and controller on the factory floor", caption: "Assembled platform supplied as NYASI factory evidence. Final decals are not visibly applied; serial/model confirmation remains pending." },
];
export const nyasiFactoryMedia: FactoryEvidenceMedia[] = [
  ...photos.map(photo => {
    const stem = `sp-nyasi-26-factory-${photo.slug}-2026-10-14`;
    return { ...provenance, ...photo, approvedChannels: ["passport"] as ["passport"],
      id: `nyasi-factory-${photo.slug}`, kind: "image" as const,
      src: image(`${stem}-1280.webp`), originalSrc: image(`${stem}-original.jpg`),
      srcSet: [640, 1280].map(w => `${image(`${stem}-${w}.webp`)} ${w}w`).join(", "),
      width: 1280, height: 1707, evidenceCategory: "factory-progress" as const };
  }),
  { ...provenance, approvedChannels: ["passport"], id: "nyasi-factory-remote-demonstration", kind: "video",
    title: "SP-NYASI-26 | Factory Remote-Control Demonstration",
    src: image("sp-nyasi-26-factory-remote-demonstration-2026-10-14.mp4"),
    originalSrc: image("sp-nyasi-26-factory-remote-demonstration-2026-10-14-original.mp4"),
    poster: image("sp-nyasi-26-factory-remote-demonstration-2026-10-14-poster.jpg"),
    width: 540, height: 960, evidenceCategory: "controls",
    alt: "Supplier operates a Microzone C7 controller beside the green LM500 on a factory floor",
    caption: "67-second supplier demonstration: remote movement and turning (approximately 6-15 and 33-42 seconds), blade raising/lowering (43-55 seconds), and illuminated headlights (58-59 seconds). Mowing and full functional acceptance are not demonstrated." },
];
export const nyasiAcceptance = [
  { title: "Visible in factory photographs", detail: "Green finish, rubber tracked chassis, RATO RV225-XPro engine, front blade, blade lift hardware, supplied controller and headlight housings." },
  { title: "Demonstrated in supplier video; acceptance pending", detail: "Remote movement and turning, blade raising/lowering and powered headlights are visible. This is a limited factory demonstration, not a complete remote-function test, safety inspection or SmashPro commissioning." },
  { title: "Awaiting verification", detail: "Mower cutting-system operation, rear tow hitch, final SmashPro decals, machine serial/model identification, final walkaround, formal factory QC and packing evidence." },
  { title: "Future evidence", detail: "Accepted lighting, remote blade and drive tests; mowing demonstration; hitch and branding verification; packing/export preparation; carrier and container details; transit; delivery; commissioning; first field deployment. No future completion dates are assigned." },
];
