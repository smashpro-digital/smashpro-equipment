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
