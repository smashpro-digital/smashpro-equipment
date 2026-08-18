import type { CalculatedPackage, Equipment, EquipmentUpgrade, PackageRule, PassportScores } from "../types/equipment";

const normalizedTags = (upgrade: EquipmentUpgrade) => new Set([upgrade.name, ...upgrade.tags].map((tag) => tag.trim().toLowerCase()));

export function calculatePackages(upgrades: EquipmentUpgrade[], rules: PackageRule[]): CalculatedPackage[] {
  const installed = upgrades.filter((upgrade) => upgrade.status === "installed");
  return rules.flatMap((rule) => {
    const qualifying = installed.filter((upgrade) => {
      const tags = normalizedTags(upgrade);
      return rule.requiredTags.some((required) => tags.has(required.toLowerCase()));
    });
    const covered = new Set(qualifying.flatMap((upgrade) => [...normalizedTags(upgrade)]));
    const qualifies = rule.requiredTags.every((required) => covered.has(required.toLowerCase()));
    return qualifies ? [{ id: rule.id, name: rule.packageName, description: rule.description, qualifyingUpgradeIds: qualifying.map(({ id }) => id) }] : [];
  });
}

export function calculatePassportScores(item: Equipment): PassportScores {
  const completedService = item.serviceHistory.filter((record) => record.status === "completed").length;
  const documentKinds = new Set(item.documents.filter((document) => document.publicDisplay || document.kind === "receipt").map(({ kind }) => kind));
  const documentedUpgrades = item.upgrades.filter((upgrade) => upgrade.status === "installed" && (upgrade.imageUrls.length || upgrade.youtubeUrl || upgrade.warranty)).length;
  const documentation = Math.min(100, (documentKinds.has("manual") ? 20 : 0) + (documentKinds.has("spec-sheet") ? 20 : 0) + Math.min(20, item.gallery.length * 3) + Math.min(20, documentedUpgrades * 5) + (item.media.length ? 20 : 0));
  const maintenance = completedService ? Math.min(100, 70 + completedService * 5) : 50;
  return { documentation, maintenance };
}

export function publicTimeline(item: Equipment) {
  return [...item.timeline].filter(({ publicDisplay }) => publicDisplay).sort((a, b) => (a.occurredAt ?? "9999").localeCompare(b.occurredAt ?? "9999"));
}

export function calculateOwnershipMetrics(item: Equipment, today = new Date()) {
  const entry = item.identity.fleetEntryDate ? new Date(`${item.identity.fleetEntryDate}T00:00:00Z`) : undefined;
  const daysInFleet = entry ? Math.max(0, Math.floor((today.getTime() - entry.getTime()) / 86_400_000)) : undefined;
  return { daysInFleet, operatingHours: item.identity.operatingHours, totalAttachments: item.attachments.filter(({ status }) => status !== "removed").length, totalUpgrades: item.upgrades.filter(({ status }) => status === "installed").length, totalVideos: item.media.filter(({ kind }) => kind === "video" || kind === "youtube").length, totalServiceEvents: item.serviceHistory.filter(({ status }) => status === "completed").length };
}

export function generateBuildStory(item: Equipment, packages = calculatePackages(item.upgrades, item.packageRules)) {
  const opening = `${item.identity.model} entered the fleet${item.identity.finish ? ` in ${item.identity.finish}` : ""} as ${item.identity.edition}.`;
  const options = item.factoryOptions.filter(({ publicDisplay }) => publicDisplay).map(({ name }) => name);
  const installed = item.upgrades.filter(({ status }) => status === "installed").map(({ name }) => name);
  const chapters = [opening];
  if (options.length) chapters.push(`Its factory configuration included ${options.join(", ")}.`);
  if (installed.length) chapters.push(`The permanent upgrade ledger documents ${installed.join(", ")}.`);
  if (packages.length) chapters.push(`Those installed systems currently qualify it for the ${packages.map(({ name }) => name).join(" and ")}.`);
  if (item.media.some(({ kind }) => kind === "youtube")) chapters.push("Its continuing story is documented through the SmashPro Garage video archive.");
  else if (item.media.length) chapters.push("Factory and fleet media preserve its build history as the machine evolves.");
  return chapters.join(" ");
}
