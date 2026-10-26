import type { GalleryImage, TimelineEvent } from '../types/equipment';
import type { EquipmentVideo } from '../types/passportExperience';

// Reviewed owner-supplied delivery confirmation, October 26, 2026.
// This public editorial projection does not write to Digital HQ or Atlas.
export const ardhiDelivery = {
  assetId: 'SP-ARDHI-26', model: 'YF380', date: '2026-10-26',
  status: 'Delivered / Receiving inspection',
  carrier: 'R+L Carriers', pro: 'IACO468333', origin: 'CONVOY USA-SAVANNAH',
  cratedWeight: 'Approximately 950 kg',
  summary: 'ARDHI has arrived. Final-mile delivery was completed on October 26, 2026. Receiving inspection is next; unboxing and commissioning are not yet verified.',
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
  { id: 'ardhi-delivery-carrier-and-crate-20261026', src: '/equipment/images/sp-ardhi-26-delivery-2026-10-26-carrier-and-crate.jpg', alt: 'R+L Carriers truck beside ARDHI’s closed wooden shipping crate resting on the ground', caption: 'October 26, 2026: carrier and grounded shipping crate after final-mile delivery. The machine remains enclosed; this photograph does not establish commissioning.', capturedAt: '2026-10-26', width: 4000, height: 3000, group: 'delivery' },
  { id: 'ardhi-delivery-crate-on-ground-20261026', src: '/equipment/images/sp-ardhi-26-delivery-2026-10-26-crate-on-ground.jpg', alt: 'Side view of ARDHI’s closed shipping crate on the ground next to the delivery truck', caption: 'October 26, 2026: closed crate and pallet base on the ground. Crate inspection, unboxing and contents checks remain pending.', capturedAt: '2026-10-26', width: 3000, height: 4000, group: 'delivery' },
];
// Reviewed projections of existing HQ media records, not a second media inventory.
// Reuse canonical record IDs and YouTube IDs. No invented videos or publish dates.
export const ardhiDeliveryVideos: EquipmentVideo[] = [];
export const ardhiMediaSlots = [
  { id: 'unboxing', title: 'Unboxing', detail: 'Video pending. The crate has not been verified open.' },
  { id: 'first-start', title: 'First startup', detail: 'Video pending. First startup and commissioning are not yet verified.' },
] as const;

export const ardhiDeliveryStages = [
  { title: 'Factory', state: 'complete', detail: 'Build and testing documented', href: '#history-production-complete' },
  { title: 'Ocean', state: 'complete', detail: 'Historical port-arrival evidence retained', href: '#history-port-arrival' },
  { title: 'Delivery', state: 'complete', detail: 'October 26, 2026 · R+L Carriers', href: '#history-future-5' },
  { title: 'Receiving inspection', state: 'current', detail: 'Inspection pending; no readiness claim', href: '#commissioning-crate-inspection' },
  { title: 'Commissioning', state: 'pending', detail: 'Not yet verified', href: '#service' },
] as const;
