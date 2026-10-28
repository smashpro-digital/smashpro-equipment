// Public presentation of the existing SP-ARDHI-26 identity. No operational writes.
// Completion requires an explicit public evidence reference, never elapsed time.
export type PublicEvidence = { title: string; href: string; state: 'pending' | 'verified' };
export function verifiedEvidence(evidence: PublicEvidence[]) {
  return evidence.filter(record => record.state === 'verified' && record.title.trim() && /^(?:\/equipment\/[^\s]+|#history-[\w-]+)$/.test(record.href));
}
export type CommissioningStatus = 'not_started' | 'in_progress' | 'passed' | 'needs_attention' | 'blocked';
// Public editorial projection only. Operator identity and approval audit belong in HQ.
export type CommissioningCheck = {
  id: string; title: string; status: CommissioningStatus; date: string | null;
  notes: string; evidence: PublicEvidence[]; photoIds: string[]; videoIds: string[];
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
export const commissioningLifecycle = 'Delivered / Receiving inspection / Commissioning in progress / Service attention required';
export const commissioningReadiness = { commissioned: false, operational: false, rentalReady: false } as const;
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
  notes: id === 'delivery' ? 'Owner-confirmed carrier delivery and reviewed photographs.' : id === 'crate-inspection' ? 'Crate photographed on delivery; formal damage-free condition inspection not yet verified.' : id === 'engine' ? 'Owner photographed factory YF380 identification plate and 739cc engine. Engine identity documented; engine condition and startup readiness not approved.' : id === 'crate-opened' ? 'Crate opened and panels removed; complete inventory and removal from shipping base remain unverified.' : id === 'fuel' ? 'Owner reports gasoline added; fuel specification and system checks remain unverified.' : id === 'first-start' ? commissioningObservations[0].summary + ' Service attention and commissioning review remain required.' : id === 'engine-oil' ? commissioningObservations[1].summary : ['accessories', 'safety', 'attachment-test'].includes(id) ? commissioningObservations[2].summary : 'Awaiting documented inspection and review.',
  evidence: id === 'delivery' ? [{ title: 'Verified October 26 delivery', href: '#history-future-5', state: 'verified' }] : id === 'crate-opened' ? [{ title: 'Crate opening photographs', href: '#history-unboxing-20261026', state: 'verified' }] : id === 'crate-inspection' ? [{ title: 'Delivery crate photographs', href: '#delivery-media', state: 'verified' }] : [],
  photoIds: id === 'delivery' ? ['ardhi-delivery-carrier-and-crate-20261026', 'ardhi-delivery-crate-on-ground-20261026'] : id === 'crate-opened' ? ['ardhi-crate-opened-20261026', 'ardhi-panels-removed-20261026', 'ardhi-tool-case-20261026'] : [],
  videoIds: [], issue: id === 'first-start' ? 'Initial failed attempt preserved; later start reported, hot smell unresolved.' : id === 'engine-oil' ? 'Potentially low oil; level and quantity unverified.' : null,
  resolution: null, approval: 'pending',
}));
export const maintenanceSystems = ['Engine', 'Hydraulics', 'Tracks', 'Battery', 'Filters', 'Grease points', 'Attachments', 'Safety systems'];

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
  { title: 'Receiving inspection', state: 'current', detail: 'Inspection pending', href: '#commissioning-crate-inspection' },
  ...['Commissioning', 'Training', 'First Job', '25 Hours', '50 Hours', '100 Hours', 'Attachments', 'Maintenance', 'Retirement'].map(title => ({ title, state: 'pending', detail: 'Future milestone', href: '#service' })),
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
