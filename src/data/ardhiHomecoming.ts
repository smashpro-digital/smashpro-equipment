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

// Compatibility projection from the single commissioning checklist; no independent status authority.
export { commissioningChecks as ardhiCommissioningMilestones } from './ardhiFlagship';

// Explicit public readiness snapshot. Only a reviewed release may advance it.
export const ardhiReadiness = { operational: false, rentalReady: false, operatorCheckInEnabled: false } as const;
