import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const server=await createServer({configFile:false,esbuild:{jsx:'automatic'},optimizeDeps:{noDiscovery:true,include:[]},server:{middlewareMode:true,hmr:false},appType:'custom'});
const {equipment}=await server.ssrLoadModule('/src/data/equipment.ts');
const {attachments}=await server.ssrLoadModule('/src/data/attachments.ts');
await server.close();
test('every public equipment identity omits manufacturer-specific identifiers',()=>{
  for(const item of equipment) for(const key of ['serialNumberPublic','serialNumber','manufacturerJobId','vin','manufacturer_serial']) assert.equal(item.identity?.[key],undefined,`${item.fleetId}: restricted identity field`);
  for(const item of attachments) for(const key of ['serialNumber','manufacturerJobId','manufacturer_serial','vin']) assert.equal(item.receiving?.[key],undefined,`${item.passportId}: restricted identity field`);
});
test('Loflin public identity and hold survive restricted-data removal',()=>{
  const grapple=attachments.find(item=>item.passportId==='SP-ATT-GRP-001');
  assert.equal(grapple.assetTag,'SP-GRP-ARDHI-01');assert.equal(grapple.model,'SMPRMINIRG');
  assert.equal(grapple.status,'commissioning');assert.equal(grapple.commissionedAt,undefined);assert.deepEqual(grapple.verifiedFleetIds,[]);
  assert.equal(grapple.receiving.statusLabel,'Delivered · Fitment Review Required');
  assert.match(grapple.hydraulicRequirement.pressure,/3,200 PSI/);
  assert.ok(grapple.receiving.timeline.filter(e=>['commissioning','field-test'].includes(e.id)).every(e=>e.status==='pending'));
  assert.equal(grapple.procurement,undefined);assert.deepEqual(grapple.receiving.commissioningChecklist,[]);
  assert.ok(!grapple.fieldEvidence.some(e=>[1023,1031,1052,1056].includes(e.wordpressMediaId)));
});
test('restricted MZIGO originals cannot enter the public gallery',()=>{
  const held=JSON.parse(readFileSync('scripts/security/restricted-media.json','utf8'));
  for(const item of equipment) for(const media of item.gallery??[]) assert.ok(!held.some(path=>media.src?.endsWith(path)),`${item.fleetId}: held media reference`);
});

test('approved public plate derivative matches reviewed lossless masks',()=>{
  const recipe=JSON.parse(readFileSync('scripts/security/loflin-public-plate-redaction.json','utf8'));
  const bytes=readFileSync(recipe.output);
  assert.equal(createHash('sha256').update(bytes).digest('hex'),recipe.output_sha256);
  assert.equal(bytes.subarray(1,4).toString(),'PNG');
  assert.deepEqual([bytes.readUInt32BE(16),bytes.readUInt32BE(20)],recipe.dimensions);
  assert.deepEqual(recipe.masks.map(m=>m.field),['manufacturer_serial','manufacturer_job_id','qr_code']);
  assert.ok(attachments.find(a=>a.passportId==='SP-ATT-GRP-001').fieldEvidence.some(e=>e.image.endsWith(recipe.output)));
});
