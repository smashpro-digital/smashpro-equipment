import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
const compiled = ts.transpileModule(readFileSync('src/data/fleetLifecycle.ts','utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const { ardhiLifecycleEvents, publicLifecycleForAsset } = await import('data:text/javascript;base64,' + Buffer.from(compiled).toString('base64'));
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
test('projection rejects unreviewed evidence, foreign article URLs and other asset events', () => {
  const sample={...ardhiLifecycleEvents[0],assetId:'SP-ARDHI-26',article:{state:'published',url:'https://outside.example/track',title:'Untrusted'},evidence:[{kind:'photo',label:'Private',url:'https://private.example/file',reviewed:true},{kind:'photo',label:'Unreviewed',url:'/equipment/track.jpg',reviewed:false},{kind:'photo',label:'Approved',url:'/equipment/track.jpg',reviewed:true}]};
  const [event]=publicLifecycleForAsset('SP-ARDHI-26',[sample]);
  assert.equal(event.article,undefined);
  assert.deepEqual(event.evidence.map(e=>e.label),['Approved']);
  assert.deepEqual(publicLifecycleForAsset('OTHER-ASSET',[sample]),[]);
});
