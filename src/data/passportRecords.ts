// Build/server entry only. React imports virtual:passport-public instead.
import { equipment } from "./equipment";
import {
  liftmateEquipment,
  liftmateConfiguration,
  liftmateFieldTests,
  liftmateCaseStudyUrl,
} from "./liftmateEquipment";
import { DRIVE_EVIDENCE_HISTORY } from "./ardhiEvidenceHistory";
import { normalizeMzigo } from "./mzigoCanonicalPassport";
import type { Equipment } from "../types/equipment";
import type {
  CanonicalPassport,
  PassportRecord,
  PassportBuildType,
  EvidenceState,
} from "../domain/passportAutomation";
const configurationEvidenceStates: Record<
  (typeof liftmateConfiguration)[number]["state"], EvidenceState
> = {
  proposed: "requested",
  "factory-review": "review_pending",
  approved: "approved",
  installed: "installed",
  validated: "field_validated",
};
function fromEquipment(
  item: Equipment,
  build_type: PassportBuildType,
): CanonicalPassport {
  const id = item.fleetId;
  const record = (
    kind: PassportRecord["kind"],
    key: string,
    title: string,
    detail: string,
    index: number,
    state: EvidenceState = "review_pending",
  ): PassportRecord => ({
    id: key,
    asset_id: id,
    kind,
    title,
    detail,
    evidence_state: state,
    source_type: "smashpro",
    visibility: "public",
    sort_order: index,
  });
  return {
    asset: {
      id,
      slug: item.slug,
      fleet_id: id,
      passport_id: item.identity.passportId,
      name: item.name,
      manufacturer: item.manufacturer ?? "",
      oem_model: item.identity.factoryModel ?? item.identity.model,
      model_year: item.identity.modelYear,
      asset_class: item.identity.assetClass,
      build_type,
      hero_media_id: `${id}-hero`,
      current_lifecycle_stage:
        build_type === "partner_build" ? "configuration" : "ocean_freight",
      status_label: item.statusLabel,
      status_detail: item.statusDetail ?? "",
      public_path: item.publicPath,
      edition: item.identity.edition,
      overview: item.overview,
    },
    build: {
      id: `${id}-build`,
      asset_id: id,
      build_type,
      renderer: build_type === "partner_build" ? "generic" : "protected",
      sections: {},
      gates: [],
      restrictions: item.restrictions,
      hero_caption: "",
      hero_eyebrow: "SmashPro Equipment Passport",
    },
    records: [
      {
        ...record(
          "media",
          `${id}-hero`,
          "Concept media",
          "Identity artwork; not physical machine evidence.",
          0,
          "concept",
        ),
        url: item.heroImage,
        alt: item.heroMedia?.alt ?? `${id} identity artwork`,
        width: 1536,
        height: 1024,
        media_kind: "concept",
        media_type: "image",
        productionEvidence: false,
        factoryEvidence: false,
        fieldEvidence: false,
      },
      ...item.specifications.map((s, i) => ({
        ...record(
          "specification",
          s.id ?? `${id}-spec-${i + 1}`,
          s.label,
          "",
          i,
          s.confirmed ? "verified" : "review_pending",
        ),
        group_id:
          s.groupId ??
          `legacy-group-${item.specifications.findIndex((v) => v.group === s.group)}`,
        group_label: s.group ?? "Specifications",
        value: s.value,
        source_ref: s.source,
        source_visibility: "public" as const,
        source_type: s.source?.includes("Pairon")
          ? ("manufacturer" as const)
          : ("smashpro" as const),
      })),
      ...item.timeline.map((e, i) => ({
        ...record("evidence", e.id, e.title, e.detail ?? "", i, "submitted"),
        occurred_at: e.occurredAt,
        visibility:
          e.publicDisplay && e.kind !== "purchase"
            ? ("public" as const)
            : ("private" as const),
        photos: e.photos,
        source_type:
          e.kind === "factory-build"
            ? ("factory" as const)
            : ("smashpro" as const),
      })),
      ...item.documents.map((d, i) => ({
        ...record(
          "document",
          d.id,
          d.title,
          d.description ?? "",
          i,
          d.verificationStatus === "verified" ? "verified" : "submitted",
        ),
        document_kind:
          d.kind === "manual"
            ? ("operator_manual" as const)
            : ("manufacturer_spec" as const),
        url: d.url,
        visibility: d.publicDisplay
          ? ("public" as const)
          : ("private" as const),
        source_type: "manufacturer" as const,
        source_ref: d.source,
        source_visibility: "public" as const,
      })),
      ...item.factoryOptions.map((o, i) => ({
        ...record("configuration", o.id, o.name, o.description, i, "installed"),
        source_type: "factory" as const,
        visibility: o.publicDisplay
          ? ("public" as const)
          : ("private" as const),
        evidence_ids: o.evidenceMediaId ? [o.evidenceMediaId] : [],
      })),
      ...item.gallery.map((m, i) => ({
        ...record(
          "media",
          m.id ?? `${id}-gallery-${i + 1}`,
          m.caption,
          m.caption,
          i,
          "submitted",
        ),
        url: m.src,
        alt: m.alt,
        width: m.width,
        height: m.height,
        media_type: m.kind ?? ("image" as const),
        media_kind:
          m.group === "shipping" || m.group === "export"
            ? ("shipping" as const)
            : ("factory" as const),
        source_type: "factory" as const,
        occurred_at: m.capturedAt,
        productionEvidence: true,
        factoryEvidence: true,
        fieldEvidence: false,
      })),
      ...(item.partners ?? []).map((p, i) => ({
        ...record("partner", p.id, p.brand, p.description, i, "submitted"),
        url: p.storyUrl,
        value: p.relationship,
      })),
      ...item.attachments.map((a, i) => ({
        ...record(
          "relationship",
          a.id,
          a.name,
          a.description ?? "",
          i,
          a.status === "installed" ? "installed" : "review_pending",
        ),
        target_id: a.id,
        group_id: "attachments",
      })),
      ...item.upgrades.map((u, i) => ({
        ...record(
          "modification",
          u.id,
          u.name,
          u.description,
          i,
          u.status === "installed" ? "installed" : "requested",
        ),
      })),
    ],
  };
}
const liftmate = fromEquipment(liftmateEquipment, "partner_build");
const add = (
  r: Partial<PassportRecord> &
    Pick<PassportRecord, "id" | "kind" | "title" | "detail">,
): PassportRecord => ({
  asset_id: liftmate.asset.id,
  evidence_state: "concept",
  source_type: "smashpro",
  visibility: "public",
  sort_order: 0,
  ...r,
});
liftmate.build.hero_eyebrow = "SmashPro Equipment Passport · Concept media";
liftmate.build.hero_caption =
  "Proposed configuration artwork. It is not factory, production, delivery or field evidence.";
