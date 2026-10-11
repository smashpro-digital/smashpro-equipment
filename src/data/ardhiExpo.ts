export const ardhiCanonicalUrl = 'https://smashpro.app/equipment/sp-ardhi-26.html';
export const ardhiExpoUrl = `${ardhiCanonicalUrl}?expo=true`;
export const partnershipUrl = 'https://smashpro.app/contact';
export const isExpoSearch = (search: string) => ['true', '1'].includes(new URLSearchParams(search).get('expo') ?? '');
export const opportunities = [
  { id: 'gps', title: 'GPS', status: 'Available', mission: 'Document location context from yard to field through a reviewed Atlas integration.' },
  { id: 'camera', title: 'Fleet Camera', status: 'Available', mission: 'Capture installation, visibility checks and worksite lessons.' },
  { id: 'lighting', title: 'Lighting', status: 'Available', mission: 'Evaluate work-area lighting after electrical and fitment review.' },
  { id: 'cover', title: 'Protective Cover', status: 'Pending', mission: 'Explore storage protection; specification and partner remain pending.' },
  { id: 'attachments', title: 'Attachments', status: 'Available', mission: 'Follow compatibility, installation and a documented first field trial.' },
  { id: 'trailer', title: 'Trailer', status: 'Available', mission: 'Document transport after capacity, securement and towing review.' },
  { id: 'fuel', title: 'Fuel', status: 'Available', mission: 'Support commissioning and a documented operating record.' },
  { id: 'safety', title: 'Safety Equipment', status: 'Available', mission: 'Support training, inspections and safe field preparation.' },
  { id: 'storage', title: 'Storage', status: 'Available', mission: 'Document protection and organization between missions.' },
  { id: 'software', title: 'Software', status: 'Available', mission: 'Connect reviewed field records to the Passport and Digital HQ.' },
  { id: 'insurance', title: 'Insurance', status: 'To confirm', mission: 'Record an approved coverage relationship when public evidence is available.' },
  { id: 'manufacturer', title: 'Manufacturer', status: 'Documented', mission: 'Build on the factory story; future support is subject to agreement.' },
] as const;
export const partnerSurfaces = ['Factory Story', 'Journey', 'Equipment Passport', 'Mission History', 'Media', 'Maintenance', 'YouTube', 'QR Experience', 'Digital HQ', 'Fleet History'];
export const partnerLifecycle = ['Partner', 'Equipment Installed', 'Passport Updated', 'Video Published', 'Field Tested', 'Real Customer Jobs', 'Long-term Reviews', 'Maintenance History', 'Performance Data', 'Permanent Archive'];
export const comingSoon = ['First Startup', 'First Job', 'First Grapple', 'First Brush Cutter', 'First Trailer', 'First Maintenance'];
export const sponsorRoadmap = [
  { title: 'Factory', state: 'complete', detail: 'Build documented', href: '#history-production-complete' },
  { title: 'Ocean', state: 'complete', detail: 'Manufacturer-confirmed arrival; customs pending', href: '#history-port-arrival' },
  ...['Delivery', 'Commissioning', 'Training', 'Residential Jobs', 'Commercial Jobs', 'County Contracts', 'Fleet Expansion', 'Automation'].map(title => ({ title, state: 'pending', detail: 'Future ambition · sponsor opportunity', href: '#expo-partnership' })),
];
