// SP-LiveView / SP-LiveVest product line: availability, commercial gating and interest capture.
// Pure module (no imports) so tests can transpile it directly.

/** Explicit availability states for the connected-technician product line. */
export type LiveViewAvailability =
  | "CONCEPT"
  | "PARTNER_EVALUATION"
  | "PROTOTYPE"
  | "FIELD_TESTING"
  | "COMING_SOON"
  | "AVAILABLE";

export const availabilityLabels: Record<LiveViewAvailability, string> = {
  CONCEPT: "Concept",
  PARTNER_EVALUATION: "Partner evaluation",
  PROTOTYPE: "Prototype",
  FIELD_TESTING: "Field testing",
  COMING_SOON: "Coming soon",
  AVAILABLE: "Available",
};

/** Maps onto the existing equipment catalog lifecycle so shared listings keep working. */
export const availabilityToCatalogStatus: Record<LiveViewAvailability, "concept" | "in-development" | "prototype" | "field-testing" | "production-candidate" | "available"> = {
  CONCEPT: "concept",
  PARTNER_EVALUATION: "in-development",
  PROTOTYPE: "prototype",
  FIELD_TESTING: "field-testing",
  COMING_SOON: "production-candidate",
  AVAILABLE: "available",
};

export type CommercialModel = "affiliate" | "direct-sale" | "co-branded" | "bundle" | "b2b-fleet-inquiry";

/** Every gate must be evidenced before a product may show checkout. */
export interface CommercialReadiness {
  pricingApproved: boolean;
  inventoryConfirmed: boolean;
  fulfillmentDefined: boolean;
  partnerTermsSigned: boolean | "not-applicable";
  productApproved: boolean;
}

export const NO_COMMERCIAL_READINESS: CommercialReadiness = {
  pricingApproved: false, inventoryConfirmed: false, fulfillmentDefined: false, partnerTermsSigned: false, productApproved: false,
};

/**
 * Media that may appear on a product card. Every asset needs a recorded approval
 * (who approved it, when, and a reference to the email or agreement).
 */
export interface ApprovedAsset {
  src: string;
  alt: string;
  kind: "render" | "photo" | "logo";
  /** "concept" renders are labelled as such on the page. */
  stage: "concept" | "prototype" | "production";
  approvalRef: string;
  approvedBy: string;
  approvedAt: string; // ISO date
}

/** Manufacturer-supplied product facts. Only shown once `verified` is true. */
export interface ManufacturerInfo {
  partnerId: string;
  productName: string;
  modelNumber?: string;
  specSheetHref?: string;
  /** Specs SmashPro has confirmed from the manufacturer's written documentation. */
  specs: { label: string; value: string; source: string }[];
  verified: boolean;
}

/** Affiliate link: only with a confirmed partner and signed programme terms. */
export interface AffiliateLink {
  partnerId: string;
  url: string;
  programTermsRef: string;
  disclosure: string;
}

export interface ApprovedPricing {
  display: string; // e.g. "$149" exactly as approved
  approvalRef: string;
}

export interface LiveViewProduct {
  sku: string;
  name: string;
  role: string;
  availability: LiveViewAvailability;
  plannedModels: CommercialModel[];
  readiness: CommercialReadiness;
  summary: string;
  /** Who supplies or is being evaluated. Never implies a partnership. */
  sourcing: string;
  /** Accepted by the Digital HQ interest endpoint. */
  interestSku: "SP-LIVEVEST-01" | "SP-LIVEVIEW";
  /** Slots for real partner responses. Empty until approved material arrives. */
  manufacturer?: ManufacturerInfo;
  images?: ApprovedAsset[];
  affiliate?: AffiliateLink;
  pricing?: ApprovedPricing;
  /** Offer a B2B fleet inquiry (routes to interest registration as fleet-manager). */
  fleetInquiry?: boolean;
}

export type CallToAction = { kind: "checkout" } | { kind: "interest"; reason: string };

/**
 * Checkout requires the AVAILABLE state, every readiness gate, and the separate
 * commercialCheckout flag. Anything else gets interest registration.
 */
