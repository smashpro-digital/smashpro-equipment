// Public presentation of the existing SP-ARDHI-26 identity. No operational writes.
// Completion requires an explicit public evidence reference, never elapsed time.
export type PublicEvidence = { title: string; href: string; state: 'pending' | 'verified' };
export function verifiedEvidence(evidence: PublicEvidence[]) {
  return evidence.filter(record => record.state === 'verified' && record.title.trim() && /^(?:\/equipment\/[^\s]+|#history-[\w-]+)$/.test(record.href));
}
export type CommissioningCheck = { id: string; title: string; evidence: PublicEvidence[] };
export const commissioningChecks: CommissioningCheck[] = [
  ['delivery', 'Delivery'], ['crate-inspection', 'Crate Inspection'], ['crate-opened', 'Crate Opened'],
  ['fluids', 'Fluid Check'], ['battery', 'Battery'], ['hydraulics', 'Hydraulics'], ['engine', 'Engine'],
  ['first-start', 'First Start'], ['first-drive', 'First Drive'], ['photos', 'Photos'],
  ['warranty', 'Warranty'], ['passport-complete', 'Passport Complete'],
].map(([id, title]) => ({ id, title, evidence: [] }));

export type ServiceEntry = {
  id: string; hours: number; date: string; technician: string;
  photos: PublicEvidence[]; parts: string[]; attachments: string[]; warranty: string;
  evidence: PublicEvidence[];
};
export const serviceEntries: ServiceEntry[] = [];
export type JobRecord = { status: 'planned' | 'completed'; mission: string; evidence: PublicEvidence[] };
export const firstJob: JobRecord = { status: 'planned', mission: 'Awaiting Commissioning', evidence: [] };
export function firstJobPresentation(job: JobRecord, checks: CommissioningCheck[]) {
  const ready = checks.length === commissioningChecks.length && commissioningChecks.every(required => checks.some(check => check.id === required.id && verifiedEvidence(check.evidence).length > 0));
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
  { title: 'Shipping', state: 'current', detail: 'Ocean complete · awaiting customs', href: '#journey' },
  ...['Delivery', 'Commissioning', 'Training', 'First Job', '25 Hours', '50 Hours', '100 Hours', 'Attachments', 'Maintenance', 'Retirement'].map(title => ({ title, state: 'pending', detail: 'Future milestone', href: '#service' })),
];
export const futureAttachments = ['Grapple', 'Brush Cutter', 'Auger', 'Rake', 'Snow Blade', 'Trencher'];
