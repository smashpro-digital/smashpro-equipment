# AKASO premium visual integration

Branch: `feat/akaso-premium-visual-20261013`, based on main `bb705a9`.

## Scope and design

The existing Field Technology section remains after rental process and before contractors. Only its component, scoped styles, catalog parser and image-aware validation change. Equipment typography, dark surfaces, green accents, existing button component, fleet sections and Railway-independent deployment remain intact.

The feature pairs official AKASO 360 imagery with “Capture Every Angle,” exploration-stage copy, the existing HQ-provided affiliate URL, the Equipment YouTube channel and visible commission disclosure. Desktop/tablet use two columns and mobile stacks the image and copy. Explicit dimensions preserve the portrait aspect ratio; `object-fit: contain` prevents cropping. No animation, invented product specifications, ownership or field-test claims are added. Failed image loads show a reserved-space fallback while retaining the approved actions. Invalid or revoked catalog approval still hides the section.

## Official asset review

All five owner-supplied Awin creatives were fetched again on October 13 and visually inspected. The fresh image hashes match the earlier inventory; see [inspection metadata](release-captures/akaso-premium/asset-inspection.json).

| Creative | Dimensions | Content and decision |
| --- | --- | --- |
| **4587303** | **2160 × 2700** | **Selected.** AKASO 360 front/rear product image with original “Your First 360 Action Cam” wording; no dated sale or pricing. Clear portrait composition works on mobile. |
| 4158631 | 800 × 800 | Brave-series camera; not the AKASO 360. Excluded. |
| 4597556 | 5120 × 1600 | Black Friday Nov 20–Dec 1, 2025; expired. Wide banner also unsuitable for mobile editorial use. Excluded. |
| 4597662 | 1125 × 1440 | Black Friday savings/free gifts, no verified validity dates. Excluded. |
| 4587311 | 2832 × 1920 | Advertiser beach demonstration of an invisible selfie stick; not SmashPro field evidence. Excluded. |

Selected source: `https://www.awin1.com/cshow.php?s=4587303&v=69454&q=542867&r=3121518`. Served directly as the original 251631-byte JPEG, without cropping, editing, re-encoding or local redistribution. Access and use are based on the owner's supplied official affiliate assets and explicit Equipment-only authorization. No configured product feed exists; no additional merchant images were scraped. No secondary promotional banner is needed.

## HQ contract and permissions

Digital HQ remains the source of truth. Its public catalog optionally returns `image: { id, creative_id, url, width, height, alt }` from the existing registry. The frontend validates the reviewed image identity; it never constructs or substitutes an affiliate CTA URL. Creative registry record **1**, Awin creative **4587303**, uses Equipment promotional-assets permission **3**, relationship/property **1**, and campaign **3**. Existing product/link **1** and website placement **3** remain unchanged. No schema migration is required.

Initial live readback found the creative unpublished and permission planned. The owner then explicitly authorized activation of this Equipment-only creative and permission. All other creatives and Garage permissions remain unchanged. HQ requires the existing program/editorial/affiliate/placement gates plus the creative's publication state and promotional-assets permission before projecting the image. The Equipment-only projection does not grant Gear or Garage access. Withdrawal remains controlled through authenticated HQ review actions.

## Evidence

Actual pre-change production captures: [390px](release-captures/akaso-premium/before-390.png), [768px](release-captures/akaso-premium/before-768.png), [1440px](release-captures/akaso-premium/before-1440.png).

Local fixture captures are explicitly named `local-fixture-*`; they test a proposed approved image contract and are not evidence of production approval. Production acceptance and deployment receipts are recorded below.


## Validated and deployed

