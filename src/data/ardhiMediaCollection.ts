// SP-ARDHI-26 curated public media collection. Single shared manifest for the
// media collection page, passport entry points and prepared editorial stories.
// Captions are factual; reported items are owner/operator reports, not verified
// inspections. Capture dates come from evidence records; unknown stays unknown.
// Originals are retained unmodified; -web/-thumb/-poster files are derivatives.
export type ArdhiJourneyStage = 'factory' | 'shipping' | 'uncrating' | 'field' | 'inspection';
export type ArdhiStoryId = 'factory-floor-to-first-dirt' | 'dirt-day' | 'early-ownership-log';
export type ArdhiMediaEntry = {
  id: string;
  assetId: 'SP-ARDHI-26';
  type: 'image' | 'video';
  /** Original source path (retained, unmodified). */
  source: string;
  /** Optimized derivative shown in the lightbox / article body. */
  web: string;
  /** Grid thumbnail or video poster. */
  thumb: string;
  poster?: string;
  durationSeconds?: number;
  width: number;
  height: number;
  capturedAt: string | 'unknown';
  stage: ArdhiJourneyStage;
  caption: string;
  alt: string;
  story?: ArdhiStoryId;
};
const img = (file: string) => `/equipment/images/${file}`;
const entry = (
  id: string, file: string, width: number, height: number, capturedAt: string | 'unknown',
  stage: ArdhiJourneyStage, caption: string, alt: string, story?: ArdhiStoryId,
): ArdhiMediaEntry => ({
  id, assetId: 'SP-ARDHI-26', type: 'image', source: img(file),
  web: img(file.replace(/\.(jpg|png)$/, '-web.jpg')), thumb: img(file.replace(/\.(jpg|png)$/, '-thumb.jpg')),
  width, height, capturedAt, stage, caption, alt, story,
});
const video = (
  id: string, file: string, poster: string, durationSeconds: number, width: number, height: number,
  capturedAt: string | 'unknown', stage: ArdhiJourneyStage, caption: string, alt: string, story?: ArdhiStoryId,
): ArdhiMediaEntry => ({
  id, assetId: 'SP-ARDHI-26', type: 'video', source: img(file), web: img(file),
  thumb: img(poster), poster: img(poster), durationSeconds, width, height, capturedAt, stage, caption, alt, story,
});

export const ardhiJourneyChapters: { id: ArdhiJourneyStage; title: string; summary: string }[] = [
  { id: 'factory', title: 'Factory build and testing', summary: 'Assembly, hydraulic and powertrain installation and factory function testing at the YF380 line, documented by the manufacturer before export.' },
  { id: 'shipping', title: 'Shipping and arrival', summary: 'Crated export staging in August 2026 and the documented Savannah port arrival that closed the ocean chapter.' },
  { id: 'uncrating', title: 'Uncrating and setup', summary: 'October 26 carrier delivery, crate opening, the 739 cc engine label and first pallet-fork assembly during receiving.' },
  { id: 'field', title: 'Dirt Day and field work', summary: 'October 31 first field session: bucket work, grading and material movement. Operating time is operator-reported, not a verified meter reading.' },
  { id: 'inspection', title: 'Inspection, repairs and improvements', summary: 'Post-field checks: throttle quadrant, pivot points, measurements and the open follow-ups tracked on the passport checklist.' },
];

export const ardhiStories: { id: ArdhiStoryId; title: string; standfirst: string; chapter: ArdhiJourneyStage; status: 'draft' }[] = [
  { id: 'factory-floor-to-first-dirt', title: 'ARDHI: From Factory Floor to First Dirt', standfirst: 'The full documented journey - assembly line, ocean crossing, uncrating and the first bucket of dirt.', chapter: 'factory', status: 'draft' },
  { id: 'dirt-day', title: 'Dirt Day with ARDHI: First Field Work and Lessons Learned', standfirst: 'What the first real session taught us about grading, back dragging and what to check afterwards.', chapter: 'field', status: 'draft' },
  { id: 'early-ownership-log', title: "ARDHI's Early Ownership Log: Inspection, Repairs and Improvements", standfirst: 'A factual log of documented issues, owner-reported repairs and the verification work still open.', chapter: 'inspection', status: 'draft' },
];

