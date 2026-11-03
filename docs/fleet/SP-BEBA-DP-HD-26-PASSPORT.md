# SP-BEBA-DP-HD-26 Equipment Passport

> **Status as of November 2, 2026:** Provisional, dealer-stock candidate; **not ordered, reserved, acquired, delivered, registered, commissioned or available to book**. No immutable SPP number has been allocated. The `-26` fleet suffix assumes commissioning in 2026; if the unit first enters service in 2027, reconcile to `-27` before assigning a permanent Passport identity.
>
> **Public renderer:** [data-driven preview](https://smashpro.app/equipment/sp-beba-dp-hd-26.html), routed by the shared `GenericPassportRoute` and `EquipmentPassport`. The preview is intentionally `noindex` and excluded from the public showroom/index/sitemap until an acquisition/publication approval. Merge and deployment are not implied by this file.
>
> **Canonical data source (current phase):** [`src/data/bebaDumpPassport.json`](../../src/data/bebaDumpPassport.json), a normalized, build-time **public-safe candidate projection** with asset, build, lifecycle, specification, provenance and media rows. Do not treat this JSON as a verified live HQ database record. Future HQ persistence is to use only the established authenticated migrations/application endpoints and private-to-public projection.

## Identity

| Field | Record | Provenance |
| --- | --- | --- |
| Provisional fleet identity | `SP-BEBA-DP-HD-26` | SmashPro allocation, candidate only |
| Passport ID | **Not allocated** | Do not manufacture an `SPP-` identifier |
| Asset class | 14K heavy-duty dump trailer | 14,000-lb GVWR attributed to dealer; VIN certification pending |
| Manufacturer | Cynergy Cargo | Kinema listing |
| OEM model | 7X14TA tandem-axle dump | Kinema listing |
| Dealer | Kinema Trailer Depot, Douglas, GA | [Public stock listing](https://kinematrailerdepot.com/product/new-cynergy-cargo-7x14ta-dump-trailer-3/) |
| Stock # / color | **64598 / Lime Green** | Dealer and public listing |
| Acquired / owned / delivered | **No** | No completion or payment evidence |
| SmashPro graphics | Proposed black/green/purple fleet treatment | Mockups are creative concepts, not physical equipment evidence |
| Finish match to ARDHI | Not verified | A visual match does not establish RAL 6018 |

This candidate is separate from **`SP-BEBA-HD-26`**, the earlier conventional 7×20 heavy equipment-trailer project. Never merge those records.

## Specification Verification

Terms: **dealer-listed** = explicit public listing; **dealer-reported** = Jose's communication; **pending verification** = physical/VIN evidence not reviewed; **field validated** = tested by SmashPro with documented result.

| Feature | Current value | Verification status |
| --- | --- | --- |
| Nominal body | 7 ft × 14 ft | Dealer-listed; tape pending |
| Usable bed | Approx. 7 ft × 13.5 ft | Dealer-reported; tape pending |
| **Wall height** | **4 ft (48 in)** on the **lime-green Cynergy unit #64598** | **Publicly dealer-listed; physical measurement pending** |
| Competing black trailer | **2-ft walls** | Separate alternative; **not** a spec of BEBA #64598 |
| Certified GVWR | 14,000 lb | Dealer-reported; VIN/GVWR plate pending |
| Axles | Tandem 7,000 lb | Dealer-reported; GAWR plate pending |
| Empty weight | Approx. 5,200 lb | Dealer-reported; weighbridge/scale ticket pending |
| Rated payload | Approx. 8,800 lb (GVWR less tare) | Dealer-reported; subject to certification and loading conditions |
| Loading ramps | Underbody; 10,500 lb **distributed combined** rating reported | Geometry, loading angles, attachments and WLL documentation pending |
| Tie-down anchors | Four D-rings reported | Locations, hardware and working load limits pending |
| Hoist | Three-stage telescopic; 12,000-lb reported rating | Dealer-listed lift type; hoist rating verification pending |
| Body / rear gate | 7-gauge floor/wall plate, barn doors, spreader gate | Dealer listing; exact mechanism inspection pending |
| Tires | 14 ply | Dealer listing; sizes and tire load limits pending |
| Brakes | Electric both axles, breakaway reported | Dealer confirmation; operational inspection pending |
| Tarp | Manual tarp reported | Check hardware/operation on exact unit |
| Tongue jack / spare | No electric-jack retrofit confirmed; matching wheel may be bought later | Stock fitment and accessory purchase separate; **not financed as a confirmed option** |

A 10,500-lb ramp rating or 12,000-lb hoist rating **does not raise the 8,800-lb stated trailer payload**. Preserve separate load paths, concentration, ramp/axle/tongue limits and certification label.

## Acquisition and operational gates

1. **Candidate recorded:** Public Kinema listing and owner comparison correction documented.
2. **Dealer review (current):** Review Jose's promised actual-unit photos/video, VIN/GVWR plate, ramp deployment, 4-ft walls, D-rings, gate, tarp and hitch. No automatic approval from stock photographs.
3. **Reservation/contract:** Confirm exact unit, refund rules, entity/title/registration terms, remaining down payment and first monthly due date in the private Hopkins agreement. No payment is recorded.
4. **Delivery:** Dealer delivery to the South Carolina service location. The inoperable F-150 is permitted for the dealer's **stationary coupling/registration photo**, not as a road tow vehicle.
5. **Registration and commissioning:** Physical receiving inspection, brake/breakaway/light check, load rating plate and valid tow vehicle before road use.
6. **Field validation:** ARDHI loading requires measured ramp width/angle/traction, track contact, restraints, tongue loading, equipment mass, trailer payload margin and an appropriate tow vehicle. Do not push or tow a 5,200-lb trailer with ARDHI based on unverified capability.

## Media provenance and publication boundary

The seven gallery image URLs in the JSON come directly from the [Kinema listing](https://kinematrailerdepot.com/product/new-cynergy-cargo-7x14ta-dump-trailer-3/), attributed to the dealer. They are **external source references**, not files uploaded to SmashPro's owned media archive. The imagery is neither a VIN-specific inspection nor a claim of SmashPro ownership or physical delivery. Confirm republication/derivative rights before promoting to general public marketing or hosting local copies.

Actual dealer walkaround and eventual receiving/field photos require original source, capture date, publication rights and inspected status before replacing reference media. Concept renders and SmashPro promotional mockups are not acceptance evidence.

## Data model and HQ handoff

- The reusable `dealer_stock` template defines acquisition-specific sections, stages and pending media/document categories; no new trailer-specific JSX renderer is created.
- The public Passport route is assembled from the common `CanonicalPassport` data contract, passed through `projectPassportPublicRecord`. Public media/specification records carry stable IDs, source URLs, source state and asset ownership.
- The candidate is **not** an owned `spd_spgo_fleet_assets` row and must not be inserted there as active/available before contractual ownership and approved operational reconciliation.
- Digital HQ source of truth for commercial agreements remains protected. No price, down payment, lender details, emails, personal identifiers or payment dates are in the public JSON.
- Before creating production database tables or importing this record, inspect the deployed, authenticated `/api/migrations.php` gateway and current production schema, verify authorized backup/recovery receipts and inspect a read-only preflight. The repository's `docs/sql/equipment_passport_v1.sql` is a **proposal**, not proof of deployed tables, and its MySQL 8 assumptions must be reconciled with the documented MySQL 5.7 host.
- When approved schema and API exist, import the same stable `asset`, `build` and `records` rows through a fixed scoped operation. Project a reviewed, allowlisted public snapshot into the renderer; never add a second fleet registry or generic raw-SQL HTTP interface.

## Related records

- [Procurement decision and private-evidence boundaries](SP-BEBA-DP-HD-26-PROCUREMENT.md)
- [Conventional equipment trailer project — separate](SP-BEBA-HD-26-PASSPORT.md)
- [Shared Passport automation architecture](../passport-automation-v1.md)
- [Digital HQ equipment/fleet architecture](https://github.com/smashpro-digital/digital-hq/blob/main/docs/equipment-job-lifecycle-architecture.md)

**Open evidence:** Physical stock walkaround; wall/bed/ramp measurements; true VIN and certified GVWR; coupler and tire ratings; loaded/unloaded ramp geometry and D-ring WLL; warranty/operator manual; delivery and registered tow vehicle; approved public media rights; deposit/contract/payment schedule; owned-fleet commissioning.
