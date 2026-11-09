import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
const compiled = ts.transpileModule(readFileSync('src/data/fleetLifecycle.ts','utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const { ardhiLifecycleEvents, publicLifecycleForAsset, mergePublicLifecycleEvents } = await import('data:text/javascript;base64,' + Buffer.from(compiled).toString('base64'));
test('ARDHI lifecycle IDs are unique and open track repair blocks service release', () => {
  assert.equal(new Set(ardhiLifecycleEvents.map(e=>e.id)).size,ardhiLifecycleEvents.length);
  const track = publicLifecycleForAsset('SP-ARDHI-26').find(e=>e.id==='DEF-003');
  assert.equal(track.status,'repair_pending');
  assert.equal(track.serviceRelease,'blocked');
  assert.equal(track.article,undefined,'Draft WordPress content must not link publicly');
});
test('verified throttle travel does not imply whole-machine service approval', () => {
  const throttle=publicLifecycleForAsset('SP-ARDHI-26').find(e=>e.id==='DEF-001');
  assert.equal(throttle.status,'verified');
  assert.notEqual(throttle.serviceRelease,'approved');
});
test('partial reviewed database feeds retain pending editorial statuses and blockers', () => {
  const throttle=publicLifecycleForAsset('SP-ARDHI-26').filter(e=>e.id==='DEF-001');
  const events=mergePublicLifecycleEvents('SP-ARDHI-26',throttle);
  const byId=new Map(events.map(event=>[event.id,event]));
  assert.equal(byId.get('DEF-001').status,'verified');
  assert.equal(byId.get('DEF-001').serviceRelease,'pending');
  assert.equal(byId.get('DEF-002').approval,'pending');
  assert.match(byId.get('DEF-002').summary,/verification remains pending/);
  assert.equal(byId.get('DEF-003').status,'repair_pending');
  assert.equal(byId.get('DEF-003').serviceRelease,'blocked');
  assert.equal(byId.get('UPG-BKT-006').status,'testing_pending');
  assert.equal(byId.get('UPG-BKT-006').approval,'pending');
});
test('projection rejects unreviewed evidence, foreign article URLs and other asset events', () => {
  const sample={...ardhiLifecycleEvents[0],assetId:'SP-ARDHI-26',purchaseCost:4200,ownerEmail:'private@example.com',article:{state:'published',url:'https://outside.example/track',title:'Untrusted',supplier:'Private supplier'},evidence:[{kind:'photo',label:'Private',url:'https://private.example/file',reviewed:true,storageKey:'private/receipt.jpg'},{kind:'photo',label:'Unreviewed',url:'/equipment/track.jpg',reviewed:false},{kind:'photo',label:'Approved',url:'/equipment/track.jpg',reviewed:true,adminId:12}]};
  const [event]=publicLifecycleForAsset('SP-ARDHI-26',[sample]);
  assert.equal(event.article,undefined);
  assert.deepEqual(event.evidence.map(e=>e.label),['Approved']);
  assert.deepEqual(Object.keys(event).sort(),['approval','assetId','componentIds','evidence','id','occurredOn','relatedEventIds','reportedOn','serviceRelease','status','summary','title','type'].sort());
  assert.equal(event.purchaseCost,undefined);
  assert.equal(event.ownerEmail,undefined);
  assert.deepEqual(Object.keys(event.evidence[0]).sort(),['kind','label','reviewed','url'].sort());
  assert.deepEqual(publicLifecycleForAsset('OTHER-ASSET',[sample]),[]);
});
test('database lifecycle records replace editorial track content without releasing its blocker', () => {
  const database = publicLifecycleForAsset('SP-ARDHI-26').map(event => ({
    ...event,
    approval: 'reviewed',
    ...(event.id === 'DEF-003' ? {summary:'Database-backed unresolved track record.'} : {})
  }));
  const track = mergePublicLifecycleEvents('SP-ARDHI-26',database).find(event=>event.id==='DEF-003');
  assert.equal(track.summary,'Database-backed unresolved track record.');
  assert.equal(track.serviceRelease,'blocked');
});
test('pin repair date is not confused with its report date', () => {
  const pins=publicLifecycleForAsset('SP-ARDHI-26').find(event=>event.id==='DEF-002');
  assert.equal(pins.occurredOn,null);
  assert.equal(pins.reportedOn,'2026-11-08');
  assert.match(pins.summary,/repair date was not separately recorded/i);
});
