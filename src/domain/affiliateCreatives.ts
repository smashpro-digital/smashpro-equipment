export type AffiliateCreative = {
  id: number; creative_record_id: number; creative_id: string; placement_id: number;
  placement: string; campaign_id: number; media_property_id: number; property: 'hq';
  image_url: string; tracking_url: string; width: number; height: number; alt: string;
  weight: number; display_order: number; validUntil: number;
};
const object = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
export function affiliateCreatives(value: unknown, placement: string, campaign: number, lease: number, now: number): AffiliateCreative[] {
  if (!Array.isArray(value) || value.length > 50) return [];
  const seen = new Set<number>();
  return value.flatMap((v): AffiliateCreative[] => {
    if (!object(v) || v.property !== 'hq' || v.placement !== placement || v.campaign_id !== campaign) return [];
    for (const key of ['id', 'creative_record_id', 'placement_id', 'campaign_id', 'media_property_id', 'width', 'height', 'weight']) if (!Number.isSafeInteger(v[key]) || Number(v[key]) < 1) return [];
    if (Number(v.width) > 10000 || Number(v.height) > 10000 || Number(v.weight) > 10 || !Number.isSafeInteger(v.display_order) || Number(v.display_order) < 0 || Number(v.display_order) > 10000 || typeof v.alt !== 'string' || !v.alt.trim() || v.alt.length > 500 || typeof v.creative_id !== 'string' || !/^\d{1,20}$/.test(v.creative_id)) return [];
    const suffix = `?s=${v.creative_id}&v=69454&q=542867&r=3121518`;
    if (v.image_url !== `https://www.awin1.com/cshow.php${suffix}` || v.tracking_url !== `https://www.awin1.com/cread.php${suffix}`) return [];
    const expiry = typeof v.valid_until === 'string' ? Date.parse(v.valid_until) : NaN;
    if (!Number.isFinite(expiry) || expiry <= now || expiry > now + 65000 || seen.has(Number(v.id))) return [];
    seen.add(Number(v.id));
    return [{ id: Number(v.id), creative_record_id: Number(v.creative_record_id), creative_id: v.creative_id, placement_id: Number(v.placement_id), placement, campaign_id: campaign, media_property_id: Number(v.media_property_id), property: 'hq', image_url: v.image_url, tracking_url: v.tracking_url, width: Number(v.width), height: Number(v.height), alt: v.alt, weight: Number(v.weight), display_order: Number(v.display_order), validUntil: Math.min(expiry, lease) }];
  }).sort((a, b) => a.display_order - b.display_order || a.id - b.id);
}

/** Interleaved weighted slots. Ordering breaks ties; each slot lasts eight seconds. */
export function creativeSchedule(creatives: AffiliateCreative[]): number[] {
  const slots: number[] = [];
  for (let round = 0; round < Math.max(0, ...creatives.map(c => c.weight)); round++) for (const creative of creatives) if (round < creative.weight) slots.push(creative.id);
  return slots;
}

export function recordCreativeEvent(creative: AffiliateCreative, event: 'impression' | 'click'): void {
  if (Date.now() >= creative.validUntil || !globalThis.crypto?.randomUUID) return;
  void fetch('/dashboard/api/affiliate_creative_event.php', { method: 'POST', credentials: 'omit', cache: 'no-store', keepalive: true, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ assignment_id: creative.id, event, event_id: crypto.randomUUID() }) }).catch(() => {});
}
