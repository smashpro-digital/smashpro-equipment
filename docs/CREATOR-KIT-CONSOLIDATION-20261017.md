# Creator Kit card consolidation ? 2026-10-17

Production scope: SP-MED-CAM-001, passport 4, media property 1, placement 8 (`equipment.media.sp-med-cam-001`), affiliate relationship 1. Creator Combo product 1; protective pouch product 7. Six public cards; seven historical kit associations remain stored.

## Existing authorized image

The source is the existing product 7 passport media association, authorization `2026-10-17-creator-kit-completion`, URL https://cdn.shopify.com/s/files/1/0632/9037/6374/files/b2066e5e826e581b37b149b3709f678e_1d508e23-6f64-490e-b0dc-891048098ae7.jpg?v=1763029956 (1600 x 1600). There is no separate numeric media-asset ID in this existing JSON association. The source association and product 7 image_url are preserved, including source URL, source alt text, rights/visibility approval, verification timestamp and owner authorization. No image download, upload, copied file or new asset is needed.

Camera association adds `media_product_key=akaso-360-protective-pouch`. The resolver follows that existing association under the same publication/rights/media-property checks, then binds its approved image to product 1 for display. `source_product_id=7` records the source reference in the safe projection. Camera-specific alt describes the complete Creator Combo. Hidden source associations remain usable for an explicitly approved image reference; hiding a card is not revoking image rights. Revoking source rights still removes the referenced image.

Only the pouch association gets `card_visibility=hidden`. Procurement/inventory/catalog product records are neither removed nor changed. Display orders remain 10,20,30,40,60,70 in public output; stored pouch order 50 remains intact. Other five public cards must be byte-equivalent to pre-change API output.

Camera description is ?Independently purchased by SmashPro.? Badge IN OUR KIT. CTA SHOP AKASO 360 retains the exact approved Awin URL (advertiser 69454, publisher 3121518). A separate small shopping note retains the existing Standard Combo destination distinction; SmashPro owns Creator Combo. No new tracking URL or attribution claim.

The kit renderer now prefers its validated association image over the catalog fallback. Hero still uses the unchanged Awin catalog image. No CSS, hero, Shorts, MicroFab, navigation, heavy-equipment or infrastructure changes. Garage remains excluded.

## Operations and rollback

Registration `2026-10-17-creator-kit-consolidation` changes only two existing entries in passport 4 public_identity_json. The fixed-scope handler uses the established authenticated migration endpoint with dry-run plan hash, expected-current-value checks, locking, transaction, readback and identical-repeat support. No direct MySQL connection or schema migration. Original entries retained in the manifest for an authenticated scoped rollback. Preserve existing gateway bytes and remove temporary handler after use.

Backend deployment is restricted to dashboard/api/_media_equipment.php through the existing authenticated API file transport, with prior bytes retained. Equipment rollback artifact is the last successful production run 39041616771. Deploy backend and verify public response before Equipment workflow with shipment_release=false and akaso_release=true. No Railway dependency.

## Validation

PHP 7.4 kit tests include hidden-card behavior, approved source reference reuse, image-rights withdrawal, preserved affiliate URL and unchanged hero catalog. Frontend tests cover camera-image precedence, unchanged hero, six cards, no pouch, required CTA, retained other actions and 390/768/1440 layouts. Final production results recorded after deployment.

## Production release completed

