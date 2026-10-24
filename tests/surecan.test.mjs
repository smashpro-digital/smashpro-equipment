import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const data=JSON.parse(readFileSync('src/data/surecan-public.json','utf8'));
test('HQ public snapshot distinguishes fuel cans and green nonfuel race jug',()=>{
  assert.equal(data.products.length,6);
  assert.equal(new Set(data.products.map(p=>p.sku)).size,6);
  assert.equal(data.affiliate_url,'https://www.surecanusa.com/?ref=smashpro');
  assert.equal(data.discount_code,'SMASHPRO');assert.equal(data.customer_discount_percent,10);
  const race=data.products.find(p=>p.sku==='SUR5RJG');assert.equal(race.color,'Green');assert.equal(race.price,29.99);assert.equal(race.capacity,'5.5 gallons');assert.match(race.use,/Not for fuel or kerosene/);
  assert.deepEqual(data.products.filter(p=>p.sku!=='SUR5RJG').map(p=>p.price),[57.5,77.5,57.5,77.5,77.5]);
  for(const p of data.products){assert.equal(new URL(p.source_url).hostname,'www.surecanusa.com');assert.equal(new URL(p.image_url).hostname,'static.wixstatic.com');assert(p.image_alt.includes(p.color.toLowerCase()));}
  for(const key of ['commission_percent','acquisition_cost','gifted_retail_value','conversions','revenue','source_manifest'])assert(!JSON.stringify(data).includes(key));
});
