> Historical release record. The November 13 security remediation supersedes the original gallery/identity references below. Restricted captures and original plates are preserved privately; current public gallery uses six approved photos, including a separately masked plate derivative. Historical Git copies remain exposed.

# Loflin grapple receiving passport V3.1

The existing `SP-ATT-GRP-001` passport / `SP-GRP-ARDHI-01` asset represents serial **Restricted identity retained in Digital HQ**, model **SMPRMINIRG**, manufactured **October 22, 2026**, physically received **November 11, 2026**. No second attachment record is created.

## Public truth and readiness

- Passport: **Received · Identification Verified · Commissioning Pending**.
- Showroom: **Received · Commissioning Pending**, linking once to `/equipment/attachments/sp-att-grp-001/`, whether featured or in a category.
- Physical plate maximum: **3,200 PSI**, superseding preliminary 3,500 PSI procurement guidance. Factory sticker: **TESTED 3200 PSI**. This is not an operational commissioning test.
- Mount: **TORODINGO**; planned host **SP-ARDHI-26**, not verified physical fitment.
- Manufacturer attachment specification: **370 lbs**. Estes freight shipment: **one piece, 390 lbs**. Nameplate weight: **blank**. No measured attachment weight is claimed.
- Invoice #292: **$2,297 paid** ($297 September 9, $1,000 October 30, $1,000 November 5); **$0 outstanding**.
- Estes PRO **0178760094**, shipped November 5, received by **ACME Logistics November 9**, delivered to SmashPro **November 11**, **Front Door Service**, Hopkins, South Carolina. Private destination ZIP, label links, payment methods/card data and raw receipt files are not published.

ARDHI's throttle-control repair blocks attachment operation. Physical condition, mount/locking, couplers, hose clearance, leaks, controlled unloaded jaw cycling, operator readiness/safety review and the first brush/debris test all remain pending. Field Test 001 is a plan with no results. No service link or operational activation is added.

## Media

Reused owner-approved WordPress photo: https://smashpro.app/wp-content/uploads/2026/11/20261111_092910.jpg . It shows the delivered grapple on its timber cradle beside the lowered liftgate and pallet jack. Its actual pixel dimensions were verified as **2000 × 1500** from the existing public file; this is not a WordPress media-record readback. The original is retained without duplicate upload and displayed as the hero, showroom image and receiving gallery entry. No WordPress media ID or original library alt text is known; the descriptive alt text is authored from the reviewed photograph.

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

These are media-slot IDs, not invented filenames. The supplied overview also shows the cradle and liftgate, but is not duplicated into multiple slots to imply eleven distinct images.

### November 11 V3.1 media access audit

The owner reports the additional photographs are already uploaded. WordPress media REST search returned **401 Unauthorized**. An alternate browser lookup of the Media Library redirected to the WordPress login page; no authenticated admin session was available. The owner chose **"Proceed with the current approved photo and document the media blocker"**. No URL is guessed from a filename, and no duplicate media or article is uploaded/created.

The following exact search stems remain unresolved. Their media IDs, source URLs, dimensions and existing alt text cannot be reported without authenticated access or a supplied media export:

| Intended review | Search stems |
| --- | --- |
| Hero comparison | `20261111_092933`, `20261111_092932` |
| Delivery | `delivery-image`, `20261111_092913`, `20261111_093105`, `20261111_093422` |
| Equipment construction | `20261111_092857`, `20261111_093000`, `20261111_093721`, `20261111_093727`, `20261111_093732` |
| Technical evidence | `20261111_093625`, `20261111_093632`, `20261111_093705`, `20261111_093713`, `20261111_093751` |

`20261111_092910` is usable only through the previously supplied public URL above; its media-library ID and original alt text remain unresolved. Comparing `092933` against `092932`, selecting the better hero, reading the public nameplate/sticker photographs and curating 8–10 distinct authentic images are blocked, not complete.

The gallery now has the requested **Delivery**, **Equipment Overview**, **Manufacturer Identification**, and **Mounting and Fitment** groups. Existing public receiving media is preserved. Measurements are explicitly preliminary physical observations, not certified dimensions. Once records are accessible, visually review all images and privacy boundaries before selecting one truck, one unloading, one carrier image, nonredundant overview angles, plate/sticker and mount measurements.

To publish a slot, inspect the authentic owner file, reuse an existing approved media URL when available, exclude private labels/addresses/payment evidence, and set its `image`, descriptive `imageAlt`, caption (`description`) and `status: "verified"` in [attachments data](../src/data/attachments.ts). Verified status here means an approved photograph, not commissioning completion. Entries without an approved image and alt text remain labeled missing. [AttachmentReceiving](../src/components/AttachmentReceiving.tsx) reuses the existing native-dialog gallery. Update the hero and showroom source together in the same attachment record if a better approved product image becomes available.

## Timeline and future videos

