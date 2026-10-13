import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
import { verifyArdhiArrivalPolicy } from '../scripts/ardhi-release-policy.mjs';
const code = ts.transpileModule(readFileSync('src/data/ardhiPortArrival.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { ardhiPortArrival, ardhiJourneyStages } = await import('data:text/javascript;base64,' + Buffer.from(code).toString('base64'));

test('offline artifact policy retains actual evidence guards without a shipment response', () => {
  assert.equal(verifyArdhiArrivalPolicy(ardhiPortArrival, ardhiJourneyStages).currentStage, 'Awaiting Customs Clearance');
  assert.throws(() => verifyArdhiArrivalPolicy({ ...ardhiPortArrival, confidence: 'Pending' }, ardhiJourneyStages));
  assert.throws(() => verifyArdhiArrivalPolicy(ardhiPortArrival, ardhiJourneyStages.map(s => ({ ...s, state: s.id === 'delivery' ? 'complete' : s.state }))));
});

test('frontend deployment keeps mandatory safeguards without depending on shipment monitoring', () => {
  const workflow = readFileSync('.github/workflows/deploy.yml', 'utf8');
  assert.match(workflow, /needs: validate/);
  assert.match(workflow, /if: github.ref == 'refs\/heads\/main' && github.event_name == 'workflow_dispatch'/);
  assert.match(workflow, /if: inputs.shipment_release\s+run: node --experimental-strip-types release-source\/scripts\/verify-ardhi-release.mjs/);
  assert.match(workflow, /if: inputs.akaso_release\s+run: node --experimental-strip-types release-source\/scripts\/verify-akaso-catalog.mjs/);
  assert.match(workflow, /run: node --experimental-strip-types release-source\/scripts\/verify-ardhi-artifact.mjs/);
  for (const check of ['npm run typecheck','npm test','npm run build','npm run validate:index','FTP_SERVER FTP_USERNAME FTP_PASSWORD FTP_PORT','server-dir: /public_html/smashpro.app/equipment/','dangerous-clean-slate: false']) assert.ok(workflow.includes(check), check);
  assert.ok(!workflow.includes('continue-on-error'), 'Do not blanket-ignore validation failures');
  assert.ok(!workflow.includes('needs: shipment'));
  const monitor = readFileSync('.github/workflows/shipment-health.yml', 'utf8');
  assert.match(monitor, /schedule:/);
  assert.match(monitor, /run: node --experimental-strip-types scripts\/check-shipment-health.mjs/);
  assert.ok(!monitor.includes('continue-on-error'), 'Service outage must remain visible as failed monitoring');
});
