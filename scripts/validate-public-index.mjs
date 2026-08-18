import { existsSync, readFileSync } from "node:fs";

const payload = JSON.parse(readFileSync(new URL("../dist/equipment-index.json", import.meta.url), "utf8"));
const allowedKeys = new Set([
  "fleet_id", "name", "category", "capability", "capability_badges", "capability_ids",
  "attachment_ids", "discovery_state", "status_label", "public_path", "hero_image",
  "hero_alt", "quick_specs",
]);
const forbiddenKey = /(cost|price|serial|receipt|invoice|password|token|secret|session|customer|private|valuation)/i;
const safeEquipmentPath = (value) => {
  if (typeof value !== "string" || !value.startsWith("/equipment/") || /[?#\\]/.test(value)) return false;
  let decoded = value;
  for (let pass = 0; pass < 3; pass += 1) decoded = decodeURIComponent(decoded);
  return !/(^|\/)\.{1,2}(\/|$)/.test(decoded);
};

if (payload?.version !== 1 || !Array.isArray(payload?.equipment)) throw new Error("Equipment index v1 payload is invalid.");
const ids = new Set();
for (const item of payload.equipment) {
  const keys = Object.keys(item);
  const unexpected = keys.filter((key) => !allowedKeys.has(key) || forbiddenKey.test(key));
  if (unexpected.length) throw new Error(`Unsafe public fields for ${item.fleet_id || "unknown"}: ${unexpected.join(", ")}`);
  if (!/^SP-[A-Z0-9-]{2,80}$/.test(item.fleet_id || "")) throw new Error(`Invalid public fleet ID: ${item.fleet_id || "missing"}`);
  if (ids.has(item.fleet_id)) throw new Error(`Duplicate public fleet ID: ${item.fleet_id}`);
  ids.add(item.fleet_id);
  if (!safeEquipmentPath(item.public_path) || !safeEquipmentPath(item.hero_image)) throw new Error(`Unsafe public path for ${item.fleet_id}`);
  if (!Array.isArray(item.capability_badges) || !Array.isArray(item.capability_ids) || !Array.isArray(item.attachment_ids) || !Array.isArray(item.quick_specs)) throw new Error(`Invalid public arrays for ${item.fleet_id}`);
}

console.log(`Equipment public index validation passed (${payload.equipment.length} customer-safe records).`);

const ardhiManufacturerPdf = new URL("../dist/documents/sp-ardhi-26/yf380-manufacturer-promo-spec-sheet.pdf", import.meta.url);
if (!existsSync(ardhiManufacturerPdf)) throw new Error("SP-ARDHI-26 manufacturer specification PDF was not emitted to dist.");
