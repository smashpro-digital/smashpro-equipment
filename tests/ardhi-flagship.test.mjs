import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
const compiled = ts.transpileModule(readFileSync('src/data/ardhiFlagship.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const { commissioningChecks, firstJob, firstJobPresentation, serviceEntries, verifiedEvidence } = await import('data:text/javascript;base64,' + Buffer.from(compiled).toString('base64'));
const proof = { title: 'Reviewed inspection', href: '/equipment/documents/inspection.pdf', state: 'verified' };
const ready = commissioningChecks.map(check => ({ ...check, status: 'passed', approval: 'reviewed', evidence: [proof] }));
test('first job cannot become Project 001 from dates, completion flag or incomplete commissioning alone', () => {
  const done = { status: 'completed', mission: 'Material placement', evidence: [proof] };
  assert.equal(firstJobPresentation(firstJob, commissioningChecks).title, 'First Job');
  assert.equal(firstJobPresentation(done, commissioningChecks).title, 'First Job');
  assert.equal(firstJobPresentation(done, ready.slice(1)).title, 'First Job');
  assert.equal(firstJobPresentation(done, ready.map((check, i) => i ? check : { ...check, evidence: [{ ...proof, state: 'pending' }] })).title, 'First Job');
  assert.equal(firstJobPresentation({ ...done, evidence: [] }, ready).title, 'First Job');
  assert.equal(firstJobPresentation({ ...done, status: 'planned' }, ready).title, 'First Job');
  assert.equal(firstJobPresentation(done, [...ready.slice(1), ready[1]]).title, 'First Job');
  assert.equal(firstJobPresentation(done, ready).title, 'Project 001');
});
test('only delivery is documented; commissioning remains pending and invalid evidence never qualifies', () => {
  assert.equal(commissioningChecks.length, 16);
  assert.deepEqual(commissioningChecks.filter(check => check.evidence.length).map(check => check.id), ['delivery', 'crate-inspection', 'crate-opened']);
  assert.deepEqual(serviceEntries, []);
  assert.deepEqual(verifiedEvidence([{ ...proof, href: '' }, { ...proof, title: '' }, { ...proof, href: 'javascript:alert(1)' }, { ...proof, href: 'https://private.invalid/inspection.pdf' }, { ...proof, state: 'pending' }]), []);
  assert.deepEqual(verifiedEvidence([proof]), [proof]);
});

test('evidence alone does not approve partial unboxing or an unsuccessful startup', () => {
  const done = { status: 'completed', mission: 'Fixture', evidence: [proof] };
  assert.equal(firstJobPresentation(done, ready.map(c => c.id === 'crate-opened' ? {...c, status: 'in_progress'} : c)).title, 'First Job');
  assert.equal(firstJobPresentation(done, ready.map(c => ({...c, approval: 'pending'}))).title, 'First Job');
});