export const ardhiMediaCollection: ArdhiMediaEntry[] = [
  // ----- Factory build and testing -----
  entry('ardhi-media-factory-assembly', 'sp-ardhi-26-assembly-in-progress.jpg', 691, 600, 'unknown', 'factory',
    'ARDHI mid-assembly on the factory floor, loader frame and chassis joined before panels and hydraulics.',
    'Partially assembled green YF380 mini skid steer on a factory assembly floor', 'factory-floor-to-first-dirt'),
  entry('ardhi-media-factory-floor', 'sp-ardhi-26-factory-assembly-floor.jpg', 1280, 1707, 'unknown', 'factory',
    'The assembly area where ARDHI came together, photographed by the manufacturer during the build.',
    'Factory assembly area with equipment frames and components', 'factory-floor-to-first-dirt'),
  entry('ardhi-media-powertrain', 'sp-ardhi-26-powertrain-installation.jpg', 1280, 1707, 'unknown', 'factory',
    'Powertrain installation. The engine label later photographed at receiving identifies a Runtong 739 cc twin-cylinder gasoline engine.',
    'Engine and powertrain components being installed in the YF380 chassis', 'factory-floor-to-first-dirt'),
  entry('ardhi-media-hydraulics-install', 'sp-ardhi-26-hydraulic-system-installation.jpg', 1280, 1707, 'unknown', 'factory',
    'Hydraulic system installation on the three-pump YF380 platform.',
    'Hydraulic pumps, hoses and valves being fitted during factory assembly', 'factory-floor-to-first-dirt'),
  entry('ardhi-media-factory-function-test', 'sp-ardhi-26-factory-function-test.jpg', 720, 1280, 'unknown', 'factory',
    'Factory function test with the loader arms raised before export approval.',
    'Completed green mini skid steer raising its loader arms during a factory test'),
  entry('ardhi-media-bucket-branding', 'sp-ardhi-26-bucket-branding.png', 398, 707, 'unknown', 'factory',
    'SmashPro branding applied to the general-purpose bucket at the factory.',
    'Close view of the SmashPro branded bucket', 'factory-floor-to-first-dirt'),
  video('ardhi-media-factory-walkaround-video', 'sp-ardhi-26-factory-build-walkaround.mp4', 'sp-ardhi-26-factory-build-walkaround-poster.jpg', 31.1, 720, 1280, 'unknown', 'factory',
    'Factory walkaround of the completed build before crating.',
    'Video walkaround of the completed green mini skid steer at the factory'),
  video('ardhi-media-factory-departure-video', 'sp-ardhi-26-factory-departure-2026-09-02.mp4', 'sp-ardhi-26-factory-departure-poster-2026-09-02.jpg', 4.4, 540, 960, '2026-09-02', 'factory',
    'September 2: ARDHI leaves the factory for the export journey.',
    'Video of the crated machine departing the factory', 'factory-floor-to-first-dirt'),
  // ----- Shipping and arrival -----
  entry('ardhi-media-shipping-crate-front', 'sp-ardhi-26-shipping-2026-08-21-01.png', 1366, 1024, '2026-08-21', 'shipping',
    'Export staging, August 21: ARDHI strapped to his shipping pallet with bucket and auxiliary couplers visible.',
    'Green mini skid steer secured on a wooden shipping pallet', 'factory-floor-to-first-dirt'),
  entry('ardhi-media-shipping-crate-side', 'sp-ardhi-26-shipping-2026-08-21-02.png', 1024, 1366, '2026-08-21', 'shipping',
    'Side view of the export staging before the crate was sealed.',
    'Side view of the pallet-mounted machine prepared for export'),
  entry('ardhi-media-port-arrival', 'sp-ardhi-26-savannah-port-arrival.png', 1279, 1706, '2026-10-09', 'shipping',
    'Documented Savannah port arrival - the reviewed record that closed the ocean chapter.',
    'Port arrival documentation for SP-ARDHI-26 at Savannah', 'factory-floor-to-first-dirt'),
  // ----- Uncrating and setup -----
  entry('ardhi-media-delivery-crate', 'sp-ardhi-26-delivery-2026-10-26-carrier-and-crate.jpg', 1920, 1440, '2026-10-26', 'uncrating',
    'October 26: R+L Carriers sets the sealed crate on the ground. Delivery day.',
    'Freight truck and wooden equipment crate on the ground at delivery', 'factory-floor-to-first-dirt'),
  entry('ardhi-media-crate-opened', 'sp-ardhi-26-unboxing-2026-10-26-crate-opened.jpg', 1440, 1920, '2026-10-26', 'uncrating',
    'First look inside the crate. The left-track puncture found after crate removal had been hidden by the pallet.',
    'Opened wooden crate revealing the green mini skid steer', 'factory-floor-to-first-dirt'),
  entry('ardhi-media-panels-removed', 'sp-ardhi-26-unboxing-2026-10-26-panels-removed.jpg', 1440, 1920, '2026-10-26', 'uncrating',
    'Crate panels removed; ARDHI still on the shipping base during receiving.',
    'Mini skid steer standing on its shipping base after crate panels were removed'),
  entry('ardhi-media-forks-unboxed', 'sp-ardhi-26-inspection-pallet-forks-unboxed-2026-10-27.jpg', 1440, 1920, '2026-10-27', 'uncrating',
    'October 27: pallet forks unpacked for assembly and inspection.',
    'Pallet fork components laid out after unboxing', 'early-ownership-log'),
  entry('ardhi-media-engine-label', 'sp-ardhi-26-inspection-engine-739cc-2026-10-27.jpg', 1440, 1920, '2026-10-27', 'uncrating',
    'The engine label behind the rear panel: a Runtong 739 cc twin-cylinder gasoline engine. Exact model confirmation is still pending with the manufacturer.',
    'Twin-cylinder gasoline engine with a visible 739cc label', 'early-ownership-log'),
  entry('ardhi-media-forks-mounted', 'sp-ardhi-26-inspection-pallet-forks-mounted-2026-10-27-01.jpg', 1440, 1920, '2026-10-27', 'uncrating',
    'Pallet forks assembled and mounted on the quick-change plate during setup.',
    'Pallet forks mounted on the mini skid steer quick-change plate', 'early-ownership-log'),
  video('ardhi-media-inspection-testing-video', 'sp-ardhi-26-inspection-testing-2026-10-27.mp4', 'sp-ardhi-26-inspection-testing-2026-10-27-poster.jpg', 30.5, 1920, 1080, '2026-10-27', 'uncrating',
    'October 27 receiving checks and first function testing after uncrating.',
    'Video of receiving inspection and function testing in the yard', 'early-ownership-log'),
  // ----- Dirt Day and field work -----
  entry('ardhi-media-field-lead', 'sp-ardhi-26-field-test-2026-10-31-04.jpg', 1440, 1920, '2026-10-31', 'field',
    'Dirt Day, October 31. Dust on every surface after the first real bucket work - exactly how a field machine should end the day.',
    'Dust-covered green mini skid steer facing forward with SmashPro branding on the bucket', 'dirt-day'),
  entry('ardhi-media-field-three-quarter', 'sp-ardhi-26-field-test-2026-10-31-01.jpg', 1920, 1440, '2026-10-31', 'field',
    'On site between passes: mulch staged for the playground area ARDHI helped prepare.',
    'Mini skid steer parked near mulch bags with a playground in the background', 'dirt-day'),
  entry('ardhi-media-field-trail', 'sp-ardhi-26-field-test-2026-10-31-12.jpg', 1440, 1920, '2026-10-31', 'field',
    'Working the wooded trail with the bucket raised. Reported sessions totalled roughly five hours; no verified hour-meter reading exists.',
    'Rear three-quarter view of the dusty machine on a wooded trail with bucket raised', 'dirt-day'),
  entry('ardhi-media-field-profile', 'sp-ardhi-26-field-test-2026-10-31-16.jpg', 1440, 1920, '2026-10-31', 'field',
    'YF380 track badge under a full coat of work dust after grading and material moves.',
    'Side view of the tracked loader showing the YF380 badge on a dusty rubber track', 'dirt-day'),
  entry('ardhi-media-field-worksite', 'sp-ardhi-26-field-test-worksite-2026-10-31.jpg', 1920, 1440, '2026-10-31', 'field',
    'The result: graded ground and fresh mulch across the playground area. Field work is reported activity, not commissioning approval.',
    'Graded yard area covered with fresh red mulch', 'dirt-day'),
  video('ardhi-media-field-video', 'sp-ardhi-26-field-test-2026-10-31.mp4', 'sp-ardhi-26-field-test-2026-10-31-poster.jpg', 6.4, 1920, 1440, '2026-10-31', 'field',
    'A short clip from the October 31 session.',
    'Video clip of the mini skid steer working dirt on October 31', 'dirt-day'),
  video('ardhi-media-first-moves-video', 'sp-ardhi-26-field-test-2026-10-28.mp4', 'sp-ardhi-26-field-test-2026-10-28-poster.jpg', 2.7, 1920, 1080, '2026-10-28', 'field',
    'October 28: first reported movement in the yard before Dirt Day.',
    'Brief video of the machine making its first reported moves in the yard'),
  // ----- Inspection, repairs and improvements -----
  entry('ardhi-media-throttle-quadrant', 'sp-ardhi-26-field-qa-control-panel-2026-10-31.jpg', 1440, 1920, '2026-10-31', 'inspection',
    'The throttle quadrant after Dirt Day. The lever physically stops at roughly half travel; cause unverified, replacement cable ordered November 2 and not yet installed.',
    'Control panel with throttle lever and toothed quadrant, labels for lamp, horn, ignition lock and throttle', 'early-ownership-log'),
  entry('ardhi-media-slew-gear', 'sp-ardhi-26-field-qa-slew-gear-2026-10-31-01.jpg', 1920, 1440, '2026-10-31', 'inspection',
    'Post-field check of drive and pivot hardware under the dust.',
    'Close view of dusty drive gear and pivot hardware', 'early-ownership-log'),
  entry('ardhi-media-cylinder-mount', 'sp-ardhi-26-field-qa-cylinder-mount-2026-10-31.jpg', 1440, 1920, '2026-10-31', 'inspection',
    'Cylinder mount and pin inspection after the first field session.',
    'Hydraulic cylinder mount and retaining pin on the loader arm', 'early-ownership-log'),
  entry('ardhi-media-bushing', 'sp-ardhi-26-field-qa-bushing-2026-10-31.jpg', 1920, 1440, '2026-10-31', 'inspection',
    'Bushing and pivot wear check - building the baseline the maintenance plan needs.',
    'Close view of a pivot bushing on the loader linkage', 'early-ownership-log'),
  entry('ardhi-media-measure-bucket', 'sp-ardhi-26-measurements-2026-10-31-01.jpg', 1920, 1440, '2026-10-31', 'inspection',
    'Measuring the bucket interior while recording baseline dimensions.',
    'Tape measure held across the bucket interior', 'early-ownership-log'),
  entry('ardhi-media-measure-detail', 'sp-ardhi-26-measurements-2026-10-31-06.jpg', 1440, 1920, '2026-10-31', 'inspection',
    'Dimension checks feed the attachment and load planning worksheets.',
    'Tape measure recording an equipment dimension', 'early-ownership-log'),
];

/** Assets reviewed but intentionally not published yet. Kept for the usage map. */
export const ardhiMediaWithheld: { source: string; reason: string }[] = [
  { source: img('sp-ardhi-26-field-test-operator-2026-10-31-01.jpg'), reason: 'Operator identity publication approval pending' },
  { source: img('sp-ardhi-26-field-test-operator-2026-10-31-02.jpg'), reason: 'Operator identity publication approval pending' },
  { source: img('sp-ardhi-26-field-test-operator-2026-10-31-03.jpg'), reason: 'Operator identity publication approval pending' },
  { source: img('sp-ardhi-26-field-test-2026-10-30.mp4'), reason: 'Redundant with the October 31 clip; curation keeps one field video per session' },
];
