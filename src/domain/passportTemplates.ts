import type {
  PassportBuildType,
  SectionKey,
  DocumentKind,
  MediaKind,
} from "./passportAutomation";
export interface PassportSectionDefinition {
  key: SectionKey;
  id: string;
  label: string;
  emptyStatePolicy: "omit" | "pending";
  heroAction?: string;
}
export interface PassportBuildTemplate {
  type: PassportBuildType;
  label: string;
  sections: PassportSectionDefinition[];
  lifecycleStages: {
    id: string;
    label: string;
    href?: string;
  }[];
  mediaDestinations: {
    id: MediaKind;
    label: string;
  }[];
  documentDestinations: {
    id: DocumentKind;
    label: string;
  }[];
}
const heroActions: Partial<Record<SectionKey, string>> = {
  overview: "Open Passport",
  journey: "Build Journey",
  partners: "Partnership Story",
  fieldTests: "Field Tests",
};
const section = (
  key: SectionKey,
  id: string,
  label: string,
  emptyStatePolicy: "omit" | "pending" = "omit",
) => ({ key, id, label, emptyStatePolicy, heroAction: heroActions[key] });
const stages = (values: [string, string, string?][]) =>
  values.map(([id, label, href]) => ({ id, label, href }));
const mediaDestinations: PassportBuildTemplate["mediaDestinations"] = [
  { id: "factory", label: "Factory media" },
  { id: "shipping", label: "Shipping media" },
  { id: "commissioning", label: "Commissioning" },
  { id: "field", label: "Field tests" },
  { id: "service", label: "Long-term use" },
];
const documentDestinations: PassportBuildTemplate["documentDestinations"] = [
  { id: "manufacturer_spec", label: "OEM documentation" },
  { id: "custom_build_spec", label: "Custom-build specification" },
  { id: "factory_proof", label: "Factory proof" },
  { id: "electrical_diagram", label: "Electrical / accessory diagram" },
  { id: "commissioning_checklist", label: "Commissioning checklist" },
  { id: "warranty", label: "Warranty documentation" },
  { id: "field_validation", label: "Field-validation records" },
];
const shared = [
  section("specifications", "specifications", "Specifications"),
  section("media", "media", "Media", "pending"),
  section("documents", "documents", "Documents", "pending"),
  section("history", "history", "History"),
];
export const passportTemplates: Record<
  PassportBuildType,
  PassportBuildTemplate
> = {
  partner_build: {
    type: "partner_build",
    label: "Partner build",
    sections: [
      section("overview", "overview", "Overview"),
      section("identity", "identity", "Identity"),
      section("configuration", "smashpro-edition", "SmashPro Edition"),
      section("partners", "partnership", "Partnership"),
      section("journey", "journey", "Build Journey"),
      shared[0],
      section("fieldTests", "field-tests", "Field Tests"),
      ...shared.slice(1),
    ],
    lifecycleStages: stages([
      ["concept", "Concept / partner discussion", "#history"],
      ["configuration", "Configuration planning", "#smashpro-edition"],
      ["partner_proof", "Factory proof", "#media"],
      ["build_authorization", "Build authorization"],
      ["production", "Production"],
      ["factory_qc", "Factory quality control"],
      ["packing", "Packing"],
      ["shipping", "International shipping"],
      ["arrival", "Arrival"],
      ["commissioning", "Commissioning"],
      ["field_validation", "Field validation", "#field-tests"],
      ["long_term_use", "Long-term use"],
    ]),
    mediaDestinations,
    documentDestinations,
  },
  factory_import: {
    type: "factory_import",
    label: "Factory import",
    sections: [
      section("overview", "overview", "Overview"),
      section("identity", "identity", "Identity"),
      section("partners", "partners", "Factory / Supplier"),
      section("configuration", "configuration", "Factory Configuration"),
      section("journey", "journey", "Build Journey"),
      section("shipping", "shipping", "Shipping / Logistics"),
      ...shared.slice(0, 3),
      section("commissioning", "commissioning", "Commissioning"),
      shared[3],
    ],
    lifecycleStages: stages([
      ["procurement", "Procurement"],
      ["configuration", "Configuration"],
      ["build_authorization", "Build authorization"],
      ["production", "Production"],
      ["factory_completion", "Factory completion"],
      ["final_payment", "Final payment"],
      ["shipping_preparation", "Shipping preparation"],
      ["packing", "Packing"],
      ["shipped", "Carrier acceptance / shipped"],
      ["ocean_freight", "Ocean freight"],
      ["import_delivery", "Import delivery"],
      ["arrival", "Arrival"],
      ["commissioning", "Commissioning"],
      ["field_validation", "Field validation"],
      ["service", "Service"],
    ]),
    mediaDestinations,
    documentDestinations,
  },
};
