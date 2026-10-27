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
  status: id === 'delivery' ? 'passed' : id === 'engine' || id === 'crate-inspection' || id === 'crate-opened' || id === 'fuel' ? 'in_progress' : id === 'first-start' ? 'needs_attention' : id === 'passport-complete' ? 'blocked' : 'not_started',
  date: ['delivery', 'crate-inspection', 'crate-opened', 'engine', 'fuel', 'first-start'].includes(id) ? '2026-10-26' : null,
  notes: id === 'delivery' ? 'Owner-confirmed carrier delivery and reviewed photographs.' : id === 'crate-inspection' ? 'Crate photographed on delivery; formal damage-free condition inspection not yet verified.' : id === 'engine' ? 'Owner photographed factory YF380 identification plate and 739cc engine. Engine identity documented; engine condition and startup readiness not approved.' : id === 'crate-opened' ? 'Crate opened and panels removed; complete inventory and removal from shipping base remain unverified.' : id === 'fuel' ? 'Owner reports gasoline added; fuel specification and system checks remain unverified.' : id === 'first-start' ? firstStartObservation.summary : 'Awaiting documented inspection and review.',
  evidence: id === 'delivery' ? [{ title: 'Verified October 26 delivery', href: '#history-future-5', state: 'verified' }] : id === 'crate-opened' ? [{ title: 'Crate opening photographs', href: '#history-unboxing-20261026', state: 'verified' }] : id === 'crate-inspection' ? [{ title: 'Delivery crate photographs', href: '#delivery-media', state: 'verified' }] : [],
  photoIds: id === 'delivery' ? ['ardhi-delivery-carrier-and-crate-20261026', 'ardhi-delivery-crate-on-ground-20261026'] : id === 'crate-opened' ? ['ardhi-crate-opened-20261026', 'ardhi-panels-removed-20261026', 'ardhi-tool-case-20261026'] : [],
  videoIds: [], issue: id === 'first-start' ? 'Unsuccessful start; diagnosis unknown.' : null,
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
