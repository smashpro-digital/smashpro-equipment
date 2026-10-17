import { fieldTechnologyCard, type FieldTechnologyCard } from './fieldTechnology.ts';
export const MEDIA_ASSET = 'SP-MED-CAM-001';
export const MEDIA_API = `/dashboard/api/public_media_equipment.php?property=hq&asset=${MEDIA_ASSET}`;
export const EQUIPMENT_CHANNEL = 'UC2wKsAtGR55PZMAUNuk2r6g';
export type FieldMediaVideo = {
  id: number; videoId: string; title: string; description: string; url: string;
  thumbnail: string | null; category: string; relatedAsset: string; recordingDevice: string | null;
  status: 'published'; displayOrder: number; publishedAt: string | null; channelId: string; campaignId: number | null;
};
export type FieldKitItem = {name: string; group: 'included' | 'purchased' | 'owned'; note: string};
export type MediaPassport = {
  assetId: string; campaignId: number | null; validUntil: number; propertyId: number; card: FieldTechnologyCard | null;
  identity: Record<'name'|'manufacturer'|'bundle'|'category'|'status'|'summary', string>;
  footage: FieldMediaVideo[]; fieldKit: FieldKitItem[];
  accessories: {product_id: string; name: string; description: string; prototype_status: string; revision: string|null; material: string|null}[];
};
const record = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
/** HTTPS origin Date avoids rejecting legitimate leases on a skewed device clock.
 * Charge the entire request duration against the lease; never extend it. */
export function receivedMediaPassport(value: unknown, serverDate: string | null, started: number, now = Date.now()): MediaPassport | null {
  const serverNow = serverDate ? Date.parse(serverDate) : now;
  if (!Number.isFinite(serverNow) || started > now) return null;
  const parsed = mediaPassport(value, serverNow);
  if (!parsed) return null;
  const remaining = parsed.validUntil - serverNow - (now - started);
  if (remaining <= 0 || remaining > 60000) return null;
  parsed.validUntil = now + remaining;
  if (parsed.card) {
    const linkRemaining = parsed.card.validUntil - serverNow - (now - started);
    if (linkRemaining <= 0) parsed.card = null;
    else parsed.card.validUntil = now + Math.min(remaining, linkRemaining);
  }
  return parsed;
}
export function mediaPassport(value: unknown, now = Date.now()): MediaPassport | null {
  if (!record(value) || value.ok !== true || value.schema_version !== 1 || value.property !== 'hq') return null;
  const generated = Date.parse(String(value.generated_at)); const until = Date.parse(String(value.valid_until));
  if (!Number.isFinite(generated) || generated > now + 5000 || now - generated >= 60000 || !Number.isFinite(until) || until <= now || until > generated + 60000) return null;
  const p = value.passport;
  if (!record(p) || p.asset_id !== MEDIA_ASSET || !record(p.identity) || p.placement !== 'equipment.media.sp-med-cam-001' || !Number.isSafeInteger(p.media_property_id) || Number(p.media_property_id) < 1 || !Array.isArray(p.footage) || !Array.isArray(p.accessories) || !record(p.kit) || p.kit.commerce_eligible !== false) return null;
  const identity: Record<string,string> = {};
  for (const key of ['name','manufacturer','bundle','category','status','summary']) {
    const text=p.identity[key]; if(typeof text !== 'string' || !text.trim() || text.length > 1200) return null; identity[key]=text;
  }
  const footage: MediaPassport['footage'] = [];
  for (const item of p.footage) {
    if (!record(item) || (item.capture_device !== MEDIA_ASSET && item.subject_equipment !== MEDIA_ASSET) || typeof item.title !== 'string' || !Number.isSafeInteger(item.id) || typeof item.url !== 'string') continue;
    // Subject-only media must explicitly carry Equipment publication approval.
    if (item.publication_status !== 'published' || item.channel_id !== EQUIPMENT_CHANNEL || item.approval_status !== 'approved') continue;
    let videoId: string;
    try { const url = new URL(item.url); if (url.protocol !== 'https:' || url.username || url.password || url.port || !['youtube.com','www.youtube.com','youtu.be'].includes(url.hostname)) continue;
      const id = url.hostname === 'youtu.be' ? url.pathname.slice(1) : url.pathname.startsWith('/shorts/') ? url.pathname.slice(8) : url.pathname === '/watch' ? url.searchParams.get('v') : '';
      if (!id || !/^[A-Za-z0-9_-]{11}$/.test(id)) continue;
      videoId = id;
    } catch { continue; }
    const thumbnail = typeof item.thumbnail_url === 'string' && /^\/equipment\/images\/[a-z0-9-]+\.(jpg|webp|png)$/.test(item.thumbnail_url) ? item.thumbnail_url : null;
    footage.push({id:Number(item.id),videoId,title:item.title.slice(0,220),description:typeof item.description==='string'?item.description.slice(0,1000):'',url:`https://www.youtube.com/watch?v=${videoId}`,thumbnail,
      category:typeof item.category==='string'?item.category:'Field testing',relatedAsset:MEDIA_ASSET,recordingDevice:item.capture_device===MEDIA_ASSET?MEDIA_ASSET:null,
      status:'published',displayOrder:Number.isSafeInteger(item.display_order)?Number(item.display_order):0,publishedAt:typeof item.published_at==='string'&&Number.isFinite(Date.parse(item.published_at))?item.published_at:null,channelId:EQUIPMENT_CHANNEL,campaignId:Number.isSafeInteger(item.campaign_id)?Number(item.campaign_id):null});
  }
  footage.sort((a,b)=>a.displayOrder-b.displayOrder||a.id-b.id);
  const fieldKit: FieldKitItem[]=[];
  if (Array.isArray(p.field_kit)) for (const item of p.field_kit) {
    if(!record(item)||typeof item.name!=='string'||!['included','purchased','owned'].includes(String(item.group)))continue;
    fieldKit.push({name:item.name.slice(0,180),group:item.group as FieldKitItem['group'],note:typeof item.note==='string'?item.note.slice(0,500):''});
  }
  const accessories: MediaPassport['accessories'] = [];
  for (const item of p.accessories) {
    if (!record(item) || item.commerce_eligible !== false || item.compatibility !== MEDIA_ASSET || typeof item.product_id !== 'string' || typeof item.name !== 'string' || typeof item.prototype_status !== 'string') continue;
    accessories.push({product_id:item.product_id,name:item.name,description:typeof item.description==='string'?item.description:'',prototype_status:item.prototype_status,revision:typeof item.revision==='string'?item.revision:null,material:typeof item.material==='string'?item.material:null});
  }
  const card=fieldTechnologyCard({ok:true,schema_version:1,property:'hq',placement:p.placement,generated_at:value.generated_at,items:p.catalog},now,p.placement);
  const catalog=p.catalog as {products:{links:{campaign_id:number}[]}[]}[];
  return {assetId:MEDIA_ASSET,campaignId:card?catalog[0].products[0].links[0].campaign_id:null,validUntil:until,propertyId:Number(p.media_property_id),identity:identity as MediaPassport['identity'],footage,fieldKit,accessories,card};
}
