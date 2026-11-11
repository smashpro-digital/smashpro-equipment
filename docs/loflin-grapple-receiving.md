# Loflin grapple receiving passport V3

The existing `SP-ATT-GRP-001` passport / `SP-GRP-ARDHI-01` asset represents serial **2459685**, model **SMPRMINIRG**, manufactured **October 22, 2026**, physically received **November 11, 2026**. No second attachment record is created.

## Public truth and readiness

- Passport: **Received · Identification Verified · Commissioning Pending**.
- Showroom: **Received · Commissioning Pending**, linking once to `/equipment/attachments/sp-att-grp-001/`, whether featured or in a category.
- Physical plate maximum: **3,200 PSI**, superseding preliminary 3,500 PSI procurement guidance. Factory sticker: **TESTED 3200 PSI**. This is not an operational commissioning test.
- Mount: **TORODINGO**; planned host **SP-ARDHI-26**, not verified physical fitment.
- Manufacturer attachment specification: **370 lbs**. Estes freight shipment: **one piece, 390 lbs**. Nameplate weight: **blank**. No measured attachment weight is claimed.
- Invoice #292: **$2,297 paid** ($297 September 9, $1,000 October 30, $1,000 November 5); **$0 outstanding**.
- Estes PRO **0178760094**, shipped November 5, delivered by **ACME Logistics November 11**, **Front Door Service**, Hopkins, South Carolina. Private destination ZIP, label links, payment methods/card data and raw receipt files are not published.

ARDHI's throttle-control repair blocks attachment operation. Physical condition, mount/locking, couplers, hose clearance, leaks, controlled unloaded jaw cycling, operator readiness/safety review and the first brush/debris test all remain pending. Field Test 001 is a plan with no results. No service link or operational activation is added.

## Media

Reused owner-approved WordPress photo: https://smashpro.app/wp-content/uploads/2026/11/20261111_092910.jpg . It shows the delivered grapple on its timber cradle beside the lowered liftgate and pallet jack. The original is retained without duplicate upload and displayed as the hero, showroom image and receiving gallery entry.

The official manufacturer image remains an explicitly secondary reference, not receiving or field-test evidence.

Ten individually requested approved files remain unavailable:

| Slot | Required photograph |
| --- | --- |
| `loflin-acme-truck` | ACME Logistics delivery truck |
| `loflin-liftgate` | Liftgate unloading sequence |
| `loflin-pallet` | Grapple on shipping pallet detail |
| `loflin-front` | Front grapple construction |
| `loflin-rear-mount` | Rear Toro Dingo mounting plate |
| `loflin-hydraulics` | Hydraulic cylinder and hose routing |
| `loflin-nameplate-20261111` | Manufacturer identification plate |
| `loflin-test-sticker` | Factory pressure-test sticker |
| `loflin-measurements` | Mounting measurements |
| `loflin-estes-delivery` | Estes carrier delivery photograph |

These are media-slot IDs, not invented filenames. Original missing filenames were not supplied. The supplied overview also shows the cradle and liftgate, but is not duplicated into multiple slots to imply eleven distinct images.

To publish a slot, inspect the authentic owner file, reuse an existing approved media URL when available, exclude private labels/addresses/payment evidence, and set its `image`, descriptive `imageAlt`, caption (`description`) and `status: "verified"` in [attachments data](../src/data/attachments.ts). Verified status here means an approved photograph, not commissioning completion. Entries without an approved image and alt text remain labeled missing. [AttachmentReceiving](../src/components/AttachmentReceiving.tsx) reuses the existing native-dialog gallery. Update the hero and showroom source together in the same attachment record if a better approved product image becomes available.

## Database and deployment

The passport/showroom still use static repository data. Neither a commit nor a PR mutates production data. [Digital HQ Issue #311](https://github.com/smashpro-digital/digital-hq/issues/311) remains the reconciliation authority. HQ contains a prepared read-only gateway plan and payload; no live record or schema has been validated, and no update executed. Owner requested pending preparation because no production access was provided. Field mapping and audited apply must follow the established authenticated database gateway workflow after canonical record validation.

No `smashpro-web` change is required: the existing equipment showroom/passport routes and WordPress image URL are reused. No production deployment has been performed.

## Validation

```powershell
npm run typecheck
npm test
npm run build
npm run validate:index
npm run test:attachments:browser
git diff --check
```

Browser checks cover the built physical passport route at 1440px and 390px, real image decoding, the gallery dialog including Escape, manufacturer-reference decoding, ten missing slots, pending commissioning, planned testing, no horizontal overflow, and one correct showroom passport link. Screenshots are saved under `tmp/attachments-browser-results/`.
