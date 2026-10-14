import type { Equipment } from "../types/equipment";

/** Select existing verified values; never substitute proposal values for missing evidence. */
export function fleetCardSpecs(item: Equipment) {
  const labels = item.showroomCard?.specLabels;
  const candidates = labels
    ? labels.map(label => item.specifications.find(spec => spec.label === label))
    : item.specifications.filter(spec => !/^(Fleet ID|Manufacturer|OEM Model|Factory model|Model Year|Machine type)$/i.test(spec.label));
  return candidates.filter((spec): spec is Equipment["specifications"][number] => Boolean(spec?.confirmed && spec.value.trim())).slice(0, 2);
}
