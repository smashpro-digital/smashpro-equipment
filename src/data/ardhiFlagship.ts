// Public presentation of the existing SP-ARDHI-26 identity. No operational writes.
// Completion requires an explicit public evidence reference, never elapsed time.
export type PublicEvidence = { title: string; href: string; state: 'pending' | 'verified' };
export function verifiedEvidence(evidence: PublicEvidence[]) {
  return evidence.filter(record => record.state === 'verified' && record.title.trim() && /^(?:\/equipment\/[^\s]+|#history-[\w-]+)$/.test(record.href));
}
export type CommissioningStatus = 'not_started' | 'in_progress' | 'passed' | 'needs_attention' | 'blocked';
// Public editorial projection only. Operator identity and approval audit belong in HQ.
export type CommissioningCheck = {
  id: string; title: string; status: CommissioningStatus; date: string | null; progressLabel?: string;
  notes: string; activity?: string; outstanding?: string;
  evidence: PublicEvidence[]; photoIds: string[]; videoIds: string[];
  issue: string | null; resolution: string | null; approval: 'pending' | 'reviewed';
};
export const firstStartObservation = {
  id: 'ardhi-first-start-attempt-20261026', date: '2026-10-26',
  source: 'Owner report', title: 'First engine-start attempt unsuccessful',
  summary: 'Gasoline was added. The first engine-start attempt was unsuccessful. Diagnosis is unknown; resolution is pending inspection and troubleshooting.',
  missingObservations: ['Cranking behavior', 'Battery condition', 'Fuel level', 'Fuel valve position', 'Choke position', 'Emergency stop', 'Safety interlocks', 'Engine oil level', 'Warning indicators', 'Manufacturer guidance', 'Supporting media', 'Resolution'],
} as const;
// Later owner observations append to, rather than replace, the initial failed attempt.
// No reviewed media, diagnosis, service approval or engine-hour reading was supplied.
export const commissioningObservations = [
  { id: 'ardhi-started-owner-report-20261026', title: 'Engine subsequently started - owner report', summary: 'The machine was positioned on an angle. Additional gasoline was added and the engine subsequently started successfully. This sequence does not establish the cause of the initial failure or a completed repair.' },
  { id: 'ardhi-engine-inspection-owner-report-20261026', title: 'Engine inspection needs service attention', summary: 'Rear panel removed and oil dipstick located. Oil was visible and appeared potentially low; oil level and quantity remain unverified. An unusual hot smell was reported during brief operation. No engine defect is confirmed.' },
  { id: 'ardhi-safety-accessories-owner-report-20261026', title: 'Lights, horn and attachments - owner observations', summary: 'Headlights and horn reportedly worked. Bucket removed; pallet forks assembled and attached; attachments visually inspected. Full safety, attachment locking, load and functional acceptance remain unverified.' },
  { id: 'ardhi-track-observation-owner-report-20261026', title: 'Left rubber track hole reported', summary: 'A hole was observed in the left rubber track. Condition is undiagnosed and the track has not been repaired. Supporting photographs and qualified review are pending.' },
].map(record => ({ ...record, date: '2026-10-26', source: 'Owner report', evidenceState: 'pending' as const }));
export const commissioningLifecycle = 'Delivered October 26 / Field evaluation reported / Open service items';
export const commissioningReadiness = { commissioned: false, operational: false, rentalReady: false } as const;
// Current public progress, separate from formal inspection acceptance. Sources:
// ardhiPostDelivery.json (HQ-reviewed November 1 projection), the November 2
// warranty/parts record and the November 3 owner report. Activity records what
// happened or was reported; outstanding records the specific remaining check.
const currentCheckProgress: Record<string, Partial<CommissioningCheck>> = {
  delivery: { activity: 'Carrier delivery completed October 26, 2026; photographs reviewed.', outstanding: 'None.' },
  'crate-inspection': { progressLabel: 'Photographed · review pending', activity: 'Crate photographed on arrival, October 26.', outstanding: 'Formal damage-free condition sign-off.' },
  'crate-opened': { progressLabel: 'Uncrating complete · review pending', notes: 'Uncrating is complete. A left-track puncture, previously hidden by the pallet, was found after crate removal; the supplier describes sprocket-engagement openings as normal track design and no track warranty claim is confirmed.', activity: 'Crate opened and panels removed October 26; machine has since moved off the shipping base.', outstanding: 'Receiving review; qualified track inspection tracked under Lifetime care.' },
  accessories: { status: 'in_progress', progressLabel: 'In use · acceptance pending', notes: 'Bucket, pallet forks and factory accessories are present and have been used in reported field work.', activity: 'Accessories visually inspected October 26; bucket and forks used in the field (reported).', outstanding: 'Complete inventory acceptance against the packing list.' },
  restraints: { status: 'in_progress', progressLabel: 'Removed · review pending', notes: 'The machine has moved off its shipping base; removal of shipping restraints has not been formally signed off.', activity: 'Field movement reported October 31 confirms the machine is off the shipping base.', outstanding: 'Restraint-removal and shipping-base inspection sign-off.', date: '2026-10-31' },
  engine: { progressLabel: 'Label documented · review pending', notes: 'The factory YF380 plate and engine label are photographed. The label identifies a Runtong 739 cc twin-cylinder gasoline engine. A throttle travel restriction is open under Lifetime care.', activity: 'Identification plate and engine label photographed October 26.', outstanding: 'Manufacturer confirmation of the exact engine model; no engine serial number is recorded.' },
  'engine-oil': { progressLabel: 'Correction reported · baseline pending', notes: 'An overfill was corrected and subsequent operation is reported (October 26 – November 1). The earlier potentially-low observation is preserved.', activity: 'Oil-level correction and continued operation reported through November 1.', outstanding: 'Verified oil level, specification and service baseline.', date: null },
  'hydraulic-fluid': { progressLabel: 'No baseline recorded', notes: 'Hydraulics have operated under load in reported field work; the fluid itself has not been checked.', activity: 'None recorded for the fluid itself.', outstanding: 'Fluid specification, level verification and leak inspection.' },
  fuel: { progressLabel: 'Fueled and operating · checks pending', notes: 'Gasoline was added October 26 and the machine has run multiple reported sessions since.', activity: 'Fueling October 26; reported operation through the field evaluation.', outstanding: 'Fuel specification and fuel-system checks.' },
  battery: { status: 'in_progress', progressLabel: 'Charging and starts reported', notes: 'Battery charging and reliable restarts are reported for October 26 – November 1.', activity: 'Charging and repeated successful starts reported.', outstanding: 'Battery condition and charging-system inspection — successful starts alone do not verify battery health.', date: null },
  safety: { progressLabel: 'Partial checks reported', notes: 'Headlights and horn were reported working October 26. Full safety verification has not been performed.', activity: 'Headlights and horn reported working October 26.', outstanding: 'Interlocks, emergency stop and complete safety-system verification.' },
  'first-start': { status: 'in_progress', progressLabel: 'Milestone reached · starts reported', notes: 'ARDHI first started October 26 after an initial failed attempt, and has started repeatedly through reported field sessions. The milestone has occurred; verification is separate.', activity: 'First successful start October 26; repeated starts reported through November 1.', outstanding: 'Startup-sequence verification and inspection approval; the initial-failure root cause remains undiagnosed.', date: '2026-10-26' },
  hydraulics: { status: 'in_progress', progressLabel: 'Field work reported · acceptance pending', notes: 'Bucket, grading and dirt work are reported, including an October 31 Dirt Day session. The owner identifies the middle lever as auxiliary-hydraulic control; manufacturer confirmation is pending and no float function is claimed.', activity: 'Roughly five operating hours reported, including a 3+ hour session (operator-reported; no verified hour-meter reading).', outstanding: 'Formal function-test acceptance, leak inspection and fluid verification; manufacturer confirmation of control functions.', date: '2026-10-31' },
  'first-drive': { status: 'in_progress', progressLabel: 'Milestone reached · moved Oct 31', notes: 'First movement and grading occurred on the October 31 Dirt Day (operator-reported). The milestone has occurred; travel-system verification is separate.', activity: 'First movement, grading and dirt work reported October 31.', outstanding: 'Travel-system verification and commissioning review.', date: '2026-10-31' },
  'attachment-test': { status: 'needs_attention', progressLabel: 'Pin repair reported · verification pending', notes: 'Bucket work and pallet-fork practice are reported. A quick-change locking pin lost its retaining screw after field use, disabling its spring return; the owner reports the repair completed with an additional screw added to both pins.', activity: 'Owner-reported pin repair on both locking pins (reported November 3; repair date not separately recorded). Replacement M6 dog-point set screws were ordered November 2.', outstanding: 'Independent retention and function verification before loaded attachment work; the replacement screw specification is not manufacturer-approved. Full pallet lifting remains undocumented.', issue: 'Quick-change pin retaining screw lost after Dirt Day; spring return was disabled.', resolution: 'Owner-reported repair with added screws on both pins (November 3 report); verification pending.', date: '2026-11-03' },
  'passport-complete': { progressLabel: 'Blocked · open items', notes: 'No commissioning approval record exists. Open blockers: the throttle travel restriction (cause unverified; replacement cable ordered November 2, not installed), quick-change retention verification, oil and hydraulic-fluid baselines, safety-system verification and receiving sign-offs.', activity: 'None — approval has not been granted.', outstanding: 'Resolve and verify the open items above, then record an explicit approval.' },
};
export const commissioningChecks: CommissioningCheck[] = [
  ['delivery', 'Freight delivery'], ['crate-inspection', 'Crate condition inspection'],
  ['crate-opened', 'Unboxing'], ['accessories', 'Equipment inventory'],
  ['restraints', 'Shipping restraint removal'], ['engine', 'Engine identification'],
  ['engine-oil', 'Engine oil verification'], ['hydraulic-fluid', 'Hydraulic fluid verification'],
  ['fuel', 'Fuel verification'], ['battery', 'Battery inspection'],
  ['safety', 'Safety system inspection'], ['first-start', 'First startup'],
  ['hydraulics', 'Hydraulic function testing'], ['first-drive', 'First movement'],
  ['attachment-test', 'Attachment testing'], ['passport-complete', 'Final commissioning approval'],
].map(([id, title]): CommissioningCheck => ({
  id, title,
  status: id === 'delivery' ? 'passed' : ['engine', 'crate-inspection', 'crate-opened', 'fuel', 'accessories', 'safety', 'attachment-test'].includes(id) ? 'in_progress' : ['first-start', 'engine-oil'].includes(id) ? 'needs_attention' : id === 'passport-complete' ? 'blocked' : 'not_started',
  date: ['delivery', 'crate-inspection', 'engine', 'crate-opened', 'fuel', 'first-start', 'engine-oil', 'accessories', 'safety', 'attachment-test'].includes(id) ? '2026-10-26' : null,
  notes: id === 'delivery' ? 'Owner-confirmed carrier delivery and reviewed photographs.' : id === 'crate-inspection' ? 'Crate photographed on delivery; formal damage-free condition inspection not yet verified.' : id === 'engine' ? 'Owner photographed factory YF380 identification plate and 739cc engine. Engine identity documented; engine condition and startup readiness not approved.' : id === 'crate-opened' ? 'Crate opened and panels removed; complete inventory and removal from shipping base remain unverified.' : id === 'fuel' ? 'Owner reports gasoline added; fuel specification and system checks remain unverified.' : id === 'first-start' ? commissioningObservations[0].summary + ' Service attention and commissioning review remain required.' : id === 'engine-oil' ? 'Operator reports oil-level correction and later restart after charging during October 26 - November 1. Continued observation and inspection approval pending; see post-delivery record.' : ['accessories', 'safety', 'attachment-test'].includes(id) ? commissioningObservations[2].summary : 'Awaiting documented inspection and review.',
  evidence: id === 'delivery' ? [{ title: 'Verified October 26 delivery', href: '#history-future-5', state: 'verified' }] : id === 'crate-opened' ? [{ title: 'Crate opening photographs', href: '#history-unboxing-20261026', state: 'verified' }] : id === 'crate-inspection' ? [{ title: 'Delivery crate photographs', href: '#delivery-media', state: 'verified' }] : [],
  photoIds: id === 'delivery' ? ['ardhi-delivery-carrier-and-crate-20261026', 'ardhi-delivery-crate-on-ground-20261026'] : id === 'crate-opened' ? ['ardhi-crate-opened-20261026', 'ardhi-panels-removed-20261026', 'ardhi-tool-case-20261026'] : [],
  videoIds: [], issue: id === 'first-start' ? 'Initial failed attempt preserved; later restart after charging reported. Inspection approval remains open.' : id === 'engine-oil' ? 'Earlier potentially-low observation superseded by operator-reported overfill and correction. Inspection remains open.' : null,
  resolution: null, approval: 'pending',
  ...currentCheckProgress[id],
}));
export const maintenanceSystems = ['Engine', 'Hydraulics', 'Tracks', 'Battery', 'Filters', 'Grease points', 'Attachments', 'Safety systems'];

// Dated post-delivery findings. Reported items are owner/operator reports, not
// verified inspections. Supplier chat and order screenshots remain private.
export const fieldFindings = [
  { id: 'ardhi-field-hours-20261102', date: '2026-11-02', state: 'Reported', title: 'Initial field evaluation — roughly five reported hours', summary: 'Dirt Day (October 31) and subsequent sessions, including a reported 3+ hour operating session. Durations are operator-reported; no verified hour-meter reading exists.' },
  { id: 'ardhi-throttle-restriction-20261102', date: '2026-11-02', state: 'Open', title: 'Throttle travel restricted', summary: 'After Dirt Day the throttle lever physically stops at roughly half travel. The supplier suggests the cable may be at maximum extension; the actual cause is unverified. A replacement throttle cable kit was ordered November 2 — fitment unverified and not installed. Do not force the lever or alter governor stops.' },
  { id: 'ardhi-quickchange-pin-20261103', date: '2026-11-03', state: 'Owner-reported repair', title: 'Quick-change locking pin repair', summary: 'A locking pin lost its retaining screw after field use, disabling its spring return. The supplier confirmed an M6 thread and replacement dog-point set screws were ordered November 2. The owner reports the repair completed with an additional screw added to both pins (repair date not separately recorded). Independent retention and function verification is pending.' },
] as const;

// Lifetime-care baselines: what is known versus the specific outstanding check.
// Entries without a dated record omit `updated` rather than inventing a date.
export type MaintenanceBaseline = { system: string; updated?: string; known: string; outstanding: string };
export const maintenanceBaselines: MaintenanceBaseline[] = [
  { system: 'Engine', updated: '2026-11-02', known: 'Label documents a Runtong 739 cc twin-cylinder gasoline engine (YF380 plate photographed October 26). Roughly five field hours are operator-reported — no verified hour-meter reading. An oil overfill was corrected (reported); the October 26 hot-smell observation is preserved.', outstanding: 'Throttle travel restricted to about half since Dirt Day — cause unverified; replacement cable ordered November 2, not installed or approved. Verified oil baseline and service intervals await confirmed manufacturer guidance.' },
  { system: 'Hydraulics', updated: '2026-10-31', known: 'Bucket, grading and loader functions have operated under load in reported field sessions. The owner identifies the middle lever as auxiliary-hydraulic control; manufacturer confirmation is pending.', outstanding: 'Fluid specification, level verification, leak inspection and a service baseline. No float capability is claimed.' },
  { system: 'Tracks', updated: '2026-11-02', known: 'A left-track puncture was found at uncrating October 26, previously hidden by the pallet. The supplier describes sprocket-engagement openings as normal track design; no track warranty claim is confirmed (stated coverage: frame, engine and hydraulic pump; consumables excluded).', outstanding: 'Qualified track inspection and monitoring for actual tearing.' },
  { system: 'Battery', updated: '2026-11-01', known: 'Charging and reliable restarts are reported for October 26 – November 1.', outstanding: 'Battery condition and charging-system inspection — successful starts alone do not verify battery health.' },
  { system: 'Filters', known: 'No filter part numbers, locations or service points are documented for the delivered YF380.', outstanding: 'Identify air, oil and hydraulic filters once manual applicability is confirmed; record a service baseline.' },
  { system: 'Grease points', known: 'Grease-point locations and a lubrication schedule are not yet documented for this machine.', outstanding: 'Map grease points from confirmed manufacturer guidance and record the first lubrication.' },
  { system: 'Attachments', updated: '2026-11-03', known: 'Bucket and pallet forks are in reported use. Both quick-change locking pins received an additional retaining screw — an owner-reported repair after one pin lost its screw and spring return.', outstanding: 'Independent retention and function verification before loaded attachment work; the replacement screw specification is not manufacturer-approved.' },
  { system: 'Safety systems', updated: '2026-10-26', known: 'Headlights and horn were reported working October 26.', outstanding: 'Interlocks, emergency stop and full safety-system verification.' },
];

// Single editorial pointer for the service section; details live in the
// commissioning checklist and Lifetime care, not repeated per section.
export const serviceAttention = 'Updated November 2–3: the throttle travel restriction is under investigation (replacement cable ordered, not installed) and the quick-change pin repair is owner-reported with retention verification pending. See the commissioning checklist and Lifetime care for current status.';

export type ServiceEntry = {
  id: string; hours: number; date: string; technician: string;
  photos: PublicEvidence[]; parts: string[]; attachments: string[]; warranty: string;
  evidence: PublicEvidence[];
};
export const serviceEntries: ServiceEntry[] = [];
export type JobRecord = { status: 'planned' | 'completed'; mission: string; evidence: PublicEvidence[] };
export const firstJob: JobRecord = { status: 'planned', mission: 'Awaiting Commissioning', evidence: [] };
export function firstJobPresentation(job: JobRecord, checks: CommissioningCheck[]) {
  const ready = checks.length === commissioningChecks.length && commissioningChecks.every(required => checks.some(check => check.id === required.id && check.status === 'passed' && check.approval === 'reviewed' && verifiedEvidence(check.evidence).length > 0));
  return ready && job.status === 'completed' && verifiedEvidence(job.evidence).length > 0
    ? { title: 'Project 001', mission: job.mission, estimate: 'Completed · documented' }
    : { title: 'First Job', mission: 'Awaiting Commissioning', estimate: 'Coming Soon' };
}

export const missionProfile = [
  { icon: '◎', title: 'Mission', text: 'Bring compact earthmoving and material handling into the SmashPro field fleet.' },
  { icon: '↗', title: 'Primary Work', text: 'Landscape preparation, grading, loading and pallet handling after commissioning.' },
  { icon: '◇', title: 'Business Purpose', text: 'Support repeatable property projects with one versatile attachment platform.' },
  { icon: '▱', title: 'Fleet Role', text: 'Flagship compact tracked loader. A permanent record from factory floor to first job.' },
  { icon: '⌂', title: 'Target Customers', text: 'Planned focus: homeowners, property managers and landscape project partners.' },
  { icon: '⊕', title: 'Expected Attachments', text: 'Begin with the factory-supplied bucket and pallet forks; expand after fitment and installation checks.' },
  { icon: '↔', title: 'Sponsor Opportunities', text: 'Open opportunities for documented attachment trials, field support and service partnerships.' },
  { icon: '⌁', title: 'Future Automation', text: 'Planned fleet telemetry and evidence-linked service reminders. No live telemetry is connected.' },
] as const;

export const missionTimeline = [
  { title: 'Factory', state: 'complete', detail: 'Build and testing documented', href: '#history-production-complete' },
  { title: 'Shipping', state: 'complete', detail: 'Final-mile delivery documented', href: '#journey' },
  { title: 'Delivery', state: 'complete', detail: 'October 26, 2026', href: '#history-future-5' },
  { title: 'Receiving inspection', state: 'current', detail: 'Inspection follow-up open', href: '#commissioning-crate-inspection' },
  { title: 'Field evaluation', state: 'current', detail: 'October 31 operator report', href: '#field-evaluation' },
  ...['Commissioning approval', 'Training', 'First Job', '25 Hours', '50 Hours', '100 Hours', 'Attachments', 'Maintenance', 'Retirement'].map(title => ({ title, state: 'pending', detail: 'Future milestone', href: '#service' })),
];
export const futureAttachments = ['Grapple', 'Brush Cutter', 'Auger', 'Rake', 'Snow Blade', 'Trencher'];

// Factory reference guidance, not commissioning acceptance for this asset.
export const factoryStartupReference = {
  id: 'ardhi-factory-startup-reference-20261027', title: 'Factory startup sequence',
  src: '/equipment/images/sp-ardhi-26-factory-startup-reference-20261027.mp4',
  poster: '/equipment/images/sp-ardhi-26-factory-startup-reference-20261027.jpg',
  receivedAt: '2026-10-27', durationSeconds: 30.488,
  description: 'Factory-supplied demonstration of the control panel, startup and shutdown sequence. The video includes on-screen instructions.',
  applicability: 'Shown on a factory reference machine. Confirm the controls and procedure apply to the delivered YF380. This is guidance, not ARDHI commissioning or inspection acceptance.',
} as const;
