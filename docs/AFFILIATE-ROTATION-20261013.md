# Equipment affiliate banner rotation

The existing `HomePage.tsx` renders Field Technology after rental process and before contractors. `FieldTechnology.tsx` now passes HQ's optional approved creative collection to `AffiliateCreativeRotator.tsx`, below the fixed product showcase. Product image, AKASO 360 copy, primary affiliate CTA, disclosure and Equipment YouTube CTA remain unchanged. No Gear destination or sitewide advertising carousel was added.

## Behavior

HQ manages selection without a frontend release. The client validates public property, placement, campaign identity, dimensions, accessible text, bounds and **exact** original Awin image/tracking URLs. Invalid banners are discarded independently of the valid product. API failure or an expired parent authorization lease removes the whole affiliate section, using the existing 15-second refresh / maximum 60-second lease.

Only one banner is rendered. Eight-second interleaved weighted slots respect HQ display order; higher weight provides more exposure slots. Consecutive slots for the same creative keep the same image. Previous/next follows display order and pauses playback; Play resumes from the selected creative. Rotation also pauses outside the viewport, in a hidden tab, on hover, or while keyboard focus is inside the component. Reduced motion disables automatic playback and animation; manual navigation remains available.

The responsive frame reserves a fixed height independent of aspect ratio and contains artwork without cropping. Broken images are skipped; if none load, a reserved-space fallback retains the product CTA above. One creative hides unnecessary controls; zero approved creatives hides the rotator. Controls are at least 44px, labeled, keyboard accessible and have visible focus outlines. Automatic changes are not live-announced.

Telemetry requires a successfully loaded image at least 50% visible for one second. Each assignment records at most one impression per component mount. Clicks are best-effort same-origin POSTs with a random event ID; they do not delay or rewrite the sponsored Awin link. HQ derives all attribution IDs and rechecks eligibility. No cookies, visitor IDs or personal information are sent. Counts are browser estimates, not affiliate conversions or earned commission.

## Changed implementation

- `src/components/AffiliateCreativeRotator.tsx`: reusable presentation and playback.
- `src/domain/affiliateCreatives.ts`: public validation, weighted schedule and telemetry.
- `src/styles/affiliate-creative-rotator.css`: scoped responsive styles using existing tokens.
- `src/components/FieldTechnology.tsx` and `src/domain/fieldTechnology.ts`: optional collection integration.
- `scripts/verify-akaso-catalog.mjs`: extended public field allowlist and banner validation.

## Validation and release

Local production build, 135 unit tests and public index / Passport artifact checks pass. Browser scenarios cover five synthetic active creatives, one, zero, expired, broken image, unavailable API, Garage rejection, reduced motion, offscreen pause, direct click URL, static product image, 390px and 1440px layout. Fixture screenshots in `docs/release-captures/affiliate-rotation/` are **local synthetic approvals**, not production evidence. Production contains only two eligible evergreen creatives; the other three remain centrally managed but inactive.

Digital HQ owns migration `2026-10-13-affiliate-rotation`, canonical creative records 1–5 and Equipment placement 3. Deploy HQ API/schema and admin controls first; verify the live public catalog before deploying this React build through the established Equipment workflow with `akaso_release=true` and `shipment_release=false`. No Railway dependency is introduced.

Owner explicitly waived the originally requested database backup verification after production inspection. No database restore point is claimed. Scope changes are additive; rollback disables assignments and restores prior application/API artifacts while retaining schema and reporting history. Live deployment receipts and screenshots are recorded after release.

## Production release result

Released on 2026-10-13. HQ implementation `df44ff37d0d69ecbcae358f46357bed867f16a4f`, merged as `fa429e7469e8651569cf75b8bba633b2109e492c` in [PR 232](https://github.com/smashpro-digital/digital-hq/pull/232). PHP 7.4 and 8.2 CI [38463748496](https://github.com/smashpro-digital/digital-hq/actions/runs/38463748496) passed. Dashboard deployment [38464007398](https://github.com/smashpro-digital/digital-hq/actions/runs/38464007398) succeeded; the served `index-DCeuT5ot.js` contains the rotation administration controls. Four API files were separately uploaded and hash-verified through the scoped API procedure.

Migration `2026-10-13-affiliate-rotation` applied through the existing authenticated endpoint on MySQL 5.7.44. Missing schema and five inactive assignments were created; repeat execution returned already-applied without changing existing records. The fixed activation adapter then enabled creative records/assignments **1 and 5**. Records/assignments **2, 3 and 4** remain inactive. Placement **3**, campaign **3**, program **1**, property **1** are unchanged. Both adapters passed retry verification. The gateway was restored and all temporary helpers removed, including the final read-only inspection helper.

The [live Equipment catalog](https://smashpro.app/dashboard/api/public_gear.php?property=hq&placement=equipment.field-technology.akaso360) returns only the two authorized banners and the static AKASO 360 showcase. Garage and unknown scopes return 400; anonymous admin requests return 401. Exact Awin URLs and public-field allowlists passed verification.

Equipment's final source is `a31cac9d09de49f534c26051b1546406c72eab0f`, merged as `15d7c8a8453f947a8efec76c0f6592aaf3d69a3e` in [PR 88](https://github.com/smashpro-digital/smashpro-equipment/pull/88). Final deployment [38467561399](https://github.com/smashpro-digital/smashpro-equipment/actions/runs/38467561399) succeeded with the live AKASO gate enabled. Served bundle `main-MFx_rFtq.js` exactly matches the local production build (SHA-256 `4e779fe8332088cc995d7038d75b7479c927e43f3189697d0edd6fcfba72f005`). This includes the initial [PR 87](https://github.com/smashpro-digital/smashpro-equipment/pull/87) implementation and a small control-bar height correction: losing one broken banner no longer shifts the surrounding page. Focused 390px and 1440px failure-transition tests passed, increasing browser coverage to 13 scenarios. Live captures were refreshed against this final CSS, including its reserved control-bar height.

Live browser checks at **390px and 1440px** verified automatic rotation, fixed product imagery, unchanged affiliate/YouTube CTAs, disclosure, section order, stable banner dimensions and no overflow or page errors. Impression requests returned 202; authenticated database readback showed two impressions each for creative records 1 and 5, zero clicks, and NULL conversions. No affiliate navigation was generated by loading the page. Local tests cover click submission and original link preservation; commission attribution is not claimed.

The local HQ administration test also passed: weight, order, UTC schedule, optimistic revision, CSRF submission and performance display. All 135 Equipment unit tests and all 13 browser scenarios passed, along with builds, public-index/Passport validation and `git diff --check`. The browser timing test was corrected to use real elapsed time so it did not artificially trigger the catalog's network timeout. PHP 7.4 CI's guard harness retains the configured JSON extension.

No technical deployment blocker remains. The three excluded creatives need appropriate current content/authorization before activation. The owner's explicit backup waiver remains recorded; no database restore point or commission outcome is claimed.

Live captures: [390px](release-captures/affiliate-rotation/production-390.png), [1440px](release-captures/affiliate-rotation/production-1440.png). [Browser receipt](release-captures/affiliate-rotation/production-validation.json) and [release/database receipt](release-captures/affiliate-rotation/hq-release.json).

Final release cache verification: scoped gzip and Brotli revalidation of `/equipment/` replaced stale HTML referencing the previous bundle. Final captures use fresh browser contexts at the normal URL, without response interception or cache-busting query parameters.
