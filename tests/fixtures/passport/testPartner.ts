import type {
  CanonicalPassport,
  PassportRecord,
} from "../../../src/domain/passportAutomation";
const asset_id = "SP-TEST-PARTNER-27";
const row = (
  id: string,
  kind: PassportRecord["kind"],
  title: string,
  detail: string,
): PassportRecord => ({
  id,
  asset_id,
  kind,
  title,
  detail,
  evidence_state: "requested",
  source_type: "smashpro",
  source_ref: "automation-fixture",
  source_visibility: "public",
  visibility: "public",
  sort_order: 0,
});
export const testPartner: CanonicalPassport = {
  asset: {
    id: asset_id,
    slug: "sp-test-partner-27",
    fleet_id: asset_id,
    passport_id: "SPP-TEST-0001",
    name: "Automation fixture",
    manufacturer: "Fixture Partner",
    oem_model: "Fixture Platform",
    model_year: 2027,
    asset_class: "Test equipment",
    build_type: "partner_build",
    hero_media_id: "test-hero",
    current_lifecycle_stage: "configuration",
    status_label: "Fixture planning",
    status_detail: "Non-production fixture; no physical equipment claimed.",
    public_path: "/sp-test-partner-27.html",
    edition: "Test edition",
    overview: "Created from canonical data alone.",
  },
  build: {
    id: "test-build",
    asset_id,
    build_type: "partner_build",
    renderer: "generic",
    sections: {
      overview: {
        eyebrow: "Test overview",
        title: "Data-only Passport",
        description: "No dedicated React page.",
      },
    },
    gates: [
      {
        id: "test-planning",
        label: "Current phase",
        title: "Planning",
        detail: "Awaiting evidence.",
      },
    ],
    restrictions: ["Not an operational asset."],
    hero_caption: "Concept fixture only.",
    hero_eyebrow: "Automation test",
  },
  records: [
    {
      ...row("test-hero", "media", "Fixture concept", "Not factory evidence."),
      url: "/equipment/images/sp-liftmate-27-official-concept.png",
      alt: "Fixture concept",
      media_kind: "concept",
      evidence_state: "concept",
      width: 1536,
      height: 1024,
    },
    row("test-partner", "partner", "Fixture Partner", "Proposed relationship."),
    row(
      "test-config",
      "configuration",
      "Fixture wiring",
      "Engineering review required.",
    ),
    {
      ...row(
        "test-spec",
        "specification",
        "Fixture capacity",
        "OEM claim only.",
      ),
      value: "10 units",
      group_id: "test-capacity",
      evidence_state: "submitted",
    },
    {
      ...row(
        "test-history",
        "evidence",
        "Fixture history",
        "Planning recorded.",
      ),
      occurred_at: "2026-10-04",
      evidence_state: "submitted",
    },
    {
      ...row(
        "test-lifecycle",
        "lifecycle_event",
        "Concept recorded",
        "Planning only.",
      ),
      stage_id: "concept",
      event_type: "completion",
      evidence_state: "verified",
      evidence_ids: ["test-history"],
    },
  ],
};
