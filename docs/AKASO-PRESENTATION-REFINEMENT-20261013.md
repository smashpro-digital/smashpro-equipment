# AKASO presentation refinement — 2026-10-13

The Equipment homepage displays one premium AKASO 360 showcase. The separate advertiser slideshow is no longer mounted below the product card.

## Scope

- Removed the `AffiliateCreativeRotator` import and render from `src/components/FieldTechnology.tsx`.
- Preserved the official product image, Capture Every Angle headline, Exploring state, description, original Awin CTA, Equipment YouTube CTA and affiliate disclosure.
- Preserved the reusable rotator, creative catalog parsing, rotation configuration and analytics implementation. Digital HQ source, records and production database were not modified.
- The section remains immediately after rental process and before contractors. No replacement wrapper or spacing was introduced.
- Updated Equipment browser expectations for zero, one and five approved creatives. Catalog creatives must never mount the retired slideshow on this page.

## Validation

Passed: 135 unit tests, TypeScript, production build, customer-safe index/media/Passport checks, ARDHI artifact verification, live approved catalog checks and `git diff --check`.

All seven presentation browser tests passed in the final serial run. The 12 existing failure/approval browser cases passed across the initial run and targeted reruns. Three initial startup/expiry assertions failed under local memory pressure; revocation and zero-creative checks passed on rerun, and the short expiry fixture was made deterministic.

390px and 1440px local fixture and live production captures confirm one product card, no advertiser slideshow, no horizontal overflow, and preserved disclosure/CTAs.

The existing expiry browser test now freezes time before loading its two-second approval fixture, so machine scheduling does not expire the fixture before its first assertion.

## Release procedure

Merge the dedicated PR after required checks pass. Dispatch the existing `deploy.yml` workflow on main with `akaso_release=true` and `shipment_release=false`. This validates and publishes the static Vite artifact through the established FTP workflow, without Railway or database changes.

Rollback uses the previous reviewed Equipment source and the same validated workflow; no database rollback is involved.


## Production evidence

- Implementation commit: `9f264b58a41fe3f0c53e2385f4a1cd322f67e8d6`.
- [PR #90](https://github.com/smashpro-digital/smashpro-equipment/pull/90), merged after [required checks passed](https://github.com/smashpro-digital/smashpro-equipment/actions/runs/38476240345).
- Deployed merge: `0d4e29d5f0a08885dff20689904ae5b79b0f1d23`.
- [Production workflow](https://github.com/smashpro-digital/smashpro-equipment/actions/runs/38476594707): validation and deployment succeeded; `akaso_release=true`, `shipment_release=false`.
- [Live Equipment page](https://smashpro.app/equipment/), verified 2026-10-13 at 22:21 UTC using normal browser requests.
- Served `main-DCyz2j88.js` matched the local production artifact, SHA-256 `516d0fd165d30697df434ccd857b4409486fa031fe157c36ba80ea56fb3168d3`.
- [390px live screenshot](release-captures/akaso-refinement/production-390.png) and [1440px live screenshot](release-captures/akaso-refinement/production-1440.png).
- [Browser readback](release-captures/akaso-refinement/production-validation.json) and [artifact verification](release-captures/akaso-refinement/artifact-verification.json).

Both live viewports showed exactly one official image, zero rotators, no empty wrapper, no horizontal overflow, no page errors and no creative-event requests. Rental process remains before Field Technology and contractors after it. Existing fleet cards and page sections remain present.

The affiliate CTA exactly matches the HQ-provided Awin URL, opens in a new tab, and retains `sponsored noopener noreferrer`. The disclosure and Equipment YouTube destination are preserved. Verification did not generate affiliate clicks or assert conversions.

The public catalog still returns creatives `4587303` and `4587311`; the Garage request returns HTTP 400. No HQ code, permissions, creative records, rotation configuration, analytics infrastructure or production database was changed.