The seven verified procurement milestones are visually complete: ordered/deposit September 9; manufactured October 22; fabrication reported October 28; paid November 5; shipped November 5; ACME receipt November 9; physical delivery November 11. Commissioning and first field test are separate pending milestones. The October 30 payment remains in the paid milestone details and financial snapshot.

Two video cards reserve the requested working titles:

- **$2,297 Later... ARDHI's New Grapple Is HERE!** — Video production pending.
- **Can ARDHI Handle This Brush Pile?** — Field test pending.

Neither has a thumbnail, duration, publication date, video ID or URL. No empty player or fabricated link is rendered. After reviewed publication, populate the matching `receiving.videoSlots[].publication` using the existing [EquipmentVideo](../src/types/passportExperience.ts) contract (`equipmentId: "SP-ATT-GRP-001"`, genuine YouTube ID, public visibility, real publication and verification dates), optional reviewed thumbnail and duration. The existing [EquipmentWatch](../src/components/EquipmentWatch.tsx) supplies direct links and a consent-driven optional embed. Private, future-dated, wrong-asset or invalid-ID publication records stay pending. Publication never changes commissioning or field-test status.

## Database and deployment

The passport/showroom still use static repository data. Neither a commit nor a PR mutates production data. [Digital HQ Issue #311](https://github.com/smashpro-digital/digital-hq/issues/311) remains the reconciliation authority. HQ contains a prepared read-only gateway plan and payload; no live record or schema has been validated, and no update executed. Owner requested pending preparation because no production access was provided. Field mapping and audited apply must follow the established authenticated database gateway workflow after canonical record validation.

No `smashpro-web` change is required: the existing equipment showroom/passport routes and WordPress image URL are reused. The owner-authorized Equipment frontend deployment is verified below. Database synchronization remains pending.

### Verified production release / November 11, 2026

- V3 [PR #146](https://github.com/smashpro-digital/smashpro-equipment/pull/146) and incremental V3.1 [PR #147](https://github.com/smashpro-digital/smashpro-equipment/pull/147) merged; V3.1 source commit `171146c9d9f482daf16b0887cab0f4ec187a44d1`.
- Deployed main commit: `60094ab340cb72f39160126dff23fd0c70d71eb1`.
- [Manual deployment run 43069152131](https://github.com/smashpro-digital/smashpro-equipment/actions/runs/43069152131) succeeded: required validation and incremental FTP publish to the established Equipment directory. Shipment, ARDHI-delivery and AKASO feature-release flags remained false. Upload completed at 17:34 UTC.
- Prior successful production run `42805205604`, commit `eecb59d58be0067687616bbf30caaf78be536e8f`, was retained privately for rollback. Prior normal-URL passport HTML SHA-256 `06e92ad2ca8f03b1f71bf5bf0ad46e3185bf398166a090f050c9ccd79f31263b` and four compressed live JS/CSS asset hashes matched that retained artifact before deployment.
- Initial browser acceptance saw stale Brotli HTML while gzip served the new shell. Only Equipment home and grapple HTML were revalidated with `Cache-Control: no-cache` / `Pragma: no-cache` using Chromium. A separate fresh browser then verified the normal, query-free production URLs at **1440px and 390px**, using uploaded `main-ChFOl7EN.js` / `main-CyvXeQnS.css`. No successful proxy response, query-busted page or cache-bypassing context was used as final acceptance.
- Live acceptance passed: serial/model/3,200 PSI; seven completed procurement milestones including November 9 ACME receipt; two pending operational milestones; nine pending commissioning checks; two pending video cards with no player; four gallery groups; real-image decoding, native dialog and Escape; manufacturer reference; preliminary measurement disclaimer; ten missing media slots; no horizontal overflow or JavaScript page errors; exactly one correct showroom passport link sharing the approved photo.
- Local validation passed: **211 unit tests**, TypeScript, production build, **2 responsive browser tests**, public index/media/passport artifact checks and `git diff --check`. HQ pending planner syntax and ten PHP contract checks also passed.
- [Digital HQ PR #312](https://github.com/smashpro-digital/digital-hq/pull/312) contains the prepared reconciliation plan and V3.1 follow-through commit `bef0600`; no live database inspection/apply or gateway installation occurred. [Issue #311 release receipt](https://github.com/smashpro-digital/digital-hq/issues/311#issuecomment-6802905522) retains the audit/status boundary.

Remaining blockers: WordPress media authentication/records, preferred hero comparison and curated distinct-photo integration; canonical live database validation and audited apply; all commissioning/safety/first-field-test requirements. The public frontend is deployed, not an operationally released grapple.

## Validation

```powershell
npm run typecheck
npm test
npm run build
npm run validate:index
npm run test:attachments:browser
git diff --check
```

Browser checks cover the built physical passport route at 1440px and 390px, real image decoding, the gallery dialog including Escape, manufacturer-reference decoding, four gallery groups, ten missing slots, seven completed procurement milestones, two pending operational milestones/video cards, no empty player, pending commissioning, planned testing, no horizontal overflow, and one correct showroom passport link. Screenshots are saved under `tmp/attachments-browser-results/`.
