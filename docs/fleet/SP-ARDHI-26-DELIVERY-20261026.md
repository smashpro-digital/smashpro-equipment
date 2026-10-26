# ARDHI delivery and receiving inspection — October 26, 2026

## Scope and evidence

SP-ARDHI-26 / YF380 was delivered October 26, 2026 by R+L Carriers, PRO IACO468333, freight origin CONVOY USA-SAVANNAH. The owner confirmed carrier delivery and supplied photographs showing the wooden shipping crate on the ground. Crated weight is approximately 950 kg; it is not operating weight. The carrier confirmation document itself has not been supplied for public publication.

Delivery is complete. Receiving inspection, unboxing, accessories/attachments inventory, engine and hydraulic fluid checks, first startup, first movement, operator commissioning and first field test remain pending. No operational, rental-ready, damage-free, inspection-passed or contents-accepted claim is made.

## Implementation audit

- Active route: `ArdhiPassportPage` → `EquipmentPassportPage` → protected `ArdhiPassportJourney`. The original flagship hero artwork, typography, layout and Expo QR mode remain; copy now celebrates arrival.
- `ardhiDelivery.ts` supplies one reviewed editorial delivery record to the equipment collection, Journey, media gallery and public passport projection. Existing `history-future-5` is completed rather than duplicated; old links remain valid.
- Original factory, payment, export, vessel and port records remain. October 9 port-arrival data remains an immutable historical snapshot. Customs-release and warehouse dates are not inferred from final delivery.
- `ShipmentJourney` presents delivery first and retains its older feed, vessel map and Atlas context inside “Earlier vessel and shipment evidence.” Older/cached/unavailable feed data cannot regress the new reviewed delivery state. Atlas has not been written to or relabeled as delivery proof.
- Commissioning evidence gates remain. Only delivery is documented; first job and service readiness stay pending. Sponsor opportunities and existing public QR/Expo links remain unchanged.
- This repository does not own the authenticated Smart Key PHP routes or operator sessions. No authentication, check-in handler, database or private custody record is changed. The stable Passport `#check-in` anchor links to the existing `/k/ARDHI26-K01/` route, which remains external; its HTTP availability was checked, not an authenticated operator session. No check-in is inferred from viewing this Passport.

## Delivery photographs

Owner source folder: `Ardhi shipment-20261026T142735Z-1-001/Ardhi shipment`.

| Original | Public gallery file |
| --- | --- |
| `20261026_090542.jpg` | `images/sp-ardhi-26-delivery-2026-10-26-carrier-and-crate.jpg` |
| `20261026_090549.jpg` | `images/sp-ardhi-26-delivery-2026-10-26-crate-on-ground.jpg` |

Two complementary views selected from 14 supplied photographs. Source files remain unchanged outside the repository. Public copies retain original JPEG pixels and only the orientation EXIF tag; GPS, camera metadata and trailing vendor payload were removed. Pixel equality and original-source hashes were checked. The carrier’s printed business phone is not a personal contact. No residential address, exact GPS coordinates or private operator information is published. Close-up labels and the photograph containing a person were not selected.

Images are associated once through `ardhiDeliveryPhotos` into the existing `Equipment.gallery` with group `delivery`. History points to the gallery; no second inventory/media record is created. The existing archive also exposes that same group. Delivery photographs are explicitly not factory-production or field-performance evidence. Public images load lazily at their declared dimensions.

For additional photos: review the actual image at full resolution; remove GPS/private metadata and any address/contact information before publication; preserve the private original; use fleet-prefixed filenames; add a unique existing media ID, date, alt text, caption and dimensions to the same gallery association. Never substitute factory or port media for final delivery. If no approved photos remain, the gallery renders its honest pending-media slot.

## Upcoming video and ecosystem links

`ardhiDeliveryVideos` is intentionally empty. Reuse the existing `EquipmentWatch` component for approved SmashPro HQ YouTube records. Shorts use `format: 'short'` (9:16); full-length uses `format: 'video'` (16:9). Public asset association, valid YouTube ID, publication date and verification date are required. No iframe loads before explicit consent; Watch on YouTube remains available. Neither a video placeholder nor an upload completes a commissioning check automatically.

Digital HQ remains canonical for media associations. When coverage is published, use its existing record/YouTube ID and associate it with SP-ARDHI-26; project those approved records into this existing public list. Do not upload a second copy, create another equipment registry, invent an API, or imply that this static list auto-syncs with HQ. No new backend endpoint or migration is part of this change.

Cross-links reuse `/media/` (Media Center), `/equipment/#fleet` (Showcase), `/` (WordPress stories), `/dashboard/` (Digital HQ sign-in), and `https://www.youtube.com/@SmashProHQ`. A delivery-specific WordPress article is not invented; replace the general stories destination only after an existing article URL is verified.

## Validation and release

Feature branch: `feat/ardhi-delivery-20261026`, isolated from the dirty original checkout, based on main `5d60fdb`.

Checks include TypeScript, unit tests, production build, public index/media/passport validation, delivery status and pending-commissioning regressions, Shorts/publication gates, keyboard history navigation, API failure/stale feed behavior, Expo mode and browser layout at 390/768/1440px. Captures are under `docs/release-captures/ardhi-delivery-20261026/`.

Protected hash fixtures are refreshed only for the reviewed ARDHI renderer and shared equipment-file change. The MZIGO portion, original drive-history hash, shared styles and deployment workflow remain unchanged.

No merge or deployment is authorized in this sprint. Remaining evidence: publishable carrier confirmation if desired; receiving inspection; unboxing and accessory inventory; engine/hydraulic checks; verified first-start/first-movement footage; operator commissioning; first field test; any future delivery article and HQ media association IDs.

### Results

- `npm.cmd run validate`: passed TypeScript, all 169 unit tests present at the full run, production build, public index, MZIGO media and passport artifact checks.
- Added metadata-privacy regression afterward: focused delivery suite passed 4/4 (170 total unit cases now present).
- Playwright: 4/4 passed at 390, 768 and 1440px, including API failure, historical feed isolation, pending readiness, photos decoded, keyboard history navigation, Expo and check-in destination.
- `git diff --check`: passed.
- Source photo pixels match the public JPEGs; only orientation and the ICC color profile remain as metadata. GPS and vendor metadata are excluded by a regression test.
- Existing Smart Key, dashboard and live Passport returned HTTP 200 during read-only checks. Media Center fetch timed out; its established repository destination is retained. No signed-in operator-session or physical NFC test was performed.
- Section captures hide the sticky navigation and focused skip link only during screenshot capture; behavior is tested with normal page styles.