- Creator Combo product **1**; protective pouch product **7**. Existing image reference: product 7 passport `media` association, now referenced by camera `media_product_key`. There is no separate numeric image-asset ID to report. No image file copied or downloaded for repository storage.
- Catalog mutation: passport **4** public_identity_json only. Camera adds the approved source reference, descriptive alt, requested description and separate existing-destination note. Pouch adds `card_visibility=hidden`. All seven stored kit entries remain. Authenticated readback confirms product rows, links, feeds, permissions, source media metadata and the other five kit entries are unchanged.
- Registration **2026-10-17-creator-kit-consolidation** passed anonymous HTTP 401, dry-run/apply, identical repeat and transaction readback. Temporary handler removed and gateway restored. No schema migration.
- HQ implementation `e2527f9635a4932980d850f3afc4b5f453d2f6d8`; [PR 250](https://github.com/smashpro-digital/digital-hq/pull/250), merge `cb6be01b7ef043a50e5ccba74947cd301c623461`.
- Scoped backend deployed first: dashboard/api/_media_equipment.php, SHA-256 `fef6be6a011001a4b97fc4bb9e7e4547df5a8ca869f4854a20b954bf77191739`, exact server-byte readback. Existing authenticated FTP API transport; no dashboard-only deployment.
- Equipment implementation `e3c0bcdbd124b60877687f1d28bff7f2c5d97792`; [PR 107](https://github.com/smashpro-digital/smashpro-equipment/pull/107), production merge `816ad649738b768cbaa8f98b3a9de266ba9b0bd2`.
- [Production workflow 39082811697](https://github.com/smashpro-digital/smashpro-equipment/actions/runs/39082811697) validation/deployment succeeded with shipment_release=false and akaso_release=true. Railway shipment services were not required.
- Live JS main-Cw7_Mytc.js matched the tested build bytes, SHA-256 `afd5ae24f57fe4a3dcf019364bb76ef5b48a0330875de3ede6e37f4b195056bf`. Target-page compressed HTML revalidated before normal-browser readback.

## Acceptance evidence

[Public API](https://smashpro.app/dashboard/api/public_media_equipment.php?property=hq&asset=SP-MED-CAM-001): exactly six items, camera image source_product_id 7 bound to product_id 1, exact existing Awin URL and SHOP AKASO 360 label. Other five public card objects match pre-change output. Hero catalog image, two video records and MicroFab associations match. Garage requests return HTTP 400.

[Live page](https://smashpro.app/equipment/sp-med-cam-001.html#field-kit) verified at 390/768/1440: six unique card images decoded; pouch heading absent; camera image and IN OUR KIT badge correct; SHOP AKASO 360 has original Awin URL and sponsored noopener noreferrer; remaining links and disclosure intact; equal row heights and no horizontal overflow or JavaScript errors. Existing Awin destination resolves HTTP 200; redirects do not prove commission attribution.

Hero screenshots are byte-identical to prior release at all three widths. Consent-based Shorts and MicroFab remain present. Landing page and ARDHI/MZIGO/NYASI/UMBA/LIFTMATE live routes returned HTTP 200, with no JavaScript errors or overflow. Responsive Chromium verification does not claim physical-device testing.

TypeScript, all **163 unit tests**, production build, public index/MZIGO/passport checks and PHP 7.4 guards passed. All 13 browser scenarios passed: the initial run caught a fixture camera-ID mismatch in three new layout assertions; correcting the fixture to reuse its catalog ID allowed all four Creator Kit checks to pass on rerun without loosening application guards. Diff whitespace checks and secret scans passed.

Production screenshots and receipts: Equipment `docs/release-captures/creator-kit-consolidation-20261017/`, including full-page, hero and kit images at 390, 768 and 1440, plus hero-comparison.json and catalog/API/affiliate/deployment receipts. No remaining blocker.

## Changed files

Equipment: `src/components/CreatorKitCard.tsx`, `src/domain/mediaEquipment.ts`, `tests/browser/media-equipment.spec.mjs`, `tests/fixtures/creator-kit.mjs`, `tests/media-equipment.test.mjs`, this report and release captures.

HQ: `dashboard/api/_media_equipment.php`, `ops/media-passports/test-kit.php`, `ops/media-passports/creator-kit-consolidation.json`, `ops/media-passports/gateway-kit-consolidation.php`, this report. Only the API PHP module is permanently deployed; registration tooling is retained in source history.
