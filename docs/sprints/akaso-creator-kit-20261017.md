# AKASO Creator Kit thumbnails and shopping

Branch: feat/akaso-creator-kit-shopping-20261017 (both repositories).

## Implementation and boundaries

The existing passport public_identity_json remains the source of kit membership,
ownership grouping, ordering, product associations and reviewed media metadata.
Existing spd_affiliate_products records own product identity, destination and
image URLs. No table, parallel catalog or direct production database connection
was introduced. spd_partnership_assets is an outreach/proof-asset collection;
it is not used as a second product registry. No imported Awin product feed exists.

The public API resolves explicit kit associations, catalog editorial approval,
the existing Equipment media-property grants, and image-specific rights/visibility.
It projects only public fields. The product records remain hidden from general
Gear publication (public_visible=0); the kit-specific approval grants only this
passport. Garage has no permission or placement changes.

Camera product 1 and its existing approved Awin link/image are reused without
rewriting tracking bytes. Four manufacturer detail URLs are labeled non-affiliate.
No new Awin parameters or Amazon Associates relationship is invented.
Pending/withdrawn images produce a stable fallback. Future card lifecycle states
Concept, Prototype and Testing cannot expose a purchase CTA; Available does not
create a destination by itself. Existing canonical MicroFab modules and their
compatibility/publication gates are preserved.

## Registered records and source review

Registration: 2026-10-17-creator-kit-products-v1.
Passport 4, canonical camera product 1, media property 1, campaign 3,
existing camera placement 8 (equipment.media.sp-med-cam-001).
Schema migrations: none.

| Product | Catalog record | Image | Link |
| --- | --- | --- | --- |
| Creator Combo | 1 (existing) | Existing approved Awin creative 4587303 | Existing approved Awin |
| 120cm invisible selfie stick | 3 | Manufacturer reference, hidden | Verified manufacturer details |
| Rechargeable batteries | 4 | Manufacturer reference, hidden | Verified battery variant details |
| Battery charging case | 5 | Manufacturer reference, hidden | Verified charger variant details |
| Carrying case | 6 | Manufacturer reference, hidden | Verified manufacturer details |
| Protective pouch | 7 | No verified standalone image | No verified standalone destination |
| SanDisk Extreme 256GB microSDXC | Existing kit membership | Exact revision/image unresolved | No verified exact-model shopping URL |

The official [Creator Combo page](https://shopakaso.com/products/akaso-360)
confirms bundle membership; separate purchases remain separate.
The [manufacturer accessory collection](https://shopakaso.com/collections/akaso-360-camera-accessories)
provides product/variant metadata. Source references, image dimensions, alt text
and inspection timestamps are recorded in creator-kit-products.json and the
passport associations. Official photographs were visually inspected unchanged.
They were not copied into public images/ or published.

The existing Awin camera link also resolved to HTTP 200 on shopakaso.com with publisher 3121518 preserved. Redirect success is not commission-attribution proof.

All four exact manufacturer URLs in the registration manifest returned HTTP 200.
The battery-only variant was unavailable at inspection, so it receives View details,
not a purchase/availability claim. The pouch is not replaced by the hard case.
The SanDisk family has multiple revisions; no arbitrary SKU or Amazon image is used.

## Image permissions still outstanding

The production promotional grant explicitly covers Awin creative 4587303.
No blanket AKASO accessory-photo license was found. Four verified manufacturer
image references therefore remain rights_status=unverified, visibility=hidden.
An owner question about permission is pending. Approval must be recorded for each
image before publication; do not infer it from manufacturer hosting or affiliate
membership. The local approved-image preview is a TEST FIXTURE, not a public grant.

## Registration verification

The established /api/migrations.php admin-key gate was used with a fixed scoped
include. Anonymous request returned 401. Reviewed plan hash required before writes.
No arbitrary SQL request payload is supported. Temporary include and dispatch
were removed and the gateway restored byte-for-byte.
The first repeat check exposed MySQL JSON object-key reordering; canonical comparison
fixed it. Two subsequent applies returned identical product IDs and identical plan
hashes, without duplicates. Readback confirms five hidden catalog additions,
existing grouping preserved, no new affiliate links and no Garage grants.

## Validation and release

- Equipment: 159 unit tests; TypeScript; production build; index/media/passport
  validation; protected ARDHI artifact check.
- Browser: 13 tests pass, including 390/768/1440 product grids, approved images,
  fallbacks, disclosure, safe links, lifecycle gating, Shorts consent/playback
  integration and affiliate withdrawal. The YouTube player is mocked for the
  interaction test; actual streaming is not claimed as newly tested.
- Hero captures at 390/768/1440 were byte-identical before/after the kit change.
  Hero and Shorts source presentation remain unchanged from restoration 722350c.
- PHP 7.4: kit projection/privacy/rights/URL/lease tests, existing passport tests,
  affiliate policy (9), catalog (44), Equipment projection (47), catalog guards (10).
- Existing affiliate-auth test uses PHP 8's str_contains; it passes all 5 guards
  under PHP 8.2. Production changes themselves lint and test under PHP 7.4.
- Focused changed-file secret scan: no private-key/token patterns or local migration
  credential found. git diff --check passes.

Database registration is applied; public API and Equipment changes are NOT deployed.
This brief does not request a merge or production deployment. Equipment branch includes the
previous hero restoration commit, which also has not been deployed.
When authorized: deploy the scoped HQ _media_equipment.php API file first, verify
the public projection and permissions, then use the existing Equipment workflow
with shipment_release=false. No Railway dependency is introduced. Preserve existing
affiliate/creative permissions; a dashboard deployment alone does not publish API files.

## Changed implementation files

Equipment: src/components/CreatorKitCard.tsx, src/domain/mediaEquipment.ts,
src/pages/MediaEquipmentPassportPage.tsx, src/styles/media-equipment.css,
media browser/domain tests, fixtures, release captures and this documentation.

Digital HQ: dashboard/api/_media_equipment.php; ops/media-passports/
gateway-kit-inspect.php, gateway-kit-register.php, creator-kit-products.json,
test-kit.php; this documentation and sanitized registration receipt.

Production readback after registration: existing hq passport API HTTP 200 with seven kit entries; Garage property request HTTP 400. Public API code was not deployed.
