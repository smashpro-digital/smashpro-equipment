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
const {equipment}=await server.ssrLoadModule('/src/data/equipment.ts');
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

test('credential fragments are excluded from public links, posters, photos and emitted output',()=>{
  for(const url of ['https://example.invalid/callback#access_token=FRAGMENT-CANARY','https://example.invalid/#/callback?password=FRAGMENT-CANARY','/equipment/file#%73ecret=FRAGMENT-CANARY']){
    const c=structuredClone(fixture.testPartner);Object.assign(c.records[0],{url,poster:url,photos:[url]});
    const p=project(c);assert.equal(p.records[0].url,undefined);assert.equal(p.records[0].poster,undefined);assert.deepEqual(p.records[0].photos,[]);
    for(const output of [JSON.stringify(p),render(p),passportPublicPlugin([c]).load('\0virtual:passport-public')])assert.ok(!output.includes('FRAGMENT-CANARY'));
  }
  for(const url of ['#history-test','https://example.invalid/manual#controller','/equipment/manual.pdf#page=2']){
    const c=structuredClone(fixture.testPartner);c.records[0].url=url;assert.equal(project(c).records[0].url,url);
  }
});

test('unsupported production is downgraded across projection, hero, index and virtual module',()=>{
  for(const event_type of ['proof_received','proof_approved','deposit_paid','authorization']){
    const c=structuredClone(fixture.testPartner);Object.assign(c.asset,{current_lifecycle_stage:'production',status_label:'UNSUPPORTED-PRODUCTION-CANARY',status_detail:'UNSUPPORTED-PRODUCTION-CANARY'});
    c.records.push({...c.records[5],id:'unsupported-start',stage_id:'production',event_type,evidence_state:'approved',source_type:'partner'});
    const p=project(c);assert.equal(p.asset.current_lifecycle_stage,'configuration');assert.equal(p.asset.status_label,'Awaiting production evidence');
    for(const output of [JSON.stringify(p),render(p),JSON.stringify(index.publicEquipmentIndexRow(liftmateEquipment,p)),passportPublicPlugin([c]).load('\0virtual:passport-public')])assert.ok(!output.includes('UNSUPPORTED-PRODUCTION-CANARY'));
  }
  const c=structuredClone(fixture.testPartner);c.asset.current_lifecycle_stage='production';
  Object.assign(c.records[4],{evidence_state:'in_production',source_type:'factory'});
  c.records.push({...c.records[5],id:'supported-start',stage_id:'production',event_type:'production_started',evidence_state:'in_production',source_type:'factory'});
  assert.equal(project(c).asset.current_lifecycle_stage,'production');
  c.records[4].visibility='private';assert.equal(project(c).asset.current_lifecycle_stage,'configuration');
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

test('generic lifecycle stages preserve contextual navigation without dead optional destinations',()=>{
  const html=render(project(lift));
  const journey=html.match(/<ol class="fleet-lifecycle-stages"[\s\S]*?<\/ol>/)[0];
  for(const href of ['#history-liftmate-proposal','#smashpro-edition','#media','#field-tests'])assert.ok(journey.includes(`href="${href}"`),href);
  const fixtureHtml=render(project(fixture.testPartner));
  const fixtureJourney=fixtureHtml.match(/<ol class="fleet-lifecycle-stages"[\s\S]*?<\/ol>/)[0];
  assert.ok(!fixtureJourney.includes('href="#field-tests"'));
  for(const [,id] of fixtureJourney.matchAll(/href="#([^"]+)"/g))assert.ok(fixtureHtml.includes(`id="${id}"`),id);
});

test('generic videos render sanitized posters and exclude credential-bearing previews',()=>{
  const c=structuredClone(fixture.testPartner);
  c.records.push({...c.records[0],id:'fixture-video',media_type:'video',media_kind:'factory',url:'/equipment/images/fixture.mp4',poster:'/equipment/images/fixture-poster.jpg'});
  assert.match(render(project(c)),/<video[^>]*poster="\/equipment\/images\/fixture-poster.jpg"/);
  c.records.at(-1).poster='https://example.invalid/poster#access_token=VIDEO-PRIVATE-CANARY';
  const html=render(project(c));assert.ok(!html.includes('VIDEO-PRIVATE-CANARY'));assert.doesNotMatch(html.match(/<video[^>]*>/)[0],/poster=/);
});
test('ARDHI renderer, CSS, deployment gates and index validator remain protected',()=>{
  const baseline=JSON.parse(readFileSync('tests/fixtures/passport/ardhi-protected.json'));
  for(const [path,hash] of Object.entries(baseline.files))assert.equal(createHash('sha256').update(readFileSync(path,'utf8').replaceAll('\r\n','\n')).digest('hex'),hash,path);
  const equipmentSource=readFileSync('src/data/equipment.ts','utf8').replaceAll('\r\n','\n');
  const ardhiBlock=equipmentSource.slice(equipmentSource.indexOf('slug: "sp-ardhi-26"'),equipmentSource.indexOf('slug: "sp-mzigo-26"'));
  assert.equal(createHash('sha256').update(ardhiBlock).digest('hex'),baseline.equipmentBlockHash);
  const extracted=readFileSync('src/data/ardhiEvidenceHistory.ts','utf8');
  const block=extracted.slice(extracted.indexOf('type EvidenceHistoryEntry =')).trimEnd().replace('export const DRIVE_EVIDENCE_HISTORY:','const DRIVE_EVIDENCE_HISTORY:')+'\n';
  assert.equal(createHash('sha256').update(block.replaceAll('\r\n','\n')).digest('hex'),baseline.historyBlockHash);
  const p=project(data.canonicalPassports.find(p=>p.asset.id==='SP-ARDHI-26'));
  for(const value of ['SPP-2026-0001','YF380','RAL 6018','Three-Pump','yf380-manufacturer-promo-spec-sheet.pdf','yfe380-operator-instruction-manual.pdf'])assert.ok(JSON.stringify(p).includes(value),value);
});

test('MZIGO renderer, source evidence, status, shared styles and deployment stay protected',()=>{
  const baseline=JSON.parse(readFileSync('tests/fixtures/passport/mzigo-protected.json'));
  for(const [path,hash] of Object.entries(baseline.files))assert.equal(createHash('sha256').update(readFileSync(path,'utf8').replaceAll('\r\n','\n')).digest('hex'),hash,path);
  const item=equipment.find(e=>e.fleetId==='SP-MZIGO-26E');
  const p=project(data.canonicalPassports.find(p=>p.asset.id===item.fleetId));
  assert.equal(p.build.renderer,'protected');
  assert.equal(p.asset.public_path,'/sp-mzigo-26.html');
  assert.equal(p.asset.status_label,item.statusLabel);
  assert.equal(p.asset.current_lifecycle_stage,'export_staging');
  assert.equal(p.records.find(r=>r.id===p.asset.hero_media_id).url,item.heroImage);
  for(const m of item.gallery){
    const r=p.records.find(r=>r.id===m.id);assert.ok(r,m.id);
    assert.equal(r.url,m.src);assert.equal(r.detail,m.caption);assert.equal(r.alt,m.alt);
    assert.equal(r.occurred_at,m.capturedAt);assert.equal(r.poster,m.poster);
    assert.equal(r.factoryEvidence,Boolean(m.group));assert.equal(r.fieldEvidence,false);
    if(m.evidenceCategory)assert.equal(r.evidence_classification,m.evidenceCategory);
  }
  for(const e of item.timeline.filter(e=>e.publicDisplay)){
    const r=p.records.find(r=>r.id===e.id);assert.ok(r,e.id);
    assert.equal(r.title,e.title);assert.equal(r.detail,e.detail);assert.equal(r.occurred_at,e.occurredAt);
  }
  for(const s of item.specifications){const r=p.records.find(r=>r.kind==='specification'&&r.title===s.label);assert.equal(r.value,s.value);assert.equal(r.evidence_state==='verified',s.confirmed);}
  assert.equal(p.records.filter(r=>r.media_type==='video').length,4);
  assert.equal(p.records.find(r=>r.title==='Payload'&&r.kind==='specification').evidence_state,'review_pending');
  assert.equal(domain.lifecycleStageStatus(p,'factory_completion'),'complete');
  assert.equal(domain.lifecycleStageStatus(p,'final_payment'),'complete');
  assert.equal(domain.lifecycleStageStatus(p,'packing'),'complete');
  for(const stage of ['shipped','ocean_freight','arrival','commissioning'])assert.equal(domain.lifecycleStageStatus(p,stage),'pending');
  for(const value of ['K600','500 kg','Shandong Kylin','Black wheels','controller','2026-10-01'])assert.ok(JSON.stringify(p).includes(value),value);
  // Protected cards still use the identical legacy allowlist and hero.
  assert.equal(index.publicEquipmentIndexRow(item).hero_image,item.heroImage);
});

test('MZIGO build complete plus paid final payment and packing never imply shipment, receipt or commissioning',()=>{
  const source=data.canonicalPassports.find(p=>p.asset.id==='SP-MZIGO-26E');
  for(const stage of ['shipping','shipped','in_transit','ocean_freight','arrival','received','commissioning','commissioned']){
    const c=structuredClone(source);c.asset.current_lifecycle_stage=stage;c.asset.status_label='Unsupported promotion';
    // Even a completion event backed by authentic build/payment/packing is insufficient.
    c.records.push({...c.records.find(r=>r.id==='mzigo-build-approved'),id:'packing-proof',evidence_classification:'packing'});
    c.records.push({...c.records.find(r=>r.kind==='lifecycle_event'),id:'false-shipping',stage_id:stage,event_type:'completion',evidence_ids:['mzigo-final-payment','mzigo-build-approved','packing-proof']});
    const p=project(c);assert.equal(p.asset.current_lifecycle_stage,'shipping_preparation');
    assert.equal(p.asset.status_label,'Awaiting shipment evidence');
    assert.equal(domain.lifecycleStageStatus(p,stage),'pending');
  }
  const c=structuredClone(source);c.asset.current_lifecycle_stage='shipped';
  const proof={...c.records.find(r=>r.id==='mzigo-build-approved'),id:'cargo-handoff',source_type:'carrier',evidence_classification:'shipped',evidence_state:'verified'};
  c.records.push(proof);assert.equal(project(c).asset.current_lifecycle_stage,'shipped');
  for(const changes of [{visibility:'private'},{asset_id:'OTHER'},{source_type:'factory'},{evidence_state:'concept'},{media_kind:'concept'},{evidence_classification:'packing'}]){
    const modified=structuredClone(c);Object.assign(modified.records.at(-1),changes);assert.equal(project(modified).asset.current_lifecycle_stage,'shipping_preparation');
  }
  assert.equal(domain.lifecycleStageStatus(project(c),'received'),'pending');
  assert.equal(domain.lifecycleStageStatus(project(c),'commissioned'),'pending');
});

test('three-passport contract matrix preserves identity, state, supported sections and public privacy',()=>{
  assert.deepEqual(data.canonicalPassports.map(p=>p.asset.id).sort(),['SP-ARDHI-26','SP-LIFTMATE-27','SP-MZIGO-26E']);
  for(const source of data.canonicalPassports){
    const c=structuredClone(source);c.procurement={internal_notes:'MATRIX_PRIVATE_CANARY'};
    c.records.push({...c.records[0],id:'matrix-private',visibility:'private',detail:'MATRIX_PRIVATE_CANARY'});
    const p=project(c),template=templates.passportTemplates[p.asset.build_type];
    for(const field of ['id','passport_id','oem_model','current_lifecycle_stage','status_label','public_path'])assert.ok(p.asset[field],`${p.asset.id}: ${field}`);
    for(const kind of ['specification','configuration','partner','evidence','media'])assert.ok(p.records.some(r=>r.kind===kind),`${p.asset.id}: ${kind}`);
    for(const key of ['identity','configuration','partners','journey','specifications','media','documents','history'])assert.ok(template.sections.some(s=>s.key===key),key);
    assert.ok(template.lifecycleStages.some(s=>s.id==='field_validation'));
    assert.ok(template.documentDestinations.length>0);assert.ok(template.mediaDestinations.length>0);
    assert.ok(!JSON.stringify(p).includes('MATRIX_PRIVATE_CANARY'));
    assert.ok(!JSON.stringify(p).includes('matrix-private'));
  }
});
