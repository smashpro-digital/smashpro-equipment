# Shipment production release — September 12, 2026

Maurice authorized HQ PR #111 followed by Equipment PR #43. A temporary custom
API DNS/TLS outage is accepted only as an unavailable UI state. No TLS, public
projection, evidence or CORS checks may be bypassed. Initial release preflight
found both the generated HQ host and custom API responding with HTTPS 200 and
the correct pending record. Propagation may still differ between clients.

## Release and recovery behavior

The production build uses only
`https://api.smashpro.app/api/fleet/shipment/SP-ARDHI-26`. It never uses the local
preview upstream. An unavailable response displays “Shipment update unavailable.”
and retries in 60 seconds; online events also retry. A successful response returns
to the six-hour refresh interval. Browser background throttling can delay retries.
No reload, new release or fabricated cache is required for automatic recovery.

The normal manual production workflow retains its conservative endpoint gate,
now requiring exactly `Access-Control-Allow-Origin: https://smashpro.app`. No
DNS-window override or global gate weakening was added. Deploy Equipment only
after the existing Railway service is connected to and healthy on merged HQ main.
Never rerun initialization or replace/detach the Railway volume.

## Rollback baseline

- Equipment revision: `2c4b3ea03bc2ab8a7266f3af88f5a06644734fc3`.
- Prior production run: `34543359114`; successful deploy job: `103090750275`.
- Original `equipment-showroom-dist` artifact: `10178102749`.
- ZIP SHA-256: `77e5b97c34c60b4832e4cdf43980d868a0e458b281fe2e6ef262d84fcee84d35`.
- A verified copy is retained locally under
  `tmp/production-release-20260912/equipment-before-2c4b3ea.zip`.
- HQ healthy pre-merge revision: `a2398b1ddfd5ccf67d4be3d17f374619292fc5ca`.

If the Equipment page itself breaks, restore Equipment only. While the original
artifact is retained by GitHub, rerunning the **prior deploy job only** restores
that original artifact via its established incremental FTP step:

```sh
gh api --method POST repos/smashpro-digital/smashpro-equipment/actions/jobs/103090750275/rerun
```

Verify artifact availability and the old job definition first. If GitHub retention
has expired, use the preserved ZIP through the existing bounded deployment access;
do not rebuild old source and claim it is the exact prior artifact. Preserve media
and unrelated files. Verify live HTML/bundle hashes and passport behavior afterward.
Do not roll back healthy HQ because of DNS propagation, and never restore over,
delete or reinitialize its shipment record as part of a code rollback.

## Post-propagation checks

This command uses default certificate and hostname verification; never add an
insecure TLS switch. It prints only public acceptance results:

```sh
node --input-type=module <<'NODE'
import assert from 'node:assert/strict';
const base='https://api.smashpro.app';
const health=await fetch(base+'/healthz',{redirect:'error',signal:AbortSignal.timeout(20000)});
assert.equal(health.status,200); assert.equal((await health.json()).status,'ready');
const r=await fetch(base+'/api/fleet/shipment/SP-ARDHI-26',{headers:{Origin:'https://smashpro.app'},redirect:'error',signal:AbortSignal.timeout(20000)});
assert.equal(r.status,200); assert.match(r.headers.get('content-type'),/^application\/json/);
assert.equal(r.headers.get('access-control-allow-origin'),'https://smashpro.app');
assert.equal(r.headers.get('access-control-allow-credentials'),null);
const p=await r.json(); assert.equal(p.schemaVersion,2);
assert.equal(p.shipmentStatus,'Ocean departure awaiting confirmation');
assert.equal(p.stageVerification,'unverified'); assert.equal(p.vessel,null);
assert.equal(p.voyage,null); assert.equal(p.currentPosition,null);
assert.deepEqual(p.satelliteImagery,[]);
assert.equal(p.pendingReferences.vesselDisplayReference,'EVER MAX');
assert.equal(p.pendingReferences.voyageDisplayReference,'1374-016E');
assert.equal(p.pendingReferences.vesselIdentityVerification,'pending');
assert.equal(p.pendingReferences.voyageVerification,'pending');
assert.equal(p.pendingReferences.cargoAssociation,'unconfirmed');
console.log('HTTPS, health, exact CORS and conservative schema-2 shipment passed');
NODE
```

Then leave the real passport open through an unavailable-to-reachable transition.
Confirm it updates within its next foreground retry to “Ocean departure awaiting
confirmation”, shows both references as pending and keeps cargo association
unconfirmed. Verify desktop/mobile, keyboard refresh, original media, no animated
vessel or satellite claim, and no unrelated page-breaking browser errors. A Node
HTTP check alone does not constitute browser acceptance.
