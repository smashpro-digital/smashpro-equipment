export type RecommendationEquipment = { fleetId: string; capabilityIds?: string[]; attachmentIds?: string[] };
export type RecommendationService = {
  slug: string;
  equipment_required?: string | null;
  attachment_required_id?: string | null;
  required_capability_ids?: string[] | string | null;
};

export function canonicalIds(value: unknown): string[] {
  let source = value;
  if (typeof source === "string") {
    const serialized = source;
    try { source = JSON.parse(serialized); } catch { source = serialized.split(","); }
  }
  if (!Array.isArray(source)) return [];
  return [...new Set(source.map((item) => String(item).trim().toLowerCase()).filter((item) => /^[a-z0-9_-]{2,80}$/.test(item)))];
}

export function equipmentSupportsService(equipment: RecommendationEquipment, service: RecommendationService): boolean {
  if (service.equipment_required?.toUpperCase() === equipment.fleetId.toUpperCase()) return true;
  const required = canonicalIds(service.required_capability_ids);
  const capabilities = canonicalIds(equipment.capabilityIds);
  if (!required.length || required.some((id) => !capabilities.includes(id))) return false;
  const attachment = canonicalIds([service.attachment_required_id])[0];
  return !attachment || canonicalIds(equipment.attachmentIds).includes(attachment);
}

export function recommendedServices<T extends RecommendationService>(equipment: RecommendationEquipment, services: T[]): T[] {
  return services.filter((service) => equipmentSupportsService(equipment, service)).sort((left, right) => {
    const leftExplicit = left.equipment_required?.toUpperCase() === equipment.fleetId.toUpperCase() ? 0 : 1;
    const rightExplicit = right.equipment_required?.toUpperCase() === equipment.fleetId.toUpperCase() ? 0 : 1;
    return leftExplicit - rightExplicit || left.slug.localeCompare(right.slug);
  });
}
