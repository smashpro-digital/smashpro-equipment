import type { Equipment } from "../types/equipment";
import type { PassportPublicProjection } from "./passportAutomation";
/** The showroom summary retains its v1 contract; migrated fields use the same projection as React. */
export function publicEquipmentIndexRow(
  item: Equipment,
  passport?: PassportPublicProjection,
) {
  const a = passport?.asset;
  return {
    fleet_id: a?.fleet_id ?? item.fleetId,
    name: a?.name ?? item.name,
    asset_group: item.showroomGroup,
    showroom_order: item.showroomOrder,
    category: item.category,
    capability: item.capabilityStatement,
    capability_badges: item.capabilities.slice(0, 6),
    capability_ids: item.capabilityIds ?? [],
    attachment_ids: item.attachmentIds ?? [],
    discovery_state: "discoverable",
    status_label: a?.status_label ?? item.statusLabel,
    public_path: `/equipment${a?.public_path ?? item.publicPath}`,
    hero_image: passport
      ? (passport.records.find((r) => r.id === a?.hero_media_id)?.url ?? "")
      : item.heroImage,
    hero_alt: `${a?.fleet_id ?? item.fleetId} ${item.category}`,
    quick_specs: passport
      ? passport.records
          .filter(
            (r) =>
              r.kind === "specification" && r.evidence_state === "verified",
          )
          .slice(0, 4)
          .map((r) => `${r.title}: ${r.value}`)
      : item.specifications
          .filter((s) => s.confirmed)
          .slice(0, 4)
          .map((s) => `${s.label}: ${s.value}`),
  };
}
