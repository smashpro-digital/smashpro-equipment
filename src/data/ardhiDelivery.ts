import { firstStartObservation } from './ardhiFlagship';
import type { GalleryImage, TimelineEvent } from '../types/equipment';
import type { EquipmentVideo } from '../types/passportExperience';

// Reviewed owner-supplied delivery confirmation, October 26, 2026.
// This public editorial projection does not write to Digital HQ or Atlas.
export const ardhiDelivery = {
  assetId: 'SP-ARDHI-26', model: 'YF380', date: '2026-10-26',
  status: 'Delivered / Receiving inspection',
  carrier: 'R+L Carriers', pro: 'IACO468333', origin: 'CONVOY USA-SAVANNAH',
  cratedWeight: 'Approximately 950 kg',
  summary: 'ARDHI has arrived. Final-mile delivery was completed on October 26, 2026. Crate opening and panel removal are now photographed; receiving inspection and commissioning remain pending.',
  evidence: 'Carrier confirmation and photographs of the wooden shipping crate on the ground, confirmed by the owner on October 26, 2026. Delivery photographs are published below; the carrier confirmation document remains unpublished.',
} as const;

export const ardhiDeliveryEvent: TimelineEvent = {
  id: 'ardhi-delivery-20261026', occurredAt: ardhiDelivery.date, kind: 'delivery',
  title: 'Final-mile delivery complete',
  detail: `${ardhiDelivery.summary} ${ardhiDelivery.evidence}`,
  publicDisplay: true,
};

// Original pixels; public copies remove GPS and private metadata, retain orientation.
// One canonical gallery association per image; History references the gallery.
export const ardhiDeliveryPhotos: GalleryImage[] = [
  { id: 'ardhi-delivery-carrier-and-crate-20261026', src: '/equipment/images/sp-ardhi-26-delivery-2026-10-26-carrier-and-crate.jpg', alt: 'R+L Carriers truck beside ARDHI’s closed wooden shipping crate resting on the ground', caption: 'October 26, 2026: carrier and grounded shipping crate after final-mile delivery. The machine was enclosed at this stage; this photograph does not establish commissioning.', capturedAt: '2026-10-26', width: 4000, height: 3000, group: 'delivery' },
  { id: 'ardhi-delivery-crate-on-ground-20261026', src: '/equipment/images/sp-ardhi-26-delivery-2026-10-26-crate-on-ground.jpg', alt: 'Side view of ARDHI’s closed shipping crate on the ground next to the delivery truck', caption: 'October 26, 2026: closed crate and pallet base on the ground before the documented crate disassembly. Inspection and contents acceptance remain pending.', capturedAt: '2026-10-26', width: 3000, height: 4000, group: 'delivery' },
];
export const ardhiUnboxingPhotos: GalleryImage[] = [
  { id: 'ardhi-crate-opened-20261026', src: '/equipment/images/sp-ardhi-26-unboxing-2026-10-26-crate-opened.jpg', alt: 'ARDHI branding, loader arms and tool case visible inside the opened wooden crate', caption: 'Crate opened: ARDHI is visible inside its wooden packaging. This documents access to the machine, not a passed receiving inspection.', capturedAt: '2026-10-26', width: 3000, height: 4000, group: 'commissioning' },
  { id: 'ardhi-panels-removed-20261026', src: '/equipment/images/sp-ardhi-26-unboxing-2026-10-26-panels-removed.jpg', alt: 'Green and black SP-ARDHI-26 YF380 exposed after crate panels were removed, still resting on its shipping base', caption: 'Panels removed: SP-ARDHI-26 / YF380 remains on the shipping base. Removal from the base, first startup and movement are not established by this photograph.', capturedAt: '2026-10-26', width: 3000, height: 4000, group: 'commissioning' },
  { id: 'ardhi-tool-case-20261026', src: '/equipment/images/sp-ardhi-26-unboxing-2026-10-26-tool-case.jpg', alt: 'Open yellow and black supplied tool case with packaged tools visible', caption: 'Supplied tool case opened and photographed. Complete accessories, spares and attachment inventory remains pending.', capturedAt: '2026-10-26', width: 3000, height: 4000, group: 'commissioning' },
];
export const ardhiUnboxingEvent: TimelineEvent = {
  id: 'ardhi-unboxing-20261026', occurredAt: '2026-10-26', kind: 'status',
  title: 'Crate opened and panels removed',
  detail: 'Owner-supplied photographs document crate opening, panel removal and the supplied tool case. ARDHI remains on its shipping base. Receiving inspection, complete accessories inventory, fluid checks, startup, movement and commissioning remain pending.',
  publicDisplay: true,
};
// Reviewed projections of existing HQ media records, not a second media inventory.
// Reuse canonical record IDs and YouTube IDs. No invented videos or publish dates.
export const ardhiDeliveryVideos: EquipmentVideo[] = [];
export const ardhiMediaSlots = [
  { id: 'unboxing', title: 'Unboxing video', detail: 'Video pending. Crate opening and panel removal are documented in the photo gallery.' },
  { id: 'first-start', title: 'First startup', detail: 'Video pending. First startup and commissioning are not yet verified.' },
] as const;

export const ardhiDeliveryStages = [
  { title: 'Factory', state: 'complete', detail: 'Build and testing documented', href: '#history-production-complete' },
  { title: 'Ocean', state: 'complete', detail: 'Historical port-arrival evidence retained', href: '#history-port-arrival' },
  { title: 'Delivery', state: 'complete', detail: 'October 26, 2026 · R+L Carriers', href: '#history-future-5' },
  { title: 'Receiving inspection', state: 'current', detail: 'Inspection pending; no readiness claim', href: '#commissioning-crate-inspection' },
  { title: 'Commissioning', state: 'pending', detail: 'Not yet verified', href: '#service' },
] as const;

export const ardhiFirstStartEvent: TimelineEvent = {
  id: firstStartObservation.id, occurredAt: firstStartObservation.date, kind: 'status',
  title: firstStartObservation.title, detail: `${firstStartObservation.source}: ${firstStartObservation.summary} Not commissioned; no confirmed engine defect.`, publicDisplay: true,
};
export const ardhiMediaCollections = [
  { id: 'delivery', title: 'Delivery', slots: ['R+L delivery confirmation document - AWAITING MEDIA', 'Freight crate photographs - published below', 'Delivery video - AWAITING MEDIA'], mediaIds: ardhiDeliveryPhotos.map(p => p.id!) },
  { id: 'unboxing', title: 'Unboxing', slots: ['Crate inspection', 'Opening the crate', 'First reveal', 'Equipment walkaround', 'Factory branding', 'Included attachments'], mediaIds: ardhiUnboxingPhotos.map(p => p.id!) },
  { id: 'first-start', title: 'First start', slots: ['Engine inspection - AWAITING MEDIA', 'First startup attempt - AWAITING MEDIA', 'Successful first startup - AWAITING MEDIA', 'Resolution - AWAITING MEDIA'], mediaIds: [] },
  { id: 'commissioning', title: 'Commissioning', slots: ['Fluid inspections', 'Safety inspection', 'First movement', 'Final approval'], mediaIds: [] },
  { id: 'field-tests', title: 'Field tests', slots: ['First operator check-in', 'First field demonstration'], mediaIds: [] },
  { id: 'maintenance', title: 'Maintenance', slots: ['Service inspection', 'Parts and service evidence'], mediaIds: [] },
  { id: 'attachments', title: 'Attachments', slots: ['Fitment inspection', 'Attachment testing'], mediaIds: [] },
];
