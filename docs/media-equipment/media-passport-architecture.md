# Media Equipment Passports

Media passports use the Equipment React/Vite application and its existing header, navigation, footer, tokens, and physical `.html` routes. They are distinct from heavy-equipment passports. The first route is `/equipment/sp-med-cam-001.html`.

## Authority and relationships

Digital HQ owns the physical asset (`spd_tech_equipment`) and its acquisition (`spd_inventory_purchases` plus `spd_inventory_purchase_items`). The public passport table references that asset, the existing Equipment media property, and the existing affiliate product. Procurement amounts, serials, supplier transactions, storage paths, and maintenance notes never enter the public projection.

`spd_media_capture_provenance` associates existing `spd_campaign_content` records with the actual capture device, optional subject equipment, project reference, capture date, and rights/provenance review. It does not replace the content registry. Capture device and subject equipment are different identities. Published YouTube videos and Shorts are supported in this initial consumer; original clips remain unpublished until a separately reviewed source-host policy exists. No supplier portrait video is included.

`spd_media_equipment_accessories` links existing MicroFab product modules to a passport. Family and module publication, verified compatibility, and an approved association are all required. Revision, material, manufacturing method, prototype/testing status are projected explicitly. No products are seeded merely to populate the page. Pricing and inventory are `not_offered`; commerce is disabled until a canonical storefront integration, rights, inventory, fulfillment, and warranty review are implemented. This release does not create a second product catalog.

## Public API and affiliate gates

`GET /dashboard/api/public_media_equipment.php?property=hq&asset=SP-MED-CAM-001` returns an allowlisted, no-store public projection with a 60-second lease. Only approved, visible passports on the active Equipment property and nonarchived canonical assets qualify. Garage and arbitrary query parameters are rejected. Failures return no inventory data.

The existing affiliate catalog adds scope `equipment.media.sp-med-cam-001`, authorized only for the camera's exact canonical URL. Existing program, permission, product, verified tracking-link, placement, and official-image gates remain in force. The React consumer validates the original Awin identity and destination without rewriting tracking URLs. Revoked affiliate authorization removes the purchase CTA; it does not invent a fallback commercial URL. Public information refreshes every 15 seconds and is removed on lease expiry, visibility changes, or API failure.

Kit concepts distinguish affiliate camera purchases, proposed direct MicroFab accessories, and future resale bundles. They are not inventory kits, preorders, or checkout offers.

## Analytics and extension

Existing `dataLayer` events record passport views, affiliate clicks, accessory interest, kit interest, and outbound video opens with Equipment, asset, placement, and campaign attribution. No contact data is collected. Video opens are not playback-completion measurements, and clicks are not sales. Awin remains the commission authority.

To add another media device, reconcile its canonical asset first; approve a public passport association, exact affiliate consumer scope if applicable, and corresponding frontend identity policy/physical HTML entry. Reuse this projection and page structure. Do not copy private records into frontend fixtures. Additional approved footage and compatible modules can then be published through HQ without frontend redeployment.

## Release and rollback

Use dedicated branches in Digital HQ and Equipment. Schema inspection, fixed idempotent migration includes, and record registration run behind the existing authenticated `/api/migrations.php` gateway using local configuration. No direct remote database connection or new administrative endpoint is introduced. The owner explicitly waived database backups; none were made. Schema DDL is additive and MySQL 5.7-compatible. Record writes are transactional; retries reconcile exact identities and migration checksums.

Deploy scoped HQ API files first through the existing FTP deployment configuration and verify uploaded hashes. Dashboard deployment alone does not deploy API files. Temporary migration includes are removed and the existing gateway is restored after each operation. Source-file rollback restores the previous API files; additive canonical records should be retained and public authorization withdrawn through authenticated administration if necessary. Do not use destructive down migrations.

After public API verification, merge the tested Equipment change and dispatch its existing `Build and Deploy Equipment Showroom` workflow on main with the AKASO release check. Validate direct loads, refresh, approval withdrawal, API failure, 390/768/1440 layouts, tracking/disclosure, and unchanged heavy-equipment routes. Keep commit, workflow success, public readback, and browser evidence separate.
