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
