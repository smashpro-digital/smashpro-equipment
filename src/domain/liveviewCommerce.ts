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
  /** Approved logo path. Absent until written brand approval exists; render the name as text. */
  approvedLogo?: string;
  relationship: string;
  caseStudyHref?: string;
}

/** Wording guard: a partner can be described as a partner only when confirmed. */
export function partnerDisclosure(p: PartnerRecord): string {
  if (p.status === "confirmed") return `${p.name} is a confirmed SmashPro partner.`;
  return `${p.name} is not a sponsor, endorser or confirmed partner of SmashPro. ${partnerStatusLabels[p.status]}.`;
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
