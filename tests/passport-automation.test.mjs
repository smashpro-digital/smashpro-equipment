import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { createServer } from 'vite';
const server=await createServer({configFile:false,esbuild:{jsx:'automatic'},optimizeDeps:{noDiscovery:true,include:[]},server:{middlewareMode:true},appType:'custom'});
const [domain,templates,data,components,fixture,index]=await Promise.all([
  '/src/domain/passportAutomation.ts','/src/domain/passportTemplates.ts','/src/data/passportRecords.ts','/src/components/EquipmentPassport.tsx','/tests/fixtures/passport/testPartner.ts','/src/domain/publicEquipmentIndex.ts',
].map(p=>server.ssrLoadModule(p)));
const {liftmateEquipment}=await server.ssrLoadModule('/src/data/liftmateEquipment.ts');
const {passportPublicPlugin}=await server.ssrLoadModule('/scripts/passport-public-plugin.ts');
await server.close();
const project=domain.projectPassportPublicRecord;
const render=p=>renderToStaticMarkup(React.createElement(MemoryRouter,null,React.createElement(components.EquipmentPassport,{passport:p})));
const lift=data.canonicalPassports.find(p=>p.asset.id==='SP-LIFTMATE-27');

test('build type resolves two real templates and orders a shared section registry',()=>{
  assert.deepEqual(Object.keys(templates.passportTemplates).sort(),['factory_import','partner_build']);
  for(const p of data.canonicalPassports){assert.equal(templates.passportTemplates[p.asset.build_type].type,p.asset.build_type);for(const s of templates.passportTemplates[p.asset.build_type].sections)assert.equal(typeof components.passportSections[s.key],'function');}
  assert.deepEqual(templates.passportTemplates.partner_build.lifecycleStages.map(s=>s.id),['concept','configuration','partner_proof','build_authorization','production','factory_qc','packing','shipping','arrival','commissioning','field_validation','long_term_use']);
});
test('privacy is structural across projection, markup and index JSON, including nested injected keys',()=>{
  const canonical=structuredClone(fixture.testPartner);
  const secret={partner_price:918271,deposit_amount:918272,private_email:'private-canary@example.invalid',private_phone:'private-phone-canary',refund_amount:918273};
  canonical.procurement=secret;
  Object.assign(canonical.asset,secret);Object.assign(canonical.build,secret);Object.assign(canonical.build.gates[0],secret);
  canonical.build.sections.private_email={eyebrow:'PRIVATE SECTION CANARY',title:'PRIVATE SECTION CANARY',description:'PRIVATE SECTION CANARY'};
  for(const r of canonical.records)Object.assign(r,secret);
  canonical.records.push({...canonical.records[0],id:'private-record-canary',visibility:'private',title:'PRIVATE RECORD CANARY'});
  canonical.records[0].source_ref='PRIVATE SOURCE CANARY';canonical.records[0].source_visibility='private';
  const publicRecord=project(canonical);
  for(const output of [JSON.stringify(publicRecord),render(publicRecord),JSON.stringify(index.publicEquipmentIndexRow(liftmateEquipment,publicRecord)),passportPublicPlugin([canonical]).load('\0virtual:passport-public')]) {
    for(const [key,value] of Object.entries(secret)){assert.ok(!output.includes(key),key);assert.ok(!output.includes(String(value)),String(value));}
    for(const value of ['PRIVATE RECORD CANARY','private-record-canary','PRIVATE SOURCE CANARY','PRIVATE SECTION CANARY'])assert.ok(!output.includes(value));
  }
});
test('proof receipt, proof approval and deposit never authorize production',()=>{
  for(const event_type of ['proof_received','proof_approved','deposit_paid','authorization']){
    const c=structuredClone(fixture.testPartner);c.asset.current_lifecycle_stage='production';
    c.records.push({...c.records[5],id:'gate',stage_id:'production',event_type,evidence_state:'approved',source_type:'partner'});
    const p=project(c);assert.equal(domain.hasProductionEvidence(p),false);assert.doesNotMatch(render(p),/Current Stage<\/span><strong>Production/);
  }
  const c=structuredClone(fixture.testPartner);c.asset.current_lifecycle_stage='production';
  c.records[4].evidence_state='in_production';c.records[4].source_type='factory';
  c.records.push({...c.records[5],id:'production',stage_id:'production',event_type:'production_started',evidence_state:'in_production',source_type:'factory'});
  assert.equal(domain.hasProductionEvidence(project(c)),true);
  c.records[4].visibility='private';assert.equal(domain.hasProductionEvidence(project(c)),false);
});
test('concept art cannot become production, factory or field evidence',()=>{
  const c=structuredClone(fixture.testPartner);Object.assign(c.records[0],{productionEvidence:true,factoryEvidence:true,fieldEvidence:true});
  const media=project(c).records[0];assert.equal(media.productionEvidence,false);assert.equal(media.factoryEvidence,false);assert.equal(media.fieldEvidence,false);
  assert.match(render(project(c)),/data-media-kind="concept"/);
});
test('public links reject authenticated, credential-bearing and script destinations',()=>{
  for(const url of ['javascript:alert(1)','https://user:password@example.invalid/file','https://example.invalid/file?token=PRIVATE-TOKEN','/equipment/private/file']){
    const c=structuredClone(fixture.testPartner);c.records[0].url=url;assert.equal(project(c).records[0].url,undefined);
  }
});
test('production completion cannot bypass start evidence and private record references are removed',()=>{
  const c=structuredClone(fixture.testPartner);
  c.records[5].stage_id='production';
  assert.equal(domain.lifecycleStageStatus(project(c),'production'),'pending');
  c.records[4].visibility='private';assert.deepEqual(project(c).records.find(r=>r.id==='test-lifecycle').evidence_ids,[]);
});
test('received partner proof remains under review until an explicit supported approval',()=>{
  const c=structuredClone(fixture.testPartner);c.asset.current_lifecycle_stage='partner_proof';
  Object.assign(c.records[5],{stage_id:'partner_proof',event_type:'proof_received',evidence_state:'submitted'});
  assert.equal(domain.lifecycleStageStatus(project(c),'partner_proof'),'current');
  Object.assign(c.records[5],{event_type:'proof_approved',evidence_state:'approved'});
  assert.equal(domain.lifecycleStageStatus(project(c),'partner_proof'),'current');
  c.records[4].evidence_state='approved';
  assert.equal(domain.lifecycleStageStatus(project(c),'partner_proof'),'complete');
  assert.equal(domain.lifecycleStageStatus(project(c),'production'),'pending');
  c.records[4].visibility='private';
  assert.equal(domain.lifecycleStageStatus(project(c),'partner_proof'),'current');
});
test('new fixture renders identity, hero, partner, config, lifecycle, specs, history and honest gaps from data',()=>{
  const html=render(project(fixture.testPartner));
  for(const value of ['SP-TEST-PARTNER-27','SPP-TEST-0001','Fixture Partner','Fixture Platform','Fixture planning','Fixture wiring','Fixture capacity','Fixture history','Factory media','Pending public record','No downloadable file is published.','data-passport-renderer="generic"'])assert.ok(html.includes(value),value);
  assert.doesNotMatch(html,/id="field-tests"/);
  assert.ok(!data.canonicalPassports.some(p=>p.asset.id==='SP-TEST-PARTNER-27'));
});
test('LiftMate generic rendering preserves identity, proposal boundaries, sections and relationships',()=>{
  const p=project(lift),html=render(p);
  for(const value of ['SP-LIFTMATE-27','SPP-2027-0001','Pairon Tools','Glide200','2027','RAL 6018','Vehicle fitment not yet validated','Factory media','OEM documentation','Partnership case study / results','https://smashpro.app/pairon-tools-factory-to-field/','sp-liftmate-27-official-concept.png','Official Pairon product image'])assert.ok(html.includes(value),value);
  assert.match(html,/data-evidence-state="requested"/);assert.match(html,/data-evidence-state="review_pending"/);
  assert.equal(p.records.filter(r=>r.kind==='field_test').length,5);
  for(const s of components.visiblePassportSections(p))assert.ok(html.includes(`id="${s.id}"`));
  const app=readFileSync('src/app/App.tsx','utf8');assert.match(app,/genericPassportRoutes\.map/);assert.doesNotMatch(app,/LiftMatePassportPage/);
});
test('index uses the same projected identity, status, hero and confirmed specifications',()=>{
  const p=project(lift),row=index.publicEquipmentIndexRow(liftmateEquipment,p);
  assert.equal(row.fleet_id,p.asset.fleet_id);assert.equal(row.status_label,p.asset.status_label);assert.equal(row.hero_image,p.records.find(r=>r.id===p.asset.hero_media_id).url);
  assert.deepEqual(row.quick_specs,p.records.filter(r=>r.kind==='specification'&&r.evidence_state==='verified').slice(0,4).map(r=>`${r.title}: ${r.value}`));
});
test('ARDHI renderer, CSS, deployment gates and index validator remain protected',()=>{
  const baseline=JSON.parse(readFileSync('tests/fixtures/passport/ardhi-protected.json'));
  for(const [path,hash] of Object.entries(baseline.files))assert.equal(createHash('sha256').update(readFileSync(path,'utf8').replaceAll('\r\n','\n')).digest('hex'),hash,path);
  const extracted=readFileSync('src/data/ardhiEvidenceHistory.ts','utf8');
  const block=extracted.slice(extracted.indexOf('type EvidenceHistoryEntry =')).trimEnd().replace('export const DRIVE_EVIDENCE_HISTORY:','const DRIVE_EVIDENCE_HISTORY:')+'\n';
  assert.equal(createHash('sha256').update(block.replaceAll('\r\n','\n')).digest('hex'),baseline.historyBlockHash);
  const p=project(data.canonicalPassports.find(p=>p.asset.id==='SP-ARDHI-26'));
  for(const value of ['SPP-2026-0001','YF380','RAL 6018','Three-Pump','yf380-manufacturer-promo-spec-sheet.pdf','yfe380-operator-instruction-manual.pdf'])assert.ok(JSON.stringify(p).includes(value),value);
});
