// Build/server adapter. The protected MZIGO renderer continues using these same
// source modules; this adds no second equipment registry or procurement record.
import type { CanonicalPassport, PassportRecord } from "../domain/passportAutomation";
import type { Equipment } from "../types/equipment";
import { mzigoFinalPayment, mzigoStatusLabel, mzigoStatusDetail } from "./mzigoPassport";
import { mzigoFinalConfiguration, mzigoEngineeringCallouts } from "./mzigoPlatform";

export function normalizeMzigo(p: CanonicalPassport, item: Equipment): CanonicalPassport {
  p.asset.current_lifecycle_stage = "shipping_preparation";
  p.asset.status_label = mzigoStatusLabel;
  p.asset.status_detail = mzigoStatusDetail;
  p.asset.manufacturer = item.specifications.find(s => s.label === "Manufacturer")!.value;
  p.build.renderer = "protected";
  p.build.hero_caption = "Promotional identity artwork; authentic factory evidence is preserved separately.";
  const add = (r: Pick<PassportRecord, "id" | "kind" | "title" | "detail"> & Partial<PassportRecord>): PassportRecord => ({
    asset_id: item.fleetId, visibility: "public", evidence_state: "review_pending",
    source_type: "smashpro", sort_order: 300, ...r,
  });
  for (const media of item.gallery) {
    const r = p.records.find(r => r.id === media.id)!;
    const authentic = Boolean(media.group);
    Object.assign(r, {
      media_kind: authentic ? "factory" : "concept",
      evidence_state: authentic ? "submitted" : "concept",
      productionEvidence: authentic, factoryEvidence: authentic, fieldEvidence: false,
      source_type: authentic ? "factory" : "smashpro",
      source_ref: authentic ? "Factory-supplied media retained in the Equipment Passport" : "SmashPro concept archive",
      source_visibility: "public", evidence_classification: media.evidenceCategory ?? (authentic ? "factory_build" : "concept"),
      group_id: media.group, poster: media.poster,
    });
  }
  // These two existing purchase entries contain public-safe status only. Do not
  // broaden the general purchase allowlist or import private procurement fields.
  for (const id of ["mzigo-deposit", "mzigo-final-payment"]) {
    const r = p.records.find(r => r.id === id)!;
    r.visibility = "public";
    r.evidence_state = "verified";
    r.evidence_classification = id === "mzigo-final-payment" ? "final_payment" : "deposit";
    r.source_ref = id === "mzigo-final-payment" ? mzigoFinalPayment.evidenceId : "Public procurement status; amount and date not published";
    r.source_visibility = "public";
  }
  for (const [id, stage, classification] of [
    ["mzigo-factory-build", "production", "factory_build"],
    ["mzigo-build-approved", "factory_completion", "factory_build"],
    ["mzigo-final-payment", "final_payment", "final_payment"],
  ]) {
    const evidence = p.records.find(r => r.id === id)!;
    evidence.evidence_state = "verified";
    evidence.evidence_classification = classification;
    if (classification === "factory_build") evidence.source_type = "factory";
    p.records.push(add({id: `${id}-milestone`, kind: "lifecycle_event", title: evidence.title,
      detail: evidence.detail, occurred_at: evidence.occurred_at, source_type: evidence.source_type,
      evidence_state: "verified", stage_id: stage,
      event_type: stage === "production" ? "production_started" : "completion", evidence_ids: [id]}));
  }
  // Stable semantic IDs; supplier-stated payload and model remain unverified.
  for (const c of mzigoFinalConfiguration) p.records.push(add({
    id: `mzigo-configuration-${c.label.toLowerCase().replaceAll(" ", "-")}`, kind: "configuration",
    title: c.label, detail: c.evidence, value: c.value,
    evidence_state: /pending/.test(c.evidence) ? "review_pending" : /[Pp]hotographed|filmed|[Ff]actory-installed/.test(c.evidence) ? "installed" : "submitted",
    evidence_classification: c.label === "Body" ? "paint" : c.label === "Identity graphics" ? "branding" : "configuration",
    source_ref: c.evidence, source_visibility: "public",
  }));
  for (const c of mzigoEngineeringCallouts) p.records.push(add({
    id: `mzigo-engineering-${c.title.toLowerCase().replaceAll(" ", "-")}`, kind: "evidence",
    title: c.title, detail: c.detail, evidence_state: c.mediaId ? "submitted" : "requested",
    source_type: "factory", source_ref: c.status, source_visibility: "public",
    evidence_classification: /controller/i.test(c.title) ? "controller" : "configuration",
    evidence_ids: c.mediaId ? [c.mediaId] : [],
  }));
  p.records.push(add({id: "mzigo-operational-factory-video", kind: "evidence",
    title: "Factory walkaround and hydraulic dump cycle", detail: "Factory operation is documented; this is not field validation or commissioning.",
    evidence_state: "submitted", source_type: "factory", occurred_at: "2026-09-09",
    evidence_classification: "operational_test", evidence_ids: ["sp-mzigo-26e-factory-complete-walkaround-2026-09-09"]}));
  p.records.push(add({id: "mzigo-controller-documentation", kind: "document", title: "Controller documentation",
    detail: "Controller photographs and engineering callouts are preserved. Manufacturer electrical documentation remains pending; live public documents remain owned by the canonical document service.",
    evidence_classification: "controller", document_kind: "electrical_diagram",
    evidence_ids: ["sp-mzigo-26e-motor-controller-detail-2026-09-09", "sp-mzigo-26e-remote-controller-2026-09-09"]}));
  p.records.push(add({id: "mzigo-field-validation", kind: "field_test", title: "Field validation pending",
    detail: "Physical receipt and commissioning remain future stages. No operating performance has been field validated.",
    test_state: "planned", evidence_classification: "commissioning"}));
  return p;
}
