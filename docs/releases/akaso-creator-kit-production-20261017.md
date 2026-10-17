# AKASO Creator Kit production release - 2026-10-17

Status: PRODUCTION LIVE. Verified in fresh Chromium sessions at the normal production URL on 2026-10-17.

Owner authorized production release on 2026-10-17. Deploy the scoped HQ API first,
read back its contract, then merge and dispatch Equipment deploy.yml with
shipment_release=false and akaso_release=true. No Railway prerequisite.

Source commits: Equipment 722350c, 6a55b29, a59fdee, 509d50d;
Digital HQ 356c797, af38d9c. All are ancestors of their release branches.

The release also adds the owner-supplied case retailer destination
https://a.co/d/01Lk7JHj (B0G1C14LPK), explicitly non-affiliate, using a separately
verified association in passport 4. Product 6 and its manufacturer details remain
intact. No new product or schema. Existing Awin URLs remain byte-for-byte intact.

Recovery: previous frontend artifact from Actions run 39012026636 at c1d545b
matches production passport HTML and referenced assets. A private copy is retained
under creator-kit-production-20261017/frontend-rollback in the local release
workspace. Previous dashboard/api/_media_equipment.php retained beside it;
SHA-256 c649d33dbee64406f949ba30112722f41f0b0276e34498b63a01a0b9f4528b7a.
Restore that single PHP file through the existing authenticated FTP transport if
needed. For frontend rollback, restore the retained dist with the same incremental
FTP destination /public_html/smashpro.app/equipment/ and no clean-slate deletion,
or revert this scoped release through PR and dispatch the established workflow.
The additive kit associations are compatible with the preceding API renderer.

Current validation: PHP 7.4 lint; media projection, kit rights/privacy/URL/lease,
retailer integrity, affiliate policy/catalog/Equipment projection/guards passed.
Frontend typecheck, unit suite, Vite build and public index/passport checks passed.
Final browser, workflow, live API and screenshot evidence will be appended below.

Approved accessory photos are scoped to products 3-6 in Equipment, authorization
2026-10-17-akaso-accessory-photo-reuse. Pouch and SanDisk images remain unavailable.
No Garage grants, private inventory projection or proposed product sale claims.

## Completed release

- Equipment deployed merge: `9a9acddf06f323ba454be51df6a4388c3572c896`.
  [PR #104](https://github.com/smashpro-digital/smashpro-equipment/pull/104).
- HQ initial source: `0b461b52e9529fa6fa8e5aa6ce8285bdb30f00fb`, merged as
  `885665debd99764d0ebacf59133a597c80a24682` in
  [PR #246](https://github.com/smashpro-digital/digital-hq/pull/246).
- HQ final deployed source: `b37925423de74e0692f15a04128966b8a20eb911`,
  [PR #247](https://github.com/smashpro-digital/digital-hq/pull/247), merged as
  `9f30c872e907be5643fb3a4f0e1822e8a5352795`.
  Follow-up preserves configured ordering for the SanDisk item without a catalog
  product; no database changes. Camera remains first.
- [PR validation](https://github.com/smashpro-digital/smashpro-equipment/actions/runs/39030669395).
- [Production workflow](https://github.com/smashpro-digital/smashpro-equipment/actions/runs/39030923271),
  attempt 2 succeeded with shipment_release=false and akaso_release=true.
- HQ deployment used established authenticated FTP for exactly
  `/public_html/smashpro.app/dashboard/api/_media_equipment.php`; remote bytes
  verified SHA-256 `869a99dff2cb1306c53605eff0e48e8846f467ce07e8b1615b49fabf89790f41`.
  HQ merges used skip-ci commit subjects to avoid rebuilding the unrelated React
  dashboard; PHP validation ran locally. No dashboard workflow is claimed as API
  deployment evidence.

## Live acceptance

[AKASO passport](https://smashpro.app/equipment/sp-med-cam-001.html) and
[Equipment landing page](https://smashpro.app/equipment/) return HTTP 200.
[Public API](https://smashpro.app/dashboard/api/public_media_equipment.php?property=hq&asset=SP-MED-CAM-001)
returns seven unique kit entries, the camera plus four approved accessory images,
and both approved video associations. Product IDs 1 and 3-7 reused; passport 4,
media property 1, campaign 3 and placement equipment.media.sp-med-cam-001 retained.
The unchanged camera Awin URL uses advertiser 69454 / publisher 3121518.
Garage requests return HTTP 400. No raw procurement, serial, invoice or custody
fields were found in the checked public response.

Fresh normal-URL browser checks at 390, 768 and 1440 pixels confirmed:
restored large hero; seven IN OUR KIT badges; five kit images decoded successfully
with descriptive alt text and preserved aspect ratio; no duplicate cards; no
horizontal overflow or page JavaScript errors; disclosures; and MicroFab concept
labels without sale claims. Manufacturer links and the non-affiliate case Amazon
link return HTTP 200. Amazon resolves to B0G1C14LPK with no invented Associates tag.
Awin resolves to the expected AKASO variant and retains publisher attribution;
redirect behavior does not establish a commission or conversion.

Both YouTube embeds load only after explicit activation, with no autoplay and a
Watch on YouTube fallback. Actual video playback was verified after clicking Play:
`UfznEcnYz5k` advanced beyond 0.6 seconds and `siyujtCJmfw` beyond 5.9 seconds,
both unpaused, readyState 4 and no media error. YouTube oEmbed confirms the unboxing
and mailbox-walk identities under SmashPro HQ / @Smashprohq, matching the approved
Equipment channel association UC2wKsAtGR55PZMAUNuk2r6g.

Equipment landing and ARDHI, MZIGO, NYASI, UMBA and LiftMate passports passed live
HTTP-200, heading, overflow and JavaScript-error smoke checks. No heavy-equipment
source/data/assets were changed. Four live JS/CSS files match the validated local
build byte-for-byte; passport HTML matches after normalizing Windows line endings.

## Validation and recoverable release issues

160 unit tests; 13 browser integration tests; TypeScript; Vite build; public index,
MZIGO media, passport and ARDHI safeguards passed. PHP 7.4 lint, media projection,
kit rights/privacy/lease/URL/order, retailer, affiliate policy (9), catalog (44),
Equipment projection (47), public guards (10), rotation policy (85 including
projection) and rotation authentication (9) passed. Existing affiliate-auth test
uses PHP 8 str_contains and passed five guards under PHP 8.2. Production code was
linted/tested with PHP 7.4. Focused full-release changed-text secret scan and
`git diff --check` passed.

Attempt 1 stopped at the live AKASO approval gate before frontend upload. The
unchanged gate passed locally and three fresh reads showed current valid leases;
the failed job retry passed with the same gate. No approval gate was disabled.
Initial browser HTML was stale despite the origin deployment. Following the
existing runbook, only the passport URL was revalidated with no-cache headers;
final acceptance uses fresh normal-URL browser sessions, without query-busting,
extra headers, mocked responses or API interception. The final API ordering
correction was validated and deployed with byte readback; captures were refreshed.

## Remaining nonblocking limitations

Pouch and SanDisk images remain unavailable, rather than invented or borrowed
without verified identity/rights. No MicroFab mount is presented as developed or
available. Native-device testing and affiliate commission attribution are not
claimed by this desktop Chromium verification. No database schema migration was
required; the retailer association used the existing authenticated gateway with
plan-hash checking, idempotent repeat and readback. Temporary handlers removed.

[Production screenshots and evidence](../release-captures/creator-kit-production-20261017/README.md).
