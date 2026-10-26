import { ardhiDeliveryPhotos, ardhiUnboxingPhotos } from './ardhiDelivery';

// Editorial associations to existing media IDs, not another asset or media registry.
export const ardhiHomecoming = {
  id: 'sp-ardhi-26-homecoming', assetId: 'SP-ARDHI-26',
  title: 'SP-ARDHI-26 HOMECOMING', publisher: 'SmashPro HQ',
  formats: ['photography', 'youtube-long-form', 'youtube-short', 'vertical-social', 'passport-evidence'],
  categories: [
    ['Carrier delivery', [ardhiDeliveryPhotos[0].id!]],
    ['Crate arrival', [ardhiDeliveryPhotos[1].id!]],
    ['Crate inspection', []], ['Opening the crate', [ardhiUnboxingPhotos[0].id!]],
    ['First reveal', [ardhiUnboxingPhotos[1].id!]],
    ['Equipment walkaround', []], ['Factory branding inspection', []],
    ['Included attachments', []], ['Engine identification', []], ['Fluid inspections', []],
    ['First startup', []], ['First movement', []], ['First operator check-in', []], ['First field demonstration', []],
  ].map(([title, mediaIds]) => ({ title: title as string, mediaIds: mediaIds as string[] })),
};

export type CommissioningMilestone = {
  id: string; title: string; status: 'pending' | 'partial' | 'complete'; date: string | null;
  notes: string; photoIds: string[]; videoIds: string[]; inspectionEvidenceIds: string[];
};
// Operator attribution belongs in a protected server record, never this public projection.
// Dates describe supplied evidence, not a fabricated inspection completion date.
export const ardhiCommissioningMilestones: CommissioningMilestone[] = [
  { id: 'delivered', title: 'Delivered', status: 'complete', date: '2026-10-26', notes: 'Owner-confirmed carrier delivery and photographs.', photoIds: ardhiDeliveryPhotos.map(p => p.id!), videoIds: [], inspectionEvidenceIds: [] },
  ...[
    ['receiving-inspection', 'Receiving Inspection'], ['unboxing', 'Unboxing'],
    ['assembly', 'Assembly Verification'], ['engine', 'Engine Inspection'],
    ['hydraulics', 'Hydraulic System Inspection'], ['startup', 'First Startup'],
    ['movement', 'Initial Movement'], ['familiarization', 'Operator Familiarization'],
    ['commissioning', 'Commissioning Complete'], ['field-ready', 'Field Ready'],
    ['customer-deployment', 'First Customer Deployment'],
  ].map(([id, title]): CommissioningMilestone => ({
    id, title, status: id === 'unboxing' ? 'partial' : 'pending',
    date: id === 'unboxing' ? '2026-10-26' : null,
    notes: id === 'unboxing' ? 'Crate opened and panels removed; complete inventory and removal from shipping base remain unverified.' : 'Awaiting documented evidence and review.',
    photoIds: id === 'unboxing' ? ardhiUnboxingPhotos.map(p => p.id!) : [], videoIds: [], inspectionEvidenceIds: [],
  })),
];

// Explicit public readiness snapshot. Only a reviewed release may advance it.
export const ardhiReadiness = { operational: false, rentalReady: false, operatorCheckInEnabled: false } as const;