export function callToActionFor(product: LiveViewProduct, checkoutFlag: boolean): CallToAction {
  if (product.availability !== "AVAILABLE") return { kind: "interest", reason: `${availabilityLabels[product.availability]} — not for sale` };
  const r = product.readiness;
  const gates = [r.pricingApproved, r.inventoryConfirmed, r.fulfillmentDefined, r.partnerTermsSigned !== false, r.productApproved];
  if (!gates.every(Boolean)) return { kind: "interest", reason: "Commercial approval pending" };
  if (!checkoutFlag) return { kind: "interest", reason: "Checkout not enabled" };
  return { kind: "checkout" };
}

// ---------------------------------------------------------------------------
// Partners (presentation only)
// ---------------------------------------------------------------------------

export type PartnerStatus = "supplier-evaluation" | "proposed-poc" | "prospective" | "confirmed";

export const partnerStatusLabels: Record<PartnerStatus, string> = {
  "supplier-evaluation": "Supplier under evaluation",
  "proposed-poc": "Proposed proof of concept",
  prospective: "Seeking partners",
  confirmed: "Confirmed partner",
};

export interface PartnerRecord {
  id: string;
  name: string;
  category: "camera-hardware" | "connectivity" | "safety-workwear" | "camera-accessories";
  status: PartnerStatus;
  /** Approved logo. Rendered only with a logo approval; otherwise the name is shown as text. */
  approvedLogo?: ApprovedAsset;
  /** Signed agreement reference. Required before status may be "confirmed". */
  agreementRef?: string;
  /** Sponsorship is a separate, explicit fact; never inferred from partnership. */
  sponsorship?: { approvalRef: string; description: string };
  relationship: string;
  caseStudyHref?: string;
}

/** Wording guard: a partner can be described as a partner only when confirmed. */
export function partnerDisclosure(p: PartnerRecord): string {
  if (p.status === "confirmed" && p.agreementRef) {
    return p.sponsorship ? `${p.name} is a confirmed SmashPro partner and sponsor: ${p.sponsorship.description}` : `${p.name} is a confirmed SmashPro partner. Not a sponsorship.`;
  }
  return `${p.name} is not a sponsor, endorser or confirmed partner of SmashPro. ${partnerStatusLabels[p.status === "confirmed" ? "prospective" : p.status]}.`;
}

/** How a manufacturer is credited on a product card. */
export function manufacturerAttribution(info: ManufacturerInfo | undefined, partners: PartnerRecord[]): string | null {
  if (!info) return null;
  const partner = partners.find((p) => p.id === info.partnerId);
  if (!partner) return null;
  const confirmed = partner.status === "confirmed" && !!partner.agreementRef;
  return confirmed ? `Manufactured by ${partner.name}` : `Candidate supplier: ${partner.name} (under evaluation)`;
}

const DISCOUNT_PATTERN = /(coupon|promo|discount|code)=/i;

/**
 * Rejects any commercial record that would make a claim SmashPro cannot back.
 * Run in tests against the shipped data, and before publishing partner updates.
 */