- Equipment implementation `53746a386fc1bd325dd11ab89c994a022e8f25ae`, [PR #85](https://github.com/smashpro-digital/smashpro-equipment/pull/85), merged conventionally after [CI passed](https://github.com/smashpro-digital/smashpro-equipment/actions/runs/38455429334).
- Deployed merge `80e1372a727a1c37e2a2019939c2fd7bd9590282`. [Production run 38457601998](https://github.com/smashpro-digital/smashpro-equipment/actions/runs/38457601998) succeeded with `akaso_release=true`, `shipment_release=false`; build/tests, artifact safeguards, live catalog, deployment settings and incremental FTP passed. [Workflow receipt](release-captures/akaso-premium/production-workflow.json).
- HQ implementation `345fe5c5bf5348cff28360fb4ec73e76e5d4dfab`, merge `50226f7696b6cd43f0d614bfee7a8f2fbf3da31f`, [PR #229](https://github.com/smashpro-digital/digital-hq/pull/229). PHP 8.2 and PHP 7.4 CI passed. [PR #230](https://github.com/smashpro-digital/digital-hq/pull/230) records the completed release. The scoped PHP API upload was verified by remote hash readback; the dashboard build was not used to publish PHP. [API/activation receipt](release-captures/akaso-premium/hq-release.json).
- No schema migration. Authenticated activation applied only creative record 1 / creative 4587303 and promotional-assets permission 3. Dry-run, transactional apply, idempotent readback, anonymous rejection and temporary gateway cleanup passed. Existing affiliate URL and placement permissions stayed unchanged.
- 133 unit tests, typecheck, production build, public index/media/passport checks and local ARDHI artifact verification passed. All 17 browser scenarios passed across the built run and targeted retry. Initial failures were local page/server setup timeouts before assertions; final responsive and image-failure checks passed with an already-running built preview. [Local validation details](release-captures/akaso-premium/local-validation.json).

### Normal-URL production acceptance

Fresh anonymous Chromium sessions at **https://smashpro.app/equipment/** passed at 390, 768 and 1440px. The image loaded from HQ's approved reference, retained its 4:5 ratio and used `object-fit: contain`. The section remained between rental process and contractors. The original affiliate URL and sponsored relation, Equipment YouTube CTA and visible disclosure passed. Existing fleet/passport/attachment/fabrication/development/rental/contractor/footer sections remained present. No horizontal overflow, post-decode dimension changes, page errors or automatic affiliate click requests were observed. The image request is the official Awin impression endpoint; no commission attribution is claimed.

The live catalog again passed public-only field validation, Garage/unknown placement rejection and anonymous admin rejection. No Gear CTA was introduced.

| Width | Before: actual production | After: actual production |
| --- | --- | --- |
| 390px | [Before](release-captures/akaso-premium/before-390.png) | [After](release-captures/akaso-premium/production-390.png) |
| 768px | [Before](release-captures/akaso-premium/before-768.png) | [After](release-captures/akaso-premium/production-768.png) |
| 1440px | [Before](release-captures/akaso-premium/before-1440.png) | [After](release-captures/akaso-premium/production-1440.png) |

[Live browser assertions](release-captures/akaso-premium/production-validation.json). Local synthetic captures are separately named `local-fixture-*`.

### Cache handling and rollback

The first browser read received stale Brotli HTML (`Last-Modified: Tue, 13 Oct 2026 18:32:22 GMT`) referencing the removed prior bundle `main-CnyChK_t.js`. Gzip HTML was already current. Following the deployment runbook, a GET revalidated only `/equipment/` with `Accept-Encoding: br`, `Cache-Control: no-cache` and `Pragma: no-cache`. Its modification time became October 13 19:48:34 GMT and age zero. Final captures used fresh sessions at the normal URL, without query busting, extra cache headers or response interception.

The live new JavaScript `main-CmpoIVpx.js` matched the local production artifact byte-for-byte: SHA-256 `0ffbba5531bf98a5adc17b3168e708d7d16948835a74ef989d5e682c58eaf772`. There was no global purge or hosting configuration change.

To withdraw the image, use HQ's authenticated `review_asset` controls for creative record 1 with its current revision; retain the existing affiliate placement. API prior bytes were retained before the scoped upload. For frontend rollback, revert implementation `53746a3` through a reviewed PR and the existing production workflow; keep the Railway-independent workflow and canonical HQ records. No unresolved production blocker remains for this visual release.
