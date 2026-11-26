import { NO_COMMERCIAL_READINESS, type LiveViewProduct, type PartnerRecord } from "../domain/liveviewCommerce";

// No prices, inventory, affiliate links or discount codes exist for this line.
// Every readiness gate is false until the owner records approval.
export const liveViewProducts: LiveViewProduct[] = [
  {
    sku: "SP-LIVEVEST-01", name: "SP-LiveVest 01", role: "Camera-ready technician vest", availability: "CONCEPT",
    plannedModels: ["direct-sale", "co-branded", "b2b-fleet-inquiry"], readiness: NO_COMMERCIAL_READINESS, fleetInquiry: true,
    summary: "Premium high-visibility, multi-pocket vest designed around a stable chest-camera position.",
    sourcing: "Manufacturing partner not selected.", interestSku: "SP-LIVEVEST-01",
  },
  {
    sku: "SP-LV-VEST-PARTNER", name: "Premium partner safety vests", role: "Third-party workwear", availability: "CONCEPT",
    plannedModels: ["affiliate", "co-branded"], readiness: NO_COMMERCIAL_READINESS,
    summary: "Existing high-visibility vests that meet the same camera-mounting requirements.",
    sourcing: "No workwear partner confirmed.", interestSku: "SP-LIVEVEST-01",
  },
  {
    sku: "SP-LV-CAM-S7P", name: "Snake Eyes body camera", role: "4G LTE body camera candidate", availability: "PARTNER_EVALUATION",
    plannedModels: ["direct-sale", "bundle", "b2b-fleet-inquiry"], readiness: NO_COMMERCIAL_READINESS, fleetInquiry: true,
    summary: "Working name for the Shelleyes S7+ 4G US LTE camera being evaluated for SP-LiveView. Not yet field tested.",
    sourcing: "Shelleyes S7+ under supplier evaluation.", interestSku: "SP-LIVEVIEW",
  },
  {
    sku: "SP-LV-QUICKDOCK", name: "SP-LiveView QuickDock", role: "Interchangeable camera mount", availability: "CONCEPT",
    plannedModels: ["direct-sale", "bundle"], readiness: NO_COMMERCIAL_READINESS,
    summary: "Proposed quick-release dock so one camera moves between vest, helmet and equipment positions.",
    sourcing: "Design not started.", interestSku: "SP-LIVEVEST-01",
  },
  {
    sku: "SP-LV-CASE", name: "Protective transport case", role: "Accessory", availability: "CONCEPT",
    plannedModels: ["affiliate", "bundle"], readiness: NO_COMMERCIAL_READINESS,
    summary: "Padded case for camera, dock and charging kit between jobs.", sourcing: "Not sourced.", interestSku: "SP-LIVEVIEW",
  },
  {
    sku: "SP-LV-CHARGE", name: "Charging accessories", role: "Accessory", availability: "CONCEPT",
    plannedModels: ["affiliate", "bundle"], readiness: NO_COMMERCIAL_READINESS,
    summary: "Vehicle and multi-bay charging for technician cameras.", sourcing: "Not sourced.", interestSku: "SP-LIVEVIEW",
  },
  {
    sku: "SP-LV-STARTER", name: "Connected technician starter kit", role: "Hardware bundle", availability: "CONCEPT",
    plannedModels: ["bundle", "b2b-fleet-inquiry"], readiness: NO_COMMERCIAL_READINESS, fleetInquiry: true,
    summary: "Vest, camera, dock, case and charging defined as one kit once each part is validated.",
    sourcing: "Depends on every component above.", interestSku: "SP-LIVEVIEW",
  },
];

export const liveViewPartners: PartnerRecord[] = [
  { id: "shelleyes", name: "Shelleyes", category: "camera-hardware", status: "supplier-evaluation",
    relationship: "Candidate camera manufacturer. Technical documentation received; device not yet field tested.",
    caseStudyHref: "/equipment/shelleyes-s7p-evaluation.html" },
  { id: "hologram", name: "Hologram", category: "connectivity", status: "proposed-poc",
    relationship: "IoT cellular connectivity. A 60-day proof of concept has been discussed; terms are not signed." },
  { id: "workwear", name: "Safety workwear manufacturers", category: "safety-workwear", status: "prospective",
    relationship: "SmashPro is looking for a high-visibility workwear manufacturer to prototype SP-LiveVest 01." },
  { id: "accessories", name: "Camera accessory makers", category: "camera-accessories", status: "prospective",
    relationship: "SmashPro is looking for mount and dock partners for QuickDock evaluation." },
];
