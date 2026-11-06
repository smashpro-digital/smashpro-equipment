import test from 'node:test';
import assert from 'node:assert/strict';
import { approvedCatalog } from './fixtures/field-technology.mjs';

globalThis.HTMLElement ??= class {};
globalThis.customElements ??= { get: () => true, define() {} };
const { receivedEquipmentFeature } = await import('../public/equipment-feature-showcase.js');

const feed = {
  placement: 'equipment.field-technology.akaso360',
  product: 'AKASO 360',
  advertiserId: '69454',
  publisherId: '3121518',
  destination: 'https://shopakaso.com/products/akaso-360?variant=44081902846134',
  creativeId: '4587303',
  imageUrl: 'https://www.awin1.com/cshow.php?s=4587303&v=69454&q=542867&r=3121518',
  imageWidth: 2160,
  imageHeight: 2700,
};

test('shared showcase accepts only the approved affiliate identity and preserves the authorization lease', () => {
  const now = Date.now();
  const payload = approvedCatalog(now);
  const product = payload.items[0].products[0];
  product.image = { id: 1, creative_id: feed.creativeId, url: feed.imageUrl, width: 2160, height: 2700, alt: 'AKASO 360 front and rear' };
  const card = receivedEquipmentFeature(payload, feed, null, now, now);
  assert.equal(card.url, product.links[0].url);
  assert.equal(card.disclosure, product.links[0].disclosure);
  assert.deepEqual(card.image, { src: feed.imageUrl, alt: 'AKASO 360 front and rear', width: 2160, height: 2700 });
  assert.ok(card.validUntil <= now + 60000);
});

test('shared showcase rejects invalid projections, links, and expired authorizations', () => {
  const now = Date.now();
  const invalid = [
    payload => { payload.ok = false; },
    payload => { payload.property = 'garage'; },
    payload => { payload.placement = 'other'; },
    payload => { payload.generated_at = new Date(now - 60000).toISOString(); },
    payload => { payload.items[0].products[0].stage = 'Owned'; },
    payload => { payload.items[0].products[0].links[0].advertiser_id = '1'; },
    payload => { payload.items[0].products[0].links[0].url += '&awinmid=69454'; },
    payload => { payload.items[0].products[0].links[0].valid_until = new Date(now - 1).toISOString(); },
  ];
  for (const mutate of invalid) {
    const payload = approvedCatalog(now);
    mutate(payload);
    assert.equal(receivedEquipmentFeature(payload, feed, null, now, now), null);
  }
});

test('unapproved imagery is withheld without invalidating the approved affiliate action', () => {
  const now = Date.now();
  const payload = approvedCatalog(now);
  payload.items[0].products[0].image = {
    id: 1,
    creative_id: '4597556',
    url: 'https://untrusted.invalid/image.jpg',
    width: 100,
    height: 100,
    alt: 'Unapproved image',
  };
  const card = receivedEquipmentFeature(payload, feed, null, now, now);
  assert.ok(card);
  assert.equal(card.image, null);
  assert.equal(card.url, payload.items[0].products[0].links[0].url);
});

test('authorization accounts for server clock skew and request duration', () => {
  const now = Date.now();
  const server = Math.floor((now + 18000) / 1000) * 1000;
  const payload = approvedCatalog(server);
  const card = receivedEquipmentFeature(payload, feed, new Date(server).toUTCString(), now - 500, now);
  assert.ok(card);
  assert.ok(card.validUntil <= now + 60000);
  assert.equal(receivedEquipmentFeature(payload, feed, 'invalid', now, now), null);
  assert.equal(receivedEquipmentFeature(payload, feed, new Date(server).toUTCString(), now - 61000, now), null);
});
