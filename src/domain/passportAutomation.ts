/** Transport-neutral contracts. These records are not a second equipment registry:
 * asset IDs refer to the existing fleet identity and may later come from HQ. */
export type PassportBuildType = "factory_import" | "partner_build";
export type EvidenceState =
  | "concept"
  | "requested"
  | "submitted"
  | "partner_proposed"
  | "review_pending"
  | "approved"
  | "in_production"
  | "installed"
  | "verified"
  | "field_validated"
  | "superseded"
  | "rejected";
export type SourceType =
  | "smashpro"
  | "partner"
  | "factory"
  | "supplier"
  | "manufacturer"
  | "carrier"
  | "field"
  | "system";
export type SectionKey =
  | "overview"
  | "identity"
  | "partners"
  | "configuration"
  | "journey"
  | "shipping"
  | "specifications"
  | "fieldTests"
  | "media"
  | "documents"
  | "commissioning"
  | "history";
export type RecordKind =
  | "partner"
  | "configuration"
  | "specification"
  | "lifecycle_event"
  | "evidence"
  | "media"
  | "document"
  | "field_test"
  | "modification"
  | "relationship";
export type MediaKind =
  | "concept"
  | "partner_proof"
  | "factory"
  | "shipping"
  | "commissioning"
  | "field"
  | "service";
export type DocumentKind =
  | "manufacturer_spec"
  | "operator_manual"
  | "custom_build_spec"
  | "factory_proof"
  | "electrical_diagram"
  | "shipping_document"
  | "commissioning_checklist"
  | "warranty"
  | "field_validation";
