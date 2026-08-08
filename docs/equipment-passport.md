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