export function commercialRecordErrors(product: LiveViewProduct, partners: PartnerRecord[]): string[] {
  const errors: string[] = [];
  const byId = new Map(partners.map((p) => [p.id, p]));
  const confirmed = (id: string) => { const p = byId.get(id); return !!p && p.status === "confirmed" && !!p.agreementRef; };
  for (const img of product.images ?? []) {
    if (!img.approvalRef || !img.approvedBy || !/^\d{4}-\d{2}-\d{2}$/.test(img.approvedAt)) errors.push(`${product.sku}: image ${img.src} lacks approval record`);
    if (!img.alt.trim()) errors.push(`${product.sku}: image ${img.src} lacks alt text`);
  }
  if (product.manufacturer) {
    const m = product.manufacturer;
    if (!byId.has(m.partnerId)) errors.push(`${product.sku}: unknown manufacturer partner ${m.partnerId}`);
    if (m.verified && m.specs.some((s) => !s.source.trim())) errors.push(`${product.sku}: verified spec without a source`);
    if (m.specSheetHref && !/^https:\/\//.test(m.specSheetHref) && !m.specSheetHref.startsWith("/")) errors.push(`${product.sku}: spec sheet must be https or site-relative`);
  }
  if (product.affiliate) {
    const a = product.affiliate;
    if (!confirmed(a.partnerId)) errors.push(`${product.sku}: affiliate link requires a confirmed partner with an agreement`);
    if (!a.programTermsRef.trim()) errors.push(`${product.sku}: affiliate link requires programme terms`);
    if (!/^https:\/\//.test(a.url)) errors.push(`${product.sku}: affiliate link must be https`);
    if (DISCOUNT_PATTERN.test(a.url)) errors.push(`${product.sku}: affiliate link must not carry a discount code`);
    if (!/affiliate|commission/i.test(a.disclosure)) errors.push(`${product.sku}: affiliate disclosure must say SmashPro may earn a commission`);
  }
  if (product.pricing) {
    if (!product.readiness.pricingApproved || !product.pricing.approvalRef.trim()) errors.push(`${product.sku}: pricing shown without recorded approval`);
  }
  if (product.availability === "AVAILABLE" && !product.affiliate && callToActionFor(product, true).kind !== "checkout") errors.push(`${product.sku}: AVAILABLE without completed commercial gates`);
  return errors;
}

export function partnerRecordErrors(p: PartnerRecord): string[] {
  const errors: string[] = [];
  if (p.status === "confirmed" && !p.agreementRef?.trim()) errors.push(`${p.id}: confirmed partner without agreement reference`);
  if (p.sponsorship && (p.status !== "confirmed" || !p.sponsorship.approvalRef.trim())) errors.push(`${p.id}: sponsorship requires a confirmed partner and approval`);
  if (p.approvedLogo && (p.approvedLogo.kind !== "logo" || !p.approvedLogo.approvalRef.trim())) errors.push(`${p.id}: logo without brand approval`);
  return errors;
}

/** Link to the interest form with the fleet category preselected. */
export function fleetInquiryHref(sku: string): string {
  return `?interest=fleet-manager&product=${encodeURIComponent(sku)}#interest`;
}

// ---------------------------------------------------------------------------
// Lead capture (Digital HQ /api/equipment_preorder.php contract)
// ---------------------------------------------------------------------------

export type InterestCategory =
  | "home-service-customer" | "contractor" | "equipment-operator" | "workwear-manufacturer"
  | "fleet-manager" | "technology-partner" | "early-access";

export const interestCategoryLabels: Record<InterestCategory, string> = {
  "home-service-customer": "Home-service customer",
  contractor: "Contractor",
  "equipment-operator": "Equipment operator",
  "workwear-manufacturer": "Safety workwear manufacturer",
  "fleet-manager": "Fleet manager",
  "technology-partner": "Technology partner",
  "early-access": "Product early access",
};

export interface InterestInput {
  sku: "SP-LIVEVEST-01" | "SP-LIVEVIEW";
  category: InterestCategory;
  productInterest: string;
  fullName: string;
  email: string;
  phone: string;
  postalCode: string;
  quantity: number;
  notes: string;
  consentTerms: boolean;
  consentMarketing: boolean;
  website: string; // honeypot
  search: string; // window.location.search
  defaultCampaign: string;
}

/**
 * Builds the existing equipment_preorder payload. Category, product interest and
 * originating campaign travel in fields the endpoint already stores, so no new
 * table or database is introduced. deposit_interest is always false.
 */
export function buildInterestPayload(input: InterestInput) {
  const q = new URLSearchParams(input.search);
  const cat = input.category in interestCategoryLabels ? input.category : "early-access";
  const intended = `[${cat}] [${input.productInterest}] ${input.notes}`.trim().slice(0, 255);
  return {
    product_sku: input.sku,
    full_name: input.fullName.trim(),
    email: input.email.trim(),
    phone: input.phone.trim(),
    postal_code: input.postalCode.trim(),
    quantity_interest: Math.max(1, Math.min(20, Math.floor(input.quantity) || 1)),
    intended_use: intended,
    consent_terms: input.consentTerms,
    consent_marketing: input.consentMarketing,
    deposit_interest: false,
    utm_source: q.get("utm_source") || "smashpro-equipment",
    utm_medium: q.get("utm_medium") || "catalog",
    utm_campaign: q.get("utm_campaign") || input.defaultCampaign,
    website: input.website,
  };
}

/** Fallback when the interest flag is off: the existing contact pattern, nothing stored. */
export function interestMailto(sku: string, campaign: string): string {
  const subject = `${sku} interest (${campaign})`;
  return `mailto:smashprohq@gmail.com?subject=${encodeURIComponent(subject)}`;
}
