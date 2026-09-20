# SP Fleet Equipment Passport

## Boundary

The public Vite catalog consumes a public passport projection only. It must never receive purchase records, raw value-history factors, private documents, receipt storage keys, serial numbers marked private, factory costs, upgrade purchase/labor costs, tax, shipping, or customs. CSS hiding is not security.

`admin.html` is an authenticated-client shell, not authentication itself. Production must place it behind the existing admin session and configure `VITE_FLEET_ADMIN_API_URL` to an authenticated server. With no API configured it refuses to claim that a record was saved.

## Public API projection

Return identity, all public factory specifications, public factory options, installed upgrades without private cost fields, calculated packages, public attachments, public timeline events, public media/documents, scores, and only the final `estimated_fleet_value`. Never serialize the valuation inputs.

## Package calculation

Package definitions and required tags live in `equipment_packages` and `equipment_package_rules`. A package qualifies only when active installed upgrades collectively satisfy every required tag. Package membership is derived and should not be manually editable.

## Digital birth certificate

`passport_id` is assigned once using `SPP-YYYY-NNNN`, is independent of Fleet ID and ownership, and is protected by a database trigger. The QR decal resolves to the permanent public equipment URL. The public Window Sticker is print-optimized for letter-size output; “Print / Save PDF” uses the browser's native print-to-PDF workflow so the PDF preserves live verified passport data.

Upgrade ledger rows cannot be deleted. Corrections append a superseding upgrade or change lifecycle status to removed while preserving the original record. Wishlist statuses are `planned`, `ordered`, `in-transit`, and `installed`.

Milestones are separately normalized and may point back to timeline events. Supported keys include first machine, rental, 100 hours, revenue, state worked, YouTube episode, major upgrade, 500 hours, and 1,000 hours. A milestone is displayed only after an achieved event exists.

## Valuation engine

On the server, snapshot each calculation in `equipment_value_history` using:

`max(0, market value + retained factory-option value + retained upgrade value + edition premium - depreciation) × maintenance multiplier × documentation multiplier`

Operating hours influence market value/depreciation. The maintenance and documentation scores must be computed from records, not admin-entered display numbers. Publish only a reviewed snapshot by setting `public_display = 1`; the catalog otherwise shows `Pending`.

## Storage

Uploaded files belong in private object storage. Public documents should use short-lived or deliberately public delivery URLs; private receipts/invoices use opaque storage keys and authorization checks. Validate MIME type, size, and malware status server-side, and store SHA-256 for receipts.

## SP-UMBA-26 allocation and source

The public Equipment catalog allocates `SPP-2026-0003` to fleet name `SP-UMBA-26` and existing Digital HQ operational asset `SP-3DP-001`. OEM identity remains FlashForge AD5X. This entry is a public projection, not a new operational asset. Passport IDs 0001 and 0002 remain unchanged. The build rejects duplicate passport, fleet, operational asset IDs and routes; tests lock these three assignments.

An organization search and current catalog inspection on 2026-09-19 found no prior use of 0003. The repository includes a future SQL schema with unique/immutable identity constraints, but no active passport allocator was found. Merging this catalog entry reserves 0003 in the repository's canonical public catalog; no database allocation or new inventory row is claimed. Never reassign it.

`src/data/umbaPassport.json` is generated from Digital HQ's existing asset with `php scripts/export-microfab-equipment-passport.php`. Source revision: `ceb9ca1461c16b4ac04b33b5dff13c679ec863b1`. Copy only the export, never the operational JSON. Its explicit allowlist and passport-only OEM authorization preserve the existing client projection restrictions. Public readiness remains commissioning; PETG and TPU validation are planned and engineering materials remain blocked. The identity graphic is labeled and is not a photograph.

The permanent route is `/equipment/sp-umba-26.html`, with a physical HTML entry, canonical and OpenGraph URL, sitemap entry, catalog card and generated public index. The reusable CommissioningPassport layout uses the existing site frame and evidence components. Do not generate the physical QR badge until production returns HTTP 200.
