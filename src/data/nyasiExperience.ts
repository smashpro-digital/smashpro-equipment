import type { CapabilityStory, CommissioningCheck, EquipmentVideo, InquiryStory } from "../types/passportExperience";
import { buildEstimateUrl } from "../domain/estimateUrl";
import { nyasiEquipment, nyasiLifecycle } from "./nyasiEquipment";

// A compact view of the existing lifecycle; no parallel statuses or invented dates.
const journeyStages = new Set(["order-created", "production-pending", "production", "factory-review", "balance-paid", "packing", "shipped", "us-delivery", "commissioning", "operational"]);
export const nyasiJourney = nyasiLifecycle.filter(stage => journeyStages.has(stage.id)).map(stage => ({
  ...stage,
  date: nyasiEquipment.timeline.find(event => `#history-${event.id}` === stage.href)?.occurredAt,
}));

// Sanitized editorial projection. Digital HQ remains the procurement authority.
export const nyasiStory = {
  title: "Meet NYASI.",
  intro: "A different way to approach property maintenance.",
  paragraphs: [
    "NYASI adds a remote-controlled mowing platform to the growing SmashPro fleet. The aim is to assess vegetation and light clearing work with the operator off the machine, while keeping control, visibility and site conditions central to every decision.",
    "Tracks may help with access across varied ground, but terrain suitability and safe operating limits still need field validation. ARDHI brings compact loading and earthmoving; MZIGO supports material transport. NYASI is the planned vegetation-management complement.",
    "This Passport follows the actual machine from factory evidence through inspection and commissioning. Each new chapter needs evidence before it becomes a capability claim.",
  ],
};

export const nyasiCapabilities: CapabilityStory[] = [
  { title: "Remote mowing", classification: "Purchased configuration", description: "LM500 mower with remote control. Cutting-system operation and mowing performance remain unverified." },
  { title: "Tracked mobility", classification: "Purchased configuration", description: "Rubber tracked chassis and brushless drive configuration. Supplier movement footage is not a field terrain or slope test." },
  { title: "Remote-lift blade", classification: "Purchased configuration", description: "Front blade and lift hardware are visible. Supplier demonstration shows lifting; pushing and snow performance await validation." },
  { title: "Utility towing", classification: "Purchased configuration", description: "Tow hook ordered. Installation, safe towing limits and suitability still require inspection." },
  { title: "Light clearing", classification: "Supplier-stated capability", description: "An intended use for the front work equipment, subject to material, site and commissioning checks. No heavy clearing rating is claimed." },
  { title: "Property maintenance", classification: "Supplier-stated capability", description: "A planned role in maintaining suitable properties. No customer deployment or field-validated capability has been recorded." },
];

// No published NYASI YouTube IDs were verified in the current public media inventory.
// Add only public, equipment-specific videos with publication and verification dates.
export const nyasiVideos: EquipmentVideo[] = [];
export const nyasiWatch = { channelUrl: "https://www.youtube.com/@SmashProHQ", description: "Follow the journey from factory floor to field work.", emptyMessage: "NYASI episodes will appear here after publication and verification. Follow the SmashPro Equipment channel for new coverage." };

export const nyasiCustomerInquiry: InquiryStory = {
  id: "work-with-nyasi", eyebrow: "Property owners / land managers", title: "Work with NYASI.",
  description: "Planning a property maintenance project? Request an assessment through SmashPro's existing estimate workflow. NYASI has not been commissioned; an inquiry does not reserve equipment or confirm a service date.",
  instructions: "Mention SP-NYASI-26 and remote mowing / property maintenance in your project description. Include approximate property size, vegetation, terrain, access and preferred timing. Add property photos in the Photos step; this form does not currently support video uploads.",
  href: `https://smashpro.app${buildEstimateUrl({ fleetId: "SP-NYASI-26", utmContentFallback: "nyasi-passport", landingPage: "https://smashpro.app/equipment/sp-nyasi-26.html" })}`,
  action: "Request a property assessment", readiness: "inquiry-only",
};

export const nyasiPartnershipInquiry: InquiryStory = {
  id: "partnerships", eyebrow: "Equipment / attachments / tools / technology", title: "Build with SmashPro.",
  description: "Have equipment, accessories or safety technology that fits this platform? Discuss a documented evaluation, installation, maintenance story or future field test. Scope, disclosures and usage rights are agreed separately; no audience reach or performance result is promised.",
  instructions: "Use the existing partnership inquiry and mention SP-NYASI-26, Equipment Partnership and NYASI Passport in your message. NYASI is not yet a selectable project in that form.",
  href: "https://smashpro.app/media/", action: "Explore partnership opportunities",
};

export const nyasiCommissioning: CommissioningCheck[] = [
  "Engine startup", "Remote controller", "Tracked drive", "Mower operation", "Headlights", "Blade lift", "Tow hook", "Safety systems", "Inspection and serial identification",
].map((title, index) => ({ id: `nyasi-check-${index + 1}`, title, status: "pending", evidence: [] }));
