# AKASO Equipment integration — local implementation

October 13, 2026. Branch: `feat/akaso-equipment-integration-20261013`.
No deployment, merge, production approval or CRM mutation was performed.

## Placement and presentation

`src/pages/HomePage.tsx` renders `FieldTechnology` immediately after
`#rental-process` and before `#contractors`. Existing sections are preserved.
The component reuses `ButtonLink`, `section shell`, `section-heading`, `eyebrow`
and the existing design tokens. The optional sponsored button prop leaves
existing button behavior unchanged while supplying a new tab and
`rel="sponsored noopener noreferrer"` for this affiliate action.

The card says Exploring, describes equipment demonstrations, operator POV and
Equip Expo 2026 as plans, and makes no purchase, testing, sponsorship or sale
claim. Commission disclosure appears immediately after the CTA on both widths.
No secondary `/gear/` CTA is rendered. No product image, third-party impression
pixel, analytics event, feed credential or fallback tracking URL is bundled.
Creative publication is a separate approval; it is not required for this text
card. The supplied long URL is used unchanged only when returned by HQ.

## API contract and failure behavior

Same-origin request, with credentials omitted and cache disabled:

`/dashboard/api/public_gear.php?property=hq&placement=equipment.field-technology.akaso360`

Companion Digital HQ work on the same branch name extends its existing
`dashboard/api/public_gear.php` and `_affiliate_catalog.php`. It preserves the
private admin/session/CSRF boundary and existing default Gear projection. It
registers a separate hidden Equipment placement through the existing gated
inventory operation and requires independent publication review. No Garage
permission is created or inherited. See the companion HQ document
`docs/partnerships/akaso-equipment-public-catalog-20261013.md` for its exact PHP
deployment allowlist and registration/recovery procedure.

The consumer requires schema version 1, `ok=true`, property `hq`, the exact
Equipment placement, a fresh `generated_at`, one approved AKASO 360 projection
and one eligible link. It validates the Awin host/path, advertiser 69454,
publisher 3121518, product destination, disclosure and bounded `valid_until`.
It rejects duplicate identity parameters, malformed responses, redirects,
HTML/error responses, unknown/wrong-property data and expired projections.
Server eligibility is authoritative; the frontend cannot infer approval from
a working tracking URL. There is no local approval override.

No card is rendered while loading or after missing/failed approval data. Polling
occurs every 15 seconds while visible, with a 5-second request timeout. The
server limits each link to at most 60 seconds (or earlier permission expiry).
The UI removes expired data, clears failed refreshes, and clears/rechecks when
tab visibility changes. Clicking after lease expiry is prevented. Revocation
is bounded by refresh/lease timing, not claimed to be instantaneous.

## Authorized evidence and live observations

- The actual Awin message **Welcome to the AKASO Affiliate Program**, received
  October 13 at 09:02:22 UTC, was read through the authorized Gmail connection.
  It confirms program acceptance and directs the publisher to generate links.
  This supersedes any claim that acceptance itself is unknown. Raw mail and
  private headers are not committed.
- A fresh HEAD redirect check of the owner-supplied long URL returned HTTP 200
  at `shopakaso.com/products/akaso-360?variant=44081902846134`, carrying publisher
  `3121518` and advertiser `69454` attribution parameters. Generated click IDs
  are not retained. Routing success does not establish live account activation,
  recorded click/conversion attribution, commissions, or placement authorization.
- The canonical public catalog path returned **404**, the root
  `/api/public_gear.php?property=hq` returned **500**, and anonymous access to
  `/dashboard/api/affiliate_foundation.php?action=state` returned **401**.
- HQ's dashboard deployment uploads `dashboard/dist/` and explicitly excludes
  API directories. The PHP endpoint requires a separate scoped release; the
  Equipment static build cannot install it. Root `/api/` is not a substitute.
- Prior retained authorized HQ inspection reports missing catalog extension
  tables and pending/hidden canonical AKASO records. No fresh database mutation
  or account-status read was performed in this continuation.

## Validation and screenshots

- `npm run typecheck` and production build pass.
- `node --test --test-concurrency=1 tests/*.test.mjs`: 130 tests pass.
- 13 browser tests pass across the initial suite and focused revocation/timeout
  follow-up. They cover approved and withheld data, API/network/malformed failures,
  property/placement restrictions, expiry, failed refresh, revocation and timeout.
  They verify section order, four field-fleet cards, existing section anchors,
  footer, no horizontal overflow, keyboard focus and sponsored-link attributes.
- Captures use **synthetic local approved data**, not production approval:
  [390px](release-captures/akaso-field-technology/approved-fixture-390.png) and
  [1440px](release-captures/akaso-field-technology/approved-fixture-1440.png).
  No affiliate link was clicked and no third-party creative request was made.
- Focused PHP 7.4 public-projection and approval/entrypoint tests pass in HQ.
  Host MySQL integration, migration/retry testing and authenticated review are
  separate outstanding release checks.
- Public index, MZIGO media and passport artifact validations pass;
  `git diff --check` passes in both repositories.

Reproduce screenshots after building:
`npx playwright test --config playwright.field-technology.config.ts`.

## Remaining production prerequisites

1. Verify current recovery coverage and restorability for the affected HQ tables
   and application files; the older May backup evidence is insufficient.
2. Reconcile and release the existing catalog schema/inventory through the
   authenticated recovery-gated process. Resolve real Equipment placement/link
   IDs, verify hidden defaults/idempotency, then deploy the scoped public PHP API
   and verify its no-store response contract and private admin 401 boundary.
3. Verify live Awin activation and tracking evidence for advertiser 69454 and
   publisher 3121518, separately from the confirmed welcome and redirect check.
4. Obtain explicit public authorization and current HQ reviews for the exact
   Equipment placement, product, link, disclosure and relevant permissions.
   Garage stays excluded. `/gear/` is not required.
5. Only then release the Equipment build through its established manual workflow
   and verify live rendering, withdrawal/cache behavior, links and responsive
   captures. Local fixtures and passing tests are not a production release.
