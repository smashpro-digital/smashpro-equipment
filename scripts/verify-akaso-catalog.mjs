import assert from 'node:assert/strict';
import { FIELD_CATALOG_URL, receivedFieldTechnologyCard } from '../src/domain/fieldTechnology.ts';

const origin = 'https://smashpro.app';
async function read(path) {
  return fetch(new URL(path, origin), { redirect: 'error', cache: 'no-store', signal: AbortSignal.timeout(20000), headers: { Accept: 'application/json' } });
}
const started = Date.now();
const response = await read(FIELD_CATALOG_URL);
assert.equal(response.status, 200);
assert.match(response.headers.get('content-type') ?? '', /^application\/json/);
assert.match(response.headers.get('cache-control') ?? '', /no-store/);
const payload = await response.json();
const card = receivedFieldTechnologyCard(payload, response.headers.get('date'), started);
assert.ok(card, 'HQ must authorize exactly one current Equipment AKASO 360 link');
function keys(row, expected) { assert.deepEqual(Object.keys(row).sort(), expected.sort(), 'Public projection must contain only approved fields'); }
keys(payload, ['ok','schema_version','property','placement','generated_at','items']);
const partner = payload.items[0], product = partner.products[0], link = product.links[0];
keys(partner, ['name','classification','products']);
keys(product, ['id','name','description','stage','featured','links', ...('image' in product ? ['image'] : []), ...('creatives' in product ? ['creatives'] : [])]);
if ('creatives' in product) {
  assert.equal(card.creatives.length, product.creatives.length);
  for (const creative of product.creatives) keys(creative, ['id','creative_record_id','creative_id','placement_id','placement','campaign_id','media_property_id','property','image_url','tracking_url','width','height','alt','weight','display_order','valid_until']);
}
if ('image' in product) {
  keys(product.image, ['id','creative_id','url','width','height','alt']);
  assert.ok(card?.image, 'Published image must match the reviewed creative');
}
keys(link, ['url','advertiser_id','publisher_id','placement','campaign_id','property','disclosure','valid_until']);
assert.match(link.disclosure, /commission/i);
assert.equal(link.url, 'https://www.awin1.com/cread.php?awinmid=69454&awinaffid=3121518&campaign=akaso+360+spring+sale&clickref=smashpro360&ued=https%3A%2F%2Fshopakaso.com%2Fproducts%2Fakaso-360%3Fvariant%3D44081902846134');
assert.equal((await read(FIELD_CATALOG_URL.replace('property=hq', 'property=garage'))).status, 400);
assert.equal((await read('/dashboard/api/public_gear.php?property=hq&placement=unknown')).status, 400);
assert.equal((await read('/dashboard/api/affiliate_foundation.php?action=catalog')).status, 401);
console.log('Live Equipment catalog: approved AKASO 360, original link, disclosure, public allowlist and Garage/admin boundaries passed.');
