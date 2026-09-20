import type { Equipment } from "../types/equipment";

/** Fail the public build before an ambiguous identity or route can be published. */
export function validatePassportIdentities(items: Equipment[]): void {
  const passports = new Set<string>(), fleets = new Set<string>(), paths = new Set<string>(), operational = new Set<string>();
  for (const item of items) {
    if (!/^SPP-\d{4}-\d{4}$/.test(item.identity.passportId)) throw new Error("Invalid equipment passport ID");
    if (passports.has(item.identity.passportId) || fleets.has(item.fleetId) || paths.has(item.publicPath) || (item.operationalAssetId && operational.has(item.operationalAssetId))) throw new Error("Duplicate equipment identity or public route");
    passports.add(item.identity.passportId); fleets.add(item.fleetId); paths.add(item.publicPath);
    if (item.operationalAssetId) operational.add(item.operationalAssetId);
  }
}
