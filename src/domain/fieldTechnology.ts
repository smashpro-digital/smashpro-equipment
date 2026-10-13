export const FIELD_PLACEMENT = 'equipment.field-technology.akaso360';
export const FIELD_CATALOG_URL = `/dashboard/api/public_gear.php?property=hq&placement=${FIELD_PLACEMENT}`;

export type FieldTechnologyCard = { name: string; description: string; url: string; disclosure: string; validUntil: number };
const record = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value);
const text = (value: unknown, max: number): value is string => typeof value === 'string' && value.trim().length > 0 && value.length <= max;

/** Validate HQ's public projection, never infer authorization from a working URL. */
export function fieldTechnologyCard(payload: unknown, now = Date.now()): FieldTechnologyCard | null {
  if (!record(payload) || payload.ok !== true || payload.schema_version !== 1 || payload.property !== 'hq' || payload.placement !== FIELD_PLACEMENT) return null;
  const generated = typeof payload.generated_at === 'string' ? Date.parse(payload.generated_at) : NaN;
  if (!Number.isFinite(generated) || generated > now + 5000 || now - generated >= 60000) return null;
  if (!Array.isArray(payload.items) || payload.items.length !== 1) return null;
  const partner = payload.items[0];
  if (!record(partner) || partner.classification !== 'Affiliate relationship' || !Array.isArray(partner.products) || partner.products.length !== 1) return null;
  const product = partner.products[0];
  if (!record(product) || product.name !== 'AKASO 360' || product.stage !== 'Exploring' || !text(product.description, 1200) || !Array.isArray(product.links) || product.links.length !== 1) return null;
  const link = product.links[0];
  if (!record(link) || link.property !== 'hq' || link.placement !== FIELD_PLACEMENT || link.advertiser_id !== '69454' || link.publisher_id !== '3121518' || !Number.isSafeInteger(link.campaign_id) || Number(link.campaign_id) <= 0 || !text(link.disclosure, 1000) || !text(link.url, 2000)) return null;
  const validUntil = typeof link.valid_until === 'string' ? Date.parse(link.valid_until) : NaN;
  if (!Number.isFinite(validUntil) || validUntil <= now || validUntil > generated + 60000) return null;
  try {
    const url = new URL(link.url);
    if (url.protocol !== 'https:' || url.hostname !== 'www.awin1.com' || url.pathname !== '/cread.php' || url.username || url.password || url.port || url.hash || /[\s\\]/.test(link.url)) return null;
    const query = url.searchParams;
    if (new Set(query.keys()).size !== [...query.keys()].length || query.get('awinmid') !== '69454' || query.get('awinaffid') !== '3121518' || query.has('v') || query.has('r')) return null;
    if (query.get('ued') !== 'https://shopakaso.com/products/akaso-360?variant=44081902846134') return null;
  } catch { return null; }
  return { name: product.name, description: product.description, url: link.url, disclosure: link.disclosure, validUntil };
}
