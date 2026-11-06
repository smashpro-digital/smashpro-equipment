# SP-ARDHI-26 Grapple Procurement Record

> Status: Fabrication complete, invoice #292 paid in full 2026-11-05; awaiting dispatch/tracking; not received or commissioned
> Updated: 2026-11-05

## Decision

SmashPro selected and ordered the **42 in Loflin Mini Root Grapple**, part `0012006042`, for SP-ARDHI-26.

This supersedes the earlier candidate-comparison state. The attachment remains unavailable for customer work until it is received, physically fitted, hydraulically tested, commissioned, and released through Digital HQ.

## Supplier and sales channel

- Manufacturer: Loflin Fabrication LLC
- Manufacturer contact: Greg Loflin — greg@loflinfabrication.com — 336-859-4333
- Retail seller: HighWay Attachments | Denton, NC
- Sales email: denton@hwyattach.com
- Equipment Sales: Jordan Peacock; Jason Martin
- Retail order line: 336-490-8146

The September 9 receipt email was sent by the shared HighWay Attachments sales address and signed by both equipment-sales representatives. No individual salesperson should be treated as the sole owner of the order until the written build confirmation identifies one.

## Selected configuration

- Product: Loflin Mini Root Grapple
- Part number: `0012006042`
- Width: 42 in
- Mount: Toro Dingo / Mini Universal
- Finish: standard black
- Finished weight: 370 lb
- Nominal opening: approximately 34 in
- Intended work: brush/vegetation cleanup, uprooted shrubs and roots, storm/property cleanup, limbs/small logs, and irregular debris
- Branding: removable SmashPro identification after delivery

## Commercial record

| Item | Amount / status |
| --- | ---: |
| Grapple | $2,012 |
| Freight to ZIP 29061 | $285 |
| Documented order total | $2,297 |
| Deposit paid 2026-09-09 | $297 |
| October 30 payment | $1,000 |
| November 5 final payment | $1,000 |
| Remaining balance | **$0.00 (PAID IN FULL)** |
| Balance timing | Due when build is complete |
| Lead time | 4–6 weeks |
| Approximate build-completion window | Oct 7–21, 2026 |
| Tax / additional card fee | Final receipt paid in full; no additional amount shown |

The October 7–21 window is calculated from the September 9 order/deposit date and the quoted 4–6 week production estimate. It is a planning range, not a guaranteed shipment or delivery date.

## Historical receipt evidence / September 9, 2026

- Evidence type: HighWay Attachments sales receipt
- Received: 2026-09-09
- Source: email from `denton@hwyattach.com`
- Attachment: four-page PDF
- Verified payment fact: $297 deposit paid
- Verified remaining balance: $2,000

The raw receipt remains private procurement evidence. Public Passport records may show sanitized commercial milestones but must not expose payment-card data, customer addresses, or other sensitive receipt fields.

## Build-documentation request

On 2026-09-09 SmashPro replied in the sales-receipt thread asking HighWay Attachments to document:

- fabrication;
- paint;
- final assembly; and
- the completed grapple before shipment.

The request also stated that HighWay Attachments and Loflin Fabrication would receive credit in resulting SmashPro content. The subsequent September 20 vendor response restricts plant photography and routine build updates. The original request is historical; lack of plant photos is not a procurement blocker.

## Fitment / hydraulic record

- Loflin identified SP-ARDHI-26 as using the Toro Dingo / Mini Universal interface from supplied documentation/photos.
- Grapple requires a reversing auxiliary hydraulic circuit with two lines.
- Loflin stated systems up to approximately 3,500 psi are acceptable.
- SP-ARDHI-26 documented hydraulic pressure is approximately 2,466 psi.
- Loflin stated auxiliary flow is not a deciding fitment factor for this grapple.
- Physical mount fit, coupler connection, hose routing, cylinder/jaw clearance, and controlled cycling remain commissioning checks.

## Historical procurement gates / superseded by November 5 reconciliation

Before final payment or shipment:

1. Obtain written build acknowledgment and any assigned order/invoice number.
2. Confirm the documented $2,297 total is final.
3. Confirm the exact hose and quick-coupler package supplied.
4. Confirm warranty and replacement-parts terms.
5. Record confirmed build-completion and expected ship dates.
6. Reconcile the $2,000 balance request to the receipt/order record.
7. Collect build photos if the vendor agrees.

Before customer activation:

1. Receive and inspect the finished attachment.
2. Verify Toro Dingo / Mini Universal fitment on SP-ARDHI-26.
3. Connect and inspect hydraulic hoses/couplers.
4. Cycle open/close functions under no load and a controlled test load.
5. Verify hose protection and clearance through the lift/tilt range.
6. Record attachment identity, final photos, warranty, and maintenance requirements.
7. Complete operator readiness and Digital HQ compliance/service-release gates.

## Lifecycle

`selected -> ordered/building -> completed -> balance_paid -> shipped -> received -> fitment_verified -> commissioned -> customer_ready`

Current state: **paid_in_full_awaiting_dispatch**. No shipment, tracking, delivery, fitment or commissioning confirmed.

## Final payment evidence — November 5, 2026

HighWay Attachments emailed three-page `img11052026_0001.pdf` confirming invoice #292 marked PAID, $1,000 Visa payment applied, and $0 due. Processor page confirms approval/capture at 09:23:55 EST. Total paid $2,297 across Sept 9 ($297), Oct 30 ($1,000), and Nov 5 ($1,000). Vendor's verbal ~2-day delivery estimate begins after full payment but no delivery date, carrier, dispatch or tracking is confirmed. Public showroom/passport status should say **Paid in full · Awaiting shipment**, not delivered or service-ready. Source: Gmail message `1a1ac1bac8d24560` (private receipt; no card details on public pages).

## V2 public projection / November 5, 2026

Digital HQ `docs/equipment-procurement/SP-ARDHI-26-loflin-mini-root-grapple.md` remains canonical for procurement evidence. The current record is paid in full, $2,297 paid and $0 due; shipment, receipt, fitment and commissioning are pending. Earlier receipt balances and build planning windows above are historical, not current obligations.

The Equipment site uses static `src/data/attachments.ts`, not a live HQ procurement integration. The existing `ordered` lifecycle value is retained; `statusLabel` provides the sanitized commercial substatus in both passport and showroom. No Web integration change is necessary. The official locally served manufacturer photograph is illustrative manufacturer media, not evidence that the purchased unit has been delivered or operated.

Field-test media uses existing `GalleryImage` records and `PassportFactoryGallery`, and existing `EquipmentVideo` records with `EquipmentWatch` publication/verification gates. Slot `mediaIds` reference gallery IDs or video IDs. Publish only reviewed records associated with SP-ATT-GRP-001, with source/date and privacy checks; do not use placeholder URLs or invented timestamps. No approved brush-pile before photos were identified in the reviewed repository records; all evaluation slots remain empty. Commissioning criteria are pending internal checks, not completed work.
