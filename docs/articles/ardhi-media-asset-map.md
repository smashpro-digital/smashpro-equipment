# SP-ARDHI-26 media asset usage map

Generated with the November 3 media-stories build. The canonical machine-readable
manifest is `src/data/ardhiMediaCollection.ts`; this file is the human summary.

Derivatives: `-web.jpg` (≤1920px, q82, EXIF-corrected), `-thumb.jpg` (≤640px) and
`-poster.jpg` (video frame). Originals are retained unmodified next to them in
`images/`. All published URLs are production URLs under
`https://smashpro.app/equipment/images/`.

Legend: **C** = media collection page chapter, **A/B/C-story** = article draft
(A = Factory Floor to First Dirt, B = Dirt Day, C = Early Ownership Log),
**WP** = WordPress Media Center card, **P** = passport (pre-existing placement).

## Published in this build

| Asset (original) | Chapter | Placements |
| --- | --- | --- |
| sp-ardhi-26-assembly-in-progress.jpg | factory | C, A-story |
| sp-ardhi-26-factory-assembly-floor.jpg | factory | C |
| sp-ardhi-26-powertrain-installation.jpg | factory | C |
| sp-ardhi-26-hydraulic-system-installation.jpg | factory | C, A-story |
| sp-ardhi-26-factory-function-test.jpg | factory | C |
| sp-ardhi-26-bucket-branding.png | factory | C |
| sp-ardhi-26-factory-build-walkaround.mp4 (+ new poster) | factory | C |
| sp-ardhi-26-factory-departure-2026-09-02.mp4 (existing poster) | factory | C (P: history) |
| sp-ardhi-26-shipping-2026-08-21-01.png | shipping | C, A-story (P: gallery) |
| sp-ardhi-26-shipping-2026-08-21-02.png | shipping | C (P: gallery) |
| sp-ardhi-26-savannah-port-arrival.png | shipping | C (P: port arrival) |
| sp-ardhi-26-delivery-2026-10-26-carrier-and-crate.jpg | uncrating | C, A-story (P: delivery) |
| sp-ardhi-26-unboxing-2026-10-26-crate-opened.jpg | uncrating | C, A-story (P: delivery) |
| sp-ardhi-26-unboxing-2026-10-26-panels-removed.jpg | uncrating | C (P: delivery) |
| sp-ardhi-26-inspection-pallet-forks-unboxed-2026-10-27.jpg | uncrating | C, fork attachment passport evidence |
| sp-ardhi-26-inspection-engine-739cc-2026-10-27.jpg | uncrating | C, C-story hero |
| sp-ardhi-26-inspection-pallet-forks-mounted-2026-10-27-01.jpg | uncrating | C, C-story, fork attachment passport hero + evidence |
| sp-ardhi-26-inspection-testing-2026-10-27.mp4 (+ new poster) | uncrating | C |
| sp-ardhi-26-field-test-2026-10-31-04.jpg | field | C lead/hero, A-story hero, WP card |
| sp-ardhi-26-field-test-2026-10-31-01.jpg | field | C, A-story, B-story |
| sp-ardhi-26-field-test-2026-10-31-12.jpg | field | C, B-story hero |
| sp-ardhi-26-field-test-2026-10-31-16.jpg | field | C, B-story |
| sp-ardhi-26-field-test-worksite-2026-10-31.jpg | field | C, B-story |
| sp-ardhi-26-field-test-2026-10-31.mp4 (+ new poster) | field | C |
| sp-ardhi-26-field-test-2026-10-28.mp4 (+ new poster) | field | C |
| sp-ardhi-26-field-qa-control-panel-2026-10-31.jpg | inspection | C, B-story, C-story |
| sp-ardhi-26-field-qa-slew-gear-2026-10-31-01.jpg | inspection | C |
| sp-ardhi-26-field-qa-cylinder-mount-2026-10-31.jpg | inspection | C, C-story |
| sp-ardhi-26-field-qa-bushing-2026-10-31.jpg | inspection | C |
| sp-ardhi-26-measurements-2026-10-31-01.jpg | inspection | C, C-story |
| sp-ardhi-26-measurements-2026-10-31-06.jpg | inspection | C |

## Reviewed, intentionally not published

| Asset | Reason |
| --- | --- |
| sp-ardhi-26-field-test-operator-2026-10-31-01..03.jpg | Operator identity publication approval pending |
| sp-ardhi-26-field-test-2026-10-30.mp4 | Redundant with the October 31 clip; one field video per session |
| sp-ardhi-26-field-test-2026-10-31-02/03/05–11/13–15/17–20.jpg | Near-duplicates of the five selected Dirt Day frames |
| sp-ardhi-26-measurements-2026-10-31-02–05/07–10.jpg | Near-duplicates of the two selected measurement frames |
| sp-ardhi-26-inspection-engine-oil-fill-2026-10-27.jpg | Oil history already covered by checklist text; avoid implying a verified service |
| sp-ardhi-26-inspection-front-grille-decal-2026-10-27.jpg, -fork-frame-rear-2026-10-27.jpg, unboxing tool-case | Documented, available for future stories; not needed for current curation |
| sp-ardhi-26-field-test-2026-10-31-07.jpg | Not reviewed at full quality in this pass |

## Known placement history (unchanged)

Passport gallery/history media defined in `src/data/equipment.ts`,
`src/data/ardhiDelivery.ts`, `src/data/ardhiEvidenceHistory.ts` and
`src/data/ardhiPortArrival.ts` keep their existing placements; this collection
references the same files without moving or renaming them.

## Publishing dependencies

- WordPress article import is manual (no WP credentials in this workspace); drafts in
  this folder are import-ready. Links from the media collection's featured-story cards
  point at chapters/passport until the articles go live.
- The Media Center card ships with the next `deploy-smashpro-theme-patch` dispatch; it
  links to the equipment-hosted collection page, so the equipment deploy should go
  first.
- Operator-identity media stays withheld until publication approval is recorded.
