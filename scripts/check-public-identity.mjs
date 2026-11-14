import { readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, relative } from 'node:path';
import { execFileSync } from 'node:child_process';
const hashes = new Set(JSON.parse(readFileSync('scripts/security/restricted-identity-fingerprints.json', 'utf8')));
const restricted = JSON.parse(readFileSync('scripts/security/restricted-media.json', 'utf8'));
const failures = [];
if (readFileSync('dist/.htaccess','utf8').includes('__CURRENT_MAIN_HASH__')) failures.push('Unresolved historical bundle revocation rule');
function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)]);
}
for (const file of walk('dist')) {
  const path = relative('dist', file).replaceAll('\\', '/');
  if (restricted.includes(path)) failures.push(`restricted original in output: ${path}`);
  if (!/\.(js|json|html|svg|txt|xml|css|map)$/.test(file)) continue;
  const body = readFileSync(file, 'utf8');
  if (/serialNumberPublic|manufacturerJobId|serialNumber\s*[=:]/.test(body)) failures.push(`restricted identity field: ${path}`);
  for (const token of body.match(/[A-Za-z0-9][A-Za-z0-9_.:-]{4,}/g) ?? []) {
    if (hashes.has(createHash('sha256').update(token).digest('hex'))) {
      failures.push(`restricted identity fingerprint: ${path}`); break;
    }
  }
  if (/20261111_093751|sp-mzigo-26e-manufacturer-nameplate-2026-10-06/.test(body)) failures.push(`restricted original reference: ${path}`);
}
// The Equipment repository is public: documentation and capture scripts must
// not retain known identifiers even when excluded from the web build.
for (const file of execFileSync('git',['ls-files','-z'],{encoding:'utf8'}).split('\0')) {
  if (!/\.(md|mjs|cjs|js|ts|tsx|jsx|json|html|txt|xml|svg|yml|yaml)$/.test(file)) continue;
  const body=readFileSync(file,'utf8');
  if ((body.match(/[A-Za-z0-9][A-Za-z0-9_.:-]{4,}/g)??[]).some(token=>hashes.has(createHash('sha256').update(token).digest('hex')))) failures.push(`restricted identity fingerprint in public source: ${file}`);
}
if (failures.length) { console.error([...new Set(failures)].join('\n')); process.exit(1); }
console.log('Public identity scan passed: no restricted fields, known identifier fingerprints or held plate originals in build/public source.');
