import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import ts from 'typescript';
const source=readFileSync('src/data/ardhiPortArrival.ts','utf8');
const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const {ardhiPortArrival:record,ardhiJourneyStages:stages,ardhiPortArrivalPhoto:photo}=await import('data:text/javascript;base64,'+Buffer.from(compiled).toString('base64'));

test('manufacturer arrival advances only the verified stages and does not invent a date',()=>{
  assert.equal(record.assetId,'SP-ARDHI-26');
  assert.equal(record.status,'Arrived at U.S. Port');
  assert.equal(record.currentStage,'Awaiting Customs Clearance');
  assert.equal(record.occurredAt,null);
  assert.equal(record.source,'Manufacturer confirmation');
  assert.equal(stages.length,11);
  assert.deepEqual(stages.filter(s=>s.state==='current').map(s=>s.id),['port']);
  assert.deepEqual(stages.filter(s=>s.state==='complete').map(s=>s.id),['planning','procurement','production','export','ocean']);
  assert.deepEqual(stages.filter(s=>s.state==='pending').map(s=>s.id),['customs','warehouse','delivery','commissioning','first-job']);
});
test('arrival photo has one public archive home and no invented capture timestamp',()=>{
  assert.equal(photo.group,'arrival'); assert.equal(photo.capturedAt,undefined);
  assert.match(photo.caption,/machine is enclosed/);
  assert.ok(existsSync(photo.src.replace('/equipment/','')));
  const equipment=readFileSync('src/data/equipment.ts','utf8');
  assert.equal((equipment.match(/^\s+ardhiPortArrivalPhoto,/gm)||[]).length,1);
  assert.equal(record.package.dimensions,'2090 × 1100 × 1300 mm');
  assert.equal(record.package.weight,'950 kg (2,095 lb)');
});
test('public logistics excludes operational planning and moving position simulation',()=>{
  const component=readFileSync('src/components/ArdhiPortProcessing.tsx','utf8');
  assert.doesNotMatch(source+component,/Customer unloading required|Forklift required|Tri-Lift|132 Willow/i);
  assert.doesNotMatch(component,/latitude|longitude|animateMotion|setInterval|offset-path/);
  assert.match(component,/No GPS location or simulated movement/);
});
