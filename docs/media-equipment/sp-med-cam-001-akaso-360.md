# SP-MED-CAM-001 — AKASO 360

Public route: https://smashpro.app/equipment/sp-med-cam-001.html

SmashPro owns this AKASO 360 Creator Combo. It has been received and powered on. Commissioning and field-performance testing are not complete. Private acquisition details are held only in Digital HQ.

The passport combines an approved affiliate purchase feature with operator-content use cases, proposed MicroFab development categories, an operator-kit concept, and a provenance-gated footage gallery. No approved captured footage or compatible accessory products were available at initial registration. Empty states are intentional. The official Equipment channel is [@SmashProHQ](https://www.youtube.com/@SmashProHQ); Garage is excluded.

## Canonical references

- Physical asset: `spd_tech_equipment` **39**.
- Acquisition: `spd_inventory_purchases` **4**.
- Media passport: **4**.
- Affiliate relationship **1**, product **1**, original product link **1**.
- New exact-route public placement **8**, key `equipment.media.sp-med-cam-001`.
- Equipment media property **1**, campaign **3**.
- Schema migration `2026-10-15-media-equipment-passports`.
- Registration migration `2026-10-15-sp-med-cam-001-registration`.

Registration reconciled all matching camera records, including archived/deleted records, before insertion. Initial failed transactions rolled back; auto-increment gaps do not indicate duplicate assets. No custodian was invented and the camera is not marked available or field-ready. The existing AKASO organization and affiliate records were reused.

## Validation and release evidence

Run `npm run validate`, `npm exec playwright test -- --config playwright.media-equipment.config.ts`, and `git diff --check`. Browser coverage includes direct refresh, responsive layouts, sponsored attributes, disclosure, broken imagery, unavailable/revoked projection, and exclusion of Garage/checkout links. Use `MEDIA_LIVE=1` with the same browser suite after deployment; screenshots are saved under `docs/release-captures/media-equipment/`.

Public API readback returned 200 after registration. Anonymous migration access returned 401. A repeated migration dry run confirmed both ledger entries already applied. PHP 7.4 projection tests cover allowlisting, private-field removal, safe video URLs, and exact placement scope.

See [architecture and release procedures](media-passport-architecture.md) for remaining commerce and original-clip source-policy work. There are no fabricated published videos, products, prices, inventory, or test results.

Local release validation: 153 Node tests passed; TypeScript, production build, public-index and protected-passport checks passed. Five browser scenarios passed across the release checks. A transient refresh request exceeded the five-second fetch timeout; the refresh assertion allows the existing 15-second retry to recover. The HTTPS response Date is used to account for device clock skew without extending authorization leases.

## Production release

Equipment PR [#100](https://github.com/smashpro-digital/smashpro-equipment/pull/100), commit `eecd006`, merged as `ec7314b`. Workflow [38787500174](https://github.com/smashpro-digital/smashpro-equipment/actions/runs/38787500174) deployed successfully with the AKASO authorization check enabled. Anonymous live direct-load/refresh, API withdrawal, image fallback, affiliate CTA/disclosure, and 390/768/1440 checks all passed (five browser tests). Live captures are stored beside the local screenshots.

Digital HQ PRs [#238](https://github.com/smashpro-digital/digital-hq/pull/238) and [#239](https://github.com/smashpro-digital/digital-hq/pull/239) add the backend and keep the exact camera placement reviewable through existing authenticated affiliate administration. Four scoped API files were hash-verified; the original migration gateway was restored and temporary includes removed. Garage/unknown-field requests returned 400 and absent passports returned 404.

A final homepage readback found its pre-existing five-second clock-skew tolerance hid the showcase on this device. The same conservative response-Date lease handling is now applied to the homepage; expired authorizations still disappear and request duration is charged against the lease. A homepage regression test checks showcase position, the passport link, sponsored CTA, and preserved sections.
