# Equipment deployment correction — October 13, 2026

Branch: `fix/equipment-independent-deploy-20261013`, created from main `d8c5623`.

The [deployment runbook](deployment.md) records the source/history audit, dependency classification, preserved safeguards and rollback procedure. This change separates optional shipment service health from frontend deployment. It changes no application UI, Railway infrastructure or production database records.

## Pre-deployment evidence

- All four required repository FTP secret names are present; values remain private.
- The live HQ catalog contract passed: exactly one authorized Equipment AKASO 360 product/link, original URL/disclosure, public-only field allowlists, no-store, Garage and unknown selector rejection, anonymous admin rejection.
- AKASO migrations and activation were already completed in the preceding release. They are not rerun.
- Required local artifact policy remains independent of network availability. The original strict combined shipment policy remains available for shipment releases.

Production deployment and real-browser acceptance are now complete; see the evidence below.

## Local validation and rollback

TypeScript/build, public index, MZIGO media and passport artifact validation passed. The live AKASO contract passed. The independent shipment monitor correctly failed on the real HTTP 404. The initial full test run passed 130/132: both failures were the old deployment-workflow SHA in ARDHI/MZIGO protection fixtures. Only those two workflow hash entries were updated for this owner-authorized correction; all renderer, history, media and data hashes remain unchanged. Dedicated dependency tests verify retained safeguards.

The prior successful artifact (run 38100929184, artifact 11688096462) was downloaded before deployment. Eight live readbacks matched its homepage, three passport pages and homepage JS/CSS byte hashes. See [rollback baseline](EQUIPMENT-ROLLBACK-BASELINE-20261013.json).

## Successful production release

- Fix commit: `4af8119dc80a3f3ac30a285acb056731c41a5710`.
- [PR #83](https://github.com/smashpro-digital/smashpro-equipment/pull/83) merged conventionally after [CI 38446928243](https://github.com/smashpro-digital/smashpro-equipment/actions/runs/38446928243) passed the full suite/build. No admin override or branch-protection bypass was used.
- Deployed merge: `1488895f01963b380c2477e787db60f4bfd82e76`.
- [Production run 38447316456](https://github.com/smashpro-digital/smashpro-equipment/actions/runs/38447316456): **success**, including validation, downloaded local ARDHI evidence, live approved AKASO catalog, actual secret availability and incremental FTP upload. Inputs: `akaso_release=true`, `shipment_release=false`. See [workflow receipt](equipment-production-workflow-20261013.json).
- [Independent shipment monitor 38447350265](https://github.com/smashpro-digital/smashpro-equipment/actions/runs/38447350265): **failed on the real HTTP 404**, independently of the successful frontend release. No mock, forced success or Railway change was used.

### Cache-aware live verification

Initial browser acceptance found the old compressed HTML entry: `Last-Modified: Sun, 11 Oct 2026 01:12:08 GMT`, `Age: 708`, with the old `main-C9bHwKmY.js`. Uncompressed reads already matched the new artifact. A fresh query confirmed the new component existed but was not accepted as final normal-URL evidence.

A scoped GET to `https://smashpro.app/equipment/` with `Accept-Encoding: br`, `Cache-Control: no-cache` and `Pragma: no-cache` revalidated that HTML entry. A subsequent ordinary compressed read returned the new October 13 modification time and bundle `main-CnyChK_t.js`. Fresh browser sessions then passed at the normal URL with no cache-busting query or response interception. No global cache purge or unrelated application change occurred.

### Live acceptance

At **https://smashpro.app/equipment/**, real Chromium sessions at both widths verified:

- `rental-process` -> `field-technology` -> `contractors` sibling order.
- AKASO 360 card, original approved Awin advertiser 69454 / publisher 3121518 URL, adjacent commission disclosure, new-tab CTA and `sponsored noopener noreferrer`.
- Existing four field-fleet cards, passports, attachments, fabrication, development, rental process, contractors and footer remain present.
- No secondary Gear CTA, no horizontal overflow, no page errors and no Awin/merchant/short-link request on page load.
- Repeated live catalog validation passed public-only field allowlists, Garage and unknown selector rejection, and anonymous administrative rejection. HQ remains the source of truth; migrations and affiliate approvals were not repeated.
- Eight protected page/catalog routes and all four homepage JS/CSS assets returned 200. The live main bundle contains the deployed AKASO component. ARDHI/MZIGO/LiftMate HTML and shared global assets still match the rollback baseline byte hashes.

Production screenshots, visually reviewed:

- [390px](release-captures/akaso-field-technology/live-production-390.png)
- [1440px](release-captures/akaso-field-technology/live-production-1440.png)
- [Browser assertions](release-captures/akaso-field-technology/live-production-validation.json)
- [Route and asset hashes](release-captures/akaso-field-technology/live-route-validation.json)

These captures use actual production approval data, not synthetic fixtures. CTA URL/attributes were checked without claiming conversion attribution. No Equipment deployment blocker remains. The optional shipment service still needs separate operational attention; its unavailable state is not a frontend publishing dependency.
