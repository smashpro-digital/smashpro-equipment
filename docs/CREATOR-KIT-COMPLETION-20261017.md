# Creator Kit product-card completion ? 2026-10-17

Scope: SP-MED-CAM-001, passport 4, equipment 39, media property 1 (Equipment), placement 8, relationship 1. Garage remains excluded. No schema changes or new records.

## Data and evidence

The existing kit contains seven owned items in display order 10?70. Products 1, 3?7 are approved kit associations; accessories remain hidden from the general affiliate catalog (`public_visible=0`). SanDisk remains an editorial owned-kit entry, without a catalog product ID. Ownership comes from the passport, not the generic catalog's recommendation flags.

The missing pouch image was null in both product 7 and its passport media association, not a CSS defect. The authorized official Creator Combo contents photo shows the soft pouch at lower right. It is not the separate hard case. SanDisk has neither an exact owned SKU nor image-reuse evidence; its documented placeholder remains.

The approved canonical camera Awin link targets **Standard Combo 44081902846134**. The owned kit is **Creator Combo 44081902878902**. Preserve the tracking URL byte-for-byte and show this contents distinction in the camera kit note. No commission attribution is inferred from HTTP redirects.

Official Shopify product JSON checked October 17: stick 44352839352502 and charger 44332006670518 are available; battery-only 44332006637750 is unavailable. Availability is a dated observation, not a live stock guarantee. Purchase classification is separate from affiliation. The hard case uses the owner-supplied non-affiliate Amazon URL / ASIN B0G1C14LPK.

## Rules

- Approved canonical affiliate or verified retailer purchase: SHOP NOW.
- Manufacturer destination plus matching, reviewed purchase verification and available variant: SHOP NOW, explicitly non-affiliate.
- Verified manufacturer details without that purchase evidence: VIEW PRODUCT.
- Included accessory without a destination: non-clickable INCLUDED IN COMBO.
- Concept/Prototype/Testing item: non-clickable COMING SOON; no purchase action.
- Other missing destinations: non-clickable Purchase link unavailable.
- Existing IN OUR KIT badges remain independent. Lifecycle badges continue to prevent future products being represented as owned.

## Operations

`ops/media-passports/gateway-kit-completion.php` is a temporary fixed-scope handler behind the established authenticated migration endpoint. It validates the canonical relationship/passport, locks existing records, checks expected prior values, dry-run plan hash, transaction/readback, and accepts identical repeat application. Updates only product 7 image_url and passport 4 public_identity_json. It creates no tables, products, links, permissions, campaigns or media properties. The prior values are retained in the reviewed manifest; restore only those fields if rollback is necessary, using the authenticated endpoint with current-value checks.

The temporary dispatch is installed after the existing admin-key check and removed after use; anonymous requests must return 401. Only `_media_equipment.php` is permanently deployed to the API. Preserve its prior bytes and the last successful Equipment artifact for rollback. Backend readback must pass before frontend release. No dashboard-only deployment is mistaken for API publication.

Keep pending Shorts playback branch e90dd26 out of this release. Hero, Shorts loading behavior, MicroFab and heavy-equipment pages are unchanged.

## Validation and release

Local checks and production evidence are recorded in the Equipment release report. Production release remains pending until both deployments and browser readback complete.