liftmate.build.sections = {
  overview: {
    eyebrow: "Current status",
    title: "Planning is documented.\nThe machine is not built.",
    description: liftmateEquipment.overview,
  },
  identity: {
    eyebrow: "Equipment identity",
    title: "One platform.\nTwo identities kept clear.",
    description:
      "The OEM platform remains Pairon's Glide200. SP-LIFTMATE-27 is SmashPro's reserved identity for the proposed edition and its future lifecycle record.",
  },
  configuration: {
    eyebrow: "SmashPro Edition",
    title: "Design intent with visible gates.",
    description:
      "Every feature keeps its evidence state. Proposed ideas cannot silently become approved, installed or validated equipment.",
  },
  partners: {
    eyebrow: "Partnership story",
    title: "SmashPro × Pairon Tools",
    description:
      "The Equipment Passport is the permanent technical and lifecycle record. The case study follows the collaboration framework, proposed video program and future field story.",
  },
  journey: {
    eyebrow: "Build journey",
    title: "Evidence advances the machine.",
    description:
      "Only documented concept and identity milestones are complete. Every physical build, shipment and operating stage remains pending until supported by evidence.",
  },
  specifications: {
    eyebrow: "Specifications",
    title: "Published platform facts.\nPending SmashPro configuration.",
    description:
      "OEM values are attributed to Pairon-published information. Load suitability still depends on geometry, center of gravity, lifting points, surface conditions and current operating guidance.",
  },
  fieldTests: {
    eyebrow: "Field validation program",
    title: "Five planned chapters.\nZero completed tests.",
    description:
      "The program is a proposal framework. Vehicle compatibility, machine performance and workflow outcomes remain unvalidated.",
  },
  media: {
    eyebrow: "Media archive",
    title: "A destination for evidence.\nNo empty slot becomes proof.",
    description:
      "The approved header is concept media. Other chapters stay visibly pending until authentic records exist.",
  },
  documents: {
    eyebrow: "Passport documents",
    title: "The library starts with honest gaps.",
    description:
      "No OEM or factory-issued LiftMate documents are currently published in this Passport.",
  },
  history: {
    eyebrow: "Permanent history",
    title: "Supported events, expandable records.",
    description:
      "Dates and claims appear only where the public record supports them.",
  },
};
liftmate.build.gates = [
  {
    id: "phase",
    label: "Current phase",
    title: "Custom build planning",
    detail:
      "Proposal and configuration questions are documented for partner and factory review.",
  },
  {
    id: "authorization",
    label: "Commercial gate",
    title: "Not authorized",
    detail: "No public evidence of a paid deposit or build authorization.",
  },
  {
    id: "production",
    label: "Production gate",
    title: "Not started",
    detail:
      "No factory proof, production media or QC evidence has been received.",
  },
  {
    id: "operation",
    label: "Operational gate",
    title: "Not commissioned",
    detail:
      "No ownership, installation, vehicle fitment or field performance claim is made.",
  },
];
liftmate.records.push(
  ...liftmateConfiguration.map((c, i) =>
    add({
      id: c.id,
      kind: "configuration",
      title: c.title,
      detail:
        c.id === "finish"
          ? `${c.detail} RAL 6018 direction remains proposed.`
          : c.detail,
      evidence_state: configurationEvidenceStates[c.state],
      sort_order: i,
    }),
  ),
  ...liftmateFieldTests.map((t, i) =>
    add({
      id: t.id,
      kind: "field_test",
      title: t.title,
      detail: t.detail,
      value: t.state,
      test_state: "planned",
      sort_order: i,
    }),
  ),
  add({
    id: "pairon-tools",
    kind: "partner",
    title: "Pairon Tools",
    detail: "Proposal-stage discussions and configuration planning.",
    value: "Glide200",
    evidence_state: "partner_proposed",
  }),
  add({
    id: "pairon-case-study",
    kind: "relationship",
    title: "View Partnership Case Study",
    detail: "Story / editorial",
    target_id: "pairon-partnership-case-study",
    url: liftmateCaseStudyUrl,
  }),
  add({
    id: "rebirth-workflow",
    kind: "relationship",
    title: "Project Rebirth workflow",
    detail: "Planned workflow; vehicle fitment not yet validated.",
    target_id: "project-rebirth",
    group_id: "fieldTests",
  }),
  add({
    id: "liftmate-oem",
    kind: "media",
    title: "Official Pairon product image",
    detail: "OEM platform reference, not the proposed SmashPro build.",
    url: "/equipment/images/sp-liftmate-27-pairon-glide200-oem-thumbnail.jpg",
    alt: "Pairon Tools Glide200 OEM lifting platform in a warehouse",
    media_kind: "concept",
    group_id: "identity",
    source_type: "manufacturer",
    evidence_state: "submitted",
  }),
  add({
    id: "liftmate-concept-complete",
    kind: "lifecycle_event",
    title: "Concept documented",
    detail: "Proposal recorded; no physical machine claim.",
    stage_id: "concept",
    event_type: "completion",
    evidence_state: "verified",
    evidence_ids: ["liftmate-proposal"],
  }),
);
const ardhi = fromEquipment(
  equipment.find((e) => e.fleetId === "SP-ARDHI-26")!,
  "factory_import",
);
ardhi.build.sections.journey = {
  eyebrow: "Factory-to-field record",
  title: "Evidence preserves the lifecycle.",
  description:
    "Factory completion and export preparation are documented. Ocean transit is forwarder-reported; live shipment verification remains owned by Digital HQ. Arrival, commissioning, field validation and service are pending.",
};
// Preserve the full historical record; commercially sensitive entries are excluded
// from the new projection. The protected legacy renderer retains current behavior.
const commercialHistoryIds = new Set([
  "drive-vendor-t460-quote",
  "drive-ddp-benchmark-negotiation",
  "drive-competing-final-package",
  "drive-four-payment-structure",
  "drive-contract-drafted",
  "drive-attachment-expansion-priced",
]);
ardhi.records.push(
  ...DRIVE_EVIDENCE_HISTORY.map(
    (e, i): PassportRecord => ({
      id: e.id,
      asset_id: ardhi.asset.id,
      kind: "evidence",
      title: e.title,
      detail: e.narrative,
      evidence_state: "submitted",
      source_type: "supplier",
      source_ref: e.evidence,
      source_visibility: "private",
      occurred_at: e.date,
      visibility: commercialHistoryIds.has(e.id) ? "private" : "public",
      sort_order: 100 + i,
      decision: e.decision,
      supplier: e.supplier,
      photos: e.photos,
    }),
  ),
);
for (const [id, stage_id, evidence_id] of [
  ["ardhi-production-recorded", "production", "ardhi-factory-build"],
  [
    "ardhi-factory-completion-recorded",
    "factory_completion",
    "ardhi-completed-build",
  ],
  [
    "ardhi-export-preparation-recorded",
    "shipping_preparation",
    "ardhi-export-crate-scheduled",
  ],
]) {
  const evidence = ardhi.records.find((r) => r.id === evidence_id)!;
  ardhi.records.push({
    id,
    asset_id: ardhi.asset.id,
    kind: "lifecycle_event",
    title: evidence.title,
    detail: evidence.detail,
    evidence_state: "verified",
    source_type: "factory",
    occurred_at: evidence.occurred_at,
    source_ref: evidence_id,
    source_visibility: "public",
    visibility: "public",
    sort_order: 200,
    stage_id,
    event_type: "completion",
    evidence_ids: [evidence_id],
  });
}
const production = ardhi.records.find((r) => r.id === "ardhi-factory-build")!;
production.evidence_state = "in_production";
ardhi.records.push({
  id: "ardhi-physical-production",
  asset_id: ardhi.asset.id,
  kind: "lifecycle_event",
  title: "Factory production documented",
  detail: production.detail,
  evidence_state: "in_production",
  source_type: "factory",
  source_ref: production.id,
  source_visibility: "public",
  visibility: "public",
  sort_order: 199,
  stage_id: "production",
  event_type: "production_started",
  evidence_ids: [production.id],
});
// No new shipping completion is inferred here. HQ remains authoritative at runtime
// on the protected renderer; the repository record only reports ocean transit.
const reportedTransit = ardhi.records.find(r => r.id === "ardhi-ocean-departure-reported")!;
reportedTransit.source_type = "supplier";
reportedTransit.evidence_classification = "in_transit";
const mzigoEquipment = equipment.find(e => e.fleetId === "SP-MZIGO-26E")!;
const mzigo = normalizeMzigo(fromEquipment(mzigoEquipment, "factory_import"), mzigoEquipment);
export const canonicalPassports: CanonicalPassport[] = [ardhi, liftmate, mzigo];
