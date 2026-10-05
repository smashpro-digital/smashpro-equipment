import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { createServer } from 'vite';
const server=await createServer({configFile:false,optimizeDeps:{noDiscovery:true,include:[]},server:{middlewareMode:true,hmr:false},appType:'custom'});
try {
  const {canonicalPassports}=await server.ssrLoadModule('/src/data/passportRecords.ts');
  const {projectPassportPublicRecord}=await server.ssrLoadModule('/src/domain/passportAutomation.ts');
  const {publicEquipmentIndexRow}=await server.ssrLoadModule('/src/domain/publicEquipmentIndex.ts');
  const {equipment}=await server.ssrLoadModule('/src/data/equipment.ts');
  const index=JSON.parse(readFileSync('dist/equipment-index.json','utf8'));
  for(const canonical of canonicalPassports.filter(p=>p.build.renderer==='generic')) {
    const row=publicEquipmentIndexRow(equipment.find(e=>e.fleetId===canonical.asset.id),projectPassportPublicRecord(canonical));
    assert.deepEqual(index.equipment.find(e=>e.fleet_id===row.fleet_id),row);
  }
  const bundle=readdirSync('dist/assets').filter(p=>p.endsWith('.js')).map(p=>readFileSync(`dist/assets/${p}`,'utf8')).join('\n');
  for(const value of ['SP-TEST-PARTNER-27','private-canary@example.invalid','private-phone-canary','partner_price','deposit_amount','refund_amount','PRIVATE SECTION CANARY']) {
    assert.ok(!bundle.includes(value),`Client bundle contains ${value}`);
    assert.ok(!JSON.stringify(index).includes(value),`Public index contains ${value}`);
  }
  assert.match(bundle,/data-passport-renderer/);
  console.log('Passport artifacts passed: shared projection/index consistency; test fixture and procurement fields absent from public bundle/index.');
} finally { await server.close(); }
