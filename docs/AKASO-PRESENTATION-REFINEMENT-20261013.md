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

390px and 1440px local fixture captures confirm one product card, no advertiser slideshow, no horizontal overflow, and preserved disclosure/CTAs. Browser failure/expiry checks are being finalized before merge. Production readback is pending deployment.

The existing expiry browser test now freezes time before loading its two-second approval fixture, so machine scheduling does not expire the fixture before its first assertion.

## Release procedure

Merge the dedicated PR after required checks pass. Dispatch the existing `deploy.yml` workflow on main with `akaso_release=true` and `shipment_release=false`. This validates and publishes the static Vite artifact through the established FTP workflow, without Railway or database changes.

Rollback uses the previous reviewed Equipment source and the same validated workflow; no database rollback is involved.