export interface PassportRecord {
  id: string;
  asset_id: string;
  kind: RecordKind;
  title: string;
  detail: string;
  evidence_state: EvidenceState;
  source_type: SourceType;
  source_ref?: string;
  source_visibility?: "public" | "private";
  occurred_at?: string;
  visibility: "public" | "private";
  sort_order: number;
  group_id?: string;
  group_label?: string;
  value?: string;
  url?: string;
  alt?: string;
  width?: number;
  height?: number;
  media_kind?: MediaKind;
  document_kind?: DocumentKind;
  media_type?: "image" | "video";
  poster?: string;
  evidence_classification?: string;
  productionEvidence?: boolean;
  factoryEvidence?: boolean;
  fieldEvidence?: boolean;
  stage_id?: string;
  event_type?:
    | "planning"
    | "proof_received"
    | "proof_approved"
    | "authorization"
    | "deposit_paid"
    | "production_started"
    | "completion";
  test_state?:
    | "planned"
    | "ready"
    | "in_progress"
    | "validated"
    | "failed"
    | "superseded";
  target_id?: string;
  evidence_ids?: string[];
  photos?: string[];
  decision?: string;
  supplier?: string;
}
export interface PassportAsset {
  id: string;
  slug: string;
  fleet_id: string;
  passport_id: string;
  name: string;
  manufacturer: string;
  oem_model: string;
  model_year?: number;
  asset_class: string;
  build_type: PassportBuildType;
  hero_media_id: string;
  current_lifecycle_stage: string;
  status_label: string;
  status_detail: string;
  public_path: string;
  edition: string;
  overview: string;
}
export interface SectionCopy {
  eyebrow: string;
  title: string;
  description: string;
}
export interface PassportBuild {
  id: string;
  asset_id: string;
  build_type: PassportBuildType;
  renderer: "generic" | "protected";
  sections: Partial<Record<SectionKey, SectionCopy>>;
  gates: {
    id: string;
    label: string;
    title: string;
    detail: string;
  }[];
  restrictions: string[];
  hero_caption: string;
  hero_eyebrow: string;
}
export interface CanonicalPassport {
  asset: PassportAsset;
  build: PassportBuild;
  records: PassportRecord[];
  /** Server/build only. Never imported by React. */
  procurement?: {
    partner_price?: number;
    deposit_amount?: number;
    remaining_balance?: number;
    private_email?: string;
    private_phone?: string;
    refund_amount?: number;
    internal_notes?: string;
  };
}
export interface PassportPublicProjection {
  asset: PassportAsset;
  build: PassportBuild;
  records: PassportRecord[];
}
const safeUrl = (url?: string) => {
  if (!url) return undefined;
  if (/^#[\w-]+$/.test(url)) return url;
  try {
    const parsed = new URL(url, "https://smashpro.app");
    if (
      parsed.protocol !== "https:" ||
      parsed.username ||
      parsed.password ||
      /(^|\/)(private|internal|admin)(\/|$)/i.test(
        decodeURIComponent(parsed.pathname),
      )
    )
      return undefined;
    if (url.startsWith("/") && !url.startsWith("/equipment/")) return undefined;
    if (!url.startsWith("/") && !url.startsWith("https://")) return undefined;
    if (
      [...parsed.searchParams.keys(), ...new URLSearchParams(parsed.hash.slice(1)).keys()].some((key) =>
        /token|secret|signature|password|email|phone/i.test(key),
      )
    )
      return undefined;
    return url;
  } catch {
    return undefined;
  }
};
/** Explicit allowlists at every object level, including provenance. No record spreads. */
export function projectPassportPublicRecord(
  input: CanonicalPassport,
): PassportPublicProjection {
  const a = input.asset,
    b = input.build;
  if (a.id !== b.asset_id || a.build_type !== b.build_type)
    throw Error("Passport build ownership mismatch");
  const records = input.records.filter(
    (r) => r.visibility === "public" && r.asset_id === a.id,
  );
  const ids = new Set(records.map((r) => r.id));
  if (ids.size !== records.length) throw Error("Duplicate Passport record ID");
  const publicSectionKeys: SectionKey[] = [
    "overview",
    "identity",
    "partners",
    "configuration",
    "journey",
    "shipping",
    "specifications",
    "fieldTests",
    "media",
    "documents",
    "commissioning",
    "history",
  ];
  const projection: PassportPublicProjection = {
    asset: {
      id: a.id,
      slug: a.slug,
      fleet_id: a.fleet_id,
      passport_id: a.passport_id,
      name: a.name,
      manufacturer: a.manufacturer,
      oem_model: a.oem_model,
      model_year: a.model_year,
      asset_class: a.asset_class,
      build_type: a.build_type,
      hero_media_id: ids.has(a.hero_media_id) ? a.hero_media_id : "",
      current_lifecycle_stage: a.current_lifecycle_stage,
      status_label: a.status_label,
      status_detail: a.status_detail,
      public_path: a.public_path,
      edition: a.edition,
      overview: a.overview,
    },
    build: {
      id: b.id,
      asset_id: b.asset_id,
      build_type: b.build_type,
      renderer: b.renderer,
      sections: Object.fromEntries(
        publicSectionKeys.flatMap((key) => {
          const s = b.sections[key];
          return s
            ? [
                [
                  key,
                  {
                    eyebrow: s.eyebrow,
                    title: s.title,
                    description: s.description,
                  },
                ],
              ]
            : [];
        }),
      ),
      gates: b.gates.map((g) => ({
        id: g.id,
        label: g.label,
        title: g.title,
        detail: g.detail,
      })),
      restrictions: b.restrictions.map(String),
      hero_caption: b.hero_caption,
      hero_eyebrow: b.hero_eyebrow,
    },
    records: records
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((r) => ({
        id: r.id,
        asset_id: r.asset_id,
        kind: r.kind,
        title: r.title,
        detail: r.detail,
        evidence_state: r.evidence_state,
        source_type: r.source_type,
        source_ref: r.source_visibility === "public" ? r.source_ref : undefined,
        source_visibility:
          r.source_visibility === "public" ? "public" : undefined,
        occurred_at: r.occurred_at,
        visibility: "public",
        sort_order: r.sort_order,
        group_id: r.group_id,
        group_label: r.group_label,
        value: r.value,
        url: safeUrl(r.url),
        alt: r.alt,
        width: r.width,
        height: r.height,
        media_kind: r.media_kind,
        document_kind: r.document_kind,
        media_type: r.media_type,
        poster: safeUrl(r.poster),
        evidence_classification: r.evidence_classification,
        productionEvidence:
          r.media_kind !== "concept" && r.productionEvidence === true,
        factoryEvidence:
          r.media_kind !== "concept" && r.factoryEvidence === true,
        fieldEvidence: r.media_kind !== "concept" && r.fieldEvidence === true,
        stage_id: r.stage_id,
        event_type: r.event_type,
        test_state: r.test_state,
        target_id: r.target_id,
        evidence_ids: r.evidence_ids?.filter((id) => ids.has(id)),
        photos: r.photos?.map(safeUrl).filter((x): x is string => Boolean(x)),
        decision: r.decision,
        supplier: r.supplier,
      })),
  };
  if (a.current_lifecycle_stage === "production" && !hasProductionEvidence(projection)) {
    projection.asset.current_lifecycle_stage = "configuration";
    projection.asset.status_label = "Awaiting production evidence";
    projection.asset.status_detail = "Configuration planning; public factory or partner production-start evidence is required. Payment and proof approval do not establish production.";
  }
  if (requiresMilestoneEvidence(a.current_lifecycle_stage) &&
      !hasMilestoneEvidence(projection, a.current_lifecycle_stage)) {
    projection.asset.current_lifecycle_stage = "shipping_preparation";
    projection.asset.status_label = "Awaiting shipment evidence";
    projection.asset.status_detail = "Shipping preparation; shipment, receipt and commissioning require separate evidence. Build completion, final payment and packing do not establish shipment.";
  }
  return projection;
}
const milestoneClasses: Record<string, string> = {
  shipping: "shipped", shipped: "shipped", in_transit: "in_transit",
  ocean_freight: "in_transit", arrival: "received", received: "received",
  commissioning: "commissioned", commissioned: "commissioned",
};
function requiresMilestoneEvidence(stage: string) { return stage in milestoneClasses; }
/** Evidence is cargo/asset-specific and classified by the event it establishes.
 * Packing, payment, vessel context and build approval cannot satisfy this gate.
 * Supplier reports can describe transit as reported, but cannot complete it. */
export function hasMilestoneEvidence(p: PassportPublicProjection, stage: string, verifiedOnly = false): boolean {
  const classification = milestoneClasses[stage];
  return Boolean(classification) && p.records.some(r =>
    r.kind === "evidence" && r.asset_id === p.asset.id && r.visibility === "public" && r.media_kind !== "concept" &&
    r.evidence_classification === classification &&
    (r.evidence_state === "verified" || (!verifiedOnly && classification === "in_transit" && r.evidence_state === "submitted")) &&
    (classification === "commissioned" ? ["field", "smashpro"] : classification === "received" ? ["field", "smashpro", "carrier"] : ["supplier", "carrier"]).includes(r.source_type));
}
/** Never infer a production transition from money, proof receipt, or approval. */
export function hasProductionEvidence(p: PassportPublicProjection): boolean {
  return p.records.some(
    (r) =>
      r.kind === "lifecycle_event" &&
      r.event_type === "production_started" &&
      r.stage_id === "production" &&
      ["in_production", "verified"].includes(r.evidence_state) &&
      ["factory", "partner"].includes(r.source_type) &&
      r.evidence_ids?.some((id) =>
        p.records.some(
          (e) =>
            e.id === id &&
            e.kind === "evidence" &&
            ["factory", "partner"].includes(e.source_type) &&
            ["in_production", "verified"].includes(e.evidence_state),
        ),
      ),
  );
}
export function lifecycleStageStatus(
  p: PassportPublicProjection,
  stageId: string,
): "complete" | "current" | "pending" {
  if (requiresMilestoneEvidence(stageId) && !hasMilestoneEvidence(p, stageId)) return "pending";
  const supported = (event: PassportRecord) =>
    event.evidence_ids?.some((id) =>
      p.records.some(
        (e) =>
          e.id === id &&
          e.kind === "evidence" &&
          ![
            "concept",
            "requested",
            "review_pending",
            "rejected",
            "superseded",
          ].includes(e.evidence_state),
      ),
    );
  if (stageId === "production" && !hasProductionEvidence(p)) return "pending";
  if (stageId === "partner_proof") {
    const approved = p.records.some((event) =>
      event.kind === "lifecycle_event" && event.stage_id === stageId &&
      event.event_type === "proof_approved" &&
      ["approved", "verified"].includes(event.evidence_state) &&
      event.evidence_ids?.some((id) => p.records.some((evidence) =>
        evidence.id === id && evidence.kind === "evidence" &&
        ["approved", "verified"].includes(evidence.evidence_state))),
    );
    if (approved) return "complete";
    return p.asset.current_lifecycle_stage === stageId ? "current" : "pending";
  }
  const completed = p.records.some(
    (r) =>
      r.kind === "lifecycle_event" &&
      r.stage_id === stageId &&
      r.event_type === "completion" &&
      r.evidence_state === "verified" &&
      supported(r),
  );
  if (completed && (!requiresMilestoneEvidence(stageId) || hasMilestoneEvidence(p, stageId, true))) return "complete";
  return p.asset.current_lifecycle_stage === stageId ? "current" : "pending";
}
